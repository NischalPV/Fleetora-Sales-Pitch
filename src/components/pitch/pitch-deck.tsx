"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar } from "./shared/progress-bar";
import { HeroScreen } from "./screens/01-hero";
import { StoryScreen } from "./screens/02-story";
import { DamageScreen } from "./screens/03-damage";
import { RevealScreen } from "./screens/04-reveal";
import { PillarsScreen } from "./screens/05-pillars";
import { ProductScreen } from "./screens/06-product";
import { FleetBrainScreen } from "./screens/07-fleet-brain";
import { AutomationScreen } from "./screens/08-automation";
import { RoadmapScreen } from "./screens/09-roadmap";
import { CompoundScreen } from "./screens/10-compound";
import { CloseScreen } from "./screens/11-close";

const SCREENS = [
    { id: "hero", Component: HeroScreen },
    { id: "story", Component: StoryScreen },
    { id: "damage", Component: DamageScreen },
    { id: "reveal", Component: RevealScreen },
    { id: "pillars", Component: PillarsScreen },
    { id: "product", Component: ProductScreen },
    { id: "fleet-brain", Component: FleetBrainScreen },
    { id: "automation", Component: AutomationScreen },
    { id: "roadmap", Component: RoadmapScreen },
    { id: "compound", Component: CompoundScreen },
    { id: "close", Component: CloseScreen },
];

// Each screen gets a unique transition personality
const SLIDE_VARIANTS = [
    // 1: Hero — fade in from center
    { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.05 } },
    // 2: Story — slide up from bottom
    { initial: { opacity: 0, y: 80 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -80 } },
    // 3: Damage — zoom in
    { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 } },
    // 4: Reveal — fade from black
    { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    // 5: Pillars — slide from right
    { initial: { opacity: 0, x: 100 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -100 } },
    // 6: Product — slide up with scale
    { initial: { opacity: 0, y: 60, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -40 } },
    // 7: Fleet Brain — radial expand
    { initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.1 } },
    // 8: Automation — slide from left
    { initial: { opacity: 0, x: -100 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 100 } },
    // 9: Roadmap — slide up
    { initial: { opacity: 0, y: 100 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -60 } },
    // 10: Compound — fade with blur
    { initial: { opacity: 0, filter: "blur(10px)" }, animate: { opacity: 1, filter: "blur(0px)" }, exit: { opacity: 0, filter: "blur(10px)" } },
    // 11: Close — slow fade
    { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
];

export function PitchDeck() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0); // -1 = prev, 1 = next

    const goNext = useCallback(() => {
        if (currentSlide < SCREENS.length - 1) {
            setDirection(1);
            setCurrentSlide((prev) => prev + 1);
        }
    }, [currentSlide]);

    const goPrev = useCallback(() => {
        if (currentSlide > 0) {
            setDirection(-1);
            setCurrentSlide((prev) => prev - 1);
        }
    }, [currentSlide]);

    // Keyboard navigation
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
    const variant = SLIDE_VARIANTS[currentSlide];

    return (
        <div className="relative h-screen w-full overflow-hidden bg-white">
            <ProgressBar scrollProgress={scrollProgress} />

            {/* Slide content */}
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

            {/* Navigation arrows */}
            {currentSlide > 0 && (
                <button
                    onClick={goPrev}
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-40 group"
                    aria-label="Previous slide"
                >
                    <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 flex items-center justify-center shadow-sm transition-all group-hover:bg-white group-hover:shadow-md group-hover:scale-110">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 12L6 8L10 4" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </button>
            )}
            {currentSlide < SCREENS.length - 1 && (
                <button
                    onClick={goNext}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-40 group"
                    aria-label="Next slide"
                >
                    <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 flex items-center justify-center shadow-sm transition-all group-hover:bg-white group-hover:shadow-md group-hover:scale-110">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 4L10 8L6 12" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </button>
            )}

            {/* Slide counter */}
            <div className="absolute bottom-6 right-6 z-40">
                <span className="text-xs font-medium text-slate-300 tabular-nums">
                    {String(currentSlide + 1).padStart(2, "0")} / {String(SCREENS.length).padStart(2, "0")}
                </span>
            </div>

            {/* Dot navigation */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-1.5">
                {SCREENS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setDirection(i > currentSlide ? 1 : -1);
                            setCurrentSlide(i);
                        }}
                        className={`rounded-full transition-all duration-300 ${
                            i === currentSlide
                                ? "w-6 h-1.5 bg-blue-600"
                                : "w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
