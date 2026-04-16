"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";

const BRANCHES = [
    { label: "Airport", angle: 0 },
    { label: "Downtown", angle: 51 },
    { label: "Mall", angle: 103 },
    { label: "Industrial", angle: 154 },
    { label: "Beach", angle: 206 },
    { label: "Suburb", angle: 257 },
    { label: "Port", angle: 309 },
];

const INSIGHTS = [
    {
        headline: "It sees what you can\u2019t.",
        detail: "Fleet Brain detects Branch A is overstocked while Airport is at 92%. Recommends rebalancing before you ask.",
    },
    {
        headline: "It acts before you do.",
        detail: "Overdue returns flagged. Maintenance windows identified. Demand surges predicted. Proactive alerts, not reactive dashboards.",
    },
    {
        headline: "It learns from every decision.",
        detail: "Every operator choice trains the system. Your operation builds its own intelligence.",
    },
];

function ConstellationSVG({ active }: { active: boolean }) {
    const cx = 200;
    const cy = 200;
    const radius = 140;

    return (
        <svg viewBox="0 0 400 400" className="w-64 h-64 md:w-80 md:h-80">
            {BRANCHES.map((branch, i) => {
                const rad = (branch.angle * Math.PI) / 180;
                const x = cx + Math.cos(rad) * radius;
                const y = cy + Math.sin(rad) * radius;
                return (
                    <g key={i}>
                        <line x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                        <motion.circle
                            r="3"
                            fill="#3b82f6"
                            initial={{ cx: cx, cy: cy, opacity: 0 }}
                            animate={active ? {
                                cx: [cx, x],
                                cy: [cy, y],
                                opacity: [0, 1, 0],
                            } : {}}
                            transition={{
                                duration: 2,
                                delay: i * 0.4,
                                repeat: Infinity,
                                repeatDelay: BRANCHES.length * 0.4,
                            }}
                        />
                    </g>
                );
            })}

            {BRANCHES.map((branch, i) => {
                const rad = (branch.angle * Math.PI) / 180;
                const x = cx + Math.cos(rad) * radius;
                const y = cy + Math.sin(rad) * radius;
                return (
                    <g key={`node-${i}`}>
                        <motion.circle
                            cx={x}
                            cy={y}
                            r="16"
                            fill="#ffffff"
                            stroke="#e2e8f0"
                            strokeWidth="1"
                            initial={{ scale: 0 }}
                            animate={active ? { scale: 1 } : {}}
                            transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 80 }}
                        />
                        <text x={x} y={y + 3} textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="500">
                            {branch.label}
                        </text>
                    </g>
                );
            })}

            <motion.circle
                cx={cx}
                cy={cy}
                r="28"
                fill="#ffffff"
                stroke="#3b82f6"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={active ? { scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 60 }}
            />
            <motion.circle
                cx={cx}
                cy={cy}
                r="40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="0.5"
                opacity="0.15"
                initial={{ scale: 0 }}
                animate={active ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
            />
            <text x={cx} y={cy - 3} textAnchor="middle" fill="#3b82f6" fontSize="7" fontWeight="700">Fleet</text>
            <text x={cx} y={cy + 7} textAnchor="middle" fill="#3b82f6" fontSize="7" fontWeight="700">Brain</text>
        </svg>
    );
}

export function FleetBrainScreen() {
    const { ref, isInView } = useInView(0.3);

    return (
        <section ref={ref} className="h-screen w-full snap-start flex flex-col items-center justify-center px-8 gap-8">
            <ConstellationSVG active={isInView} />
            <div className="flex flex-col gap-4 max-w-2xl w-full">
                {INSIGHTS.map((insight, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ type: "spring", stiffness: 40, damping: 15, delay: 1 + i * 0.4 }}
                        className="flex gap-4 items-start"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0" />
                        <div>
                            <p className="text-base md:text-lg font-semibold text-blue-600">{insight.headline}</p>
                            <p className="text-sm text-slate-500 mt-1">{insight.detail}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
