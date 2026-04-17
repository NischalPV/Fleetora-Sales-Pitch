"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, lazy, Suspense } from "react";

const FleetMap = lazy(() => import("@/components/ui/fleet-map").then(m => ({ default: m.FleetMap })));

const MAP_PINS = [
    { lat: 31.975, lng: 35.930, color: "#3b82f6", size: 14, pulse: true, popup: "<b>Tucson 2024</b><br/>JS-45-4821 • Ahmad Al-Rasheed" },
    { lat: 31.960, lng: 35.915, color: "#22c55e", size: 7 },
    { lat: 31.950, lng: 35.950, color: "#22c55e", size: 7 },
    { lat: 31.968, lng: 35.942, color: "#ef4444", size: 10, popup: "<b>📸 Speed Camera</b><br/>Airport Highway • 25,000 JOD" },
];

// The story unfolds in chapters — each one reveals a new dimension of the booking
const CHAPTERS = [
    { label: "The booking is alive", desc: "Every rental becomes a living entity — tracked, managed, auditable" },
    { label: "Real-time on the map", desc: "GPS position, speed, fuel — updating every 30 seconds" },
    { label: "Everything captured", desc: "Timeline, mileage, tickets, payments — nothing falls through the cracks" },
    { label: "One-click actions", desc: "Process return, generate invoice, view financial record — instant" },
];

export function S06LivingBooking() {
    const [phase, setPhase] = useState(0);
    const [chapter, setChapter] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 500),
            setTimeout(() => { setPhase(2); setChapter(1); }, 2500),
            setTimeout(() => { setPhase(3); setChapter(2); }, 5000),
            setTimeout(() => { setPhase(4); setChapter(3); }, 7500),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-10 relative overflow-hidden bg-slate-950">
            {/* Ambient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-500/3 blur-3xl rounded-full pointer-events-none" />

            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6 z-10"
            >
                <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 mb-2">The Counter</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">The Living Booking</h2>
                {/* Animated chapter subtitle */}
                <div className="h-6 mt-2">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={chapter}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="text-sm text-slate-400"
                        >
                            {CHAPTERS[chapter].desc}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Contained mockup — browser frame */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                className="w-full max-w-5xl rounded-2xl border border-slate-700 overflow-hidden bg-slate-900 z-10"
                style={{ boxShadow: "0 40px 100px -20px rgba(0,0,0,0.5)", height: "60vh" }}
            >
                {/* Thin top bar — no URL, just status */}
                <div className="bg-slate-800/50 px-4 py-1.5 flex items-center justify-between border-b border-slate-700/50 shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-white">BK-001</span>
                        <span className="text-[9px] text-slate-500">Ahmad Al-Rasheed • Hyundai Tucson 2024</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        <span className="text-[9px] text-emerald-400">Checked Out</span>
                    </div>
                </div>

                {/* App content — 3-column layout */}
                <div className="flex h-[calc(60vh-30px)] overflow-hidden">

                    {/* LEFT — Timeline + Vehicle */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3 }}
                        className="w-[200px] shrink-0 border-r border-slate-800 p-3 overflow-y-auto space-y-3"
                    >
                        <div>
                            <p className="text-[8px] text-slate-500 uppercase tracking-wider font-medium mb-2">Timeline</p>
                            {[
                                { l: "Booking Created", done: true },
                                { l: "Payment Authorized", done: true },
                                { l: "Vehicle Picked Up", done: true },
                                { l: "Pre-rental Inspection", done: true },
                                { l: "Vehicle Return", done: false, current: true },
                                { l: "Settlement", done: false },
                            ].map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={phase >= 1 ? { opacity: 1 } : {}}
                                    transition={{ delay: 0.5 + i * 0.15 }}
                                    className="flex gap-2 mb-0"
                                >
                                    <div className="flex flex-col items-center">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${s.done ? "bg-emerald-500" : s.current ? "bg-amber-500" : "bg-slate-700"}`} />
                                        {i < 5 && <div className={`w-px flex-1 min-h-[14px] ${s.done ? "bg-emerald-500/30" : "bg-slate-800"}`} />}
                                    </div>
                                    <p className={`text-[9px] pb-1 ${s.current ? "text-amber-400 font-medium" : s.done ? "text-slate-300" : "text-slate-600"}`}>{s.l}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div initial={{ opacity: 0 }} animate={phase >= 2 ? { opacity: 1 } : {}} className="border-t border-slate-800 pt-3">
                            <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">Vehicle</p>
                            <p className="text-[10px] font-bold text-white">Hyundai Tucson 2024</p>
                            <p className="text-[8px] text-slate-500">SUV • Pearl White • JS-45-4821</p>
                            <div className="flex gap-3 mt-2 text-[8px]">
                                <div><span className="text-slate-500">Fuel: </span><span className="text-white">Full</span></div>
                                <div><span className="text-slate-500">Odo: </span><span className="text-white">8,200 km</span></div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={phase >= 3 ? { opacity: 1 } : {}} className="border-t border-slate-800 pt-3">
                            <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">Mileage — 1,275 km</p>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div className="h-full rounded-full bg-amber-500" initial={{ width: 0 }} animate={phase >= 3 ? { width: "85%" } : {}} transition={{ duration: 0.8 }} />
                            </div>
                            <div className="flex gap-0.5 mt-2">
                                {[315, 180, 265, 275, 190].map((km, i) => (
                                    <motion.div key={i} className={`flex-1 rounded-sm ${km > 300 ? "bg-red-500" : "bg-emerald-500/70"}`} initial={{ height: 0 }} animate={phase >= 3 ? { height: `${(km / 350) * 24}px` } : {}} transition={{ delay: i * 0.08, duration: 0.3 }} />
                                ))}
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={phase >= 4 ? { opacity: 1 } : {}} className="border-t border-slate-800 pt-3">
                            <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">Traffic Tickets</p>
                            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2">
                                <p className="text-[9px] text-white font-medium">📸 Speed Camera</p>
                                <p className="text-[8px] text-slate-500">Airport Hwy • 25,000 JOD</p>
                                <span className="text-[7px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-400">Pending</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* CENTER — Map + Telemetry */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 2 ? { opacity: 1 } : {}}
                        transition={{ delay: 0.2 }}
                        className="flex-1 flex flex-col"
                    >
                        {/* Map */}
                        <div className="flex-1 relative">
                            <Suspense fallback={<div className="w-full h-full bg-slate-800 animate-pulse" />}>
                                <FleetMap center={[31.958, 35.940]} zoom={14} pins={MAP_PINS} className="w-full h-full" darkTheme={true} />
                            </Suspense>
                        </div>
                        {/* Telemetry bar */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={phase >= 2 ? { opacity: 1 } : {}}
                            className="flex items-center gap-3 border-t border-slate-800 px-4 py-2 bg-slate-900"
                        >
                            {[
                                { v: "97", u: "km/h", l: "Speed" },
                                { v: "NE", u: "", l: "Heading" },
                                { v: "69%", u: "", l: "Fuel" },
                                { v: "8,665", u: "km", l: "Odo" },
                            ].map((t, i) => (
                                <div key={i} className="flex-1 text-center">
                                    <p className="text-lg font-bold text-white leading-none">{t.v}<span className="text-[8px] text-slate-500 ml-0.5">{t.u}</span></p>
                                    <p className="text-[7px] text-slate-500 uppercase">{t.l}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* RIGHT — Customer + Payment + Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 }}
                        className="w-[200px] shrink-0 border-l border-slate-800 p-3 overflow-y-auto space-y-3"
                    >
                        <div>
                            <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-2">Customer</p>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-[10px] font-bold">AR</div>
                                <div>
                                    <p className="text-[10px] font-bold text-white">Ahmad Al-Rasheed</p>
                                    <p className="text-[8px] text-slate-500">Amman • Jordanian</p>
                                </div>
                            </div>
                            <div className="space-y-1 text-[8px] text-slate-400">
                                <p>📞 +962 79 123 4567</p>
                                <p>🪪 National ID: 98-●●●●●</p>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0 }} animate={phase >= 3 ? { opacity: 1 } : {}} className="border-t border-slate-800 pt-3">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[8px] text-slate-500 uppercase tracking-wider">Drivers</p>
                                <span className="text-[8px] text-slate-600">1</span>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-2 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400 text-[8px] font-bold">AR</div>
                                <div>
                                    <p className="text-[9px] text-white">Ahmad Al-Rasheed</p>
                                    <p className="text-[7px] text-slate-500">Primary • Valid</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={phase >= 3 ? { opacity: 1 } : {}} className="border-t border-slate-800 pt-3">
                            <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-2">Payment</p>
                            <div className="space-y-1">
                                {[
                                    { l: "5 days × 35,000", a: "175,000" },
                                    { l: "Insurance", a: "25,000" },
                                    { l: "Tax", a: "14,000" },
                                ].map((r, i) => (
                                    <div key={i} className="flex justify-between text-[8px]">
                                        <span className="text-slate-500">{r.l}</span>
                                        <span className="text-slate-300">{r.a}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-[9px] font-bold pt-1 border-t border-slate-800">
                                    <span className="text-white">Total</span>
                                    <span className="text-white">200,000 JOD</span>
                                </div>
                                <div className="flex justify-between text-[8px]">
                                    <span className="text-slate-500">Deposit</span>
                                    <span className="text-slate-400">200,000</span>
                                </div>
                                <div className="flex justify-between text-[8px]">
                                    <span className="text-emerald-400">Balance</span>
                                    <span className="text-emerald-400 font-bold">14,000 JOD</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={phase >= 4 ? { opacity: 1 } : {}} className="border-t border-slate-800 pt-3 space-y-1.5">
                            <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">Actions</p>
                            {["Process Return", "View Invoice", "Financial Record"].map((a, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={phase >= 4 ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.1 }} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-2.5 py-1.5 border border-slate-700/50 text-[9px] text-slate-300">
                                    {a}<span className="text-slate-600">→</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Chapter indicators at bottom */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex gap-6 mt-6 z-10"
            >
                {CHAPTERS.map((ch, i) => (
                    <motion.div
                        key={i}
                        className={`flex items-center gap-2 transition-colors duration-500 ${chapter === i ? "opacity-100" : "opacity-30"}`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${chapter === i ? "bg-blue-500" : "bg-slate-600"}`} />
                        <span className="text-[10px] text-slate-400">{ch.label}</span>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
