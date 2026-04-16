"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";

const PHASES = [
    {
        label: "NOW",
        color: "#10b981",
        items: ["HQ Cockpit", "POS Dashboard", "Booking Detail", "Fleet Brain v1"],
    },
    {
        label: "NEXT",
        color: "#3b82f6",
        items: ["Live Tracking", "Maintenance Kanban", "Walk-in Flow", "Corporate Accounts"],
    },
    {
        label: "HORIZON",
        color: "#8b5cf6",
        items: ["Fleet Brain v2", "Dynamic Pricing", "Predictive Maintenance", "Multi-currency"],
    },
];

export function RoadmapScreen() {
    const { ref, isInView } = useInView(0.3);

    return (
        <section ref={ref} className="h-screen w-full snap-start flex flex-col items-center justify-center px-8">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-slate-100 mb-16 text-center"
            >
                And we&apos;re just getting started.
            </motion.h2>

            <div className="relative flex items-start justify-center gap-8 md:gap-16 max-w-4xl w-full">
                <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "100%" } : {}}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                    className="absolute top-4 left-0 h-[2px]"
                    style={{ background: "linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)" }}
                />

                {PHASES.map((phase, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5 + i * 0.4, type: "spring", stiffness: 50, damping: 15 }}
                        className="flex-1 flex flex-col items-center text-center relative z-10"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={isInView ? { scale: 1 } : {}}
                            transition={{ delay: 0.5 + i * 0.4, type: "spring", stiffness: 80 }}
                            className="w-8 h-8 rounded-full border-2 flex items-center justify-center mb-4"
                            style={{
                                borderColor: phase.color,
                                backgroundColor: "#0f172a",
                                boxShadow: `0 0 20px ${phase.color}40`,
                            }}
                        >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: phase.color }} />
                        </motion.div>

                        <p className="text-xs font-bold tracking-widest mb-3" style={{ color: phase.color }}>
                            {phase.label}
                        </p>

                        <div className="flex flex-col gap-1.5">
                            {phase.items.map((item, j) => (
                                <motion.p
                                    key={j}
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : {}}
                                    transition={{ delay: 0.8 + i * 0.4 + j * 0.1 }}
                                    className="text-sm text-slate-400"
                                >
                                    {item}
                                </motion.p>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
