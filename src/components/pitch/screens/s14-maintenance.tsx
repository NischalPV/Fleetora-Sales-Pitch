"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { Brain } from "lucide-react";

type CardData = { id: string; plate: string; model: string; km: string; tag: string; tagColor: string };

const COLUMNS: { title: string; color: string; cards: CardData[] }[] = [
    {
        title: "Due for Service",
        color: "#ef4444",
        cards: [
            { id: "1", plate: "AZ-TUC-4821", model: "Toyota Camry", km: "500 km", tag: "Overdue", tagColor: "#ef4444" },
            { id: "2", plate: "AZ-PHX-2234", model: "Ford Explorer", km: "1,200 km", tag: "Due Soon", tagColor: "#f59e0b" },
        ],
    },
    {
        title: "In Service",
        color: "#f59e0b",
        cards: [
            { id: "3", plate: "CA-LAX-7791", model: "Honda Civic", km: "Service #4", tag: "In Bay", tagColor: "#3b82f6" },
        ],
    },
    {
        title: "Ready",
        color: "#22c55e",
        cards: [
            { id: "4", plate: "AZ-SCO-1145", model: "Nissan Altima", km: "Full check", tag: "Fleet Ready", tagColor: "#22c55e" },
            { id: "5", plate: "NV-LAS-8890", model: "Chevy Malibu", km: "Full check", tag: "Fleet Ready", tagColor: "#22c55e" },
            { id: "6", plate: "CA-SFO-3312", model: "Hyundai Sonata", km: "Full check", tag: "Fleet Ready", tagColor: "#22c55e" },
        ],
    },
];

function VehicleCard({ card, delay = 0 }: { card: CardData; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.35 }}
            className="bg-slate-800/60 rounded-xl border border-slate-700/60 p-3 mb-2"
        >
            <div className="flex justify-between items-start mb-1.5">
                <span className="text-[10px] font-bold text-white tracking-wide">{card.plate}</span>
                <span
                    className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: `${card.tagColor}22`, color: card.tagColor }}
                >
                    {card.tag}
                </span>
            </div>
            <p className="text-[10px] text-slate-400">{card.model}</p>
            <p className="text-[9px] text-slate-600 mt-0.5">{card.km}</p>
        </motion.div>
    );
}

export function S14Maintenance() {
    const [phase, setPhase] = useState(0);
    const movingCardControls = useAnimation();

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 900),
            setTimeout(() => setPhase(3), 1800),
            setTimeout(() => setPhase(4), 2800),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    useEffect(() => {
        if (phase >= 4) {
            // Animate card from Due column toward In Service column
            movingCardControls.start({
                x: [0, 20, 330, 330],
                opacity: [1, 1, 1, 0],
                scale: [1, 1.05, 1.05, 0.95],
                transition: { duration: 1.6, ease: "easeInOut", times: [0, 0.1, 0.8, 1] },
            });
        }
    }, [phase, movingCardControls]);

    return (
        <section className="h-screen w-full relative overflow-hidden bg-slate-950 flex flex-col items-start justify-center px-8 py-6">
            {/* Fleet Brain Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                className="w-full max-w-5xl mx-auto mb-4 flex items-center gap-3 rounded-xl px-4 py-2.5 border border-blue-500/25 bg-blue-500/8"
            >
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="w-5 h-5 rounded-full bg-blue-500/30 flex items-center justify-center flex-shrink-0"
                >
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                </motion.div>
                <Brain className="h-4 w-4 text-emerald-400 shrink-0" />
                <p className="text-xs text-slate-300">
                    <span className="font-semibold text-white">Fleet Brain: </span>
                    Schedule <span className="text-amber-400 font-semibold">AZ-TUC-4821 (Tucson)</span> for Wednesday — predicted 34% utilization. Optimal service window.
                </p>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={phase >= 2 ? { opacity: 1 } : {}}
                    className="ml-auto text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 whitespace-nowrap"
                >
                    Accept
                </motion.button>
            </motion.div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={phase >= 1 ? { opacity: 1 } : {}}
                className="w-full max-w-5xl mx-auto mb-3"
            >
                <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400">The Intelligence</p>
                <h2 className="text-2xl font-bold text-white">Maintenance Board</h2>
            </motion.div>

            {/* Kanban Board */}
            <div className="w-full max-w-5xl mx-auto flex gap-4 flex-1 min-h-0">
                {COLUMNS.map((col, ci) => (
                    <motion.div
                        key={ci}
                        initial={{ opacity: 0, x: -30 }}
                        animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: ci * 0.18, type: "spring", stiffness: 60, damping: 18 }}
                        className="flex-1 bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden flex flex-col"
                    >
                        {/* Column header */}
                        <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                            <span className="text-xs font-semibold text-slate-300">{col.title}</span>
                            <span className="ml-auto text-[10px] text-slate-600 font-medium">{col.cards.length}</span>
                        </div>

                        {/* Cards */}
                        <div className="p-3 flex-1 overflow-auto relative">
                            {col.cards.map((card, cardi) => (
                                <VehicleCard
                                    key={card.id}
                                    card={card}
                                    delay={phase >= 3 ? ci * 0.15 + cardi * 0.1 : 999}
                                />
                            ))}

                            {/* Animated "flying" card for Due column */}
                            {ci === 0 && phase >= 3 && (
                                <motion.div
                                    animate={movingCardControls}
                                    className="absolute top-3 left-3 right-3 bg-blue-500/15 rounded-xl border border-blue-500/40 p-3 pointer-events-none z-20"
                                    style={{ boxShadow: "0 4px 20px rgba(59,130,246,0.25)" }}
                                >
                                    <div className="flex justify-between items-start mb-1.5">
                                        <span className="text-[10px] font-bold text-white tracking-wide">AZ-TUC-4821</span>
                                        <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                                            Moving
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400">Toyota Camry</p>
                                    <p className="text-[9px] text-slate-600 mt-0.5">500 km overdue</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer stat */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={phase >= 3 ? { opacity: 1 } : {}}
                className="w-full max-w-5xl mx-auto mt-3 flex gap-6"
            >
                {[
                    { label: "Avg Service Turnaround", value: "1.4 days", color: "text-emerald-400" },
                    { label: "Unplanned Downtime", value: "−62%", color: "text-blue-400" },
                    { label: "Fleet Readiness", value: "96%", color: "text-white" },
                ].map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex gap-2 items-baseline"
                    >
                        <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
                        <span className="text-[10px] text-slate-500">{s.label}</span>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
