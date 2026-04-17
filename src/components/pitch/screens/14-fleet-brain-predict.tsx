"use client";

import { motion } from "framer-motion";

const FORECAST = [
    { day: "Mon", airport: { pred: 18, avail: 14 }, downtown: { pred: 12, avail: 15 }, mall: { pred: 8, avail: 10 } },
    { day: "Tue", airport: { pred: 22, avail: 14 }, downtown: { pred: 10, avail: 15 }, mall: { pred: 9, avail: 10 } },
    { day: "Wed", airport: { pred: 20, avail: 14 }, downtown: { pred: 14, avail: 15 }, mall: { pred: 11, avail: 10 } },
    { day: "Thu", airport: { pred: 28, avail: 14 }, downtown: { pred: 16, avail: 15 }, mall: { pred: 7, avail: 10 } },
    { day: "Fri", airport: { pred: 32, avail: 14 }, downtown: { pred: 18, avail: 15 }, mall: { pred: 14, avail: 10 } },
    { day: "Sat", airport: { pred: 26, avail: 14 }, downtown: { pred: 20, avail: 15 }, mall: { pred: 16, avail: 10 } },
    { day: "Sun", airport: { pred: 24, avail: 14 }, downtown: { pred: 15, avail: 15 }, mall: { pred: 12, avail: 10 } },
];

const BRANCHES = [
    { key: "airport" as const, label: "Airport", color: "bg-blue-500", textColor: "text-blue-400" },
    { key: "downtown" as const, label: "Downtown", color: "bg-emerald-500", textColor: "text-emerald-400" },
    { key: "mall" as const, label: "Mall", color: "bg-violet-500", textColor: "text-violet-400" },
];

export function FleetBrainPredictScreen() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-4">Fleet Brain</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-3">Demand Prediction</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-400 text-center mb-8 max-w-lg">See the surge before it arrives. Position your fleet 3 days ahead.</motion.p>

            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 55 }} className="w-full max-w-3xl bg-slate-800/50 border border-slate-700 rounded-2xl p-5" style={{ boxShadow: "0 12px 40px -10px rgba(0,0,0,0.4)" }}>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-slate-300">7-Day Demand Forecast</p>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[9px] text-slate-400"><span className="w-3 h-1.5 rounded bg-blue-500 inline-block" /> Predicted</span>
                        <span className="flex items-center gap-1 text-[9px] text-slate-400"><span className="w-3 h-1.5 rounded bg-slate-600 inline-block" /> Available</span>
                        <span className="flex items-center gap-1 text-[9px] text-red-400"><span className="w-3 h-1.5 rounded bg-red-400 inline-block" /> Gap</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {BRANCHES.map((branch, bi) => (
                        <div key={branch.key}>
                            <p className={`text-[9px] font-semibold uppercase tracking-wider mb-1.5 ${branch.textColor}`}>{branch.label}</p>
                            <div className="flex gap-2">
                                {FORECAST.map((day, di) => {
                                    const data = day[branch.key];
                                    const hasGap = data.pred > data.avail;
                                    const maxVal = 35;
                                    return (
                                        <div key={di} className="flex-1 flex flex-col items-center gap-0.5">
                                            <div className="w-full flex flex-col-reverse gap-0.5 h-16 justify-end">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${(data.avail / maxVal) * 100}%` }}
                                                    transition={{ delay: 0.4 + bi * 0.1 + di * 0.05, duration: 0.4 }}
                                                    className="w-full bg-slate-600 rounded-t"
                                                />
                                                {hasGap && (
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${((data.pred - data.avail) / maxVal) * 100}%` }}
                                                        transition={{ delay: 0.5 + bi * 0.1 + di * 0.05, duration: 0.4 }}
                                                        className="w-full bg-red-400 rounded-t"
                                                    />
                                                )}
                                            </div>
                                            <span className={`text-[8px] font-medium ${hasGap ? "text-red-400" : "text-slate-400"}`}>{day.day}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <span className="text-[8px] text-white font-bold">AI</span>
                    </div>
                    <p className="text-xs text-blue-400"><span className="font-semibold">Fleet Brain alert:</span> Airport will face a 14-unit shortfall on Friday. Recommend moving vehicles from Beach by Wednesday.</p>
                </div>
            </motion.div>
        </section>
    );
}
