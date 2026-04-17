"use client";

import { motion } from "framer-motion";

const DAILY_KM = [
    { day: "Day 1", km: 180, limit: 250 },
    { day: "Day 2", km: 310, limit: 250 },
    { day: "Day 3", km: 95, limit: 250 },
];

const SWAPS = [
    { date: "Apr 17", from: "Tucson HSE", to: "Sonata GL", reason: "AC malfunction", auth: "Manager — Rami S." },
];

const TICKETS = [
    { date: "Apr 16", type: "Speed camera", location: "Airport Rd, km 12", amount: "$75", driver: "Fatima K.", status: "Pending", statusColor: "bg-amber-50 text-amber-600" },
    { date: "Apr 17", type: "Parking", location: "Mall Zone B", amount: "$25", driver: "Ahmad K.", status: "Paid", statusColor: "bg-emerald-50 text-emerald-600" },
];

export function BookingMileageScreen() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-600 mb-4">Booking Detail</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-slate-900 text-center tracking-tight mb-3">Mileage, Swaps & Tickets</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-500 text-center mb-10 max-w-lg">Every edge case is a first-class feature. Not an afterthought.</motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full">
                {/* Mileage */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Daily Mileage</h3>
                    <div className="space-y-3">
                        {DAILY_KM.map((d, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-700 font-medium">{d.day}</span>
                                    <span className={d.km > d.limit ? "text-red-600 font-bold" : "text-slate-500"}>{d.km} / {d.limit} km</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div className={`h-full rounded-full ${d.km > d.limit ? "bg-red-500" : "bg-blue-500"}`} initial={{ width: 0 }} animate={{ width: `${Math.min((d.km / d.limit) * 100, 100)}%` }} transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }} />
                                </div>
                                {d.km > d.limit && <p className="text-[10px] text-red-500 mt-1">+{d.km - d.limit} km over — ${((d.km - d.limit) * 0.5).toFixed(0)} charge</p>}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Swaps */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Vehicle Swaps</h3>
                    {SWAPS.map((s, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">{s.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-700">{s.from}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                <span className="text-sm font-medium text-slate-900">{s.to}</span>
                            </div>
                            <p className="text-xs text-slate-500">Reason: {s.reason}</p>
                            <p className="text-[10px] text-slate-400">Authorized: {s.auth}</p>
                        </div>
                    ))}
                    <p className="text-[10px] text-slate-400 mt-4">Full swap history preserved. Linked to maintenance records.</p>
                </motion.div>

                {/* Tickets */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Traffic Tickets</h3>
                    <div className="space-y-3">
                        {TICKETS.map((t, i) => (
                            <div key={i} className="bg-slate-50 rounded-lg p-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-medium text-slate-900">{t.type}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{t.location}</p>
                                    </div>
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${t.statusColor}`}>{t.status}</span>
                                </div>
                                <div className="flex justify-between mt-2 text-xs">
                                    <span className="text-slate-400">Driver: {t.driver}</span>
                                    <span className="font-semibold text-slate-700">{t.amount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-3">Tickets reconciled to specific driver. Included in checkout settlement.</p>
                </motion.div>
            </div>
        </section>
    );
}
