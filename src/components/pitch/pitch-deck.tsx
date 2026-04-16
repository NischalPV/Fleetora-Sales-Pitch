"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ProgressBar } from "./shared/progress-bar";
import { HeroScreen } from "./screens/01-hero";

const TOTAL_SCREENS = 11;

export function PitchDeck() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [heroComplete, setHeroComplete] = useState(false);

    // Track scroll progress for the progress bar
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            setScrollProgress(scrollTop / (scrollHeight - clientHeight));
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!heroComplete && (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ")) {
                return; // Let hero handle its own scroll
            }

            const vh = window.innerHeight;
            const currentScreen = Math.round(container.scrollTop / vh);

            if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
                e.preventDefault();
                const nextScreen = Math.min(currentScreen + 1, TOTAL_SCREENS - 1);
                container.scrollTo({ top: nextScreen * vh, behavior: "smooth" });
            } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                e.preventDefault();
                const prevScreen = Math.max(currentScreen - 1, 0);
                container.scrollTo({ top: prevScreen * vh, behavior: "smooth" });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [heroComplete]);

    // Hero completion handler — advance to Screen 2
    const handleHeroComplete = useCallback(() => {
        setHeroComplete(true);
        const container = containerRef.current;
        if (container) {
            container.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        }
    }, []);

    return (
        <div className="relative">
            <ProgressBar scrollProgress={scrollProgress} />
            <div
                ref={containerRef}
                className="h-screen overflow-y-auto snap-y snap-mandatory"
                style={{ scrollBehavior: "smooth" }}
            >
                {/* Screen 1: Hero */}
                <HeroScreen onComplete={handleHeroComplete} />

                {/* Screens 2-11: Placeholder sections */}
                {Array.from({ length: 10 }, (_, i) => (
                    <section
                        key={i + 2}
                        className="h-screen w-full snap-start flex items-center justify-center"
                    >
                        <p className="text-slate-500 text-lg">Screen {i + 2}</p>
                    </section>
                ))}
            </div>
        </div>
    );
}
