"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar } from "./shared/progress-bar";
import { S01Hero } from "./screens/s01-hero";
import { S02Intro } from "./screens/s02-intro";
import { S03CmdBar } from "./screens/s03-cmd-bar";
import { S04Customer } from "./screens/s04-customer";
import { S05Checkout } from "./screens/s05-checkout";
import { S06LivingBooking } from "./screens/s06-living-booking";
import { S07Pos } from "./screens/s07-pos";
import { S08Tracking } from "./screens/s08-tracking";
import { S09FleetMap } from "./screens/s09-fleet-map";
import { S10HqCockpit } from "./screens/s10-hq-cockpit";
import { S11FleetBrain } from "./screens/s11-fleet-brain";
import { S12Rebalance } from "./screens/s12-rebalance";
import { S13Predict } from "./screens/s13-predict";
import { S14Maintenance } from "./screens/s14-maintenance";
import { S15Corporate } from "./screens/s15-corporate";
import { S16Invoicing } from "./screens/s16-invoicing";
import { S17Payments } from "./screens/s17-payments";
import { S18FinanceWs } from "./screens/s18-finance-ws";
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
    { id: "tracking", Component: S08Tracking },
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
    { id: "finance-ws", Component: S18FinanceWs },
    // Journey 6: The Future
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
    { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 } },
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
    { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0 } },
    // Journey 6: Future — slow, confident
    { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
];

export function PitchDeck() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const goNext = useCallback(() => {
        setCurrentSlide((prev) => Math.min(prev + 1, SCREENS.length - 1));
    }, []);

    const goPrev = useCallback(() => {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
                e.preventDefault();
                goNext();
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                goPrev();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goNext, goPrev]);

    const scrollProgress = SCREENS.length > 1 ? currentSlide / (SCREENS.length - 1) : 0;
    const { Component } = SCREENS[currentSlide];
    const variant = JOURNEY_TRANSITIONS[currentSlide] || JOURNEY_TRANSITIONS[0];

    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-950">
            <ProgressBar scrollProgress={scrollProgress} />

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
