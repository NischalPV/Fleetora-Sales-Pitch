"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";

const PAIRS = [
    { before: "Manual ID scanning", after: "Auto ID capture & verification" },
    { before: "Phone calls to verify credit", after: "Live credit limit enforcement" },
    { before: "Paper contracts", after: "Digital contract + e-sign" },
    { before: "WhatsApp for transfers", after: "Tracked transfer orders with map" },
    { before: "End-of-month reconciliation", after: "Real-time financial visibility" },
    { before: "Gut-feel pricing", after: "AI-optimized dynamic pricing" },
];

export function AutomationScreen() {
    const { ref, isInView } = useInView(0.3);

    return (
        <section ref={ref} className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden">
            {/* Split gradient background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 via-transparent to-blue-50/50" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
            </div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center"
            >
                What used to take hours.
            </motion.h2>

            <div className="grid grid-cols-2 gap-x-8 md:gap-x-16 gap-y-4 max-w-3xl w-full">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3 }}
                    className="text-xs font-bold tracking-widest uppercase text-red-500 mb-2"
                >
                    Before
                </motion.p>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3 }}
                    className="text-xs font-bold tracking-widest uppercase text-blue-500 mb-2"
                >
                    With Fleetora
                </motion.p>

                {PAIRS.map((pair, i) => (
                    <div key={i} className="contents">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.5 + i * 0.2 }}
                            className="relative"
                        >
                            <span className="text-sm md:text-base text-slate-400">{pair.before}</span>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={isInView ? { width: "100%" } : {}}
                                transition={{ delay: 0.8 + i * 0.2, duration: 0.3 }}
                                className="absolute top-1/2 left-0 h-[1px] bg-red-400/60"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 1.0 + i * 0.2 }}
                        >
                            <span className="text-sm md:text-base text-blue-600 font-medium">{pair.after}</span>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    );
}
