"use client";

import { motion } from "framer-motion";

const STEPS = [
    { icon: "🪪", label: "ID Scan", time: "10s", desc: "Auto-fill customer profile" },
    { icon: "👤", label: "Profile", time: "5s", desc: "History, preferences, alerts" },
    { icon: "🚗", label: "Vehicle", time: "10s", desc: "Select from available inventory" },
    { icon: "💳", label: "Credit Check", time: "3s", desc: "Real-time corporate limit" },
    { icon: "📄", label: "Contract", time: "15s", desc: "Auto-generated, e-sign" },
    { icon: "💵", label: "Payment", time: "10s", desc: "Card, cash, or corporate" },
    { icon: "🔑", label: "Keys", time: "5s", desc: "Assigned and logged" },
];

export function WalkinFlowScreen() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(5,150,105,0.06) 0%, transparent 70%)", top: "10%", left: "-5%" }}
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-semibold tracking-widest uppercase text-emerald-600 mb-4"
            >
                Walk-in Flow
            </motion.p>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold text-slate-900 text-center tracking-tight mb-2"
            >
                90 seconds. Walk-in to wheels out.
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-slate-500 text-center mb-16"
            >
                vs. industry average: 15-20 minutes
            </motion.p>

            {/* Step flow */}
            <div className="flex items-center gap-2 md:gap-4 max-w-5xl w-full justify-center flex-wrap">
                {STEPS.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.4 + i * 0.1 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl mb-2">
                            {step.icon}
                        </div>
                        <p className="text-xs font-semibold text-slate-900">{step.label}</p>
                        <p className="text-[10px] text-emerald-600 font-mono font-bold">{step.time}</p>
                        <p className="text-[10px] text-slate-400 max-w-[80px] mt-0.5">{step.desc}</p>
                        {i < STEPS.length - 1 && (
                            <motion.div
                                className="hidden md:block absolute"
                                style={{ left: `${(i + 1) * 14}%`, top: "52%" }}
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
                className="mt-10 px-6 py-3 rounded-full bg-emerald-50 border border-emerald-200"
            >
                <span className="text-emerald-700 font-semibold text-sm">Total: 58 seconds</span>
                <span className="text-emerald-500 text-sm ml-2">• Including customer signature</span>
            </motion.div>
        </section>
    );
}
