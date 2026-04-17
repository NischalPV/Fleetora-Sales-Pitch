"use client";

import { motion } from "framer-motion";

const VEHICLES = [
    { model: "Tucson HSE", plate: "ABC-1234", type: "SUV" },
    { model: "Santa Fe GL", plate: "DEF-5678", type: "SUV" },
    { model: "Creta Sport", plate: "GHI-9012", type: "Crossover" },
];

const TIMELINE = [
    { label: "Created", time: "9:02 AM", done: true },
    { label: "Dispatched", time: "9:15 AM", done: true },
    { label: "In Transit", time: "9:31 AM", done: true },
    { label: "Arrived", time: "Expected 10:15 AM", done: false, active: true },
];

export function TransfersScreen() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-600 mb-4">Operations</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-slate-900 text-center tracking-tight mb-3">Inter-Branch Transfers</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-500 text-center mb-10 max-w-lg">Tracked orders. Full accountability. No more WhatsApp.</motion.p>

            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 55 }} className="w-full max-w-2xl bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden" style={{ boxShadow: "0 12px 40px -10px rgba(0,0,0,0.08)" }}>
                {/* Header */}
                <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider">Transfer Order</p>
                        <p className="text-sm font-bold text-slate-900">TRF-20260416-007</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">In Transit</span>
                </div>

                <div className="p-5 grid grid-cols-[1fr_auto_1fr] gap-4 items-center border-b border-slate-100">
                    <div className="bg-white rounded-xl p-3 border border-slate-100 text-center">
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider">From</p>
                        <p className="text-lg font-bold text-slate-900">Beach</p>
                        <p className="text-[10px] text-slate-500">Branch — Coast Rd</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <motion.div initial={{ width: 0 }} animate={{ width: 40 }} transition={{ delay: 0.7, duration: 0.4 }} className="h-0.5 bg-blue-400" style={{ overflow: "hidden" }}><div className="w-full h-full" /></motion.div>
                        <span className="text-[9px] text-blue-500 font-semibold">3 vehicles</span>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-100 text-center">
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider">To</p>
                        <p className="text-lg font-bold text-slate-900">Airport</p>
                        <p className="text-[10px] text-slate-500">Branch — Terminal 1</p>
                    </div>
                </div>

                <div className="p-5 border-b border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-2">Vehicles</p>
                    <div className="space-y-2">
                        {VEHICLES.map((v, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-slate-100">
                                <div>
                                    <span className="text-sm font-medium text-slate-800">{v.model}</span>
                                    <span className="text-[10px] text-slate-400 ml-2">· {v.type}</span>
                                </div>
                                <span className="text-xs font-mono text-slate-400">{v.plate}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="p-5">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-3">Status Timeline</p>
                    <div className="flex items-center gap-0">
                        {TIMELINE.map((step, i) => (
                            <div key={i} className="flex items-center flex-1">
                                <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.12, type: "spring", stiffness: 200 }} className="flex flex-col items-center">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step.done ? "bg-emerald-500 border-emerald-500" : step.active ? "bg-white border-amber-400" : "bg-white border-slate-200"}`}>
                                        {step.done && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                                        {step.active && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                                    </div>
                                    <p className={`text-[8px] mt-1 font-semibold ${step.done ? "text-emerald-600" : step.active ? "text-amber-600" : "text-slate-300"}`}>{step.label}</p>
                                    <p className={`text-[7px] ${step.done ? "text-slate-400" : step.active ? "text-amber-500" : "text-slate-200"}`}>{step.time}</p>
                                </motion.div>
                                {i < TIMELINE.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-1 ${i < 2 ? "bg-emerald-300" : "bg-slate-200"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
