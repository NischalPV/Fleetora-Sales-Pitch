"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function FleetBrainRebalanceScreen() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 500),
            setTimeout(() => setPhase(2), 1200),
            setTimeout(() => setPhase(3), 2000),
            setTimeout(() => setPhase(4), 2800),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-4">Fleet Brain</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-3">Fleet Brain — Smart Rebalancing</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-400 text-center mb-10 max-w-lg">It sees the imbalance. It recommends the fix. You decide.</motion.p>

            <div className="w-full max-w-xl space-y-4">
                {/* Phase 1: Recommendation card appears */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 60 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5"
                    style={{ boxShadow: "0 12px 40px -10px rgba(0,0,0,0.4)" }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                            <span className="text-[10px] text-white font-bold">AI</span>
                        </div>
                        <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Fleet Brain Recommendation #1</p>
                            <p className="text-sm font-bold text-white">Move 2 SUVs: Beach (45%) → Airport (92%)</p>
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">Airport has 4 upcoming bookings in the next 6 hours with only 1 available SUV. Beach has excess inventory and no forecasted demand until tomorrow morning.</p>

                    {/* Phase 2: Confidence + accuracy bars animate */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-900 rounded-xl p-3 border border-slate-700/50">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Confidence Score</p>
                            <div className="flex items-end gap-1 mt-1">
                                <span className="text-2xl font-bold text-emerald-400">94%</span>
                            </div>
                            <div className="mt-1.5 h-1 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={phase >= 2 ? { width: "94%" } : { width: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="h-full bg-emerald-500 rounded-full"
                                />
                            </div>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-3 border border-slate-700/50">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Historical Accuracy</p>
                            <div className="flex items-end gap-1 mt-1">
                                <span className="text-2xl font-bold text-blue-400">89%</span>
                            </div>
                            <div className="mt-1.5 h-1 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={phase >= 2 ? { width: "89%" } : { width: 0 }}
                                    transition={{ delay: 0.1, duration: 0.6 }}
                                    className="h-full bg-blue-500 rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Phase 3: Accept/Override buttons slide in */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.4 }}
                        className="flex gap-2"
                    >
                        <button className="flex-1 bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors">Accept — Create Transfer Order</button>
                        <button className="px-4 bg-slate-900 border border-slate-700 text-slate-300 text-sm font-medium py-2.5 rounded-xl hover:bg-slate-800 transition-colors">Override</button>
                    </motion.div>
                </motion.div>

                {/* Phase 4: Route diagram draws */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center gap-4"
                >
                    <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl px-5 py-3 text-center">
                        <p className="text-xs font-bold text-amber-400">Beach</p>
                        <p className="text-2xl font-bold text-amber-400">45%</p>
                        <p className="text-[9px] text-amber-400/70">8 vehicles idle</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={phase >= 4 ? { width: 80 } : { width: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="h-0.5 bg-blue-400"
                            style={{ overflow: "hidden" }}
                        >
                            <div className="w-full h-full" />
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-[9px] text-blue-400 font-semibold mt-1"
                        >
                            2 SUVs →
                        </motion.p>
                    </div>
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl px-5 py-3 text-center">
                        <p className="text-xs font-bold text-blue-400">Airport</p>
                        <p className="text-2xl font-bold text-blue-400">92%</p>
                        <p className="text-[9px] text-blue-400/70">4 bookings pending</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
