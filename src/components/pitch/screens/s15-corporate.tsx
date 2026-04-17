"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const CREDIT_USED = 38000;
const CREDIT_LIMIT = 50000;
const CREDIT_PCT = CREDIT_USED / CREDIT_LIMIT;

const RENTALS = [
    { name: "Ahmad K.", vehicle: "Tucson HSE", days: 3, amount: "$320", status: "Active", sc: "bg-blue-500/20 text-blue-400" },
    { name: "Sara M.", vehicle: "Accent GL", days: 5, amount: "$450", status: "Invoiced", sc: "bg-emerald-500/20 text-emerald-400" },
    { name: "Omar R.", vehicle: "Sonata", days: 2, amount: "$180", status: "Active", sc: "bg-blue-500/20 text-blue-400" },
    { name: "Layla H.", vehicle: "Creta", days: 7, amount: "$630", status: "Invoiced", sc: "bg-emerald-500/20 text-emerald-400" },
    { name: "Noor T.", vehicle: "Elantra", days: 4, amount: "$360", status: "Pending", sc: "bg-amber-500/20 text-amber-400" },
];

// SVG arc helper
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const start = { x: cx + r * Math.cos(toRad(startAngle - 90)), y: cy + r * Math.sin(toRad(startAngle - 90)) };
    const end = { x: cx + r * Math.cos(toRad(endAngle - 90)), y: cy + r * Math.sin(toRad(endAngle - 90)) };
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export function S15Corporate() {
    const [phase, setPhase] = useState(0);
    const [creditFill, setCreditFill] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 200),
            setTimeout(() => setPhase(2), 700),
            setTimeout(() => setPhase(3), 1200),
            setTimeout(() => setPhase(4), 2000),
            setTimeout(() => setPhase(5), 2800),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    useEffect(() => {
        if (phase >= 3) {
            let start = 0;
            const target = CREDIT_PCT;
            const step = () => {
                start += 0.015;
                if (start < target) { setCreditFill(start); requestAnimationFrame(step); }
                else setCreditFill(target);
            };
            requestAnimationFrame(step);
        }
    }, [phase]);

    const arcEnd = 220 * creditFill; // 220° sweep max

    return (
        <section className="h-screen w-full flex overflow-hidden bg-slate-950">
            {/* LEFT — dark panel */}
            <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", stiffness: 55, damping: 20 }}
                className="w-1/2 flex flex-col items-center justify-center px-12 relative border-r border-slate-800/60"
                style={{ background: "linear-gradient(160deg, #0a0f1e 0%, #050810 100%)" }}
            >
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={phase >= 1 ? { opacity: 1 } : {}}
                    className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 mb-2 self-start"
                >
                    The Money
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                    className="text-5xl font-black text-white self-start mb-1 leading-none"
                >
                    Fleet Corp
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={phase >= 2 ? { opacity: 1 } : {}}
                    className="text-xs text-slate-500 self-start mb-10"
                >
                    Corporate Account · Since 2022
                </motion.p>

                {/* Credit Arc Gauge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={phase >= 3 ? { opacity: 1, scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 60, damping: 18 }}
                    className="relative w-56 h-56 mb-6"
                >
                    <svg viewBox="0 0 160 160" className="w-full h-full -rotate-[110deg]">
                        {/* Track */}
                        <path d={describeArc(80, 80, 60, 0, 220)} fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                        {/* Fill */}
                        {creditFill > 0 && (
                            <path
                                d={describeArc(80, 80, 60, 0, arcEnd)}
                                fill="none"
                                stroke="url(#creditGrad)"
                                strokeWidth="12"
                                strokeLinecap="round"
                            />
                        )}
                        <defs>
                            <linearGradient id="creditGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#22d3ee" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white">$38K</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">of $50K</span>
                        <span className="text-xs text-blue-400 font-semibold mt-1">76% used</span>
                    </div>
                </motion.div>

                {/* Tier badge */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
                    className="px-4 py-2 rounded-full border border-amber-400/30 bg-amber-400/10 flex items-center gap-2"
                >
                    <span className="text-amber-400 text-lg">★</span>
                    <span className="text-xs font-semibold text-amber-300">Gold Tier Account</span>
                </motion.div>
            </motion.div>

            {/* RIGHT — employee rental list */}
            <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", stiffness: 55, damping: 20 }}
                className="w-1/2 flex flex-col justify-center px-10 py-12"
            >
                <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-1">Active Employees</p>
                <h3 className="text-xl font-bold text-white mb-6">Current Rentals</h3>

                <div className="space-y-3">
                    {RENTALS.map((r, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 40 }}
                            animate={phase >= 4 ? { opacity: 1, x: 0 } : {}}
                            transition={{ type: "spring", stiffness: 70, damping: 18, delay: i * 0.1 }}
                            className="rounded-xl border border-slate-700/50 px-4 py-3 flex items-center gap-4"
                            style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                                {r.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white">{r.name}</p>
                                <p className="text-[10px] text-slate-500">{r.vehicle} · {r.days} days</p>
                            </div>
                            <span className="text-sm font-bold text-white">{r.amount}</span>
                            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${r.sc}`}>{r.status}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Invoice preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
                    transition={{ type: "spring", stiffness: 60, damping: 18 }}
                    className="mt-6 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 flex items-center gap-3"
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <p className="text-xs text-slate-300">
                        <span className="font-semibold text-white">Auto-invoice generated:</span> INV-2024-0892 · $1,940 · Fleet Corp
                    </p>
                    <span className="ml-auto text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/20">Sent ✓</span>
                </motion.div>
            </motion.div>
        </section>
    );
}
