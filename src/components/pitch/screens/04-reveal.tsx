"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";
import { GlowText } from "../shared/glow-text";

export function RevealScreen() {
    const { ref, isInView } = useInView(0.5);

    return (
        <section ref={ref} className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
            {/* Animated gradient mesh */}
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)", top: "20%", left: "10%" }}
                animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", bottom: "10%", right: "10%" }}
                animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(5,150,105,0.06) 0%, transparent 70%)", top: "50%", right: "30%" }}
                animate={{ x: [0, 20, 0], y: [0, 25, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

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

            <GlowText
                text="Fleetora"
                active={isInView}
                delay={0.3}
                className="text-6xl md:text-[72px] font-bold tracking-[-1px] text-slate-900"
                glowColor="rgba(37,99,235,0.12)"
            />

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
