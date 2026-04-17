"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const BRANCHES = [
    { name: "Airport", x: 35, y: 25, vehicles: 24, util: "92%", color: "#ef4444" },
    { name: "Downtown", x: 55, y: 45, vehicles: 18, util: "78%", color: "#3b82f6" },
    { name: "Mall", x: 70, y: 30, vehicles: 15, util: "85%", color: "#3b82f6" },
    { name: "Industrial", x: 25, y: 60, vehicles: 12, util: "61%", color: "#f59e0b" },
    { name: "Beach", x: 80, y: 65, vehicles: 8, util: "45%", color: "#22c55e" },
];

export function S09FleetMap() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 400),
            setTimeout(() => setPhase(2), 1200),
            setTimeout(() => setPhase(3), 2500),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full relative overflow-hidden bg-slate-950">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="absolute top-6 left-10 z-20">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400">The Operations Floor</p>
                <p className="text-xs text-slate-500 mt-0.5">Fleet Network Overview</p>
            </motion.div>

            {/* City name */}
            <motion.h2
                initial={{ opacity: 0 }}
                animate={phase >= 1 ? { opacity: 1 } : {}}
                className="absolute top-6 right-10 text-xl font-bold text-white/10 z-10"
            >
                Metro Area — 77 vehicles
            </motion.h2>

            {/* Abstract map background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

                {/* Connection lines between branches */}
                <svg className="absolute inset-0 w-full h-full">
                    {phase >= 2 && BRANCHES.map((from, i) =>
                        BRANCHES.slice(i + 1).map((to, j) => (
                            <motion.line
                                key={`${i}-${j}`}
                                x1={`${from.x}%`} y1={`${from.y}%`}
                                x2={`${to.x}%`} y2={`${to.y}%`}
                                stroke="#1e293b"
                                strokeWidth="1"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8, delay: (i + j) * 0.1 }}
                            />
                        ))
                    )}
                </svg>
            </div>

            {/* Branch clusters */}
            {BRANCHES.map((branch, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 80, damping: 15, delay: i * 0.15 }}
                    className="absolute z-10"
                    style={{ left: `${branch.x}%`, top: `${branch.y}%`, transform: "translate(-50%, -50%)" }}
                >
                    {/* Glow */}
                    <div className="absolute inset-0 w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(circle, ${branch.color}15 0%, transparent 70%)`, left: "50%", top: "50%" }} />

                    {/* Cluster circle */}
                    <div className="w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center" style={{ borderColor: branch.color, backgroundColor: "rgba(15,23,42,0.9)" }}>
                        <span className="text-lg font-bold text-white">{branch.vehicles}</span>
                        <span className="text-[8px] text-slate-400">vehicles</span>
                    </div>

                    {/* Label */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                        <p className="text-[10px] font-semibold text-white">{branch.name}</p>
                        <p className="text-[9px]" style={{ color: branch.color }}>{branch.util} utilized</p>
                    </div>
                </motion.div>
            ))}

            {/* Summary bar at bottom */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
            >
                <div className="flex gap-6 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3">
                    {[
                        { label: "Total Fleet", value: "77", color: "text-white" },
                        { label: "On Road", value: "52", color: "text-blue-400" },
                        { label: "Available", value: "18", color: "text-emerald-400" },
                        { label: "In Service", value: "5", color: "text-amber-400" },
                        { label: "Overdue", value: "2", color: "text-red-400" },
                    ].map((s, i) => (
                        <div key={i} className="text-center">
                            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-[9px] text-slate-500 uppercase tracking-wider">{s.label}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
