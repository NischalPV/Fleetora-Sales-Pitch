"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────
// S13 — The Intelligence · Chapter III
// "The Week Ribbon"
//
// A simple horizontal weekly briefing — seven day-columns, each
// showing that day's notable predictions and the status of
// Brain's preparation (pre-staged / monitoring).
// Scannable in 3 seconds. Salesperson walks through day-by-day.
// ─────────────────────────────────────────────────────────

type PrepStatus = "pre-staged" | "monitoring" | "forecasting";

interface Prediction {
    time: string;            // "17:00"
    branch: string;          // "Dead Sea"
    label: string;           // "Concert egress"
    magnitude: number;       // 0–100 predicted peak load
    status: PrepStatus;
    action?: string;         // short pre-staging note, optional
    impact?: string;         // e.g. "+8,400 JOD"
}

interface Day {
    short: string;           // "Mon"
    date: string;            // "Apr 19"
    tone: "quiet" | "steady" | "busy" | "peak";  // overall day read
    summary: string;         // one-line day-level description
    predictions: Prediction[];
    headline?: boolean;      // if true, this day is visually emphasized
}

const WEEK: Day[] = [
    {
        short: "Mon", date: "Apr 19", tone: "steady",
        summary: "Typical Monday · local commute peaks",
        predictions: [
            { time: "08:00", branch: "Airport",  label: "Commute peak",     magnitude: 72, status: "monitoring" },
            { time: "17:30", branch: "Downtown", label: "Evening pickup",   magnitude: 68, status: "monitoring" },
        ],
    },
    {
        short: "Tue", date: "Apr 20", tone: "busy",
        summary: "Corporate commute wave · Downtown peaks",
        predictions: [
            { time: "08:00", branch: "Downtown", label: "Corporate commute", magnitude: 91, status: "pre-staged",
              action: "14 net-30 holds pre-approved · 6 cars staged",
              impact: "+2,430 JOD pipeline" },
            { time: "17:00", branch: "Airport",  label: "Return wave",       magnitude: 85, status: "monitoring" },
        ],
    },
    {
        short: "Wed", date: "Apr 21", tone: "steady",
        summary: "Midweek baseline · no anomalies",
        predictions: [
            { time: "09:00", branch: "Airport",  label: "Business travel",  magnitude: 78, status: "monitoring" },
            { time: "14:00", branch: "Mall",     label: "Midday retail",    magnitude: 70, status: "forecasting" },
        ],
    },
    {
        short: "Thu", date: "Apr 22", tone: "steady",
        summary: "Quiet day · Brain monitoring only",
        predictions: [
            { time: "08:00", branch: "Downtown", label: "Commute baseline", magnitude: 72, status: "monitoring" },
        ],
    },
    {
        short: "Fri", date: "Apr 23", tone: "peak",
        summary: "The headline day · concert evening drives record load",
        headline: true,
        predictions: [
            { time: "12:00", branch: "Airport",  label: "Friday departures", magnitude: 94, status: "pre-staged",
              action: "Fleet rotation Irbid → Airport · premium +10%",
              impact: "+3,180 JOD captured" },
            { time: "17:00", branch: "Dead Sea", label: "Concert · 22K attendees", magnitude: 98, status: "pre-staged",
              action: "18 cars pre-staged · weekend rate +15% locked · 47 walk-ins pre-qualified",
              impact: "+8,400 JOD captured" },
        ],
    },
    {
        short: "Sat", date: "Apr 24", tone: "busy",
        summary: "Weekend retail + coastal demand",
        predictions: [
            { time: "14:00", branch: "Mall",     label: "Weekend surge",     magnitude: 94, status: "pre-staged",
              action: "9 cars rotated from Irbid · pricing +8%",
              impact: "+1,650 JOD uplift" },
            { time: "10:30", branch: "Aqaba",    label: "Coastal demand",    magnitude: 86, status: "monitoring" },
        ],
    },
    {
        short: "Sun", date: "Apr 25", tone: "steady",
        summary: "Return wave · week closes at 89% utilization",
        predictions: [
            { time: "21:00", branch: "Airport",  label: "Return surge",      magnitude: 82, status: "monitoring" },
        ],
    },
];

function dayToneStyle(tone: Day["tone"]) {
    switch (tone) {
        case "peak":   return { core: "#f87171", fill: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.45)", label: "Peak"   };
        case "busy":   return { core: "#fbbf24", fill: "rgba(251,191,36,0.10)",  border: "rgba(251,191,36,0.35)",  label: "Busy"   };
        case "steady": return { core: "#a78bfa", fill: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.28)", label: "Steady" };
        case "quiet":  return { core: "#60a5fa", fill: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.28)",  label: "Quiet"  };
    }
}

function predictionTone(magnitude: number) {
    if (magnitude < 75) return { core: "#a78bfa", label: "steady" };
    if (magnitude < 90) return { core: "#fbbf24", label: "busy"   };
    return                 { core: "#f87171", label: "peak"   };
}

function statusChip(status: PrepStatus) {
    switch (status) {
        case "pre-staged":  return { color: "#34d399", text: "Pre-staged" };
        case "monitoring":  return { color: "#60a5fa", text: "Monitoring" };
        case "forecasting": return { color: "#a78bfa", text: "Forecasting" };
    }
}

export function S13Predict() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 900),
            setTimeout(() => setPhase(3), 1500),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    // Count totals for the summary strip
    const totalPreStaged = WEEK.flatMap(d => d.predictions).filter(p => p.status === "pre-staged").length;
    const totalImpact = WEEK.flatMap(d => d.predictions)
        .map(p => Number((p.impact || "0").replace(/[^0-9]/g, "")))
        .reduce((a, b) => a + b, 0);

    return (
        <section className="h-full w-full relative overflow-hidden" style={{ backgroundColor: "#0a1020" }}>
            {/* Ambient */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 85% 50% at 50% 0%, rgba(167,139,250,0.07) 0%, rgba(30,41,59,0.25) 45%, transparent 75%)" }}
            />

            <div className="absolute inset-0 z-10 flex flex-col" style={{ paddingTop: 48, paddingBottom: 96, paddingLeft: 160, paddingRight: 96 }}>

                {/* Publication header */}
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-slate-400">Fleetora · Intelligence</span>
                        <span className="text-slate-700">/</span>
                        <span className="text-[10px] tracking-wider text-slate-500">Chapter III — The Week Ribbon</span>
                    </div>
                    <span className="text-[10px] tracking-wider text-slate-500 tabular-nums">03 / 04</span>
                </motion.div>

                {/* Headline + sales definition */}
                <div className="flex-shrink-0 mt-4 mb-5 grid grid-cols-[1fr_auto] gap-8 items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="max-w-2xl"
                    >
                        <h1 className="text-[32px] md:text-[38px] font-semibold text-white tracking-[-0.02em] leading-[1.08]">
                            Your week, already briefed.
                            <span className="text-slate-500"> Brain reads it seven days ahead.</span>
                        </h1>
                        <p className="text-[13px] text-slate-400 mt-3 max-w-xl leading-relaxed">
                            A day-by-day briefing of what Brain expects this week — and what it has already prepared for. No dashboards to check, no spreadsheets to review.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-[360px] rounded-lg border px-4 py-3.5 self-start"
                        style={{ background: "rgba(15,22,38,0.55)", borderColor: "rgba(167,139,250,0.25)" }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[8.5px] uppercase tracking-[0.3em] text-purple-400 font-bold">How to read this</span>
                        </div>
                        <p className="text-[12px] text-slate-100 leading-[1.55] font-medium">
                            Each column is <span className="text-white font-semibold">one day</span>. Each chip is a <span className="text-white font-semibold">prediction</span>. Green means Brain has <span className="text-emerald-400">already staged</span> for it. Blue means <span className="text-blue-400">monitoring</span>.
                        </p>
                    </motion.div>
                </div>

                {/* ── THE RIBBON ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={phase >= 3 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex-1 min-h-0 grid grid-cols-7 gap-3"
                >
                    {WEEK.map((day, dayIdx) => {
                        const style = dayToneStyle(day.tone);
                        return (
                            <motion.div
                                key={day.short}
                                initial={{ opacity: 0, y: 12 }}
                                animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.45, delay: dayIdx * 0.08 }}
                                className="relative rounded-lg border flex flex-col overflow-hidden"
                                style={{
                                    background: day.headline
                                        ? `linear-gradient(180deg, ${style.fill} 0%, rgba(15,22,38,0.55) 65%)`
                                        : "rgba(15,22,38,0.55)",
                                    borderColor: day.headline ? style.border : "rgba(148,163,184,0.12)",
                                    boxShadow: day.headline ? `0 0 0 1px ${style.core}35, 0 0 28px ${style.core}22` : "none",
                                }}
                            >
                                {/* Day header */}
                                <div className="px-3.5 pt-3 pb-2 border-b flex items-center justify-between" style={{ borderColor: "rgba(148,163,184,0.08)" }}>
                                    <div>
                                        <p className="text-[13px] font-semibold text-white tracking-tight leading-none">{day.short}</p>
                                        <p className="text-[9px] text-slate-500 tabular-nums mt-1">{day.date}</p>
                                    </div>
                                    <span
                                        className="text-[8.5px] uppercase tracking-[0.18em] font-bold px-1.5 py-0.5 rounded"
                                        style={{ color: style.core, background: `${style.core}14`, border: `1px solid ${style.core}40` }}
                                    >
                                        {style.label}
                                    </span>
                                </div>

                                {/* Day summary */}
                                <div className="px-3.5 py-2">
                                    <p className="text-[10.5px] text-slate-400 leading-snug italic" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                                        {day.summary}
                                    </p>
                                </div>

                                {/* Predictions list */}
                                <div className="flex-1 min-h-0 px-3.5 pb-3 space-y-2">
                                    {day.predictions.map((p, pi) => {
                                        const pTone = predictionTone(p.magnitude);
                                        const chip = statusChip(p.status);
                                        return (
                                            <motion.div
                                                key={pi}
                                                initial={{ opacity: 0, x: -4 }}
                                                animate={phase >= 3 ? { opacity: 1, x: 0 } : {}}
                                                transition={{ duration: 0.35, delay: 0.3 + dayIdx * 0.08 + pi * 0.08 }}
                                                className="rounded border px-2.5 py-2"
                                                style={{
                                                    background: "rgba(10,16,32,0.55)",
                                                    borderColor: "rgba(148,163,184,0.1)",
                                                }}
                                            >
                                                {/* Top row: time · branch · mag % */}
                                                <div className="flex items-baseline justify-between mb-1">
                                                    <span className="text-[10px] text-slate-500 font-mono tabular-nums">{p.time}</span>
                                                    <span className="text-[10.5px] font-semibold tabular-nums" style={{ color: pTone.core }}>
                                                        {p.magnitude}%
                                                    </span>
                                                </div>
                                                {/* Label row */}
                                                <p className="text-[11.5px] text-slate-100 font-medium leading-tight">{p.label}</p>
                                                <p className="text-[10px] text-slate-500 mt-0.5">{p.branch}</p>

                                                {/* Status chip */}
                                                <div className="flex items-center gap-1.5 mt-2">
                                                    <motion.span
                                                        className="w-1 h-1 rounded-full"
                                                        style={{ backgroundColor: chip.color }}
                                                        animate={p.status === "monitoring" || p.status === "forecasting" ? { opacity: [1, 0.3, 1] } : {}}
                                                        transition={{ duration: 1.4, repeat: Infinity }}
                                                    />
                                                    <span className="text-[8.5px] uppercase tracking-[0.18em] font-semibold" style={{ color: chip.color }}>
                                                        {chip.text}
                                                    </span>
                                                </div>

                                                {/* Pre-staging action + impact — only for pre-staged items */}
                                                {p.status === "pre-staged" && p.action && (
                                                    <>
                                                        <p className="text-[10px] text-slate-300 mt-2 leading-snug">{p.action}</p>
                                                        {p.impact && (
                                                            <div className="mt-1.5 pt-1.5 border-t flex items-baseline justify-between" style={{ borderColor: "rgba(52,211,153,0.18)" }}>
                                                                <span className="text-[8.5px] uppercase tracking-wider text-slate-500">Value</span>
                                                                <span className="text-[10.5px] font-semibold tabular-nums text-emerald-400">{p.impact}</span>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Footer summary strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={phase >= 3 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex-shrink-0 mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-slate-500 font-medium"
                >
                    <div className="flex items-center gap-4">
                        <span className="tabular-nums">
                            <span className="text-emerald-400 font-semibold">{totalPreStaged}</span> events pre-staged
                        </span>
                        <span>·</span>
                        <span className="tabular-nums">
                            <span className="text-white font-semibold">+{totalImpact.toLocaleString()}</span>
                            <span className="text-slate-500 ml-1">JOD value locked this week</span>
                        </span>
                    </div>
                    <span>Forecast refreshed every 4 hours · 47 signals / sec</span>
                </motion.div>
            </div>
        </section>
    );
}
