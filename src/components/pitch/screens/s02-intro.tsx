"use client";

import { motion } from "framer-motion";
import { Car } from "lucide-react";

const JOURNEYS = [
    { num: "01", label: "The Counter", desc: "90-second walk-in checkout", icon: "⌨️", color: "#3b82f6" },
    { num: "02", label: "The Operations Floor", desc: "Fleet-wide visibility in real time", icon: "📊", color: "#10b981" },
    { num: "03", label: "The Intelligence", desc: "AI that thinks with you", icon: "🧠", color: "#8b5cf6" },
    { num: "04", label: "The Money", desc: "Enterprise-grade financial operations", icon: "💰", color: "#f59e0b" },
    { num: "05", label: "The Future", desc: "Where we're headed", icon: "🚀", color: "#06b6d4" },
];

export function S02Intro() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2.5 mb-8"
            >
                <div className="relative">
                    <Car className="h-7 w-7 text-emerald-400" />
                    <div className="absolute -inset-1.5 bg-emerald-400/15 rounded-full blur-sm -z-10" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">Fleetora</span>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-4"
            >
                What you&apos;re about to see
            </motion.p>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-3"
            >
                One platform. Five stories.
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-base text-slate-400 text-center mb-14 max-w-md"
            >
                Each one shows a different part of your operation — transformed.
            </motion.p>

            <div className="flex gap-4 max-w-5xl w-full">
                {JOURNEYS.map((j, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 60, damping: 18, delay: 0.5 + i * 0.15 }}
                        className="flex-1 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 hover:bg-slate-800/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{j.icon}</span>
                            <span className="text-[10px] font-mono text-slate-600">{j.num}</span>
                        </div>
                        <p className="text-sm font-bold text-white mb-1">{j.label}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{j.desc}</p>
                        <motion.div
                            className="w-8 h-0.5 rounded-full mt-3"
                            style={{ backgroundColor: j.color }}
                            initial={{ width: 0 }}
                            animate={{ width: 32 }}
                            transition={{ delay: 0.8 + i * 0.15, duration: 0.4 }}
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
