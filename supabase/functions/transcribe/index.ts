// Katha "transcribe" helper: turns a short spoken Sinhala recording into text with
// Azure Speech, for grading speaking exercises.
//
// - Only signed-in Katha users can call it (checked against Supabase Auth).
// - Each call reserves seconds against daily/monthly caps (public.reserve_speech_seconds_for,
//   callable only with the service role)
//   so usage stays inside Azure's free tier.
// - The Azure key lives only in this function's secrets (AZURE_SPEECH_KEY).
//
// Request:  POST /functions/v1/transcribe?lang=si-LK   body: 16 kHz mono 16-bit WAV (≤ 12 s)
// Response: { text, alternatives: [{text, lexical, confidence}], seconds, engine }

const REGION = Deno.env.get("AZURE_SPEECH_REGION") ?? "westus2";
const KEY = Deno.env.get("AZURE_SPEECH_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const ANON = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const MAX_BYTES = 16000 * 2 * 12 + 4096;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

type Result = { ok: boolean; retry?: boolean; error?: string; engine?: string; text?: string; alternatives?: unknown[]; status?: string };

async function shortAudio(audio: Uint8Array, rate: number, lang: string): Promise<Result> {
  const url = `https://${REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1` +
    `?language=${lang}&format=detailed&profanity=raw`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": KEY,
      "Content-Type": `audio/wav; codecs=audio/pcm; samplerate=${rate}`,
      Accept: "application/json",
    },
    body: audio,
  });
  if (!res.ok) {
    return { ok: false, retry: ![401, 403, 429].includes(res.status), error: `Azure ${res.status}: ${(await res.text()).slice(0, 200)}` };
  }
  const d = await res.json();
  if (d.RecognitionStatus === "Success") {
    const nb = Array.isArray(d.NBest) ? d.NBest : [];
    return {
      ok: true, engine: "short", text: d.DisplayText ?? nb[0]?.Display ?? "",
      alternatives: nb.slice(0, 5).map((n: Record<string, unknown>) => ({ text: n.Display, lexical: n.Lexical, confidence: n.Confidence })),
    };
  }
  if (d.RecognitionStatus === "NoMatch" || d.RecognitionStatus === "InitialSilenceTimeout") {
    return { ok: true, engine: "short", text: "", alternatives: [], status: d.RecognitionStatus };
  }
  return { ok: false, retry: true, error: `Azure status ${d.RecognitionStatus}` };
}

async function fastTranscription(audio: Uint8Array, lang: string): Promise<Result> {
  const fd = new FormData();
  fd.append("audio", new Blob([audio], { type: "audio/wav" }), "speech.wav");
  fd.append("definition", JSON.stringify({ locales: [lang] }));
  const res = await fetch(
    `https://${REGION}.api.cognitive.microsoft.com/speechtotext/transcriptions:transcribe?api-version=2024-11-15`,
    { method: "POST", headers: { "Ocp-Apim-Subscription-Key": KEY }, body: fd },
  );
  if (!res.ok) return { ok: false, error: `Azure fast ${res.status}: ${(await res.text()).slice(0, 200)}` };
  const d = await res.json();
  const text = (d.combinedPhrases ?? []).map((p: { text: string }) => p.text).join(" ").trim();
  return { ok: true, engine: "fast", text, alternatives: [] };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json(405, { error: "POST only" });
  if (!KEY) return json(503, { error: "Speech checking isn't set up yet (missing Azure key)." });

  const auth = req.headers.get("Authorization") ?? "";
  const apikey = req.headers.get("apikey") || ANON;
  if (!auth.startsWith("Bearer ")) return json(401, { error: "Sign in to check your speaking." });
  const who = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { Authorization: auth, apikey } });
  if (!who.ok) return json(401, { error: "Please sign in again." });
  const user = await who.json();
  if (!user?.id) return json(401, { error: "Please sign in again." });

  const lang = new URL(req.url).searchParams.get("lang") || "si-LK";
  if (!/^[a-z]{2,3}-[A-Z]{2}$/.test(lang)) return json(400, { error: "Bad language code." });

  const audio = new Uint8Array(await req.arrayBuffer());
  if (audio.length < 2000) return json(400, { error: "That recording was too short." });
  if (audio.length > MAX_BYTES) return json(413, { error: "That recording was too long." });
  const tag = (a: number, b: number) => String.fromCharCode(...audio.slice(a, b));
  if (tag(0, 4) !== "RIFF" || tag(8, 12) !== "WAVE") return json(415, { error: "Expected a WAV recording." });
  const view = new DataView(audio.buffer, audio.byteOffset, audio.byteLength);
  const sampleRate = view.getUint32(24, true);
  const byteRate = view.getUint32(28, true) || 32000;
  const seconds = Math.min(15, Math.max(0.5, Math.round(((audio.length - 44) / byteRate) * 10) / 10));

  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/reserve_speech_seconds_for`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SERVICE}`, apikey: SERVICE, "Content-Type": "application/json" },
    body: JSON.stringify({ uid: user.id, secs: seconds }),
  });
  if (!r.ok) return json(500, { error: "Couldn't check today's speaking allowance.", detail: (await r.text()).slice(0, 200) });
  const [usage] = await r.json();
  if (!usage?.allowed) {
    return json(429, { error: "You've reached today's speaking-check limit. It resets tomorrow.", today: usage?.today_seconds, month: usage?.month_seconds });
  }

  let out = await shortAudio(audio, sampleRate, lang);
  if (!out.ok && out.retry) out = await fastTranscription(audio, lang);
  if (!out.ok) return json(502, { error: "The speech service didn't answer. Try again in a moment.", detail: out.error });

  return json(200, {
    text: out.text ?? "", alternatives: out.alternatives ?? [], status: out.status ?? "Success",
    engine: out.engine, seconds, today: usage.today_seconds, month: usage.month_seconds,
  });
});
