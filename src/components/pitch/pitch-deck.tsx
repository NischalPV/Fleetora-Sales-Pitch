"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car } from "lucide-react";
import { ProgressBar } from "./shared/progress-bar";
import { Controls } from "./controls";
import { useTTS } from "./use-tts";
import { SCRIPT_BY_ID } from "./slide-scripts";
import { S01Hero } from "./screens/s01-hero";
import { S02Intro } from "./screens/s02-intro";
import { S03CmdBar } from "./screens/s03-cmd-bar";
import { S04Customer } from "./screens/s04-customer";
import { S05Checkout } from "./screens/s05-checkout";
import { S06LivingBooking } from "./screens/s06-living-booking";
import { S07Pos } from "./screens/s07-pos";
import { S09FleetMap } from "./screens/s09-fleet-map";
import { S10HqCockpit } from "./screens/s10-hq-cockpit";
import { S11FleetBrain } from "./screens/s11-fleet-brain";
import { S12Rebalance } from "./screens/s12-rebalance";
import { S13Predict } from "./screens/s13-predict";
import { S14Maintenance } from "./screens/s14-maintenance";
import { S15Corporate } from "./screens/s15-corporate";
import { S16Invoicing } from "./screens/s16-invoicing";
import { S17Payments } from "./screens/s17-payments";
import { S18PriceCompiler } from "./screens/s18-price-compiler";
import { S18FinanceWs } from "./screens/s18-finance-ws";
import { S19AddonsMarketplace } from "./screens/s19-addons-marketplace";
import { S19VehicleMarketplace } from "./screens/s19-vehicle-marketplace";
import { S19Roadmap } from "./screens/s19-roadmap";
import { S20Close } from "./screens/s20-close";

// Placeholder for slides not yet built
function Placeholder({ title, num, journey }: { title: string; num: number; journey: string }) {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 bg-slate-950">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-600 mb-2">{journey}</p>
            <p className="text-xs text-slate-700 mb-4">Slide {num} / 20</p>
            <h2 className="text-2xl font-bold text-slate-500">{title}</h2>
        </section>
    );
}

const SCREENS = [
    // Journey 1: The Hook
    { id: "hero", Component: S01Hero },
    { id: "intro", Component: S02Intro },
    // Journey 2: The Counter (Branch Staff story)
    { id: "cmd-bar", Component: S03CmdBar },
    { id: "customer", Component: S04Customer },
    { id: "checkout", Component: S05Checkout },
    { id: "living-booking", Component: S06LivingBooking },
    // Journey 3: The Operations Floor (Franchise Head story)
    { id: "pos", Component: S07Pos },
    { id: "fleet-map", Component: S09FleetMap },
    { id: "hq-cockpit", Component: S10HqCockpit },
    // Journey 4: The Intelligence (AI story)
    { id: "fleet-brain", Component: S11FleetBrain },
    { id: "rebalance", Component: S12Rebalance },
    { id: "predict", Component: S13Predict },
    { id: "maintenance", Component: S14Maintenance },
    // Journey 5: The Money (Finance story)
    { id: "corporate", Component: S15Corporate },
    { id: "invoicing", Component: S16Invoicing },
    { id: "payments", Component: S17Payments },
    { id: "price-compiler", Component: S18PriceCompiler },
    { id: "finance-ws", Component: S18FinanceWs },
    // Chapter VI: The Marketplace
    { id: "addons-marketplace", Component: S19AddonsMarketplace },
    { id: "vehicle-marketplace", Component: S19VehicleMarketplace },
    // Journey 7: The Future
    { id: "roadmap", Component: S19Roadmap },
    { id: "close", Component: S20Close },
];

// Different transition per journey
const JOURNEY_TRANSITIONS = [
    // Journey 1: The Hook — subtle fade
    { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    { initial: { opacity: 0, filter: "blur(8px)" }, animate: { opacity: 1, filter: "blur(0px)" }, exit: { opacity: 0 } },
    // Journey 2: The Counter — slide right (progressing through a flow)
    { initial: { opacity: 0, x: 80 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -80 } },
    { initial: { opacity: 0, x: 80 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -80 } },
    { initial: { opacity: 0, x: 80 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -80 } },
    { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.1 } },
    // Journey 3: Operations Floor — zoom in (going deeper)
    { initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.1 } },
    { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -40 } },
    { initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0 } },
    // Journey 4: Intelligence — fade with blur (mystery/reveal)
    { initial: { opacity: 0, filter: "blur(12px)" }, animate: { opacity: 1, filter: "blur(0px)" }, exit: { opacity: 0, filter: "blur(8px)" } },
    { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 60 } },
    { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -40 } },
    { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, x: -60 } },
    // Journey 5: Money — slide up (building value)
    { initial: { opacity: 0, y: 80 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -60 } },
    { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -40 } },
    { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -40 } },
    { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -40 } },
    { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0 } },
    // Chapter VI: Marketplace — horizontal sweep (browsing)
    { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 } },
    { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 } },
    // Journey 7: Future — slow, confident
    { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
];

export function PitchDeck() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [autoplay, setAutoplay] = useState(false);
    const [ttsEnabled, setTTSEnabled] = useState(true);
    const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Voice unset → server tries v3 with priya, falls back to v2 with anushka, then browser TTS.
    const { speak, prefetch, stop, isSpeaking, provider } = useTTS({ rate: 1.0 });

    const goNext = useCallback(() => {
        setCurrentSlide((prev) => Math.min(prev + 1, SCREENS.length - 1));
    }, []);

    const goPrev = useCallback(() => {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }, []);

    // Stop any in-flight speech / pending advance whenever the slide changes
    // or the TTS-enabled flag flips. Crucially does NOT depend on `autoplay` —
    // toggling autoplay must NOT pre-cancel the speech that the autoplay
    // effect below is about to start for the current slide.
    useEffect(() => {
        if (advanceTimerRef.current) {
            clearTimeout(advanceTimerRef.current);
            advanceTimerRef.current = null;
        }
        stop();
    }, [currentSlide, ttsEnabled, stop]);

    // Keep the screen awake while autoplay is active (Wake Lock API).
    // Browsers may release the lock when the tab loses visibility — we
    // re-acquire on visibilitychange if autoplay is still on.
    useEffect(() => {
        if (!autoplay) return;
        if (typeof navigator === "undefined" || !("wakeLock" in navigator)) return;

        type WakeLockSentinel = { release: () => Promise<void> };
        let sentinel: WakeLockSentinel | null = null;
        let cancelled = false;

        const acquire = async () => {
            try {
                const nav = navigator as Navigator & {
                    wakeLock: { request: (type: "screen") => Promise<WakeLockSentinel> };
                };
                sentinel = await nav.wakeLock.request("screen");
            } catch {
                // Ignore — some browsers/contexts (no HTTPS, no user gesture) reject.
                sentinel = null;
            }
        };

        const onVisibilityChange = () => {
            if (document.visibilityState === "visible" && !cancelled) {
                acquire();
            }
        };

        acquire();
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            cancelled = true;
            document.removeEventListener("visibilitychange", onVisibilityChange);
            if (sentinel) {
                sentinel.release().catch(() => {});
                sentinel = null;
            }
        };
    }, [autoplay]);

    // Mount-time warm-up: prefetch the narration for the slide the user is on
    // (typically S01) so the first Play click is instant, not a 5-10s cold start.
    // We also prefetch the next slide for good measure.
    useEffect(() => {
        const first = SCRIPT_BY_ID[SCREENS[currentSlide].id];
        if (first) prefetch(first.narration);
        const next = SCREENS[currentSlide + 1] && SCRIPT_BY_ID[SCREENS[currentSlide + 1].id];
        if (next) prefetch(next.narration);
        // Only on mount — subsequent prefetches happen inside the autoplay effect.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Autoplay loop: speak the CURRENT slide's narration whenever autoplay flips on
    // or the slide index changes while autoplay is active.
    useEffect(() => {
        const slideId = SCREENS[currentSlide].id;
        console.log(`[autoplay effect] slide=${currentSlide} (${slideId}) autoplay=${autoplay}`);

        if (!autoplay) {
            if (advanceTimerRef.current) {
                clearTimeout(advanceTimerRef.current);
                advanceTimerRef.current = null;
            }
            stop();
            return;
        }

        const script = SCRIPT_BY_ID[slideId];
        if (!script) return;

        let cancelled = false;
        const isLast = currentSlide === SCREENS.length - 1;
        const nextScript = !isLast ? SCRIPT_BY_ID[SCREENS[currentSlide + 1].id] : null;

        const advance = () => {
            console.log(`[autoplay advance] from slide=${currentSlide} (${slideId}) cancelled=${cancelled}`);
            if (cancelled) return;
            if (isLast) {
                setAutoplay(false);
                return;
            }
            advanceTimerRef.current = setTimeout(() => {
                if (!cancelled) {
                    console.log(`[autoplay goNext] firing from slide=${currentSlide}`);
                    goNext();
                }
            }, 80);
        };

        if (ttsEnabled) {
            if (nextScript) prefetch(nextScript.narration);
            speak(script.narration)
                .then(() => {
                    console.log(`[autoplay speak.then] completed for slide=${currentSlide} (${slideId}) cancelled=${cancelled}`);
                    if (!cancelled) advance();
                })
                .catch((e) => {
                    console.log(`[autoplay speak.catch] aborted for slide=${currentSlide} (${slideId}) — ${e?.message ?? e}`);
                });
        } else {
            advanceTimerRef.current = setTimeout(advance, script.durationSec * 1000);
        }

        return () => {
            console.log(`[autoplay cleanup] slide=${currentSlide} (${slideId}) — cancelled flag set`);
            cancelled = true;
        };
    }, [autoplay, currentSlide, ttsEnabled, speak, prefetch, goNext, stop]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't intercept when typing in an input
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA") return;

            if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
                e.preventDefault();
                goNext();
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                goPrev();
            } else if (e.key === "p" || e.key === "P") {
                e.preventDefault();
                setAutoplay((v) => !v);
            } else if (e.key === "m" || e.key === "M") {
                e.preventDefault();
                setTTSEnabled((v) => !v);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goNext, goPrev]);

    const scrollProgress = SCREENS.length > 1 ? currentSlide / (SCREENS.length - 1) : 0;
    const { Component } = SCREENS[currentSlide];
    const variant = JOURNEY_TRANSITIONS[currentSlide] || JOURNEY_TRANSITIONS[0];

    // Show the persistent corner logo on every slide except the close (which
    // displays the brand at hero size itself). Slides whose own chapter chrome
    // collides with the corner logo have their chrome's left-padding adjusted
    // in their own files so the two coexist cleanly.
    const showPersistentLogo = currentSlide !== SCREENS.length - 1;

    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-950">
            <ProgressBar scrollProgress={scrollProgress} />

            {/* Persistent Fleetora wordmark — top-left, subtle, on every slide except hero/close */}
            {showPersistentLogo && (
                <div className="absolute top-5 left-6 z-40 flex items-center gap-1.5 pointer-events-none select-none">
                    <div className="relative">
                        <Car className="h-4 w-4 text-emerald-400" />
                        <div className="absolute -inset-1 bg-emerald-400/20 rounded-full blur-[6px] -z-10" />
                    </div>
                    <span className="text-[13px] font-semibold tracking-tight text-white/85">
                        Fleetora
                    </span>
                </div>
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={variant.initial}
                    animate={variant.animate}
                    exit={variant.exit}
                    transition={{ type: "spring", stiffness: 80, damping: 25, duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <Component />
                </motion.div>
            </AnimatePresence>

            {currentSlide > 0 && (
                <button onClick={goPrev} className="absolute left-6 top-1/2 -translate-y-1/2 z-40 group" aria-label="Previous">
                    <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all group-hover:bg-white/10 group-hover:scale-110">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                </button>
            )}
            {currentSlide < SCREENS.length - 1 && (
                <button onClick={goNext} className="absolute right-6 top-1/2 -translate-y-1/2 z-40 group" aria-label="Next">
                    <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all group-hover:bg-white/10 group-hover:scale-110">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                </button>
            )}

            <div className="absolute bottom-6 right-6 z-40">
                <span className="text-xs font-medium text-white/20 tabular-nums">{String(currentSlide + 1).padStart(2, "0")} / {String(SCREENS.length).padStart(2, "0")}</span>
            </div>

            {/* Subtle "Watch presentation" CTA — only on hero (S01), only when autoplay isn't already running.
                Optional entry point; the bottom-right controls remain the primary play/pause UI. */}
            {currentSlide === 0 && !autoplay && (
                <button
                    onClick={() => setAutoplay(true)}
                    className="absolute z-30 left-1/2 -translate-x-1/2 group flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-md transition-all hover:scale-[1.03]"
                    style={{
                        bottom: "20%",
                        background: "rgba(15,22,38,0.55)",
                        border: "1px solid rgba(148,163,184,0.22)",
                        color: "rgba(226,232,240,0.85)",
                    }}
                    aria-label="Watch presentation with narration"
                >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="opacity-70 group-hover:opacity-100 transition-opacity">
                        <path d="M2 1 L9 5 L2 9 Z" />
                    </svg>
                    <span className="text-[11px] font-mono uppercase tracking-[0.28em]">
                        Watch presentation
                    </span>
                </button>
            )}

            {/* Floating controls — autoplay / TTS / transcript */}
            <Controls
                autoplay={autoplay}
                onToggleAutoplay={() => setAutoplay((v) => !v)}
                ttsEnabled={ttsEnabled}
                onToggleTTS={() => setTTSEnabled((v) => !v)}
                isSpeaking={isSpeaking}
                provider={provider}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-1">
                {SCREENS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`rounded-full transition-all duration-300 ${i === currentSlide ? "w-5 h-1.5 bg-blue-500" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/30"}`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
