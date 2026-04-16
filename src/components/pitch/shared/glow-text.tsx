"use client";

import { motion } from "framer-motion";

interface GlowTextProps {
    text: string;
    className?: string;
    glowColor?: string;
    active: boolean;
    delay?: number;
}

export function GlowText({ text, className = "", glowColor = "rgba(37,99,235,0.15)", active, delay = 0 }: GlowTextProps) {
    return (
        <div className="relative inline-block">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={active ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1.2, delay }}
                className="absolute inset-0 blur-3xl -z-10"
                style={{ background: `radial-gradient(ellipse, ${glowColor}, transparent 70%)` }}
            />
            <motion.span
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={active ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
                transition={{ type: "spring", stiffness: 60, damping: 20, delay }}
                className={className}
            >
                {text}
            </motion.span>
        </div>
    );
}
