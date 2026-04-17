"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const METRICS = [
    { label: "Revenue MTD", value: "$186K", delta: "+12%", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" },
    { label: "Outstanding", value: "$42K", delta: "14 invoices", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" },
    { label: "Collected", value: "$28K", delta: "This week", color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" },
    { label: "Overdue", value: "$8.2K", delta: "3 accounts", color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" },
];

const REVENUE_BARS = [68, 72, 65, 80, 85, 78, 88, 90, 82, 95, 92, 100];
const TARGET_BARS = [75, 75, 75, 85, 85, 85, 90, 90, 90, 95, 95, 95];

const INVOICES = [
    { ref: "INV-2026-058", client: "Fleet Corp", amount: "$12,480", due: "Apr 20", status: "Due", badge: "bg-amber-500/20 text-amber-400" },
    { ref: "INV-2026-057", client: "Ahmad Khalil", amount: "$645", due: "Apr 18", status: "Overdue", badge: "bg-red-500/20 text-red-400" },
    { ref: "INV-2026-056", client: "Sara Motors", amount: "$3,200", due: "Apr 15", status: "Paid", badge: "bg-emerald-500/20 text-emerald-400" },
    { ref: "INV-2026-055", client: "Gulf Logistics", amount: "$8,750", due: "Apr 10", status: "Paid", badge: "bg-emerald-500/20 text-emerald-400" },
];

export function FinanceScreen() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 400),
            setTimeout(() => setPhase(2), 1200),
            setTimeout(() => setPhase(3), 2200),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-4">Finance</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-3">Finance Workspace</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-400 text-center mb-8 max-w-lg">Real-time P&L. Automated invoicing. No month-end scramble.</motion.p>

            <div className="w-full max-w-3xl space-y-4">
                {/* Phase 1: Metric cards fly in from top with stagger */}
                <div className="grid grid-cols-4 gap-3">
                    {METRICS.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: -20 }}
                            animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                            transition={{ delay: i * 0.08, type: "spring", stiffness: 80 }}
                            className={`rounded-2xl p-4 border ${m.bg} ${m.border}`}
                        >
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">{m.label}</p>
                            <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{m.delta}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Phase 2: Revenue chart bars grow */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ duration: 0.4 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4"
                >
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-slate-300">Revenue vs Target — Last 12 Months</p>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-[9px] text-slate-400"><span className="w-3 h-1.5 rounded bg-blue-500 inline-block" /> Revenue</span>
                            <span className="flex items-center gap-1 text-[9px] text-slate-400"><span className="w-3 h-0.5 bg-slate-500 inline-block" /> Target</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-1.5 h-16">
                        {REVENUE_BARS.map((h, i) => (
                            <div key={i} className="flex-1 relative flex flex-col justify-end" style={{ height: "100%" }}>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={phase >= 2 ? { height: `${h}%` } : { height: 0 }}
                                    transition={{ delay: i * 0.04, duration: 0.4 }}
                                    className={`w-full rounded-t ${h >= TARGET_BARS[i] ? "bg-blue-500" : "bg-red-400"} opacity-80`}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-1"><span className="text-[8px] text-slate-400">May 25</span><span className="text-[8px] text-slate-400">Apr 26</span></div>
                </motion.div>

                {/* Phase 3: Invoice table rows cascade in */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden"
                >
                    <div className="grid grid-cols-[1fr_120px_80px_70px_70px] px-4 py-2 bg-slate-900 border-b border-slate-700/50 text-[9px] text-slate-400 uppercase tracking-wider font-medium">
                        <span>Invoice</span><span>Client</span><span>Amount</span><span>Due</span><span className="text-right">Status</span>
                    </div>
                    {INVOICES.map((inv, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                            transition={{ delay: i * 0.08 }}
                            className="grid grid-cols-[1fr_120px_80px_70px_70px] px-4 py-2.5 border-t border-slate-700/30 items-center"
                        >
                            <span className="text-xs font-mono text-slate-400">{inv.ref}</span>
                            <span className="text-xs text-slate-300">{inv.client}</span>
                            <span className="text-xs font-bold text-white tabular-nums">{inv.amount}</span>
                            <span className="text-xs text-slate-400">{inv.due}</span>
                            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full text-right ${inv.badge}`}>{inv.status}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
