"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const LINE_ITEMS = [
    { label: "Base rental (3 days × Tucson HSE)", amount: "$320.00", type: "base" },
    { label: "Young driver surcharge (3 days × $15)", amount: "$45.00", type: "surcharge" },
    { label: "Senior driver surcharge (3 days × $10)", amount: "$30.00", type: "surcharge" },
    { label: "Extra mileage — Day 2 (60km × $0.50)", amount: "$30.00", type: "overage" },
    { label: "Comprehensive insurance", amount: "$80.00", type: "base" },
    { label: "Speed camera ticket — Airport Rd", amount: "$75.00", type: "ticket" },
    { label: "Parking ticket — Mall Zone B", amount: "$25.00", type: "ticket" },
    { label: "Late return (2 hours)", amount: "$40.00", type: "penalty" },
];

const TOTAL = "$645.00";

export function BookingPaymentsScreen() {
    const [phase, setPhase] = useState(0);
    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 400),
            setTimeout(() => setPhase(2), 800),
            setTimeout(() => setPhase(3), 1200),
            setTimeout(() => setPhase(4), 2500),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-4">Booking Detail</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-3">Complete Payment Breakdown</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-400 text-center mb-10 max-w-lg">Every line item calculated automatically. Nothing manual. The customer sees exactly what they pay for.</motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0 }}
                className="w-full max-w-xl rounded-2xl border border-slate-700 overflow-hidden bg-slate-900"
                style={{ boxShadow: "0 20px 60px -15px rgba(0,0,0,0.4)" }}
            >
                <motion.div
                    className="px-6 py-4 border-b border-slate-800 flex justify-between items-center"
                    initial={{ opacity: 0 }}
                    animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        <p className="text-sm font-bold text-white">Booking BK-20260417-042</p>
                        <p className="text-xs text-slate-400">Ahmad Khalil • Tucson HSE → Sonata GL</p>
                    </div>
                    <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">Settlement Due</span>
                </motion.div>

                <div className="divide-y divide-slate-800">
                    {LINE_ITEMS.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                            transition={{ delay: 0.06 * i, duration: 0.25 }}
                            className="flex justify-between items-center px-6 py-3"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${item.type === "base" ? "bg-blue-400" : item.type === "surcharge" ? "bg-amber-400" : item.type === "overage" ? "bg-orange-400" : item.type === "ticket" ? "bg-red-400" : "bg-red-600"}`} />
                                <span className="text-sm text-slate-300">{item.label}</span>
                            </div>
                            <span className="text-sm font-medium text-white tabular-nums">{item.amount}</span>
                        </motion.div>
                    ))}
                </div>

                <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/50 flex justify-between items-center">
                    <span className="text-base font-bold text-white">Total</span>
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={phase >= 4 ? { opacity: 1, scale: [0.95, 1.05, 1] } : { opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="text-2xl font-bold text-white tabular-nums"
                    >{TOTAL}</motion.span>
                </div>

                <div className="px-6 py-3 border-t border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Payment method:</span>
                        <span className="text-xs font-medium text-slate-300">Corporate Credit — Fleet Corp</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Deposit:</span>
                        <span className="text-xs font-medium text-emerald-400">$200 refundable</span>
                    </div>
                </div>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-6 text-sm text-slate-400 text-center">Cash, card, corporate credit, or split payment. Deposits tracked. Refunds logged.</motion.p>
        </section>
    );
}
