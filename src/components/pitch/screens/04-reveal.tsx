"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";
import { GlowText } from "../shared/glow-text";

export function RevealScreen() {
    const { ref, isInView } = useInView(0.5);

    return (
        <section ref={ref} className="h-screen w-full snap-start flex flex-col items-center justify-center px-8 relative overflow-hidden">
            {/* Background glow bloom */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.05) 40%, transparent 70%)",
                }}
            />

            {/* Logo */}
            <GlowText
                text="Fleetora"
                active={isInView}
                delay={0.3}
                className="text-6xl md:text-[72px] font-bold tracking-[-1px] text-slate-900"
                glowColor="rgba(37,99,235,0.12)"
            />

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
                className="text-lg md:text-xl text-slate-500 mt-6 text-center max-w-lg"
            >
                One command surface. Every branch. Every vehicle. Every decision.
            </motion.p>
        </section>
    );
}
