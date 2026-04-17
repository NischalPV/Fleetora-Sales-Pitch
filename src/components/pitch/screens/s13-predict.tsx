"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Demand data per day per branch [Airport, Downtown, Mall]
const DEMAND = [
    [55, 40, 32],
    [60, 45, 38],
    [72, 50, 44],
    [88, 62, 58],
    [95, 70, 65],
    [80, 55, 72],
    [68, 48, 60],
];
const CAPACITY = 75; // vehicles available (% scale)
const MAX_VAL = 100;

const BRANCH_COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4"];
const BRANCH_LABELS = ["Airport", "Downtown", "Mall"];

export function S13Predict() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 800),
            setTimeout(() => setPhase(3), 3000),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    const chartH = 280;
    const barW = 16;
    const groupGap = 6;
    const dayGap = 28;
    const totalDays = DAYS.length;
    const chartW = totalDays * (3 * barW + 2 * groupGap + dayGap) + dayGap;
    const capY = chartH - (CAPACITY / MAX_VAL) * chartH;

    return (
        <section className="h-screen w-full relative overflow-hidden bg-slate-950 flex flex-col items-center justify-center px-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                className="text-center mb-4 z-10"
            >
                <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 mb-1">The Intelligence</p>
                <h2 className="text-3xl font-bold text-white">7-Day Demand Forecast</h2>
                <p className="text-sm text-slate-400 mt-1">Fleet Brain predicts demand 4 days ahead — so you can act now</p>
            </motion.div>

            {/* Legend */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={phase >= 1 ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="flex gap-5 mb-4 z-10"
            >
                {BRANCH_LABELS.map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: BRANCH_COLORS[i] }} />
                        <span className="text-[10px] text-slate-400">{b}</span>
                    </div>
                ))}
                <div className="flex items-center gap-1.5">
                    <div className="w-6 h-px border-t-2 border-dashed border-red-500/70" />
                    <span className="text-[10px] text-slate-400">Capacity</span>
                </div>
            </motion.div>

            {/* Chart */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={phase >= 2 ? { opacity: 1 } : {}}
                className="z-10 w-full max-w-4xl bg-slate-900/50 rounded-2xl border border-slate-800 p-6"
            >
                <svg
                    width="100%"
                    viewBox={`0 0 ${chartW + 40} ${chartH + 50}`}
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Y-axis grid lines */}
                    {[25, 50, 75, 100].map((v) => {
                        const y = chartH - (v / MAX_VAL) * chartH;
                        return (
                            <g key={v}>
                                <line x1="30" y1={y} x2={chartW + 30} y2={y} stroke="#1e293b" strokeWidth="1" />
                                <text x="24" y={y + 4} textAnchor="end" fill="#475569" fontSize="8">{v}</text>
                            </g>
                        );
                    })}

                    {/* Capacity line */}
                    <motion.line
                        x1="30" y1={capY} x2={chartW + 30} y2={capY}
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        strokeDasharray="6 4"
                        strokeOpacity="0.7"
                        initial={{ pathLength: 0 }}
                        animate={phase >= 2 ? { pathLength: 1 } : {}}
                        transition={{ duration: 0.8 }}
                    />

                    {/* Bars */}
                    {DAYS.map((day, di) => {
                        const groupX = 30 + di * (3 * barW + 2 * groupGap + dayGap) + dayGap / 2;
                        return (
                            <g key={day}>
                                {DEMAND[di].map((val, bi) => {
                                    const barH = (val / MAX_VAL) * chartH;
                                    const x = groupX + bi * (barW + groupGap);
                                    const y = chartH - barH;
                                    const exceedsCapacity = val > CAPACITY;
                                    const color = exceedsCapacity ? "#ef4444" : BRANCH_COLORS[bi];
                                    const glowStyle = exceedsCapacity
                                        ? { filter: "drop-shadow(0 0 6px rgba(239,68,68,0.7))" }
                                        : {};
                                    return (
                                        <motion.rect
                                            key={bi}
                                            x={x}
                                            width={barW}
                                            rx="3"
                                            fill={color}
                                            fillOpacity={exceedsCapacity ? 0.9 : 0.75}
                                            style={glowStyle}
                                            initial={{ y: chartH, height: 0 }}
                                            animate={phase >= 2 ? { y, height: barH } : {}}
                                            transition={{
                                                duration: 0.7,
                                                delay: di * 0.08 + bi * 0.04,
                                                ease: "easeOut",
                                            }}
                                        />
                                    );
                                })}
                                {/* Day label */}
                                <text
                                    x={groupX + barW + groupGap}
                                    y={chartH + 14}
                                    textAnchor="middle"
                                    fill="#64748b"
                                    fontSize="9"
                                    fontWeight="500"
                                >
                                    {day}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </motion.div>

            {/* Footer insight */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
                className="mt-5 z-10 flex items-center gap-3 bg-blue-500/8 border border-blue-500/20 rounded-xl px-5 py-3"
            >
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                </div>
                <p className="text-sm text-slate-300">
                    <span className="font-semibold text-white">Fleet Brain predicted this 4 days ago</span>
                    {" "}— 3 vehicles pre-positioned to Airport. No shortfall. No scramble.
                </p>
            </motion.div>
        </section>
    );
}
