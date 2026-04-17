"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Use a proper Unsplash aerial/map image instead of a tile
const MAP_BG = "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80";

const COMPONENTS = [
    {
        title: "Live GPS Tracking",
        desc: "Every checked-out vehicle on the map. Speed, heading, fuel — updating every 30 seconds. Geo-fence alerts when vehicles leave the operating zone.",
        color: "#3b82f6",
        content: (
            <div className="h-full relative overflow-hidden rounded-b-2xl">
                <img src={MAP_BG} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.3) saturate(0.6) hue-rotate(180deg)" }} />
                <div className="absolute" style={{ left: "50%", top: "38%" }}>
                    <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg shadow-blue-500/50" />
                </div>
                {[{ x: "22%", y: "28%", c: "#22c55e" }, { x: "68%", y: "55%", c: "#22c55e" }, { x: "38%", y: "68%", c: "#f59e0b" }, { x: "78%", y: "32%", c: "#3b82f6" }].map((p, i) => (
                    <div key={i} className="absolute w-2.5 h-2.5 rounded-full" style={{ left: p.x, top: p.y, background: p.c, boxShadow: `0 0 6px ${p.c}60` }} />
                ))}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-sm rounded-xl px-4 py-2 flex justify-between">
                    {[{ v: "97", l: "km/h" }, { v: "NE", l: "heading" }, { v: "69%", l: "fuel" }, { v: "8,665", l: "odo" }].map((t, i) => (
                        <div key={i} className="text-center"><p className="text-sm font-bold text-white">{t.v}</p><p className="text-[7px] text-slate-500 uppercase">{t.l}</p></div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        title: "Booking Timeline",
        desc: "Every stage tracked automatically — Created, Payment, Pickup, Inspection, Return, Settlement. Who did what, when, with full audit trail.",
        color: "#10b981",
        content: (
            <div className="h-full flex flex-col justify-center px-6 py-4">
                {[
                    { s: "Booking Created", t: "24 Mar, 2:30 PM", done: true },
                    { s: "Payment Authorized", t: "200,000 JOD deposit held", done: true },
                    { s: "Vehicle Picked Up", t: "Tucson 2024 from Downtown", done: true },
                    { s: "Pre-rental Inspection", t: "Fuel: Full, Odo: 8,200 km", done: true },
                    { s: "Vehicle Return", t: "Expected 30 Mar", done: false, current: true },
                    { s: "Settlement", t: "Final charges + deposit", done: false },
                ].map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                        <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${step.done ? "bg-emerald-500" : step.current ? "bg-amber-500 ring-2 ring-amber-500/30" : "bg-slate-700"}`} />
                            {i < 5 && <div className={`w-px h-5 ${step.done ? "bg-emerald-500/30" : "bg-slate-800"}`} />}
                        </div>
                        <div className="pb-1">
                            <p className={`text-[11px] font-medium ${step.done ? "text-white" : step.current ? "text-amber-400" : "text-slate-600"}`}>{step.s}</p>
                            <p className="text-[9px] text-slate-500">{step.t}</p>
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        title: "Drivers & Surcharges",
        desc: "Family trips, corporate pools — each driver tracked with license, age-based surcharges, insurance tier, and expiry warnings at 90 days.",
        color: "#8b5cf6",
        content: (
            <div className="h-full flex flex-col justify-center px-5 py-3 gap-2.5">
                {[
                    { n: "Ahmad Al-Rasheed", b: "Primary", bc: "bg-blue-500/20 text-blue-400", extra: "License valid — Mar 2027" },
                    { n: "Fatima Al-Rasheed", b: "Under-25", bc: "bg-amber-500/20 text-amber-400", extra: "+15 JOD/day surcharge" },
                    { n: "Hassan Al-Rasheed", b: "Senior", bc: "bg-purple-500/20 text-purple-400", extra: "+10 JOD/day • License expiring" },
                ].map((d, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-800/40 rounded-xl p-3">
                        <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-bold">{d.n.split(" ").map(x => x[0]).join("")}</div>
                        <div className="flex-1">
                            <p className="text-[11px] font-medium text-white">{d.n}</p>
                            <p className="text-[9px] text-slate-500">{d.extra}</p>
                        </div>
                        <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${d.bc}`}>{d.b}</span>
                    </div>
                ))}
            </div>
        ),
    },
    {
        title: "Mileage & Traffic Tickets",
        desc: "Daily km tracked against allowance. Over-limit charges auto-calculated. Speed cameras and parking fines linked to the specific driver and settlement.",
        color: "#f59e0b",
        content: (
            <div className="h-full flex flex-col justify-center px-5 py-3 gap-3">
                <div>
                    <div className="flex justify-between text-[10px] mb-1"><span className="text-slate-400">1,275 km used</span><span className="text-slate-500">1,500 km allowed</span></div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full w-[85%] bg-amber-500 rounded-full" /></div>
                    <div className="flex gap-1 mt-2.5">
                        {[{ km: 315, d: "D1" }, { km: 180, d: "D2" }, { km: 265, d: "D3" }, { km: 275, d: "D4" }, { km: 190, d: "D5" }].map((day, i) => (
                            <div key={i} className="flex-1 text-center">
                                <div className={`w-full h-6 rounded-sm ${day.km > 300 ? "bg-red-500" : "bg-emerald-500/70"}`} />
                                <p className="text-[8px] text-slate-500 mt-1">{day.km}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <div className="flex justify-between items-center">
                        <p className="text-[11px] font-medium text-white">📸 Speed Camera</p>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Pending</span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-0.5">Airport Highway, km 12 • 25,000 JOD • Driver: Fatima</p>
                </div>
            </div>
        ),
    },
    {
        title: "Payment & Settlement",
        desc: "Every line item auto-calculated — base rental, surcharges, mileage overages, insurance, fines. Corporate credit, deposits, refunds — all tracked to the penny.",
        color: "#ef4444",
        content: (
            <div className="h-full flex flex-col justify-center px-6 py-4">
                <div className="space-y-1.5">
                    {[{ l: "5 days × 35,000 JOD/day", a: "175,000" }, { l: "Full insurance", a: "25,000" }, { l: "Tax (7%)", a: "14,000" }, { l: "Mileage overage", a: "0" }, { l: "Speed camera ticket", a: "25,000" }].map((r, i) => (
                        <div key={i} className="flex justify-between text-[11px]"><span className="text-slate-500">{r.l}</span><span className="text-white">{r.a}</span></div>
                    ))}
                    <div className="flex justify-between text-sm font-bold pt-2 mt-1 border-t border-slate-700"><span className="text-white">Total</span><span className="text-white">239,000 JOD</span></div>
                    <div className="flex justify-between text-[11px] mt-1"><span className="text-slate-500">Deposit held</span><span className="text-slate-400">200,000 JOD</span></div>
                    <div className="flex justify-between text-[11px]"><span className="text-emerald-400 font-medium">Balance due</span><span className="text-emerald-400 font-bold">39,000 JOD</span></div>
                </div>
            </div>
        ),
    },
];

export function S06LivingBooking() {
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        function runCycle() {
            setActiveIndex(-1);
            const timers = COMPONENTS.map((_, i) =>
                setTimeout(() => setActiveIndex(i), 800 + i * 3000)
            );
            return timers;
        }

        let timers = runCycle();
        const cycleDuration = 800 + COMPONENTS.length * 3000 + 2000;
        const loop = setInterval(() => {
            timers.forEach(clearTimeout);
            timers = runCycle();
        }, cycleDuration);

        return () => { timers.forEach(clearTimeout); clearInterval(loop); };
    }, []);

    return (
        <section className="h-screen w-full flex items-center relative overflow-hidden bg-slate-950" style={{ perspective: "1200px" }}>
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            {/* Left: 3D card stack */}
            <div className="w-[48%] h-full flex items-center justify-center relative" style={{ perspective: "1000px" }}>
                {COMPONENTS.map((comp, i) => {
                    const isActive = activeIndex === i;
                    const isPast = activeIndex > i;

                    const x = isPast ? -160 - (activeIndex - i - 1) * 55 : isActive ? 20 : 100;
                    const rotY = isPast ? 35 + (activeIndex - i - 1) * 5 : isActive ? 0 : -12;
                    const sc = isPast ? 0.72 - (activeIndex - i - 1) * 0.05 : isActive ? 1 : 0.8;
                    const op = isPast ? Math.max(0.55 - (activeIndex - i - 1) * 0.12, 0) : isActive ? 1 : activeIndex >= 0 ? 0.2 : 0;

                    return (
                        <motion.div
                            key={i}
                            animate={{ x, rotateY: rotY, scale: Math.max(sc, 0.4), opacity: op }}
                            transition={{ type: "spring", stiffness: 55, damping: 18 }}
                            className="absolute w-[380px] h-[290px] rounded-2xl border overflow-hidden"
                            style={{
                                borderColor: isActive ? `${comp.color}50` : "rgb(51,65,85)",
                                backgroundColor: "rgb(15,23,42)",
                                boxShadow: isActive ? `0 25px 60px -10px ${comp.color}25, 0 0 0 1px ${comp.color}15` : "0 10px 30px -10px rgba(0,0,0,0.3)",
                                transformStyle: "preserve-3d",
                            }}
                        >
                            <div className="px-4 py-2.5 border-b border-slate-800 flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: comp.color }} />
                                <span className="text-[11px] font-semibold text-white">{comp.title}</span>
                            </div>
                            <div className="h-[calc(100%-34px)]">{comp.content}</div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Right: Description */}
            <div className="w-[52%] h-full flex flex-col justify-center px-12">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 mb-3">
                    The Counter — Inside Every Booking
                </motion.p>

                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-8">
                    Built for the messy reality.
                </motion.h2>

                <div className="min-h-[120px]">
                    <AnimatePresence mode="wait">
                        {activeIndex >= 0 && (
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: COMPONENTS[activeIndex].color }} />
                                    <h3 className="text-xl font-bold text-white">{COMPONENTS[activeIndex].title}</h3>
                                </div>
                                <p className="text-base text-slate-400 leading-relaxed max-w-lg">
                                    {COMPONENTS[activeIndex].desc}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

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
