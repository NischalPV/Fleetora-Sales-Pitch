"use client";

import { motion } from "framer-motion";

const METRICS = [
    { label: "Available", value: "12", color: "text-emerald-600" },
    { label: "Checkouts Today", value: "8", color: "text-blue-600" },
    { label: "Returns Due", value: "5", color: "text-amber-600" },
    { label: "Overdue", value: "1", color: "text-red-600" },
];

const BOOKINGS = [
    { customer: "Ahmad K.", vehicle: "Tucson HSE", plate: "ABC-1234", due: "5:00 PM", status: "Active", statusColor: "bg-blue-50 text-blue-600" },
    { customer: "Sara M.", vehicle: "Accent GL", plate: "DEF-5678", due: "2:00 PM", status: "Overdue", statusColor: "bg-red-50 text-red-600" },
    { customer: "Fleet Corp", vehicle: "Elantra", plate: "GHI-9012", due: "Tomorrow", status: "Active", statusColor: "bg-blue-50 text-blue-600" },
    { customer: "Omar R.", vehicle: "Sonata", plate: "JKL-3456", due: "6:30 PM", status: "Checkout", statusColor: "bg-amber-50 text-amber-600" },
    { customer: "Layla H.", vehicle: "Creta", plate: "MNO-7890", due: "Apr 19", status: "Active", statusColor: "bg-blue-50 text-blue-600" },
    { customer: "Noor T.", vehicle: "Tucson", plate: "PQR-1234", due: "4:00 PM", status: "Returning", statusColor: "bg-emerald-50 text-emerald-600" },
];

export function PosDashboardScreen() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-semibold tracking-widest uppercase text-blue-600 mb-4"
            >
                Branch View
            </motion.p>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-slate-900 text-center tracking-tight mb-3"
            >
                POS Dashboard
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-base text-slate-500 text-center mb-10 max-w-lg"
            >
                What your branch agent sees every morning. Real-time bookings, status, and quick actions.
            </motion.p>

            {/* Browser frame */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.3 }}
                className="w-full max-w-4xl rounded-2xl border border-slate-200 overflow-hidden bg-white"
                style={{ boxShadow: "0 25px 80px -15px rgba(0,0,0,0.08)" }}
            >
                {/* Chrome */}
                <div className="bg-slate-50 px-4 py-2 flex items-center gap-2 border-b border-slate-100">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
                    </div>
                    <div className="flex-1 bg-white rounded-md px-3 py-1 ml-2 border border-slate-100">
                        <span className="text-[10px] text-slate-400">app.fleetora.com/branch/airport</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Metrics */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        {METRICS.map((m, i) => (
                            <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">{m.label}</p>
                                <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Walk-in button */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex items-center justify-between">
                        <div>
                            <span className="text-emerald-700 font-semibold text-sm">+ New Walk-in Booking</span>
                            <p className="text-[10px] text-emerald-600/60 mt-0.5">90-second checkout flow</p>
                        </div>
                        <kbd className="px-2 py-1 text-[10px] font-mono bg-emerald-100 rounded text-emerald-700 border border-emerald-200">N</kbd>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl border border-slate-100 overflow-hidden">
                        <div className="grid grid-cols-[1fr_120px_100px_80px_80px] px-4 py-2 bg-slate-50 text-[9px] text-slate-400 uppercase tracking-wider font-medium">
                            <span>Customer</span><span>Vehicle</span><span>Plate</span><span>Due</span><span className="text-right">Status</span>
                        </div>
                        {BOOKINGS.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.06 }}
                                className="grid grid-cols-[1fr_120px_100px_80px_80px] px-4 py-2.5 border-t border-slate-50 items-center"
                            >
                                <span className="text-sm font-medium text-slate-900">{b.customer}</span>
                                <span className="text-xs text-slate-500">{b.vehicle}</span>
                                <span className="text-xs font-mono text-slate-400">{b.plate}</span>
                                <span className="text-xs text-slate-500">{b.due}</span>
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full text-right ${b.statusColor}`}>{b.status}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
