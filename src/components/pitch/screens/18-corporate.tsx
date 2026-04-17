"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const RENTALS = [
    { name: "James Al-Rashid", vehicle: "Elantra N", plate: "ABC-1234", since: "Apr 14", cost: "$420" },
    { name: "Sarah Chen", vehicle: "Tucson HSE", plate: "DEF-5678", since: "Apr 15", cost: "$640" },
    { name: "Omar Farouk", vehicle: "Sonata GL", plate: "GHI-9012", since: "Apr 12", cost: "$880" },
    { name: "Lisa Park", vehicle: "Creta Sport", plate: "JKL-3456", since: "Apr 16", cost: "$210" },
];

const INVOICES = [
    { ref: "INV-2026-041", date: "Apr 1", amount: "$12,480", status: "Paid", badge: "bg-emerald-500/20 text-emerald-400" },
    { ref: "INV-2026-032", date: "Mar 1", amount: "$9,720", status: "Paid", badge: "bg-emerald-500/20 text-emerald-400" },
    { ref: "INV-2026-023", date: "Feb 1", amount: "$11,200", status: "Paid", badge: "bg-emerald-500/20 text-emerald-400" },
];

export function CorporateScreen() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 400),
            setTimeout(() => setPhase(2), 900),
            setTimeout(() => setPhase(3), 1600),
            setTimeout(() => setPhase(4), 2400),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-4">Corporate</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-3">Corporate Accounts</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-400 text-center mb-8 max-w-lg">Credit limits enforced in real time. Invoices generated automatically.</motion.p>

            <div className="w-full max-w-2xl bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden" style={{ boxShadow: "0 12px 40px -10px rgba(0,0,0,0.4)" }}>
                {/* Phase 1: Account header appears */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="bg-slate-900 px-5 py-4 border-b border-slate-700/50 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                            <span className="text-sm font-bold text-white">FC</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Fleet Corp</p>
                            <p className="text-[10px] text-slate-400">Corporate Account · Since Jan 2025</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Active</span>
                </motion.div>

                {/* Phase 2: Credit bar animates */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-5 py-4 border-b border-slate-700/50"
                >
                    <div className="flex justify-between items-center mb-1.5">
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Credit Usage</p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">$38K</span>
                            <span className="text-xs text-slate-400">/ $50K limit</span>
                        </div>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={phase >= 2 ? { width: "76%" } : { width: 0 }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-amber-500 rounded-full"
                        />
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-[9px] text-slate-400">Used: $38,000</span>
                        <span className="text-[9px] text-amber-400 font-semibold">76% utilized · $12K remaining</span>
                    </div>
                </motion.div>

                {/* Phase 3: Active rentals list cascades */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 py-4 border-b border-slate-700/50"
                >
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-2.5 font-semibold">Active Rentals (4 employees)</p>
                    <div className="space-y-1.5">
                        {RENTALS.map((r, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -8 }}
                                animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                                transition={{ delay: i * 0.08 }}
                                className="flex items-center justify-between bg-slate-900 rounded-xl px-3 py-2 border border-slate-700/50"
                            >
                                <div>
                                    <span className="text-xs font-medium text-slate-300">{r.name}</span>
                                    <span className="text-[9px] text-slate-400 ml-2">{r.vehicle}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] text-slate-400">Since {r.since}</span>
                                    <span className="text-xs font-bold text-slate-300">{r.cost}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Phase 4: Invoice table appears */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-5 py-4"
                >
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-2.5 font-semibold">Recent Invoices</p>
                    <div className="space-y-1.5">
                        {INVOICES.map((inv, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-slate-400">{inv.ref}</span>
                                    <span className="text-[9px] text-slate-400">{inv.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-white">{inv.amount}</span>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${inv.badge}`}>{inv.status}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
