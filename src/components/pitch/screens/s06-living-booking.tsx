"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const TABS = ["GPS Tracking", "Drivers", "Mileage & Charges", "Settlement"];

const TIMELINE = [
    { label: "Reserved", time: "Apr 15, 2:30 PM", done: true },
    { label: "Checked Out", time: "Apr 16, 8:49 AM", done: true },
    { label: "Active", time: "Now — Day 1 of 3", done: false, current: true },
    { label: "Return Due", time: "Apr 18, 8:49 AM", done: false },
    { label: "Settlement", time: "", done: false },
];

export function S06LivingBooking() {
    const [phase, setPhase] = useState(0);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 500),   // Expand card
            setTimeout(() => setPhase(2), 1500),   // Sidebar loads
            setTimeout(() => setPhase(3), 2500),   // First tab content
            setTimeout(() => setPhase(4), 6000),   // Cycle to tab 2
            setTimeout(() => setPhase(5), 9000),   // Cycle to tab 3
            setTimeout(() => setPhase(6), 12000),  // Cycle to tab 4
        ];

        // Tab cycling
        const tabTimers = [
            setTimeout(() => setActiveTab(1), 6000),
            setTimeout(() => setActiveTab(2), 9000),
            setTimeout(() => setActiveTab(3), 12000),
        ];

        return () => { timers.forEach(clearTimeout); tabTimers.forEach(clearTimeout); };
    }, []);

    return (
        <section className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-950">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-blue-500/3 blur-3xl rounded-full pointer-events-none" />

            {/* Label */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="absolute top-6 left-10 z-20">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400">The Counter</p>
                <p className="text-xs text-slate-500 mt-0.5">The Living Booking</p>
            </motion.div>

            {/* Expanding booking card */}
            <motion.div
                initial={{ width: 500, height: 120, borderRadius: 20 }}
                animate={phase >= 1 ? { width: "92%", height: "80%", borderRadius: 16 } : {}}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                className="border border-slate-700 bg-slate-900 overflow-hidden flex flex-col"
                style={{ maxWidth: 1200, boxShadow: "0 40px 100px -20px rgba(0,0,0,0.5)" }}
            >
                {/* Mini header — always visible */}
                <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-xs">AK</div>
                        <div>
                            <p className="text-sm font-bold text-white">BK-20260417-042 — Ahmad Khalil</p>
                            <p className="text-[10px] text-slate-500">Tucson HSE • ABC-1234 • 3 days • Fleet Corp</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <motion.div className="w-2 h-2 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        <span className="text-[10px] text-emerald-400">Active — Day 1</span>
                    </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                    {phase >= 2 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-1 overflow-hidden"
                        >
                            {/* Left sidebar — timeline + info */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="w-56 border-r border-slate-800 p-4 shrink-0 flex flex-col"
                            >
                                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mb-3">Booking Timeline</p>
                                <div className="space-y-0">
                                    {TIMELINE.map((step, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + i * 0.12 }}
                                            className="flex gap-2.5"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${step.done ? "bg-emerald-500" : step.current ? "bg-blue-500 ring-2 ring-blue-500/30" : "bg-slate-700 border border-slate-600"}`} />
                                                {i < TIMELINE.length - 1 && <div className={`w-px flex-1 min-h-[24px] ${step.done ? "bg-emerald-500/30" : "bg-slate-800"}`} />}
                                            </div>
                                            <div className="pb-3">
                                                <p className={`text-[11px] font-medium ${step.current ? "text-blue-400" : step.done ? "text-white" : "text-slate-500"}`}>{step.label}</p>
                                                {step.time && <p className="text-[9px] text-slate-500">{step.time}</p>}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Quick stats */}
                                <div className="mt-auto pt-4 border-t border-slate-800 space-y-2">
                                    <div className="flex justify-between"><span className="text-[9px] text-slate-500">Total</span><span className="text-xs font-bold text-white">$400.00</span></div>
                                    <div className="flex justify-between"><span className="text-[9px] text-slate-500">Payment</span><span className="text-[10px] text-slate-400">Corporate</span></div>
                                    <div className="flex justify-between"><span className="text-[9px] text-slate-500">Insurance</span><span className="text-[10px] text-emerald-400">Comprehensive</span></div>
                                </div>
                            </motion.div>

                            {/* Right main area — tabbed content */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Tab bar */}
                                <div className="flex border-b border-slate-800 shrink-0">
                                    {TABS.map((tab, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveTab(i)}
                                            className={`px-4 py-2.5 text-[11px] font-medium transition-colors ${activeTab === i ? "text-blue-400 border-b-2 border-blue-500" : "text-slate-500 hover:text-slate-300"}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab content */}
                                <div className="flex-1 p-5 overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        {activeTab === 0 && (
                                            <motion.div key="gps" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex gap-4">
                                                {/* Map */}
                                                <div className="flex-1 rounded-xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a2332 0%, #1e293b 50%, #1a2332 100%)" }}>
                                                    {/* Street grid */}
                                                    <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
                                                    {/* Roads */}
                                                    <svg className="absolute inset-0 w-full h-full">
                                                        <path d="M0 45% Q20% 42% 40% 48% Q60% 54% 80% 46% Q90% 42% 100% 44%" stroke="#334155" fill="none" strokeWidth="6" strokeLinecap="round" />
                                                        <path d="M0 45% Q20% 42% 40% 48% Q60% 54% 80% 46% Q90% 42% 100% 44%" stroke="#475569" fill="none" strokeWidth="1" strokeDasharray="8 12" />
                                                        <path d="M30% 0 Q35% 25% 28% 50% Q22% 75% 30% 100%" stroke="#334155" fill="none" strokeWidth="5" strokeLinecap="round" />
                                                        <path d="M70% 0 Q65% 30% 72% 55% Q78% 80% 70% 100%" stroke="#334155" fill="none" strokeWidth="4" strokeLinecap="round" />
                                                        <path d="M10% 70% Q30% 65% 50% 72% Q70% 78% 90% 70%" stroke="#334155" fill="none" strokeWidth="3" />
                                                    </svg>
                                                    {/* Terrain blocks */}
                                                    <div className="absolute w-16 h-12 bg-slate-800/40 rounded" style={{ left: "10%", top: "15%" }} />
                                                    <div className="absolute w-20 h-8 bg-slate-800/40 rounded" style={{ left: "50%", top: "20%" }} />
                                                    <div className="absolute w-14 h-14 bg-slate-800/40 rounded" style={{ left: "78%", top: "60%" }} />
                                                    <div className="absolute w-24 h-10 bg-emerald-900/20 rounded" style={{ left: "5%", top: "55%" }} />
                                                    {/* Geo-fence */}
                                                    <div className="absolute border border-dashed border-blue-400/20 rounded-lg" style={{ left: "8%", top: "10%", width: "55%", height: "65%" }}>
                                                        <span className="absolute -top-4 left-2 text-[8px] text-blue-400/50 font-medium">Airport Zone</span>
                                                    </div>
                                                    {/* Other vehicle pins */}
                                                    {[
                                                        { x: "18%", y: "32%", color: "#22c55e" },
                                                        { x: "42%", y: "58%", color: "#22c55e" },
                                                        { x: "65%", y: "35%", color: "#f59e0b" },
                                                        { x: "82%", y: "50%", color: "#3b82f6" },
                                                        { x: "25%", y: "70%", color: "#3b82f6" },
                                                    ].map((pin, i) => (
                                                        <div key={i} className="absolute w-2.5 h-2.5 rounded-full" style={{ left: pin.x, top: pin.y, backgroundColor: pin.color, boxShadow: `0 0 6px ${pin.color}40` }} />
                                                    ))}
                                                    {/* Tracked vehicle pin — moving */}
                                                    <motion.div className="absolute" style={{ left: "48%", top: "38%" }} animate={{ x: [0, 12, -5, 8, 0], y: [0, -8, 5, -3, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                                                        <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg shadow-blue-500/40 flex items-center justify-center">
                                                            <div className="w-2 h-2 rounded-full bg-white" />
                                                        </div>
                                                        <motion.div className="absolute w-10 h-10 rounded-full border border-blue-500/30 -top-2 -left-2" animate={{ scale: [1, 2], opacity: [0.4, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                                                    </motion.div>
                                                    {/* Map event markers — vehicle swap & traffic tickets only */}
                                                    {/* Vehicle swap location */}
                                                    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2, type: "spring", stiffness: 150 }} className="absolute" style={{ left: "32%", top: "52%" }}>
                                                        <div className="relative -translate-x-1/2 -translate-y-1/2">
                                                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] bg-amber-500/20 border border-amber-500/40">🔄</div>
                                                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 backdrop-blur-sm px-2 py-1 rounded-lg border border-amber-500/20">
                                                                <p className="text-[8px] text-amber-400 font-medium">Vehicle Swap — 11:30 AM</p>
                                                                <p className="text-[7px] text-slate-500">Tucson HSE → Sonata GL (AC fault)</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                    {/* Traffic ticket — speed camera */}
                                                    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.8, type: "spring", stiffness: 150 }} className="absolute" style={{ left: "58%", top: "42%" }}>
                                                        <div className="relative -translate-x-1/2 -translate-y-1/2">
                                                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] bg-red-500/20 border border-red-500/40">📸</div>
                                                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 backdrop-blur-sm px-2 py-1 rounded-lg border border-red-500/20">
                                                                <p className="text-[8px] text-red-400 font-medium">Speed Camera — 1:45 PM</p>
                                                                <p className="text-[7px] text-slate-500">Airport Rd, km 12 • 92 km/h in 60 zone</p>
                                                                <p className="text-[7px] text-red-400">$75 fine • Driver: Fatima K. • Pending</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                    {/* Traffic ticket — parking */}
                                                    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 3.4, type: "spring", stiffness: 150 }} className="absolute" style={{ left: "45%", top: "60%" }}>
                                                        <div className="relative -translate-x-1/2 -translate-y-1/2">
                                                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] bg-red-500/20 border border-red-500/40">🅿️</div>
                                                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 backdrop-blur-sm px-2 py-1 rounded-lg border border-red-500/20">
                                                                <p className="text-[8px] text-red-400 font-medium">Parking Violation — 3:20 PM</p>
                                                                <p className="text-[7px] text-slate-500">Mall Zone B • $25 fine • Paid</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                    {/* Trip path line */}
                                                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                                        <motion.path d="M20% 65% Q30% 55% 40% 48% Q45% 42% 50% 40%" stroke="#3b82f6" fill="none" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} />
                                                    </svg>
                                                    {/* Legend */}
                                                    <div className="absolute bottom-2 left-2 flex gap-3 bg-slate-900/80 backdrop-blur-sm rounded-lg px-2 py-1">
                                                        {[{ c: "bg-emerald-500", l: "Available" }, { c: "bg-blue-500", l: "Active" }, { c: "bg-amber-500", l: "Returning" }].map((lg, i) => (
                                                            <div key={i} className="flex items-center gap-1"><div className={`w-1.5 h-1.5 rounded-full ${lg.c}`} /><span className="text-[7px] text-slate-400">{lg.l}</span></div>
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* Telemetry + Events */}
                                                <div className="w-48 space-y-2 flex flex-col">
                                                    {[{ l: "Speed", v: "82 km/h" }, { l: "Heading", v: "NW" }, { l: "Fuel", v: "67%" }, { l: "Trip", v: "142 km" }].map((t, i) => (
                                                        <div key={i} className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                                                            <p className="text-[8px] text-slate-500 uppercase">{t.l}</p>
                                                            <p className="text-xs font-bold text-white">{t.v}</p>
                                                        </div>
                                                    ))}
                                                    {/* Live event feed */}
                                                    <div className="flex-1 border-t border-slate-700/50 pt-2 mt-1">
                                                        <p className="text-[8px] text-slate-500 uppercase mb-1.5">Trip Events</p>
                                                        {[
                                                            { icon: "🔄", text: "Swap: Tucson → Sonata", time: "11:30 AM", color: "text-amber-400" },
                                                            { icon: "📸", text: "Speed camera — $75", time: "1:45 PM", color: "text-red-400" },
                                                            { icon: "🅿️", text: "Parking fine — $25 paid", time: "3:20 PM", color: "text-red-400" },
                                                            { icon: "⚠️", text: "Geo-fence alert: zone exit", time: "4:05 PM", color: "text-amber-400" },
                                                        ].map((evt, i) => (
                                                            <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.5 }} className="flex items-start gap-1.5 mb-1.5">
                                                                <span className="text-[10px]">{evt.icon}</span>
                                                                <div>
                                                                    <p className={`text-[9px] ${evt.color}`}>{evt.text}</p>
                                                                    <p className="text-[8px] text-slate-600">{evt.time}</p>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeTab === 1 && (
                                            <motion.div key="drivers" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                                                {[
                                                    { name: "Ahmad Khalil", role: "Primary", age: 34, license: "Valid — Mar 2027", badges: ["Primary"], surcharge: "" },
                                                    { name: "Fatima Khalil", role: "Additional", age: 23, license: "Valid — Aug 2026", badges: ["Under-25"], surcharge: "+$15/day" },
                                                    { name: "Hassan Khalil", role: "Additional", age: 71, license: "Expiring Jan 2025", badges: ["Senior", "Expiring"], surcharge: "+$10/day" },
                                                ].map((d, i) => (
                                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className="flex items-center justify-between bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold">{d.name.split(" ").map(n => n[0]).join("")}</div>
                                                            <div>
                                                                <p className="text-sm font-medium text-white">{d.name}</p>
                                                                <p className="text-[10px] text-slate-500">Age {d.age} - {d.license}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {d.badges.map((b, j) => (
                                                                <span key={j} className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${b === "Primary" ? "bg-blue-500/20 text-blue-400" : b === "Expiring" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>{b}</span>
                                                            ))}
                                                            {d.surcharge && <span className="text-[10px] text-amber-400 font-medium">{d.surcharge}</span>}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                                <p className="text-[10px] text-slate-600 mt-2">Surcharges calculated automatically. License warnings at 90 days.</p>
                                            </motion.div>
                                        )}

                                        {activeTab === 2 && (
                                            <motion.div key="mileage" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                                <div>
                                                    <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Daily Mileage (250km allowance)</p>
                                                    {[{ day: "Day 1", km: 180, limit: 250 }, { day: "Day 2", km: 310, limit: 250 }, { day: "Day 3", km: 95, limit: 250 }].map((d, i) => (
                                                        <div key={i} className="mb-2">
                                                            <div className="flex justify-between text-xs mb-1">
                                                                <span className="text-slate-400">{d.day}</span>
                                                                <span className={d.km > d.limit ? "text-red-400 font-bold" : "text-slate-400"}>{d.km} / {d.limit} km</span>
                                                            </div>
                                                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                                                <motion.div className={`h-full rounded-full ${d.km > d.limit ? "bg-red-500" : "bg-blue-500"}`} initial={{ width: 0 }} animate={{ width: `${Math.min((d.km / d.limit) * 100, 100)}%` }} transition={{ duration: 0.6, delay: i * 0.2 }} />
                                                            </div>
                                                            {d.km > d.limit && <p className="text-[9px] text-red-400 mt-0.5">+{d.km - d.limit}km over — ${(d.km - d.limit) * 0.5} charge</p>}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/50">
                                                        <p className="text-[9px] text-slate-500 uppercase mb-1">Vehicle Swap</p>
                                                        <p className="text-xs text-white">Tucson to Sonata (AC issue)</p>
                                                        <p className="text-[9px] text-slate-500">Authorized by Rami S.</p>
                                                    </div>
                                                    <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/50">
                                                        <p className="text-[9px] text-slate-500 uppercase mb-1">Traffic Ticket</p>
                                                        <p className="text-xs text-white">Speed camera — $75</p>
                                                        <p className="text-[9px] text-amber-400">Pending — Fatima K.</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeTab === 3 && (
                                            <motion.div key="settlement" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-2">
                                                <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Payment Breakdown</p>
                                                {[
                                                    { item: "Base rental (3 days x $106.67)", amount: "$320.00", type: "base" },
                                                    { item: "Under-25 surcharge (3 x $15)", amount: "$45.00", type: "surcharge" },
                                                    { item: "Senior surcharge (3 x $10)", amount: "$30.00", type: "surcharge" },
                                                    { item: "Extra mileage — Day 2 (60km x $0.50)", amount: "$30.00", type: "overage" },
                                                    { item: "Comprehensive insurance", amount: "$80.00", type: "base" },
                                                    { item: "Speed camera ticket", amount: "$75.00", type: "ticket" },
                                                ].map((row, i) => (
                                                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }} className="flex justify-between items-center py-1.5 border-b border-slate-800/50">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${row.type === "base" ? "bg-blue-400" : row.type === "surcharge" ? "bg-amber-400" : row.type === "overage" ? "bg-orange-400" : "bg-red-400"}`} />
                                                            <span className="text-xs text-slate-300">{row.item}</span>
                                                        </div>
                                                        <span className="text-xs font-medium text-white tabular-nums">{row.amount}</span>
                                                    </motion.div>
                                                ))}
                                                <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-700">
                                                    <span className="text-sm font-bold text-white">Total</span>
                                                    <span className="text-xl font-bold text-white tabular-nums">$580.00</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 mt-1">Payment: Corporate credit — Fleet Corp - Deposit: $200 refundable</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}
