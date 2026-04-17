"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const MAP_BG = "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80";

const COMPONENTS = [
    { id: "timeline", title: "Booking Timeline", desc: "Every stage tracked automatically — Created → Payment → Pickup → Inspection → Return → Settlement. Full audit trail.", color: "#10b981" },
    { id: "map", title: "Live GPS Tracking", desc: "Every vehicle on the map. Speed, heading, fuel — every 30 seconds. Geo-fence alerts on zone exits.", color: "#3b82f6" },
    { id: "customer", title: "Customer & Drivers", desc: "Full profile: ID, license, nationality, history. Multi-driver with age-based surcharges and expiry warnings.", color: "#8b5cf6" },
    { id: "mileage", title: "Mileage & Traffic Tickets", desc: "Daily km tracked. Over-limit auto-charged. Tickets linked to the specific driver and settlement.", color: "#f59e0b" },
    { id: "payment", title: "Payment & Settlement", desc: "Every line item auto-calculated. Corporate credit, deposits, refunds. Balance due visible at all times.", color: "#ef4444" },
];

// Elevation animation for each section: when active, it lifts off the mockup
function liftAnim(isActive: boolean, color: string) {
    return {
        scale: isActive ? 1.15 : 1,
        y: isActive ? -8 : 0,
        opacity: isActive ? 1 : 0.2,
        zIndex: isActive ? 50 : 1,
        boxShadow: isActive ? `0 25px 60px -10px ${color}40, 0 0 0 2px ${color}50` : "none",
    };
}

export function S06LivingBooking() {
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        function runCycle() {
            setActiveIndex(-1);
            const timers: NodeJS.Timeout[] = [];

            timers.push(setTimeout(() => {}, 1500)); // intro: full mockup

            COMPONENTS.forEach((_, i) => {
                timers.push(setTimeout(() => setActiveIndex(i), 1800 + i * 3200));
            });

            timers.push(setTimeout(() => setActiveIndex(-1), 1800 + COMPONENTS.length * 3200));
            return timers;
        }

        let timers = runCycle();
        const cycleDuration = 1800 + COMPONENTS.length * 3200 + 2500;
        const loop = setInterval(() => {
            timers.forEach(clearTimeout);
            timers = runCycle();
        }, cycleDuration);

        return () => { timers.forEach(clearTimeout); clearInterval(loop); };
    }, []);

    const activeComp = activeIndex >= 0 ? COMPONENTS[activeIndex] : null;

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-6 left-10 z-30">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400">The Counter</p>
                <h2 className="text-lg font-bold text-white mt-0.5">The Living Booking</h2>
            </motion.div>

            {/* Mockup container — static, sections lift individually */}
            <div className="relative z-10 rounded-2xl border border-slate-700 overflow-visible bg-slate-900" style={{ width: "min(88vw, 1100px)", height: "62vh", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)", perspective: "1200px" }}>
                {/* Header */}
                <div className="bg-slate-800/50 px-4 py-1.5 flex items-center justify-between border-b border-slate-700/50 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-white">BK-001</span>
                        <span className="text-[9px] text-slate-500">Ahmad Al-Rasheed • Tucson 2024</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] text-emerald-400">Checked Out</span>
                    </div>
                </div>

                <div className="flex h-[calc(100%-28px)] p-3 gap-3 relative">
                    {/* LEFT column */}
                    <div className="w-[220px] shrink-0 flex flex-col gap-3">
                        {/* TIMELINE — elevates on activeIndex 0 */}
                        <motion.div
                            animate={liftAnim(activeIndex === 0, COMPONENTS[0].color)}
                            transition={{ type: "spring", stiffness: 80, damping: 18 }}
                            className="flex-1 rounded-xl bg-slate-900 border border-slate-800 p-3 origin-left"
                        >
                            <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Timeline</p>
                            {[
                                { s: "Booking Created", done: true },
                                { s: "Payment Authorized", done: true },
                                { s: "Vehicle Picked Up", done: true },
                                { s: "Pre-rental Inspection", done: true },
                                { s: "Vehicle Return", current: true },
                                { s: "Settlement" },
                            ].map((step, i) => (
                                <div key={i} className="flex gap-2 items-start mb-1.5">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-2 h-2 rounded-full ${step.done ? "bg-emerald-500" : step.current ? "bg-amber-500" : "bg-slate-700"}`} />
                                        {i < 5 && <div className={`w-px h-3 ${step.done ? "bg-emerald-500/30" : "bg-slate-800"}`} />}
                                    </div>
                                    <p className={`text-[9px] ${step.done ? "text-slate-300" : step.current ? "text-amber-400 font-medium" : "text-slate-600"}`}>{step.s}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* MILEAGE — elevates on activeIndex 3 */}
                        <motion.div
                            animate={liftAnim(activeIndex === 3, COMPONENTS[3].color)}
                            transition={{ type: "spring", stiffness: 80, damping: 18 }}
                            className="rounded-xl bg-slate-900 border border-slate-800 p-3 origin-left"
                        >
                            <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Mileage</p>
                            <div className="flex justify-between text-[9px] mb-1"><span className="text-slate-400">1,275 km</span><span className="text-slate-500">/ 1,500</span></div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full w-[85%] bg-amber-500 rounded-full" /></div>
                            <div className="flex gap-0.5 mt-2">{[315, 180, 265, 275, 190].map((km, i) => (<div key={i} className={`flex-1 h-4 rounded-sm ${km > 300 ? "bg-red-500" : "bg-emerald-500/70"}`} />))}</div>
                            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-1.5 mt-2">
                                <p className="text-[9px] text-white font-medium">📸 Speed Camera</p>
                                <p className="text-[8px] text-slate-500">25,000 JOD • Pending</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* CENTER — Map */}
                    <motion.div
                        animate={liftAnim(activeIndex === 1, COMPONENTS[1].color)}
                        transition={{ type: "spring", stiffness: 80, damping: 18 }}
                        className="flex-1 rounded-xl bg-slate-900 border border-slate-800 flex flex-col overflow-hidden origin-center"
                    >
                        <div className="flex-1 relative overflow-hidden">
                            <img src={MAP_BG} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.35) saturate(0.7) hue-rotate(180deg)" }} />
                            <div className="absolute" style={{ left: "50%", top: "40%" }}><div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg shadow-blue-500/50" /></div>
                            {[{ x: "22%", y: "28%", c: "#22c55e" }, { x: "68%", y: "55%", c: "#22c55e" }, { x: "38%", y: "68%", c: "#f59e0b" }, { x: "78%", y: "32%", c: "#3b82f6" }].map((p, i) => (
                                <div key={i} className="absolute w-2.5 h-2.5 rounded-full" style={{ left: p.x, top: p.y, background: p.c, boxShadow: `0 0 6px ${p.c}60` }} />
                            ))}
                        </div>
                        <div className="flex items-center border-t border-slate-800 px-3 py-2 bg-slate-900 gap-3">
                            {[{ v: "97", u: "km/h" }, { v: "NE", u: "" }, { v: "69%", u: "" }, { v: "8,665", u: "km" }].map((t, i) => (
                                <div key={i} className="flex-1 text-center"><p className="text-sm font-bold text-white leading-none">{t.v}<span className="text-[7px] text-slate-500 ml-0.5">{t.u}</span></p></div>
                            ))}
                        </div>
                    </motion.div>

                    {/* RIGHT column */}
                    <div className="w-[220px] shrink-0 flex flex-col gap-3">
                        {/* CUSTOMER — elevates on activeIndex 2 */}
                        <motion.div
                            animate={liftAnim(activeIndex === 2, COMPONENTS[2].color)}
                            transition={{ type: "spring", stiffness: 80, damping: 18 }}
                            className="flex-1 rounded-xl bg-slate-900 border border-slate-800 p-3 origin-right"
                        >
                            <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Customer</p>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-[10px] font-bold">AR</div>
                                <div><p className="text-[10px] font-bold text-white">Ahmad Al-Rasheed</p><p className="text-[8px] text-slate-500">Jordanian</p></div>
                            </div>
                            <div className="space-y-1 text-[9px] text-slate-400">
                                <p>📞 +962 79 123 4567</p>
                                <p>🪪 ID: 98-●●●●●</p>
                            </div>
                            <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-3 mb-1.5 font-semibold">Drivers (1)</p>
                            <div className="bg-slate-800/50 rounded-md p-1.5 flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400 text-[8px] font-bold">AR</div>
                                <p className="text-[9px] text-white">Ahmad</p>
                                <span className="text-[7px] px-1 py-0.5 rounded bg-blue-500/20 text-blue-400 ml-auto">Primary</span>
                            </div>
                        </motion.div>

                        {/* PAYMENT — elevates on activeIndex 4 */}
                        <motion.div
                            animate={liftAnim(activeIndex === 4, COMPONENTS[4].color)}
                            transition={{ type: "spring", stiffness: 80, damping: 18 }}
                            className="rounded-xl bg-slate-900 border border-slate-800 p-3 origin-right"
                        >
                            <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Payment</p>
                            <div className="space-y-1 text-[9px]">
                                <div className="flex justify-between"><span className="text-slate-500">5d × 35,000</span><span className="text-white">175,000</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Insurance</span><span className="text-white">25,000</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Tax</span><span className="text-white">14,000</span></div>
                                <div className="flex justify-between font-bold pt-1 mt-1 border-t border-slate-800"><span className="text-white">Total</span><span className="text-white">200,000 JOD</span></div>
                                <div className="flex justify-between"><span className="text-emerald-400">Balance</span><span className="text-emerald-400 font-bold">14,000 JOD</span></div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Description — appears AFTER elevation */}
            <AnimatePresence>
                {activeComp && (
                    <motion.div
                        key={activeComp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-full px-6"
                    >
                        <div className="rounded-2xl border bg-slate-900/95 backdrop-blur-xl px-6 py-4" style={{ borderColor: `${activeComp.color}40`, boxShadow: `0 20px 60px -10px ${activeComp.color}30` }}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeComp.color }} />
                                <h3 className="text-lg font-bold text-white">{activeComp.title}</h3>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">{activeComp.desc}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
                {COMPONENTS.map((comp, i) => (
                    <div key={i} className="rounded-full transition-all duration-500" style={{ width: activeIndex === i ? 20 : 5, height: 5, backgroundColor: activeIndex === i ? comp.color : activeIndex > i ? `${comp.color}60` : "rgb(51,65,85)" }} />
                ))}
            </motion.div>
        </section>
    );
}
