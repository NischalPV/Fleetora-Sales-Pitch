"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function S10HqCockpit() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 1000),
            setTimeout(() => setPhase(3), 2000),
            setTimeout(() => setPhase(4), 3000),
            setTimeout(() => setPhase(5), 4000),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full relative overflow-hidden bg-slate-950 flex flex-col items-center justify-center px-8">
            {/* Title */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 z-10">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 mb-2">The Operations Floor</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">The HQ Cockpit</h2>
                <p className="text-sm text-slate-400 mt-1">Your entire operation. One screen. 7 AM with your coffee.</p>
            </motion.div>

            {/* 4-quadrant dashboard */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                className="w-full max-w-5xl rounded-2xl border border-slate-700 overflow-hidden bg-slate-900"
                style={{ boxShadow: "0 40px 100px -20px rgba(0,0,0,0.5)" }}
            >
                {/* Chrome */}
                <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 bg-slate-700/50 rounded-md px-3 py-1 ml-2 border border-slate-600/50">
                        <span className="text-[10px] text-slate-400">app.fleetora.com/hq/cockpit</span>
                    </div>
                </div>

                {/* 4 quadrants */}
                <div className="grid grid-cols-2 gap-px bg-slate-700/30 h-[420px]">
                    {/* Q1: Fleet Utilization */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 2 ? { opacity: 1 } : {}}
                        className="bg-slate-900 p-4"
                    >
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-3">Fleet Utilization by Branch</p>
                        {[
                            { name: "Airport", util: 92, color: "#ef4444" },
                            { name: "Downtown", util: 78, color: "#3b82f6" },
                            { name: "Mall", util: 85, color: "#3b82f6" },
                            { name: "Industrial", util: 61, color: "#f59e0b" },
                            { name: "Beach", util: 45, color: "#22c55e" },
                        ].map((b, i) => (
                            <div key={i} className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] text-slate-400 w-16">{b.name}</span>
                                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: b.color }}
                                        initial={{ width: 0 }}
                                        animate={phase >= 2 ? { width: `${b.util}%` } : {}}
                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                    />
                                </div>
                                <span className="text-[10px] font-medium text-white w-8">{b.util}%</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Q2: Revenue */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 3 ? { opacity: 1 } : {}}
                        className="bg-slate-900 p-4"
                    >
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-3">Revenue — Last 12 Months ($K)</p>
                        <div className="h-32 flex items-end gap-1">
                            {[18, 22, 20, 28, 25, 32, 30, 35, 33, 38, 36, 42].map((h, i) => (
                                <motion.div
                                    key={i}
                                    className="flex-1 rounded-sm bg-blue-500/70"
                                    initial={{ height: 0 }}
                                    animate={phase >= 3 ? { height: `${(h / 42) * 100}%` } : {}}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-[8px] text-slate-600">May</span>
                            <span className="text-[8px] text-slate-600">Apr</span>
                        </div>
                    </motion.div>

                    {/* Q3: Today's Operations */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 4 ? { opacity: 1 } : {}}
                        className="bg-slate-900 p-4"
                    >
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-3">Today&apos;s Operations</p>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: "Checkouts", value: "32", bg: "bg-emerald-500/10", color: "text-emerald-400" },
                                { label: "Returns", value: "18", bg: "bg-blue-500/10", color: "text-blue-400" },
                                { label: "Transfers", value: "4", bg: "bg-amber-500/10", color: "text-amber-400" },
                                { label: "Alerts", value: "2", bg: "bg-red-500/10", color: "text-red-400" },
                            ].map((card, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={phase >= 4 ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ delay: i * 0.1 }}
                                    className={`${card.bg} rounded-xl p-3 border border-slate-700/30`}
                                >
                                    <p className="text-[8px] text-slate-500 uppercase">{card.label}</p>
                                    <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Q4: Fleet Brain */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 5 ? { opacity: 1 } : {}}
                        className="bg-slate-900 p-4"
                    >
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-3">Fleet Brain</p>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
                            className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                </div>
                                <p className="text-xs font-semibold text-white">3 recommendations pending</p>
                            </div>
                            <div className="space-y-1.5">
                                {["Rebalance: Move 2 SUVs Beach \u2192 Airport", "Demand alert: Conference bookings +40%", "Maintenance: Tucson ABC-1234 due in 500km"].map((rec, i) => (
                                    <motion.p
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={phase >= 5 ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.3 + i * 0.15 }}
                                        className="text-[10px] text-slate-400"
                                    >
                                        &bull; {rec}
                                    </motion.p>
                                ))}
                            </div>
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={phase >= 5 ? { opacity: 1 } : {}}
                                transition={{ delay: 0.8 }}
                                className="mt-3 text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
                            >
                                Review All &rarr;
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
