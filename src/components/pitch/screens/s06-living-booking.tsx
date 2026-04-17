"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, lazy, Suspense } from "react";

const FleetMap = lazy(() => import("@/components/ui/fleet-map").then(m => ({ default: m.FleetMap })));

const MAP_PINS = [
    { lat: 31.975, lng: 35.930, color: "#3b82f6", size: 14, pulse: true, popup: "<b>Tucson 2024</b><br/>JS-45-4821 • Ahmad Al-Rasheed" },
    { lat: 31.960, lng: 35.915, color: "#22c55e", size: 7 },
    { lat: 31.950, lng: 35.950, color: "#22c55e", size: 7 },
    { lat: 31.968, lng: 35.942, color: "#ef4444", size: 10, popup: "<b>📸 Speed Camera</b><br/>Airport Highway • 25,000 JOD" },
];

// Phase 1: Mockup builds (0-5s)
// Phase 2: Mockup shrinks and moves left, 3D showcase begins on right (5s+)

const SHOWCASE_COMPONENTS = [
    { title: "Live GPS Tracking", desc: "Position, speed, fuel — every 30 seconds. Geo-fence alerts on zone exit.", color: "#3b82f6",
      content: (
        <div className="h-full bg-slate-800/50 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
            <div className="absolute" style={{ left: "55%", top: "40%" }}><div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg" /></div>
            {[{ x: "20%", y: "30%", c: "#22c55e" }, { x: "70%", y: "60%", c: "#22c55e" }, { x: "40%", y: "70%", c: "#f59e0b" }].map((p, i) => (
                <div key={i} className="absolute w-2.5 h-2.5 rounded-full" style={{ left: p.x, top: p.y, background: p.c }} />
            ))}
            <div className="absolute bottom-2 right-2 bg-slate-900/90 rounded-lg px-2 py-1 flex gap-3">
                {[{ v: "97", l: "km/h" }, { v: "NE", l: "" }, { v: "69%", l: "fuel" }].map((t, i) => (
                    <div key={i} className="text-center"><p className="text-[10px] font-bold text-white">{t.v}</p><p className="text-[7px] text-slate-500">{t.l}</p></div>
                ))}
            </div>
        </div>
    )},
    { title: "Booking Timeline", desc: "Created → Payment → Pickup → Inspection → Return → Settlement. Every stage, every timestamp.", color: "#10b981",
      content: (
        <div className="h-full flex flex-col justify-center px-5 py-3">
            {["Booking Created", "Payment Authorized", "Vehicle Picked Up", "Pre-rental Inspection", "Vehicle Return", "Settlement"].map((s, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                    <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${i < 4 ? "bg-emerald-500" : i === 4 ? "bg-amber-500" : "bg-slate-700"}`} />
                        {i < 5 && <div className={`w-px h-4 ${i < 4 ? "bg-emerald-500/30" : "bg-slate-800"}`} />}
                    </div>
                    <p className={`text-[11px] ${i < 4 ? "text-white" : i === 4 ? "text-amber-400" : "text-slate-600"}`}>{s}</p>
                </div>
            ))}
        </div>
    )},
    { title: "Drivers & Surcharges", desc: "Multi-driver with age-based surcharges, license tracking, and expiry warnings.", color: "#8b5cf6",
      content: (
        <div className="h-full flex flex-col justify-center px-4 py-3 space-y-2">
            {[{ n: "Ahmad Al-Rasheed", b: "Primary", bc: "bg-blue-500/20 text-blue-400" }, { n: "Fatima Al-Rasheed", b: "Under-25", bc: "bg-amber-500/20 text-amber-400" }, { n: "Hassan Al-Rasheed", b: "Senior", bc: "bg-purple-500/20 text-purple-400" }].map((d, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-slate-800/30 rounded-lg p-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[9px] text-slate-400 font-bold">{d.n.split(" ").map(x=>x[0]).join("")}</div>
                    <div className="flex-1"><p className="text-[11px] text-white">{d.n}</p></div>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${d.bc}`}>{d.b}</span>
                </div>
            ))}
        </div>
    )},
    { title: "Mileage & Tickets", desc: "Daily km tracked, overages auto-charged. Speed cameras and parking fines linked to the driver.", color: "#f59e0b",
      content: (
        <div className="h-full flex flex-col justify-center px-5 py-3 gap-3">
            <div>
                <p className="text-[9px] text-slate-500 mb-1">1,275 / 1,500 km</p>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full w-[85%] bg-amber-500 rounded-full" /></div>
                <div className="flex gap-0.5 mt-2">{[315, 180, 265, 275, 190].map((km, i) => (<div key={i} className={`flex-1 h-5 rounded-sm ${km > 300 ? "bg-red-500" : "bg-emerald-500/70"}`} />))}</div>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2.5">
                <p className="text-[10px] text-white font-medium">📸 Speed Camera — 25,000 JOD</p>
                <p className="text-[8px] text-slate-500">Airport Hwy • Pending</p>
            </div>
        </div>
    )},
    { title: "Payment & Settlement", desc: "Every line item auto-calculated. Corporate credit, deposits, refunds — all tracked.", color: "#ef4444",
      content: (
        <div className="h-full flex flex-col justify-center px-5 py-3">
            {[{ l: "5 days × 35,000", a: "175,000" }, { l: "Insurance", a: "25,000" }, { l: "Tax", a: "14,000" }].map((r, i) => (
                <div key={i} className="flex justify-between text-[10px] py-0.5"><span className="text-slate-500">{r.l}</span><span className="text-white">{r.a}</span></div>
            ))}
            <div className="flex justify-between text-xs font-bold pt-2 mt-1 border-t border-slate-700"><span className="text-white">Total</span><span className="text-white">200,000 JOD</span></div>
            <div className="flex justify-between text-[10px] mt-1"><span className="text-emerald-400">Balance</span><span className="text-emerald-400 font-bold">14,000 JOD</span></div>
        </div>
    )},
];

export function S06LivingBooking() {
    const [buildPhase, setBuildPhase] = useState(0);
    const [mode, setMode] = useState<"build" | "showcase" | "reassemble">("build");
    const [showcaseIndex, setShowcaseIndex] = useState(-1);

    useEffect(() => {
        function runCycle() {
            const t: NodeJS.Timeout[] = [];

            // Build mockup (0-5s)
            setBuildPhase(0); setMode("build"); setShowcaseIndex(-1);
            t.push(setTimeout(() => setBuildPhase(1), 400));
            t.push(setTimeout(() => setBuildPhase(2), 1200));
            t.push(setTimeout(() => setBuildPhase(3), 2200));
            t.push(setTimeout(() => setBuildPhase(4), 3200));

            // Peel off into showcase (5s+)
            t.push(setTimeout(() => setMode("showcase"), 5000));
            SHOWCASE_COMPONENTS.forEach((_, i) => {
                t.push(setTimeout(() => setShowcaseIndex(i), 5500 + i * 3000));
            });

            // Reassemble: showcase fades, mockup returns to center (after last component + pause)
            const reassembleAt = 5500 + SHOWCASE_COMPONENTS.length * 3000 + 1500;
            t.push(setTimeout(() => { setMode("reassemble"); setShowcaseIndex(-1); }, reassembleAt));

            // Back to build for next loop
            t.push(setTimeout(() => { setMode("build"); setBuildPhase(4); }, reassembleAt + 1500));

            return t;
        }

        let timers = runCycle();
        const cycleDuration = 5500 + SHOWCASE_COMPONENTS.length * 3000 + 1500 + 1500 + 1000;
        const loop = setInterval(() => {
            timers.forEach(clearTimeout);
            timers = runCycle();
        }, cycleDuration);

        return () => { timers.forEach(clearTimeout); clearInterval(loop); };
    }, []);

    return (
        <section className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-950" style={{ perspective: "1200px" }}>
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/3 blur-3xl rounded-full pointer-events-none" />

            {/* Heading — always visible */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-6 left-10 z-20">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400">The Counter</p>
                <h2 className="text-lg font-bold text-white mt-0.5">The Living Booking</h2>
            </motion.div>

            {/* BUILD MODE: Centered mockup that assembles */}
            <motion.div
                animate={mode === "showcase" ? { scale: 0.45, x: "-35vw", y: 0, opacity: 0.4 } : mode === "reassemble" ? { scale: 0.85, x: 0, y: 0, opacity: 0.9 } : { scale: 1, x: 0, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 40, damping: 20 }}
                className="w-full max-w-4xl rounded-2xl border border-slate-700 overflow-hidden bg-slate-900 z-10"
                style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)", height: "55vh" }}
            >
                {/* Thin header */}
                <div className="bg-slate-800/50 px-4 py-1.5 flex items-center justify-between border-b border-slate-700/50 shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-white">BK-001</span>
                        <span className="text-[9px] text-slate-500">Ahmad Al-Rasheed • Tucson 2024</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        <span className="text-[9px] text-emerald-400">Checked Out</span>
                    </div>
                </div>

                {/* 3-column content */}
                <div className="flex h-[calc(55vh-28px)] overflow-hidden">
                    {/* LEFT */}
                    <motion.div initial={{ opacity: 0 }} animate={buildPhase >= 1 ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="w-[180px] shrink-0 border-r border-slate-800 p-3 overflow-y-auto space-y-2">
                        <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">Timeline</p>
                        {["Created", "Payment", "Picked Up", "Inspection", "Return", "Settlement"].map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={buildPhase >= 1 ? { opacity: 1 } : {}} transition={{ delay: 0.3 + i * 0.1 }} className="flex gap-2">
                                <div className="flex flex-col items-center">
                                    <div className={`w-2 h-2 rounded-full ${i < 4 ? "bg-emerald-500" : i === 4 ? "bg-amber-500" : "bg-slate-700"}`} />
                                    {i < 5 && <div className={`w-px h-3 ${i < 4 ? "bg-emerald-500/30" : "bg-slate-800"}`} />}
                                </div>
                                <p className={`text-[8px] ${i === 4 ? "text-amber-400" : i < 4 ? "text-slate-300" : "text-slate-600"}`}>{s}</p>
                            </motion.div>
                        ))}
                        <motion.div initial={{ opacity: 0 }} animate={buildPhase >= 2 ? { opacity: 1 } : {}} className="border-t border-slate-800 pt-2 mt-2">
                            <p className="text-[8px] text-slate-500 uppercase">Vehicle</p>
                            <p className="text-[9px] font-bold text-white">Tucson 2024</p>
                            <p className="text-[7px] text-slate-500">SUV • JS-45-4821</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={buildPhase >= 3 ? { opacity: 1 } : {}} className="border-t border-slate-800 pt-2">
                            <p className="text-[8px] text-slate-500 uppercase">Mileage</p>
                            <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                <motion.div className="h-full bg-amber-500 rounded-full" initial={{ width: 0 }} animate={buildPhase >= 3 ? { width: "85%" } : {}} transition={{ duration: 0.8 }} />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* CENTER — Map */}
                    <motion.div initial={{ opacity: 0 }} animate={buildPhase >= 2 ? { opacity: 1 } : {}} className="flex-1 flex flex-col">
                        <div className="flex-1 relative">
                            <Suspense fallback={<div className="w-full h-full bg-slate-800 animate-pulse" />}>
                                <FleetMap center={[31.958, 35.940]} zoom={14} pins={MAP_PINS} className="w-full h-full" darkTheme={true} />
                            </Suspense>
                        </div>
                        <div className="flex items-center gap-3 border-t border-slate-800 px-3 py-1.5 bg-slate-900">
                            {[{ v: "97", u: "km/h" }, { v: "NE", u: "" }, { v: "69%", u: "" }, { v: "8,665", u: "km" }].map((t, i) => (
                                <div key={i} className="flex-1 text-center">
                                    <p className="text-sm font-bold text-white leading-none">{t.v}<span className="text-[7px] text-slate-500 ml-0.5">{t.u}</span></p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* RIGHT */}
                    <motion.div initial={{ opacity: 0 }} animate={buildPhase >= 2 ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="w-[180px] shrink-0 border-l border-slate-800 p-3 overflow-y-auto space-y-2">
                        <p className="text-[8px] text-slate-500 uppercase">Customer</p>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-[9px] font-bold">AR</div>
                            <div><p className="text-[9px] font-bold text-white">Ahmad Al-Rasheed</p><p className="text-[7px] text-slate-500">Jordanian</p></div>
                        </div>
                        <motion.div initial={{ opacity: 0 }} animate={buildPhase >= 3 ? { opacity: 1 } : {}} className="border-t border-slate-800 pt-2">
                            <p className="text-[8px] text-slate-500 uppercase">Payment</p>
                            <p className="text-[9px] font-bold text-white mt-1">200,000 JOD</p>
                            <p className="text-[7px] text-emerald-400">Balance: 14,000 JOD</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={buildPhase >= 4 ? { opacity: 1 } : {}} className="border-t border-slate-800 pt-2 space-y-1">
                            {["Process Return", "View Invoice", "Financial Record"].map((a, i) => (
                                <div key={i} className="bg-slate-800/50 rounded px-2 py-1 text-[8px] text-slate-400">{a}</div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* SHOWCASE MODE: 3D cards + descriptions on the right */}
            <AnimatePresence>
                {mode === "showcase" && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        className="absolute right-0 top-0 w-[55%] h-full flex items-center z-20"
                        style={{ perspective: "1000px" }}
                    >
                        {/* 3D card stack */}
                        <div className="w-[45%] h-full flex items-center justify-center relative">
                            {SHOWCASE_COMPONENTS.map((comp, i) => {
                                const isActive = showcaseIndex === i;
                                const isPast = showcaseIndex > i;
                                const stackX = isPast ? -140 - (showcaseIndex - i - 1) * 50 : isActive ? 0 : 80;
                                const stackRotateY = isPast ? 30 + (showcaseIndex - i - 1) * 5 : isActive ? 0 : -10;
                                const stackScale = isPast ? 0.7 - (showcaseIndex - i - 1) * 0.05 : isActive ? 1 : 0.8;
                                const stackOpacity = isPast ? Math.max(0.5 - (showcaseIndex - i - 1) * 0.12, 0) : isActive ? 1 : 0;

                                return (
                                    <motion.div
                                        key={i}
                                        animate={{ x: stackX, rotateY: stackRotateY, scale: Math.max(stackScale, 0.4), opacity: stackOpacity }}
                                        transition={{ type: "spring", stiffness: 60, damping: 20 }}
                                        className="absolute w-[320px] h-[250px] rounded-2xl border overflow-hidden"
                                        style={{ borderColor: isActive ? `${comp.color}40` : "rgb(51,65,85)", backgroundColor: "rgb(15,23,42)", boxShadow: isActive ? `0 20px 50px -10px ${comp.color}20` : "none", transformStyle: "preserve-3d" }}
                                    >
                                        <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: comp.color }} />
                                            <span className="text-[10px] font-semibold text-white">{comp.title}</span>
                                        </div>
                                        <div className="h-[calc(100%-28px)]">{comp.content}</div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Description */}
                        <div className="w-[55%] px-8">
                            <div className="min-h-[100px]">
                                <AnimatePresence mode="wait">
                                    {showcaseIndex >= 0 && (
                                        <motion.div key={showcaseIndex} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SHOWCASE_COMPONENTS[showcaseIndex].color }} />
                                                <h3 className="text-lg font-bold text-white">{SHOWCASE_COMPONENTS[showcaseIndex].title}</h3>
                                            </div>
                                            <p className="text-sm text-slate-400 leading-relaxed">{SHOWCASE_COMPONENTS[showcaseIndex].desc}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="flex gap-1.5 mt-6">
                                {SHOWCASE_COMPONENTS.map((comp, i) => (
                                    <div key={i} className="rounded-full transition-all duration-500" style={{ width: showcaseIndex === i ? 20 : 6, height: 6, backgroundColor: showcaseIndex >= i ? comp.color : "rgb(51,65,85)" }} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
