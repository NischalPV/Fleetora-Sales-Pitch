"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "../shared/use-in-view";

const PILLARS = [
    {
        headline: "90 seconds.",
        subhead: "Walk-in to wheels out.",
        description: "ID scan. Credit check. Contract. Payment. Keys. What used to take 20 minutes now happens in a single automated flow.",
        accent: "#3b82f6",
        icon: (
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="36" stroke="#3b82f6" strokeWidth="2" strokeDasharray="226" strokeDashoffset="0" strokeLinecap="round" />
                <text x="40" y="46" textAnchor="middle" fill="#3b82f6" fontSize="20" fontWeight="700">90s</text>
            </svg>
        ),
    },
    {
        headline: "Your whole fleet.",
        subhead: "One screen.",
        description: "Utilization across every branch. Revenue in real time. Demand forecasts. Fleet Brain insights. The cockpit that replaces the spreadsheet.",
        accent: "#10b981",
        icon: (
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect x="8" y="16" width="64" height="40" rx="4" stroke="#10b981" strokeWidth="2" />
                <circle cx="24" cy="36" r="4" fill="#10b981" opacity="0.6" />
                <circle cx="40" cy="30" r="3" fill="#10b981" opacity="0.4" />
                <circle cx="56" cy="38" r="5" fill="#10b981" opacity="0.8" />
                <line x1="32" y1="60" x2="48" y2="60" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        headline: "Built for Tuesday afternoon.",
        subhead: "",
        description: "Vehicle swaps mid-rental. Multi-driver surcharges. Speed camera tickets reconciled weeks later. We handle the messy reality that other tools pretend doesn\u2019t exist.",
        accent: "#f59e0b",
        icon: (
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect x="12" y="12" width="56" height="56" rx="8" stroke="#f59e0b" strokeWidth="2" />
                <line x1="12" y1="28" x2="68" y2="28" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
                <line x1="12" y1="40" x2="68" y2="40" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
                <line x1="12" y1="52" x2="68" y2="52" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
                <circle cx="24" cy="34" r="2" fill="#f59e0b" />
                <circle cx="24" cy="46" r="2" fill="#f59e0b" />
                <circle cx="24" cy="58" r="2" fill="#f59e0b" />
            </svg>
        ),
    },
];

export function PillarsScreen() {
    const { ref, isInView } = useInView(0.3);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleWheel = (e: React.WheelEvent) => {
        if (e.deltaY > 0 && activeIndex < PILLARS.length - 1) {
            e.stopPropagation();
            setActiveIndex((prev) => Math.min(prev + 1, PILLARS.length - 1));
        } else if (e.deltaY < 0 && activeIndex > 0) {
            e.stopPropagation();
            setActiveIndex((prev) => Math.max(prev - 1, 0));
        }
    };

    const pillar = PILLARS[activeIndex];

    return (
        <section
            ref={ref}
            onWheel={handleWheel}
            className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden"
        >
            {/* Floating orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute w-72 h-72 rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", top: "10%", left: "5%" }}
                    animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute w-96 h-96 rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)", bottom: "5%", right: "0%" }}
                    animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute w-64 h-64 rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)", top: "40%", right: "15%" }}
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Dot indicator */}
            <div className="absolute top-8 flex gap-2">
                {PILLARS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i === activeIndex ? "bg-slate-900 scale-125" : "bg-slate-300"
                        }`}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                    className="flex flex-col items-center text-center max-w-2xl"
                >
                    <div className="mb-8">{pillar.icon}</div>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
                        {pillar.headline}
                    </h2>
                    {pillar.subhead && (
                        <h3 className="text-3xl md:text-5xl font-semibold tracking-tight mt-2" style={{ color: pillar.accent }}>
                            {pillar.subhead}
                        </h3>
                    )}
                    <p className="text-base md:text-lg text-slate-500 mt-6 leading-relaxed max-w-lg">
                        {pillar.description}
                    </p>
                </motion.div>
            </AnimatePresence>
        </section>
    );
}
