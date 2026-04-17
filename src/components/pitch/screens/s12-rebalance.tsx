"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function S12Rebalance() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 900),
            setTimeout(() => setPhase(3), 1700),
            setTimeout(() => setPhase(4), 2600),
            setTimeout(() => setPhase(5), 3500),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full relative overflow-hidden bg-slate-950 flex flex-col items-center justify-center px-8">
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 mb-1 z-10"
            >
                The Intelligence
            </motion.p>
            <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold text-white mb-6 z-10"
            >
                Smart Rebalancing
            </motion.h2>

            <div className="flex w-full max-w-5xl gap-6 z-10">
                {/* LEFT: Recommendation Card */}
                <div className="flex-1 flex flex-col">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                        className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden"
                        style={{ boxShadow: "0 20px 60px -10px rgba(0,0,0,0.4)" }}
                    >
                        {/* Card header */}
                        <div className="bg-blue-500/10 border-b border-blue-500/20 px-5 py-3 flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-500/30 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-blue-400" />
                            </div>
                            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Fleet Brain Recommendation</span>
                        </div>

                        <div className="p-5">
                            {/* Reason */}
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
                                className="mb-4"
                            >
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Action</p>
                                <p className="text-lg font-semibold text-white">
                                    Move <span className="text-amber-400">2 SUVs</span> from Beach Branch to Airport
                                </p>
                                <p className="text-xs text-slate-400 mt-1.5">
                                    Airport demand spikes +60% tomorrow — conference weekend. Beach currently holds 8 idle vehicles.
                                </p>
                            </motion.div>

                            {/* Confidence bar */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={phase >= 3 ? { opacity: 1 } : {}}
                                className="mb-5"
                            >
                                <div className="flex justify-between mb-1.5">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Confidence</span>
                                    <span className="text-[10px] font-semibold text-emerald-400">94%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={phase >= 3 ? { width: "94%" } : {}}
                                        transition={{ duration: 0.9, ease: "easeOut" }}
                                    />
                                </div>
                                <div className="mt-2 text-[10px] text-slate-500">Based on 18 months of booking patterns + live demand signals</div>
                            </motion.div>

                            {/* Metrics row */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={phase >= 3 ? { opacity: 1 } : {}}
                                className="grid grid-cols-3 gap-2 mb-5"
                            >
                                {[
                                    { label: "Est. Revenue Gain", value: "+$2,400", color: "text-emerald-400" },
                                    { label: "Transfer Time", value: "42 min", color: "text-blue-400" },
                                    { label: "Idle Reduction", value: "−25%", color: "text-amber-400" },
                                ].map((m, i) => (
                                    <div key={i} className="bg-slate-800/50 rounded-xl p-2.5 border border-slate-700/50">
                                        <p className="text-[8px] text-slate-500 uppercase mb-0.5">{m.label}</p>
                                        <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
                                className="flex gap-3"
                            >
                                <button className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold transition-colors">
                                    Accept &amp; Schedule Transfer
                                </button>
                                <button className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-xs font-medium hover:bg-slate-700 transition-colors">
                                    Override
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT: Route Diagram */}
                <div className="flex-1 flex flex-col items-center justify-center relative">
                    <motion.svg
                        width="380"
                        height="300"
                        viewBox="0 0 380 300"
                        initial={{ opacity: 0 }}
                        animate={phase >= 2 ? { opacity: 1 } : {}}
                    >
                        {/* Branch A: Beach */}
                        <rect x="20" y="110" width="110" height="60" rx="12" fill="rgba(15,23,42,0.9)" stroke="#334155" strokeWidth="1.5" />
                        <text x="75" y="136" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600" letterSpacing="0.5">BEACH BRANCH</text>
                        <text x="75" y="152" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="700">8 idle SUVs</text>

                        {/* Branch B: Airport */}
                        <rect x="250" y="110" width="110" height="60" rx="12" fill="rgba(15,23,42,0.9)" stroke="#3b82f6" strokeWidth="1.5" />
                        <text x="305" y="136" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600" letterSpacing="0.5">AIRPORT BRANCH</text>
                        <text x="305" y="152" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="700">92% utilized</text>

                        {/* Curved path */}
                        <motion.path
                            d="M 130 140 C 180 80, 220 80, 250 140"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeDasharray="6 4"
                            strokeOpacity="0.5"
                            initial={{ pathLength: 0 }}
                            animate={phase >= 2 ? { pathLength: 1 } : {}}
                            transition={{ duration: 1.0, ease: "easeInOut" }}
                        />

                        {/* Arrow head */}
                        <motion.polygon
                            points="244,136 256,140 244,148"
                            fill="#3b82f6"
                            fillOpacity="0.7"
                            initial={{ opacity: 0 }}
                            animate={phase >= 3 ? { opacity: 1 } : {}}
                        />

                        {/* Vehicle dot */}
                        {phase >= 4 && (
                            <motion.circle
                                r="10"
                                fill="#1d4ed8"
                                stroke="#60a5fa"
                                strokeWidth="2"
                                filter="url(#glowv)"
                                initial={{ cx: 130, cy: 140 }}
                                animate={{
                                    cx: [130, 180, 220, 250],
                                    cy: [140, 82, 82, 140],
                                }}
                                transition={{ duration: 1.8, delay: 0.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
                            >
                            </motion.circle>
                        )}
                        {phase >= 4 && (
                            <motion.text
                                textAnchor="middle"
                                fill="white"
                                fontSize="8"
                                fontWeight="700"
                                initial={{ x: 130, y: 144 }}
                                animate={{
                                    x: [130, 180, 220, 250],
                                    y: [144, 86, 86, 144],
                                }}
                                transition={{ duration: 1.8, delay: 0.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
                            >
                                SUV
                            </motion.text>
                        )}

                        {/* Distance label */}
                        <motion.text
                            x="190" y="68"
                            textAnchor="middle"
                            fill="#64748b"
                            fontSize="9"
                            initial={{ opacity: 0 }}
                            animate={phase >= 3 ? { opacity: 1 } : {}}
                        >
                            42 min · 18 km
                        </motion.text>
                    </motion.svg>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={phase >= 5 ? { opacity: 1 } : {}}
                        className="text-xs text-slate-500 text-center mt-2 max-w-xs"
                    >
                        Transfer auto-assigned to next available driver. ETA synced to Airport booking queue.
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
