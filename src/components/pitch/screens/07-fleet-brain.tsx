"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";

const BRANCHES = [
    { label: "Airport", angle: -90, util: "92%", color: "#dc2626" },
    { label: "Downtown", angle: -38, util: "78%", color: "#2563eb" },
    { label: "Mall", angle: 14, util: "85%", color: "#2563eb" },
    { label: "Industrial", angle: 66, util: "61%", color: "#d97706" },
    { label: "Beach", angle: 118, util: "45%", color: "#059669" },
    { label: "Suburb", angle: 170, util: "72%", color: "#2563eb" },
    { label: "Port", angle: 222, util: "58%", color: "#d97706" },
];

const INSIGHTS = [
    { headline: "It sees what you can\u2019t.", detail: "Detects imbalances across branches and recommends rebalancing before you ask." },
    { headline: "It acts before you do.", detail: "Flags overdue returns, identifies maintenance windows, predicts demand surges." },
    { headline: "It learns from every decision.", detail: "Every operator choice trains the system. Your fleet gets smarter daily." },
];

function ConstellationSVG({ active }: { active: boolean }) {
    const cx = 300;
    const cy = 280;
    const radius = 200;

    return (
        <svg viewBox="0 0 600 560" className="w-full max-w-3xl">
            {/* Ambient glow */}
            <defs>
                <radialGradient id="centerGlow">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </radialGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <circle cx={cx} cy={cy} r={radius + 40} fill="url(#centerGlow)" />

            {/* Connection lines with animated pulses */}
            {BRANCHES.map((branch, i) => {
                const rad = (branch.angle * Math.PI) / 180;
                const x = cx + Math.cos(rad) * radius;
                const y = cy + Math.sin(rad) * radius;
                return (
                    <g key={`line-${i}`}>
                        <motion.line
                            x1={cx} y1={cy} x2={x} y2={y}
                            stroke="#e2e8f0"
                            strokeWidth="1.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={active ? { pathLength: 1, opacity: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 + i * 0.08 }}
                        />
                        {/* Traveling pulse */}
                        <motion.circle
                            r="4"
                            fill={branch.color}
                            filter="url(#glow)"
                            initial={{ cx, cy, opacity: 0 }}
                            animate={active ? {
                                cx: [cx, x],
                                cy: [cy, y],
                                opacity: [0, 0.8, 0],
                            } : {}}
                            transition={{
                                duration: 1.8,
                                delay: 1 + i * 0.3,
                                repeat: Infinity,
                                repeatDelay: 3,
                            }}
                        />
                    </g>
                );
            })}

            {/* Branch nodes */}
            {BRANCHES.map((branch, i) => {
                const rad = (branch.angle * Math.PI) / 180;
                const x = cx + Math.cos(rad) * radius;
                const y = cy + Math.sin(rad) * radius;
                const labelX = cx + Math.cos(rad) * (radius + 35);
                const labelY = cy + Math.sin(rad) * (radius + 35);
                return (
                    <g key={`node-${i}`}>
                        {/* Node circle */}
                        <motion.circle
                            cx={x} cy={y} r="22"
                            fill="white"
                            stroke={branch.color}
                            strokeWidth="2"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={active ? { scale: 1, opacity: 1 } : {}}
                            transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 80 }}
                            filter="url(#glow)"
                        />
                        {/* Utilization inside */}
                        <motion.text
                            x={x} y={y + 1}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={branch.color}
                            fontSize="11"
                            fontWeight="700"
                            initial={{ opacity: 0 }}
                            animate={active ? { opacity: 1 } : {}}
                            transition={{ delay: 0.6 + i * 0.1 }}
                        >
                            {branch.util}
                        </motion.text>
                        {/* Label outside */}
                        <motion.text
                            x={labelX} y={labelY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#64748b"
                            fontSize="10"
                            fontWeight="500"
                            initial={{ opacity: 0 }}
                            animate={active ? { opacity: 1 } : {}}
                            transition={{ delay: 0.7 + i * 0.1 }}
                        >
                            {branch.label}
                        </motion.text>
                    </g>
                );
            })}

            {/* Center node */}
            <motion.circle
                cx={cx} cy={cy} r="40"
                fill="white"
                stroke="#2563eb"
                strokeWidth="2.5"
                initial={{ scale: 0 }}
                animate={active ? { scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 60 }}
                filter="url(#glow)"
            />
            {/* Pulse ring */}
            <motion.circle
                cx={cx} cy={cy} r="55"
                fill="none"
                stroke="#2563eb"
                strokeWidth="1"
                initial={{ scale: 0, opacity: 0 }}
                animate={active ? { scale: [1, 1.4], opacity: [0.3, 0] } : {}}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            />
            <text x={cx} y={cy - 6} textAnchor="middle" fill="#2563eb" fontSize="11" fontWeight="700">Fleet</text>
            <text x={cx} y={cy + 8} textAnchor="middle" fill="#2563eb" fontSize="11" fontWeight="700">Brain</text>
        </svg>
    );
}

export function FleetBrainScreen() {
    const { ref, isInView } = useInView(0.2);

    return (
        <section ref={ref} className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden">
            {/* Radial gradient backdrop */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(37,99,235,0.05) 0%, transparent 60%)" }} />

            {/* Title */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center"
            >
                The system thinks with you.
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
                className="text-base text-slate-500 mb-8 text-center max-w-lg"
            >
                Fleet Brain monitors every branch in real time — predicting, rebalancing, optimizing.
            </motion.p>

            {/* Constellation - larger */}
            <div className="relative w-full max-w-2xl">
                <ConstellationSVG active={isInView} />
            </div>

            {/* Insights row */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 mt-4 max-w-3xl">
                {INSIGHTS.map((insight, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ type: "spring", stiffness: 40, damping: 15, delay: 1.5 + i * 0.3 }}
                        className="flex-1 text-center"
                    >
                        <p className="text-sm font-semibold text-blue-600">{insight.headline}</p>
                        <p className="text-xs text-slate-400 mt-1">{insight.detail}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
