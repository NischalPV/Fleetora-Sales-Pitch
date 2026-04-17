"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function S17Payments() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 400),
            setTimeout(() => setPhase(2), 1200),
            setTimeout(() => setPhase(3), 2200),
            setTimeout(() => setPhase(4), 3200),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">The Money</motion.p>

            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white text-center tracking-tight mb-2">
                Cash Management & Receivables
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm text-slate-400 text-center mb-10 max-w-lg">
                Deposits tracked to the penny. Aging reports live. Bank reconciliation automated. Nothing slips through.
            </motion.p>

            <div className="grid grid-cols-3 gap-5 max-w-5xl w-full">
                {/* Aging Report */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                    className="rounded-2xl border border-slate-700 bg-slate-900 p-5 col-span-1"
                >
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-4">Receivables Aging</p>
                    {[
                        { bucket: "Current", amount: "$142,000", pct: 68, color: "bg-emerald-500" },
                        { bucket: "30 days", amount: "$42,000", pct: 20, color: "bg-amber-500" },
                        { bucket: "60 days", amount: "$18,000", pct: 9, color: "bg-orange-500" },
                        { bucket: "90+ days", amount: "$8,200", pct: 3, color: "bg-red-500" },
                    ].map((row, i) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-400">{row.bucket}</span>
                                <span className="text-white font-medium">{row.amount}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full ${row.color}`}
                                    initial={{ width: 0 }}
                                    animate={phase >= 1 ? { width: `${row.pct}%` } : {}}
                                    transition={{ duration: 0.6, delay: i * 0.15 }}
                                />
                            </div>
                        </div>
                    ))}
                    <p className="text-[10px] text-slate-500 mt-2">Total outstanding: $210,200</p>
                </motion.div>

                {/* Deposit Tracking */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                    className="rounded-2xl border border-slate-700 bg-slate-900 p-5 col-span-1"
                >
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-4">Deposit Management</p>
                    {[
                        { customer: "Ahmad K.", deposit: "$200", status: "Held", sc: "bg-blue-500/20 text-blue-400" },
                        { customer: "Sara M.", deposit: "$150", status: "Refund due", sc: "bg-amber-500/20 text-amber-400" },
                        { customer: "Fleet Corp", deposit: "$0", status: "Waived", sc: "bg-slate-700 text-slate-400" },
                        { customer: "Omar R.", deposit: "$200", status: "Held", sc: "bg-blue-500/20 text-blue-400" },
                        { customer: "Layla H.", deposit: "$300", status: "Partial refund", sc: "bg-emerald-500/20 text-emerald-400" },
                    ].map((row, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: i * 0.08 }}
                            className="flex items-center justify-between py-2 border-b border-slate-800/50"
                        >
                            <div>
                                <p className="text-xs text-white">{row.customer}</p>
                                <p className="text-[10px] text-slate-500">{row.deposit}</p>
                            </div>
                            <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${row.sc}`}>{row.status}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bank Reconciliation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
                    className="rounded-2xl border border-slate-700 bg-slate-900 p-5 col-span-1"
                >
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-4">Bank Reconciliation</p>
                    <div className="space-y-3">
                        <div className="bg-slate-800/50 rounded-xl p-3">
                            <p className="text-[9px] text-slate-500 uppercase">Book Balance</p>
                            <p className="text-xl font-bold text-white mt-1">$384,200</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-3">
                            <p className="text-[9px] text-slate-500 uppercase">Bank Balance</p>
                            <p className="text-xl font-bold text-white mt-1">$384,200</p>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={phase >= 4 ? { opacity: 1 } : {}}
                            className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center"
                        >
                            <p className="text-sm font-bold text-emerald-400">✓ Reconciled</p>
                            <p className="text-[10px] text-emerald-400/60">Auto-matched 847 / 850 transactions</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Feature tags */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={phase >= 4 ? { opacity: 1 } : {}}
                className="flex gap-3 mt-8"
            >
                {["Multi-currency", "VAT/Tax automation", "Withholding tax", "Payment gateway integration", "Automated dunning"].map((tag, i) => (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: i * 0.08 }}
                        className="text-[10px] text-slate-500 bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-700/50"
                    >
                        {tag}
                    </motion.span>
                ))}
            </motion.div>
        </section>
    );
}
