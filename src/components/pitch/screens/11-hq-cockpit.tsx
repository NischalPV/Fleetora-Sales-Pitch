"use client";

import { motion } from "framer-motion";

const BRANCHES = [
    { name: "Airport", util: 92, color: "bg-blue-500" },
    { name: "Downtown", util: 78, color: "bg-blue-400" },
    { name: "Beach", util: 45, color: "bg-amber-400" },
    { name: "Mall", util: 61, color: "bg-blue-300" },
];

const BARS = [18, 22, 19, 25, 30, 28, 35, 32, 38, 36, 42, 44];
const OPS = [
    { label: "Checkouts", value: 32, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Returns", value: 18, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Transfers", value: 4, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Alerts", value: 2, color: "text-red-600", bg: "bg-red-50" },
];

export function HqCockpitScreen() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-600 mb-4">Multi-Branch</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-slate-900 text-center tracking-tight mb-3">HQ Cockpit</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-500 text-center mb-8 max-w-lg">Your entire operation. One screen. Real time.</motion.p>

            <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.3 }} className="w-full max-w-4xl rounded-2xl border border-slate-200 overflow-hidden bg-white" style={{ boxShadow: "0 25px 80px -15px rgba(0,0,0,0.08)" }}>
                <div className="bg-slate-50 px-4 py-2 flex items-center gap-2 border-b border-slate-100">
                    <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-300" /><div className="w-2.5 h-2.5 rounded-full bg-amber-300" /><div className="w-2.5 h-2.5 rounded-full bg-green-300" /></div>
                    <div className="flex-1 bg-white rounded-md px-3 py-1 ml-2 border border-slate-100"><span className="text-[10px] text-slate-400">app.fleetora.com/hq/overview</span></div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-slate-100">
                    {/* Utilization */}
                    <div className="p-4 border-b border-slate-100">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Fleet Utilization by Branch</p>
                        <div className="space-y-2.5">
                            {BRANCHES.map((b, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-xs text-slate-600 w-16 shrink-0">{b.name}</span>
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${b.util}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }} className={`h-full rounded-full ${b.color}`} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 w-8 text-right tabular-nums">{b.util}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Revenue chart */}
                    <div className="p-4 border-b border-slate-100">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Revenue — Last 12 Months ($K)</p>
                        <div className="flex items-end gap-1 h-16">
                            {BARS.map((h, i) => (
                                <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(h / 44) * 100}%` }} transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }} className="flex-1 bg-blue-500 rounded-t opacity-80" />
                            ))}
                        </div>
                        <div className="flex justify-between mt-1"><span className="text-[8px] text-slate-400">May</span><span className="text-[8px] text-slate-400">Apr</span></div>
                    </div>

                    {/* Today's ops */}
                    <div className="p-4">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Today&apos;s Operations</p>
                        <div className="grid grid-cols-2 gap-2">
                            {OPS.map((op, i) => (
                                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.08 }} className={`rounded-xl p-2.5 ${op.bg}`}>
                                    <p className="text-[9px] text-slate-500">{op.label}</p>
                                    <p className={`text-2xl font-bold ${op.color}`}>{op.value}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Fleet Brain teaser */}
                    <div className="p-4">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Fleet Brain</p>
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }} className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                    <span className="text-[8px] text-white font-bold">AI</span>
                                </div>
                                <span className="text-xs font-semibold text-blue-800">3 recommendations pending</span>
                            </div>
                            <p className="text-[10px] text-blue-600">Rebalancing · Demand alerts · Maintenance window</p>
                            <div className="mt-2 flex gap-1">
                                <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium cursor-pointer">Review</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
