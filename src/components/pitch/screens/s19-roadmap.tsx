"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const NODES = [
    {
        id: "now",
        label: "NOW",
        color: "#22c55e",
        glow: "rgba(34,197,94,0.4)",
        x: "16%",
        features: ["Multi-branch POS", "Fleet AI brain", "Auto-invoicing", "Live tracking"],
    },
    {
        id: "next",
        label: "NEXT",
        color: "#3b82f6",
        glow: "rgba(59,130,246,0.4)",
        x: "50%",
        features: ["Driver app", "Insurance integration", "Dynamic pricing", "EV fleet support"],
    },
    {
        id: "horizon",
        label: "HORIZON",
        color: "#a855f7",
        glow: "rgba(168,85,247,0.4)",
        x: "84%",
        features: ["Marketplace API", "Franchise network", "Cross-border ops", "Predictive demand"],
    },
];

export function S19Roadmap() {
    const [phase, setPhase] = useState(0);
    const [lineProgress, setLineProgress] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 200),
            setTimeout(() => setPhase(2), 600),
            setTimeout(() => setPhase(3), 1800),
            setTimeout(() => setPhase(4), 3000),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    // Draw line
    useEffect(() => {
        if (phase >= 2) {
            let v = 0;
            const tick = () => { v += 1.2; if (v < 100) { setLineProgress(v); requestAnimationFrame(tick); } else setLineProgress(100); };
            requestAnimationFrame(tick);
        }
    }, [phase]);

    const nodeActivate = (xPct: number) => lineProgress >= xPct;

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden px-8">
            {/* Gradient background sweep */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "linear-gradient(90deg, rgba(34,197,94,0.04) 0%, rgba(59,130,246,0.04) 50%, rgba(168,85,247,0.04) 100%)",
                }}
            />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                className="text-center mb-16"
            >
                <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 mb-2">The Future</p>
                <h2 className="text-3xl font-black text-white">Where We&apos;re Going</h2>
            </motion.div>

            {/* Timeline container */}
            <div className="w-full max-w-4xl relative" style={{ height: "320px" }}>
                {/* Track line */}
                <div
                    className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800"
                    style={{ transform: "translateY(-50%)" }}
                />

                {/* Animated fill line */}
                {phase >= 2 && (
                    <motion.div
                        className="absolute top-1/2 left-0 h-0.5"
                        style={{
                            width: `${lineProgress}%`,
                            transform: "translateY(-50%)",
                            background: "linear-gradient(90deg, #22c55e, #3b82f6, #a855f7)",
                            boxShadow: "0 0 8px rgba(59,130,246,0.6)",
                        }}
                    />
                )}

                {/* Nodes */}
                {NODES.map((node, ni) => {
                    const xNum = parseFloat(node.x);
                    const active = nodeActivate(xNum);
                    return (
                        <div
                            key={node.id}
                            className="absolute top-1/2"
                            style={{ left: node.x, transform: "translate(-50%, -50%)" }}
                        >
                            {/* Node dot */}
                            <motion.div
                                animate={active ? { scale: [1, 1.35, 1] } : {}}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="relative w-20 h-20 rounded-full flex items-center justify-center"
                                style={{
                                    background: active ? `radial-gradient(circle, ${node.glow} 0%, transparent 70%)` : "transparent",
                                    border: `2px solid ${active ? node.color : "#334155"}`,
                                    boxShadow: active ? `0 0 20px ${node.glow}` : "none",
                                    transition: "all 0.5s ease",
                                }}
                            >
                                <span className="text-sm font-black tracking-widest" style={{ color: active ? node.color : "#475569" }}>
                                    {node.label}
                                </span>
                            </motion.div>

                            {/* Feature tags — float up from node */}
                            <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 w-40">
                                {node.features.map((feat, fi) => (
                                    <motion.div
                                        key={fi}
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={active && phase >= 3 + ni ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: fi * 0.12, type: "spring", stiffness: 70, damping: 16 }}
                                        className="px-2.5 py-1 rounded-full text-xs font-semibold text-center whitespace-nowrap"
                                        style={{
                                            border: `1px solid ${node.color}44`,
                                            backgroundColor: `${node.color}10`,
                                            color: node.color,
                                        }}
                                    >
                                        {feat}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Label above node */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={active ? { opacity: 1 } : {}}
                                className="absolute -top-10 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-400 whitespace-nowrap"
                            >
                                {ni === 0 ? "Today" : ni === 1 ? "Q3 2024" : "2025+"}
                            </motion.p>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={phase >= 4 ? { opacity: 1 } : {}}
                className="text-xs text-slate-600 mt-8 text-center"
            >
                Built modular. Each feature ships independently. Bi-weekly releases.
            </motion.p>
        </section>
    );
}
