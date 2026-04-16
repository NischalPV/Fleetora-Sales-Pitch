"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
    scrollProgress: number;
}

export function ProgressBar({ scrollProgress }: ProgressBarProps) {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent">
            <motion.div
                className="h-full"
                style={{
                    width: `${scrollProgress * 100}%`,
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                }}
                transition={{ duration: 0.1 }}
            />
        </div>
    );
}
