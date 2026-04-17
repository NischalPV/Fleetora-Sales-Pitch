"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const METRICS = [
    { label: "Revenue MTD", value: "$48.2K", target: "$45K", color: "text-emerald-400", up: true },
    { label: "Invoices Sent", value: "127", target: "—", color: "text-blue-400", up: true },
    { label: "Avg Days to Pay", value: "3.2d", target: "7d", color: "text-white", up: true },
    { label: "Overdue Rate", value: "4.1%", target: "< 8%", color: "text-amber-400", up: false },
];

const CHART_BARS = [
    { month: "Nov", rev: 34, target: 40 },
    { month: "Dec", rev: 41, target: 40 },
    { month: "Jan", rev: 38, target: 42 },
    { month: "Feb", rev: 45, target: 42 },
    { month: "Mar", rev: 43, target: 44 },
    { month: "Apr", rev: 48, target: 45 },
];

const INVOICES = [
    { id: "INV-0892", client: "Fleet Corp", amount: "$1,940", date: "Apr 16", status: "Sent", sc: "bg-blue-500/20 text-blue-400" },
    { id: "INV-0891", client: "Ahmad K.", amount: "$320", date: "Apr 15", status: "Paid", sc: "bg-emerald-500/20 text-emerald-400" },
    { id: "INV-0890", client: "Sara M.", amount: "$450", date: "Apr 14", status: "Paid", sc: "bg-emerald-500/20 text-emerald-400" },
    { id: "INV-0877", client: "Alpha Bank LLC", amount: "$8,200", date: "Mar 28", status: "Overdue", sc: "bg-red-500/20 text-red-400" },
];

export function S18FinanceWs() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 800),
            setTimeout(() => setPhase(3), 1400),
            setTimeout(() => setPhase(4), 2100),
            setTimeout(() => setPhase(5), 3000),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    const maxRev = Math.max(...CHART_BARS.map((b) => Math.max(b.rev, b.target)));

    return (
        <section className="h-screen w-full relative overflow-hidden bg-slate-950 p-5 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="absolute top-6 left-8 z-10">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400">The Money · Finance Workspace</p>
            </motion.div>

            {/* Full-bleed browser frame */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                className="w-full h-full rounded-2xl border border-slate-700 overflow-hidden bg-slate-900 flex flex-col"
                style={{ boxShadow: "0 40px 100px -20px rgba(0,0,0,0.6)" }}
            >
                {/* Browser chrome */}
                <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700 shrink-0">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 bg-slate-700/50 rounded-md px-3 py-1 ml-2 border border-slate-600/50">
                        <span className="text-[10px] text-slate-400">app.fleetora.com/finance</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 overflow-hidden flex flex-col gap-4">
                    {/* Metric cards */}
                    <div className="grid grid-cols-4 gap-3 shrink-0">
                        {METRICS.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: -30 }}
                                animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                                transition={{ type: "spring", stiffness: 80, damping: 15, delay: i * 0.1 }}
                                className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50"
                            >
                                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-1">{m.label}</p>
                                <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
                                <p className="text-[9px] text-slate-600 mt-1">
                                    Target: {m.target} {m.up ? "↑" : "↓"}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main content: chart + invoice table */}
                    <div className="flex gap-4 flex-1 min-h-0">
                        {/* Revenue chart */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={phase >= 3 ? { opacity: 1, x: 0 } : {}}
                            transition={{ type: "spring", stiffness: 60, damping: 18 }}
                            className="w-1/2 bg-slate-800/40 rounded-xl border border-slate-700/50 p-4 flex flex-col"
                        >
                            <p className="text-xs font-semibold text-slate-300 mb-4">Revenue vs Target</p>
                            <div className="flex-1 flex items-end gap-2 min-h-0">
                                {CHART_BARS.map((bar, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                                        <div className="w-full flex items-end gap-0.5" style={{ height: "120px" }}>
                                            {/* Target bar */}
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={phase >= 4 ? { height: `${(bar.target / maxRev) * 100}%` } : { height: 0 }}
                                                transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
                                                className="flex-1 rounded-t-sm bg-slate-600/50"
                                            />
                                            {/* Revenue bar */}
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={phase >= 4 ? { height: `${(bar.rev / maxRev) * 100}%` } : { height: 0 }}
                                                transition={{ delay: i * 0.06 + 0.1, duration: 0.5, ease: "easeOut" }}
                                                className="flex-1 rounded-t-sm"
                                                style={{ backgroundColor: bar.rev >= bar.target ? "#22c55e" : "#3b82f6" }}
                                            />
                                        </div>
                                        <span className="text-[8px] text-slate-600">{bar.month}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 mt-3">
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-slate-600/50" /><span className="text-[9px] text-slate-500">Target</span></div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-emerald-500" /><span className="text-[9px] text-slate-500">Actual</span></div>
                            </div>
                        </motion.div>

                        {/* Invoice table */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={phase >= 3 ? { opacity: 1, x: 0 } : {}}
                            transition={{ type: "spring", stiffness: 60, damping: 18 }}
                            className="w-1/2 bg-slate-800/40 rounded-xl border border-slate-700/50 p-4 flex flex-col"
                        >
                            <p className="text-xs font-semibold text-slate-300 mb-3">Recent Invoices</p>
                            <div className="grid grid-cols-[60px_1fr_70px_70px_70px] text-[9px] text-slate-600 uppercase tracking-wider font-medium pb-2 border-b border-slate-700/50">
                                <span>ID</span><span>Client</span><span>Amount</span><span>Date</span><span className="text-right">Status</span>
                            </div>
                            <div className="flex-1 overflow-auto">
                                {INVOICES.map((inv, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={phase >= 5 ? { opacity: 1, x: 0 } : {}}
                                        transition={{ type: "spring", stiffness: 70, damping: 18, delay: i * 0.1 }}
                                        className="grid grid-cols-[60px_1fr_70px_70px_70px] py-2.5 border-b border-slate-800/50 items-center"
                                    >
                                        <span className="text-[10px] text-slate-500 font-mono">{inv.id}</span>
                                        <span className="text-xs font-medium text-white truncate">{inv.client}</span>
                                        <span className="text-xs font-semibold text-white">{inv.amount}</span>
                                        <span className="text-[10px] text-slate-500">{inv.date}</span>
                                        <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full text-right inline-block ${inv.sc}`}>{inv.status}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Month-end badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
                    transition={{ type: "spring", stiffness: 60, damping: 18 }}
                    className="px-5 py-3 border-t border-slate-700 flex items-center gap-3 shrink-0"
                >
                    <motion.div className="w-2 h-2 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                    <span className="text-[10px] text-slate-400">Finance workspace live</span>
                    <div className="ml-auto px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                        Month-end close: same day
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
