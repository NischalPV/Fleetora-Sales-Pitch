"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function S08Tracking() {
    const [phase, setPhase] = useState(0);
    const [pinPos, setPinPos] = useState({ x: 45, y: 40 });

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 1200),
            setTimeout(() => setPhase(3), 2500),
            setTimeout(() => setPhase(4), 3500),
        ];

        // Move pin every 2 seconds
        const moveInterval = setInterval(() => {
            setPinPos(prev => ({
                x: prev.x + (Math.random() - 0.4) * 3,
                y: prev.y + (Math.random() - 0.5) * 2,
            }));
        }, 2000);

        return () => { timers.forEach(clearTimeout); clearInterval(moveInterval); };
    }, []);

    return (
        <section className="h-screen w-full relative overflow-hidden bg-slate-950">
            {/* Corner label */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute top-6 left-10 z-20">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400">The Operations Floor</p>
                <p className="text-xs text-slate-500 mt-0.5">Live GPS Tracking</p>
            </motion.div>

            {/* Full-screen map */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={phase >= 1 ? { opacity: 1 } : {}}
                className="absolute inset-0 bg-slate-900"
            >
                {/* Grid roads */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

                {/* Major roads */}
                <svg className="absolute inset-0 w-full h-full opacity-20">
                    <path d="M0 40% Q25% 38% 50% 42% Q75% 46% 100% 40%" stroke="#64748b" fill="none" strokeWidth="4" />
                    <path d="M35% 0 Q37% 30% 33% 60% Q30% 80% 35% 100%" stroke="#64748b" fill="none" strokeWidth="4" />
                    <path d="M70% 0 Q72% 25% 68% 50% Q65% 75% 70% 100%" stroke="#64748b" fill="none" strokeWidth="3" />
                </svg>

                {/* Other vehicle pins (static) */}
                {phase >= 2 && [
                    { x: 20, y: 30, color: "#22c55e" }, { x: 70, y: 25, color: "#3b82f6" },
                    { x: 55, y: 65, color: "#22c55e" }, { x: 80, y: 55, color: "#f59e0b" },
                    { x: 30, y: 70, color: "#3b82f6" }, { x: 15, y: 55, color: "#22c55e" },
                    { x: 85, y: 35, color: "#ef4444" },
                ].map((pin, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="absolute w-3 h-3 rounded-full"
                        style={{ left: `${pin.x}%`, top: `${pin.y}%`, backgroundColor: pin.color }}
                    />
                ))}

                {/* Tracked vehicle pin (moving) */}
                {phase >= 1 && (
                    <motion.div
                        className="absolute z-10"
                        animate={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
                        transition={{ type: "spring", stiffness: 30, damping: 20 }}
                    >
                        <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg shadow-blue-500/30 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                            <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <motion.div
                            className="absolute w-10 h-10 rounded-full border border-blue-500/30 -translate-x-1/2 -translate-y-1/2 top-0 left-0"
                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.div>
                )}

                {/* Geo-fence */}
                {phase >= 3 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute border-2 border-dashed border-blue-400/20 rounded-xl"
                        style={{ left: "10%", top: "15%", width: "50%", height: "55%" }}
                    >
                        <span className="absolute -top-5 left-3 text-[9px] text-blue-400/60 font-medium">Airport Zone</span>
                    </motion.div>
                )}
            </motion.div>

            {/* Floating telemetry panel — glass morphed */}
            <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={phase >= 4 ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", stiffness: 60, damping: 20 }}
                className="absolute right-8 top-1/2 -translate-y-1/2 w-72 z-20"
            >
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-5 shadow-2xl shadow-black/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <div>
                            <p className="text-sm font-bold text-white">Tucson HSE</p>
                            <p className="text-[10px] text-slate-400">ABC-1234 &bull; Ahmad Khalil</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {[
                            { label: "Speed", value: "82 km/h" },
                            { label: "Heading", value: "NW" },
                            { label: "Fuel", value: "67%" },
                            { label: "Trip", value: "142 km" },
                        ].map((t, i) => (
                            <div key={i} className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                                <p className="text-[8px] text-white/40 uppercase tracking-wider">{t.label}</p>
                                <p className="text-sm font-bold text-white mt-0.5">{t.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                        <motion.div className="w-2 h-2 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        <span className="text-[10px] text-emerald-400">Live tracking — updated 1s ago</span>
                    </div>
                </div>
            </motion.div>

            {/* Legend */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={phase >= 2 ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
                className="absolute bottom-8 left-10 flex gap-4 z-20"
            >
                {[
                    { color: "bg-emerald-500", label: "Available" },
                    { color: "bg-blue-500", label: "Active" },
                    { color: "bg-amber-500", label: "Returning" },
                    { color: "bg-red-500", label: "Overdue" },
                ].map((l, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${l.color}`} />
                        <span className="text-[10px] text-slate-500">{l.label}</span>
                    </div>
                ))}
            </motion.div>
        </section>
    );
}
