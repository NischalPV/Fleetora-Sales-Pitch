"use client";

import { motion } from "framer-motion";

const SHORTCUTS = [
    { key: "⌘K", label: "Command Bar" },
    { key: "N", label: "New Booking" },
    { key: "M", label: "Fleet Map" },
    { key: "T", label: "Transfers" },
    { key: "S", label: "Service" },
];

const RESULTS = [
    { type: "Customer", value: "Ahmad Khalil", detail: "Corp: Fleet Corp • 3 active bookings" },
    { type: "Vehicle", value: "Tucson HSE • ABC-1234", detail: "Airport branch • Available" },
    { type: "Booking", value: "BK-20260417-042", detail: "Sara M. • Accent • Due today 5:00 PM" },
];

export function CommandBarScreen() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm font-semibold tracking-widest uppercase text-blue-600 mb-4"
            >
                Keyboard-First
            </motion.p>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold text-slate-900 text-center tracking-tight mb-4"
            >
                Everything starts with ⌘K
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-slate-500 text-center mb-12 max-w-xl"
            >
                Type a customer, plate number, booking ID, or branch. No menus. No clicks. Every action is 2 keystrokes away.
            </motion.p>

            {/* Command Bar Mockup */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.4 }}
                className="w-full max-w-2xl"
            >
                <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
                    {/* Search input */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <span className="text-slate-400 text-base">Search customers, vehicles, bookings...</span>
                        <div className="ml-auto flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 rounded text-slate-400 border border-slate-200">⌘</kbd>
                            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 rounded text-slate-400 border border-slate-200">K</kbd>
                        </div>
                    </div>
                    {/* Results */}
                    <div className="divide-y divide-slate-50">
                        {RESULTS.map((result, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors"
                            >
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 w-16">{result.type}</span>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{result.value}</p>
                                    <p className="text-xs text-slate-400">{result.detail}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Shortcuts */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex gap-4 mt-8"
            >
                {SHORTCUTS.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 rounded border border-slate-200 text-slate-500">{s.key}</kbd>
                        <span className="text-xs text-slate-400">{s.label}</span>
                    </div>
                ))}
            </motion.div>
        </section>
    );
}
