"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const STAGES = [
    { label: "Reserved", time: "Apr 15, 2:30 PM", by: "Online", status: "done", detail: "3-day rental, Tucson category" },
    { label: "Confirmed", time: "Apr 15, 2:31 PM", by: "System", status: "done", detail: "Vehicle assigned: ABC-1234" },
    { label: "Checked Out", time: "Apr 16, 8:47 AM", by: "Samir K.", status: "done", detail: "ID verified, contract signed, payment processed" },
    { label: "Active", time: "Now", by: "", status: "current", detail: "Day 1 of 3 — 142km driven, geo-fence OK" },
    { label: "Return Due", time: "Apr 18, 8:47 AM", by: "", status: "upcoming", detail: "Airport branch, mileage check, damage inspection" },
    { label: "Settlement", time: "", by: "", status: "upcoming", detail: "Final charges, deposit refund, rating" },
    { label: "Closed", time: "", by: "", status: "upcoming", detail: "Archived, searchable, auditable" },
];

export function BookingTimelineScreen() {
    const [phase, setPhase] = useState(0);
    useEffect(() => {
        const timers = STAGES.map((_, i) =>
            setTimeout(() => setPhase(i + 1), 400 * (i + 1))
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-4">Booking Detail</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-3">Full Booking Timeline</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-400 text-center mb-12 max-w-lg">Every stage automated. Every action logged. Every status transition tracked with who, when, and what.</motion.p>

            <div className="flex flex-col gap-0 max-w-2xl w-full">
                {STAGES.map((stage, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={phase >= i + 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ delay: 0, duration: 0.35 }}
                        className="flex gap-4"
                    >
                        {/* Timeline line + dot */}
                        <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${stage.status === "done" ? "bg-emerald-500 border-emerald-500" : stage.status === "current" ? "bg-blue-600 border-blue-600 ring-4 ring-blue-100" : "bg-white border-slate-600"}`} />
                            {stage.status === "current" && phase >= i + 1 && (
                                <motion.div
                                    className="absolute w-5 h-5 rounded-full border-2 border-blue-400"
                                    animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    style={{ marginTop: "-1px" }}
                                />
                            )}
                            {i < STAGES.length - 1 && <div className={`w-0.5 flex-1 min-h-[40px] ${stage.status === "done" ? "bg-emerald-500/30" : "bg-slate-700"}`} />}
                        </div>
                        {/* Content */}
                        <div className={`pb-6 ${stage.status === "upcoming" ? "opacity-50" : ""}`}>
                            <div className="flex items-baseline gap-2">
                                <p className={`text-sm font-semibold ${stage.status === "current" ? "text-blue-400" : "text-white"}`}>{stage.label}</p>
                                {stage.time && <span className="text-xs text-slate-400">{stage.time}</span>}
                                {stage.by && <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{stage.by}</span>}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{stage.detail}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
