"use client";

import { motion } from "framer-motion";

const COLUMNS = [
    {
        title: "Due Soon",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        cards: [
            { model: "Tucson HSE", plate: "ABC-1234", branch: "Airport", service: "Oil Change", days: 2 },
            { model: "Accent GL", plate: "DEF-5678", branch: "Downtown", service: "Tire Rotation", days: 3 },
            { model: "Creta Sport", plate: "GHI-9012", branch: "Mall", service: "Brake Inspection", days: 5 },
        ],
    },
    {
        title: "In Service",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        cards: [
            { model: "Santa Fe GL", plate: "JKL-3456", branch: "Beach", service: "Full Service", days: 0 },
            { model: "Sonata GL", plate: "MNO-7890", branch: "Airport", service: "AC Repair", days: 0 },
        ],
    },
    {
        title: "Ready",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        cards: [
            { model: "Elantra N", plate: "PQR-1234", branch: "Downtown", service: "Oil Change", days: 0 },
            { model: "Kona EV", plate: "STU-5678", branch: "Mall", service: "Tire Rotation", days: 0 },
        ],
    },
];

export function MaintenanceScreen() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-600 mb-4">Fleet Health</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-slate-900 text-center tracking-tight mb-3">Maintenance Kanban</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-500 text-center mb-8 max-w-lg">Service scheduling meets fleet intelligence.</motion.p>

            {/* Fleet Brain suggestion */}
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 mb-5 max-w-xl w-full">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0"><span className="text-[8px] text-white font-bold">AI</span></div>
                <p className="text-xs text-blue-700"><span className="font-semibold">Fleet Brain:</span> Schedule Tucson for Wednesday — predicted 34% utilization. Minimal impact.</p>
            </motion.div>

            <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
                {COLUMNS.map((col, ci) => (
                    <motion.div key={ci} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + ci * 0.12 }} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className={`text-xs font-bold ${col.color}`}>{col.title}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.bg} ${col.color} border ${col.border}`}>{col.cards.length}</span>
                        </div>
                        <div className="space-y-2.5">
                            {col.cards.map((card, ki) => (
                                <motion.div key={ki} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + ci * 0.1 + ki * 0.08 }} className="bg-white border border-slate-100 rounded-xl p-3">
                                    <p className="text-xs font-semibold text-slate-900">{card.model}</p>
                                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">{card.plate}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{card.service}</span>
                                        <span className="text-[9px] text-slate-400">{card.branch}</span>
                                    </div>
                                    {card.days > 0 && (
                                        <div className={`mt-2 text-[9px] font-semibold ${card.days <= 3 ? "text-red-500" : "text-amber-500"}`}>
                                            Due in {card.days}d
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
