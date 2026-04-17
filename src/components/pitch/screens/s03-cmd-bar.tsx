"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Car } from "lucide-react";

const SEQUENCES = [
    {
        label: "Find a customer",
        searchText: "Ahmad Kh",
        results: [
            { icon: "👤", value: "Ahmad Khalil", detail: "Fleet Corp • Gold tier • 12 rentals", type: "Customer" },
            { icon: "👤", value: "Ahmad Khoury", detail: "Walk-in • 2 rentals", type: "Customer" },
        ],
        selectIndex: 0,
        card: {
            title: "Ahmad Khalil",
            subtitle: "Fleet Corp — Corporate Account",
            stats: [
                { label: "Total Rentals", value: "12" },
                { label: "Credit Available", value: "$12,000" },
                { label: "Account Tier", value: "Gold" },
                { label: "Active Now", value: "3 vehicles" },
            ],
        },
    },
    {
        label: "Find a vehicle",
        searchText: "Tucson",
        results: [
            { icon: "🚗", value: "Tucson HSE • ABC-1234", detail: "Airport • Available • SUV", type: "Vehicle" },
            { icon: "🚗", value: "Tucson GL • XYZ-5678", detail: "Downtown • Rented", type: "Vehicle" },
            { icon: "🚗", value: "Tucson N-Line • QRS-9012", detail: "Mall • In Service", type: "Vehicle" },
        ],
        selectIndex: 0,
        card: {
            title: "Tucson HSE",
            subtitle: "ABC-1234 — Airport Branch",
            stats: [
                { label: "Status", value: "Available" },
                { label: "Odometer", value: "32,400 km" },
                { label: "Next Service", value: "In 2,100 km" },
                { label: "Revenue/mo", value: "$2,840" },
            ],
        },
    },
    {
        label: "Find a booking",
        searchText: "BK-2026",
        results: [
            { icon: "📋", value: "BK-20260417-042", detail: "Ahmad K. • Tucson HSE • Active", type: "Booking" },
            { icon: "📋", value: "BK-20260416-039", detail: "Sara M. • Accent • Returned", type: "Booking" },
        ],
        selectIndex: 0,
        card: {
            title: "BK-20260417-042",
            subtitle: "Ahmad Khalil — 3 day rental",
            stats: [
                { label: "Vehicle", value: "Tucson HSE" },
                { label: "Day", value: "1 of 3" },
                { label: "Mileage", value: "142 km" },
                { label: "Status", value: "Active" },
            ],
        },
    },
];

const SHORTCUTS = [
    { key: "N", label: "New Booking" },
    { key: "M", label: "Fleet Map" },
    { key: "T", label: "Transfers" },
    { key: "S", label: "Service" },
    { key: "R", label: "Returns" },
];

// Card positions: 0 = top center (above heading), 1 = left side, 2 = right side
const CARD_POSITIONS = [
    "top-[8%] left-1/2 -translate-x-1/2",      // Customer: top center
    "top-1/2 -translate-y-1/2 left-[5%]",       // Vehicle: left side
    "top-1/2 -translate-y-1/2 right-[5%]",      // Booking: right side
];

type Phase = "idle" | "key-press" | "opening" | "typing" | "results" | "selecting" | "selected" | "card-shown" | "fading" | "paused";

function GlassCard({ card, position }: { card: typeof SEQUENCES[0]["card"]; position: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className={`absolute ${position} w-72 md:w-80 z-20`}
        >
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl shadow-black/20">
                <p className="text-base font-bold text-white">{card.title}</p>
                <p className="text-xs text-white/50 mt-1">{card.subtitle}</p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                    {card.stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                            className="bg-white/5 rounded-xl p-2.5 border border-white/5"
                        >
                            <p className="text-[9px] text-white/40 uppercase tracking-wider font-medium">{s.label}</p>
                            <p className="text-sm font-bold text-white mt-0.5">{s.value}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export function S03CmdBar() {
    const [seqIndex, setSeqIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>("idle");
    const [typedChars, setTypedChars] = useState(0);
    const [shownCards, setShownCards] = useState<number[]>([]);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        const allTimers: NodeJS.Timeout[] = [];

        function startDemo() {
            setSeqIndex(0);
            setPhase("idle");
            setTypedChars(0);
            setShownCards([]);
            setCountdown(0);

            // === Sequence 0: Customer ===
            let t = 500;
            allTimers.push(setTimeout(() => setPhase("key-press"), t));
            t += 700;
            allTimers.push(setTimeout(() => setPhase("opening"), t));
            t += 500;
            allTimers.push(setTimeout(() => { setPhase("typing"); setTypedChars(0); }, t));
            t += 200;
            const s0 = SEQUENCES[0].searchText;
            for (let i = 0; i < s0.length; i++) {
                allTimers.push(setTimeout(() => setTypedChars(i + 1), t + i * 120));
            }
            t += s0.length * 120 + 250;
            allTimers.push(setTimeout(() => setPhase("results"), t));
            t += 500;
            allTimers.push(setTimeout(() => setPhase("selecting"), t));
            t += 300;
            allTimers.push(setTimeout(() => setPhase("selected"), t));
            t += 400;
            allTimers.push(setTimeout(() => { setPhase("card-shown"); setShownCards([0]); }, t));
            t += 1200;
            allTimers.push(setTimeout(() => setPhase("fading"), t));
            t += 400;

            // === Sequence 1: Vehicle ===
            allTimers.push(setTimeout(() => { setSeqIndex(1); setTypedChars(0); setPhase("typing"); }, t));
            t += 200;
            const s1 = SEQUENCES[1].searchText;
            for (let i = 0; i < s1.length; i++) {
                allTimers.push(setTimeout(() => setTypedChars(i + 1), t + i * 120));
            }
            t += s1.length * 120 + 250;
            allTimers.push(setTimeout(() => setPhase("results"), t));
            t += 500;
            allTimers.push(setTimeout(() => setPhase("selecting"), t));
            t += 300;
            allTimers.push(setTimeout(() => setPhase("selected"), t));
            t += 400;
            allTimers.push(setTimeout(() => { setPhase("card-shown"); setShownCards([0, 1]); }, t));
            t += 1200;
            allTimers.push(setTimeout(() => setPhase("fading"), t));
            t += 400;

            // === Sequence 2: Booking ===
            allTimers.push(setTimeout(() => { setSeqIndex(2); setTypedChars(0); setPhase("typing"); }, t));
            t += 200;
            const s2 = SEQUENCES[2].searchText;
            for (let i = 0; i < s2.length; i++) {
                allTimers.push(setTimeout(() => setTypedChars(i + 1), t + i * 120));
            }
            t += s2.length * 120 + 250;
            allTimers.push(setTimeout(() => setPhase("results"), t));
            t += 500;
            allTimers.push(setTimeout(() => setPhase("selecting"), t));
            t += 300;
            allTimers.push(setTimeout(() => setPhase("selected"), t));
            t += 400;
            allTimers.push(setTimeout(() => { setPhase("card-shown"); setShownCards([0, 1, 2]); }, t));
            t += 1500;

            // === Pause with countdown ===
            allTimers.push(setTimeout(() => { setPhase("paused"); setCountdown(5); }, t));
            for (let c = 4; c >= 0; c--) {
                allTimers.push(setTimeout(() => setCountdown(c), t + (5 - c) * 1000));
            }
            t += 5500;

            // === Restart ===
            allTimers.push(setTimeout(startDemo, t));
        }

        startDemo();
        return () => allTimers.forEach(clearTimeout);
    }, []);

    const currentSeq = SEQUENCES[seqIndex];
    const isOpen = phase !== "idle" && phase !== "key-press" && phase !== "paused";
    const showResults = phase === "results" || phase === "selecting" || phase === "selected" || phase === "card-shown";

    return (
        <section className="h-screen w-full flex items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="absolute top-6 left-8 flex items-center gap-2 z-30">
                <div className="relative">
                    <Car className="h-5 w-5 text-emerald-400" />
                    <div className="absolute -inset-1 bg-emerald-400/15 rounded-full blur-sm -z-10" />
                </div>
                <span className="text-sm font-bold text-white/60 tracking-tight">Fleetora</span>
            </motion.div>

            {/* Animated connection arrows */}
            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 1440 900" preserveAspectRatio="none">
                <defs>
                    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                        <path d="M0,0 L8,3 L0,6" fill="none" stroke="#3b82f6" strokeWidth="1" />
                    </marker>
                    <marker id="arrowhead-green" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                        <path d="M0,0 L8,3 L0,6" fill="none" stroke="#10b981" strokeWidth="1" />
                    </marker>
                    <marker id="arrowhead-violet" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                        <path d="M0,0 L8,3 L0,6" fill="none" stroke="#8b5cf6" strokeWidth="1" />
                    </marker>
                </defs>

                {/* Arrow to customer card (top center) — curved upward */}
                <AnimatePresence>
                    {shownCards.includes(0) && (
                        <motion.path
                            d="M720 420 C720 380 680 280 720 180"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="1.5"
                            strokeDasharray="2 6"
                            strokeLinecap="round"
                            markerEnd="url(#arrowhead)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                    )}
                </AnimatePresence>

                {/* Arrow to vehicle card (left side) — curved left */}
                <AnimatePresence>
                    {shownCards.includes(1) && (
                        <motion.path
                            d="M520 470 C450 490 350 510 300 450"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1.5"
                            strokeDasharray="2 6"
                            strokeLinecap="round"
                            markerEnd="url(#arrowhead-green)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                    )}
                </AnimatePresence>

                {/* Arrow to booking card (right side) — curved right */}
                <AnimatePresence>
                    {shownCards.includes(2) && (
                        <motion.path
                            d="M920 470 C990 490 1090 510 1140 450"
                            fill="none"
                            stroke="#8b5cf6"
                            strokeWidth="1.5"
                            strokeDasharray="2 6"
                            strokeLinecap="round"
                            markerEnd="url(#arrowhead-violet)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                    )}
                </AnimatePresence>
            </svg>

            {/* Glass cards in their positions */}
            <AnimatePresence>
                {shownCards.map((cardIdx) => (
                    <GlassCard key={cardIdx} card={SEQUENCES[cardIdx].card} position={CARD_POSITIONS[cardIdx]} />
                ))}
            </AnimatePresence>

            {/* Center column */}
            <div className="flex flex-col items-center w-full max-w-xl z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-2"
                >
                    Everything starts with ⌘K
                </motion.h2>
                <div className="h-6 mb-8">
                    <AnimatePresence mode="wait">
                        {phase !== "paused" ? (
                            <motion.p key={seqIndex} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-sm text-slate-400 text-center">
                                {currentSeq.label}
                            </motion.p>
                        ) : (
                            <motion.p key="pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-slate-500 text-center font-mono">
                                Restarting in {countdown}...
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* ⌘K keystroke */}
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
                            animate={{ opacity: phase === "fading" ? 0.5 : 1, scale: phase === "fading" ? 0.98 : 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 150, damping: 25 }}
                            className="w-full"
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

                            <div className="relative rounded-2xl border border-slate-700 bg-slate-900/95 backdrop-blur-sm shadow-2xl shadow-black/50 overflow-hidden">
                                {/* Search input */}
                                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                                    <div className="flex-1">
                                        <span className="text-white text-base">{currentSeq.searchText.slice(0, typedChars)}</span>
                                        {(phase === "typing" || phase === "opening") && (
                                            <motion.span className="inline-block w-0.5 h-5 bg-blue-500 ml-0.5 align-middle" animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} />
                                        )}
                                        {typedChars === 0 && <span className="text-slate-500 text-base">Search anything...</span>}
                                    </div>
                                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 rounded text-slate-500 border border-slate-700">ESC</kbd>
                                </div>

                                {/* Results */}
                                <AnimatePresence>
                                    {showResults && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                                            <div className="px-3 py-1.5"><span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium px-2">Results</span></div>
                                            {currentSeq.results.map((result, i) => (
                                                <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                                                    className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg transition-all ${
                                                        i === currentSeq.selectIndex && phase !== "results" ? "bg-blue-600/20 border border-blue-500/30" : ""
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
                                <div className="px-5 py-2 border-t border-slate-800 flex items-center gap-4">
                                    <div className="flex items-center gap-1.5"><kbd className="px-1 py-0.5 text-[9px] font-mono bg-slate-800 rounded text-slate-500 border border-slate-700">↑↓</kbd><span className="text-[10px] text-slate-600">Navigate</span></div>
                                    <div className="flex items-center gap-1.5"><kbd className="px-1 py-0.5 text-[9px] font-mono bg-slate-800 rounded text-slate-500 border border-slate-700">↵</kbd><span className="text-[10px] text-slate-600">Open</span></div>
                                    <div className="flex items-center gap-1.5"><kbd className="px-1 py-0.5 text-[9px] font-mono bg-slate-800 rounded text-slate-500 border border-slate-700">ESC</kbd><span className="text-[10px] text-slate-600">Close</span></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Paused state — countdown ring */}
                <AnimatePresence>
                    {phase === "paused" && (
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
                            <div className="relative w-16 h-16">
                                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                                    <circle cx="32" cy="32" r="28" fill="none" stroke="#1e293b" strokeWidth="2" />
                                    <motion.circle cx="32" cy="32" r="28" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeDasharray={176} initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: 176 }} transition={{ duration: 5, ease: "linear" }} />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white font-mono">{countdown}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Keyboard shortcuts */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute bottom-12 flex gap-6">
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
