"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────
// S14 — The Intelligence · Chapter IV
// "The Fleet Pulse Grid"
//
// Every vehicle visible simultaneously as a compact tile with a
// live telemetry sparkline. One tile at a time is spotlit by
// Brain's drifting attention. The right-side narration panel
// explains what Brain sees on the spotlit vehicle.
// ─────────────────────────────────────────────────────────

type Stage = "healthy" | "watching" | "due" | "in_garage" | "ready";

interface Vehicle {
    id: string;
    plate: string;
    model: string;
    mileage: string;
    stage: Stage;
    days: string;     // "22d", "3d", "now", "done"
    signal: string;   // headline signal
    detail: string;   // what Brain says on spotlight
    action: string;   // next action Brain has queued
}

const STAGE_META: Record<Stage, { tone: string; label: string }> = {
    healthy:   { tone: "#60a5fa", label: "Healthy"     },
    watching:  { tone: "#a78bfa", label: "Watching"    },
    due:       { tone: "#fbbf24", label: "Service due" },
    in_garage: { tone: "#f87171", label: "In garage"   },
    ready:     { tone: "#34d399", label: "Ready"       },
};

const VEHICLES: Vehicle[] = [
    { id: "v01", plate: "AZ-TUC-4821", model: "Tucson 2.4",  mileage: "82,140",  stage: "healthy",
      days: "22d", signal: "All nominal",
      detail: "Engine signature clean, brake wear at 98%, oil cycle fresh. No action needed.",
      action: "Continue monitoring · next check in 22 days" },

    { id: "v02", plate: "22-1147",     model: "Accent GL",   mileage: "64,220",  stage: "healthy",
      days: "18d", signal: "All nominal",
      detail: "Brand-new brake pads, oil cycle halfway, fuel curve matches historical baseline.",
      action: "Next scheduled checkup in 18 days · no intervention" },

    { id: "v03", plate: "55-2290",     model: "Elantra",     mileage: "48,910",  stage: "healthy",
      days: "30d", signal: "All nominal",
      detail: "Low-mileage vehicle, all telemetry within 1σ of model baseline.",
      action: "Monitor only · next checkup in 30 days" },

    { id: "v04", plate: "AZ-SNT-3318", model: "Santa Fe",    mileage: "96,780",  stage: "watching",
      days: "9d", signal: "Engine drift +3.2%",
      detail: "Engine signature drifting +3.2% over last 800km. Within safe range but warrants a closer look.",
      action: "Watchlist active · garage slot reserved for day 9" },

    { id: "v05", plate: "77-9021",     model: "Sonata",      mileage: "78,450",  stage: "watching",
      days: "12d", signal: "Brake wear trend",
      detail: "Brake-pad wear trending 18% faster than model baseline — likely a harsh-braking driver pattern.",
      action: "Hold for 12 days · reassess with more data" },

    { id: "v06", plate: "AZ-KON-2214", model: "Kona",        mileage: "112,300", stage: "due",
      days: "3d", signal: "Oil cycle due",
      detail: "Oil cycle threshold crossed. Scheduled between peak-demand days — Thursday 08:00, lowest utilization window.",
      action: "Auto-booked garage · Thu 08:00 · 2h service" },

    { id: "v07", plate: "AZ-TUC-9021", model: "Tucson HSE",  mileage: "104,560", stage: "due",
      days: "5d", signal: "Transmission drop",
      detail: "Transmission fluid at lower bound. Drop queued for the midweek valley before Friday concert.",
      action: "Garage slot Wed 10:30 · returns Fri noon" },

    { id: "v08", plate: "AZ-VEL-1158", model: "Veloster",    mileage: "71,220",  stage: "in_garage",
      days: "now", signal: "Service active",
      detail: "Checked into Central Garage at 09:28. Mechanic assigned, quality-check queued. ETA 6 hours.",
      action: "Work in progress · returning to Airport by 15:30" },

    { id: "v09", plate: "AZ-CRE-8844", model: "Creta",       mileage: "58,010",  stage: "ready",
      days: "done", signal: "Inspection passed",
      detail: "Full inspection cleared. Redeployed to Airport to meet incoming afternoon demand.",
      action: "Back in service · next check in 28 days" },

    { id: "v10", plate: "33-7745",     model: "Elantra",     mileage: "61,880",  stage: "ready",
      days: "done", signal: "Brakes refreshed",
      detail: "New brake pads + fluid service completed this morning. Handed back to Mall branch.",
      action: "Back in service · next check in 35 days" },

    { id: "v11", plate: "AZ-LAN-9920", model: "Lantra GT",   mileage: "89,200",  stage: "watching",
      days: "14d", signal: "Coolant trend",
      detail: "Coolant temperature running 2°C warmer than fleet average — pre-summer heat advisory.",
      action: "Scheduled coolant flush in 14 days" },

    { id: "v12", plate: "44-2311",     model: "Accent",      mileage: "52,100",  stage: "healthy",
      days: "26d", signal: "All nominal",
      detail: "New vehicle, low wear, driver score 94/100. Telemetry cleanest in the fleet.",
      action: "Monitor only · next checkup in 26 days" },
];

// Deterministic sparkline path per vehicle id
function sparkPath(seed: string, width: number, height: number, amplitude = 0.45): string {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
    const rng = () => { h = (h * 1664525 + 1013904223) | 0; return ((h >>> 0) % 1000) / 1000; };
    const points = 24;
    let d = "";
    for (let i = 0; i < points; i++) {
        const x = (i / (points - 1)) * width;
        const baseline = height * 0.55;
        const noise = (rng() - 0.5) * height * amplitude;
        const y = baseline + noise;
        d += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1) + " ";
    }
    return d;
}

export function S14Maintenance() {
    const [phase, setPhase] = useState(0);
    const [spotlightIdx, setSpotlightIdx] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 900),
            setTimeout(() => setPhase(3), 1500), // grid tiles cascade in
            setTimeout(() => setPhase(4), 3200), // spotlight begins
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    // Spotlight drifts organically across the grid every ~3s
    useEffect(() => {
        if (phase < 4) return;
        const id = setInterval(() => {
            setSpotlightIdx(prev => {
                // Pick a random-ish next index that's not the same
                let next = prev;
                while (next === prev) {
                    next = Math.floor(Math.random() * VEHICLES.length);
                }
                return next;
            });
        }, 3000);
        return () => clearInterval(id);
    }, [phase]);

    const spotlit = VEHICLES[spotlightIdx];
    const spotStage = STAGE_META[spotlit.stage];

    return (
        <section className="h-full w-full relative overflow-hidden" style={{ backgroundColor: "#0a1020" }}>
            {/* Ambient */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 85% 55% at 50% 0%, rgba(248,113,113,0.04) 0%, rgba(30,41,59,0.22) 45%, transparent 75%)" }}
            />

            <div className="absolute inset-0 z-10 flex flex-col" style={{ paddingTop: 48, paddingBottom: 96, paddingLeft: 96, paddingRight: 96 }}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-slate-400">Fleetora · Intelligence</span>
                        <span className="text-slate-700">/</span>
                        <span className="text-[10px] tracking-wider text-slate-500">Chapter IV — The Fleet Pulse</span>
                    </div>
                    <span className="text-[10px] tracking-wider text-slate-500 tabular-nums">04 / 04</span>
                </motion.div>

                {/* Headline + definition */}
                <div className="flex-shrink-0 mt-4 mb-5 grid grid-cols-[1fr_auto] gap-8 items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="max-w-2xl"
                    >
                        <h1 className="text-[32px] md:text-[38px] font-semibold text-white tracking-[-0.02em] leading-[1.08]">
                            Every car, watched
                            <span className="text-slate-500"> at the same time.</span>
                        </h1>
                        <p className="text-[13px] text-slate-400 mt-3 max-w-xl leading-relaxed">
                            Brain streams live telemetry from every vehicle and catches drift before it becomes a breakdown — follow the spotlight to see what it's noticing right now.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-[360px] rounded-lg border px-4 py-3.5 self-start"
                        style={{ background: "rgba(15,22,38,0.55)", borderColor: "rgba(248,113,113,0.25)" }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[8.5px] uppercase tracking-[0.3em] text-red-400 font-bold">How to read this</span>
                        </div>
                        <p className="text-[12px] text-slate-100 leading-[1.55] font-medium">
                            Each tile is <span className="text-white font-semibold">one car</span>, live. The waveform inside is its actual telemetry. Brain's attention drifts across the fleet — when a tile lights up, read what Brain sees on the right.
                        </p>
                    </motion.div>
                </div>

                {/* Main stage: grid (left) + spotlight narration (right) */}
                <div className="flex-1 min-h-0 grid grid-cols-[1fr_360px] gap-5">

                    {/* ─── LEFT: the pulse grid ─── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase >= 3 ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5 }}
                        className="relative rounded-lg border overflow-hidden p-4"
                        style={{ background: "rgba(15,22,38,0.5)", borderColor: "rgba(148,163,184,0.12)" }}
                    >
                        {/* Legend strip at top of grid */}
                        <div className="flex items-center justify-between mb-3 px-1 text-[9px] uppercase tracking-[0.22em] text-slate-500 font-medium">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Healthy</span>
                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Watching</span>
                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Due</span>
                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-400" /> In garage</span>
                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Ready</span>
                            </div>
                            <span className="tabular-nums">
                                <span className="text-slate-200 font-semibold">{VEHICLES.length}</span> of 152 shown · live
                            </span>
                        </div>

                        {/* The grid — 4 cols × 3 rows = 12 vehicles */}
                        <div className="grid grid-cols-4 gap-3" style={{ gridTemplateRows: "repeat(3, minmax(0, 1fr))", height: "calc(100% - 24px)" }}>
                            {VEHICLES.map((v, i) => {
                                const meta = STAGE_META[v.stage];
                                const isSpot = i === spotlightIdx;
                                return (
                                    <motion.div
                                        key={v.id}
                                        initial={{ opacity: 0, scale: 0.94 }}
                                        animate={phase >= 3 ? {
                                            opacity: 1,
                                            scale: isSpot ? 1.04 : 1,
                                        } : {}}
                                        transition={{
                                            opacity: { duration: 0.4, delay: 0.04 * i },
                                            scale: { duration: 0.45, ease: "easeOut" },
                                        }}
                                        className="relative rounded-lg border flex flex-col overflow-hidden"
                                        style={{
                                            background: isSpot
                                                ? `linear-gradient(135deg, ${meta.tone}14, rgba(15,22,38,0.85))`
                                                : "rgba(15,22,38,0.7)",
                                            borderColor: isSpot ? `${meta.tone}70` : "rgba(148,163,184,0.12)",
                                            boxShadow: isSpot ? `0 0 0 1px ${meta.tone}50, 0 0 28px ${meta.tone}30` : "none",
                                            zIndex: isSpot ? 10 : 1,
                                        }}
                                    >
                                        {/* Top: plate + days */}
                                        <div className="flex items-baseline justify-between px-3 pt-2.5 pb-1">
                                            <span className="text-[11px] text-white font-semibold font-mono tracking-tight truncate">
                                                {v.plate}
                                            </span>
                                            <span className="text-[10px] text-slate-500 tabular-nums flex-shrink-0 ml-2">{v.days}</span>
                                        </div>

                                        {/* Model + mileage */}
                                        <div className="px-3 pb-1.5">
                                            <p className="text-[10px] text-slate-400 leading-tight truncate">{v.model}</p>
                                            <p className="text-[9px] text-slate-600 tabular-nums">{v.mileage} km</p>
                                        </div>

                                        {/* Telemetry sparkline — baseline always visible, amplitude grows when spotlit */}
                                        <div className="px-2 flex-1 min-h-0 flex items-center">
                                            <svg width="100%" height="100%" viewBox="0 0 200 40" preserveAspectRatio="none">
                                                {/* Baseline midline */}
                                                <line x1="0" y1="22" x2="200" y2="22" stroke="rgba(148,163,184,0.1)" strokeWidth="0.5" strokeDasharray="2 3" />
                                                {/* Underglow when spotlit */}
                                                {isSpot && (
                                                    <motion.path
                                                        d={sparkPath(v.id, 200, 40, v.stage === "watching" ? 0.7 : v.stage === "due" ? 0.85 : 0.5)}
                                                        fill="none"
                                                        stroke={meta.tone}
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        opacity="0.25"
                                                        animate={{ opacity: [0.25, 0.5, 0.25] }}
                                                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                                                    />
                                                )}
                                                <motion.path
                                                    d={sparkPath(v.id, 200, 40, v.stage === "watching" ? 0.7 : v.stage === "due" ? 0.85 : 0.5)}
                                                    fill="none"
                                                    stroke={meta.tone}
                                                    strokeWidth={isSpot ? 1.4 : 0.9}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    opacity={isSpot ? 1 : 0.55}
                                                />
                                            </svg>
                                        </div>

                                        {/* Stage badge + signal */}
                                        <div className="px-3 pb-2.5 pt-1 flex items-center justify-between gap-2">
                                            <span
                                                className="text-[8px] uppercase tracking-[0.18em] font-bold px-1.5 py-[1px] rounded flex-shrink-0"
                                                style={{
                                                    color: meta.tone,
                                                    background: `${meta.tone}14`,
                                                    border: `1px solid ${meta.tone}45`,
                                                }}
                                            >
                                                {meta.label}
                                            </span>
                                            <span className="text-[9px] text-slate-400 truncate italic">{v.signal}</span>
                                        </div>

                                        {/* Spotlight ring pulse — subtle breathing halo */}
                                        {isSpot && (
                                            <motion.div
                                                className="absolute inset-0 rounded-lg pointer-events-none"
                                                style={{ border: `1px solid ${meta.tone}` }}
                                                animate={{ opacity: [0.4, 0.9, 0.4] }}
                                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* ─── RIGHT: spotlight narration panel ─── */}
                    <motion.aside
                        initial={{ opacity: 0, x: 16 }}
                        animate={phase >= 4 ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col gap-3"
                    >
                        {/* "Brain is looking at" card */}
                        <div
                            className="flex-1 min-h-0 rounded-lg border overflow-hidden flex flex-col"
                            style={{ background: "rgba(15,22,38,0.65)", borderColor: `${spotStage.tone}40` }}
                        >
                            <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: "rgba(148,163,184,0.08)" }}>
                                <div className="flex items-center gap-2">
                                    <motion.span
                                        className="w-1.5 h-1.5 rounded-full"
                                        animate={{ opacity: [1, 0.3, 1], backgroundColor: spotStage.tone }}
                                        transition={{ duration: 1.4, repeat: Infinity }}
                                        style={{ backgroundColor: spotStage.tone }}
                                    />
                                    <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-medium">Brain · looking at</span>
                                </div>
                                <span className="text-[9px] uppercase tracking-[0.22em] font-bold" style={{ color: spotStage.tone }}>
                                    {spotStage.label}
                                </span>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={spotlit.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-1 min-h-0 px-4 py-3.5 flex flex-col"
                                >
                                    {/* Vehicle heading */}
                                    <div className="flex items-baseline justify-between mb-2">
                                        <div>
                                            <p className="text-[15px] font-semibold text-white font-mono tracking-tight">{spotlit.plate}</p>
                                            <p className="text-[11px] text-slate-400">{spotlit.model} · {spotlit.mileage} km</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8.5px] uppercase tracking-wider text-slate-500">Window</p>
                                            <p className="text-[12px] font-semibold tabular-nums" style={{ color: spotStage.tone }}>{spotlit.days}</p>
                                        </div>
                                    </div>

                                    <div className="h-px my-2" style={{ background: "rgba(148,163,184,0.1)" }} />

                                    {/* Signal headline */}
                                    <div>
                                        <p className="text-[8.5px] uppercase tracking-[0.25em] text-slate-500 font-medium mb-1">Signal</p>
                                        <p className="text-[13px] font-semibold leading-tight" style={{ color: spotStage.tone }}>{spotlit.signal}</p>
                                    </div>

                                    {/* Detail — what Brain sees */}
                                    <div className="mt-3">
                                        <p className="text-[8.5px] uppercase tracking-[0.25em] text-slate-500 font-medium mb-1">Brain's read</p>
                                        <p className="text-[12px] text-slate-200 leading-[1.55] font-light italic" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                                            “{spotlit.detail}”
                                        </p>
                                    </div>

                                    {/* Action queued */}
                                    <div className="mt-auto pt-3">
                                        <div
                                            className="rounded border px-3 py-2"
                                            style={{ background: `${spotStage.tone}10`, borderColor: `${spotStage.tone}35` }}
                                        >
                                            <p className="text-[8.5px] uppercase tracking-[0.25em] font-medium mb-1" style={{ color: spotStage.tone }}>
                                                Action queued
                                            </p>
                                            <p className="text-[11px] text-slate-100 leading-snug">{spotlit.action}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer stats strip */}
                        <div
                            className="rounded-lg border px-4 py-3 flex items-center justify-around"
                            style={{ background: "rgba(15,22,38,0.55)", borderColor: "rgba(148,163,184,0.1)" }}
                        >
                            <div className="text-center">
                                <p className="text-[8px] uppercase tracking-[0.22em] text-slate-500 font-medium">Tracked</p>
                                <p className="text-[15px] font-semibold text-white tabular-nums leading-none mt-1">152</p>
                            </div>
                            <div className="h-7 w-px" style={{ background: "rgba(148,163,184,0.12)" }} />
                            <div className="text-center">
                                <p className="text-[8px] uppercase tracking-[0.22em] text-slate-500 font-medium">This month</p>
                                <p className="text-[15px] font-semibold text-white tabular-nums leading-none mt-1">34</p>
                            </div>
                            <div className="h-7 w-px" style={{ background: "rgba(148,163,184,0.12)" }} />
                            <div className="text-center">
                                <p className="text-[8px] uppercase tracking-[0.22em] text-emerald-400 font-medium">Value locked</p>
                                <p className="text-[15px] font-semibold text-emerald-400 tabular-nums leading-none mt-1">+18,420</p>
                            </div>
                        </div>
                    </motion.aside>
                </div>
            </div>
        </section>
    );
}
