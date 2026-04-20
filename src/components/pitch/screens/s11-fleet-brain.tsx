"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, useMotionValueEvent } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────
// S11 — The Intelligence · chapter one of four
// "Time Travel Lab" — scrub the week, watch Brain pre-execute.
// Editorial aesthetic: restrained palette, typographic hierarchy,
// muted basemap grid, subdued heat, precise motion.
// ─────────────────────────────────────────────────────────

interface Branch {
    id: string;
    name: string;
    x: number;   // % of map
    y: number;
}

// Coordinates loosely echo Jordan geography (Irbid north, Aqaba south).
const BRANCHES: Branch[] = [
    { id: "ir",  name: "Irbid",    x: 28, y: 20 },
    { id: "dt",  name: "Downtown", x: 42, y: 38 },
    { id: "air", name: "Airport",  x: 62, y: 34 },
    { id: "ma",  name: "Mall",     x: 54, y: 52 },
    { id: "ds",  name: "Dead Sea", x: 38, y: 68 },
    { id: "aq",  name: "Aqaba",    x: 70, y: 84 },
];

// Deterministic pseudo-random for stable layouts across re-renders
function rng(seed: number) {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) | 0;
        return ((s >>> 0) % 10000) / 10000;
    };
}

// Generate vehicle positions clustered around each branch.
// Fleet size per branch; positions fixed at mount so the vehicle density is
// constant but their STATE (parked/active) reacts to chapter heat.
interface Vehicle {
    id: string;
    branchId: string;
    xPct: number;    // position on map in % (container coords)
    yPct: number;
    activationThreshold: number; // if heat > this, car is "active" (amber/red)
}

function generateVehicles(): Vehicle[] {
    const out: Vehicle[] = [];
    const FLEET = { ir: 10, dt: 14, air: 16, ma: 12, ds: 10, aq: 12 };
    BRANCHES.forEach((b) => {
        const r = rng(b.id.charCodeAt(0) * 131 + b.id.charCodeAt(1));
        const count = FLEET[b.id as keyof typeof FLEET] ?? 10;
        for (let i = 0; i < count; i++) {
            // Cluster cars in a 6%-radius halo around the branch
            const ang = r() * Math.PI * 2;
            const rad = 2.5 + r() * 5.5;
            out.push({
                id: `${b.id}-v${i}`,
                branchId: b.id,
                xPct: b.x + Math.cos(ang) * rad * 1.3,  // slight elongation on x for wide canvas
                yPct: b.y + Math.sin(ang) * rad,
                activationThreshold: 30 + r() * 60, // each car activates at a different load level
            });
        }
    });
    return out;
}
const VEHICLES = generateVehicles();

// Brain's live thought stream per chapter — 3-4 lines that scroll through as the chapter plays
interface Thought {
    kind: "scan" | "detect" | "reason" | "act" | "confirm";
    text: string;
}
// Thought stream per chapter — each ends with a CONFIRM line that states
// the concrete business value delivered (revenue, utilization, speed, savings).
const THOUGHTS_BY_CHAPTER: Record<string, Thought[]> = {
    "Now": [
        { kind: "scan",    text: "47 signals/sec across 6 branches · model confidence 94%" },
        { kind: "reason",  text: "Network posture optimal — every car placed for expected demand" },
        { kind: "confirm", text: "Delivering full visibility over ¼ million moving parts — in real time" },
    ],
    "+6 hrs": [
        { kind: "detect",  text: "Demand concentrating at Airport · Beach utilization holding at 20%" },
        { kind: "act",     text: "3 SUVs repositioned Beach → Airport · Aqaba rate +8%" },
        { kind: "confirm", text: "+1,050 JOD captured · utilization lifted 14 points in one afternoon" },
    ],
    "Tomorrow": [
        { kind: "detect",  text: "Corporate commute wave incoming · Downtown + Mall to hit 90%+" },
        { kind: "act",     text: "14 corporate holds pre-approved · 6 cars pre-staged at Downtown" },
        { kind: "confirm", text: "+7,680 JOD pipeline secured before 8 AM · zero walk-in friction" },
    ],
    "Fri · 17:02": [
        { kind: "detect",  text: "Concert surge modeled · Dead Sea +220%, Downtown +180%" },
        { kind: "act",     text: "18 cars pre-staged · weekend rates +15% locked · 47 walk-ins pre-qualified" },
        { kind: "confirm", text: "Peak-demand event turned into peak-revenue event · +8,400 JOD" },
    ],
    "Next Mon": [
        { kind: "confirm", text: "47,203 bookings processed · 31,842 micro-decisions executed" },
        { kind: "confirm", text: "Fleet utilization 89% (industry avg 62%) · ancillary revenue +22%" },
        { kind: "confirm", text: "84,320 JOD delivered in one week — compounding, every week" },
    ],
};

const THOUGHT_KIND_COLOR: Record<Thought["kind"], string> = {
    scan:    "#64748b",
    detect:  "#fbbf24",
    reason:  "#a78bfa",
    act:     "#22d3ee",
    confirm: "#34d399",
};
const THOUGHT_KIND_LABEL: Record<Thought["kind"], string> = {
    scan:    "SCAN",
    detect:  "DETECT",
    reason:  "REASON",
    act:     "ACT",
    confirm: "CONFIRM",
};

interface Chapter {
    t: number;
    label: string;
    sub: string;
    narrative: string;
    heat: Record<string, number>;
    flow: Array<{ from: string; to: string; count: number }>;
    revenueDelta: number;
    decisions: number;
    accent: string;
}

// Every chapter carries: what Brain is doing NOW (for the map) + the business value
// that compounds from it (for the narrative). No pain, no "problem" framing.
// This is the value Fleetora delivers, chapter by chapter.
const CHAPTERS: Chapter[] = [
    {
        t: 0,
        label: "Now",
        sub: "Mon · 07:03",
        narrative: "Brain is live across your whole network — watching demand, fleet, weather, and pricing, 47 signals per second. Every decision from here is informed.",
        heat: { air: 55, dt: 62, ds: 20, aq: 40, ir: 48, ma: 58 },
        flow: [],
        revenueDelta: 0,
        decisions: 0,
        accent: "#60a5fa",
    },
    {
        t: 22,
        label: "+6 hrs",
        sub: "Mon · 13:30",
        narrative: "Brain rebalances in real time — moves idle cars to where demand is rising, and lifts rates where the market supports it. Utilization climbs without a single manual intervention.",
        heat: { air: 88, dt: 64, ds: 22, aq: 74, ir: 50, ma: 62 },
        flow: [
            { from: "ds", to: "air", count: 3 },
            { from: "ir", to: "aq", count: 2 },
        ],
        revenueDelta: 2_140,
        decisions: 412,
        accent: "#a78bfa",
    },
    {
        t: 46,
        label: "Tomorrow",
        sub: "Tue · 08:00",
        narrative: "Brain pre-approves corporate holds and stages cars before the morning rush hits — your team walks in to a network already positioned for the day's demand.",
        heat: { air: 78, dt: 92, ds: 30, aq: 55, ir: 62, ma: 90 },
        flow: [
            { from: "air", to: "dt", count: 4 },
            { from: "ma", to: "dt", count: 2 },
            { from: "aq", to: "ir", count: 1 },
        ],
        revenueDelta: 9_820,
        decisions: 2_840,
        accent: "#22d3ee",
    },
    {
        t: 72,
        label: "Fri · 17:02",
        sub: "Concert · 22K attendees",
        narrative: "Brain predicts the surge, repositions eighteen cars, locks weekend rates, and pre-qualifies walk-ins — all hours before the first booking lands. Peak-demand events become peak-revenue events.",
        heat: { air: 95, dt: 96, ds: 98, aq: 72, ir: 58, ma: 94 },
        flow: [
            { from: "ir", to: "ds", count: 6 },
            { from: "aq", to: "ds", count: 5 },
            { from: "air", to: "dt", count: 4 },
            { from: "ma", to: "air", count: 3 },
        ],
        revenueDelta: 24_760,
        decisions: 12_480,
        accent: "#f87171",
    },
    {
        t: 100,
        label: "Next Mon",
        sub: "Weekly close",
        narrative: "47,203 bookings processed. 31,842 decisions executed autonomously. The compounding effect of every micro-optimization, captured in one number — 84,320 JOD delivered across the week.",
        heat: { air: 68, dt: 72, ds: 44, aq: 58, ir: 54, ma: 70 },
        flow: [],
        revenueDelta: 84_320,
        decisions: 31_842,
        accent: "#34d399",
    },
];

const CHAPTER_DURATION = 3600;

function interp(a: number, b: number, t: number) { return a + (b - a) * t; }
function interpChapter(t: number) {
    const idx = Math.min(
        CHAPTERS.length - 2,
        Math.max(0, CHAPTERS.findIndex((_, i) => i < CHAPTERS.length - 1 && CHAPTERS[i].t <= t && CHAPTERS[i + 1].t >= t))
    );
    const a = CHAPTERS[idx];
    const b = CHAPTERS[idx + 1] || a;
    const span = b.t - a.t || 1;
    const local = Math.max(0, Math.min(1, (t - a.t) / span));

    const heat: Record<string, number> = {};
    BRANCHES.forEach(br => { heat[br.id] = interp(a.heat[br.id] ?? 50, b.heat[br.id] ?? 50, local); });

    return {
        heat,
        revenueDelta: interp(a.revenueDelta, b.revenueDelta, local),
        decisions: interp(a.decisions, b.decisions, local),
        flow: local < 0.5 ? a.flow : b.flow,
        currentChapter: local < 0.5 ? a : b,
    };
}

// Restrained 4-step heat palette — single hue family, no cartoon reds
function heatTone(h: number) {
    if (h < 40) return { fill: "rgba(96,165,250,0.12)",  core: "#60a5fa", label: "idle"  }; // blue
    if (h < 65) return { fill: "rgba(167,139,250,0.14)", core: "#a78bfa", label: "steady" }; // purple
    if (h < 85) return { fill: "rgba(251,191,36,0.16)",  core: "#fbbf24", label: "busy"  }; // amber
    return            { fill: "rgba(248,113,113,0.20)", core: "#f87171", label: "peak" }; // soft red
}

export function S11FleetBrain() {
    const [phase, setPhase] = useState(0);
    // scrubT = React state (drives heavy tree re-render; throttled)
    // scrubMV = motion value (drives playhead + progress fill at native 60fps; compositor-layer only)
    const [scrubT, setScrubT] = useState(0);
    const scrubMV = useMotionValue(0);
    const [playing, setPlaying] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const railRef = useRef<HTMLDivElement>(null);

    // Measure map container so we can render SVG arrows in real pixel space
    // (prevents preserveAspectRatio distortion on curves + keeps coords aligned
    // with the HTML-positioned heat zones and pins).
    const mapRef = useRef<HTMLDivElement>(null);
    const [mapSize, setMapSize] = useState({ w: 0, h: 0 });
    useEffect(() => {
        const el = mapRef.current;
        if (!el) return;
        const update = () => {
            const r = el.getBoundingClientRect();
            setMapSize({ w: r.width, h: r.height });
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 900),
            setTimeout(() => setPhase(3), 1600),
            setTimeout(() => setPhase(4), 2400),
            setTimeout(() => setPhase(5), 2900),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    // rAF drives the MOTION VALUE only — 60fps compositor updates for playhead/progress.
    useEffect(() => {
        if (phase < 5 || !playing || isDragging) return;
        let raf = 0;
        let last = performance.now();
        const speed = 100 / (CHAPTER_DURATION * (CHAPTERS.length - 1)) * 1000;
        const tick = (t: number) => {
            const dt = t - last;
            last = t;
            let next = scrubMV.get() + speed * (dt / 1000);
            if (next >= 100) next = 0;
            scrubMV.set(next);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [phase, playing, isDragging, scrubMV]);

    // Throttled sync from motion value → React state so heavy tree (heat discs, thoughts)
    // interpolates but doesn't re-render 60x per second.
    useMotionValueEvent(scrubMV, "change", (v) => {
        // Update state only if moved > 0.6% OR crossed a chapter boundary
        const nearestChapter = CHAPTERS.reduce((best, c) =>
            Math.abs(c.t - v) < Math.abs(best.t - v) ? c : best, CHAPTERS[0]);
        const prevNearest = CHAPTERS.reduce((best, c) =>
            Math.abs(c.t - scrubT) < Math.abs(best.t - scrubT) ? c : best, CHAPTERS[0]);
        if (Math.abs(v - scrubT) > 0.6 || nearestChapter.label !== prevNearest.label) {
            setScrubT(v);
        }
    });

    const state = interpChapter(scrubT);
    const current = state.currentChapter;

    // Brain-thought stream: reveal thoughts sequentially when a chapter becomes active.
    const [visibleThoughts, setVisibleThoughts] = useState(0);
    useEffect(() => {
        setVisibleThoughts(0);
        const thoughts = THOUGHTS_BY_CHAPTER[current.label] || [];
        const timers = thoughts.map((_, i) => setTimeout(() => setVisibleThoughts(i + 1), 350 * (i + 1)));
        return () => timers.forEach(clearTimeout);
    }, [current.label]);

    const handleDrag = useCallback((clientX: number) => {
        const rail = railRef.current;
        if (!rail) return;
        const rect = rail.getBoundingClientRect();
        const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        scrubMV.set(pct);
        setScrubT(pct);
    }, [scrubMV]);

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setPlaying(false);
        handleDrag(e.clientX);
    };

    useEffect(() => {
        if (!isDragging) return;
        const onMove = (e: MouseEvent) => handleDrag(e.clientX);
        const onUp = () => setIsDragging(false);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [isDragging, handleDrag]);

    const jumpTo = (t: number) => { setPlaying(false); scrubMV.set(t); setScrubT(t); };

    return (
        <section className="h-full w-full relative overflow-hidden" style={{ backgroundColor: "#0a1020" }}>
            {/* Editorial ambient: single very subtle top-lit glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(30,41,59,0.5), transparent 60%)" }}
            />

            <div className="absolute inset-0 z-10 flex flex-col" style={{ paddingTop: 48, paddingBottom: 96, paddingLeft: 96, paddingRight: 96 }}>

                {/* ── Eyebrow row: chapter left · kicker right ── */}
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-slate-400">Fleetora · Intelligence</span>
                        <span className="text-slate-700">/</span>
                        <span className="text-[10px] tracking-wider text-slate-500">Chapter I — Time Travel Lab</span>
                    </div>
                    <span className="text-[10px] tracking-wider text-slate-500 tabular-nums">01 / 04</span>
                </motion.div>

                {/* ── Headline ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex-shrink-0 mt-4 mb-5 max-w-4xl"
                >
                    <h1 className="text-[32px] md:text-[38px] font-semibold text-white tracking-[-0.02em] leading-[1.08]">
                        An operator that runs your week.
                        <span className="text-slate-500"> Every branch, every decision, compounded.</span>
                    </h1>
                    <p className="text-[13px] text-slate-400 mt-2 max-w-2xl leading-relaxed">
                        Brain operates your fleet end-to-end — pricing, rebalancing, approvals, demand prediction — and shows you the compounding revenue it delivers. Scrub any moment of the week to see what it's doing and what it's worth.
                    </p>
                </motion.div>

                {/* ── Main stage: map (left) · side rail (right) ── */}
                <div className="flex-1 min-h-0 flex gap-6">

                    {/* ─── LEFT: Editorial map ─── */}
                    <motion.div
                        ref={mapRef}
                        initial={{ opacity: 0 }}
                        animate={phase >= 3 ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6 }}
                        className="relative flex-1 min-w-0 rounded-lg overflow-hidden"
                        style={{
                            background: "linear-gradient(180deg, #0f1626 0%, #0a1220 100%)",
                            border: "1px solid rgba(148,163,184,0.1)",
                            minHeight: 440,
                        }}
                    >
                        {/* Background grid — CSS, guaranteed square cells */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: [
                                    "linear-gradient(rgba(148,163,184,0.055) 1px, transparent 1px)",
                                    "linear-gradient(90deg, rgba(148,163,184,0.055) 1px, transparent 1px)",
                                    "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px)",
                                    "linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
                                ].join(","),
                                backgroundSize: "40px 40px, 40px 40px, 160px 160px, 160px 160px",
                                backgroundPosition: "0 0, 0 0, 0 0, 0 0",
                            }}
                        />

                        {/* Map header strip: region + coord + decisions */}
                        <div className="absolute top-0 left-0 right-0 px-5 py-3 flex items-center justify-between z-20 border-b border-white/5 backdrop-blur-sm" style={{ background: "linear-gradient(180deg, rgba(10,16,32,0.85), rgba(10,16,32,0.0))" }}>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-medium">Fleet Map · Jordan</span>
                                <span className="text-slate-700">|</span>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={current.label}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-[11px] font-semibold tracking-wide"
                                        style={{ color: current.accent }}
                                    >
                                        {current.label}
                                    </motion.span>
                                </AnimatePresence>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={current.sub}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-[11px] text-slate-400"
                                    >
                                        {current.sub}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[9px] uppercase tracking-widest text-slate-500">Decisions</span>
                                    <span className="text-[13px] text-white font-semibold tabular-nums">
                                        {Math.round(state.decisions).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Heat zones — single restrained disc per branch, sized by load */}
                        {BRANCHES.map(b => {
                            const h = state.heat[b.id];
                            const tone = heatTone(h);
                            const size = 110 + (h / 100) * 150;
                            return (
                                <motion.div
                                    key={`zone-${b.id}`}
                                    className="absolute pointer-events-none rounded-full"
                                    animate={{
                                        width: size,
                                        height: size,
                                        backgroundColor: tone.fill,
                                    }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        left: `${b.x}%`,
                                        top: `${b.y}%`,
                                        transform: "translate(-50%, -50%)",
                                        border: `1px solid ${tone.core}35`,
                                    }}
                                />
                            );
                        })}

                        {/* Monitoring web — faint dashed lines between every branch pair.
                            Shows Brain is watching the whole network, not just the active ones. */}
                        {mapSize.w > 0 && (
                            <svg
                                width={mapSize.w}
                                height={mapSize.h}
                                viewBox={`0 0 ${mapSize.w} ${mapSize.h}`}
                                className="absolute inset-0 pointer-events-none"
                            >
                                {BRANCHES.flatMap((a, ai) =>
                                    BRANCHES.slice(ai + 1).map((b, bi) => {
                                        const x1 = (a.x / 100) * mapSize.w;
                                        const y1 = (a.y / 100) * mapSize.h;
                                        const x2 = (b.x / 100) * mapSize.w;
                                        const y2 = (b.y / 100) * mapSize.h;
                                        return (
                                            <line
                                                key={`web-${a.id}-${b.id}`}
                                                x1={x1} y1={y1} x2={x2} y2={y2}
                                                stroke="rgba(148,163,184,0.07)"
                                                strokeWidth={0.5}
                                                strokeDasharray="1 3"
                                            />
                                        );
                                    })
                                )}
                            </svg>
                        )}

                        {/* Vehicle dots — the actual fleet. Cars cluster around their home branch.
                            Color shifts to tone of branch load; some pulse when active. */}
                        {mapSize.w > 0 && VEHICLES.map(v => {
                            const branch = BRANCHES.find(b => b.id === v.branchId);
                            if (!branch) return null;
                            const h = state.heat[v.branchId];
                            const isActive = h > v.activationThreshold;
                            const tone = heatTone(h);
                            const color = isActive ? tone.core : "rgba(148,163,184,0.45)";
                            return (
                                <motion.div
                                    key={v.id}
                                    className="absolute pointer-events-none"
                                    style={{
                                        left: `${v.xPct}%`,
                                        top: `${v.yPct}%`,
                                        transform: "translate(-50%, -50%)",
                                        width: 3,
                                        height: 3,
                                        borderRadius: "50%",
                                    }}
                                    animate={{
                                        backgroundColor: color,
                                        opacity: isActive ? [0.9, 0.5, 0.9] : 0.6,
                                    }}
                                    transition={{
                                        backgroundColor: { duration: 0.5 },
                                        opacity: isActive
                                            ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                                            : { duration: 0.3 },
                                    }}
                                />
                            );
                        })}

                        {/* Flow curves — rendered in PIXEL space using measured map size.
                            Straight lines, muted, thinner, broken. */}
                        {mapSize.w > 0 && (
                            <svg
                                width={mapSize.w}
                                height={mapSize.h}
                                viewBox={`0 0 ${mapSize.w} ${mapSize.h}`}
                                className="absolute inset-0 pointer-events-none"
                            >
                                {state.flow.map((f, i) => {
                                    const from = BRANCHES.find(b => b.id === f.from);
                                    const to = BRANCHES.find(b => b.id === f.to);
                                    if (!from || !to) return null;
                                    const x1 = (from.x / 100) * mapSize.w;
                                    const y1 = (from.y / 100) * mapSize.h;
                                    const x2 = (to.x / 100) * mapSize.w;
                                    const y2 = (to.y / 100) * mapSize.h;
                                    const pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
                                    return (
                                        <g key={`flow-${i}-${current.label}`}>
                                            <motion.path
                                                d={pathD}
                                                stroke="rgba(148,163,184,0.28)"
                                                strokeWidth={0.75}
                                                strokeDasharray="3 4"
                                                strokeLinecap="butt"
                                                fill="none"
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{ pathLength: 1, opacity: 1 }}
                                                transition={{ duration: 0.6 }}
                                            />
                                            <motion.circle
                                                r={2}
                                                fill="rgba(226,232,240,0.85)"
                                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                                transition={{ duration: 2.4, repeat: Infinity, ease: "linear", delay: i * 0.4 }}
                                                style={{ offsetPath: `path("${pathD}")` }}
                                            />
                                        </g>
                                    );
                                })}
                            </svg>
                        )}

                        {/* Branch markers: precise pin + typographic label */}
                        {BRANCHES.map(b => {
                            const h = state.heat[b.id];
                            const tone = heatTone(h);
                            return (
                                <div key={`pin-${b.id}`} className="absolute pointer-events-none" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
                                    {/* core dot */}
                                    <div
                                        className="absolute rounded-full"
                                        style={{
                                            width: 8, height: 8,
                                            left: -4, top: -4,
                                            background: "#0a1020",
                                            border: `1.5px solid ${tone.core}`,
                                        }}
                                    />
                                    {/* label card */}
                                    <div className="absolute whitespace-nowrap" style={{ left: 10, top: -14 }}>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-[11px] font-semibold text-white tracking-tight">{b.name}</span>
                                            <span className="text-[9.5px] tabular-nums font-medium" style={{ color: tone.core }}>
                                                {Math.round(h)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="text-[8.5px] uppercase tracking-[0.15em] text-slate-500">{tone.label}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Map footer strip — legend + scale */}
                        <div className="absolute bottom-0 left-0 right-0 px-5 py-2.5 flex items-center justify-between z-20 border-t border-white/5 backdrop-blur-sm" style={{ background: "linear-gradient(0deg, rgba(10,16,32,0.85), rgba(10,16,32,0.0))" }}>
                            <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.18em] text-slate-500">
                                <span className="font-medium">Load</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#60a5fa" }} />
                                    <span>Idle</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#a78bfa" }} />
                                    <span>Steady</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#fbbf24" }} />
                                    <span>Busy</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#f87171" }} />
                                    <span>Peak</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.18em] text-slate-500">
                                <span>Branches {BRANCHES.length}</span>
                                <span className="text-slate-700">·</span>
                                <span>Signals/sec 47</span>
                                <span className="text-slate-700">·</span>
                                <span>Latency 18ms</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* ─── RIGHT: Editorial side rail ─── */}
                    <motion.aside
                        initial={{ opacity: 0, x: 16 }}
                        animate={phase >= 3 ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="w-[340px] flex-shrink-0 flex flex-col gap-3"
                    >
                        {/* Value delivered — outcome, not projection */}
                        <div className="rounded-lg border overflow-hidden px-5 py-4" style={{ background: "rgba(15,22,38,0.6)", borderColor: "rgba(148,163,184,0.12)" }}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-medium">Value delivered</span>
                                <span className="text-[9px] text-slate-600 tabular-nums">through {current.label}</span>
                            </div>
                            <div className="flex items-baseline gap-2 tracking-tight">
                                <span className="text-[44px] font-semibold text-white tabular-nums leading-none">
                                    {Math.round(state.revenueDelta).toLocaleString()}
                                </span>
                                <span className="text-sm text-slate-500 font-medium">JOD</span>
                            </div>
                            {/* subtle growth bar */}
                            <div className="mt-4 h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(148,163,184,0.08)" }}>
                                <motion.div
                                    className="h-full rounded-full"
                                    animate={{
                                        width: `${Math.min(100, (state.revenueDelta / 84320) * 100)}%`,
                                        backgroundColor: current.accent,
                                    }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* Brain's thought stream — what the model is doing RIGHT NOW */}
                        <div className="flex-1 rounded-lg border overflow-hidden px-5 py-4 flex flex-col min-h-0" style={{ background: "rgba(15,22,38,0.6)", borderColor: "rgba(148,163,184,0.12)" }}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <motion.span
                                        className="w-1.5 h-1.5 rounded-full"
                                        animate={{ opacity: [1, 0.3, 1], backgroundColor: current.accent }}
                                        transition={{ duration: 1.4, repeat: Infinity }}
                                        style={{ backgroundColor: current.accent }}
                                    />
                                    <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-medium">Brain · thinking</span>
                                </div>
                                <span className="text-[9px] uppercase tracking-[0.2em] font-semibold" style={{ color: current.accent }}>
                                    {current.label}
                                </span>
                            </div>

                            {/* Thought stream */}
                            <div className="space-y-2">
                                <AnimatePresence initial={false}>
                                    {(THOUGHTS_BY_CHAPTER[current.label] || []).slice(0, visibleThoughts).map((th, i) => {
                                        const col = THOUGHT_KIND_COLOR[th.kind];
                                        return (
                                            <motion.div
                                                key={`${current.label}-${i}`}
                                                layout
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.35, ease: "easeOut" }}
                                                className="flex items-start gap-2"
                                            >
                                                <span
                                                    className="text-[8px] font-bold tracking-[0.12em] mt-[3px] px-1 py-px rounded"
                                                    style={{ color: col, background: `${col}18`, border: `1px solid ${col}40`, minWidth: 46, textAlign: "center" }}
                                                >
                                                    {THOUGHT_KIND_LABEL[th.kind]}
                                                </span>
                                                <p className="text-[11.5px] text-slate-300 leading-[1.5] flex-1">
                                                    {th.text}
                                                </p>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>

                            {/* Divider */}
                            <div className="my-4 h-px" style={{ background: "rgba(148,163,184,0.1)" }} />

                            {/* Queued actions — table-like */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-medium">Queued</span>
                                <span className="text-[9px] text-slate-600 tabular-nums">{state.flow.length} action{state.flow.length !== 1 ? "s" : ""}</span>
                            </div>
                            <div className="space-y-1.5">
                                <AnimatePresence mode="popLayout">
                                    {state.flow.length === 0 ? (
                                        <motion.p
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-[11px] text-slate-600"
                                        >
                                            Steady state — Brain is monitoring only.
                                        </motion.p>
                                    ) : (
                                        state.flow.map((f, i) => {
                                            const from = BRANCHES.find(b => b.id === f.from)?.name;
                                            const to = BRANCHES.find(b => b.id === f.to)?.name;
                                            return (
                                                <motion.div
                                                    key={`${current.label}-${i}`}
                                                    initial={{ opacity: 0, x: 6 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -6 }}
                                                    transition={{ delay: i * 0.05, duration: 0.25 }}
                                                    className="flex items-baseline justify-between py-1 text-[11px]"
                                                >
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="tabular-nums text-slate-500 w-4">{String(i + 1).padStart(2, "0")}</span>
                                                        <span className="text-slate-200">{from}</span>
                                                        <span className="text-slate-600">→</span>
                                                        <span className="text-slate-200">{to}</span>
                                                    </div>
                                                    <span className="text-white font-semibold tabular-nums">{f.count}</span>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.aside>
                </div>

                {/* ═════════════════════════════════════════════════════ */}
                {/* TIMELINE SCRUBBER — tighter, editorial                 */}
                {/* ═════════════════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0 mt-5"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setPlaying(p => !p)}
                                className="w-6 h-6 rounded-full border flex items-center justify-center transition-colors"
                                style={{ borderColor: "rgba(148,163,184,0.25)" }}
                                aria-label={playing ? "Pause" : "Play"}
                            >
                                {playing ? (
                                    <svg width="8" height="8" viewBox="0 0 10 10"><rect x="2" y="1.5" width="2" height="7" fill="#cbd5e1" /><rect x="6" y="1.5" width="2" height="7" fill="#cbd5e1" /></svg>
                                ) : (
                                    <svg width="8" height="8" viewBox="0 0 10 10"><path d="M2 1 L9 5 L2 9 Z" fill="#cbd5e1" /></svg>
                                )}
                            </button>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-medium">Timeline</span>
                            <span className="text-slate-700">·</span>
                            <span className="text-[10px] text-slate-500">drag or click to scrub</span>
                        </div>
                        <span className="text-[10px] text-slate-500 tabular-nums">{Math.round(scrubT)}% · {current.label}</span>
                    </div>

                    {/* Rail: single row. Rail track is 6px tall so the playhead sits ON it
                        (not above it). Ticks are 10x10 rings centered on the track. Playhead
                        is a 12x12 disc with a 2px colored outline — exactly the same size as
                        the ticks' bounding box so alignment is visually unambiguous. */}
                    {(() => {
                        const TRACK_Y = 10;
                        const TRACK_H = 6;
                        const PLAYHEAD = 12;
                        const TICK = 10;
                        return (
                            <div className="relative select-none" style={{ height: 62 }}>
                                {/* Track */}
                                <div
                                    ref={railRef}
                                    onMouseDown={onMouseDown}
                                    className="absolute left-0 right-0 rounded-full cursor-pointer"
                                    style={{ top: TRACK_Y, height: TRACK_H, background: "rgba(148,163,184,0.12)" }}
                                >
                                    {/* Progress fill — driven by motion value (60fps compositor) */}
                                    <motion.div
                                        className="absolute inset-y-0 left-0 rounded-full pointer-events-none"
                                        style={{
                                            width: useTransform(scrubMV, v => `${v}%`),
                                            background: current.accent,
                                            opacity: 0.55,
                                        }}
                                    />
                                </div>

                                {/* Chapter ticks — positioned in the container, centered on the track line */}
                                {CHAPTERS.map((c, i) => {
                                    const reached = scrubT >= c.t;
                                    return (
                                        <div
                                            key={`tick-${i}`}
                                            onClick={(e) => { e.stopPropagation(); jumpTo(c.t); }}
                                            className="absolute cursor-pointer rounded-full transition-all"
                                            style={{
                                                left: `${c.t}%`,
                                                top: TRACK_Y + TRACK_H / 2,
                                                transform: "translate(-50%, -50%)",
                                                width: TICK,
                                                height: TICK,
                                                background: "#0a1020",
                                                border: `2px solid ${reached ? c.accent : "#475569"}`,
                                                boxShadow: reached ? `0 0 0 2px ${c.accent}25` : "none",
                                            }}
                                        />
                                    );
                                })}

                                {/* Playhead — wrapper left bound to motion value (60fps, no React render).
                                    Inner motion div owns scale animation only. */}
                                <motion.div
                                    className="absolute pointer-events-none"
                                    style={{
                                        left: useTransform(scrubMV, v => `${v}%`),
                                        top: TRACK_Y + TRACK_H / 2,
                                        width: 0,
                                        height: 0,
                                    }}
                                >
                                    <motion.div
                                        style={{
                                            position: "absolute",
                                            left: -PLAYHEAD / 2,
                                            top: -PLAYHEAD / 2,
                                            width: PLAYHEAD,
                                            height: PLAYHEAD,
                                            borderRadius: "50%",
                                            background: current.accent,
                                            border: "2px solid #ffffff",
                                            boxShadow: `0 0 12px ${current.accent}88`,
                                            willChange: "transform",
                                        }}
                                        animate={{ scale: isDragging ? 1.2 : 1 }}
                                    />
                                </motion.div>

                                {/* Labels layer — tight to the track */}
                                <div className="absolute left-0 right-0" style={{ top: TRACK_Y + TRACK_H + 8 }}>
                                    {CHAPTERS.map((c, i) => {
                                        const isFirst = i === 0;
                                        const isLast = i === CHAPTERS.length - 1;
                                        const posStyle: React.CSSProperties = isFirst
                                            ? { left: 0 }
                                            : isLast
                                                ? { right: 0 }
                                                : { left: `${c.t}%`, transform: "translateX(-50%)" };
                                        const textAlign = isFirst ? "left" : isLast ? "right" : "center";
                                        const active = Math.abs(scrubT - c.t) < 4;
                                        return (
                                            <div
                                                key={`label-${i}`}
                                                onClick={() => jumpTo(c.t)}
                                                className="absolute whitespace-nowrap cursor-pointer group"
                                                style={{ ...posStyle, textAlign }}
                                            >
                                                <p
                                                    className="text-[10px] font-semibold tracking-tight transition-colors group-hover:text-white"
                                                    style={{ color: active ? c.accent : "#cbd5e1" }}
                                                >
                                                    {c.label}
                                                </p>
                                                <p className="text-[9px] text-slate-500 mt-0.5">{c.sub}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}
                </motion.div>
            </div>
        </section>
    );
}
