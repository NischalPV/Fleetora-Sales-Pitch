"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const SEGMENTS = [
    { label: "Collected", pct: 65, color: "#22c55e", startAngle: 0 },
    { label: "Outstanding", pct: 25, color: "#3b82f6", startAngle: 65 },
    { label: "Overdue", pct: 10, color: "#ef4444", startAngle: 90 },
];

const TRANSACTIONS = [
    { desc: "Ahmad K.", invoice: "INV-0892", amount: "$320", status: "Paid", sc: "bg-emerald-500/20 text-emerald-400" },
    { desc: "Fleet Corp", invoice: "INV-0891", amount: "$450", status: "Pending", sc: "bg-blue-500/20 text-blue-400" },
    { desc: "Alpha Bank LLC", invoice: "INV-0877", amount: "$8,200", status: "Overdue", sc: "bg-red-500/20 text-red-400" },
    { desc: "Sara M.", invoice: "INV-0889", amount: "$180", status: "Paid", sc: "bg-emerald-500/20 text-emerald-400" },
    { desc: "Omar R.", invoice: "INV-0885", amount: "$630", status: "Paid", sc: "bg-emerald-500/20 text-emerald-400" },
    { desc: "Layla H.", invoice: "INV-0881", amount: "$360", status: "Pending", sc: "bg-blue-500/20 text-blue-400" },
];

// Build SVG donut path for a segment
function donutArc(cx: number, cy: number, r: number, innerR: number, startDeg: number, endDeg: number) {
    const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
    const s = toRad(startDeg * 3.6);
    const e = toRad(endDeg * 3.6);
    const large = endDeg - startDeg > 50 ? 1 : 0;
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    const ix1 = cx + innerR * Math.cos(e), iy1 = cy + innerR * Math.sin(e);
    const ix2 = cx + innerR * Math.cos(s), iy2 = cy + innerR * Math.sin(s);
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${large} 0 ${ix2} ${iy2} Z`;
}

export function S17Payments() {
    const [phase, setPhase] = useState(0);
    const [visibleTx, setVisibleTx] = useState(0);
    const [donutPct, setDonutPct] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 800),
            setTimeout(() => setPhase(3), 1400),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    // Animate donut fill
    useEffect(() => {
        if (phase >= 2) {
            let v = 0;
            const tick = () => { v += 1.5; if (v < 100) { setDonutPct(v); requestAnimationFrame(tick); } else setDonutPct(100); };
            requestAnimationFrame(tick);
        }
    }, [phase]);

    // Stream transactions
    useEffect(() => {
        if (phase >= 3) {
            let i = 0;
            const next = () => {
                i++; setVisibleTx(i);
                if (i < TRANSACTIONS.length) setTimeout(next, 380);
            };
            setTimeout(next, 200);
        }
    }, [phase]);

    const scale = donutPct / 100;

    return (
        <section className="h-screen w-full flex overflow-hidden bg-slate-950">
            {/* LEFT — donut chart */}
            <div className="w-1/2 flex flex-col items-center justify-center px-10 border-r border-slate-800/50">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={phase >= 1 ? { opacity: 1 } : {}}
                    className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 mb-1 self-start"
                >
                    The Money · Settlement
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 12 }}
                    animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                    className="text-2xl font-bold text-white self-start mb-8"
                >
                    Payment Overview
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 55, damping: 18 }}
                    className="relative w-64 h-64"
                >
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        {SEGMENTS.map((seg, i) => {
                            const start = seg.startAngle * scale;
                            const end = (seg.startAngle + seg.pct) * scale;
                            return (
                                <path
                                    key={i}
                                    d={donutArc(100, 100, 85, 58, start, end)}
                                    fill={seg.color}
                                    opacity={0.85}
                                />
                            );
                        })}
                        {/* Gap rings */}
                        <circle cx="100" cy="100" r="57" fill="#020817" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs text-slate-500">Total Billed</span>
                        <span className="text-3xl font-black text-white mt-0.5">$48.2K</span>
                        <span className="text-[10px] text-emerald-400 mt-0.5">This Month</span>
                    </div>
                </motion.div>

                {/* Legend */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={phase >= 2 ? { opacity: 1 } : {}}
                    className="mt-6 flex gap-6"
                >
                    {SEGMENTS.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                            <div>
                                <p className="text-xs font-bold text-white">{s.pct}%</p>
                                <p className="text-[9px] text-slate-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* RIGHT — transaction stream */}
            <div className="w-1/2 flex flex-col justify-center px-10 py-12">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={phase >= 3 ? { opacity: 1 } : {}}
                    className="flex items-center gap-2 mb-5"
                >
                    <motion.div
                        className="w-2 h-2 rounded-full bg-emerald-400"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                    />
                    <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">Live Transactions</span>
                </motion.div>

                <div className="space-y-2.5">
                    {TRANSACTIONS.slice(0, visibleTx).map((tx, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: "spring", stiffness: 80, damping: 18 }}
                            className="flex items-center gap-3 bg-slate-800/40 rounded-xl border border-slate-700/40 px-4 py-3"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{tx.desc}</p>
                                <p className="text-[10px] text-slate-500">{tx.invoice}</p>
                            </div>
                            <span className="text-sm font-bold text-white">{tx.amount}</span>
                            <span className={`text-[9px] font-semibold px-2.5 py-1 rounded-full ${tx.sc}`}>{tx.status}</span>
                        </motion.div>
                    ))}

                    {/* Scanning indicator */}
                    {phase >= 3 && visibleTx < TRANSACTIONS.length && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.7, repeat: Infinity }}
                            className="h-10 rounded-xl border border-blue-500/30 bg-blue-500/5"
                        />
                    )}
                </div>

                {/* Summary stat */}
                {visibleTx >= TRANSACTIONS.length && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-5 grid grid-cols-3 gap-3"
                    >
                        {[
                            { v: "$31.3K", l: "Collected", c: "text-emerald-400" },
                            { v: "$12.1K", l: "Outstanding", c: "text-blue-400" },
                            { v: "$4.8K", l: "Overdue", c: "text-red-400" },
                        ].map((s, i) => (
                            <div key={i} className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40 text-center">
                                <p className={`text-lg font-black ${s.c}`}>{s.v}</p>
                                <p className="text-[9px] text-slate-500 mt-0.5">{s.l}</p>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
