"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const LINE_ITEMS = [
    { name: "Ahmad K.", vehicle: "Tucson HSE", days: 3, amount: 320 },
    { name: "Sara M.", vehicle: "Accent", days: 5, amount: 450 },
    { name: "Omar R.", vehicle: "Sonata", days: 2, amount: 180 },
];

const SUBTOTAL = LINE_ITEMS.reduce((s, l) => s + l.amount, 0);
const TAX = Math.round(SUBTOTAL * 0.05);
const TOTAL = SUBTOTAL + TAX;

function CountUp({ target, phase, trigger }: { target: number; phase: number; trigger: number }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (phase >= trigger) {
            let cur = 0;
            const step = () => {
                cur += Math.ceil(target / 40);
                if (cur < target) { setVal(cur); requestAnimationFrame(step); }
                else setVal(target);
            };
            requestAnimationFrame(step);
        }
    }, [phase, trigger, target]);
    return <span>${val.toLocaleString()}</span>;
}

export function S16Invoicing() {
    const [phase, setPhase] = useState(0);
    const [status, setStatus] = useState("Generating...");

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 400),
            setTimeout(() => setPhase(2), 900),
            setTimeout(() => setPhase(3), 1500),
            setTimeout(() => setPhase(4), 2100),
            setTimeout(() => setPhase(5), 2700),
            setTimeout(() => setPhase(6), 3200),
            setTimeout(() => setStatus("Sent ✓"), 3800),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />

            <div className="w-full max-w-lg px-6">
                {/* Label */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={phase >= 1 ? { opacity: 1 } : {}}
                    className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 text-center mb-2"
                >
                    The Money · Auto-Invoicing
                </motion.p>

                {/* Invoice card */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.96 }}
                    animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                    className="rounded-2xl border border-slate-700/60 bg-slate-900/80 overflow-hidden"
                    style={{ boxShadow: "0 0 60px rgba(59,130,246,0.12), 0 30px 80px rgba(0,0,0,0.5)" }}
                >
                    {/* Invoice header */}
                    <div className="px-6 pt-6 pb-4 border-b border-slate-800">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] text-slate-500 tracking-widest uppercase font-medium mb-1">Invoice</p>
                                <h2 className="text-xl font-black text-white tracking-tight">INV-2024-0892</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-500">Billed to</p>
                                <p className="text-sm font-bold text-white">Fleet Corp</p>
                                <p className="text-[10px] text-slate-500">Apr 16, 2024</p>
                            </div>
                        </div>
                    </div>

                    {/* Line items — appear one by one */}
                    <div className="px-6 py-4">
                        {/* Table header */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={phase >= 2 ? { opacity: 1 } : {}}
                            className="grid grid-cols-[1fr_80px_60px_70px] text-[9px] text-slate-600 uppercase tracking-wider font-medium pb-2 border-b border-slate-800/60"
                        >
                            <span>Employee</span><span>Vehicle</span><span className="text-center">Days</span><span className="text-right">Amount</span>
                        </motion.div>

                        {LINE_ITEMS.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 8 }}
                                animate={phase >= 3 + i ? { opacity: 1, y: 0 } : {}}
                                transition={{ type: "spring", stiffness: 80, damping: 18 }}
                                className="grid grid-cols-[1fr_80px_60px_70px] py-3 border-b border-slate-800/40 items-center"
                            >
                                <span className="text-sm font-medium text-white">{item.name}</span>
                                <span className="text-xs text-slate-400">{item.vehicle}</span>
                                <span className="text-xs text-slate-400 text-center">{item.days}d</span>
                                <span className="text-sm font-semibold text-white text-right">${item.amount}</span>
                            </motion.div>
                        ))}

                        {/* Subtotal / Tax / Total */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={phase >= 6 ? { opacity: 1 } : {}}
                            className="pt-4 space-y-2"
                        >
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Subtotal</span>
                                <CountUp target={SUBTOTAL} phase={phase} trigger={6} />
                            </div>
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>VAT (5%)</span>
                                <CountUp target={TAX} phase={phase} trigger={6} />
                            </div>
                            <div className="flex justify-between text-base font-black text-white border-t border-slate-700 pt-2 mt-2">
                                <span>Total</span>
                                <CountUp target={TOTAL} phase={phase} trigger={6} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Status bar */}
                    <div className="px-6 pb-5 pt-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={status}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`w-full py-2.5 rounded-xl text-center text-xs font-bold tracking-wide border ${
                                    status === "Sent ✓"
                                        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                                        : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                                }`}
                            >
                                {status === "Sent ✓" ? (
                                    <span>Sent ✓ — Delivered to Fleet Corp billing</span>
                                ) : (
                                    <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                                        Generating...
                                    </motion.span>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={phase >= 6 ? { opacity: 1 } : {}}
                    className="text-center text-[10px] text-slate-600 mt-4"
                >
                    Zero manual data entry. Invoice generated from booking records automatically.
                </motion.p>
            </div>
        </section>
    );
}
