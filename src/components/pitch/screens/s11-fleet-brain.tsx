"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Brain } from "lucide-react";

const BRANCH_NODES = [
    { label: "Route Opt.", value: "94%", angle: 0 },
    { label: "Demand", value: "87%", angle: 51 },
    { label: "Maintenance", value: "76%", angle: 103 },
    { label: "Pricing", value: "91%", angle: 154 },
    { label: "Transfers", value: "83%", angle: 206 },
    { label: "Forecast", value: "89%", angle: 257 },
    { label: "Risk", value: "72%", angle: 308 },
];

const INSIGHTS = [
    "It sees what you can't",
    "It acts before you do",
    "It learns from every decision",
];

const CX = 300;
const CY = 280;
const RADIUS = 170;

function nodePos(angle: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: CX + RADIUS * Math.cos(rad), y: CY + RADIUS * Math.sin(rad) };
}

export function S11FleetBrain() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 400),
            setTimeout(() => setPhase(2), 1200),
            setTimeout(() => setPhase(3), 2200),
            setTimeout(() => setPhase(4), 3400),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full relative overflow-hidden bg-slate-950 flex flex-col items-center justify-center">
            {/* Radial glow behind constellation */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 60% 55% at 50% 48%, rgba(59,130,246,0.12) 0%, transparent 70%)",
                }}
            />

            {/* Label */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 mb-2 z-10">
                <div className="relative">
                    <Brain className="h-8 w-8 text-emerald-400" />
                    <div className="absolute -inset-1.5 bg-emerald-400/15 rounded-full blur-sm -z-10" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">Fleet Brain Active</span>
                </div>
            </motion.div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={phase >= 1 ? { opacity: 1 } : {}}
                transition={{ duration: 0.6 }}
                className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 mb-2 z-10"
            >
                The Intelligence
            </motion.p>

            {/* SVG Constellation */}
            <motion.svg
                width="600"
                height="560"
                viewBox="0 0 600 560"
                className="z-10"
                initial={{ opacity: 0 }}
                animate={phase >= 1 ? { opacity: 1 } : {}}
                transition={{ duration: 0.8 }}
            >
                <defs>
                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Connection lines */}
                {BRANCH_NODES.map((node, i) => {
                    const pos = nodePos(node.angle);
                    return (
                        <motion.line
                            key={`line-${i}`}
                            x1={CX} y1={CY} x2={pos.x} y2={pos.y}
                            stroke="#3b82f6"
                            strokeWidth="1"
                            strokeOpacity="0.3"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={phase >= 2 ? { pathLength: 1, opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                        />
                    );
                })}

                {/* Pulse dots traveling along lines */}
                {phase >= 3 && BRANCH_NODES.map((node, i) => {
                    const pos = nodePos(node.angle);
                    return (
                        <motion.circle
                            key={`pulse-${i}`}
                            r="3"
                            fill="#60a5fa"
                            filter="url(#glow)"
                            initial={{ cx: CX, cy: CY, opacity: 0 }}
                            animate={{
                                cx: [CX, pos.x, CX],
                                cy: [CY, pos.y, CY],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 2.2,
                                delay: i * 0.35,
                                repeat: Infinity,
                                repeatDelay: 1,
                                ease: "easeInOut",
                            }}
                        />
                    );
                })}

                {/* Pulsing outer ring */}
                <motion.circle
                    cx={CX} cy={CY} r="52"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeOpacity="0.25"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={phase >= 1 ? { scale: [1, 1.12, 1], opacity: [0.5, 0.15, 0.5] } : {}}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: `${CX}px ${CY}px` }}
                />

                {/* Center node glow bg */}
                <circle cx={CX} cy={CY} r="68" fill="url(#centerGlow)" />
                <circle cx={CX} cy={CY} r="44" fill="rgba(15,23,42,0.95)" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.6" />

                {/* Center label */}
                <motion.text
                    x={CX} y={CY - 6}
                    textAnchor="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="700"
                    letterSpacing="1.5"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.2 }}
                    style={{ transformOrigin: `${CX}px ${CY}px` }}
                    filter="url(#glow)"
                >
                    FLEET
                </motion.text>
                <motion.text
                    x={CX} y={CY + 9}
                    textAnchor="middle"
                    fill="#60a5fa"
                    fontSize="11"
                    fontWeight="700"
                    letterSpacing="1.5"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.35 }}
                    style={{ transformOrigin: `${CX}px ${CY}px` }}
                    filter="url(#glow)"
                >
                    BRAIN
                </motion.text>

                {/* Branch nodes */}
                {BRANCH_NODES.map((node, i) => {
                    const pos = nodePos(node.angle);
                    const labelOffset = pos.y < CY ? -22 : 22;
                    const labelY = pos.y + labelOffset;
                    return (
                        <g key={`node-${i}`}>
                            <motion.circle
                                cx={pos.x} cy={pos.y} r="28"
                                fill="rgba(15,23,42,0.9)"
                                stroke="#334155"
                                strokeWidth="1"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={phase >= 2 ? { scale: 1, opacity: 1 } : {}}
                                transition={{ type: "spring", stiffness: 80, delay: 0.3 + i * 0.1 }}
                                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                            />
                            <motion.text
                                x={pos.x} y={pos.y - 4}
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="7.5"
                                fontWeight="600"
                                letterSpacing="0.5"
                                initial={{ opacity: 0 }}
                                animate={phase >= 2 ? { opacity: 1 } : {}}
                                transition={{ delay: 0.5 + i * 0.1 }}
                            >
                                {node.label}
                            </motion.text>
                            <motion.text
                                x={pos.x} y={pos.y + 9}
                                textAnchor="middle"
                                fill="#60a5fa"
                                fontSize="9"
                                fontWeight="700"
                                initial={{ opacity: 0 }}
                                animate={phase >= 2 ? { opacity: 1 } : {}}
                                transition={{ delay: 0.6 + i * 0.1 }}
                            >
                                {node.value}
                            </motion.text>
                        </g>
                    );
                })}
            </motion.svg>

            {/* Insight lines */}
            <div className="flex flex-col items-center gap-2 mt-2 z-10">
                {INSIGHTS.map((text, i) => (
                    <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: i * 0.2 }}
                        className={`text-sm font-medium tracking-wide ${i === 1 ? "text-white" : "text-slate-400"}`}
                    >
                        {text}
                    </motion.p>
                ))}
            </div>
        </section>
    );
}
