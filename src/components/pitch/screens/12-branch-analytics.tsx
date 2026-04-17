"use client";

import { motion } from "framer-motion";

const BRANCHES = [
    {
        name: "Airport",
        util: 92,
        revenue: "$8.2K",
        bookings: 24,
        spark: [55, 70, 68, 80, 85, 92],
        badge: "bg-emerald-50 text-emerald-700",
        badgeLabel: "High Demand",
        barColor: "bg-emerald-500",
    },
    {
        name: "Downtown",
        util: 78,
        revenue: "$5.1K",
        bookings: 18,
        spark: [60, 65, 58, 70, 74, 78],
        badge: "bg-blue-50 text-blue-700",
        badgeLabel: "Stable",
        barColor: "bg-blue-500",
    },
];

export function BranchAnalyticsScreen() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-600 mb-4">Branch Analytics</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-slate-900 text-center tracking-tight mb-3">Branch Analytics</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-500 text-center mb-10 max-w-xl">Drill into any branch. Compare side by side. Live data, not monthly reports.</motion.p>

            <div className="grid grid-cols-2 gap-5 w-full max-w-3xl">
                {BRANCHES.map((branch, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 60 }} className="bg-slate-50 border border-slate-200 rounded-2xl p-5" style={{ boxShadow: "0 8px 30px -8px rgba(0,0,0,0.07)" }}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Branch</p>
                                <p className="text-xl font-bold text-slate-900">{branch.name}</p>
                            </div>
                            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${branch.badge}`}>{branch.badgeLabel}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                                <p className="text-[9px] text-slate-400 uppercase tracking-wider">Util.</p>
                                <p className="text-lg font-bold text-slate-900">{branch.util}%</p>
                            </div>
                            <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                                <p className="text-[9px] text-slate-400 uppercase tracking-wider">Revenue</p>
                                <p className="text-lg font-bold text-slate-900">{branch.revenue}</p>
                            </div>
                            <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                                <p className="text-[9px] text-slate-400 uppercase tracking-wider">Bookings</p>
                                <p className="text-lg font-bold text-slate-900">{branch.bookings}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-2">Utilization Trend (6 days)</p>
                            <div className="flex items-end gap-1 h-10">
                                {branch.spark.map((h, j) => (
                                    <motion.div key={j} initial={{ height: 0 }} animate={{ height: `${(h / 100) * 100}%` }} transition={{ delay: 0.5 + i * 0.15 + j * 0.06, duration: 0.4 }} className={`flex-1 rounded-t ${branch.barColor} opacity-75`} />
                                ))}
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100">
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${branch.util}%` }} transition={{ delay: 0.6 + i * 0.15, duration: 0.7 }} className={`h-full rounded-full ${branch.barColor}`} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-6 text-sm text-slate-400 text-center">Click any branch to drill into bookings, vehicles, agents, and revenue breakdown.</motion.p>
        </section>
    );
}
