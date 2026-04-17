"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Static dark map image — no Leaflet, no flash
const MAP_IMAGE = "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/13/4826/3347.png";

// 5 components that peel off and showcase
const COMPONENTS = [
    {
        title: "Live GPS Tracking",
        desc: "Position, speed, fuel — every 30 seconds. Geo-fence alerts on zone exit.",
        color: "#3b82f6",
        // Position in the mockup grid (for peel-off origin)
        mockupOrigin: { x: 0, y: 0 }, // center of mockup
    },
    {
        title: "Booking Timeline",
        desc: "Created → Payment → Pickup → Inspection → Return → Settlement. Fully automated.",
        color: "#10b981",
        mockupOrigin: { x: -200, y: -50 }, // left side
    },
    {
        title: "Drivers & Surcharges",
        desc: "Multi-driver with age-based surcharges, license tracking, expiry warnings.",
        color: "#8b5cf6",
        mockupOrigin: { x: 200, y: -50 }, // right side
    },
    {
        title: "Mileage & Tickets",
        desc: "Daily km tracked. Overages auto-charged. Speed cameras linked to driver.",
        color: "#f59e0b",
        mockupOrigin: { x: -200, y: 50 }, // bottom left
    },
    {
        title: "Payment & Settlement",
        desc: "Every line item auto-calculated. Deposits tracked to the penny.",
        color: "#ef4444",
        mockupOrigin: { x: 200, y: 50 }, // bottom right
    },
];

// Mini content for each 3D card
function CardContent({ index }: { index: number }) {
    if (index === 0) return (
        <div className="h-full relative overflow-hidden">
            <img src={MAP_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <div className="absolute" style={{ left: "55%", top: "40%" }}><div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg" /></div>
            {[{ x: "20%", y: "30%", c: "#22c55e" }, { x: "70%", y: "60%", c: "#f59e0b" }, { x: "40%", y: "70%", c: "#22c55e" }].map((p, i) => (
                <div key={i} className="absolute w-2 h-2 rounded-full" style={{ left: p.x, top: p.y, background: p.c }} />
            ))}
            <div className="absolute bottom-2 right-2 bg-slate-900/90 rounded px-2 py-1 flex gap-2">
                {["97 km/h", "NE", "69%"].map((v, i) => <span key={i} className="text-[8px] text-white font-bold">{v}</span>)}
            </div>
        </div>
    );
    if (index === 1) return (
        <div className="h-full flex flex-col justify-center px-5 py-3">
            {["Booking Created", "Payment Authorized", "Vehicle Picked Up", "Inspection", "Vehicle Return", "Settlement"].map((s, i) => (
                <div key={i} className="flex gap-2 items-center mb-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${i < 4 ? "bg-emerald-500" : i === 4 ? "bg-amber-500" : "bg-slate-700"}`} />
                    <p className={`text-[10px] ${i < 4 ? "text-white" : i === 4 ? "text-amber-400" : "text-slate-600"}`}>{s}</p>
                </div>
            ))}
        </div>
    );
    if (index === 2) return (
        <div className="h-full flex flex-col justify-center px-4 py-2 gap-2">
            {[{ n: "Ahmad", b: "Primary", c: "text-blue-400" }, { n: "Fatima", b: "Under-25", c: "text-amber-400" }, { n: "Hassan", b: "Senior", c: "text-purple-400" }].map((d, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-800/30 rounded-lg p-2">
                    <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[8px] text-slate-400 font-bold">{d.n[0]}</div>
                    <p className="text-[10px] text-white flex-1">{d.n}</p>
                    <span className={`text-[8px] ${d.c}`}>{d.b}</span>
                </div>
            ))}
        </div>
    );
    if (index === 3) return (
        <div className="h-full flex flex-col justify-center px-5 py-3 gap-2">
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full w-[85%] bg-amber-500 rounded-full" /></div>
            <div className="flex gap-0.5">{[315, 180, 265, 275, 190].map((km, i) => (<div key={i} className={`flex-1 h-4 rounded-sm ${km > 300 ? "bg-red-500" : "bg-emerald-500/70"}`} />))}</div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 mt-1">
                <p className="text-[9px] text-white">📸 Speed Camera — 25,000 JOD</p>
                <p className="text-[8px] text-slate-500">Pending</p>
            </div>
        </div>
    );
    return (
        <div className="h-full flex flex-col justify-center px-5 py-3">
            {[{ l: "5d × 35,000", a: "175,000" }, { l: "Insurance", a: "25,000" }, { l: "Tax", a: "14,000" }].map((r, i) => (
                <div key={i} className="flex justify-between text-[10px] py-0.5"><span className="text-slate-500">{r.l}</span><span className="text-white">{r.a}</span></div>
            ))}
            <div className="flex justify-between text-xs font-bold pt-1.5 mt-1 border-t border-slate-700"><span className="text-white">Total</span><span className="text-white">200,000 JOD</span></div>
            <div className="flex justify-between text-[10px] mt-0.5"><span className="text-emerald-400">Balance</span><span className="text-emerald-400 font-bold">14,000 JOD</span></div>
        </div>
    );
}

type Mode = "build" | "peeloff" | "showcase" | "reassemble";

export function S06LivingBooking() {
    const [buildPhase, setBuildPhase] = useState(0);
    const [mode, setMode] = useState<Mode>("build");
    const [showcaseIndex, setShowcaseIndex] = useState(-1);

    useEffect(() => {
        function runCycle(isFirst: boolean) {
            const t: NodeJS.Timeout[] = [];
            let offset = 0;

            if (isFirst) {
                setBuildPhase(0); setMode("build"); setShowcaseIndex(-1);
                t.push(setTimeout(() => setBuildPhase(1), 400));
                t.push(setTimeout(() => setBuildPhase(2), 1000));
                t.push(setTimeout(() => setBuildPhase(3), 1800));
                t.push(setTimeout(() => setBuildPhase(4), 2600));
                offset = 4000;
            } else {
                setMode("build"); setShowcaseIndex(-1); setBuildPhase(4);
                offset = 1500;
            }

            // Peel off — components fly out of mockup
            t.push(setTimeout(() => setMode("peeloff"), offset));

            // Showcase — cycle through components
            t.push(setTimeout(() => setMode("showcase"), offset + 800));
            COMPONENTS.forEach((_, i) => {
                t.push(setTimeout(() => setShowcaseIndex(i), offset + 1200 + i * 2500));
            });

            // Reassemble — components fly back into mockup
            const reassembleAt = offset + 1200 + COMPONENTS.length * 2500 + 1000;
            t.push(setTimeout(() => { setMode("reassemble"); setShowcaseIndex(-1); }, reassembleAt));

            // Back to build
            t.push(setTimeout(() => { setMode("build"); setBuildPhase(4); }, reassembleAt + 1500));

            const cycleDuration = reassembleAt + 2500;
            return { timers: t, duration: cycleDuration };
        }

        const first = runCycle(true);
        let currentTimers = first.timers;

        const loopTimeout = setTimeout(function loop() {
            currentTimers.forEach(clearTimeout);
            const next = runCycle(false);
            currentTimers = next.timers;
            setTimeout(loop, next.duration);
        }, first.duration);

        return () => { currentTimers.forEach(clearTimeout); clearTimeout(loopTimeout); };
    }, []);

    const mockupShrunk = mode === "peeloff" || mode === "showcase";

    return (
        <section className="h-screen w-full relative overflow-hidden bg-slate-950" style={{ perspective: "1200px" }}>
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            {/* Heading */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-6 left-10 z-20">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400">The Counter</p>
                <h2 className="text-lg font-bold text-white mt-0.5">The Living Booking</h2>
            </motion.div>

            {/* MOCKUP — shrinks left during showcase, returns on reassemble */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-full max-w-4xl rounded-2xl border border-slate-700 overflow-hidden bg-slate-900 z-10"
                style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)", height: "55vh", translateY: "-50%" }}
                animate={
                    mockupShrunk
                        ? { x: "-70%", scale: 0.4, opacity: 0.3 }
                        : mode === "reassemble"
                        ? { x: "-50%", scale: 0.85, opacity: 0.8 }
                        : { x: "-50%", scale: 1, opacity: 1 }
                }
                transition={{ type: "spring", stiffness: 40, damping: 18 }}
            >
                {/* Thin header */}
                <div className="bg-slate-800/50 px-4 py-1.5 flex items-center justify-between border-b border-slate-700/50 shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-white">BK-001</span>
                        <span className="text-[9px] text-slate-500">Ahmad Al-Rasheed • Tucson 2024</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] text-emerald-400">Checked Out</span>
                    </div>
                </div>

                <div className="flex h-[calc(55vh-28px)] overflow-hidden">
                    {/* LEFT — Timeline */}
                    <div className="w-[180px] shrink-0 border-r border-slate-800 p-3 space-y-2" style={{ opacity: buildPhase >= 1 ? 1 : 0, transition: "opacity 0.4s" }}>
                        <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">Timeline</p>
                        {["Created", "Payment", "Picked Up", "Inspection", "Return", "Settlement"].map((s, i) => (
                            <div key={i} className="flex gap-2">
                                <div className="flex flex-col items-center">
                                    <div className={`w-2 h-2 rounded-full ${i < 4 ? "bg-emerald-500" : i === 4 ? "bg-amber-500" : "bg-slate-700"}`} />
                                    {i < 5 && <div className={`w-px h-3 ${i < 4 ? "bg-emerald-500/30" : "bg-slate-800"}`} />}
                                </div>
                                <p className={`text-[8px] ${i === 4 ? "text-amber-400" : i < 4 ? "text-slate-300" : "text-slate-600"}`}>{s}</p>
                            </div>
                        ))}
                        <div className="border-t border-slate-800 pt-2 mt-2" style={{ opacity: buildPhase >= 2 ? 1 : 0, transition: "opacity 0.4s" }}>
                            <p className="text-[8px] text-slate-500 uppercase">Vehicle</p>
                            <p className="text-[9px] font-bold text-white">Tucson 2024</p>
                            <p className="text-[7px] text-slate-500">SUV • JS-45-4821</p>
                        </div>
                    </div>

                    {/* CENTER — Static map image (no flash) */}
                    <div className="flex-1 flex flex-col" style={{ opacity: buildPhase >= 2 ? 1 : 0, transition: "opacity 0.5s" }}>
                        <div className="flex-1 relative bg-slate-800">
                            <img src={MAP_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                            {/* Repeat tiles to fill */}
                            <div className="absolute inset-0" style={{ backgroundImage: `url(${MAP_IMAGE})`, backgroundSize: "256px 256px", backgroundRepeat: "repeat", opacity: 0.7 }} />
                            <div className="absolute" style={{ left: "55%", top: "40%" }}>
                                <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg shadow-blue-500/40" />
                            </div>
                            {[{ x: "25%", y: "35%", c: "#22c55e" }, { x: "70%", y: "55%", c: "#22c55e" }, { x: "40%", y: "65%", c: "#f59e0b" }].map((p, i) => (
                                <div key={i} className="absolute w-2.5 h-2.5 rounded-full" style={{ left: p.x, top: p.y, background: p.c, boxShadow: `0 0 4px ${p.c}40` }} />
                            ))}
                        </div>
                        <div className="flex items-center gap-3 border-t border-slate-800 px-3 py-1.5 bg-slate-900">
                            {[{ v: "97", u: "km/h" }, { v: "NE", u: "" }, { v: "69%", u: "" }, { v: "8,665", u: "km" }].map((t, i) => (
                                <div key={i} className="flex-1 text-center">
                                    <p className="text-sm font-bold text-white leading-none">{t.v}<span className="text-[7px] text-slate-500 ml-0.5">{t.u}</span></p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT — Customer + Payment */}
                    <div className="w-[180px] shrink-0 border-l border-slate-800 p-3 space-y-2" style={{ opacity: buildPhase >= 2 ? 1 : 0, transition: "opacity 0.4s" }}>
                        <p className="text-[8px] text-slate-500 uppercase">Customer</p>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-[9px] font-bold">AR</div>
                            <div><p className="text-[9px] font-bold text-white">Ahmad Al-Rasheed</p><p className="text-[7px] text-slate-500">Jordanian</p></div>
                        </div>
                        <div className="border-t border-slate-800 pt-2" style={{ opacity: buildPhase >= 3 ? 1 : 0, transition: "opacity 0.4s" }}>
                            <p className="text-[8px] text-slate-500 uppercase">Payment</p>
                            <p className="text-[9px] font-bold text-white mt-1">200,000 JOD</p>
                            <p className="text-[7px] text-emerald-400">Balance: 14,000 JOD</p>
                        </div>
                        <div className="border-t border-slate-800 pt-2 space-y-1" style={{ opacity: buildPhase >= 4 ? 1 : 0, transition: "opacity 0.4s" }}>
                            {["Process Return", "View Invoice", "Financial Record"].map((a, i) => (
                                <div key={i} className="bg-slate-800/50 rounded px-2 py-1 text-[8px] text-slate-400">{a}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* PEEL-OFF CARDS — fly from mockup center to 3D positions */}
            {(mode === "peeloff" || mode === "showcase") && (
                <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[50%] h-[70%] z-20" style={{ perspective: "1000px" }}>
                    {/* 3D card stack */}
                    <div className="relative w-[45%] h-full float-left flex items-center justify-center">
                        {COMPONENTS.map((comp, i) => {
                            const isActive = showcaseIndex === i;
                            const isPast = showcaseIndex > i;
                            const isFuture = showcaseIndex < i;

                            // Cards fly in from the left (mockup direction) on peeloff
                            const enterX = mode === "peeloff" && showcaseIndex < 0 ? comp.mockupOrigin.x - 300 : 0;

                            const stackX = isPast ? -120 - (showcaseIndex - i - 1) * 40 : isActive ? 0 : isFuture && showcaseIndex >= 0 ? 60 : enterX;
                            const stackRotateY = isPast ? 30 + (showcaseIndex - i - 1) * 4 : isActive ? 0 : -8;
                            const stackScale = isPast ? 0.7 - (showcaseIndex - i - 1) * 0.04 : isActive ? 1 : 0.85;
                            const stackOpacity = isPast ? Math.max(0.5 - (showcaseIndex - i - 1) * 0.1, 0) : isActive ? 1 : isFuture && showcaseIndex >= 0 ? 0.3 : 0.6;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ x: comp.mockupOrigin.x - 400, y: comp.mockupOrigin.y, scale: 0.3, opacity: 0, rotateY: 0 }}
                                    animate={{ x: stackX, y: 0, rotateY: stackRotateY, scale: Math.max(stackScale, 0.4), opacity: stackOpacity }}
                                    transition={{ type: "spring", stiffness: 50, damping: 18, delay: mode === "peeloff" && showcaseIndex < 0 ? i * 0.12 : 0 }}
                                    className="absolute w-[340px] h-[260px] rounded-2xl border overflow-hidden"
                                    style={{ borderColor: isActive ? `${comp.color}50` : "rgb(51,65,85)", backgroundColor: "rgb(15,23,42)", boxShadow: isActive ? `0 20px 50px -10px ${comp.color}25` : "none", transformStyle: "preserve-3d" }}
                                >
                                    <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: comp.color }} />
                                        <span className="text-[11px] font-semibold text-white">{comp.title}</span>
                                    </div>
                                    <div className="h-[calc(100%-30px)]"><CardContent index={i} /></div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Description */}
                    <div className="w-[55%] float-right flex flex-col justify-center h-full px-6">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 mb-3">Inside Every Booking</p>
                        <h3 className="text-2xl font-bold text-white tracking-tight mb-6">Built for the messy reality.</h3>
                        <div className="min-h-[80px]">
                            <AnimatePresence mode="wait">
                                {showcaseIndex >= 0 && (
                                    <motion.div key={showcaseIndex} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COMPONENTS[showcaseIndex].color }} />
                                            <span className="text-base font-bold text-white">{COMPONENTS[showcaseIndex].title}</span>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed">{COMPONENTS[showcaseIndex].desc}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="flex gap-1.5 mt-6">
                            {COMPONENTS.map((comp, i) => (
                                <div key={i} className="rounded-full transition-all duration-500" style={{ width: showcaseIndex === i ? 20 : 6, height: 6, backgroundColor: showcaseIndex >= i ? comp.color : "rgb(51,65,85)" }} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* REASSEMBLE — cards fly back to mockup (reverse peel) */}
            {mode === "reassemble" && (
                <div className="absolute inset-0 z-20 pointer-events-none" style={{ perspective: "1000px" }}>
                    {COMPONENTS.map((comp, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: "40vw", y: 0, scale: 0.8, opacity: 0.7, rotateY: 20 }}
                            animate={{ x: 0, y: 0, scale: 0.2, opacity: 0, rotateY: 0 }}
                            transition={{ type: "spring", stiffness: 40, damping: 18, delay: i * 0.1 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[220px] rounded-2xl border overflow-hidden"
                            style={{ borderColor: `${comp.color}30`, backgroundColor: "rgb(15,23,42)", transformStyle: "preserve-3d" }}
                        >
                            <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: comp.color }} />
                                <span className="text-[10px] text-white">{comp.title}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
}
