"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────
// S10 — The Morning Brief
// Capstone of the Operations Floor journey.
// 7:03 AM. The franchise head walks in. Brain worked overnight.
// This slide IS the morning briefing — not a dashboard.
// ─────────────────────────────────────────────────────────

// Safe frame inset — keeps content clear of deck chrome:
//   top:    progress bar (2px) + nav arrows (center y, but 40px tall),
//           reserve ~60px for eyebrow row.
//   bottom: pagination dots + page indicator at bottom-6 (24px from edge).
//           reserve ~80px so the footer pill never collides.
//   sides:  arrows at left-6 / right-6 (24px + 40px wide = 64px).
//           reserve ~100px on each side at ultrawide.

interface NightAction {
    time: string;
    tMs: number;
    kind: "rebalance" | "approve" | "flag" | "rebook" | "price" | "forecast";
    title: string;
    detail: string;
    impact: string;
    tone: string;
}

// OVERNIGHT LOG — autonomous actions Brain already EXECUTED while the exec slept.
// No overlap with TODAY_BRIEF — those are new decisions awaiting the human.
const NIGHT_LOG: NightAction[] = [
    { time: "00:14", tMs: 14,  kind: "forecast",  title: "Weekend demand model retrained", detail: "47 new signals ingested · 12 branches",    impact: "model v2.41 live",   tone: "#a855f7" },
    { time: "01:28", tMs: 88,  kind: "approve",   title: "Corporate net-30 approved",       detail: "Fleet Corp · 4 Elantras · Wed pickup",    impact: "+2,430 JOD pipe",     tone: "#8b5cf6" },
    { time: "02:36", tMs: 156, kind: "rebalance", title: "Cross-branch rebalance",          detail: "2 SUVs moved Beach → Airport",            impact: "+840 JOD/day",        tone: "#06b6d4" },
    { time: "04:10", tMs: 250, kind: "price",     title: "Weekend rate card published",     detail: "Aqaba +12% · Irbid −5% · auto-applied",   impact: "23 bookings adjusted", tone: "#f59e0b" },
    { time: "05:02", tMs: 302, kind: "rebook",    title: "Overnight returns redeployed",    detail: "Creta 12-9988 · inspected + staged",      impact: "ready by 07:30",      tone: "#10b981" },
    { time: "06:22", tMs: 382, kind: "rebook",    title: "Auto-rebook executed",            detail: "3 drop-offs → same-day pickups",          impact: "+980 JOD saved",      tone: "#10b981" },
    { time: "06:49", tMs: 409, kind: "approve",   title: "Walk-in pre-qualified",           detail: "Sara M. · docs OCR'd · standing by",      impact: "90s at counter",      tone: "#3b82f6" },
];

// TODAY BRIEF — decisions that NEED the exec's call. These did NOT happen overnight.
const TODAY_BRIEF = [
    {
        tag: "TOP PRIORITY",
        tone: "#ef4444",
        title: "Tucson B-4821 · schedule service",
        sub: "Engine signature drifting · approve garage slot this week",
        stat1: { l: "Saved if on-time", v: "2,300 JOD" },
        stat2: { l: "Confidence", v: "94%" },
    },
    {
        tag: "REVENUE",
        tone: "#f59e0b",
        title: "Friday concert overflow",
        sub: "Forecast +47% demand · approve 8 temp bookings from reserves",
        stat1: { l: "Est. gain", v: "+4,200 JOD" },
        stat2: { l: "Confidence", v: "91%" },
    },
    {
        tag: "POLICY",
        tone: "#06b6d4",
        title: "Age-21 repeat customers",
        sub: "3 drivers now qualify for loyalty insurance tier — your call",
        stat1: { l: "Affected", v: "3 clients" },
        stat2: { l: "Risk delta", v: "−38%" },
    },
];

function useClock(activate: boolean) {
    const [sec, setSec] = useState(12);
    useEffect(() => {
        if (!activate) return;
        const id = setInterval(() => setSec((s) => (s + 1) % 60), 1000);
        return () => clearInterval(id);
    }, [activate]);
    return sec;
}

function useCountUp(target: number, start: boolean, duration = 1400) {
    const [v, setV] = useState(0);
    useEffect(() => {
        if (!start) return;
        const t0 = performance.now();
        let raf = 0;
        const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setV(Math.round(target * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, start, duration]);
    return v;
}

function KindGlyph({ kind, color }: { kind: NightAction["kind"]; color: string }) {
    const paths: Record<NightAction["kind"], React.ReactNode> = {
        rebalance: (<path d="M3 8h10M10 5l3 3-3 3M13 14H3M6 11l-3 3 3 3" />),
        approve:   (<path d="M3 8l4 4 8-8" />),
        flag:      (<><path d="M4 3v13" /><path d="M4 3h9l-2 3 2 3H4" /></>),
        rebook:    (<><path d="M13 4a5 5 0 1 0-1 8" /><path d="M13 1v4h-4" /></>),
        price:     (<><path d="M9 3v13" /><path d="M13 6H7.5a2 2 0 0 0 0 4h3a2 2 0 0 1 0 4H5" /></>),
        forecast:  (<path d="M2 12l4-5 3 3 5-6" />),
    };
    return (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {paths[kind]}
        </svg>
    );
}

export function S10HqCockpit() {
    const [phase, setPhase] = useState(0);
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 800),
            setTimeout(() => setPhase(3), 1500),
            setTimeout(() => setPhase(4), 3200),
            setTimeout(() => setPhase(5), 4200),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    useEffect(() => {
        if (phase < 3) return;
        const timers = NIGHT_LOG.map((_, i) =>
            setTimeout(() => setVisibleCount(i + 1), 260 * i + 200)
        );
        return () => timers.forEach(clearTimeout);
    }, [phase]);

    const clockSec = useClock(phase >= 1);
    const clockStr = `07:03:${String(clockSec).padStart(2, "0")}`;

    const overnightPnl = useCountUp(14_840, phase >= 3, 1600);
    const actionCount = visibleCount;
    const influenced = useCountUp(visibleCount > 0 ? 12_410 : 0, visibleCount > 0, 900);

    return (
        <section className="h-full w-full relative overflow-hidden bg-slate-950">
            {/* ── Ambient layers (full-bleed, behind everything) ── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 45% at 50% 108%, rgba(139,92,246,0.18) 0%, rgba(59,130,246,0.08) 32%, transparent 68%)",
                }}
            />
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }}
            />
            {/* horizon line — sits inside the safe band, not at viewport edge */}
            <motion.div
                initial={{ opacity: 0, scaleX: 0.3 }}
                animate={phase >= 1 ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="absolute left-0 right-0 h-px"
                style={{
                    bottom: 90,
                    background:
                        "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.35) 30%, rgba(59,130,246,0.5) 50%, rgba(139,92,246,0.35) 70%, transparent 100%)",
                }}
            />

            {/* ═════════════════════════════════════════════════════ */}
            {/* SAFE FRAME — inset from deck chrome on all sides        */}
            {/* top:    48px  (clear of 2px progress bar + breathing)   */}
            {/* bottom: 96px  (clear of pagination dots + indicator)    */}
            {/* sides:  88px  (clear of prev/next arrows at left/right-6)*/}
            {/* ═════════════════════════════════════════════════════ */}
            <div className="absolute inset-0 z-10 flex flex-col" style={{ paddingTop: 48, paddingBottom: 96, paddingLeft: 88, paddingRight: 88 }}>

                {/* ── Row 1: eyebrow ── */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0 text-center"
                >
                    <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-blue-400">The Operations Floor</p>
                    <p className="text-[9px] text-slate-500 mt-1 tracking-wider">The Morning Brief · chapter three of three</p>
                </motion.div>

                {/* ── Row 2: main hero + two-column grid (center-grow) ── */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-0">

                    {/* Clock + date */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex items-center gap-4 mb-5"
                    >
                        <div className="flex items-center gap-2">
                            <motion.span
                                className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.6, repeat: Infinity }}
                            />
                            <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-semibold">Live</span>
                        </div>
                        <span className="text-slate-600">·</span>
                        <span className="text-[11px] text-slate-400 tabular-nums tracking-wider">{clockStr}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-[11px] text-slate-400 tracking-wider">Monday, April 19</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] text-center"
                    >
                        Good morning, <span className="bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">Khalil</span>.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={phase >= 3 ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-sm md:text-base text-slate-400 mt-3 mb-8 text-center max-w-2xl"
                    >
                        Your network made{" "}
                        <span className="text-white font-bold tabular-nums">
                            {overnightPnl.toLocaleString()} JOD
                        </span>{" "}
                        overnight. Brain handled{" "}
                        <span className="text-white font-bold tabular-nums">{actionCount}</span>{" "}
                        {actionCount === 1 ? "action" : "actions"} while you slept.
                    </motion.p>

                    {/* Two-column content */}
                    <div className="w-full max-w-[1100px] grid grid-cols-[1.2fr_1fr] gap-5">

                        {/* While you slept */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={phase >= 3 ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5 }}
                            className="relative rounded-2xl border border-white/10 overflow-hidden"
                            style={{
                                background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.55))",
                                backdropFilter: "blur(14px)",
                                boxShadow: "0 24px 60px -20px rgba(0,0,0,0.6)",
                            }}
                        >
                            <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        className="w-1 h-1 rounded-full bg-purple-400"
                                        animate={{ opacity: [1, 0.3, 1] }}
                                        transition={{ duration: 1.4, repeat: Infinity }}
                                    />
                                    <span className="text-[9px] uppercase tracking-[0.3em] text-purple-400 font-semibold">While You Slept · Done</span>
                                </div>
                                <span className="text-[9px] text-slate-500 tabular-nums">00:00 → 07:03</span>
                            </div>

                            {/* 7-hour timeline */}
                            <div className="relative h-1 bg-white/5">
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={phase >= 3 ? { scaleX: 1 } : {}}
                                    transition={{ duration: 2.2, ease: "easeOut" }}
                                    className="absolute inset-y-0 left-0 right-0 origin-left"
                                    style={{
                                        background: "linear-gradient(90deg, rgba(168,85,247,0.1), rgba(59,130,246,0.6), rgba(16,185,129,0.5))",
                                    }}
                                />
                                {NIGHT_LOG.map((a, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={visibleCount > i ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                                        className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                                        style={{
                                            left: `${(a.tMs / 423) * 100}%`,
                                            background: a.tone,
                                            boxShadow: `0 0 8px ${a.tone}`,
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="px-5 py-3">
                                <div className="space-y-0">
                                    <AnimatePresence initial={false}>
                                        {NIGHT_LOG.slice(0, visibleCount).map((a, i) => (
                                            <motion.div
                                                key={i}
                                                layout
                                                initial={{ opacity: 0, x: -12, height: 0 }}
                                                animate={{ opacity: 1, x: 0, height: "auto" }}
                                                transition={{ duration: 0.35, ease: "easeOut" }}
                                                className="flex items-start gap-3 py-1.5 border-b border-white/[0.03] last:border-b-0"
                                            >
                                                <span className="text-[10px] text-slate-500 font-mono tabular-nums mt-0.5 w-10 flex-shrink-0">{a.time}</span>
                                                <div
                                                    className="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                                                    style={{ background: `${a.tone}15`, border: `1px solid ${a.tone}40` }}
                                                >
                                                    <KindGlyph kind={a.kind} color={a.tone} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline justify-between gap-2">
                                                        <p className="text-[12px] font-semibold text-white leading-tight truncate">{a.title}</p>
                                                        <span
                                                            className="text-[10px] font-semibold tabular-nums flex-shrink-0"
                                                            style={{ color: a.tone }}
                                                        >
                                                            {a.impact}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10.5px] text-slate-500 leading-tight mt-0.5 truncate">{a.detail}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        {/* Today's brief */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={phase >= 4 ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col gap-2.5"
                        >
                            <div className="flex items-center justify-between pl-1 pr-1 mb-0.5">
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        className="w-1 h-1 rounded-full bg-cyan-400"
                                        animate={{ opacity: [1, 0.3, 1] }}
                                        transition={{ duration: 1.4, repeat: Infinity }}
                                    />
                                    <span className="text-[9px] uppercase tracking-[0.3em] text-cyan-400 font-semibold">Today · Waiting On You</span>
                                </div>
                                <span className="text-[9px] text-slate-500">ranked by impact</span>
                            </div>

                            {TODAY_BRIEF.map((b, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.4, delay: 0.15 + i * 0.18 }}
                                    className="relative rounded-xl border overflow-hidden p-3.5"
                                    style={{
                                        background: `linear-gradient(135deg, ${b.tone}14, rgba(15,23,42,0.6))`,
                                        borderColor: `${b.tone}30`,
                                        backdropFilter: "blur(10px)",
                                    }}
                                >
                                    <div
                                        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
                                        style={{ background: b.tone, boxShadow: `0 0 12px ${b.tone}` }}
                                    />
                                    <div className="pl-3">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="text-[9px] font-bold uppercase tracking-[0.2em]"
                                                style={{ color: b.tone }}
                                            >
                                                {b.tag}
                                            </span>
                                            <span className="text-[9px] text-slate-500 tabular-nums">#{i + 1}</span>
                                        </div>
                                        <p className="text-[14px] font-semibold text-white leading-tight mt-1.5">{b.title}</p>
                                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">{b.sub}</p>
                                        <div className="flex items-center gap-5 mt-2.5 pt-2 border-t border-white/5">
                                            <div>
                                                <p className="text-[8.5px] uppercase tracking-wider text-slate-500">{b.stat1.l}</p>
                                                <p className="text-[13px] font-bold text-white tabular-nums leading-tight">{b.stat1.v}</p>
                                            </div>
                                            <div className="h-6 w-px bg-white/5" />
                                            <div>
                                                <p className="text-[8.5px] uppercase tracking-wider text-slate-500">{b.stat2.l}</p>
                                                <p className="text-[13px] font-bold text-white tabular-nums leading-tight">{b.stat2.v}</p>
                                            </div>
                                            <div className="flex-1" />
                                            <motion.div
                                                whileHover={{ x: 2 }}
                                                className="flex items-center gap-1 text-[10px] font-semibold"
                                                style={{ color: b.tone }}
                                            >
                                                Act
                                                <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* ── Row 3: autonomy summary pill — centered, NOT a full-width tape ── */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="flex-shrink-0 flex justify-center mt-5"
                >
                    <div
                        className="flex items-center gap-6 px-6 py-2.5 rounded-full border border-white/10"
                        style={{
                            background: "linear-gradient(135deg, rgba(15,23,42,0.75), rgba(15,23,42,0.45))",
                            backdropFilter: "blur(14px)",
                            boxShadow: "0 12px 40px -12px rgba(0,0,0,0.6)",
                        }}
                    >
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-white tabular-nums">{NIGHT_LOG.length}</span>
                            <span className="text-[9px] uppercase tracking-widest text-slate-500">actions</span>
                        </div>
                        <div className="h-3 w-px bg-white/10" />
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-white tabular-nums">{influenced.toLocaleString()}</span>
                            <span className="text-[9px] uppercase tracking-widest text-slate-500">JOD influenced</span>
                        </div>
                        <div className="h-3 w-px bg-white/10" />
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-emerald-400 tabular-nums">0</span>
                            <span className="text-[9px] uppercase tracking-widest text-slate-500">interventions</span>
                        </div>
                        <div className="h-3 w-px bg-white/10" />
                        <span className="text-[11px] text-slate-300 italic">Your day starts where Brain left off.</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
