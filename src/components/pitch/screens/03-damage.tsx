"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";
import { AnimatedCounter } from "../shared/animated-counter";

const STATS = [
    {
        value: 20,
        suffix: "+",
        label: "minutes per checkout",
        context: "That's 20 minutes your customer is questioning their choice.",
        ringPercent: 0.65,
        ringColor: "#2563eb",
    },
    {
        value: 15,
        suffix: "%",
        label: "of your fleet is invisible",
        context: "Cars at the wrong branch. Revenue evaporating daily.",
        ringPercent: 0.15,
        ringColor: "#7c3aed",
    },
    {
        type: "text" as const,
        display: "Weeks",
        label: "before finance sees reality",
        context: "By the time the P&L lands, the decision window has closed.",
        ringPercent: 0.85,
        ringColor: "#dc2626",
    },
];

function AnimatedRing({ percent, color, active, delay }: { percent: number; color: string; active: boolean; delay: number }) {
    const size = 200;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <svg width={size} height={size} className="absolute -z-10" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-90deg)" }}>
            {/* Track */}
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
            {/* Progress */}
            <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={active ? { strokeDashoffset: circumference * (1 - percent) } : {}}
                transition={{ duration: 1.5, delay, ease: "easeOut" }}
                opacity={0.3}
            />
        </svg>
    );
}

export function DamageScreen() {
    const { ref, isInView } = useInView(0.3);

    return (
        <section ref={ref} className="h-screen w-full flex items-center justify-center px-8 relative overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-center gap-20 md:gap-28">
                {STATS.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ type: "spring", stiffness: 50, damping: 15, delay: i * 0.3 }}
                        className="flex flex-col items-center text-center relative"
                    >
                        {/* Animated ring */}
                        <AnimatedRing percent={stat.ringPercent} color={stat.ringColor} active={isInView} delay={i * 0.3 + 0.2} />

                        {/* Number */}
                        <div className="text-6xl md:text-8xl font-bold tracking-tight leading-none" style={{ color: stat.ringColor }}>
                            {"type" in stat && stat.type === "text" ? (
                                <motion.span
                                    initial={{ opacity: 0, filter: "blur(8px)" }}
                                    animate={isInView ? { opacity: 1, filter: "blur(0px)" } : {}}
                                    transition={{ duration: 0.8, delay: i * 0.3 + 0.3 }}
                                >
                                    {stat.display}
                                </motion.span>
                            ) : (
                                <AnimatedCounter
                                    target={"value" in stat ? stat.value : 0}
                                    suffix={"suffix" in stat ? stat.suffix : ""}
                                    active={isInView}
                                />
                            )}
                        </div>

                        {/* Label */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.3 + 0.6 }}
                            className="text-base md:text-lg text-slate-700 mt-6 font-semibold"
                        >
                            {stat.label}
                        </motion.p>

                        {/* Context */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: i * 0.3 + 0.9 }}
                            className="text-sm text-slate-400 mt-2 max-w-[200px]"
                        >
                            {stat.context}
                        </motion.p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
