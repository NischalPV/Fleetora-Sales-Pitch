"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar } from "./shared/progress-bar";
import { HeroScreen } from "./screens/01-hero";
import { WhatIsScreen } from "./screens/02-what-is";
import { CommandBarScreen } from "./screens/03-command-bar";
import { WalkinFlowScreen } from "./screens/04-walkin-flow";
import { PosDashboardScreen } from "./screens/05-pos-dashboard";
import { BookingTrackingScreen } from "./screens/06-booking-tracking";
import { BookingTimelineScreen } from "./screens/07-booking-timeline";
import { BookingDriversScreen } from "./screens/08-booking-drivers";
import { BookingMileageScreen } from "./screens/09-booking-mileage";
import { BookingPaymentsScreen } from "./screens/10-booking-payments";
import { HqCockpitScreen } from "./screens/11-hq-cockpit";
import { BranchAnalyticsScreen } from "./screens/12-branch-analytics";
import { FleetBrainRebalanceScreen } from "./screens/13-fleet-brain-rebalance";
import { FleetBrainPredictScreen } from "./screens/14-fleet-brain-predict";
import { FleetMapScreen } from "./screens/15-fleet-map";
import { TransfersScreen } from "./screens/16-transfers";
import { MaintenanceScreen } from "./screens/17-maintenance";
import { CorporateScreen } from "./screens/18-corporate";
import { FinanceScreen } from "./screens/19-finance";
import { CloseScreen } from "./screens/20-close";

const SCREENS = [
    { id: "hero", Component: HeroScreen },
    { id: "what-is", Component: WhatIsScreen },
    { id: "command-bar", Component: CommandBarScreen },
    { id: "walkin", Component: WalkinFlowScreen },
    { id: "pos", Component: PosDashboardScreen },
    { id: "booking-tracking", Component: BookingTrackingScreen },
    { id: "booking-timeline", Component: BookingTimelineScreen },
    { id: "booking-drivers", Component: BookingDriversScreen },
    { id: "booking-mileage", Component: BookingMileageScreen },
    { id: "booking-payments", Component: BookingPaymentsScreen },
    { id: "hq-cockpit", Component: HqCockpitScreen },
    { id: "branch-analytics", Component: BranchAnalyticsScreen },
    { id: "fleet-brain-rebalance", Component: FleetBrainRebalanceScreen },
    { id: "fleet-brain-predict", Component: FleetBrainPredictScreen },
    { id: "fleet-map", Component: FleetMapScreen },
    { id: "transfers", Component: TransfersScreen },
    { id: "maintenance", Component: MaintenanceScreen },
    { id: "corporate", Component: CorporateScreen },
    { id: "finance", Component: FinanceScreen },
    { id: "close", Component: CloseScreen },
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
