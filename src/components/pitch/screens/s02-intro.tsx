"use client";

import { motion } from "framer-motion";
import { BackgroundPaths } from "@/components/ui/background-paths";

export function S02Intro() {
    return (
        <div className="relative h-screen w-full">
            <BackgroundPaths
                title="Fleetora"
                subtitle="The operations brain for modern car rental. One platform. Three roles. Every operation."
            />

            {/* Journey hint at bottom */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <div className="flex gap-6">
                    {["Branch Staff", "Franchise Head", "Finance Admin"].map((role, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 3 + i * 0.3 }}
                            className="text-xs text-neutral-500 font-medium tracking-wider uppercase"
                        >
                            {role}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
