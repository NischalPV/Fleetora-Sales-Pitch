"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";
import { AnimatedCounter } from "../shared/animated-counter";

const STATS = [
    {
        value: 20,
        suffix: "+",
        label: "minutes per checkout",
        context: "That\u2019s 20 minutes your customer is questioning their choice.",
        color: "text-amber-500",
    },
    {
        value: 15,
        suffix: "%",
        label: "of your fleet is invisible",
        context: "Cars at the wrong branch. Revenue evaporating daily.",
        color: "text-amber-500",
    },
    {
        type: "text" as const,
        display: "Weeks",
        label: "before finance sees reality",
        context: "By the time the P\u0026L lands, the decision window has closed.",
        color: "text-amber-500",
    },
];

export function DamageScreen() {
    const { ref, isInView } = useInView(0.3);

    return (
        <section ref={ref} className="h-screen w-full snap-start flex items-center justify-center px-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24">
                {STATS.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ type: "spring", stiffness: 40, damping: 15, delay: i * 0.5 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className={`text-7xl md:text-[120px] font-bold tracking-tight leading-none ${stat.color}`}>
                            {"type" in stat && stat.type === "text" ? (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : {}}
                                    transition={{ duration: 0.8, delay: i * 0.5 + 0.3 }}
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
                        <p className="text-lg md:text-xl text-slate-300 mt-4 font-medium">
                            {stat.label}
                        </p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: i * 0.5 + 0.8 }}
                            className="text-sm text-slate-500 mt-2 max-w-xs"
                        >
                            {stat.context}
                        </motion.p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
