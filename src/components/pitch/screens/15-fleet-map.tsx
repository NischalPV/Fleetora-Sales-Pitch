"use client";

import { motion } from "framer-motion";

const PINS = [
    { x: 18, y: 22, color: "bg-emerald-500", status: "available" },
    { x: 28, y: 38, color: "bg-blue-500", status: "active" },
    { x: 38, y: 18, color: "bg-emerald-500", status: "available" },
    { x: 48, y: 45, color: "bg-amber-400", status: "returning" },
    { x: 55, y: 28, color: "bg-blue-500", status: "active" },
    { x: 62, y: 55, color: "bg-red-500", status: "overdue" },
    { x: 22, y: 60, color: "bg-emerald-500", status: "available" },
    { x: 72, y: 35, color: "bg-blue-500", status: "active" },
    { x: 80, y: 50, color: "bg-emerald-500", status: "available" },
    { x: 35, y: 70, color: "bg-amber-400", status: "returning" },
    { x: 65, y: 72, color: "bg-emerald-500", status: "available" },
    { x: 42, y: 32, color: "bg-blue-500", status: "active" },
    { x: 75, y: 20, color: "bg-emerald-500", status: "available" },
    { x: 15, y: 45, color: "bg-blue-500", status: "active" },
    { x: 58, y: 42, color: "bg-amber-400", status: "returning" },
];

const LEGEND = [
    { color: "bg-emerald-500", label: "Available", count: 7 },
    { color: "bg-blue-500", label: "Active", count: 5 },
    { color: "bg-amber-400", label: "Returning", count: 3 },
    { color: "bg-red-500", label: "Overdue", count: 1 },
];

export function FleetMapScreen() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-600 mb-4">Live Operations</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-slate-900 text-center tracking-tight mb-3">Live Fleet Map</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-500 text-center mb-8 max-w-lg">Every vehicle. Every branch. One map.</motion.p>

            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 55 }} className="w-full max-w-3xl rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 20px 60px -15px rgba(0,0,0,0.08)" }}>
                {/* Browser chrome */}
                <div className="bg-slate-50 px-4 py-2 flex items-center gap-2 border-b border-slate-100">
                    <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-300" /><div className="w-2.5 h-2.5 rounded-full bg-amber-300" /><div className="w-2.5 h-2.5 rounded-full bg-green-300" /></div>
                    <div className="flex-1 bg-white rounded-md px-3 py-1 ml-2 border border-slate-100"><span className="text-[10px] text-slate-400">app.fleetora.com/hq/fleet-map</span></div>
                </div>

                {/* Map area */}
                <div className="relative bg-slate-100 overflow-hidden" style={{ height: 280 }}>
                    {/* Grid lines */}
                    <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

                    {/* Geo-fence boundary */}
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="absolute border-2 border-dashed border-blue-300 rounded-2xl" style={{ left: "10%", top: "10%", width: "45%", height: "55%" }}>
                        <span className="absolute -top-2 left-2 text-[8px] text-blue-500 bg-slate-100 px-1">Airport Zone</span>
                    </motion.div>

                    {/* Vehicle pins */}
                    {PINS.map((pin, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.04, type: "spring", stiffness: 200 }} className={`absolute w-3 h-3 rounded-full ${pin.color} border-2 border-white shadow-sm cursor-pointer`} style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%,-50%)" }} />
                    ))}

                    {/* Expanded pin */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="absolute bg-white border border-slate-200 rounded-xl shadow-lg p-2.5" style={{ left: "28%", top: "18%", minWidth: 140 }}>
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-[10px] font-bold text-slate-800">Tucson HSE</span>
                        </div>
                        <p className="text-[9px] text-slate-500">ABC-1234 · Active rental</p>
                        <p className="text-[9px] text-slate-500">Ahmad K. · Due 5:00 PM</p>
                        <div className="mt-1.5 pt-1.5 border-t border-slate-100">
                            <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">In Airport Zone</span>
                        </div>
                    </motion.div>
                </div>

                {/* Legend */}
                <div className="bg-white border-t border-slate-100 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {LEGEND.map((l, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.08 }} className="flex items-center gap-1.5">
                                <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                                <span className="text-xs text-slate-600">{l.label}</span>
                                <span className="text-xs font-bold text-slate-900">{l.count}</span>
                            </motion.div>
                        ))}
                    </div>
                    <span className="text-[10px] text-slate-400">16 vehicles tracked · Updated 2s ago</span>
                </div>
            </motion.div>
        </section>
    );
}
