"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

// Three search sequences demonstrating different capabilities
const SEQUENCES = [
    {
        label: "Find a customer",
        searchText: "Ahmad Kh",
        results: [
            { icon: "👤", value: "Ahmad Khalil", detail: "Fleet Corp • Gold tier • 12 rentals", type: "Customer" },
            { icon: "👤", value: "Ahmad Khoury", detail: "Walk-in • 2 rentals", type: "Customer" },
        ],
        selectIndex: 0,
        selectedCard: { title: "Ahmad Khalil", subtitle: "Fleet Corp — Corporate Account", stats: [{ label: "Rentals", value: "12" }, { label: "Credit", value: "$12K" }, { label: "Status", value: "Gold" }] },
    },
    {
        label: "Find a vehicle",
        searchText: "Tucson",
        results: [
            { icon: "🚗", value: "Tucson HSE • ABC-1234", detail: "Airport • Available • SUV", type: "Vehicle" },
            { icon: "🚗", value: "Tucson GL • XYZ-5678", detail: "Downtown • Rented • SUV", type: "Vehicle" },
            { icon: "🚗", value: "Tucson N-Line • QRS-9012", detail: "Mall • In Service", type: "Vehicle" },
        ],
        selectIndex: 0,
        selectedCard: { title: "Tucson HSE", subtitle: "ABC-1234 — Airport Branch", stats: [{ label: "Status", value: "Available" }, { label: "Mileage", value: "32,400km" }, { label: "Service", value: "In 2,100km" }] },
    },
    {
        label: "Find a booking",
        searchText: "BK-2026",
        results: [
            { icon: "📋", value: "BK-20260417-042", detail: "Ahmad K. • Tucson HSE • Active", type: "Booking" },
            { icon: "📋", value: "BK-20260416-039", detail: "Sara M. • Accent • Returned", type: "Booking" },
        ],
        selectIndex: 0,
        selectedCard: { title: "BK-20260417-042", subtitle: "Ahmad Khalil — 3 day rental", stats: [{ label: "Vehicle", value: "Tucson HSE" }, { label: "Day", value: "1 of 3" }, { label: "Status", value: "Active" }] },
    },
];

const SHORTCUTS = [
    { key: "N", label: "New Booking" },
    { key: "M", label: "Fleet Map" },
    { key: "T", label: "Transfers" },
    { key: "S", label: "Service" },
    { key: "R", label: "Returns" },
];

type Phase = "idle" | "key-press" | "opening" | "typing" | "results" | "selecting" | "selected" | "card-shown" | "fading";

export function CommandBarScreen() {
    const [seqIndex, setSeqIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>("idle");
    const [typedChars, setTypedChars] = useState(0);
    const [shownCards, setShownCards] = useState<number[]>([]);

    const runSequence = useCallback((idx: number, initialDelay: number) => {
        const seq = SEQUENCES[idx];
        const timers: NodeJS.Timeout[] = [];

        // Open palette (or reuse if already open)
        if (idx === 0) {
            timers.push(setTimeout(() => setPhase("key-press"), initialDelay));
            timers.push(setTimeout(() => setPhase("opening"), initialDelay + 700));
            timers.push(setTimeout(() => { setPhase("typing"); setTypedChars(0); }, initialDelay + 1200));
        } else {
            timers.push(setTimeout(() => { setPhase("typing"); setTypedChars(0); }, initialDelay));
        }

        // Type characters
        const typeStart = idx === 0 ? initialDelay + 1400 : initialDelay + 200;
        for (let i = 0; i < seq.searchText.length; i++) {
            timers.push(setTimeout(() => setTypedChars(i + 1), typeStart + i * 120));
        }

        // Show results
        const resultsTime = typeStart + seq.searchText.length * 120 + 200;
        timers.push(setTimeout(() => setPhase("results"), resultsTime));

        // Select result
        timers.push(setTimeout(() => setPhase("selecting"), resultsTime + 600));
        timers.push(setTimeout(() => setPhase("selected"), resultsTime + 900));

        // Show card to the side
        timers.push(setTimeout(() => {
            setPhase("card-shown");
            setShownCards(prev => [...prev, idx]);
        }, resultsTime + 1300));

        // Fade palette and prepare for next
        timers.push(setTimeout(() => {
            setPhase("fading");
        }, resultsTime + 2200));

        return { timers, nextStart: resultsTime + 2600 };
    }, []);

    useEffect(() => {
        const allTimers: NodeJS.Timeout[] = [];

        let accumulatedDelay = 500;

        // Run all 3 sequences
        for (let i = 0; i < SEQUENCES.length; i++) {
            const { timers, nextStart } = runSequence(i, accumulatedDelay);
            allTimers.push(...timers);

            // Schedule sequence index change
            allTimers.push(setTimeout(() => setSeqIndex(i), accumulatedDelay));

            accumulatedDelay = accumulatedDelay + nextStart - accumulatedDelay + 400;
        }

        // After all sequences, wait then loop
        const totalDuration = accumulatedDelay + 2000;
        const loopTimer = setTimeout(() => {
            setSeqIndex(0);
            setPhase("idle");
            setTypedChars(0);
            setShownCards([]);
        }, totalDuration);
        allTimers.push(loopTimer);

        // Restart loop
        const loopInterval = setInterval(() => {
            setSeqIndex(0);
            setPhase("idle");
            setTypedChars(0);
            setShownCards([]);

            let delay = 500;
            for (let i = 0; i < SEQUENCES.length; i++) {
                const { nextStart } = runSequence(i, delay);
                setTimeout(() => setSeqIndex(i), delay);
                delay = delay + nextStart - delay + 400;
            }
        }, totalDuration + 500);

        return () => {
            allTimers.forEach(clearTimeout);
            clearInterval(loopInterval);
        };
    }, [runSequence]);

    const currentSeq = SEQUENCES[seqIndex];
    const isOpen = phase !== "idle" && phase !== "key-press";

    return (
        <section className="h-screen w-full flex items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

            {/* Left side: selected cards stack */}
            <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 flex flex-col gap-3 w-64">
                <AnimatePresence>
                    {shownCards.map((cardIdx) => {
                        const card = SEQUENCES[cardIdx].selectedCard;
                        return (
                            <motion.div
                                key={cardIdx}
                                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                className="rounded-xl border border-slate-700 bg-slate-900/80 backdrop-blur-sm p-4"
                            >
                                <p className="text-sm font-bold text-white">{card.title}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{card.subtitle}</p>
                                <div className="flex gap-3 mt-3">
                                    {card.stats.map((s, i) => (
                                        <div key={i}>
                                            <p className="text-[8px] text-slate-500 uppercase tracking-wider">{s.label}</p>
                                            <p className="text-xs font-semibold text-white">{s.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Center: Command palette + title */}
            <div className="flex flex-col items-center w-full max-w-xl z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-2"
                >
                    Everything starts with ⌘K
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-slate-400 text-center mb-10"
                >
                    <AnimatePresence mode="wait">
                        <motion.span key={seqIndex} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="inline-block">
                            {currentSeq.label}
                        </motion.span>
                    </AnimatePresence>
                </motion.p>

                {/* Floating ⌘K keystroke */}
                <AnimatePresence>
                    {phase === "key-press" && (
                        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="flex items-center gap-2 mb-6">
                            <kbd className="px-4 py-2.5 text-lg font-mono bg-slate-800 rounded-xl text-white border border-slate-600 shadow-lg shadow-blue-500/20">⌘</kbd>
                            <span className="text-slate-500 text-lg">+</span>
                            <kbd className="px-4 py-2.5 text-lg font-mono bg-slate-800 rounded-xl text-white border border-slate-600 shadow-lg shadow-blue-500/20">K</kbd>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Command Palette */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: phase === "fading" ? 0.6 : 1, scale: phase === "fading" ? 0.98 : 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 150, damping: 25 }}
                            className="w-full"
                        >
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/5 blur-3xl rounded-full" />
                            </div>

                            <div className="relative rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 overflow-hidden">
                                {/* Search input */}
                                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                                    <div className="flex-1">
                                        <span className="text-white text-base">{currentSeq.searchText.slice(0, typedChars)}</span>
                                        {(phase === "typing" || phase === "opening") && (
                                            <motion.span className="inline-block w-0.5 h-5 bg-blue-500 ml-0.5 align-middle" animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} />
                                        )}
                                        {typedChars === 0 && phase === "opening" && <span className="text-slate-500 text-base">Search anything...</span>}
                                    </div>
                                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 rounded text-slate-500 border border-slate-700">ESC</kbd>
                                </div>

                                {/* Results */}
                                <AnimatePresence>
                                    {(phase === "results" || phase === "selecting" || phase === "selected" || phase === "card-shown") && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                                            <div className="px-3 py-1.5">
                                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium px-2">Results</span>
                                            </div>
                                            {currentSeq.results.map((result, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.06 }}
                                                    className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg transition-all ${
                                                        i === currentSeq.selectIndex && (phase === "selecting" || phase === "selected" || phase === "card-shown")
                                                            ? "bg-blue-600/20 border border-blue-500/30"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="text-lg">{result.icon}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium ${i === currentSeq.selectIndex && phase !== "results" ? "text-blue-400" : "text-slate-200"}`}>{result.value}</p>
                                                        <p className="text-xs text-slate-500 truncate">{result.detail}</p>
                                                    </div>
                                                    <span className="text-[10px] uppercase tracking-wider text-slate-600">{result.type}</span>
                                                    {i === currentSeq.selectIndex && (phase === "selected" || phase === "card-shown") && (
                                                        <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-medium">Enter ↵</motion.span>
                                                    )}
                                                </motion.div>
                                            ))}
                                            <div className="h-2" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Footer */}
                                {isOpen && phase !== "fading" && (
                                    <div className="px-5 py-2 border-t border-slate-800 flex items-center gap-4">
                                        <div className="flex items-center gap-1.5"><kbd className="px-1 py-0.5 text-[9px] font-mono bg-slate-800 rounded text-slate-500 border border-slate-700">↑↓</kbd><span className="text-[10px] text-slate-600">Navigate</span></div>
                                        <div className="flex items-center gap-1.5"><kbd className="px-1 py-0.5 text-[9px] font-mono bg-slate-800 rounded text-slate-500 border border-slate-700">↵</kbd><span className="text-[10px] text-slate-600">Open</span></div>
                                        <div className="flex items-center gap-1.5"><kbd className="px-1 py-0.5 text-[9px] font-mono bg-slate-800 rounded text-slate-500 border border-slate-700">ESC</kbd><span className="text-[10px] text-slate-600">Close</span></div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Keyboard shortcuts bottom */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute bottom-16 flex gap-6">
                {SHORTCUTS.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.08 }} className="flex items-center gap-2">
                        <kbd className="w-7 h-7 flex items-center justify-center text-xs font-mono bg-slate-800 rounded-lg text-slate-400 border border-slate-700">{s.key}</kbd>
                        <span className="text-xs text-slate-500">{s.label}</span>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
