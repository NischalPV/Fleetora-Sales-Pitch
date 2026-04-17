"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const METRICS = [
    { label: "Available", value: "12", color: "text-emerald-400" },
    { label: "Checkouts", value: "8", color: "text-blue-400" },
    { label: "Returns Due", value: "5", color: "text-amber-400" },
    { label: "Overdue", value: "1", color: "text-red-400" },
];

const BOOKINGS = [
    { customer: "Ahmad K.", vehicle: "Tucson HSE", due: "5:00 PM", status: "Active", sc: "bg-blue-500/20 text-blue-400" },
    { customer: "Sara M.", vehicle: "Accent GL", due: "2:00 PM", status: "Overdue", sc: "bg-red-500/20 text-red-400" },
    { customer: "Fleet Corp", vehicle: "Elantra", due: "Tomorrow", status: "Active", sc: "bg-blue-500/20 text-blue-400" },
    { customer: "Omar R.", vehicle: "Sonata", due: "6:30 PM", status: "Checkout", sc: "bg-amber-500/20 text-amber-400" },
    { customer: "Layla H.", vehicle: "Creta", due: "Apr 19", status: "Active", sc: "bg-blue-500/20 text-blue-400" },
    { customer: "Noor T.", vehicle: "Tucson", due: "4:00 PM", status: "Returning", sc: "bg-emerald-500/20 text-emerald-400" },
];

export function S07Pos() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 900),
            setTimeout(() => setPhase(3), 1800),
            setTimeout(() => setPhase(4), 2400),
            setTimeout(() => setPhase(5), 3200),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full relative overflow-hidden bg-slate-950 p-6 md:p-10">
            {/* Corner label */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute top-6 left-10 z-10">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400">The Operations Floor</p>
                <p className="text-xs text-slate-500 mt-0.5">POS Dashboard — Airport Branch</p>
            </motion.div>

            {/* Full-bleed browser frame */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                className="w-full h-full rounded-2xl border border-slate-700 overflow-hidden bg-slate-900 flex flex-col"
                style={{ boxShadow: "0 40px 100px -20px rgba(0,0,0,0.5)" }}
            >
                {/* Chrome */}
                <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700 shrink-0">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 bg-slate-700/50 rounded-md px-3 py-1 ml-2 border border-slate-600/50">
                        <span className="text-[10px] text-slate-400">app.fleetora.com/branch/airport</span>
                    </div>
                </div>

                {/* Dashboard content */}
                <div className="flex-1 p-5 overflow-hidden">
                    {/* Metrics */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        {METRICS.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: -30 }}
                                animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                                transition={{ type: "spring", stiffness: 80, damping: 15, delay: i * 0.12 }}
                                className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50"
                            >
                                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">{m.label}</p>
                                <p className={`text-3xl font-bold mt-1 ${m.color}`}>{m.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Walk-in button */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={phase >= 3 ? { opacity: 1, x: 0 } : {}}
                        transition={{ type: "spring", stiffness: 70, damping: 18 }}
                        className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-4 flex items-center justify-between"
                    >
                        <div>
                            <span className="text-emerald-400 font-semibold text-base">+ New Walk-in Booking</span>
                            <p className="text-[10px] text-emerald-400/50 mt-0.5">90-second checkout — the flow you just saw</p>
                        </div>
                        <kbd className="px-3 py-1.5 text-xs font-mono bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/30">N</kbd>
                    </motion.div>

                    {/* Table header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 4 ? { opacity: 1 } : {}}
                        className="grid grid-cols-[1fr_120px_100px_100px] px-4 py-2 text-[10px] text-slate-500 uppercase tracking-wider font-medium border-b border-slate-700/50"
                    >
                        <span>Customer</span><span>Vehicle</span><span>Due</span><span className="text-right">Status</span>
                    </motion.div>

                    {/* Rows */}
                    {BOOKINGS.map((b, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 40 }}
                            animate={phase >= 5 ? { opacity: 1, x: 0 } : {}}
                            transition={{ type: "spring", stiffness: 70, damping: 18, delay: i * 0.08 }}
                            className="grid grid-cols-[1fr_120px_100px_100px] px-4 py-3 border-b border-slate-800/50 items-center"
                        >
                            <span className="text-sm font-medium text-white">{b.customer}</span>
                            <span className="text-xs text-slate-400">{b.vehicle}</span>
                            <span className="text-xs text-slate-400">{b.due}</span>
                            <motion.span
                                className={`text-[10px] font-medium px-2.5 py-1 rounded-full text-right inline-block ${b.sc}`}
                                animate={b.status === "Overdue" ? { opacity: [1, 0.4, 1] } : {}}
                                transition={b.status === "Overdue" ? { duration: 1.5, repeat: Infinity } : {}}
                            >
                                {b.status}
                            </motion.span>
                        </motion.div>
                    ))}
                </div>

                {/* Live bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={phase >= 5 ? { opacity: 1 } : {}}
                    className="px-5 py-2 border-t border-slate-700 flex items-center gap-2 shrink-0"
                >
                    <motion.div className="w-2 h-2 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                    <span className="text-[10px] text-slate-500">Live — Airport Branch — Updated 2s ago</span>
                </motion.div>
            </motion.div>
        </section>
    );
}
