"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Car } from "lucide-react";

const FULL_TEXT = "One platform. Five stories.";

const JOURNEYS = [
    { num: "01", label: "The Counter", desc: "90-second walk-in checkout. ID scan to keys in hand.", icon: "⌨️", color: "#3b82f6" },
    { num: "02", label: "The Operations Floor", desc: "Fleet-wide visibility. Every vehicle, every branch, real time.", icon: "📊", color: "#10b981" },
    { num: "03", label: "The Intelligence", desc: "Fleet Brain — AI that predicts, recommends, and learns.", icon: "🧠", color: "#8b5cf6" },
    { num: "04", label: "The Money", desc: "Enterprise finance. GL, receivables, reconciliation, compliance.", icon: "💰", color: "#f59e0b" },
    { num: "05", label: "The Future", desc: "Dynamic pricing. Predictive maintenance. Multi-currency.", icon: "🚀", color: "#06b6d4" },
];

export function S02Intro() {
    const [typedChars, setTypedChars] = useState(0);
    const [phase, setPhase] = useState<"typing" | "shrinking" | "cards">("typing");

    useEffect(() => {
        // Type each character
        const typeTimers: NodeJS.Timeout[] = [];
        for (let i = 0; i < FULL_TEXT.length; i++) {
            typeTimers.push(setTimeout(() => setTypedChars(i + 1), 600 + i * 60));
        }

        // After typing, shrink and slide up
        const shrinkDelay = 600 + FULL_TEXT.length * 60 + 500;
        typeTimers.push(setTimeout(() => setPhase("shrinking"), shrinkDelay));

        // Then show cards
        typeTimers.push(setTimeout(() => setPhase("cards"), shrinkDelay + 800));

        return () => typeTimers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            {/* Background car image with dark overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80"
                    alt=""
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/90" />
            </div>

            {/* Fleetora logo */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2.5 mb-6 relative z-10"
            >
                <div className="relative">
                    <Car className="h-7 w-7 text-emerald-400" />
                    <div className="absolute -inset-1.5 bg-emerald-400/15 rounded-full blur-sm -z-10" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">Fleetora</span>
            </motion.div>

            {/* Typewriter heading */}
            <motion.div
                className="relative z-10 text-center"
                animate={phase === "shrinking" || phase === "cards" ? { scale: 0.6, y: -120, opacity: 0.5 } : {}}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            >
                <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                    {FULL_TEXT.slice(0, typedChars)}
                    {phase === "typing" && (
                        <motion.span
                            className="inline-block w-[3px] h-[1em] bg-blue-500 ml-1 align-middle"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        />
                    )}
                </h2>
            </motion.div>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={phase === "cards" ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-slate-400 text-center mb-10 relative z-10 mt-[-80px]"
            >
                Each one shows a different part of your operation — transformed.
            </motion.p>

            {/* Journey cards — bigger */}
            <AnimatePresence>
                {phase === "cards" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-4 max-w-6xl w-full relative z-10"
                    >
                        {JOURNEYS.map((j, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 60, damping: 18, delay: i * 0.12 }}
                                className="flex-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl">{j.icon}</span>
                                    <span className="text-[10px] font-mono text-slate-600">{j.num}</span>
                                </div>
                                <p className="text-base font-bold text-white mb-2">{j.label}</p>
                                <p className="text-sm text-slate-400 leading-relaxed">{j.desc}</p>
                                <motion.div
                                    className="h-0.5 rounded-full mt-4"
                                    style={{ backgroundColor: j.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: 40 }}
                                    transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
