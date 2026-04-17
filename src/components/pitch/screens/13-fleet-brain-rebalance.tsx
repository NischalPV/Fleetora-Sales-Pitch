"use client";

import { motion } from "framer-motion";

export function FleetBrainRebalanceScreen() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-600 mb-4">Fleet Brain</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-slate-900 text-center tracking-tight mb-3">Fleet Brain — Smart Rebalancing</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-500 text-center mb-10 max-w-lg">It sees the imbalance. It recommends the fix. You decide.</motion.p>

            <div className="w-full max-w-xl space-y-4">
                {/* Recommendation card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, type: "spring", stiffness: 60 }} className="bg-slate-50 border border-slate-200 rounded-2xl p-5" style={{ boxShadow: "0 12px 40px -10px rgba(0,0,0,0.08)" }}>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                            <span className="text-[10px] text-white font-bold">AI</span>
                        </div>
                        <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Fleet Brain Recommendation #1</p>
                            <p className="text-sm font-bold text-slate-900">Move 2 SUVs: Beach (45%) → Airport (92%)</p>
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">Airport has 4 upcoming bookings in the next 6 hours with only 1 available SUV. Beach has excess inventory and no forecasted demand until tomorrow morning.</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white rounded-xl p-3 border border-slate-100">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Confidence Score</p>
                            <div className="flex items-end gap-1 mt-1">
                                <span className="text-2xl font-bold text-emerald-600">94%</span>
                            </div>
                            <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} transition={{ delay: 0.7, duration: 0.6 }} className="h-full bg-emerald-500 rounded-full" />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-slate-100">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Historical Accuracy</p>
                            <div className="flex items-end gap-1 mt-1">
                                <span className="text-2xl font-bold text-blue-600">89%</span>
                            </div>
                            <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: "89%" }} transition={{ delay: 0.8, duration: 0.6 }} className="h-full bg-blue-500 rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex-1 bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors">Accept — Create Transfer Order</motion.button>
                        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="px-4 bg-white border border-slate-200 text-slate-600 text-sm font-medium py-2.5 rounded-xl hover:bg-slate-50 transition-colors">Override</motion.button>
                    </div>
                </motion.div>

                {/* Route diagram */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center justify-center gap-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-center">
                        <p className="text-xs font-bold text-amber-700">Beach</p>
                        <p className="text-2xl font-bold text-amber-600">45%</p>
                        <p className="text-[9px] text-amber-500">8 vehicles idle</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <motion.div initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.9, duration: 0.5 }} className="h-0.5 bg-blue-400" style={{ overflow: "hidden" }}>
                            <div className="w-full h-full" />
                        </motion.div>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="text-[9px] text-blue-600 font-semibold mt-1">2 SUVs →</motion.p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 text-center">
                        <p className="text-xs font-bold text-blue-700">Airport</p>
                        <p className="text-2xl font-bold text-blue-600">92%</p>
                        <p className="text-[9px] text-blue-500">4 bookings pending</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
