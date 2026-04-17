"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function S06BookingDone() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 1200),
            setTimeout(() => setPhase(3), 2500),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            {/* Radiating glow */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.02) 40%, transparent 70%)" }}
            />

            {/* Pulse rings */}
            <motion.div
                className="absolute w-40 h-40 rounded-full border border-emerald-500/10"
                animate={phase >= 1 ? { scale: [1, 2.5], opacity: [0.3, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
                className="absolute w-40 h-40 rounded-full border border-emerald-500/10"
                animate={phase >= 1 ? { scale: [1, 2.5], opacity: [0.3, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
            />

            {/* Key icon */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-4xl mb-6"
            >
                {"\u{1F511}"}
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-2"
            >
                Booking Complete
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={phase >= 1 ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
                className="text-slate-400 text-center mb-10"
            >
                Customer is driving away. Total time: 58 seconds.
            </motion.p>

            {/* Booking summary — glass card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 60, damping: 20 }}
                className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
                style={{ boxShadow: "0 30px 60px -15px rgba(0,0,0,0.3)" }}
            >
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <p className="text-sm font-bold text-white">BK-20260417-042</p>
                        <p className="text-xs text-white/50">Ahmad Khalil — Fleet Corp</p>
                    </div>
                    <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Active</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-5">
                    {[
                        { label: "Vehicle", value: "Tucson HSE", sub: "ABC-1234" },
                        { label: "Duration", value: "3 days", sub: "$106.67/day" },
                        { label: "Total", value: "$400.00", sub: "Corporate credit" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 + i * 0.1 }}
                        >
                            <p className="text-[9px] text-white/40 uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm font-bold text-white mt-0.5">{item.value}</p>
                            <p className="text-[10px] text-white/40">{item.sub}</p>
                        </motion.div>
                    ))}
                </div>

                {/* What happened automatically */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={phase >= 3 ? { opacity: 1 } : {}}
                    className="border-t border-white/5 pt-4"
                >
                    <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Triggered automatically</p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "GPS tracking started",
                            "HQ dashboard updated",
                            "Invoice queued for billing cycle",
                            "Maintenance schedule checked",
                            "Insurance activated",
                        ].map((action, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={phase >= 3 ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: i * 0.08 }}
                                className="text-[10px] text-white/50 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5"
                            >
                                {action}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* Transition hint */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={phase >= 3 ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
                className="mt-10 text-xs text-slate-600 text-center"
            >
                {"That was the branch view. Now let\u2019s see what HQ sees. \u2192"}
            </motion.p>
        </section>
    );
}
