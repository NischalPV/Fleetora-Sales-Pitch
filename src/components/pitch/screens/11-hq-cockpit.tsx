"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const BRANCHES = [
    { name: "Airport", util: 92, color: "bg-blue-500" },
    { name: "Downtown", util: 78, color: "bg-blue-400" },
    { name: "Beach", util: 45, color: "bg-amber-400" },
    { name: "Mall", util: 61, color: "bg-blue-300" },
];

const BARS = [18, 22, 19, 25, 30, 28, 35, 32, 38, 36, 42, 44];
const OPS = [
    { label: "Checkouts", value: 32, color: "text-emerald-400", bg: "bg-emerald-500/20" },
    { label: "Returns", value: 18, color: "text-blue-400", bg: "bg-blue-500/20" },
    { label: "Transfers", value: 4, color: "text-amber-400", bg: "bg-amber-500/20" },
    { label: "Alerts", value: 2, color: "text-red-400", bg: "bg-red-500/20" },
];

export function HqCockpitScreen() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 800),
            setTimeout(() => setPhase(3), 1500),
            setTimeout(() => setPhase(4), 2200),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-4">Multi-Branch</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-3">HQ Cockpit</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-400 text-center mb-8 max-w-lg">Your entire operation. One screen. Real time.</motion.p>

            {/* Phase 1: Browser frame appears */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                className="w-full max-w-4xl rounded-2xl border border-slate-700 overflow-hidden bg-slate-900"
                style={{ boxShadow: "0 25px 80px -15px rgba(0,0,0,0.4)" }}
            >
                <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700/50">
                    <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-300" /><div className="w-2.5 h-2.5 rounded-full bg-amber-300" /><div className="w-2.5 h-2.5 rounded-full bg-green-300" /></div>
                    <div className="flex-1 bg-slate-900 rounded-md px-3 py-1 ml-2 border border-slate-700/50"><span className="text-[10px] text-slate-400">app.fleetora.com/hq/overview</span></div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-slate-700/50">
                    {/* Phase 2: Utilization */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="p-4 border-b border-slate-700/50"
                    >
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Fleet Utilization by Branch</p>
                        <div className="space-y-2.5">
                            {BRANCHES.map((b, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-xs text-slate-300 w-16 shrink-0">{b.name}</span>
                                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={phase >= 2 ? { width: `${b.util}%` } : { width: 0 }}
                                            transition={{ delay: i * 0.1, duration: 0.6 }}
                                            className={`h-full rounded-full ${b.color}`}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-slate-300 w-8 text-right tabular-nums">{b.util}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Phase 3: Revenue chart */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="p-4 border-b border-slate-700/50"
                    >
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Revenue — Last 12 Months ($K)</p>
                        <div className="flex items-end gap-1 h-16">
                            {BARS.map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={phase >= 3 ? { height: `${(h / 44) * 100}%` } : { height: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.4 }}
                                    className="flex-1 bg-blue-500 rounded-t opacity-80"
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-1"><span className="text-[8px] text-slate-400">May</span><span className="text-[8px] text-slate-400">Apr</span></div>
                    </motion.div>

                    {/* Phase 4: Today's ops */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="p-4"
                    >
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Today&apos;s Operations</p>
                        <div className="grid grid-cols-2 gap-2">
                            {OPS.map((op, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.08 }}
                                    className={`rounded-xl p-2.5 ${op.bg}`}
                                >
                                    <p className="text-[9px] text-slate-400">{op.label}</p>
                                    <p className={`text-2xl font-bold ${op.color}`}>{op.value}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Phase 4: Fleet Brain teaser */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="p-4"
                    >
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Fleet Brain</p>
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={phase >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                    <span className="text-[8px] text-white font-bold">AI</span>
                                </div>
                                <span className="text-xs font-semibold text-blue-300">3 recommendations pending</span>
                            </div>
                            <p className="text-[10px] text-blue-400">Rebalancing · Demand alerts · Maintenance window</p>
                            <div className="mt-2 flex gap-1">
                                <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium cursor-pointer">Review</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
