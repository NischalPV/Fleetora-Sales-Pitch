"use client";

import { motion } from "framer-motion";

const DRIVERS = [
    { name: "Ahmad Khalil", role: "Primary", age: 34, license: "JOR-2891-2027", expiry: "Mar 2027", badges: [{ label: "Primary", color: "bg-blue-50 text-blue-600" }], surcharge: null },
    { name: "Fatima Khalil", role: "Additional", age: 23, license: "JOR-4102-2026", expiry: "Aug 2026", badges: [{ label: "Under-25", color: "bg-amber-50 text-amber-600" }], surcharge: "+$15/day" },
    { name: "Hassan Khalil", role: "Additional", age: 71, license: "JOR-1055-2025", expiry: "Jan 2025", badges: [{ label: "Senior", color: "bg-purple-50 text-purple-600" }, { label: "Expiring", color: "bg-red-50 text-red-600" }], surcharge: "+$10/day" },
];

export function BookingDriversScreen() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-600 mb-4">Booking Detail</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-slate-900 text-center tracking-tight mb-3">Multi-Driver Management</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-500 text-center mb-12 max-w-xl">Family trips, corporate pools, multi-driver rentals. Each driver tracked with license, age, surcharges, and insurance tier — automatically.</motion.p>

            <div className="flex flex-col md:flex-row gap-5 max-w-4xl w-full">
                {DRIVERS.map((driver, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.3 + i * 0.15 }} className="flex-1 rounded-2xl border border-slate-200 p-5 bg-white hover:shadow-lg transition-shadow">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-400 mb-4">{driver.name.split(" ").map(n => n[0]).join("")}</div>
                        <h3 className="text-base font-bold text-slate-900">{driver.name}</h3>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                            {driver.badges.map((b, j) => (
                                <span key={j} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${b.color}`}>{b.label}</span>
                            ))}
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-xs"><span className="text-slate-400">Age</span><span className="text-slate-700 font-medium">{driver.age}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-slate-400">License</span><span className="text-slate-700 font-mono text-[11px]">{driver.license}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-slate-400">Expiry</span><span className={`font-medium ${driver.expiry.includes("2025") ? "text-red-600" : "text-slate-700"}`}>{driver.expiry}</span></div>
                            {driver.surcharge && <div className="flex justify-between text-xs"><span className="text-slate-400">Surcharge</span><span className="text-amber-600 font-semibold">{driver.surcharge}</span></div>}
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-8 text-sm text-slate-400 text-center max-w-md">Surcharges calculated automatically at checkout. License expiry warnings flagged 90 days in advance.</motion.p>
        </section>
    );
}
