"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "../shared/use-in-view";

const ROLES = [
    {
        role: "Franchise Head",
        intro: "What the VP of Operations sees every morning.",
        color: "#3b82f6",
        mockup: (
            <div className="p-4 space-y-3">
                <div className="flex gap-3">
                    {["Fleet Utilization", "Revenue Today", "Active Bookings", "Alerts"].map((label, i) => (
                        <div key={i} className="flex-1 bg-slate-50 rounded-lg p-3">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
                            <p className="text-lg font-bold text-slate-900 mt-1">{["87%", "$24.8K", "142", "3"][i]}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-slate-100 rounded-lg p-3 h-24 flex items-end gap-1">
                    {[40, 55, 45, 70, 65, 80, 75, 90, 85, 72, 88, 92].map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm bg-blue-500/80" style={{ height: `${h}%` }} />
                    ))}
                </div>
                <div className="space-y-1">
                    {["Airport \u2014 92%", "Downtown \u2014 78%", "Mall \u2014 85%"].map((b, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-50 rounded px-3 py-1.5">
                            <span className="text-xs text-slate-500">{b.split(" \u2014 ")[0]}</span>
                            <span className="text-xs font-medium text-slate-700">{b.split(" \u2014 ")[1]}</span>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        role: "Branch Staff",
        intro: "What the branch agent sees at the counter.",
        color: "#10b981",
        mockup: (
            <div className="p-4 space-y-3">
                <div className="flex gap-3">
                    {["Today", "Checkouts", "Returns", "Available"].map((label, i) => (
                        <div key={i} className="flex-1 bg-slate-50 rounded-lg p-3">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
                            <p className="text-lg font-bold text-slate-900 mt-1">{["Thu", "8", "5", "12"][i]}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-center">
                    <span className="text-emerald-600 font-semibold text-sm">+ New Walk-in</span>
                </div>
                <div className="space-y-1">
                    {[
                        { text: "Ahmad K. \u2014 Tucson \u2014 Due 5pm", status: "ACTIVE", statusClass: "bg-slate-100 text-slate-500" },
                        { text: "Sara M. \u2014 Accent \u2014 Overdue", status: "OVERDUE", statusClass: "bg-red-50 text-red-600" },
                        { text: "Fleet Co. \u2014 Elantra \u2014 Active", status: "ACTIVE", statusClass: "bg-slate-100 text-slate-500" },
                    ].map((b, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-50 rounded px-3 py-1.5">
                            <span className="text-xs text-slate-500">{b.text}</span>
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${b.statusClass}`}>{b.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        role: "Finance Admin",
        intro: "What finance sees at month-end.",
        color: "#8b5cf6",
        mockup: (
            <div className="p-4 space-y-3">
                <div className="flex gap-3">
                    {["Revenue MTD", "Outstanding", "Deposits", "Overdue"].map((label, i) => (
                        <div key={i} className="flex-1 bg-slate-50 rounded-lg p-3">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
                            <p className="text-lg font-bold text-slate-900 mt-1">{["$186K", "$42K", "$28K", "$8.2K"][i]}</p>
                        </div>
                    ))}
                </div>
                <div className="space-y-1">
                    {[
                        { inv: "INV-2024-0892 \u2014 Fleet Corp", amount: "$12,400", status: "Paid", statusClass: "bg-green-50 text-green-600" },
                        { inv: "INV-2024-0893 \u2014 Alpha Bank", amount: "$8,200", status: "Pending", statusClass: "bg-amber-50 text-amber-600" },
                        { inv: "INV-2024-0894 \u2014 TeleCom", amount: "$5,600", status: "Overdue", statusClass: "bg-red-50 text-red-600" },
                    ].map((b, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-50 rounded px-3 py-1.5">
                            <span className="text-xs text-slate-500 truncate mr-2">{b.inv}</span>
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap ${b.statusClass}`}>{b.status}</span>
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
            className="w-full max-w-2xl rounded-xl overflow-hidden border border-slate-200"
            style={{ boxShadow: `0 20px 60px -10px ${color}25` }}
        >
            <div className="bg-slate-100 px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="flex-1 bg-slate-200/80 rounded-md px-3 py-1 ml-2">
                    <span className="text-[10px] text-slate-400">app.fleetora.com</span>
                </div>
            </div>
            <div className="bg-white">{children}</div>
        </div>
    );
}

export function ProductScreen() {
    const { ref, isInView } = useInView(0.3);
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
            className="h-screen w-full snap-start flex flex-col items-center justify-center px-8 gap-6"
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
                    <p className="text-sm font-bold tracking-widest uppercase" style={{ color: role.color }}>{role.role}</p>
                    <p className="text-lg text-slate-500 mt-1">{role.intro}</p>
                </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    className="w-full flex justify-center"
                    style={{ transform: "perspective(1200px) rotateX(2deg)" }}
                >
                    <BrowserFrame color={role.color}>{role.mockup}</BrowserFrame>
                </motion.div>
            </AnimatePresence>

            <div className="flex gap-2">
                {ROLES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-white scale-125" : "bg-slate-300"}`}
                    />
                ))}
            </div>
        </section>
    );
}
