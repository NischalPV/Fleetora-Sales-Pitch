"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const BRANCHES = [
    {
        name: "Airport",
        util: 92,
        revenue: "$8.2K",
        bookings: 24,
        spark: [55, 70, 68, 80, 85, 92],
        badge: "bg-emerald-500/20 text-emerald-400",
        badgeLabel: "High Demand",
        barColor: "bg-emerald-500",
    },
    {
        name: "Downtown",
        util: 78,
        revenue: "$5.1K",
        bookings: 18,
        spark: [60, 65, 58, 70, 74, 78],
        badge: "bg-blue-500/20 text-blue-400",
        badgeLabel: "Stable",
        barColor: "bg-blue-500",
    },
];

export function BranchAnalyticsScreen() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 400),
            setTimeout(() => setPhase(2), 1200),
            setTimeout(() => setPhase(3), 2000),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-4">Branch Analytics</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-3">Branch Analytics</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-400 text-center mb-10 max-w-xl">Drill into any branch. Compare side by side. Live data, not monthly reports.</motion.p>

            <div className="grid grid-cols-2 gap-5 w-full max-w-3xl">
                {/* Phase 1: Left card (Airport) slides in from left */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={phase >= 1 ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 60, damping: 18 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5"
                    style={{ boxShadow: "0 8px 30px -8px rgba(0,0,0,0.3)" }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Branch</p>
                            <p className="text-xl font-bold text-white">{BRANCHES[0].name}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${BRANCHES[0].badge}`}>{BRANCHES[0].badgeLabel}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-700/50">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Util.</p>
                            <p className="text-lg font-bold text-white">{BRANCHES[0].util}%</p>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-700/50">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Revenue</p>
                            <p className="text-lg font-bold text-white">{BRANCHES[0].revenue}</p>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-700/50">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Bookings</p>
                            <p className="text-lg font-bold text-white">{BRANCHES[0].bookings}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-2">Utilization Trend (6 days)</p>
                        <div className="flex items-end gap-1 h-10">
                            {BRANCHES[0].spark.map((h, j) => (
                                <motion.div
                                    key={j}
                                    initial={{ height: 0 }}
                                    animate={phase >= 3 ? { height: `${(h / 100) * 100}%` } : { height: 0 }}
                                    transition={{ delay: j * 0.06, duration: 0.4 }}
                                    className={`flex-1 rounded-t ${BRANCHES[0].barColor} opacity-75`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={phase >= 3 ? { width: `${BRANCHES[0].util}%` } : { width: 0 }}
                                transition={{ delay: 0.1, duration: 0.7 }}
                                className={`h-full rounded-full ${BRANCHES[0].barColor}`}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Phase 2: Right card (Downtown) slides in from right */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={phase >= 2 ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 60, damping: 18 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5"
                    style={{ boxShadow: "0 8px 30px -8px rgba(0,0,0,0.3)" }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Branch</p>
                            <p className="text-xl font-bold text-white">{BRANCHES[1].name}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${BRANCHES[1].badge}`}>{BRANCHES[1].badgeLabel}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-700/50">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Util.</p>
                            <p className="text-lg font-bold text-white">{BRANCHES[1].util}%</p>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-700/50">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Revenue</p>
                            <p className="text-lg font-bold text-white">{BRANCHES[1].revenue}</p>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-700/50">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Bookings</p>
                            <p className="text-lg font-bold text-white">{BRANCHES[1].bookings}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-2">Utilization Trend (6 days)</p>
                        <div className="flex items-end gap-1 h-10">
                            {BRANCHES[1].spark.map((h, j) => (
                                <motion.div
                                    key={j}
                                    initial={{ height: 0 }}
                                    animate={phase >= 3 ? { height: `${(h / 100) * 100}%` } : { height: 0 }}
                                    transition={{ delay: j * 0.06, duration: 0.4 }}
                                    className={`flex-1 rounded-t ${BRANCHES[1].barColor} opacity-75`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={phase >= 3 ? { width: `${BRANCHES[1].util}%` } : { width: 0 }}
                                transition={{ delay: 0.1, duration: 0.7 }}
                                className={`h-full rounded-full ${BRANCHES[1].barColor}`}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-6 text-sm text-slate-400 text-center">Click any branch to drill into bookings, vehicles, agents, and revenue breakdown.</motion.p>
        </section>
    );
}
