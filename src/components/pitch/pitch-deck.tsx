"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar } from "./shared/progress-bar";
import { HeroScreen } from "./screens/01-hero";
import { WhatIsScreen } from "./screens/02-what-is";
import { CommandBarScreen } from "./screens/03-command-bar";
import { WalkinFlowScreen } from "./screens/04-walkin-flow";
import { PosDashboardScreen } from "./screens/05-pos-dashboard";

// Placeholder for screens not yet built
function PlaceholderScreen({ title, num }: { title: string; num: number }) {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 bg-white">
            <p className="text-sm font-semibold tracking-widest uppercase text-slate-300 mb-4">Slide {num}</p>
            <h2 className="text-3xl font-bold text-slate-300">{title}</h2>
        </section>
    );
}

const SCREENS = [
    { id: "hero", Component: HeroScreen },
    { id: "what-is", Component: WhatIsScreen },
    { id: "command-bar", Component: CommandBarScreen },
    { id: "walkin", Component: WalkinFlowScreen },
    { id: "pos", Component: PosDashboardScreen },
    { id: "booking-tracking", Component: () => <PlaceholderScreen title="Live GPS Tracking" num={6} /> },
    { id: "booking-timeline", Component: () => <PlaceholderScreen title="Booking Timeline" num={7} /> },
    { id: "booking-drivers", Component: () => <PlaceholderScreen title="Multi-Driver Management" num={8} /> },
    { id: "booking-mileage", Component: () => <PlaceholderScreen title="Mileage, Swaps & Tickets" num={9} /> },
    { id: "booking-payments", Component: () => <PlaceholderScreen title="Payment Breakdown" num={10} /> },
    { id: "hq-cockpit", Component: () => <PlaceholderScreen title="HQ Cockpit" num={11} /> },
    { id: "branch-analytics", Component: () => <PlaceholderScreen title="Branch Analytics" num={12} /> },
    { id: "fleet-brain-rebalance", Component: () => <PlaceholderScreen title="Fleet Brain — Rebalancing" num={13} /> },
    { id: "fleet-brain-predict", Component: () => <PlaceholderScreen title="Demand Prediction" num={14} /> },
    { id: "fleet-map", Component: () => <PlaceholderScreen title="Live Fleet Map" num={15} /> },
    { id: "transfers", Component: () => <PlaceholderScreen title="Inter-Branch Transfers" num={16} /> },
    { id: "maintenance", Component: () => <PlaceholderScreen title="Maintenance Kanban" num={17} /> },
    { id: "corporate", Component: () => <PlaceholderScreen title="Corporate Accounts" num={18} /> },
    { id: "finance", Component: () => <PlaceholderScreen title="Finance Workspace" num={19} /> },
    { id: "close", Component: () => <PlaceholderScreen title="Getting Started" num={20} /> },
];

const TRANSITIONS = [
    { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.05 } },
    { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -40 } },
    { initial: { opacity: 0, x: 80 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -80 } },
    { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 } },
    { initial: { opacity: 0, y: 40, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -30 } },
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
    const variant = TRANSITIONS[currentSlide % TRANSITIONS.length];

    return (
        <div className="relative h-screen w-full overflow-hidden bg-white">
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
                    <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 flex items-center justify-center shadow-sm transition-all group-hover:shadow-md group-hover:scale-110">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                </button>
            )}
            {currentSlide < SCREENS.length - 1 && (
                <button onClick={goNext} className="absolute right-6 top-1/2 -translate-y-1/2 z-40 group" aria-label="Next">
                    <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 flex items-center justify-center shadow-sm transition-all group-hover:shadow-md group-hover:scale-110">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                </button>
            )}

            <div className="absolute bottom-6 right-6 z-40">
                <span className="text-xs font-medium text-slate-300 tabular-nums">{String(currentSlide + 1).padStart(2, "0")} / {String(SCREENS.length).padStart(2, "0")}</span>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-1">
                {SCREENS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`rounded-full transition-all duration-300 ${i === currentSlide ? "w-5 h-1.5 bg-blue-600" : "w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400"}`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
