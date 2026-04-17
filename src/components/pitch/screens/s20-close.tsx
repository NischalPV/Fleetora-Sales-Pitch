"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Car } from "lucide-react";

export function S20Close() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 400),
            setTimeout(() => setPhase(2), 1200),
            setTimeout(() => setPhase(3), 2000),
            setTimeout(() => setPhase(4), 2800),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden px-8">
            {/* Very subtle radial glow — breathing */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(59,130,246,0.07) 0%, transparent 70%)",
                }}
            />

            {/* Wordmark */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative mb-10"
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Car className="h-10 w-10 text-emerald-400" />
                        <div className="absolute -inset-2 bg-emerald-400/15 rounded-full blur-md -z-10" />
                    </div>
                    <span className="text-5xl md:text-7xl font-bold text-white tracking-tight">Fleetora</span>
                </div>
                {/* Subtle underline glow */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={phase >= 1 ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                    className="absolute -bottom-1 left-0 right-0 h-0.5 origin-left"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)" }}
                />
            </motion.div>

            {/* Tagline */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={phase >= 2 ? { opacity: 1 } : {}}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-base text-slate-400 mb-8 text-center font-light tracking-wide"
            >
                2-week pilot. One branch. Real results.
            </motion.p>

            {/* Contact */}
            <motion.a
                href="mailto:sales@monexatech.com"
                initial={{ opacity: 0 }}
                animate={phase >= 3 ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-sm text-slate-500 mb-12 hover:text-blue-400 transition-colors duration-300"
            >
                sales@monexatech.com
            </motion.a>

            {/* Final question */}
            <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-xl font-semibold text-slate-300 text-center"
            >
                Which branch would you like to start with?
            </motion.p>

            {/* Journey label */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={phase >= 2 ? { opacity: 1 } : {}}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-semibold tracking-widest uppercase text-slate-700"
            >
                The Future
            </motion.p>
        </section>
    );
}
