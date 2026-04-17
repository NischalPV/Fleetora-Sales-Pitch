"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { AnimatedCounter } from "../shared/animated-counter";
import { useInView } from "../shared/use-in-view";

const STATS = [
    {
        value: 20,
        suffix: "+",
        label: "minutes per checkout",
        context: "That\u2019s 20 minutes your customer is questioning their choice.",
        ringColor: "#2563eb",
    },
    {
        value: 15,
        suffix: "%",
        label: "of your fleet is invisible",
        context: "Cars at the wrong branch. Revenue evaporating daily.",
        ringColor: "#7c3aed",
    },
    {
        type: "text" as const,
        display: "Weeks",
        label: "before finance sees reality",
        context: "By the time the P&L lands, the decision window has closed.",
        ringColor: "#dc2626",
    },
];

export function DamageScreen() {
    const { ref, isInView } = useInView(0.2);

    return (
        <AuroraBackground>
            <div ref={ref} className="relative z-10 flex flex-col items-center justify-center px-8">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-3xl md:text-5xl font-bold text-white mb-16 text-center tracking-tight"
                >
                    The cost of running blind.
                </motion.h2>

                <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24">
                    {STATS.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ type: "spring", stiffness: 50, damping: 15, delay: i * 0.3 }}
                            className="flex flex-col items-center text-center"
                        >
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
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: i * 0.3 + 0.6 }}
                                className="text-base md:text-lg text-white/80 mt-4 font-semibold"
                            >
                                {stat.label}
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.6, delay: i * 0.3 + 0.9 }}
                                className="text-sm text-white/50 mt-2 max-w-[200px]"
                            >
                                {stat.context}
                            </motion.p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </AuroraBackground>
    );
}
