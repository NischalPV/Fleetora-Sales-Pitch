"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const STORY_STEPS = [
    { phase: 1, leftText: "Agent types the customer name...", rightTitle: "Searching", rightDetail: "Ahmad Kh..." },
    { phase: 2, leftText: "ID scanned — profile auto-fills", rightTitle: "ID Verified", rightDetail: "Ahmad Khalil • JOR-2891-2027" },
    { phase: 3, leftText: "Full rental history loads instantly", rightTitle: "History", rightDetail: "12 past rentals • Gold tier • $28,400 lifetime" },
    { phase: 4, leftText: "Corporate account verified in real time", rightTitle: "Corporate Check", rightDetail: "Fleet Corp • Credit: $12K / $50K • Approved ✓" },
    { phase: 5, leftText: "Ready to book. No calls. No spreadsheets.", rightTitle: "Ready", rightDetail: "New booking available" },
];

export function S04Customer() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 600),
            setTimeout(() => setPhase(2), 2000),
            setTimeout(() => setPhase(3), 3500),
            setTimeout(() => setPhase(4), 5000),
            setTimeout(() => setPhase(5), 6500),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex relative overflow-hidden">
            {/* Left half — narrative that syncs with right */}
            <div className="w-[45%] h-full bg-slate-950 flex flex-col justify-center relative">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

                <div className="px-12 md:px-16 max-w-lg ml-auto mr-8">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-6"
                    >
                        The Counter — Customer Lookup
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-8 leading-tight"
                    >
                        Customer walks in.<br />
                        <span className="text-blue-400">Profile loads instantly.</span>
                    </motion.h2>

                    {/* Steps appear as story progresses */}
                    <div className="space-y-4">
                        {STORY_STEPS.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -15 }}
                                animate={phase >= step.phase ? { opacity: 1, x: 0 } : { opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="flex items-start gap-3"
                            >
                                <motion.div
                                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 transition-colors duration-300 ${phase === step.phase ? "bg-blue-500" : phase > step.phase ? "bg-emerald-500" : "bg-slate-700"}`}
                                />
                                <p className={`text-sm leading-relaxed transition-colors duration-300 ${phase === step.phase ? "text-white" : "text-slate-400"}`}>
                                    {step.leftText}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right half — profile building itself */}
            <div className="w-[55%] h-full bg-slate-900 flex items-center justify-center px-10 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                    className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden"
                    style={{ boxShadow: "0 30px 60px -15px rgba(0,0,0,0.5)" }}
                >
                    {/* Search bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 1 ? { opacity: 1 } : {}}
                        className="px-5 py-3 border-b border-slate-800 flex items-center gap-3"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                        <motion.span className="text-sm text-white">
                            {phase >= 2 ? "Ahmad Khalil" : phase >= 1 ? "Ahmad Kh" : ""}
                        </motion.span>
                        {phase === 1 && <motion.span className="w-0.5 h-4 bg-blue-500 inline-block" animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} />}
                    </motion.div>

                    {/* Profile header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 2 ? { opacity: 1 } : {}}
                        className="px-5 py-4 border-b border-slate-800 flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-lg">AK</div>
                        <div>
                            <p className="text-base font-bold text-white">Ahmad Khalil</p>
                            <p className="text-xs text-slate-400">ID: JOR-2891-2027 • Verified ✓</p>
                        </div>
                    </motion.div>

                    {/* History */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
                        className="px-5 py-3 border-b border-slate-800"
                    >
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Rental History</p>
                        <div className="flex gap-4">
                            <div><p className="text-lg font-bold text-white">12</p><p className="text-[10px] text-slate-500">Rentals</p></div>
                            <div><p className="text-lg font-bold text-emerald-400">Gold</p><p className="text-[10px] text-slate-500">Tier</p></div>
                            <div><p className="text-lg font-bold text-white">$28.4K</p><p className="text-[10px] text-slate-500">Lifetime</p></div>
                            <div><p className="text-lg font-bold text-white">3d ago</p><p className="text-[10px] text-slate-500">Last visit</p></div>
                        </div>
                    </motion.div>

                    {/* Corporate check */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
                        className="px-5 py-3 border-b border-slate-800"
                    >
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Corporate Account</p>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-white">Fleet Corp</p>
                                <p className="text-[10px] text-slate-500">Credit: $12,000 / $50,000</p>
                            </div>
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={phase >= 4 ? { scale: 1 } : {}}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400"
                            >
                                ✓ Approved
                            </motion.span>
                        </div>
                        {/* Credit bar */}
                        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <motion.div className="h-full rounded-full bg-blue-500" initial={{ width: 0 }} animate={phase >= 4 ? { width: "24%" } : {}} transition={{ duration: 0.8 }} />
                        </div>
                    </motion.div>

                    {/* New Booking button */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
                        className="px-5 py-4"
                    >
                        <motion.div
                            className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between"
                            animate={phase >= 5 ? { borderColor: ["rgba(16,185,129,0.3)", "rgba(16,185,129,0.6)", "rgba(16,185,129,0.3)"] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span className="text-emerald-400 font-semibold text-sm">+ New Booking</span>
                            <kbd className="px-2 py-1 text-[10px] font-mono bg-emerald-500/20 rounded text-emerald-400 border border-emerald-500/30">N</kbd>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
