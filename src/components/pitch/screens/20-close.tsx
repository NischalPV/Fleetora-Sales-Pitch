"use client";

import { motion } from "framer-motion";

const TIMELINE_STEPS = [
    { phase: "Pilot", duration: "2 weeks", desc: "One branch. Real data. Zero risk.", color: "bg-blue-600", textColor: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
    { phase: "Rollout", duration: "4 weeks", desc: "All branches. Full onboarding. Fleet Brain live.", color: "bg-emerald-600", textColor: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
];

export function CloseScreen() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-4">Get Started</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-3">Ready to see it live?</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-400 text-center mb-10 max-w-lg">2-week pilot. One branch. Real data, real results.</motion.p>

            <div className="w-full max-w-xl space-y-4">
                {/* Timeline */}
                <div className="grid grid-cols-2 gap-4">
                    {TIMELINE_STEPS.map((step, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15 }} className={`rounded-2xl border p-5 ${step.bg} ${step.border}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-6 h-6 rounded-full ${step.color} flex items-center justify-center`}>
                                    <span className="text-[10px] font-bold text-white">{i + 1}</span>
                                </div>
                                <span className={`text-sm font-bold ${step.textColor}`}>{step.phase}</span>
                            </div>
                            <p className={`text-2xl font-bold text-white mb-1`}>{step.duration}</p>
                            <p className="text-xs text-slate-400">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Training callout */}
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="8" r="3.5" stroke="white" strokeWidth="1.5" /><path d="M4 18c0-3.866 3.134-7 7-7h2c3.866 0 7 3.134 7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">2 hours of training</p>
                        <p className="text-xs text-slate-400">Your team is fully productive from day one. No IT needed. Web-based.</p>
                    </div>
                </motion.div>

                {/* Contact */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="bg-slate-900 border border-slate-700 rounded-2xl p-5 text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Contact us</p>
                    <a href="mailto:sales@monexatech.com" className="text-lg font-bold text-blue-400 hover:text-blue-300 transition-colors">sales@monexatech.com</a>
                </motion.div>

                {/* Closing question */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center pt-2">
                    <p className="text-xl font-bold text-white">Which branch would you like to start with?</p>
                </motion.div>
            </div>
        </section>
    );
}
