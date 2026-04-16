"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
    scrollProgress: number;
}

export function ProgressBar({ scrollProgress }: ProgressBarProps) {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-slate-100">
            <motion.div
                className="h-full"
                style={{
                    width: `${scrollProgress * 100}%`,
                    background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                }}
                transition={{ duration: 0.1 }}
            />
        </div>
    );
}
