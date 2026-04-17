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
    { customer: "Ahmad K.", vehicle: "Tucson HSE", plate: "ABC-1234", due: "5:00 PM", status: "Active", sc: "bg-blue-500/20 text-blue-400" },
    { customer: "Sara M.", vehicle: "Accent GL", plate: "DEF-5678", due: "2:00 PM", status: "Overdue", sc: "bg-red-500/20 text-red-400" },
    { customer: "Fleet Corp", vehicle: "Elantra", plate: "GHI-9012", due: "Tomorrow", status: "Active", sc: "bg-blue-500/20 text-blue-400" },
    { customer: "Omar R.", vehicle: "Sonata", plate: "JKL-3456", due: "6:30 PM", status: "Checkout", sc: "bg-amber-500/20 text-amber-400" },
    { customer: "Layla H.", vehicle: "Creta", plate: "MNO-7890", due: "Apr 19", status: "Active", sc: "bg-blue-500/20 text-blue-400" },
    { customer: "Noor T.", vehicle: "Tucson", plate: "PQR-1234", due: "4:00 PM", status: "Returning", sc: "bg-emerald-500/20 text-emerald-400" },
    { customer: "Rami S.", vehicle: "Accent", plate: "STU-5678", due: "7:00 PM", status: "Active", sc: "bg-blue-500/20 text-blue-400" },
];

export function PosDashboardScreen() {
    const [phase, setPhase] = useState(0);
    // 0=nothing, 1=frame, 2=metrics, 3=walkin, 4=header, 5=rows, 6=live

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 800),
            setTimeout(() => setPhase(3), 2000),
            setTimeout(() => setPhase(4), 2600),
            setTimeout(() => setPhase(5), 3000),
            setTimeout(() => setPhase(6), 5000),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-white text-center tracking-tight mb-2">
                POS Dashboard
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm text-slate-400 text-center mb-8">
                What your branch agent sees every morning — assembling live
            </motion.p>

            {/* Browser frame */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 60, damping: 20 }}
                className="w-full max-w-4xl rounded-2xl border border-slate-700 overflow-hidden bg-slate-900"
                style={{ boxShadow: "0 30px 80px -15px rgba(0,0,0,0.4)" }}
            >
                {/* Chrome */}
                <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
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
                <div className="p-4 min-h-[380px]">
                    {/* Metric cards — fly in from top */}
                    <div className="grid grid-cols-4 gap-3 mb-3">
                        {METRICS.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: -30 }}
                                animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                                transition={{ type: "spring", stiffness: 80, damping: 15, delay: i * 0.15 }}
                                className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50"
                            >
                                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">{m.label}</p>
                                <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Walk-in button — slides in from left */}
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={phase >= 3 ? { opacity: 1, x: 0 } : {}}
                        transition={{ type: "spring", stiffness: 80, damping: 18 }}
                        className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-3 flex items-center justify-between"
                    >
                        <div>
                            <span className="text-emerald-400 font-semibold text-sm">+ New Walk-in Booking</span>
                            <p className="text-[10px] text-emerald-400/50 mt-0.5">90-second checkout flow</p>
                        </div>
                        <kbd className="px-2 py-1 text-[10px] font-mono bg-emerald-500/20 rounded text-emerald-400 border border-emerald-500/30">N</kbd>
                    </motion.div>

                    {/* Table header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 4 ? { opacity: 1 } : {}}
                        className="grid grid-cols-[1fr_100px_90px_70px_80px] px-4 py-2 text-[9px] text-slate-500 uppercase tracking-wider font-medium border-b border-slate-700/50"
                    >
                        <span>Customer</span><span>Vehicle</span><span>Plate</span><span>Due</span><span className="text-right">Status</span>
                    </motion.div>

                    {/* Booking rows — cascade in from right */}
                    {BOOKINGS.map((b, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 40 }}
                            animate={phase >= 5 ? { opacity: 1, x: 0 } : {}}
                            transition={{ type: "spring", stiffness: 70, damping: 18, delay: i * 0.1 }}
                            className="grid grid-cols-[1fr_100px_90px_70px_80px] px-4 py-2.5 border-b border-slate-800/50 items-center"
                        >
                            <span className="text-sm font-medium text-white">{b.customer}</span>
                            <span className="text-xs text-slate-400">{b.vehicle}</span>
                            <span className="text-xs font-mono text-slate-500">{b.plate}</span>
                            <span className="text-xs text-slate-400">{b.due}</span>
                            <motion.span
                                className={`text-[10px] font-medium px-2 py-0.5 rounded-full text-right inline-block ${b.sc}`}
                                animate={b.status === "Overdue" && phase >= 6 ? { opacity: [1, 0.5, 1] } : {}}
                                transition={b.status === "Overdue" ? { duration: 1.5, repeat: Infinity } : {}}
                            >
                                {b.status}
                            </motion.span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Live indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={phase >= 6 ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
                className="mt-6 flex items-center gap-2"
            >
                <motion.div className="w-2 h-2 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <span className="text-xs text-slate-500">Live — Airport Branch — Updated 2s ago</span>
            </motion.div>
        </section>
    );
}
