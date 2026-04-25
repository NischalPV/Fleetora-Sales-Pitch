"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";

// ─────────────────────────────────────────────────────────
// S12 — The Intelligence · Chapter II
// "The Fleet Clock" — one enormous 24-hour radial dial.
// Six concentric rings (one per branch). A sweeping hand
// orbits clockwise, igniting rebalance arcs where Brain
// has moved cars. Center: cumulative value delivered today.
// Composition is radial, not rectangular — completely
// different gestalt from s11's time-scrubber layout.
// ─────────────────────────────────────────────────────────

interface Branch {
    id: string;
    name: string;
    ringIdx: number;
}

const BRANCHES: Branch[] = [
    { id: "air", name: "Airport",  ringIdx: 0 },  // innermost — highest volume
    { id: "dt",  name: "Downtown", ringIdx: 1 },
    { id: "ma",  name: "Mall",     ringIdx: 2 },
    { id: "ir",  name: "Irbid",    ringIdx: 3 },
    { id: "ds",  name: "Dead Sea", ringIdx: 4 },
    { id: "aq",  name: "Aqaba",    ringIdx: 5 },  // outermost
];

// Rebalance events are placed at real hours of the day (0–24)
// ring = branch, startHour + duration = arc span, units scales arc thickness
interface Event {
    branchId: string;
    startHour: number;   // 0–24
    duration: number;    // hours of arc span
    units: number;       // car count (scales thickness)
    partner: string;     // paired branch name
    direction: "in" | "out";
    lift: number;        // JOD net contribution
}

const EVENTS: Event[] = [
    // Morning
    { branchId: "air", startHour: 6.5, duration: 0.8, units: 2, partner: "Mall",      direction: "in",  lift: 420  },
    { branchId: "dt",  startHour: 7.2, duration: 1.0, units: 3, partner: "Irbid",     direction: "in",  lift: 640  },
    { branchId: "ma",  startHour: 7.8, duration: 0.6, units: 1, partner: "Dead Sea",  direction: "out", lift: 230  },
    { branchId: "air", startHour: 8.4, duration: 1.2, units: 4, partner: "Dead Sea",  direction: "in",  lift: 1280 },
    { branchId: "ir",  startHour: 9.0, duration: 0.7, units: 2, partner: "Downtown",  direction: "out", lift: 380  },

    // Midday
    { branchId: "dt",  startHour: 11.5, duration: 0.9, units: 2, partner: "Mall",     direction: "in",  lift: 510  },
    { branchId: "ds",  startHour: 12.2, duration: 1.1, units: 3, partner: "Airport",  direction: "out", lift: 890  },
    { branchId: "aq",  startHour: 13.0, duration: 0.8, units: 2, partner: "Dead Sea", direction: "in",  lift: 560  },
    { branchId: "ma",  startHour: 13.8, duration: 1.0, units: 2, partner: "Airport",  direction: "in",  lift: 620  },

    // Afternoon peak
    { branchId: "air", startHour: 14.5, duration: 1.4, units: 5, partner: "Dead Sea", direction: "in",  lift: 1650 },
    { branchId: "ir",  startHour: 15.2, duration: 0.9, units: 2, partner: "Mall",     direction: "out", lift: 480  },
    { branchId: "dt",  startHour: 16.0, duration: 1.2, units: 3, partner: "Airport",  direction: "in",  lift: 840  },
    { branchId: "ma",  startHour: 16.8, duration: 0.7, units: 1, partner: "Aqaba",    direction: "out", lift: 290  },

    // Evening
    { branchId: "ds",  startHour: 18.2, duration: 1.0, units: 3, partner: "Airport",  direction: "out", lift: 720  },
    { branchId: "aq",  startHour: 19.0, duration: 1.1, units: 2, partner: "Mall",     direction: "in",  lift: 540  },
    { branchId: "air", startHour: 20.4, duration: 0.8, units: 2, partner: "Downtown", direction: "out", lift: 620  },
    { branchId: "dt",  startHour: 21.5, duration: 0.7, units: 1, partner: "Irbid",    direction: "in",  lift: 280  },

    // Overnight (light)
    { branchId: "ir",  startHour: 2.0,  duration: 0.5, units: 1, partner: "Downtown", direction: "in",  lift: 180  },
    { branchId: "ma",  startHour: 4.5,  duration: 0.6, units: 1, partner: "Airport",  direction: "out", lift: 240  },
];

const RING_INNER = 150;   // inner radius of innermost ring
const RING_STEP  = 34;    // radius step per branch ring
const RING_WIDTH = 28;    // stroke width of each ring track

// Convert hour (0–24) → angle in degrees (0° = 12 o'clock, clockwise)
function hourToAngle(h: number): number {
    return (h / 24) * 360;
}

// Build an SVG arc path given cx, cy, r, startAngleDeg, endAngleDeg
function arcPath(cx: number, cy: number, r: number, startAngleDeg: number, endAngleDeg: number): string {
    const toRad = (d: number) => ((d - 90) * Math.PI) / 180;  // rotate so 0° is 12 o'clock
    const a0 = toRad(startAngleDeg);
    const a1 = toRad(endAngleDeg);
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const large = Math.abs(endAngleDeg - startAngleDeg) > 180 ? 1 : 0;
    return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}

export function S12Rebalance() {
    const [phase, setPhase] = useState(0);

    // Sweep hand — orbits the dial with a "dwell on event" behavior:
    //   • fast travel between events so empty hours don't drag
    //   • on entry to an arc, lock the sweep at the arc's midpoint and hold ~2.6s
    //     so the caption is readable, then release and resume travel
    const [sweepHour, setSweepHour] = useState(5.5);
    const dwellRef = useRef<{ active: boolean; eventIdx: number; releaseAt: number }>({ active: false, eventIdx: -1, releaseAt: 0 });

    useEffect(() => {
        if (phase < 3) return;
        let raf = 0;
        let last = performance.now();
        // Travel speed: cover "non-event" hours in ~8s of total orbit, so pacing feels brisk
        // Non-event hours ≈ 24 - (events × avg 0.9h) ≈ 24 - 17 = 7 hours
        // Traveling 7h in 8s → 0.875 h/s outside events
        const travelRate = 0.9; // hours per second
        const DWELL_MS = 2600;  // 2.6 seconds to read

        const tick = (t: number) => {
            const dt = t - last;
            last = t;

            const d = dwellRef.current;

            // If we're dwelling, check if it's time to release
            if (d.active) {
                if (t >= d.releaseAt) {
                    d.active = false;
                    // Nudge forward past the event so we don't re-enter
                    const ev = EVENTS[d.eventIdx];
                    if (ev) {
                        setSweepHour(ev.startHour + ev.duration + 0.02);
                    }
                }
            } else {
                setSweepHour(prev => {
                    let next = prev + travelRate * (dt / 1000);
                    if (next >= 24) next -= 24;
                    // Check if we've entered any event range
                    const enteredIdx = EVENTS.findIndex(ev =>
                        next >= ev.startHour && next <= ev.startHour + ev.duration &&
                        !(prev >= ev.startHour && prev <= ev.startHour + ev.duration)
                    );
                    if (enteredIdx >= 0) {
                        const ev = EVENTS[enteredIdx];
                        dwellRef.current = { active: true, eventIdx: enteredIdx, releaseAt: t + DWELL_MS };
                        // Park the sweep at the arc's midpoint for visual elegance
                        return ev.startHour + ev.duration / 2;
                    }
                    return next;
                });
            }

            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [phase]);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 900),
            setTimeout(() => setPhase(3), 1700),
            setTimeout(() => setPhase(4), 2600),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    // Measure clock container so the SVG scales with available space
    const clockRef = useRef<HTMLDivElement>(null);
    const [clockSize, setClockSize] = useState(600);
    useEffect(() => {
        const el = clockRef.current;
        if (!el) return;
        const update = () => {
            const r = el.getBoundingClientRect();
            setClockSize(Math.min(r.width, r.height));
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Only light up events whose start hour the sweep has passed this cycle
    const activatedEvents = useMemo(() => {
        return EVENTS.map(ev => ({ ...ev, active: sweepHour >= ev.startHour }));
    }, [sweepHour]);

    // Hover state for events
    const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);

    // Focused event: the one the sweep is currently crossing
    const focusedEvent = useMemo(() => {
        const found = EVENTS.find(ev =>
            sweepHour >= ev.startHour && sweepHour <= ev.startHour + ev.duration
        );
        return found ?? null;
    }, [sweepHour]);

    // Cumulative lift delivered so far today
    const cumulativeLift = useMemo(() => {
        return EVENTS
            .filter(ev => sweepHour >= ev.startHour + ev.duration)
            .reduce((sum, ev) => sum + ev.lift, 0);
    }, [sweepHour]);

    // Rotating "what you're seeing" explainer — indexed by quarter of the sweep.
    // Teaches the viewer the visual language of the dial in a way that's
    // synchronized to the sweep's progress (not independent animation).
    const explainerIdx = Math.min(4, Math.floor((sweepHour / 24) * 5));
    const EXPLAINERS = [
        "Each arc on this dial is a rebalance Brain executed overnight — a decision to move cars from one branch to another the moment the math crossed.",
        "The six rings map to your six branches, innermost to outermost. When Brain acts on a branch, an arc lights up on that branch's ring at the hour it happened.",
        "Arc thickness shows how many cars moved. Green is cars arriving to capture demand. Amber is cars departing toward a branch that needs them more.",
        "The sweep hand traces the day. Watch it cross an arc — that's Brain identifying slack, doing the math, and booking the lift in under twenty milliseconds.",
        "Every arc delivered revenue you would have otherwise left on the table. The center total is that value, compounding hour by hour, branch by branch.",
    ];

    // Event count completed
    const completedCount = useMemo(() => {
        return EVENTS.filter(ev => sweepHour >= ev.startHour + ev.duration).length;
    }, [sweepHour]);

    // SVG dimensions
    const size = clockSize;
    const cx = size / 2;
    const cy = size / 2;

    // Compute the outermost ring radius and overall visual extent
    const outerR = RING_INNER + (BRANCHES.length - 1) * RING_STEP + RING_WIDTH / 2;

    return (
        <section className="h-full w-full relative overflow-hidden" style={{ backgroundColor: "#0a1020" }}>
            {/* Ambient: radial vignette centered on dial */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(30,41,59,0.25) 0%, transparent 70%)" }}
            />

            <div className="absolute inset-0 z-10 flex flex-col" style={{ paddingTop: 48, paddingBottom: 96, paddingLeft: 160, paddingRight: 72 }}>

                {/* Publication-style header */}
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-slate-400">Fleetora · Intelligence</span>
                        <span className="text-slate-700">/</span>
                        <span className="text-[10px] tracking-wider text-slate-500">Chapter II — The Fleet Clock</span>
                    </div>
                    <span className="text-[10px] tracking-wider text-slate-500 tabular-nums">02 / 04</span>
                </motion.div>

                {/* ── Big dial is the slide. Headline tucked into top-left so the
                       radial composition is hero, not a subtitle-plus-viz arrangement. ── */}
                <div className="flex-1 min-h-0 relative">

                    {/* Top-left column: sales-ready narration stack.
                          1. Eyebrow term "WHAT IS A FLEET CLOCK?"
                          2. One-line definition (the salesperson's read-aloud line)
                          3. Three-bullet reading key ("how to look at it")
                          4. Live rotating explainer synced to the sweep
                       Sized ≤ 380px so it doesn't fight the dial. */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="absolute top-6 left-0 max-w-[380px] z-20"
                    >
                        <h1 className="text-[28px] md:text-[32px] font-semibold text-white tracking-[-0.02em] leading-[1.08]">
                            A day of arbitrage,
                            <span className="text-slate-500"> on one dial.</span>
                        </h1>

                        {/* Sales-ready definition block */}
                        <div
                            className="mt-5 rounded-lg border px-4 py-3.5"
                            style={{ background: "rgba(15,22,38,0.55)", borderColor: "rgba(34,211,238,0.22)" }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[8.5px] uppercase tracking-[0.3em] text-cyan-400 font-bold">What is a Fleet Clock?</span>
                            </div>
                            <p className="text-[12.5px] text-slate-100 leading-[1.55] font-medium">
                                A <span className="text-white font-semibold">24-hour summary</span> of every autonomous decision Brain made across your network —
                                <span className="text-slate-400"> one ring per branch, one arc per move, in the order it happened.</span>
                            </p>
                            <div className="mt-3 pt-3 space-y-1.5 border-t" style={{ borderColor: "rgba(148,163,184,0.12)" }}>
                                <div className="flex items-start gap-2.5 text-[11px] text-slate-300 leading-snug">
                                    <span className="text-slate-500 tabular-nums font-mono mt-[1px]">01</span>
                                    <span><span className="text-white font-medium">Rings</span> = branches. Inner is highest volume.</span>
                                </div>
                                <div className="flex items-start gap-2.5 text-[11px] text-slate-300 leading-snug">
                                    <span className="text-slate-500 tabular-nums font-mono mt-[1px]">02</span>
                                    <span><span className="text-white font-medium">Arcs</span> = rebalances. Thicker arc = more cars moved.</span>
                                </div>
                                <div className="flex items-start gap-2.5 text-[11px] text-slate-300 leading-snug">
                                    <span className="text-slate-500 tabular-nums font-mono mt-[1px]">03</span>
                                    <span><span className="text-emerald-400 font-medium">Green</span> arrives · <span className="text-amber-400 font-medium">amber</span> departs · <span className="text-cyan-400 font-medium">sweep</span> is now.</span>
                                </div>
                            </div>
                        </div>

                        {/* Live explainer — rotating caption synced to the sweep. */}
                        <div className="mt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <motion.span
                                    className="w-1 h-1 rounded-full bg-cyan-400"
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 1.4, repeat: Infinity }}
                                />
                                <span className="text-[9px] uppercase tracking-[0.3em] text-cyan-400 font-medium">Follow the sweep</span>
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={explainerIdx}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.4 }}
                                    className="text-[12px] text-slate-300 leading-[1.55] font-light italic"
                                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                                >
                                    {EXPLAINERS[explainerIdx]}
                                </motion.p>
                            </AnimatePresence>
                            <div className="mt-2.5 flex items-center gap-1.5">
                                {EXPLAINERS.map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-[2px] rounded-full transition-all"
                                        style={{
                                            width: i === explainerIdx ? 18 : 8,
                                            background: i === explainerIdx ? "#22d3ee" : i < explainerIdx ? "rgba(34,211,238,0.4)" : "rgba(148,163,184,0.18)",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Legend — branches labelled on top-right */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="absolute top-6 right-0 z-20"
                    >
                        <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-medium mb-2.5 text-right">Rings · inner → outer</p>
                        <div className="space-y-1.5">
                            {BRANCHES.map((b) => (
                                <div key={b.id} className="flex items-center justify-end gap-2.5">
                                    <span className="text-[11px] text-slate-300 tabular-nums">{b.name}</span>
                                    <span className="text-[9px] text-slate-600 tabular-nums w-6 text-right">R{b.ringIdx + 1}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* The dial itself — centered in container */}
                    <div ref={clockRef} className="absolute inset-0 flex items-center justify-center">
                        <motion.svg
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            width={size}
                            height={size}
                            viewBox={`0 0 ${size} ${size}`}
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                        >
                            <defs>
                                <radialGradient id="dialCenter" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.6" />
                                    <stop offset="100%" stopColor="#0a1020" stopOpacity="0" />
                                </radialGradient>
                                <filter id="dialGlow">
                                    <feGaussianBlur stdDeviation="4" />
                                    <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                            </defs>

                            {/* Center dome */}
                            <circle cx={cx} cy={cy} r={RING_INNER - 16} fill="url(#dialCenter)" />

                            {/* 24 hour ticks — every hour, longer on 6/12/18/24 */}
                            {Array.from({ length: 24 }, (_, h) => {
                                const ang = hourToAngle(h);
                                const rad = ((ang - 90) * Math.PI) / 180;
                                const isMajor = h % 6 === 0;
                                const rInner = outerR + 8;
                                const rOuter = outerR + (isMajor ? 22 : 14);
                                const x1 = cx + rInner * Math.cos(rad);
                                const y1 = cy + rInner * Math.sin(rad);
                                const x2 = cx + rOuter * Math.cos(rad);
                                const y2 = cy + rOuter * Math.sin(rad);
                                const tx = cx + (rOuter + 16) * Math.cos(rad);
                                const ty = cy + (rOuter + 16) * Math.sin(rad);
                                return (
                                    <g key={`tick-${h}`}>
                                        <line x1={x1} y1={y1} x2={x2} y2={y2}
                                            stroke={isMajor ? "rgba(148,163,184,0.5)" : "rgba(148,163,184,0.18)"}
                                            strokeWidth={isMajor ? 1.2 : 0.7}
                                        />
                                        {isMajor && (
                                            <text x={tx} y={ty + 4}
                                                textAnchor="middle"
                                                fill="rgba(148,163,184,0.7)"
                                                fontSize="11"
                                                fontWeight="600"
                                                letterSpacing="1"
                                            >
                                                {String(h).padStart(2, "0")}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}

                            {/* Ring tracks — one per branch, full circle, muted */}
                            {BRANCHES.map((b) => {
                                const r = RING_INNER + b.ringIdx * RING_STEP;
                                return (
                                    <circle key={`track-${b.id}`}
                                        cx={cx} cy={cy} r={r}
                                        fill="none"
                                        stroke="rgba(148,163,184,0.07)"
                                        strokeWidth={RING_WIDTH}
                                    />
                                );
                            })}

                            {/* Ring labels removed from the dial — the top-right legend already
                                maps R1→Airport, R2→Downtown, etc. Drawing both creates a horizontal
                                pileup on the left where all six labels stack at the same y. */}

                            {/* Rebalance arcs — one per event, drawn on its branch's ring */}
                            {activatedEvents.map((ev, i) => {
                                const branch = BRANCHES.find(b => b.id === ev.branchId);
                                if (!branch) return null;
                                const r = RING_INNER + branch.ringIdx * RING_STEP;
                                const startDeg = hourToAngle(ev.startHour);
                                const endDeg = hourToAngle(ev.startHour + ev.duration);
                                const thickness = 8 + Math.min(16, ev.units * 3);
                                const color = ev.direction === "in" ? "#34d399" : "#fbbf24";
                                const isFocused = focusedEvent && EVENTS.indexOf(focusedEvent) === i;
                                const isHovered = hoveredEvent === i;
                                return (
                                    <motion.path
                                        key={`ev-${i}`}
                                        d={arcPath(cx, cy, r, startDeg, endDeg)}
                                        fill="none"
                                        stroke={color}
                                        strokeWidth={thickness}
                                        strokeLinecap="round"
                                        initial={{ opacity: 0, pathLength: 0 }}
                                        animate={{
                                            opacity: ev.active ? (isHovered || isFocused ? 1 : 0.78) : 0,
                                            pathLength: ev.active ? 1 : 0,
                                            filter: isFocused ? `drop-shadow(0 0 10px ${color})` : "none",
                                        }}
                                        transition={{ duration: 0.45, ease: "easeOut" }}
                                        style={{ cursor: "pointer", pointerEvents: "stroke" }}
                                        onMouseEnter={() => setHoveredEvent(i)}
                                        onMouseLeave={() => setHoveredEvent(null)}
                                    />
                                );
                            })}

                            {/* Sweep hand — visible, tapered gradient from center to tip */}
                            {phase >= 3 && (() => {
                                const ang = ((hourToAngle(sweepHour) - 90) * Math.PI) / 180;
                                const tipR = outerR + 4;
                                const innerR = RING_INNER - 18;
                                const x1 = cx + innerR * Math.cos(ang);
                                const y1 = cy + innerR * Math.sin(ang);
                                const x2 = cx + tipR * Math.cos(ang);
                                const y2 = cy + tipR * Math.sin(ang);
                                return (
                                    <g>
                                        {/* Thick underglow */}
                                        <line
                                            x1={x1} y1={y1} x2={x2} y2={y2}
                                            stroke="#22d3ee"
                                            strokeWidth={6}
                                            strokeLinecap="round"
                                            opacity={0.22}
                                        />
                                        {/* Main blade */}
                                        <line
                                            x1={x1} y1={y1} x2={x2} y2={y2}
                                            stroke="#22d3ee"
                                            strokeWidth={2.4}
                                            strokeLinecap="round"
                                            opacity={0.95}
                                        />
                                        {/* Tip beacon */}
                                        <circle cx={x2} cy={y2} r={5} fill="#22d3ee" opacity={0.35} />
                                        <circle cx={x2} cy={y2} r={3} fill="#67e8f9" />
                                        <circle cx={x2} cy={y2} r={1.2} fill="#ffffff" />
                                        {/* Dwell pulse — when focused on an event, emit an expanding ring to
                                            signal "stopping to read" instead of looking like the sweep has frozen */}
                                        {focusedEvent && (
                                            <motion.circle
                                                cx={x2} cy={y2}
                                                r={6}
                                                fill="none"
                                                stroke="#22d3ee"
                                                strokeWidth="1"
                                                initial={{ scale: 0.6, opacity: 0.8 }}
                                                animate={{ scale: [0.6, 2.4], opacity: [0.8, 0] }}
                                                transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                                                style={{ transformOrigin: `${x2}px ${y2}px`, transformBox: "fill-box" }}
                                            />
                                        )}
                                    </g>
                                );
                            })()}

                            {/* Center pivot — slightly larger, with ring */}
                            {phase >= 3 && (
                                <g>
                                    <circle cx={cx} cy={cy} r={8} fill="rgba(34,211,238,0.12)" />
                                    <circle cx={cx} cy={cy} r={4.5} fill="#22d3ee" />
                                    <circle cx={cx} cy={cy} r={1.8} fill="#0a1020" />
                                </g>
                            )}
                        </motion.svg>
                    </div>

                    {/* Center panel overlay — value delivered + current event */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={phase >= 3 ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div className="text-center">
                            <p className="text-[9px] uppercase tracking-[0.4em] text-slate-500 font-medium mb-1">Value delivered · today</p>
                            <div className="flex items-baseline gap-1.5 justify-center">
                                <motion.span
                                    key={cumulativeLift}
                                    initial={{ opacity: 0.7 }}
                                    animate={{ opacity: 1 }}
                                    className="text-[48px] md:text-[56px] font-semibold text-white tabular-nums leading-none tracking-tight"
                                >
                                    {cumulativeLift.toLocaleString()}
                                </motion.span>
                                <span className="text-[15px] text-slate-500 font-medium">JOD</span>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-6 text-[9px] uppercase tracking-[0.28em] text-slate-500 font-medium">
                                <span className="flex items-baseline gap-1.5 tabular-nums">
                                    <span className="text-slate-200 text-[13px] font-semibold tabular-nums">{completedCount}</span>
                                    <span>booked</span>
                                </span>
                                <span className="w-px h-3 bg-slate-700" />
                                <span className="flex items-baseline gap-1.5 tabular-nums">
                                    <span className="text-slate-200 text-[13px] font-semibold tabular-nums">{EVENTS.length - completedCount}</span>
                                    <span>queued</span>
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Docent caption: a small card that orbits alongside the sweep hand.
                           It appears WHEN the sweep is crossing an arc, positioned outside the
                           outer tick ring near the sweep tip, with a hair leader line from the
                           arc to the card. This makes the dial self-explanatory — the viewer's
                           eye is already on the sweep, and narration arrives where they're looking. ── */}
                    {phase >= 3 && focusedEvent && (() => {
                        const branch = BRANCHES.find(b => b.id === focusedEvent.branchId);
                        if (!branch) return null;

                        // Caption anchors to the sweep tip, offset outward
                        const ang = ((hourToAngle(sweepHour) - 90) * Math.PI) / 180;
                        // Caption box offset radius
                        const captionR = outerR + 60;
                        const rawX = cx + captionR * Math.cos(ang);
                        const rawY = cy + captionR * Math.sin(ang);

                        // Normalize container coords — the SVG is centered, so we position
                        // the caption in absolute % of the dial container.
                        const leftPct = (rawX / size) * 100;
                        const topPct = (rawY / size) * 100;

                        // Anchor side — flip card left/right of sweep tip to avoid clipping
                        const isRight = Math.cos(ang) >= 0;

                        return (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={EVENTS.indexOf(focusedEvent)}
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.92 }}
                                    transition={{ duration: 0.25 }}
                                    className="absolute pointer-events-none z-20"
                                    style={{
                                        left: `calc(50% + ${rawX - size / 2}px)`,
                                        top: `calc(50% + ${rawY - size / 2}px)`,
                                        transform: isRight ? "translate(8px, -50%)" : "translate(calc(-100% - 8px), -50%)",
                                    }}
                                >
                                    <div
                                        className="px-3.5 py-2 rounded-lg border"
                                        style={{
                                            background: "rgba(10,16,32,0.92)",
                                            borderColor: focusedEvent.direction === "in" ? "rgba(52,211,153,0.45)" : "rgba(251,191,36,0.45)",
                                            backdropFilter: "blur(10px)",
                                            boxShadow: "0 8px 24px -8px rgba(0,0,0,0.6)",
                                            minWidth: 200,
                                            maxWidth: 260,
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] tabular-nums font-mono text-slate-400">
                                                {String(Math.floor(focusedEvent.startHour)).padStart(2, "0")}:
                                                {String(Math.round((focusedEvent.startHour % 1) * 60)).padStart(2, "0")}
                                            </span>
                                            <span
                                                className="text-[8px] uppercase tracking-[0.2em] font-bold px-1.5 py-[1px] rounded"
                                                style={{
                                                    color: focusedEvent.direction === "in" ? "#34d399" : "#fbbf24",
                                                    background: focusedEvent.direction === "in" ? "rgba(52,211,153,0.12)" : "rgba(251,191,36,0.12)",
                                                }}
                                            >
                                                {focusedEvent.direction === "in" ? "Inbound" : "Outbound"}
                                            </span>
                                        </div>
                                        <p className="text-[12.5px] text-white leading-snug font-medium">
                                            Brain {focusedEvent.direction === "in" ? "pulled" : "released"}{" "}
                                            <span className="tabular-nums font-semibold">{focusedEvent.units}</span>{" "}
                                            {focusedEvent.units === 1 ? "car" : "cars"}{" "}
                                            {focusedEvent.direction === "in" ? "into" : "from"}{" "}
                                            <span className="font-semibold">{branch.name}</span>
                                            <span className="text-slate-400"> {focusedEvent.direction === "in" ? "from" : "to"} </span>
                                            <span className="font-semibold">{focusedEvent.partner}</span>.
                                        </p>
                                        <div className="mt-2 pt-2 border-t flex items-baseline justify-between"
                                            style={{ borderColor: "rgba(148,163,184,0.12)" }}
                                        >
                                            <span className="text-[9px] uppercase tracking-[0.25em] text-slate-500">Lift captured</span>
                                            <span className="text-[14px] font-semibold tabular-nums" style={{ color: focusedEvent.direction === "in" ? "#34d399" : "#fbbf24" }}>
                                                +{focusedEvent.lift} JOD
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        );
                    })()}
                </div>

                {/* Bottom footer strip — single sentence of value */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={phase >= 4 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0 mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-slate-500 font-medium"
                >
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: "#34d399" }} />
                            <span>Inbound · car arrives</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: "#fbbf24" }} />
                            <span>Outbound · car departs</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: "#22d3ee" }} />
                            <span>Sweep · current hour</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                        <span>Decision latency 18 ms</span>
                        <span>·</span>
                        <span>Manual inputs 0</span>
                        <span>·</span>
                        <span>Every hour, autonomously</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
