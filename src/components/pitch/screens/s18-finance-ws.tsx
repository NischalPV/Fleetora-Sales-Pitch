"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const MODULES = [
    { name: "General Ledger", desc: "Chart of accounts, journal entries, trial balance", icon: "📒", status: "Live" },
    { name: "Accounts Receivable", desc: "Invoice generation, aging, collections, dunning", icon: "📥", status: "Live" },
    { name: "Accounts Payable", desc: "Vendor management, purchase orders, payment runs", icon: "📤", status: "Live" },
    { name: "Revenue Recognition", desc: "IFRS 15 compliant, daily accrual, deferred revenue", icon: "📈", status: "Live" },
    { name: "Cash Management", desc: "Bank reconciliation, deposit tracking, cash forecasting", icon: "🏦", status: "Live" },
    { name: "Tax Engine", desc: "VAT, withholding tax, multi-jurisdiction, auto-filing", icon: "🧾", status: "Live" },
    { name: "Credit Management", desc: "Real-time limits, risk scoring, approval workflows", icon: "💳", status: "Live" },
    { name: "Fixed Assets", desc: "Vehicle depreciation, fleet valuation, disposal tracking", icon: "🚗", status: "Live" },
    { name: "Financial Reporting", desc: "P&L, balance sheet, cash flow, custom dashboards", icon: "📊", status: "Live" },
    { name: "Multi-Currency", desc: "Real-time FX rates, revaluation, translation", icon: "🌍", status: "Q3 2026" },
    { name: "Intercompany", desc: "Cross-entity transactions, elimination entries", icon: "🔄", status: "Q3 2026" },
    { name: "Audit & Compliance", desc: "Full trail, SOX readiness, role-based access", icon: "🔒", status: "Live" },
];

export function S18FinanceWs() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 400),
            setTimeout(() => setPhase(2), 1200),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">The Money</motion.p>

            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white text-center tracking-tight mb-2">
                Enterprise Finance Suite
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm text-slate-400 text-center mb-10 max-w-lg">
                Every financial operation — from journal entry to board report — in one integrated platform. No bolt-ons. No spreadsheets.
            </motion.p>

            <div className="grid grid-cols-4 gap-3 max-w-5xl w-full">
                {MODULES.map((mod, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                        transition={{ type: "spring", stiffness: 60, damping: 18, delay: i * 0.06 }}
                        className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 hover:bg-slate-800/50 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xl">{mod.icon}</span>
                            <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded-full ${mod.status === "Live" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}`}>
                                {mod.status}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-white mb-1">{mod.name}</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{mod.desc}</p>
                    </motion.div>
                ))}
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={phase >= 2 ? { opacity: 1 } : {}}
                className="mt-8 text-sm text-slate-500 text-center"
            >
                Month-end close: <span className="text-white font-semibold">same day</span> — not 5 days. Zero manual reconciliation.
            </motion.p>
        </section>
    );
}
