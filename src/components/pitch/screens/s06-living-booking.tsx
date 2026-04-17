"use client";

import { motion } from "framer-motion";
import { useState, useEffect, lazy, Suspense } from "react";

const FleetMap = lazy(() => import("@/components/ui/fleet-map").then(m => ({ default: m.FleetMap })));

const MAP_PINS = [
    { lat: 31.975, lng: 35.930, color: "#3b82f6", size: 16, pulse: true, popup: "<b>Hyundai Tucson 2024</b><br/>JS-45-4821 • Ahmad Al-Rasheed<br/>Speed: 97 km/h • Fuel: 69%" },
    { lat: 31.960, lng: 35.915, color: "#22c55e", size: 8 },
    { lat: 31.950, lng: 35.950, color: "#22c55e", size: 8 },
    { lat: 31.968, lng: 35.942, color: "#ef4444", size: 12, popup: "<b>📸 Speed Camera</b><br/>Airport Highway, km 12<br/>27 Mar 2026 • 25,000 JOD" },
];

const TIMELINE = [
    { label: "Booking Created", time: "24 Mar 2026", done: true },
    { label: "Payment Authorized", time: "Deposit of 200,000 JOD held", done: true },
    { label: "Vehicle Picked Up", time: "Hyundai Tucson 2024 from Amman Downtown", done: true },
    { label: "Pre-rental Inspection", time: "Fuel: Full, Odometer: 8,200 km", done: true },
    { label: "Vehicle Return", time: "Expected at Amman Downtown", done: false, current: true },
    { label: "Settlement", time: "Final charges and deposit review", done: false },
];

export function S06LivingBooking() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 400),
            setTimeout(() => setPhase(2), 1200),
            setTimeout(() => setPhase(3), 2000),
            setTimeout(() => setPhase(4), 3000),
            setTimeout(() => setPhase(5), 4000),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full relative overflow-hidden bg-slate-950 p-4 md:p-6">
            {/* Header bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-4"
            >
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">BK-001</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Checked Out</span>
                    <span className="text-xs text-slate-500">Ahmad Al-Rasheed • Amman, since 25 Mar 2026</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-[10px] bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium">Check-in</button>
                    <button className="text-[10px] bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">Process Return</button>
                </div>
            </motion.div>

            {/* 3-column layout matching real app */}
            <div className="flex gap-4 h-[calc(100vh-90px)]">

                {/* LEFT COLUMN — Timeline + Vehicle + Mileage + Tickets */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
                    className="w-[260px] shrink-0 overflow-y-auto space-y-4"
                >
                    {/* Timeline */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-3">Booking Timeline</p>
                        {TIMELINE.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-2.5 mb-0"
                            >
                                <div className="flex flex-col items-center">
                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${step.done ? "bg-emerald-500" : step.current ? "bg-amber-500 ring-2 ring-amber-500/30" : "bg-slate-700"}`} />
                                    {i < TIMELINE.length - 1 && <div className={`w-px flex-1 min-h-[20px] ${step.done ? "bg-emerald-500/30" : "bg-slate-800"}`} />}
                                </div>
                                <div className="pb-3">
                                    <p className={`text-[10px] font-medium ${step.current ? "text-amber-400" : step.done ? "text-white" : "text-slate-500"}`}>{step.label}</p>
                                    <p className="text-[8px] text-slate-500">{step.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Vehicle */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 3 ? { opacity: 1 } : {}}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
                    >
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-2">Vehicle</p>
                        <p className="text-sm font-bold text-white">Hyundai Tucson 2024</p>
                        <p className="text-[10px] text-slate-400">SUV • Pearl White</p>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                            <div><p className="text-[8px] text-slate-500">Pickup</p><p className="text-[10px] text-white">Amman Downtown</p><p className="text-[8px] text-slate-500">25 Mar 2026</p></div>
                            <div><p className="text-[8px] text-slate-500">Return</p><p className="text-[10px] text-white">Amman Downtown</p><p className="text-[8px] text-slate-500">30 Mar 2026</p></div>
                        </div>
                        <div className="flex gap-3 mt-3 pt-3 border-t border-slate-800">
                            <div><p className="text-[8px] text-slate-500">Fuel</p><p className="text-[10px] text-white">Full</p></div>
                            <div><p className="text-[8px] text-slate-500">Odometer</p><p className="text-[10px] text-white">8,200 km</p></div>
                            <div><p className="text-[8px] text-slate-500">Plate</p><p className="text-[10px] text-white">JS-45-4821</p></div>
                        </div>
                    </motion.div>

                    {/* Mileage */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 4 ? { opacity: 1 } : {}}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
                    >
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-2">Mileage</p>
                        <p className="text-xs text-white font-medium">1,275 km used</p>
                        <p className="text-[9px] text-slate-500">500 km/day • 0.300 JOD/extra km</p>
                        <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <motion.div className="h-full rounded-full bg-amber-500" initial={{ width: 0 }} animate={phase >= 4 ? { width: "85%" } : {}} transition={{ duration: 1 }} />
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-[8px] text-slate-600">0</span>
                            <span className="text-[8px] text-slate-600">1,500 km allowed</span>
                        </div>
                        {/* Daily bars */}
                        <div className="flex gap-1 mt-3">
                            {[315, 180, 265, 275, 190].map((km, i) => (
                                <div key={i} className="flex-1 text-center">
                                    <motion.div
                                        className={`w-full rounded-sm ${km > 300 ? "bg-red-500" : "bg-emerald-500"}`}
                                        initial={{ height: 0 }}
                                        animate={phase >= 4 ? { height: `${(km / 350) * 40}px` } : {}}
                                        transition={{ delay: i * 0.1, duration: 0.4 }}
                                    />
                                    <p className="text-[7px] text-slate-500 mt-1">{km}</p>
                                    <p className="text-[7px] text-slate-600">D{i + 1}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Traffic Tickets */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 5 ? { opacity: 1 } : {}}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
                    >
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-2">Traffic Tickets</p>
                        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-medium text-white">Speed Camera</p>
                                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Pending</span>
                            </div>
                            <p className="text-[9px] text-slate-400 mt-1">Airport Highway, km 12 • 27 Mar 2026</p>
                            <p className="text-xs font-bold text-white mt-1">25,000 JOD</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* CENTER — Live Map + Telemetry */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    className="flex-1 flex flex-col gap-3"
                >
                    {/* Map label */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-white">Live Tracking</p>
                            <motion.div className="flex items-center gap-1">
                                <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                                <span className="text-[9px] text-emerald-400">Active</span>
                            </motion.div>
                        </div>
                        <span className="text-[9px] text-slate-500">Amman Airport area</span>
                    </div>

                    {/* Real map */}
                    <div className="flex-1 rounded-xl overflow-hidden border border-slate-800">
                        <Suspense fallback={<div className="w-full h-full bg-slate-800 animate-pulse" />}>
                            <FleetMap center={[31.958, 35.940]} zoom={14} pins={MAP_PINS} className="w-full h-full" darkTheme={true} />
                        </Suspense>
                    </div>

                    {/* Telemetry bar — horizontal like real app */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                        className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-3"
                    >
                        {[
                            { label: "Speed", value: "97", unit: "km/h" },
                            { label: "Heading", value: "NE", unit: "" },
                            { label: "Fuel", value: "69", unit: "%" },
                            { label: "Odometer", value: "8,665", unit: "km" },
                        ].map((t, i) => (
                            <div key={i} className="flex-1 text-center">
                                <p className="text-2xl font-bold text-white">{t.value}<span className="text-xs text-slate-500 ml-1">{t.unit}</span></p>
                                <p className="text-[8px] text-slate-500 uppercase tracking-wider">{t.label}</p>
                            </div>
                        ))}
                        <div className="flex-1 text-center">
                            <p className="text-[9px] text-slate-500">JS-45-4821</p>
                            <p className="text-[8px] text-slate-600">Hyundai Tucson 2024</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* RIGHT COLUMN — Customer + Drivers + Payment + Actions */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
                    className="w-[260px] shrink-0 overflow-y-auto space-y-4"
                >
                    {/* Customer */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-2">Customer</p>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-sm">AR</div>
                            <div>
                                <p className="text-sm font-bold text-white">Ahmad Al-Rasheed</p>
                                <p className="text-[10px] text-slate-400">Amman, since 2024</p>
                            </div>
                        </div>
                        <div className="space-y-1.5 text-[10px]">
                            <div className="flex items-center gap-2"><span className="text-slate-500">📞</span><span className="text-slate-300">+962 79 123 4567</span></div>
                            <div className="flex items-center gap-2"><span className="text-slate-500">✉️</span><span className="text-slate-300">ahmad@email.com</span></div>
                            <div className="flex items-center gap-2"><span className="text-slate-500">🪪</span><span className="text-slate-300">National ID: 98-●●●●●</span></div>
                            <div className="flex items-center gap-2"><span className="text-slate-500">🌍</span><span className="text-slate-300">Jordanian</span></div>
                        </div>
                    </div>

                    {/* Drivers */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 3 ? { opacity: 1 } : {}}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">Drivers</p>
                            <span className="text-[9px] text-slate-500">1 authorized</span>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400 text-[10px] font-bold">AR</div>
                            <div>
                                <p className="text-[10px] font-medium text-white">Ahmad Al-Rasheed <span className="text-[8px] px-1 py-0.5 rounded bg-blue-500/20 text-blue-400">Primary</span></p>
                                <p className="text-[8px] text-slate-500">License: JR-DL-084712 • Expires Mar 2027</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Payment */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 4 ? { opacity: 1 } : {}}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
                    >
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-3">Payment</p>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] text-slate-400">Visa •••• 4821</span>
                        </div>
                        <div className="space-y-1.5">
                            {[
                                { label: "5 days × 35,000 JOD/day", amount: "175,000 JOD" },
                                { label: "Full insurance", amount: "25,000 JOD" },
                                { label: "Tax", amount: "14,000 JOD" },
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between text-[10px]">
                                    <span className="text-slate-400">{row.label}</span>
                                    <span className="text-white">{row.amount}</span>
                                </div>
                            ))}
                            <div className="flex justify-between text-xs font-bold pt-2 border-t border-slate-800">
                                <span className="text-white">Total</span>
                                <span className="text-white">200,000 JOD</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-slate-400">Deposit held</span>
                                <span className="text-slate-400">200,000 JOD</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-emerald-400">Balance due</span>
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={phase >= 4 ? { opacity: 1 } : {}}
                                    className="text-emerald-400 font-bold"
                                >
                                    14,000 JOD
                                </motion.span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 5 ? { opacity: 1 } : {}}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-2"
                    >
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-2">Actions</p>
                        {["Process Return", "View Invoice", "Financial Record"].map((action, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
                                <span className="text-[10px] text-slate-300">{action}</span>
                                <span className="text-slate-500 text-xs">→</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
