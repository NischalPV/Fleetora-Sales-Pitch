"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 800),
            setTimeout(() => setPhase(3), 2000),
            setTimeout(() => setPhase(4), 2800),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-4">Live Operations</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-3">Live Fleet Map</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-400 text-center mb-8 max-w-lg">Every vehicle. Every branch. One map.</motion.p>

            {/* Phase 1: Map container appears */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 55 }}
                className="w-full max-w-3xl rounded-2xl border border-slate-700 overflow-hidden"
                style={{ boxShadow: "0 20px 60px -15px rgba(0,0,0,0.4)" }}
            >
                {/* Browser chrome */}
                <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700/50">
                    <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-300" /><div className="w-2.5 h-2.5 rounded-full bg-amber-300" /><div className="w-2.5 h-2.5 rounded-full bg-green-300" /></div>
                    <div className="flex-1 bg-slate-900 rounded-md px-3 py-1 ml-2 border border-slate-700/50"><span className="text-[10px] text-slate-400">app.fleetora.com/hq/fleet-map</span></div>
                </div>

                {/* Map area */}
                <div className="relative bg-slate-800 overflow-hidden" style={{ height: 280 }}>
                    {/* Grid lines */}
                    <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

                    {/* Phase 3: Geo-fence boundary draws */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="absolute border-2 border-dashed border-blue-400/50 rounded-2xl"
                        style={{ left: "10%", top: "10%", width: "45%", height: "55%" }}
                    >
                        <span className="absolute -top-2 left-2 text-[8px] text-blue-400 bg-slate-800 px-1">Airport Zone</span>
                    </motion.div>

                    {/* Phase 2: Vehicle pins scatter onto map one by one */}
                    {PINS.map((pin, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                            transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                            className={`absolute w-3 h-3 rounded-full ${pin.color} border-2 border-slate-900 shadow-sm cursor-pointer`}
                            style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%,-50%)" }}
                        />
                    ))}

                    {/* Phase 4: Expanded vehicle popup appears */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.4 }}
                        className="absolute bg-slate-900 border border-slate-700 rounded-xl shadow-lg p-2.5"
                        style={{ left: "28%", top: "18%", minWidth: 140 }}
                    >
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-[10px] font-bold text-white">Tucson HSE</span>
                        </div>
                        <p className="text-[9px] text-slate-400">ABC-1234 · Active rental</p>
                        <p className="text-[9px] text-slate-400">Ahmad K. · Due 5:00 PM</p>
                        <div className="mt-1.5 pt-1.5 border-t border-slate-700/50">
                            <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-medium">In Airport Zone</span>
                        </div>
                    </motion.div>
                </div>

                {/* Legend */}
                <div className="bg-slate-900 border-t border-slate-700/50 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {LEGEND.map((l, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.08 }} className="flex items-center gap-1.5">
                                <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                                <span className="text-xs text-slate-400">{l.label}</span>
                                <span className="text-xs font-bold text-white">{l.count}</span>
                            </motion.div>
                        ))}
                    </div>
                    <span className="text-[10px] text-slate-400">16 vehicles tracked · Updated 2s ago</span>
                </div>
            </motion.div>
        </section>
    );
}
