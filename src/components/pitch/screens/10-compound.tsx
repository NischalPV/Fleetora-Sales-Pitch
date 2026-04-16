"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";

const LINES = [
    "Every booking becomes training data.",
    "Every return feeds back into pricing.",
    "Every decision sharpens the next one.",
];

const CURVE_PATH = "M 20 180 Q 60 175 100 160 Q 150 140 180 100 Q 210 50 240 20 Q 260 5 280 2";

export function CompoundScreen() {
    const { ref, isInView } = useInView(0.3);

    return (
        <section ref={ref} className="h-screen w-full flex items-center justify-center px-8">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 max-w-4xl">
                <div className="w-64 h-48 md:w-80 md:h-56 shrink-0">
                    <svg viewBox="0 0 300 200" className="w-full h-full">
                        <line x1="20" y1="180" x2="280" y2="180" stroke="#e2e8f0" strokeWidth="1" />
                        <line x1="20" y1="180" x2="20" y2="10" stroke="#e2e8f0" strokeWidth="1" />

                        <motion.path
                            d={CURVE_PATH}
                            fill="none"
                            stroke="url(#curveGradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={isInView ? { pathLength: 1 } : {}}
                            transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
                        />

                        <motion.path
                            d={CURVE_PATH}
                            fill="none"
                            stroke="url(#curveGradient)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            opacity="0.2"
                            filter="blur(4px)"
                            initial={{ pathLength: 0 }}
                            animate={isInView ? { pathLength: 1 } : {}}
                            transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
                        />

                        <defs>
                            <linearGradient id="curveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <div className="flex flex-col gap-4">
                    {LINES.map((line, i) => (
                        <motion.p
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 1 + i * 0.4, type: "spring", stiffness: 40, damping: 15 }}
                            className="text-lg md:text-xl text-slate-600"
                        >
                            {line}
                        </motion.p>
                    ))}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 2.5, duration: 0.8 }}
                        className="text-xl md:text-2xl font-semibold text-blue-600 mt-4"
                    >
                        Your competitors can&apos;t copy an advantage that compounds daily.
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
