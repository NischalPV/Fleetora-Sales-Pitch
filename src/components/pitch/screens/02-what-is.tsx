"use client";

import { motion } from "framer-motion";

const ROLES = [
    { icon: "🏢", role: "Branch Staff", desc: "POS dashboard, 90-second walk-in checkout, booking management, returns & swaps", color: "#059669" },
    { icon: "📊", role: "Franchise Head", desc: "HQ cockpit, fleet utilization, revenue analytics, Fleet Brain intelligence", color: "#2563eb" },
    { icon: "💰", role: "Finance Admin", desc: "Real-time P&L, automated invoicing, deposit tracking, credit monitoring", color: "#7c3aed" },
];

export function WhatIsScreen() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
                style={{ background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)", top: "-10%", right: "-10%" }}
                animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-sm font-semibold tracking-widest uppercase text-blue-600 mb-4"
            >
                The Platform
            </motion.p>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold text-slate-900 text-center tracking-tight mb-4 max-w-3xl"
            >
                One platform. Three roles. Every operation.
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-slate-500 text-center mb-16 max-w-2xl"
            >
                Fleetora replaces spreadsheets, WhatsApp groups, and legacy software with a single intelligent command surface. Every feature shown today is live.
            </motion.p>

            <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full">
                {ROLES.map((role, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.4 + i * 0.15 }}
                        className="flex-1 rounded-2xl border border-slate-200 p-6 bg-white hover:shadow-lg transition-shadow duration-300"
                        style={{ borderTop: `3px solid ${role.color}` }}
                    >
                        <div className="text-3xl mb-3">{role.icon}</div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{role.role}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{role.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
