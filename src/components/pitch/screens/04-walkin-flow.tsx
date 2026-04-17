"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

type Phase = "profile-open" | "profile-loaded" | "new-booking" | "vehicle-select" | "vehicle-selected" | "credit-check" | "credit-approved" | "contract" | "contract-signed" | "payment" | "payment-done" | "keys" | "complete";

const PHASE_TIMINGS: { phase: Phase; delay: number }[] = [
    { phase: "profile-open", delay: 500 },
    { phase: "profile-loaded", delay: 1500 },
    { phase: "new-booking", delay: 3500 },
    { phase: "vehicle-select", delay: 4500 },
    { phase: "vehicle-selected", delay: 5500 },
    { phase: "credit-check", delay: 6200 },
    { phase: "credit-approved", delay: 7200 },
    { phase: "contract", delay: 8000 },
    { phase: "contract-signed", delay: 9500 },
    { phase: "payment", delay: 10200 },
    { phase: "payment-done", delay: 11200 },
    { phase: "keys", delay: 12000 },
    { phase: "complete", delay: 13000 },
];

const VEHICLES = [
    { model: "Tucson HSE", plate: "ABC-1234", category: "SUV", selected: true },
    { model: "Sonata GL", plate: "JKL-3456", category: "Sedan", selected: false },
    { model: "Creta", plate: "MNO-7890", category: "Compact SUV", selected: false },
];

function StepDot({ label, status, index }: { label: string; status: "pending" | "active" | "done"; index: number }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                status === "done" ? "bg-emerald-500 text-white" :
                status === "active" ? "bg-blue-600 text-white ring-4 ring-blue-600/20" :
                "bg-slate-800 text-slate-500 border border-slate-700"
            }`}>
                {status === "done" ? "✓" : index + 1}
            </div>
            <span className={`text-[10px] font-medium hidden md:inline ${
                status === "done" ? "text-emerald-400" : status === "active" ? "text-blue-400" : "text-slate-600"
            }`}>{label}</span>
        </div>
    );
}

export function WalkinFlowScreen() {
    const [currentPhase, setCurrentPhase] = useState<Phase>("profile-open");
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        PHASE_TIMINGS.forEach(({ phase, delay }) => {
            timers.push(setTimeout(() => setCurrentPhase(phase), delay));
        });

        const interval = setInterval(() => {
            setElapsed(prev => prev < 90 ? prev + 1 : prev);
        }, 1000);

        // Loop
        const totalDuration = 16000;
        const loopInterval = setInterval(() => {
            setCurrentPhase("profile-open");
            setElapsed(0);
            PHASE_TIMINGS.forEach(({ phase, delay }) => {
                setTimeout(() => setCurrentPhase(phase), delay);
            });
        }, totalDuration);

        return () => {
            timers.forEach(clearTimeout);
            clearInterval(interval);
            clearInterval(loopInterval);
        };
    }, []);

    const phaseIndex = PHASE_TIMINGS.findIndex(p => p.phase === currentPhase);
    const isBookingPhase = phaseIndex >= 3;

    const steps = [
        { label: "ID Verified", threshold: 0 },
        { label: "Vehicle", threshold: 3 },
        { label: "Credit", threshold: 5 },
        { label: "Contract", threshold: 7 },
        { label: "Payment", threshold: 9 },
        { label: "Keys", threshold: 11 },
    ];

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-white text-center tracking-tight mb-2">
                {isBookingPhase ? "90-Second Checkout" : "Customer Profile"}
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm text-slate-400 text-center mb-8">
                {isBookingPhase ? "Watch every step complete in real time" : "Ahmad Khalil selected → profile loads instantly"}
            </motion.p>

            <div className="w-full max-w-3xl">
                <AnimatePresence mode="wait">
                    {!isBookingPhase ? (
                        <motion.div key="profile" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-sm">AK</div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Ahmad Khalil</p>
                                        <p className="text-xs text-slate-400">Fleet Corp • Gold tier • 12 rentals</p>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {currentPhase === "profile-loaded" && (
                                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="px-3 py-1.5 bg-emerald-600 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5">
                                            + New Booking <kbd className="px-1 py-0.5 text-[9px] bg-emerald-700 rounded">N</kbd>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <motion.div initial={{ opacity: 0 }} animate={currentPhase !== "profile-open" ? { opacity: 1 } : {}} transition={{ duration: 0.4 }} className="p-6 grid grid-cols-3 gap-4">
                                <div className="bg-slate-800/50 rounded-xl p-3">
                                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">Corporate Account</p>
                                    <p className="text-sm font-bold text-white mt-1">Fleet Corp</p>
                                    <p className="text-xs text-emerald-400 mt-0.5">Credit: $12K / $50K</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-3">
                                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">Active Bookings</p>
                                    <p className="text-sm font-bold text-white mt-1">3</p>
                                    <p className="text-xs text-slate-400 mt-0.5">2 Sedan, 1 SUV</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-3">
                                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">License</p>
                                    <p className="text-sm font-bold text-white mt-1">Valid</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Exp: Mar 2027</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div key="booking" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden">
                            <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs font-bold">AK</div>
                                    <div>
                                        <p className="text-sm font-bold text-white">New Booking — Ahmad Khalil</p>
                                        <p className="text-xs text-slate-400">Fleet Corp • Corporate credit</p>
                                    </div>
                                </div>
                                <motion.div className="flex items-center gap-2" animate={currentPhase === "complete" ? { scale: [1, 1.1, 1] } : {}}>
                                    <span className={`text-lg font-mono font-bold tabular-nums ${currentPhase === "complete" ? "text-emerald-400" : "text-blue-400"}`}>{elapsed}s</span>
                                    <span className="text-[10px] text-slate-500">/ 90s</span>
                                </motion.div>
                            </div>

                            <div className="px-6 py-3 border-b border-slate-800 flex items-center gap-3 overflow-x-auto">
                                {steps.map((step, i) => (
                                    <StepDot key={i} label={step.label} index={i} status={phaseIndex > step.threshold + 1 ? "done" : phaseIndex >= step.threshold ? "active" : "pending"} />
                                ))}
                            </div>

                            <div className="p-6 min-h-[220px]">
                                <AnimatePresence mode="wait">
                                    {(currentPhase === "vehicle-select" || currentPhase === "vehicle-selected") && (
                                        <motion.div key="v" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Available at Airport</p>
                                            <div className="space-y-2">
                                                {VEHICLES.map((v, i) => (
                                                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className={`flex items-center justify-between px-4 py-3 rounded-xl ${v.selected && currentPhase === "vehicle-selected" ? "bg-blue-600/20 border border-blue-500/30" : "bg-slate-800/50"}`}>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-lg">🚗</span>
                                                            <div><p className="text-sm font-medium text-white">{v.model}</p><p className="text-xs text-slate-400">{v.plate} • {v.category}</p></div>
                                                        </div>
                                                        {v.selected && currentPhase === "vehicle-selected" && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded font-medium">Selected ✓</motion.span>}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                    {(currentPhase === "credit-check" || currentPhase === "credit-approved") && (
                                        <motion.div key="c" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-8">
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Corporate Credit — Fleet Corp</p>
                                            {currentPhase === "credit-check" ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" /> : (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="flex flex-col items-center gap-2">
                                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl">✓</div>
                                                    <p className="text-sm font-medium text-emerald-400">Approved — $320 / $12K remaining</p>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                    {(currentPhase === "contract" || currentPhase === "contract-signed") && (
                                        <motion.div key="ct" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-4">
                                            <div className="w-full max-w-sm bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Digital Contract</p>
                                                <div className="space-y-2 text-xs text-slate-400">
                                                    <div className="flex justify-between"><span>Vehicle:</span><span className="text-white">Tucson HSE (ABC-1234)</span></div>
                                                    <div className="flex justify-between"><span>Duration:</span><span className="text-white">3 days</span></div>
                                                    <div className="flex justify-between"><span>Rate:</span><span className="text-white">$106.67/day (corporate)</span></div>
                                                    <div className="flex justify-between border-t border-slate-700 pt-2"><span className="text-white font-medium">Total:</span><span className="text-white font-bold">$400.00</span></div>
                                                </div>
                                                {currentPhase === "contract-signed" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-center text-xs text-emerald-400 font-medium">✓ Signed digitally by Ahmad Khalil</motion.p>}
                                            </div>
                                        </motion.div>
                                    )}
                                    {(currentPhase === "payment" || currentPhase === "payment-done") && (
                                        <motion.div key="p" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-8">
                                            {currentPhase === "payment" ? <><p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Processing Payment</p><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" /></> : (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="flex flex-col items-center gap-2">
                                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl">✓</div>
                                                    <p className="text-sm font-medium text-emerald-400">$400.00 → Fleet Corp account</p>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                    {(currentPhase === "keys" || currentPhase === "complete") && (
                                        <motion.div key="k" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-6">
                                            {currentPhase === "complete" ? (
                                                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 150 }} className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-3xl">🔑</div>
                                                    <p className="text-lg font-bold text-emerald-400">Booking Complete</p>
                                                    <p className="text-sm text-slate-400">Tucson HSE • ABC-1234 • Bay 7</p>
                                                    <div className="flex gap-2 mt-2">
                                                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg">GPS active</span>
                                                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-lg">Synced to HQ</span>
                                                        <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-1 rounded-lg">Invoice queued</span>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Assigning Keys</p>
                                                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: 3 }} className="text-3xl">🔑</motion.div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
