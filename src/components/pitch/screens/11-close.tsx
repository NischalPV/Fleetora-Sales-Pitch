"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";

interface CloseScreenProps {
    email?: string;
}

export function CloseScreen({ email = "sales@monexatech.com" }: CloseScreenProps) {
    const { ref, isInView } = useInView(0.3);

    return (
        <section ref={ref} className="h-screen w-full snap-start flex flex-col items-center justify-center px-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="flex flex-col items-center text-center gap-8"
            >
                <p className="text-2xl font-bold tracking-tight text-slate-300">Fleetora</p>
                <p className="text-xl text-slate-400 max-w-md leading-relaxed">
                    Built for the operators who refuse to run blind.
                </p>
                <div className="mt-8">
                    <p className="text-sm text-slate-600">{email}</p>
                </div>
            </motion.div>
        </section>
    );
}
