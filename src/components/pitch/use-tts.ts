"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────
// useTTS — unified text-to-speech hook.
//
// Primary provider: Sarvam AI via /api/tts (natural Indian-English).
// Fallback: browser Web Speech API (window.speechSynthesis).
//
// Public API:
//   speak(text): Promise<void>          // resolves on speech end
//   stop()                              // cancels current speech
//   isSpeaking: boolean
//   provider: "sarvam" | "browser" | null
//   voice / setVoice / availableVoices  // for browser fallback only
// ─────────────────────────────────────────────────────────

export type TTSProvider = "sarvam" | "browser";

interface UseTTSOptions {
    sarvamVoice?: string;   // sarvam speaker id; if omitted, server picks per-model default
    rate?: number;          // playback rate (1.0 default)
}

export function useTTS(options: UseTTSOptions = {}) {
    const { sarvamVoice, rate = 1.0 } = options;

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [provider, setProvider] = useState<TTSProvider | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

    // Refs for things we need to cancel on stop()
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const currentAbort = useRef<AbortController | null>(null);
    const currentResolve = useRef<(() => void) | null>(null);
    const cancelledRef = useRef(false);

    // Client-side audio cache: keyed by `${voice}::${rate}::${text}` → array of base64 chunks.
    // Lets us avoid a second /api/tts fetch when slide N+1 was already prefetched.
    const audioCacheRef = useRef<Map<string, string[]>>(new Map());
    // In-flight prefetch promises so we don't kick off duplicates.
    const inFlightRef = useRef<Map<string, Promise<string[] | null>>>(new Map());

    // ── Browser voice list (for fallback) ──────────────────
    useEffect(() => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
        const load = () => {
            const v = window.speechSynthesis.getVoices();
            if (v.length > 0) {
                setVoices(v);
                if (!voice) {
                    const preferred =
                        v.find((x) => /Google US English/i.test(x.name)) ??
                        v.find((x) => /en-IN/i.test(x.lang)) ??
                        v.find((x) => /Samantha/i.test(x.name)) ??
                        v.find((x) => /^en-/i.test(x.lang)) ??
                        v[0];
                    setVoice(preferred);
                }
            }
        };
        load();
        window.speechSynthesis.addEventListener("voiceschanged", load);
        return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
    }, [voice]);

    // ── stop(): cancel everything in flight ───────────────
    const stop = useCallback(() => {
        cancelledRef.current = true;
        if (currentAbort.current) {
            currentAbort.current.abort();
            currentAbort.current = null;
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
            audioRef.current = null;
        }
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
        if (currentResolve.current) {
            currentResolve.current();
            currentResolve.current = null;
        }
        setIsSpeaking(false);
    }, []);

    // ── speakWithBrowser(text): fallback path ─────────────
    const speakWithBrowser = useCallback(
        (text: string): Promise<void> => {
            return new Promise<void>((resolve) => {
                if (typeof window === "undefined" || !("speechSynthesis" in window)) {
                    resolve();
                    return;
                }
                const u = new SpeechSynthesisUtterance(text);
                if (voice) u.voice = voice;
                u.rate = rate;
                u.pitch = 1;
                u.onend = () => {
                    setIsSpeaking(false);
                    resolve();
                };
                u.onerror = () => {
                    setIsSpeaking(false);
                    resolve();
                };
                currentResolve.current = resolve;
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(u);
            });
        },
        [voice, rate]
    );

    // ── fetchSarvam(text): get base64 audio chunks (with cache + de-dupe) ──
    const fetchSarvam = useCallback(
        async (text: string, abort?: AbortController): Promise<string[] | null> => {
            const key = `${sarvamVoice ?? "auto"}::${rate}::${text}`;
            const cached = audioCacheRef.current.get(key);
            if (cached) return cached;

            const inFlight = inFlightRef.current.get(key);
            if (inFlight) return inFlight;

            const promise = (async () => {
                try {
                    const r = await fetch("/api/tts", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text, voice: sarvamVoice, rate }),
                        signal: abort?.signal,
                    });
                    if (!r.ok) return null;
                    const j = (await r.json()) as { audios?: string[] };
                    if (!j.audios || j.audios.length === 0) return null;
                    audioCacheRef.current.set(key, j.audios);
                    return j.audios;
                } catch {
                    return null;
                } finally {
                    inFlightRef.current.delete(key);
                }
            })();

            inFlightRef.current.set(key, promise);
            return promise;
        },
        [sarvamVoice, rate]
    );

    // ── prefetch(text): warm cache for upcoming narration. Fire-and-forget. ──
    const prefetch = useCallback(
        (text: string) => {
            if (!text || !text.trim()) return;
            // Don't await — let the request run in the background.
            fetchSarvam(text).catch(() => {});
        },
        [fetchSarvam]
    );

    // ── speakWithSarvam(text): play base64 chunks sequentially ──
    const speakWithSarvam = useCallback(
        async (text: string, abort: AbortController): Promise<boolean> => {
            // Returns true if played to completion via Sarvam, false to fall back.
            const audios = await fetchSarvam(text, abort);
            if (!audios) return false;

            for (const b64 of audios) {
                if (cancelledRef.current) return true;

                const blob = b64ToBlob(b64, "audio/wav");
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                audio.playbackRate = rate;
                audioRef.current = audio;

                await new Promise<void>((resolve) => {
                    currentResolve.current = resolve;
                    audio.onended = () => {
                        URL.revokeObjectURL(url);
                        resolve();
                    };
                    audio.onerror = () => {
                        URL.revokeObjectURL(url);
                        resolve();
                    };
                    audio.play().catch(() => {
                        URL.revokeObjectURL(url);
                        resolve();
                    });
                });
            }
            return true;
        },
        [fetchSarvam, rate]
    );

    // ── speak(text): public entry point ───────────────────
    const speak = useCallback(
        async (text: string): Promise<void> => {
            stop(); // cancel any prior
            cancelledRef.current = false;

            if (!text || !text.trim()) return;

            setIsSpeaking(true);
            const abort = new AbortController();
            currentAbort.current = abort;

            // Try Sarvam first
            const sarvamOk = await speakWithSarvam(text, abort);
            if (sarvamOk) {
                setProvider("sarvam");
                setIsSpeaking(false);
                return;
            }

            if (cancelledRef.current) {
                setIsSpeaking(false);
                return;
            }

            // Fallback: browser Web Speech API
            setProvider("browser");
            await speakWithBrowser(text);
            setIsSpeaking(false);
        },
        [speakWithSarvam, speakWithBrowser, stop]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => stop();
    }, [stop]);

    return {
        speak,
        prefetch,
        stop,
        isSpeaking,
        provider,
        voice,
        setVoice,
        voices,
    };
}

function b64ToBlob(b64: string, mime: string): Blob {
    const byteChars = atob(b64);
    const byteNums = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
        byteNums[i] = byteChars.charCodeAt(i);
    }
    return new Blob([new Uint8Array(byteNums)], { type: mime });
}
