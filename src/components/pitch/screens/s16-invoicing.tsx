"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const GL_ENTRIES = [
    { time: "08:49 AM", event: "Booking BK-042 created", debit: "Accounts Receivable", credit: "Deferred Revenue", amount: "$400.00" },
    { time: "08:49 AM", event: "Insurance activated", debit: "Insurance Receivable", credit: "Insurance Revenue", amount: "$80.00" },
    { time: "11:30 AM", event: "Corporate invoice generated", debit: "Trade Receivables — Fleet Corp", credit: "Accounts Receivable", amount: "$400.00" },
    { time: "02:15 PM", event: "Day 1 revenue recognized", debit: "Deferred Revenue", credit: "Rental Revenue", amount: "$133.33" },
    { time: "05:00 PM", event: "Mileage overage recorded", debit: "Accounts Receivable", credit: "Overage Revenue", amount: "$30.00" },
];

export function S16Invoicing() {
    const [visibleRows, setVisibleRows] = useState(0);

    useEffect(() => {
        const timers = GL_ENTRIES.map((_, i) =>
            setTimeout(() => setVisibleRows(i + 1), 1000 + i * 1200)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">The Money</motion.p>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold text-white text-center tracking-tight mb-2"
            >
                Revenue Recognition & General Ledger
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-slate-400 text-center mb-10 max-w-lg"
            >
                Every booking creates GL entries automatically. Revenue recognized daily. No manual journals. Full audit trail.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden"
                style={{ boxShadow: "0 30px 60px -15px rgba(0,0,0,0.4)" }}
            >
                {/* Header */}
                <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-white">General Ledger — Live Journal</p>
                        <p className="text-[10px] text-slate-500">Auto-generated from booking events</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <motion.div className="w-2 h-2 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        <span className="text-[10px] text-emerald-400">Real-time</span>
                    </div>
                </div>

                {/* Column headers */}
                <div className="grid grid-cols-[80px_1fr_180px_180px_100px] px-6 py-2 text-[9px] text-slate-500 uppercase tracking-wider font-medium border-b border-slate-800">
                    <span>Time</span><span>Event</span><span>Debit</span><span>Credit</span><span className="text-right">Amount</span>
                </div>

                {/* GL entries stream in */}
                <div className="min-h-[260px]">
                    {GL_ENTRIES.map((entry, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={i < visibleRows ? { opacity: 1, x: 0 } : { opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-[80px_1fr_180px_180px_100px] px-6 py-3 border-b border-slate-800/50 items-center"
                        >
                            <span className="text-[10px] font-mono text-slate-500">{entry.time}</span>
                            <span className="text-xs text-white">{entry.event}</span>
                            <span className="text-[10px] text-blue-400">{entry.debit}</span>
                            <span className="text-[10px] text-emerald-400">{entry.credit}</span>
                            <span className="text-xs font-mono text-white text-right">{entry.amount}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-slate-700 bg-slate-800/30 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">Compliant with IFRS 15 revenue recognition standards</span>
                    <span className="text-[10px] text-slate-500">Full audit trail • Exportable • Multi-currency ready</span>
                </div>
            </motion.div>
        </section>
    );
}
