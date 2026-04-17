"use client";

import { motion } from "framer-motion";

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
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-600 mb-4">Booking Detail</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-slate-900 text-center tracking-tight mb-3">Full Booking Timeline</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-500 text-center mb-12 max-w-lg">Every stage automated. Every action logged. Every status transition tracked with who, when, and what.</motion.p>

            <div className="flex flex-col gap-0 max-w-2xl w-full">
                {STAGES.map((stage, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex gap-4">
                        {/* Timeline line + dot */}
                        <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${stage.status === "done" ? "bg-emerald-500 border-emerald-500" : stage.status === "current" ? "bg-blue-600 border-blue-600 ring-4 ring-blue-100" : "bg-white border-slate-300"}`} />
                            {i < STAGES.length - 1 && <div className={`w-0.5 flex-1 min-h-[40px] ${stage.status === "done" ? "bg-emerald-200" : "bg-slate-200"}`} />}
                        </div>
                        {/* Content */}
                        <div className={`pb-6 ${stage.status === "upcoming" ? "opacity-50" : ""}`}>
                            <div className="flex items-baseline gap-2">
                                <p className={`text-sm font-semibold ${stage.status === "current" ? "text-blue-600" : "text-slate-900"}`}>{stage.label}</p>
                                {stage.time && <span className="text-xs text-slate-400">{stage.time}</span>}
                                {stage.by && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{stage.by}</span>}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{stage.detail}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
