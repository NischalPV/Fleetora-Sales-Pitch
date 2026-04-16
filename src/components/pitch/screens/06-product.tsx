"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "../shared/use-in-view";
import React from "react";

const ROLES = [
    {
        role: "Franchise Head",
        intro: "The HQ Cockpit — your entire operation on one screen.",
        color: "#2563eb",
        features: ["Real-time utilization", "Revenue tracking", "Branch health scores", "Fleet Brain alerts", "Demand forecasting"],
        mockup: (
            <div className="p-5 space-y-3 text-left">
                {/* Top KPIs */}
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { label: "Fleet Utilization", value: "87%", trend: "+3%" },
                        { label: "Revenue Today", value: "$24.8K", trend: "+12%" },
                        { label: "Active Bookings", value: "142", trend: "" },
                        { label: "Fleet Brain Alerts", value: "3", trend: "" },
                    ].map((kpi, i) => (
                        <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">{kpi.label}</p>
                            <div className="flex items-baseline gap-1.5 mt-1">
                                <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
                                {kpi.trend && <span className="text-[10px] font-semibold text-emerald-600">{kpi.trend}</span>}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Chart + Map row */}
                <div className="grid grid-cols-5 gap-2">
                    <div className="col-span-3 bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-2">Weekly Revenue</p>
                        <div className="h-20 flex items-end gap-[3px]">
                            {[35, 42, 38, 55, 48, 62, 58, 70, 65, 78, 72, 85, 80, 92].map((h, i) => (
                                <motion.div
                                    key={i}
                                    className="flex-1 rounded-sm"
                                    style={{ backgroundColor: i >= 12 ? "#2563eb" : "#bfdbfe" }}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="col-span-2 bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-2">Branch Network</p>
                        <div className="relative h-20 bg-slate-100 rounded overflow-hidden">
                            {[
                                { x: "25%", y: "30%", size: 8, color: "#dc2626" },
                                { x: "60%", y: "50%", size: 6, color: "#2563eb" },
                                { x: "45%", y: "70%", size: 7, color: "#059669" },
                                { x: "75%", y: "25%", size: 5, color: "#d97706" },
                            ].map((dot, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full"
                                    style={{ left: dot.x, top: dot.y, width: dot.size, height: dot.size, backgroundColor: dot.color }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ delay: 1 + i * 0.2, duration: 2, repeat: Infinity }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                {/* Branch health */}
                <div className="space-y-1.5">
                    {[
                        { name: "Airport", util: "92%", revenue: "$8.2K", status: "High demand", statusColor: "text-red-600 bg-red-50" },
                        { name: "Downtown", util: "78%", revenue: "$5.1K", status: "Optimal", statusColor: "text-emerald-600 bg-emerald-50" },
                        { name: "Mall", util: "85%", revenue: "$4.8K", status: "Optimal", statusColor: "text-emerald-600 bg-emerald-50" },
                        { name: "Industrial", util: "61%", revenue: "$2.9K", status: "Underused", statusColor: "text-amber-600 bg-amber-50" },
                    ].map((branch, i) => (
                        <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-slate-900 w-20">{branch.name}</span>
                                <span className="text-xs text-slate-500">{branch.util}</span>
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full bg-blue-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: branch.util }}
                                        transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-700">{branch.revenue}</span>
                                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${branch.statusColor}`}>{branch.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        role: "Branch Staff",
        intro: "The POS Dashboard — get cars out the door in 90 seconds.",
        color: "#059669",
        features: ["90-second walk-in flow", "Live booking status", "Return processing", "Quick vehicle swap", "Keyboard shortcuts"],
        mockup: (
            <div className="p-5 space-y-3 text-left">
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { label: "Today", value: "Thu, Apr 17" },
                        { label: "Checkouts", value: "8" },
                        { label: "Returns Due", value: "5" },
                        { label: "Available Cars", value: "12" },
                    ].map((kpi, i) => (
                        <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">{kpi.label}</p>
                            <p className="text-lg font-bold text-slate-900 mt-1">{kpi.value}</p>
                        </div>
                    ))}
                </div>
                {/* Walk-in CTA */}
                <motion.div
                    className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                >
                    <div>
                        <span className="text-emerald-700 font-semibold text-sm">+ New Walk-in Booking</span>
                        <p className="text-[10px] text-emerald-600/60 mt-0.5">ID scan → contract → payment → keys in 90 seconds</p>
                    </div>
                    <div className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-mono">N</div>
                </motion.div>
                {/* Bookings table */}
                <div className="space-y-1">
                    <div className="flex items-center px-3 py-1 text-[9px] text-slate-400 uppercase tracking-wider font-medium">
                        <span className="flex-1">Customer</span>
                        <span className="w-20">Vehicle</span>
                        <span className="w-16">Due</span>
                        <span className="w-16 text-right">Status</span>
                    </div>
                    {[
                        { customer: "Ahmad K.", vehicle: "Tucson", due: "5:00 PM", status: "Active", statusColor: "text-blue-600 bg-blue-50" },
                        { customer: "Sara M.", vehicle: "Accent", due: "2:00 PM", status: "Overdue", statusColor: "text-red-600 bg-red-50" },
                        { customer: "Fleet Corp", vehicle: "Elantra", due: "Tomorrow", status: "Active", statusColor: "text-blue-600 bg-blue-50" },
                        { customer: "Omar R.", vehicle: "Sonata", due: "6:30 PM", status: "Checkout", statusColor: "text-amber-600 bg-amber-50" },
                        { customer: "Layla H.", vehicle: "Creta", due: "Apr 19", status: "Active", statusColor: "text-blue-600 bg-blue-50" },
                    ].map((row, i) => (
                        <motion.div
                            key={i}
                            className="flex items-center px-3 py-2 bg-white rounded-lg border border-slate-100"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.08 }}
                        >
                            <span className="flex-1 text-xs font-medium text-slate-900">{row.customer}</span>
                            <span className="w-20 text-xs text-slate-500">{row.vehicle}</span>
                            <span className="w-16 text-xs text-slate-500">{row.due}</span>
                            <span className={`w-16 text-right text-[10px] font-medium px-1.5 py-0.5 rounded ${row.statusColor}`}>{row.status}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        role: "Finance Admin",
        intro: "The Finance Workspace — real-time visibility into every dollar.",
        color: "#7c3aed",
        features: ["Live P&L tracking", "Invoice management", "Deposit reconciliation", "Credit limit monitoring", "Automated billing"],
        mockup: (
            <div className="p-5 space-y-3 text-left">
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { label: "Revenue MTD", value: "$186K", trend: "+8%" },
                        { label: "Outstanding", value: "$42K", trend: "" },
                        { label: "Collected", value: "$28K", trend: "+15%" },
                        { label: "Overdue", value: "$8.2K", trend: "" },
                    ].map((kpi, i) => (
                        <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">{kpi.label}</p>
                            <div className="flex items-baseline gap-1.5 mt-1">
                                <p className="text-lg font-bold text-slate-900">{kpi.value}</p>
                                {kpi.trend && <span className="text-[10px] font-semibold text-emerald-600">{kpi.trend}</span>}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Revenue chart */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-2">Monthly Revenue vs Target</p>
                    <div className="h-16 flex items-end gap-1">
                        {[
                            { actual: 65, target: 70 }, { actual: 72, target: 70 }, { actual: 68, target: 75 },
                            { actual: 80, target: 75 }, { actual: 75, target: 80 }, { actual: 88, target: 80 },
                            { actual: 82, target: 85 }, { actual: 90, target: 85 }, { actual: 85, target: 90 },
                            { actual: 95, target: 90 }, { actual: 88, target: 92 }, { actual: 0, target: 95 },
                        ].map((bar, i) => (
                            <div key={i} className="flex-1 flex gap-[1px]">
                                <motion.div
                                    className="flex-1 rounded-sm bg-violet-400"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${bar.actual}%` }}
                                    transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                                />
                                <div className="flex-1 rounded-sm bg-slate-200" style={{ height: `${bar.target}%` }} />
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-4 mt-1.5">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-violet-400" /><span className="text-[8px] text-slate-400">Actual</span></div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-slate-200" /><span className="text-[8px] text-slate-400">Target</span></div>
                    </div>
                </div>
                {/* Invoices */}
                <div className="space-y-1">
                    {[
                        { inv: "INV-0892", client: "Fleet Corp", amount: "$12,400", status: "Paid", statusColor: "text-emerald-600 bg-emerald-50" },
                        { inv: "INV-0893", client: "Alpha Bank", amount: "$8,200", status: "Pending", statusColor: "text-amber-600 bg-amber-50" },
                        { inv: "INV-0894", client: "TeleCom Ltd", amount: "$5,600", status: "Overdue", statusColor: "text-red-600 bg-red-50" },
                        { inv: "INV-0895", client: "Gov Transport", amount: "$18,900", status: "Paid", statusColor: "text-emerald-600 bg-emerald-50" },
                    ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-slate-400">{row.inv}</span>
                                <span className="text-xs font-medium text-slate-900">{row.client}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-slate-700">{row.amount}</span>
                                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${row.statusColor}`}>{row.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
];

function BrowserFrame({ children, color }: { children: React.ReactNode; color: string }) {
    return (
        <div
            className="w-full max-w-3xl rounded-2xl overflow-hidden border border-slate-200"
            style={{ boxShadow: `0 25px 80px -15px ${color}15, 0 8px 30px -10px rgba(0,0,0,0.08)` }}
        >
            <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 border-b border-slate-100">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 ml-2 border border-slate-100">
                    <span className="text-[10px] text-slate-400">app.fleetora.com</span>
                </div>
            </div>
            <div className="bg-white">{children}</div>
        </div>
    );
}

export function ProductScreen() {
    const { ref, isInView } = useInView(0.2);
    const [activeIndex, setActiveIndex] = useState(0);
    const role = ROLES[activeIndex];

    const handleWheel = (e: React.WheelEvent) => {
        if (e.deltaY > 0 && activeIndex < ROLES.length - 1) {
            e.stopPropagation();
            setActiveIndex((prev) => Math.min(prev + 1, ROLES.length - 1));
        } else if (e.deltaY < 0 && activeIndex > 0) {
            e.stopPropagation();
            setActiveIndex((prev) => Math.max(prev - 1, 0));
        }
    };

    return (
        <section
            ref={ref}
            onWheel={handleWheel}
            className="h-screen w-full flex flex-col items-center justify-center px-8 gap-4"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                >
                    <p className="text-xs font-bold tracking-widest uppercase" style={{ color: role.color }}>{role.role}</p>
                    <p className="text-lg text-slate-500 mt-1">{role.intro}</p>
                </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    className="w-full flex justify-center"
                >
                    <BrowserFrame color={role.color}>{role.mockup}</BrowserFrame>
                </motion.div>
            </AnimatePresence>

            {/* Feature callouts */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-wrap justify-center gap-2 mt-2"
                >
                    {role.features.map((f, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.08 }}
                            className="text-[10px] font-medium px-2.5 py-1 rounded-full border border-slate-200 text-slate-500 bg-slate-50"
                        >
                            {f}
                        </motion.span>
                    ))}
                </motion.div>
            </AnimatePresence>

            <div className="flex gap-2 mt-1">
                {ROLES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "scale-125" : "bg-slate-300"}`}
                        style={i === activeIndex ? { backgroundColor: role.color } : {}}
                    />
                ))}
            </div>
        </section>
    );
}
