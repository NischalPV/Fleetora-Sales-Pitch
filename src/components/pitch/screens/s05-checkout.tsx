"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const STEPS = [
    { icon: "🪪", label: "ID Scan", detail: "Profile auto-filled", duration: 1500 },
    { icon: "🚗", label: "Vehicle", detail: "Tucson HSE — Airport", duration: 1500 },
    { icon: "💳", label: "Credit", detail: "Fleet Corp — Approved ✓", duration: 1200 },
    { icon: "📄", label: "Contract", detail: "Signed digitally", duration: 1500 },
    { icon: "💵", label: "Payment", detail: "$400 → Fleet Corp", duration: 1200 },
    { icon: "🔑", label: "Keys", detail: "Bay 7 — GPS active", duration: 1200 },
];

export function S05Checkout() {
    const [activeStep, setActiveStep] = useState(-1);
    const [elapsed, setElapsed] = useState(0);
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        let totalDelay = 800;
        const timers: NodeJS.Timeout[] = [];

        STEPS.forEach((step, i) => {
            timers.push(setTimeout(() => setActiveStep(i), totalDelay));
            totalDelay += step.duration;
        });

        timers.push(setTimeout(() => setComplete(true), totalDelay + 500));

        const interval = setInterval(() => setElapsed(prev => Math.min(prev + 1, 90)), 1000);

        return () => { timers.forEach(clearTimeout); clearInterval(interval); };
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/3 blur-3xl rounded-full pointer-events-none" />

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-3">The Counter — Checkout</motion.p>

            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white text-center tracking-tight mb-1">
                90 seconds. Walk-in to wheels out.
            </motion.h2>

            {/* Timer */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-8 flex items-center gap-2">
                <span className={`text-2xl font-mono font-bold tabular-nums ${complete ? "text-emerald-400" : "text-blue-400"}`}>{elapsed}s</span>
                <span className="text-xs text-slate-500">/ 90s</span>
            </motion.div>

            {/* Horizontal steps */}
            <div className="flex items-start gap-3 md:gap-6 max-w-4xl w-full justify-center mb-8">
                {STEPS.map((step, i) => {
                    const status = i < activeStep ? "done" : i === activeStep ? "active" : "pending";
                    return (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }} className="flex flex-col items-center text-center flex-1 relative">
                            {i > 0 && (
                                <div className="absolute -left-1.5 md:-left-3 top-6 w-3 md:w-6 h-px">
                                    <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={i <= activeStep ? { width: "100%" } : {}} transition={{ duration: 0.3 }} />
                                    <div className="h-full w-full bg-slate-800 absolute top-0 -z-10" />
                                </div>
                            )}
                            <motion.div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-2 transition-all duration-300 ${
                                    status === "done" ? "bg-emerald-500/20 border border-emerald-500/30" :
                                    status === "active" ? "bg-blue-500/20 border border-blue-500/30 ring-4 ring-blue-500/10" :
                                    "bg-slate-800/50 border border-slate-700"
                                }`}
                            >
                                {status === "done" ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400 text-sm">✓</motion.span> : step.icon}
                            </motion.div>
                            <p className={`text-[10px] font-semibold ${status === "active" ? "text-blue-400" : status === "done" ? "text-emerald-400" : "text-slate-600"}`}>{step.label}</p>
                            <AnimatePresence>
                                {(status === "active" || status === "done") && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] text-slate-500 max-w-[100px] mt-0.5">{step.detail}</motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Completion card — replaces s06 */}
            <AnimatePresence>
                {complete && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 60, damping: 20 }}
                        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-xl">🔑</div>
                                <div>
                                    <p className="text-sm font-bold text-white">Booking Complete — BK-20260417-042</p>
                                    <p className="text-xs text-white/50">Ahmad Khalil • Tucson HSE • 58 seconds</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Active</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {["GPS tracking started", "HQ dashboard updated", "Invoice queued", "Insurance activated", "Maintenance schedule checked"].map((action, i) => (
                                <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.08 }} className="text-[10px] text-white/50 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                                    {action}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
