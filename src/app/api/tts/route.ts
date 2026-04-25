import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────
// /api/tts — Server-side Sarvam AI text-to-speech bridge.
//
// Body: { text: string, voice?: string, rate?: number }
// Response: { audios: string[] } — array of base64 WAV chunks
//           (one per sentence chunk, played in order on client).
//
// Env: SARVAM_API_KEY — keep server-side only. Without it,
// returns 503 so the client falls back to Web Speech API.
// ─────────────────────────────────────────────────────────

const SARVAM_ENDPOINT = "https://api.sarvam.ai/text-to-speech";
const MAX_CHARS_PER_CHUNK = 480; // Sarvam ~500 char limit per input

// In-memory cache (per server instance). Keyed by `${voice}::${text}`.
// For a sales-pitch deck with stable narration, this dramatically
// reduces API calls — same text → same audio → cached after first hit.
const audioCache = new Map<string, string[]>();

// Speakers available per model. v3 has a smaller catalog than v2.
const V3_SPEAKERS = new Set([
    "aditya", "ritu", "ashutosh", "priya", "neha", "rahul",
    "pooja", "rohan", "simran", "kavya", "amit", "dev",
]);
const DEFAULT_V3_SPEAKER = "priya";
const DEFAULT_V2_SPEAKER = "anushka";

interface SarvamAttempt {
    model: "bulbul:v3" | "bulbul:v2";
    speaker: string;
}

function pickSpeaker(requested: string | undefined, model: SarvamAttempt["model"]): string {
    if (requested) {
        if (model === "bulbul:v3" && !V3_SPEAKERS.has(requested)) return DEFAULT_V3_SPEAKER;
        return requested;
    }
    return model === "bulbul:v3" ? DEFAULT_V3_SPEAKER : DEFAULT_V2_SPEAKER;
}

function buildSarvamBody(chunk: string, attempt: SarvamAttempt, rate: number) {
    const base = {
        inputs: [chunk],
        target_language_code: "en-IN",
        speaker: attempt.speaker,
        pace: rate,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: attempt.model,
    };
    // v3 doesn't accept pitch/loudness; v2 does.
    if (attempt.model === "bulbul:v2") {
        return { ...base, pitch: 0, loudness: 1.0 };
    }
    return base;
}

async function fetchOneChunk(
    chunk: string,
    attempt: SarvamAttempt,
    rate: number,
    apiKey: string,
): Promise<string[]> {
    const r = await fetch(SARVAM_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-subscription-key": apiKey,
        },
        body: JSON.stringify(buildSarvamBody(chunk, attempt, rate)),
    });
    if (!r.ok) {
        const errText = await r.text();
        throw new Error(`Sarvam ${attempt.model} ${r.status}: ${errText.slice(0, 300)}`);
    }
    const j = (await r.json()) as { audios?: string[] };
    return j.audios ?? [];
}

function chunkText(text: string, max = MAX_CHARS_PER_CHUNK): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
    const chunks: string[] = [];
    let buf = "";
    for (const s of sentences) {
        const trimmed = s.trim();
        if ((buf + " " + trimmed).length > max && buf.length > 0) {
            chunks.push(buf.trim());
            buf = trimmed;
        } else {
            buf = buf ? `${buf} ${trimmed}` : trimmed;
        }
    }
    if (buf.trim().length > 0) chunks.push(buf.trim());
    return chunks;
}

export async function POST(req: NextRequest) {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "SARVAM_API_KEY not configured", fallback: "browser" },
            { status: 503 }
        );
    }

    let body: { text?: string; voice?: string; rate?: number };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const text = (body.text ?? "").trim();
    const requestedVoice = body.voice;
    const rate = typeof body.rate === "number" ? body.rate : 1.0;

    if (!text) {
        return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    // Try v3 first, then v2. Cache key is per-text only — we don't care which
    // model produced the audio since callers don't either.
    const cacheKey = `${requestedVoice ?? "auto"}::${rate}::${text}`;
    const cached = audioCache.get(cacheKey);
    if (cached) {
        return NextResponse.json({ audios: cached, cached: true });
    }

    const chunks = chunkText(text);
    const attempts: SarvamAttempt[] = [
        { model: "bulbul:v3", speaker: pickSpeaker(requestedVoice, "bulbul:v3") },
        { model: "bulbul:v2", speaker: pickSpeaker(requestedVoice, "bulbul:v2") },
    ];

    let lastError: string | null = null;

    for (const attempt of attempts) {
        try {
            // Parallelize chunk fetches within an attempt.
            const results = await Promise.all(
                chunks.map((chunk) => fetchOneChunk(chunk, attempt, rate, apiKey))
            );
            const audios = results.flat();
            audioCache.set(cacheKey, audios);
            return NextResponse.json({
                audios,
                cached: false,
                model: attempt.model,
                speaker: attempt.speaker,
            });
        } catch (err) {
            lastError = err instanceof Error ? err.message : String(err);
            // Fall through to next attempt.
        }
    }

    // Both Sarvam attempts failed → tell the client to use browser TTS.
    return NextResponse.json(
        {
            error: "All Sarvam models failed",
            detail: lastError,
            fallback: "browser",
        },
        { status: 502 }
    );
}
