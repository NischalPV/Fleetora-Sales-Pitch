"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Each component of the booking detail gets its own card + description
const COMPONENTS = [
    {
        title: "Live GPS Tracking",
        desc: "Every checked-out vehicle visible on the map. Speed, heading, fuel — updating every 30 seconds. Geo-fence alerts when a vehicle leaves the operating zone.",
        color: "#3b82f6",
        content: (
            <div className="h-full bg-slate-800/50 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                <svg className="absolute inset-0 w-full h-full opacity-20"><path d="M10% 50% Q30% 40% 50% 55% Q70% 65% 90% 45%" stroke="#475569" fill="none" strokeWidth="3" /></svg>
                <div className="absolute" style={{ left: "55%", top: "40%" }}>
                    <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg" />
                </div>
                {[{ x: "20%", y: "30%", c: "#22c55e" }, { x: "70%", y: "60%", c: "#22c55e" }, { x: "40%", y: "70%", c: "#f59e0b" }, { x: "80%", y: "35%", c: "#3b82f6" }].map((p, i) => (
                    <div key={i} className="absolute w-2.5 h-2.5 rounded-full" style={{ left: p.x, top: p.y, background: p.c }} />
                ))}
                <div className="absolute bottom-2 right-2 bg-slate-900/90 backdrop-blur-sm rounded-lg px-2 py-1 flex gap-3">
                    {[{ v: "97", l: "km/h" }, { v: "NE", l: "heading" }, { v: "69%", l: "fuel" }].map((t, i) => (
                        <div key={i} className="text-center"><p className="text-xs font-bold text-white">{t.v}</p><p className="text-[7px] text-slate-500">{t.l}</p></div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        title: "Booking Timeline",
        desc: "Every stage tracked automatically. Created → Payment → Pickup → Inspection → Return → Settlement. Who did what, when, and the current status at a glance.",
        color: "#10b981",
        content: (
            <div className="h-full flex flex-col justify-center px-6 py-4 space-y-0">
                {["Booking Created", "Payment Authorized", "Vehicle Picked Up", "Pre-rental Inspection", "Vehicle Return", "Settlement"].map((s, i) => (
                    <div key={i} className="flex gap-3 items-start">
                        <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${i < 4 ? "bg-emerald-500" : i === 4 ? "bg-amber-500" : "bg-slate-700"}`} />
                            {i < 5 && <div className={`w-px h-4 ${i < 4 ? "bg-emerald-500/30" : "bg-slate-800"}`} />}
                        </div>
                        <p className={`text-xs ${i < 4 ? "text-white" : i === 4 ? "text-amber-400" : "text-slate-600"}`}>{s}</p>
                    </div>
                ))}
            </div>
        ),
    },
    {
        title: "Multi-Driver Management",
        desc: "Family trips, corporate pools — each driver tracked with license, age-based surcharges, and insurance. Expiry warnings at 90 days. Surcharges calculated automatically.",
        color: "#8b5cf6",
        content: (
            <div className="h-full flex flex-col justify-center px-4 py-3 space-y-2">
                {[
                    { name: "Ahmad Al-Rasheed", badge: "Primary", badgeColor: "bg-blue-500/20 text-blue-400" },
                    { name: "Fatima Al-Rasheed", badge: "Under-25", badgeColor: "bg-amber-500/20 text-amber-400" },
                    { name: "Hassan Al-Rasheed", badge: "Senior", badgeColor: "bg-purple-500/20 text-purple-400" },
                ].map((d, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-800/30 rounded-lg p-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-bold">{d.name.split(" ").map(n => n[0]).join("")}</div>
                        <div className="flex-1"><p className="text-xs text-white">{d.name}</p><p className="text-[9px] text-slate-500">License valid</p></div>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${d.badgeColor}`}>{d.badge}</span>
                    </div>
                ))}
            </div>
        ),
    },
    {
        title: "Mileage & Traffic Tickets",
        desc: "Daily mileage tracked against allowance. Over-limit charges auto-calculated. Speed cameras, parking fines — linked to the booking, the driver, and the settlement.",
        color: "#f59e0b",
        content: (
            <div className="h-full flex flex-col justify-center px-5 py-4 gap-3">
                <div>
                    <p className="text-[9px] text-slate-500 uppercase mb-1">1,275 km used / 1,500 allowed</p>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full w-[85%] bg-amber-500 rounded-full" /></div>
                    <div className="flex gap-1 mt-2">{[315, 180, 265, 275, 190].map((km, i) => (<div key={i} className={`flex-1 h-5 rounded-sm ${km > 300 ? "bg-red-500" : "bg-emerald-500/70"}`} />))}</div>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2.5">
                    <p className="text-[10px] text-white font-medium">📸 Speed Camera — 25,000 JOD</p>
                    <p className="text-[9px] text-slate-500">Airport Highway • Pending</p>
                </div>
            </div>
        ),
    },
    {
        title: "Payment & Settlement",
        desc: "Every line item — base rental, surcharges, mileage overages, insurance, fines — calculated automatically. Cash, card, corporate credit, or split payment. Deposits tracked to the penny.",
        color: "#ef4444",
        content: (
            <div className="h-full flex flex-col justify-center px-5 py-4">
                <div className="space-y-1.5">
                    {[{ l: "5 days × 35,000 JOD", a: "175,000" }, { l: "Full insurance", a: "25,000" }, { l: "Tax", a: "14,000" }].map((r, i) => (
                        <div key={i} className="flex justify-between text-[10px]"><span className="text-slate-500">{r.l}</span><span className="text-white">{r.a}</span></div>
                    ))}
                    <div className="flex justify-between text-xs font-bold pt-2 border-t border-slate-700"><span className="text-white">Total</span><span className="text-white">200,000 JOD</span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-emerald-400">Balance due</span><span className="text-emerald-400 font-bold">14,000 JOD</span></div>
                </div>
            </div>
        ),
    },
];

export function S06bBookingShowcase() {
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        const timers = COMPONENTS.map((_, i) =>
            setTimeout(() => setActiveIndex(i), 1000 + i * 3000)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex items-center relative overflow-hidden bg-slate-950" style={{ perspective: "1200px" }}>
            {/* Background */}
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            {/* Left side: 3D card stack */}
            <div className="w-[45%] h-full flex items-center justify-center relative" style={{ perspective: "1000px" }}>
                {COMPONENTS.map((comp, i) => {
                    const isActive = activeIndex === i;
                    const isPast = activeIndex > i;
                    const isFuture = activeIndex < i;

                    // 3D stack position — past cards fan out to the left in perspective
                    const stackX = isPast ? -180 - (activeIndex - i - 1) * 60 : isActive ? 0 : 100;
                    const stackRotateY = isPast ? 35 + (activeIndex - i - 1) * 5 : isActive ? 0 : -15;
                    const stackScale = isPast ? 0.75 - (activeIndex - i - 1) * 0.05 : isActive ? 1 : 0.8;
                    const stackZ = isPast ? -(activeIndex - i) * 50 : isActive ? 0 : -100;
                    const stackOpacity = isPast ? 0.6 - (activeIndex - i - 1) * 0.1 : isActive ? 1 : 0;

                    return (
                        <motion.div
                            key={i}
                            animate={{
                                x: stackX,
                                rotateY: stackRotateY,
                                scale: Math.max(stackScale, 0.5),
                                z: stackZ,
                                opacity: Math.max(stackOpacity, 0),
                            }}
                            transition={{ type: "spring", stiffness: 60, damping: 20 }}
                            className="absolute w-[320px] h-[240px] rounded-2xl border overflow-hidden"
                            style={{
                                borderColor: isActive ? `${comp.color}40` : "rgb(51,65,85)",
                                backgroundColor: "rgb(15,23,42)",
                                boxShadow: isActive ? `0 20px 60px -10px ${comp.color}20` : "0 10px 30px -10px rgba(0,0,0,0.3)",
                                transformStyle: "preserve-3d",
                            }}
                        >
                            {/* Card header */}
                            <div className="px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: comp.color }} />
                                <span className="text-[10px] font-semibold text-white">{comp.title}</span>
                            </div>
                            {/* Card content */}
                            <div className="flex-1 h-[calc(100%-32px)]">
                                {comp.content}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Right side: Description */}
            <div className="w-[55%] h-full flex flex-col justify-center px-16">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 mb-4"
                >
                    Inside Every Booking
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-8"
                >
                    Built for the messy reality.
                </motion.h2>

                {/* Active component description */}
                <div className="min-h-[120px]">
                    <AnimatePresence mode="wait">
                        {activeIndex >= 0 && (
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COMPONENTS[activeIndex].color }} />
                                    <h3 className="text-xl font-bold text-white">{COMPONENTS[activeIndex].title}</h3>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                                    {COMPONENTS[activeIndex].desc}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Progress dots */}
                <div className="flex gap-2 mt-8">
                    {COMPONENTS.map((comp, i) => (
                        <motion.div
                            key={i}
                            className="rounded-full transition-all duration-500"
                            style={{
                                width: activeIndex === i ? 24 : 6,
                                height: 6,
                                backgroundColor: activeIndex >= i ? comp.color : "rgb(51,65,85)",
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
