"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function S04Customer() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 400),
            setTimeout(() => setPhase(2), 1200),
            setTimeout(() => setPhase(3), 2200),
            setTimeout(() => setPhase(4), 3200),
            setTimeout(() => setPhase(5), 4200),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex relative overflow-hidden">
            {/* Left half — narrative */}
            <div className="w-1/2 h-full bg-slate-950 flex flex-col justify-center px-16 relative">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-6"
                >
                    The Counter — Step 1
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6 leading-tight"
                >
                    Customer walks in.<br />
                    <span className="text-blue-400">Profile loads instantly.</span>
                </motion.h2>

                <div className="space-y-4 mt-4">
                    {[
                        { text: "Agent scans ID or types the name", delay: 0.8 },
                        { text: "Full history pulls up — past rentals, preferences, alerts", delay: 1.2 },
                        { text: "Corporate account? Credit limit checked in real time", delay: 1.6 },
                        { text: "No phone calls. No spreadsheet lookups. Instant.", delay: 2.0 },
                    ].map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: line.delay }}
                            className="flex items-start gap-3"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                            <p className="text-sm text-slate-300 leading-relaxed">{line.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Right half — customer profile building itself */}
            <div className="w-1/2 h-full bg-slate-900 flex items-center justify-center px-10 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                    className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden"
                    style={{ boxShadow: "0 30px 60px -15px rgba(0,0,0,0.5)" }}
                >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-800">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={phase >= 2 ? { opacity: 1 } : {}}
                            className="flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-lg">AK</div>
                            <div>
                                <p className="text-base font-bold text-white">Ahmad Khalil</p>
                                <p className="text-xs text-slate-400">Fleet Corp • Gold tier • 12 rentals</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats grid */}
                    <div className="p-5 grid grid-cols-2 gap-3">
                        {[
                            { label: "Corporate Account", value: "Fleet Corp", sub: "Credit: $12K / $50K", phase: 3 },
                            { label: "Active Bookings", value: "3", sub: "2 Sedan, 1 SUV", phase: 3 },
                            { label: "License Status", value: "Valid", sub: "Expires Mar 2027", phase: 4 },
                            { label: "Lifetime Value", value: "$28,400", sub: "Last rental: 3 days ago", phase: 4 },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                animate={phase >= stat.phase ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-900 rounded-xl p-3 border border-slate-800"
                            >
                                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">{stat.label}</p>
                                <p className="text-sm font-bold text-white mt-1">{stat.value}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{stat.sub}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Action bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
                        className="px-5 pb-5"
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
