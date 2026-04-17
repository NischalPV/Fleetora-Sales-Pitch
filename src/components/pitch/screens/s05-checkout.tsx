"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const STEPS = [
    { icon: "\u{1FAAA}", label: "ID Scan", detail: "Auto-fill profile from scan", duration: 2000 },
    { icon: "\u{1F697}", label: "Vehicle", detail: "Tucson HSE selected \u2014 available at Airport", duration: 2000 },
    { icon: "\u{1F4B3}", label: "Credit Check", detail: "Fleet Corp \u2014 $320 against $12K limit \u2014 Approved \u2713", duration: 1500 },
    { icon: "\u{1F4C4}", label: "Contract", detail: "3 days, $106.67/day, comprehensive insurance \u2014 Signed digitally", duration: 2000 },
    { icon: "\u{1F4B5}", label: "Payment", detail: "$400.00 charged to Fleet Corp corporate account", duration: 1500 },
    { icon: "\u{1F511}", label: "Keys", detail: "Tucson HSE \u2022 ABC-1234 \u2022 Bay 7 \u2014 GPS tracking active", duration: 1500 },
];

export function S05Checkout() {
    const [activeStep, setActiveStep] = useState(-1);
    const [elapsed, setElapsed] = useState(0);
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        let totalDelay = 800;
        const timers: NodeJS.Timeout[] = [];

        STEPS.forEach((step, i) => {
            timers.push(setTimeout(() => setActiveStep(i), totalDelay));
            totalDelay += step.duration;
        });

        timers.push(setTimeout(() => setComplete(true), totalDelay));

        // Elapsed timer
        const interval = setInterval(() => setElapsed(prev => prev + 1), 1000);

        // Loop
        timers.push(setTimeout(() => {
            setActiveStep(-1);
            setElapsed(0);
            setComplete(false);
        }, totalDelay + 4000));

        return () => { timers.forEach(clearTimeout); clearInterval(interval); };
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            {/* Subtle radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/3 blur-3xl rounded-full pointer-events-none" />

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4"
            >
                The Counter — The Checkout
            </motion.p>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-2"
            >
                90 seconds. Walk-in to wheels out.
            </motion.h2>

            {/* Timer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-16 flex items-center gap-3"
            >
                <motion.span
                    className={`text-3xl font-mono font-bold tabular-nums ${complete ? "text-emerald-400" : "text-blue-400"}`}
                    animate={complete ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                >
                    {elapsed}s
                </motion.span>
                <span className="text-sm text-slate-500">/ 90s limit</span>
            </motion.div>

            {/* Horizontal step timeline */}
            <div className="flex items-start gap-4 md:gap-8 max-w-5xl w-full justify-center">
                {STEPS.map((step, i) => {
                    const status = i < activeStep ? "done" : i === activeStep ? "active" : "pending";
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="flex flex-col items-center text-center flex-1 relative"
                        >
                            {/* Connector line */}
                            {i > 0 && (
                                <div className="absolute -left-2 md:-left-4 top-7 w-4 md:w-8 h-px">
                                    <motion.div
                                        className="h-full bg-emerald-500"
                                        initial={{ width: 0 }}
                                        animate={i <= activeStep ? { width: "100%" } : {}}
                                        transition={{ duration: 0.3, delay: 0.2 }}
                                    />
                                    <div className="h-full w-full bg-slate-800 absolute top-0 left-0 -z-10" />
                                </div>
                            )}

                            {/* Icon circle */}
                            <motion.div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-3 transition-all duration-500 ${
                                    status === "done" ? "bg-emerald-500/20 border border-emerald-500/30" :
                                    status === "active" ? "bg-blue-500/20 border border-blue-500/30 ring-4 ring-blue-500/10" :
                                    "bg-slate-800/50 border border-slate-700"
                                }`}
                                animate={status === "active" ? { scale: [1, 1.05, 1] } : {}}
                                transition={status === "active" ? { duration: 1, repeat: Infinity } : {}}
                            >
                                {status === "done" ? (
                                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400 text-lg">{"\u2713"}</motion.span>
                                ) : (
                                    <span>{step.icon}</span>
                                )}
                            </motion.div>

                            <p className={`text-xs font-semibold mb-1 ${status === "active" ? "text-blue-400" : status === "done" ? "text-emerald-400" : "text-slate-500"}`}>
                                {step.label}
                            </p>

                            {/* Detail text appears when active */}
                            <AnimatePresence>
                                {(status === "active" || status === "done") && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0 }}
                                        className="text-[10px] text-slate-400 max-w-[120px] leading-relaxed"
                                    >
                                        {step.detail}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Completion celebration */}
            <AnimatePresence>
                {complete && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12 flex flex-col items-center gap-3"
                    >
                        <div className="flex gap-2">
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/20">GPS tracking active</span>
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg border border-blue-500/20">Synced to HQ</span>
                            <span className="text-[10px] bg-violet-500/10 text-violet-400 px-3 py-1 rounded-lg border border-violet-500/20">Invoice queued</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
