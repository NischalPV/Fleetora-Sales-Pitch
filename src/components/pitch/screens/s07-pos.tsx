"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────
// HERO CARDS — each gets a center moment with live interaction
// ─────────────────────────────────────────────────────────

interface HeroSlot {
    id: string;
    title: string;
    accent: string;
    bg: { x: number; y: number; rot: number; scale: number };
}

const HERO_SLOTS: HeroSlot[] = [
    { id: "bookings", title: "Booking List", accent: "#3b82f6", bg: { x: 4, y: 8, rot: -6, scale: 0.38 } },
    { id: "stats", title: "Live Metrics", accent: "#10b981", bg: { x: 70, y: 6, rot: 5, scale: 0.38 } },
    { id: "calendar", title: "Booking Calendar", accent: "#8b5cf6", bg: { x: 3, y: 68, rot: 4, scale: 0.38 } },
    { id: "activity", title: "Live Activity", accent: "#f59e0b", bg: { x: 70, y: 70, rot: -5, scale: 0.38 } },
];

// ─────────────────────────────────────────────────────────
// BACKGROUND FEATURE CARDS — flood in after heroes
// ─────────────────────────────────────────────────────────

interface FloodCard { id: number; icon: string; title: string; accent: string; x: number; y: number; rot: number; w: number; }

const FLOOD: FloodCard[] = [
    { id: 1, icon: "⌘K", title: "Walk-in · 90s", accent: "#3b82f6", x: 28, y: 3, rot: 3, w: 190 },
    { id: 2, icon: "◉", title: "License OCR", accent: "#06b6d4", x: 48, y: 4, rot: -3, w: 180 },
    { id: 3, icon: "✓", title: "Pre-inspection", accent: "#10b981", x: 50, y: 22, rot: 3, w: 190 },
    { id: 4, icon: "$", title: "Deposit Hold", accent: "#10b981", x: 29, y: 22, rot: -2, w: 180 },
    { id: 5, icon: "▶", title: "e-Contract", accent: "#8b5cf6", x: 68, y: 24, rot: -4, w: 180 },
    { id: 6, icon: "+", title: "Multi-driver", accent: "#f59e0b", x: 84, y: 22, rot: 3, w: 170 },
    { id: 7, icon: "▲", title: "Corporate Net-30", accent: "#8b5cf6", x: 20, y: 40, rot: 4, w: 200 },
    { id: 8, icon: "⏎", title: "Keyboard-first", accent: "#3b82f6", x: 40, y: 42, rot: -3, w: 190 },
    { id: 9, icon: "↺", title: "Return Compare", accent: "#06b6d4", x: 60, y: 41, rot: 3, w: 200 },
    { id: 10, icon: "=", title: "Auto-Settle", accent: "#10b981", x: 80, y: 42, rot: -3, w: 180 },
    { id: 11, icon: "!", title: "Overdue Alerts", accent: "#ef4444", x: 28, y: 58, rot: -2, w: 200 },
    { id: 12, icon: "◆", title: "Live Inventory", accent: "#3b82f6", x: 48, y: 58, rot: 3, w: 190 },
    { id: 13, icon: "§", title: "Ticket Linking", accent: "#ef4444", x: 68, y: 58, rot: -3, w: 200 },
    { id: 14, icon: "◈", title: "Insurance Picker", accent: "#8b5cf6", x: 26, y: 84, rot: 3, w: 200 },
    { id: 15, icon: "⎈", title: "Branch Switcher", accent: "#06b6d4", x: 46, y: 85, rot: -3, w: 200 },
    { id: 16, icon: "↻", title: "Quick Rebook", accent: "#10b981", x: 66, y: 84, rot: 3, w: 190 },
    { id: 17, icon: "★", title: "AI Vehicle Match", accent: "#8b5cf6", x: 44, y: 74, rot: -4, w: 200 },
    { id: 18, icon: "⛽", title: "Fuel Delta", accent: "#f59e0b", x: 64, y: 74, rot: 3, w: 170 },
];

// ─────────────────────────────────────────────────────────
// HERO CARD INTERIORS
// ─────────────────────────────────────────────────────────

function BookingsInterior({ isActive }: { isActive: boolean }) {
    const [rowCount, setRowCount] = useState(0);
    useEffect(() => {
        if (!isActive) { setRowCount(0); return; }
        const rows = [0, 1, 2, 3, 4];
        const timers = rows.map((i) => setTimeout(() => setRowCount(i + 1), 200 + i * 180));
        return () => timers.forEach(clearTimeout);
    }, [isActive]);

    const bookings = [
        { c: "Ahmad K.", v: "Tucson HSE", d: "5:00 PM", s: "Active", tone: "bg-blue-500/20 text-blue-400" },
        { c: "Sara M.", v: "Accent GL", d: "2:00 PM", s: "Overdue", tone: "bg-red-500/20 text-red-400", pulse: true },
        { c: "Fleet Corp", v: "Elantra ×3", d: "Tomorrow", s: "Corporate", tone: "bg-purple-500/20 text-purple-400" },
        { c: "Omar R.", v: "Sonata", d: "6:30 PM", s: "Checkout", tone: "bg-amber-500/20 text-amber-400" },
        { c: "Layla H.", v: "Creta", d: "Apr 19", s: "Active", tone: "bg-blue-500/20 text-blue-400" },
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-semibold text-white">Bookings · Airport Branch</p>
                    <p className="text-[9px] text-slate-500">Today · 6 active</p>
                </div>
                <div className="flex items-center gap-1.5"><motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} /><span className="text-[9px] text-emerald-400">LIVE</span></div>
            </div>
            <div className="px-5 py-2 grid grid-cols-[1fr_100px_80px_90px] text-[9px] uppercase text-slate-600 tracking-wider">
                <span>Customer</span><span>Vehicle</span><span>Due</span><span className="text-right">Status</span>
            </div>
            <div className="flex-1 px-3 space-y-0.5">
                {bookings.slice(0, rowCount).map((b, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 120, damping: 18 }} className="grid grid-cols-[1fr_100px_80px_90px] items-center px-2 py-2 rounded-md hover:bg-white/5">
                        <span className="text-[11px] font-semibold text-white">{b.c}</span>
                        <span className="text-[10px] text-slate-400">{b.v}</span>
                        <span className="text-[10px] text-slate-400">{b.d}</span>
                        <motion.span className={`text-[9px] font-medium px-2 py-0.5 rounded-full text-right inline-block justify-self-end ${b.tone}`} animate={b.pulse ? { opacity: [1, 0.4, 1] } : {}} transition={b.pulse ? { duration: 1.3, repeat: Infinity } : {}}>{b.s}</motion.span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function StatsInterior({ isActive }: { isActive: boolean }) {
    const [counts, setCounts] = useState([0, 0, 0, 0]);
    const metrics = [
        { label: "Available", target: 12, color: "#10b981", ring: 0.6 },
        { label: "Checkouts", target: 8, color: "#3b82f6", ring: 0.4 },
        { label: "Returns", target: 5, color: "#f59e0b", ring: 0.3 },
        { label: "Overdue", target: 1, color: "#ef4444", ring: 0.08 },
    ];

    useEffect(() => {
        if (!isActive) { setCounts([0, 0, 0, 0]); return; }
        const t = setTimeout(() => {
            const start = Date.now();
            const dur = 1200;
            const tick = setInterval(() => {
                const p = Math.min((Date.now() - start) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                setCounts(metrics.map((m) => Math.round(m.target * eased)));
                if (p >= 1) clearInterval(tick);
            }, 40);
        }, 250);
        return () => clearTimeout(t);
    }, [isActive]);

    return (
        <div className="h-full flex flex-col">
            <div className="px-5 py-3 border-b border-white/5"><p className="text-[11px] font-semibold text-white">Branch Dashboard</p><p className="text-[9px] text-slate-500">Airport · snapshot live</p></div>
            <div className="flex-1 px-5 py-5 grid grid-cols-2 gap-4">
                {metrics.map((m, i) => {
                    const c = 2 * Math.PI * 30;
                    return (
                        <div key={i} className="flex items-center gap-3">
                            <div className="relative w-16 h-16">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 70 70">
                                    <circle cx="35" cy="35" r="30" stroke="rgb(30,41,59)" strokeWidth="4" fill="none" />
                                    <motion.circle cx="35" cy="35" r="30" stroke={m.color} strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: isActive ? c - c * m.ring : c }} transition={{ duration: 1.1, delay: 0.2 + i * 0.1 }} />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center"><span className="text-lg font-bold tabular-nums" style={{ color: m.color }}>{counts[i]}</span></div>
                            </div>
                            <div><p className="text-[9px] uppercase tracking-widest text-slate-500 font-medium">{m.label}</p><p className="text-[10px] text-slate-400">vehicles</p></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function CalendarInterior({ isActive }: { isActive: boolean }) {
    const [bookingsShown, setBookingsShown] = useState(0);
    useEffect(() => {
        if (!isActive) { setBookingsShown(0); return; }
        const items = [0, 1, 2, 3, 4, 5];
        const timers = items.map((i) => setTimeout(() => setBookingsShown(i + 1), 300 + i * 160));
        return () => timers.forEach(clearTimeout);
    }, [isActive]);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const blocks = [
        { row: 0, start: 0, span: 3, label: "Tucson HSE · Ahmad", color: "#3b82f6" },
        { row: 0, start: 4, span: 2, label: "Accent · Sara", color: "#06b6d4" },
        { row: 1, start: 1, span: 4, label: "Elantra · Fleet Corp", color: "#8b5cf6" },
        { row: 1, start: 5, span: 2, label: "Sonata · Omar", color: "#f59e0b" },
        { row: 2, start: 0, span: 2, label: "Creta · Layla", color: "#10b981" },
        { row: 2, start: 3, span: 4, label: "Tucson · Noor", color: "#ec4899" },
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between"><p className="text-[11px] font-semibold text-white">This Week · Bookings</p><p className="text-[9px] text-slate-500">Apr 14–20</p></div>
            <div className="flex-1 px-4 py-4">
                <div className="grid grid-cols-7 gap-1 mb-2">{days.map((d, i) => <span key={i} className="text-[9px] uppercase text-slate-500 text-center font-medium tracking-wider">{d}</span>)}</div>
                <div className="relative space-y-1.5">
                    {[0, 1, 2].map((row) => (
                        <div key={row} className="grid grid-cols-7 gap-1 h-7 relative">
                            {days.map((_, i) => <div key={i} className="bg-slate-800/40 rounded-sm" />)}
                            {blocks.filter((b) => b.row === row).map((b, i) => {
                                const globalIdx = blocks.indexOf(b);
                                const visible = globalIdx < bookingsShown;
                                return (
                                    <motion.div key={i} initial={{ opacity: 0, scaleX: 0 }} animate={visible ? { opacity: 1, scaleX: 1 } : {}} transition={{ type: "spring", stiffness: 90, damping: 18 }} className="absolute h-full rounded-md flex items-center px-2 overflow-hidden origin-left" style={{ left: `calc(${(b.start / 7) * 100}% + ${b.start * 2}px)`, width: `calc(${(b.span / 7) * 100}% - 4px)`, background: `${b.color}35`, border: `1px solid ${b.color}70` }}>
                                        <span className="text-[8px] font-semibold text-white truncate" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>{b.label}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ActivityInterior({ isActive }: { isActive: boolean }) {
    const [count, setCount] = useState(0);
    const events = [
        { t: "now", a: "Walk-in booking", d: "Sara M. · Accent · 3d", c: "#3b82f6", icon: "+" },
        { t: "1m", a: "Vehicle picked up", d: "Ahmad K. · Tucson · B-4821", c: "#10b981", icon: "↑" },
        { t: "4m", a: "Pre-rental inspected", d: "6-point · no damage", c: "#06b6d4", icon: "✓" },
        { t: "7m", a: "Overdue alert sent", d: "Layla H. · SMS + WA", c: "#ef4444", icon: "!" },
        { t: "12m", a: "Settlement complete", d: "Omar R. · 200K JOD", c: "#8b5cf6", icon: "=" },
    ];
    useEffect(() => {
        if (!isActive) { setCount(0); return; }
        const timers = events.map((_, i) => setTimeout(() => setCount(i + 1), 300 + i * 240));
        return () => timers.forEach(clearTimeout);
    }, [isActive]);

    return (
        <div className="h-full flex flex-col">
            <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                <p className="text-[11px] font-semibold text-white">Live Activity</p>
                <div className="flex items-center gap-1.5"><motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} /><span className="text-[9px] text-emerald-400">STREAMING</span></div>
            </div>
            <div className="flex-1 px-4 py-3 space-y-1.5">
                {events.slice(0, count).map((e, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 120, damping: 18 }} className="flex items-center gap-2 px-2.5 py-2 rounded-md border" style={{ background: `${e.c}10`, borderColor: `${e.c}25` }}>
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold" style={{ background: `${e.c}20`, color: e.c, border: `1px solid ${e.c}40` }}>{e.icon}</div>
                        <div className="flex-1 min-w-0"><p className="text-[10px] font-semibold text-white truncate">{e.a}</p><p className="text-[9px] text-slate-400 truncate">{e.d}</p></div>
                        <span className="text-[9px] font-mono tabular-nums" style={{ color: e.c }}>{e.t}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

const INTERIORS = [BookingsInterior, StatsInterior, CalendarInterior, ActivityInterior];

// ─────────────────────────────────────────────────────────
// MAIN SLIDE
// ─────────────────────────────────────────────────────────

export function S07Pos() {
    const [heroIdx, setHeroIdx] = useState(-1); // -1..4 ; 4 = all dismissed
    const [floodCount, setFloodCount] = useState(0);
    const [finalPhase, setFinalPhase] = useState(false); // text + blur
    const [loopKey, setLoopKey] = useState(0);

    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = [];
        const heroDwell = 1800; // time each hero stays center
        const heroGap = 200;    // gap between hero transitions

        HERO_SLOTS.forEach((_, i) => {
            timers.push(setTimeout(() => setHeroIdx(i), 400 + i * (heroDwell + heroGap)));
        });

        const afterHeroes = 400 + HERO_SLOTS.length * (heroDwell + heroGap);
        timers.push(setTimeout(() => setHeroIdx(HERO_SLOTS.length), afterHeroes)); // all dismissed

        // Rapid-fire flood
        FLOOD.forEach((_, i) => {
            const progress = i / FLOOD.length;
            const spacing = 110 - progress * 80; // accelerate
            const cumulative = FLOOD.slice(0, i).reduce((acc, _, j) => acc + (110 - (j / FLOOD.length) * 80), 0);
            timers.push(setTimeout(() => setFloodCount(i + 1), afterHeroes + 200 + cumulative));
        });

        const floodTotal = FLOOD.reduce((acc, _, j) => acc + (110 - (j / FLOOD.length) * 80), 0);
        timers.push(setTimeout(() => setFinalPhase(true), afterHeroes + 400 + floodTotal));
        timers.push(setTimeout(() => {
            setHeroIdx(-1);
            setFloodCount(0);
            setFinalPhase(false);
            setLoopKey((k) => k + 1);
        }, afterHeroes + 400 + floodTotal + 5500));

        return () => timers.forEach(clearTimeout);
    }, [loopKey]);

    return (
        <section className="h-screen w-full relative overflow-hidden bg-slate-950">
            {/* Ambient */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[160px]" style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />

            {/* Card field — blurs at final */}
            <motion.div className="absolute inset-0" animate={{ filter: finalPhase ? "blur(5px) brightness(0.55)" : "blur(0px) brightness(1)" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>

                {/* Hero cards */}
                {HERO_SLOTS.map((slot, i) => {
                    const Interior = INTERIORS[i];
                    const isActive = heroIdx === i;
                    const isDismissed = heroIdx > i;
                    const isPending = heroIdx < i;

                    return (
                        <motion.div
                            key={`${loopKey}-hero-${slot.id}`}
                            initial={{ opacity: 0, scale: 0.3, left: "50%", top: "50%", x: "-260px", y: "-170px", rotate: 0 }}
                            animate={
                                isActive
                                    ? { opacity: 1, scale: 1, left: "50%", top: "50%", x: "-260px", y: "-170px", rotate: 0, zIndex: 30 }
                                    : isDismissed
                                        ? { opacity: 0.85, scale: slot.bg.scale, left: `${slot.bg.x}%`, top: `${slot.bg.y}%`, x: "0px", y: "0px", rotate: slot.bg.rot, zIndex: 5 }
                                        : { opacity: 0, scale: 0.3, left: "50%", top: "50%", x: "-260px", y: "-170px", rotate: 0, zIndex: 1 }
                            }
                            transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.9 }}
                            className="absolute rounded-2xl border overflow-hidden"
                            style={{
                                width: 520,
                                height: 340,
                                background: "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.88))",
                                borderColor: isActive ? `${slot.accent}55` : `${slot.accent}30`,
                                backdropFilter: "blur(12px)",
                                boxShadow: isActive
                                    ? `0 40px 100px -20px rgba(0,0,0,0.7), 0 0 60px -15px ${slot.accent}40, 0 0 0 1px rgba(255,255,255,0.04) inset`
                                    : `0 15px 40px -10px rgba(0,0,0,0.6), 0 0 30px -15px ${slot.accent}25`,
                            }}
                        >
                            <Interior isActive={isActive} />
                        </motion.div>
                    );
                })}

                {/* Flood background cards */}
                {FLOOD.slice(0, floodCount).map((card) => (
                    <motion.div
                        key={`${loopKey}-flood-${card.id}`}
                        initial={{ opacity: 0, scale: 0.2, left: "50%", top: "50%", x: "-50%", y: "-50%", rotate: 0 }}
                        animate={{ opacity: 0.9, scale: 1, left: `${card.x}%`, top: `${card.y}%`, x: "0%", y: "0%", rotate: card.rot }}
                        transition={{ type: "spring", stiffness: 200, damping: 22, mass: 0.7 }}
                        className="absolute rounded-xl border overflow-hidden"
                        style={{
                            width: card.w,
                            background: "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(30,41,59,0.8))",
                            borderColor: `${card.accent}30`,
                            backdropFilter: "blur(10px)",
                            boxShadow: `0 12px 32px -10px rgba(0,0,0,0.55), 0 0 25px -12px ${card.accent}30`,
                        }}
                    >
                        <div className="px-3 py-2 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: `${card.accent}15`, color: card.accent, border: `1px solid ${card.accent}30` }}>{card.icon}</div>
                            <p className="text-[11px] font-semibold text-white truncate">{card.title}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Final text */}
            <AnimatePresence>
                {finalPhase && (
                    <motion.div key={`text-${loopKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none px-8">
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-[11px] font-semibold tracking-[0.4em] uppercase text-blue-400 mb-6">Journey 3 · The Operations Floor</motion.p>
                        <motion.h2 initial={{ opacity: 0, y: 30, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="text-6xl md:text-7xl font-bold text-white tracking-tight text-center leading-[1.05] mb-6" style={{ textShadow: "0 4px 40px rgba(59,130,246,0.3)" }}>
                            The counter runs on<br />
                            <span className="bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">one POS.</span>
                        </motion.h2>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-base md:text-lg text-slate-300 max-w-2xl text-center leading-relaxed mb-8">
                            Bookings, metrics, calendar, live activity — and twenty more capabilities — all in one place.
                            Every step of the branch journey lives on the counter.
                        </motion.p>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex items-center gap-5 text-[11px] uppercase tracking-widest text-slate-400">
                            <span>Walk-in</span><span className="w-1 h-1 rounded-full bg-blue-400" />
                            <span>Inspect</span><span className="w-1 h-1 rounded-full bg-blue-400" />
                            <span>Contract</span><span className="w-1 h-1 rounded-full bg-blue-400" />
                            <span>Hand-off</span><span className="w-1 h-1 rounded-full bg-blue-400" />
                            <span>Return</span><span className="w-1 h-1 rounded-full bg-blue-400" />
                            <span>Settle</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Vignette */}
            <motion.div className="absolute inset-0 pointer-events-none z-20" animate={{ opacity: finalPhase ? 1 : 0 }} transition={{ duration: 0.8 }} style={{ background: "radial-gradient(ellipse at center, transparent 15%, rgba(2,6,23,0.65) 65%, rgba(2,6,23,0.9) 100%)" }} />
        </section>
    );
}
