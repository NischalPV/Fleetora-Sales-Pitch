"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const SEARCH_TEXT = "Ahmad Kh";
const RESULTS = [
    { type: "Customer", value: "Ahmad Khalil", detail: "Corp: Fleet Corp • 3 active bookings", icon: "👤" },
    { type: "Vehicle", value: "Tucson HSE • ABC-1234", detail: "Airport branch • Available", icon: "🚗" },
    { type: "Booking", value: "BK-20260417-042", detail: "Sara M. • Accent • Due today 5:00 PM", icon: "📋" },
];

const SHORTCUTS = [
    { key: "N", label: "New Booking" },
    { key: "M", label: "Fleet Map" },
    { key: "T", label: "Transfers" },
    { key: "S", label: "Service" },
    { key: "R", label: "Returns" },
];

export function CommandBarScreen() {
    const [phase, setPhase] = useState<"idle" | "key-press" | "opening" | "typing" | "results" | "select">("idle");
    const [typedChars, setTypedChars] = useState(0);
    const [selectedResult, setSelectedResult] = useState(-1);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        // Phase 1: Show ⌘K keystroke animation
        timers.push(setTimeout(() => setPhase("key-press"), 800));

        // Phase 2: Palette opens
        timers.push(setTimeout(() => setPhase("opening"), 1500));

        // Phase 3: Start typing
        timers.push(setTimeout(() => setPhase("typing"), 2200));

        // Phase 3b: Type each character
        for (let i = 0; i < SEARCH_TEXT.length; i++) {
            timers.push(setTimeout(() => setTypedChars(i + 1), 2400 + i * 150));
        }

        // Phase 4: Results appear
        timers.push(setTimeout(() => setPhase("results"), 2400 + SEARCH_TEXT.length * 150 + 300));

        // Phase 5: Select first result
        timers.push(setTimeout(() => {
            setPhase("select");
            setSelectedResult(0);
        }, 2400 + SEARCH_TEXT.length * 150 + 1500));

        // Loop: Reset and replay
        const totalDuration = 2400 + SEARCH_TEXT.length * 150 + 3500;
        timers.push(setTimeout(() => {
            setPhase("idle");
            setTypedChars(0);
            setSelectedResult(-1);
        }, totalDuration));

        const loopTimer = setInterval(() => {
            setPhase("idle");
            setTypedChars(0);
            setSelectedResult(-1);

            setTimeout(() => setPhase("key-press"), 800);
            setTimeout(() => setPhase("opening"), 1500);
            setTimeout(() => setPhase("typing"), 2200);

            for (let i = 0; i < SEARCH_TEXT.length; i++) {
                setTimeout(() => setTypedChars(i + 1), 2400 + i * 150);
            }

            setTimeout(() => setPhase("results"), 2400 + SEARCH_TEXT.length * 150 + 300);
            setTimeout(() => {
                setPhase("select");
                setSelectedResult(0);
            }, 2400 + SEARCH_TEXT.length * 150 + 1500);
        }, totalDuration + 1000);

        return () => {
            timers.forEach(clearTimeout);
            clearInterval(loopTimer);
        };
    }, []);

    const isOpen = phase !== "idle" && phase !== "key-press";
    const showResults = phase === "results" || phase === "select";

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            {/* Subtle grid background */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

            {/* Title */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold text-white text-center tracking-tight mb-3"
            >
                Everything starts with ⌘K
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-base text-slate-400 text-center mb-16 max-w-md"
            >
                No menus. No navigation. Every action is 2 keystrokes away.
            </motion.p>

            {/* Floating keyboard key animation */}
            <AnimatePresence>
                {phase === "key-press" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="absolute z-20 flex items-center gap-2"
                    >
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
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 150, damping: 25 }}
                        className="w-full max-w-xl z-10"
                    >
                        {/* Backdrop glow */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/5 blur-3xl rounded-full" />
                        </div>

                        <div className="relative rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 overflow-hidden">
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                                </svg>
                                <div className="flex-1 relative">
                                    <span className="text-white text-base">
                                        {SEARCH_TEXT.slice(0, typedChars)}
                                    </span>
                                    {phase === "typing" && (
                                        <motion.span
                                            className="inline-block w-0.5 h-5 bg-blue-500 ml-0.5 align-middle"
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity }}
                                        />
                                    )}
                                    {typedChars === 0 && phase === "opening" && (
                                        <>
                                            <span className="text-slate-500 text-base">Search anything...</span>
                                            <motion.span
                                                className="inline-block w-0.5 h-5 bg-blue-500 ml-0.5 align-middle"
                                                animate={{ opacity: [1, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity }}
                                            />
                                        </>
                                    )}
                                </div>
                                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 rounded text-slate-500 border border-slate-700">ESC</kbd>
                            </div>

                            {/* Results */}
                            <AnimatePresence>
                                {showResults && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-3 py-1.5">
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium px-2">Results</span>
                                        </div>
                                        {RESULTS.map((result, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.08 }}
                                                className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg transition-colors ${selectedResult === i ? "bg-blue-600/20 border border-blue-500/30" : "hover:bg-slate-800"}`}
                                            >
                                                <span className="text-lg">{result.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium ${selectedResult === i ? "text-blue-400" : "text-slate-200"}`}>{result.value}</p>
                                                    <p className="text-xs text-slate-500 truncate">{result.detail}</p>
                                                </div>
                                                <span className="text-[10px] uppercase tracking-wider text-slate-600 font-medium">{result.type}</span>
                                                {selectedResult === i && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-medium"
                                                    >
                                                        Enter ↵
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        ))}
                                        <div className="h-2" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Footer shortcuts */}
                            {showResults && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="px-5 py-2.5 border-t border-slate-800 flex items-center gap-4"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <kbd className="px-1 py-0.5 text-[9px] font-mono bg-slate-800 rounded text-slate-500 border border-slate-700">↑↓</kbd>
                                        <span className="text-[10px] text-slate-600">Navigate</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <kbd className="px-1 py-0.5 text-[9px] font-mono bg-slate-800 rounded text-slate-500 border border-slate-700">↵</kbd>
                                        <span className="text-[10px] text-slate-600">Open</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <kbd className="px-1 py-0.5 text-[9px] font-mono bg-slate-800 rounded text-slate-500 border border-slate-700">ESC</kbd>
                                        <span className="text-[10px] text-slate-600">Close</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Keyboard shortcuts at bottom */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-16 flex gap-6"
            >
                {SHORTCUTS.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + i * 0.08 }}
                        className="flex items-center gap-2"
                    >
                        <kbd className="w-7 h-7 flex items-center justify-center text-xs font-mono bg-slate-800 rounded-lg text-slate-400 border border-slate-700">{s.key}</kbd>
                        <span className="text-xs text-slate-500">{s.label}</span>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
