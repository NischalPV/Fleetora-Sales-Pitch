"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────
// S17 — Chapter V · 03 / 05 · "The Price Matrix · Live"
// Interactive rate-matrix heatmap with a live P&L prediction
// panel. Scenarios auto-play: nudge a cell, projection panel
// updates with revenue / margin / utilization / cash-runway
// deltas. Ends on a cumulative 3-scenario view.
// ─────────────────────────────────────────────────────────

const INTRO_FADE_IN = 0.9;
const INTRO_SETTLE_START = 1.25;
const INTRO_SETTLE_END = 2.15;
const STAGE_REVEAL_START = 1.95;
const STAGE_REVEAL_END = 2.6;

// Scene timeline (all in seconds relative to scene clock)
const MATRIX_MATERIALIZE = 0.1;    // 0.1 → 1.3
const MATRIX_MATERIALIZE_END = 1.4;
const BASELINE_SHOW = 1.6;
const SC1_START = 3.0;   // Scenario 1: Corporate × SUV +12%
const SC2_START = 6.8;   // Scenario 2: Retail × Economy -5%
const SC3_START = 10.5;  // Scenario 3: VIP × Luxury +8%
const SC4_START = 14.2;  // Scenario 4: Retail × Mid-size -12% (downside stress-test)
const COMPOUND_START = 18.2;
const HOLD_END = 25.0;
const LOOP_TOTAL = 27.0;

function clamp(x: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, x)); }
function ease(x: number) { return 1 - Math.pow(1 - clamp(x), 3); }
function easeInOut(x: number) {
    const t = clamp(x);
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// Segment × class baseline rates (AED/day)
type Segment = "Retail" | "Corporate" | "VIP" | "Enterprise";
type VClass = "Economy" | "Mid-size" | "SUV" | "Luxury";

const SEGMENTS: Segment[] = ["Retail", "Corporate", "VIP", "Enterprise"];
const CLASSES: VClass[] = ["Economy", "Mid-size", "SUV", "Luxury"];

// Baseline rates per (segment, class)
const BASE_RATES: Record<Segment, Record<VClass, number>> = {
    Retail:     { Economy: 180, "Mid-size": 240, SUV: 340, Luxury: 560 },
    Corporate:  { Economy: 158, "Mid-size": 212, SUV: 300, Luxury: 495 },
    VIP:        { Economy: 170, "Mid-size": 225, SUV: 320, Luxury: 520 },
    Enterprise: { Economy: 148, "Mid-size": 198, SUV: 280, Luxury: 460 },
};

// Scenario definitions
interface Scenario {
    seg: Segment;
    cls: VClass;
    pct: number;       // percent change applied
    label: string;     // short label
    reason: string;    // one-liner reason
    impact: {
        revMo: number;     // AED / month
        marginPts: number; // points
        utilPct: number;   // %
        cashDays: number;  // runway days
    };
}

const SCENARIOS: Scenario[] = [
    {
        seg: "Corporate", cls: "SUV", pct: +12,
        label: "Corp · SUV weekend premium",
        reason: "Weekend SUV demand outruns supply",
        impact: { revMo: 34000, marginPts: 2.1, utilPct: -4, cashDays: 6 },
    },
    {
        seg: "Retail", cls: "Economy", pct: -5,
        label: "Retail · Economy loss-leader",
        reason: "Drive weekday fleet utilization",
        impact: { revMo: -11000, marginPts: -0.6, utilPct: +7, cashDays: -2 },
    },
    {
        seg: "VIP", cls: "Luxury", pct: +8,
        label: "VIP · Luxury peak-season",
        reason: "Peak-season elasticity ≈ 0 on luxury",
        impact: { revMo: 59000, marginPts: 3.4, utilPct: -1, cashDays: 9 },
    },
    {
        seg: "Retail", cls: "Mid-size", pct: -12,
        label: "Retail · Mid-size aggressive cut",
        reason: "Stress-test · compete with ride-hail",
        impact: { revMo: -118000, marginPts: -3.2, utilPct: +4, cashDays: -10 },
    },
];

// ─── Word reveal for heading ─────────────────────────────
function WordReveal({
    progress,
    parts,
}: {
    progress: number;
    parts: Array<{ text: string; className?: string }>;
}) {
    const flat = useMemo(() => {
        const out: Array<{ word: string; className?: string; key: string; isSpace: boolean }> = [];
        parts.forEach((p, pi) => {
            const tokens = p.text.split(/(\s+)/);
            tokens.forEach((tok, ti) => {
                if (tok.length === 0) return;
                out.push({ word: tok, className: p.className, key: `${pi}-${ti}`, isSpace: tok.trim().length === 0 });
            });
        });
        return out;
    }, [parts]);
    const wordCount = Math.max(1, flat.filter(t => !t.isSpace).length);
    let widx = -1;
    return (
        <>
            {flat.map((t) => {
                if (t.isSpace) return <span key={t.key}>{" "}</span>;
                widx++;
                const delay = (widx / wordCount) * 0.75;
                const wP = clamp((progress - delay) / 0.3);
                return (
                    <span
                        key={t.key}
                        className={t.className}
                        style={{
                            display: "inline-block",
                            opacity: wP,
                            filter: `blur(${(1 - wP) * 8}px)`,
                            transform: `translateY(${(1 - wP) * 14}px)`,
                        }}
                    >
                        {t.word}
                    </span>
                );
            })}
        </>
    );
}

// ─── MAIN ────────────────────────────────────────────────
export function S17Payments() {
    const [paused, setPaused] = useState(false);
    const [, setTick] = useState(0);
    const pausedRef = useRef(false);
    pausedRef.current = paused;

    const wallRef = useRef(0);
    const sceneRef = useRef(0);

    useEffect(() => {
        let raf = 0;
        let last = performance.now();
        const frame = (now: number) => {
            const dt = (now - last) / 1000;
            last = now;
            wallRef.current += dt;
            if (wallRef.current >= STAGE_REVEAL_START && !pausedRef.current) {
                sceneRef.current += dt;
                if (sceneRef.current >= LOOP_TOTAL) sceneRef.current = sceneRef.current % LOOP_TOTAL;
            }
            setTick((t) => (t + 1) & 0x7fffffff);
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, []);

    const wall = wallRef.current;
    const scene = sceneRef.current;

    const introFadeT = ease(clamp(wall / INTRO_FADE_IN));
    const settleT = ease(clamp((wall - INTRO_SETTLE_START) / (INTRO_SETTLE_END - INTRO_SETTLE_START)));
    const stageRevealT = ease(clamp((wall - STAGE_REVEAL_START) / (STAGE_REVEAL_END - STAGE_REVEAL_START)));

    // Per-scenario active state
    const sc1Active = scene >= SC1_START;
    const sc2Active = scene >= SC2_START;
    const sc3Active = scene >= SC3_START;
    const sc4Active = scene >= SC4_START;
    const compoundActive = scene >= COMPOUND_START;

    const sc1P = ease(clamp((scene - SC1_START) / 1.3));
    const sc2P = ease(clamp((scene - SC2_START) / 1.3));
    const sc3P = ease(clamp((scene - SC3_START) / 1.3));
    const sc4P = ease(clamp((scene - SC4_START) / 1.3));
    const compoundP = ease(clamp((scene - COMPOUND_START) / 1.5));

    // Which scenario is currently "fresh" (for pulse rings)
    const currentScenarioIdx =
        compoundActive ? -1 :
        sc4Active ? 3 :
        sc3Active ? 2 :
        sc2Active ? 1 :
        sc1Active ? 0 : -1;

    // Matrix materialization progress
    const matrixP = ease(clamp((scene - MATRIX_MATERIALIZE) / (MATRIX_MATERIALIZE_END - MATRIX_MATERIALIZE)));

    // Scenarios accumulate: once fired, they stay fully applied; the newest one eases in with its mix value.
    const activeScenarios: Array<Scenario & { mix: number }> = [];
    if (compoundActive) {
        activeScenarios.push({ ...SCENARIOS[0], mix: 1 });
        activeScenarios.push({ ...SCENARIOS[1], mix: 1 });
        activeScenarios.push({ ...SCENARIOS[2], mix: 1 });
        activeScenarios.push({ ...SCENARIOS[3], mix: 1 });
    } else if (sc4Active) {
        activeScenarios.push({ ...SCENARIOS[0], mix: 1 });
        activeScenarios.push({ ...SCENARIOS[1], mix: 1 });
        activeScenarios.push({ ...SCENARIOS[2], mix: 1 });
        activeScenarios.push({ ...SCENARIOS[3], mix: sc4P });
    } else if (sc3Active) {
        activeScenarios.push({ ...SCENARIOS[0], mix: 1 });
        activeScenarios.push({ ...SCENARIOS[1], mix: 1 });
        activeScenarios.push({ ...SCENARIOS[2], mix: sc3P });
    } else if (sc2Active) {
        activeScenarios.push({ ...SCENARIOS[0], mix: 1 });
        activeScenarios.push({ ...SCENARIOS[1], mix: sc2P });
    } else if (sc1Active) {
        activeScenarios.push({ ...SCENARIOS[0], mix: sc1P });
    }

    const totalRevMo = activeScenarios.reduce((s, sc) => s + sc.impact.revMo * (sc.mix ?? 1), 0);
    const totalMarginPts = activeScenarios.reduce((s, sc) => s + sc.impact.marginPts * (sc.mix ?? 1), 0);
    const totalUtilPct = activeScenarios.reduce((s, sc) => s + sc.impact.utilPct * (sc.mix ?? 1), 0);
    const totalCashDays = activeScenarios.reduce((s, sc) => s + sc.impact.cashDays * (sc.mix ?? 1), 0);

    // Mapping rate → heat color (cool blue 180 → warm amber/rose 600)
    const rateToColor = (rate: number) => {
        const t = clamp((rate - 140) / (580 - 140));
        // Cool (#60a5fa) → mid (#fbbf24) → warm (#fb7185)
        if (t < 0.5) {
            const k = t / 0.5;
            return { r: lerp(96, 251, k), g: lerp(165, 191, k), b: lerp(250, 36, k) };
        } else {
            const k = (t - 0.5) / 0.5;
            return { r: lerp(251, 251, k), g: lerp(191, 113, k), b: lerp(36, 133, k) };
        }
    };
    const cssRGB = (c: { r: number; g: number; b: number }, a = 1) =>
        `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${a})`;

    // Compute rate with active scenarios applied
    const getAdjustedRate = (seg: Segment, cls: VClass) => {
        let rate = BASE_RATES[seg][cls];
        for (const sc of activeScenarios) {
            if (sc.seg === seg && sc.cls === cls) {
                rate = rate * (1 + (sc.pct / 100) * (sc.mix ?? 1));
            }
        }
        return rate;
    };

    // Is this cell's "current scenario" adjusting it? (for pulse)
    const currentAdjustedCell =
        currentScenarioIdx >= 0
            ? { seg: SCENARIOS[currentScenarioIdx].seg, cls: SCENARIOS[currentScenarioIdx].cls }
            : null;

    return (
        <section className="h-full w-full relative overflow-hidden" style={{ backgroundColor: "#0a1020" }}>
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 75% 55% at 50% 55%, rgba(251,191,36,0.06) 0%, transparent 70%)",
                }}
            />

            <div
                className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between pointer-events-none"
                style={{ padding: "32px 72px 0 72px" }}
            >
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-slate-400">Fleetora · Finance</span>
                    <span className="text-slate-700">/</span>
                    <span className="text-[10px] tracking-wider text-slate-500">Chapter V — The Price Matrix</span>
                </div>
                <span className="text-[10px] tracking-wider text-slate-500 tabular-nums">03 / 05</span>
            </div>

            {/* Heading — large centered on entry, settles up */}
            <div
                className="absolute left-0 right-0 z-20 flex flex-col items-center pointer-events-none text-center"
                style={{
                    top: "10%",
                    transform: `translateY(${lerp(34, 0, settleT)}vh) scale(${lerp(2.15, 1, settleT)})`,
                    transformOrigin: "50% 0%",
                    willChange: "transform",
                    whiteSpace: "nowrap",
                }}
            >
                <p
                    className="font-bold uppercase text-amber-300/85"
                    style={{
                        fontSize: "10px",
                        letterSpacing: "0.4em",
                        marginBottom: "8px",
                        opacity: introFadeT,
                    }}
                >
                    The Price Matrix · live
                </p>
                <h2
                    className="text-white tracking-[-0.025em] leading-[1.08]"
                    style={{ fontSize: "clamp(20px, 1.75vw, 28px)", fontWeight: 600 }}
                >
                    <WordReveal
                        progress={introFadeT}
                        parts={[
                            { text: "Change the rate. " },
                            { text: "Watch the P&L.", className: "text-amber-300" },
                        ]}
                    />
                </h2>
            </div>

            {/* Stage — matrix + projection panel */}
            <div
                className="absolute left-0 right-0 flex flex-col items-center"
                style={{
                    top: "17%",
                    bottom: "13%",
                    opacity: stageRevealT,
                    pointerEvents: stageRevealT > 0.5 ? "auto" : "none",
                }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <div className="relative grid grid-cols-[1.35fr_1fr] gap-8 items-stretch" style={{ width: "min(1480px, 86%)", height: "100%" }}>
                    {/* LEFT — Rate matrix */}
                    <MatrixPanel
                        matrixP={matrixP}
                        currentScenarioIdx={currentScenarioIdx}
                        compoundActive={compoundActive}
                        compoundP={compoundP}
                        currentAdjustedCell={currentAdjustedCell}
                        getAdjustedRate={getAdjustedRate}
                        rateToColor={rateToColor}
                        cssRGB={cssRGB}
                    />

                    {/* RIGHT — Projection panel */}
                    <ProjectionPanel
                        scene={scene}
                        sc1Active={sc1Active}
                        sc2Active={sc2Active}
                        sc3Active={sc3Active}
                        sc4Active={sc4Active}
                        sc1P={sc1P}
                        sc2P={sc2P}
                        sc3P={sc3P}
                        sc4P={sc4P}
                        compoundActive={compoundActive}
                        compoundP={compoundP}
                        totalRevMo={totalRevMo}
                        totalMarginPts={totalMarginPts}
                        totalUtilPct={totalUtilPct}
                        totalCashDays={totalCashDays}
                    />
                </div>
            </div>

            {/* Footer status */}
            <div
                className="absolute left-0 right-0 z-30 flex flex-col items-center gap-2 pointer-events-none"
                style={{ bottom: 72, opacity: stageRevealT }}
            >
                <div className="flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.25em] tabular-nums">
                    <span style={{ color: sc1Active ? "#fbbf24" : "#475569" }}>SC 01</span>
                    <span className="text-slate-700">·</span>
                    <span style={{ color: sc2Active ? "#60a5fa" : "#475569" }}>SC 02</span>
                    <span className="text-slate-700">·</span>
                    <span style={{ color: sc3Active ? "#a78bfa" : "#475569" }}>SC 03</span>
                    <span className="text-slate-700">·</span>
                    <span style={{ color: sc4Active ? "#fb7185" : "#475569" }}>SC 04 ▼</span>
                    <span className="text-slate-700">·</span>
                    <span style={{ color: compoundActive ? "#34d399" : "#475569" }}>COMPOUND</span>
                </div>
                <span
                    className="text-[9px] font-mono uppercase tracking-[0.25em] tabular-nums transition-colors duration-200"
                    style={{ color: paused ? "#fbbf24" : "rgba(148,163,184,0.45)" }}
                >
                    {paused ? "◼ paused · move cursor to resume" : "▶ hover stage to pause"}
                </span>
            </div>
        </section>
    );
}

// ─── Matrix panel ───────────────────────────────────────
function MatrixPanel({
    matrixP,
    currentScenarioIdx,
    compoundActive,
    compoundP,
    currentAdjustedCell,
    getAdjustedRate,
    rateToColor,
    cssRGB,
}: {
    matrixP: number;
    currentScenarioIdx: number;
    compoundActive: boolean;
    compoundP: number;
    currentAdjustedCell: { seg: Segment; cls: VClass } | null;
    getAdjustedRate: (seg: Segment, cls: VClass) => number;
    rateToColor: (r: number) => { r: number; g: number; b: number };
    cssRGB: (c: { r: number; g: number; b: number }, a?: number) => string;
}) {
    const cellIdx = (r: number, c: number) => r * CLASSES.length + c;
    const totalCells = SEGMENTS.length * CLASSES.length;
    return (
        <div className="relative flex flex-col h-full">
            <div className="flex items-baseline justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300">
                        Rate matrix · APR 2026 · weekday base
                    </p>
                </div>
                <span className="text-[9px] font-mono text-slate-500">AED / day</span>
            </div>

            <div className="relative rounded-xl border p-4 flex-1 flex flex-col"
                style={{
                    background: "rgba(15,22,38,0.7)",
                    borderColor: "rgba(148,163,184,0.15)",
                    boxShadow: "0 0 40px rgba(96,165,250,0.05)",
                }}
            >
                {/* Column headers */}
                <div className="grid gap-1.5 mb-1.5" style={{ gridTemplateColumns: "96px repeat(4, 1fr)" }}>
                    <div />
                    {CLASSES.map((c) => (
                        <div key={c} className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500 text-center pb-1">
                            {c}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                <div className="flex flex-col gap-1.5">
                    {SEGMENTS.map((seg, r) => (
                        <div key={seg} className="grid items-stretch gap-1.5" style={{ gridTemplateColumns: "96px repeat(4, 1fr)" }}>
                            <div className="flex items-center text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                                {seg}
                            </div>
                            {CLASSES.map((cls, c) => {
                                const cellOrder = cellIdx(r, c);
                                const revealP = clamp((matrixP * totalCells - cellOrder) / 1.8);
                                const rate = getAdjustedRate(seg, cls);
                                const color = rateToColor(rate);
                                const isCurrent = currentAdjustedCell && currentAdjustedCell.seg === seg && currentAdjustedCell.cls === cls;
                                const scIdx = SCENARIOS.findIndex(s => s.seg === seg && s.cls === cls);
                                const isScenario = scIdx >= 0;
                                const scPct = isScenario ? SCENARIOS[scIdx].pct : 0;
                                // Badge shown once that scenario has started firing
                                const scenarioApplied = isScenario && (
                                    (scIdx === 0 && currentScenarioIdx >= 0) ||
                                    (scIdx === 1 && currentScenarioIdx >= 1) ||
                                    (scIdx === 2 && currentScenarioIdx >= 2) ||
                                    compoundActive
                                );
                                return (
                                    <div
                                        key={cls}
                                        className="relative rounded-md flex flex-col items-center justify-center"
                                        style={{
                                            height: 54,
                                            background: `linear-gradient(135deg, ${cssRGB(color, 0.28)}, ${cssRGB(color, 0.12)})`,
                                            border: `1px solid ${cssRGB(color, isCurrent ? 0.9 : 0.35)}`,
                                            opacity: revealP,
                                            transform: `scale(${lerp(0.92, 1, revealP)})`,
                                            boxShadow: isCurrent ? `0 0 20px ${cssRGB(color, 0.5)}` : "none",
                                            transition: "border-color 0.3s, box-shadow 0.3s",
                                        }}
                                    >
                                        <span
                                            className="tabular-nums font-semibold"
                                            style={{
                                                fontSize: 16,
                                                color: cssRGB(color, 0.95),
                                                textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                                            }}
                                        >
                                            {Math.round(rate)}
                                        </span>
                                        {scenarioApplied && (
                                            <span
                                                className="absolute -top-1.5 -right-1.5 text-[8px] font-bold tabular-nums px-1 py-0.5 rounded"
                                                style={{
                                                    background: scPct > 0 ? "rgba(52,211,153,0.9)" : "rgba(251,113,133,0.9)",
                                                    color: "#0a1020",
                                                    boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
                                                }}
                                            >
                                                {scPct > 0 ? "+" : ""}{scPct}%
                                            </span>
                                        )}
                                        {/* Pulse ring for currently-active cell */}
                                        {isCurrent && (
                                            <div
                                                className="absolute inset-0 rounded-md pointer-events-none"
                                                style={{
                                                    border: `2px solid ${cssRGB(color, 0.8)}`,
                                                    animation: "s17pulse 1.4s ease-out infinite",
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="mt-3 flex items-center justify-between text-[8.5px] font-mono uppercase tracking-[0.18em] text-slate-500">
                    <span>Rate heat · cool → warm</span>
                    <div className="flex items-center gap-0.5 h-2">
                        {Array.from({ length: 24 }).map((_, i) => {
                            const t = i / 23;
                            const rate = 140 + t * (580 - 140);
                            const col = rateToColor(rate);
                            return <div key={i} style={{ width: 6, height: "100%", background: cssRGB(col, 0.85) }} />;
                        })}
                    </div>
                    <span>AED 140 — 580</span>
                </div>

                {/* Pricing calendar — Apr 2026 with day-level modifiers (weekends, festivals, demand) */}
                <PricingCalendar />
            </div>

            <style>{`
                @keyframes s17pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(1.12); opacity: 0; }
                }
            `}</style>
        </div>
    );
}

// ─── Projection panel ───────────────────────────────────
function ProjectionPanel({
    scene,
    sc1Active,
    sc2Active,
    sc3Active,
    sc4Active,
    sc1P,
    sc2P,
    sc3P,
    sc4P,
    compoundActive,
    compoundP,
    totalRevMo,
    totalMarginPts,
    totalUtilPct,
    totalCashDays,
}: {
    scene: number;
    sc1Active: boolean;
    sc2Active: boolean;
    sc3Active: boolean;
    sc4Active: boolean;
    sc1P: number;
    sc2P: number;
    sc3P: number;
    sc4P: number;
    compoundActive: boolean;
    compoundP: number;
    totalRevMo: number;
    totalMarginPts: number;
    totalUtilPct: number;
    totalCashDays: number;
}) {
    // Baseline metrics
    const baselineRev = 1_284_000;
    const baselineMargin = 42.0;
    const baselineUtil = 78;
    const baselineRunway = 47;

    const projRev = baselineRev + totalRevMo;
    const projMargin = baselineMargin + totalMarginPts;
    const projUtil = baselineUtil + totalUtilPct;
    const projRunway = baselineRunway + totalCashDays;

    const deltaColor = (v: number) => v >= 0 ? "#34d399" : "#fb7185";
    const baselineShown = ease(clamp((scene - BASELINE_SHOW) / 0.8));

    // AR 30-day curves — baseline vs projected (diverges as scenarios apply)
    const baselineAR = useMemo(() => {
        const pts: number[] = [];
        for (let i = 0; i < 30; i++) {
            pts.push(420 + i * 11 + Math.sin(i / 4) * 8);
        }
        return pts;
    }, []);
    const projectedAR = useMemo(() => {
        const pts: number[] = [];
        const scaledImpact = totalRevMo / 1000; // thousands per month
        for (let i = 0; i < 30; i++) {
            const base = 420 + i * 11 + Math.sin(i / 4) * 8;
            // Divergence ramps over the month
            const kick = scaledImpact * (i / 30);
            pts.push(base + kick);
        }
        return pts;
    }, [totalRevMo]);

    return (
        <div className="relative h-full flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-300">
                        30-day projection · live
                    </p>
                </div>
                <span className="text-[9px] font-mono text-slate-500">
                    {compoundActive ? "Compound" : sc4Active ? "Scenario 4 · downside" : sc3Active ? "Scenario 3" : sc2Active ? "Scenario 2" : sc1Active ? "Scenario 1" : "Baseline"}
                </span>
            </div>

            {/* Baseline summary card */}
            <div
                className="rounded-xl border p-3"
                style={{
                    background: "rgba(15,22,38,0.7)",
                    borderColor: "rgba(148,163,184,0.15)",
                    opacity: baselineShown,
                }}
            >
                <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500">Current plan · baseline</span>
                    <span className="text-[8px] font-mono text-slate-600">APR 2026</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    <KPI label="Revenue / mo" value={`AED ${(projRev / 1000).toFixed(0)}K`} delta={totalRevMo} deltaPrefix="AED" deltaScale="k" />
                    <KPI label="Gross margin" value={`${projMargin.toFixed(1)}%`} delta={totalMarginPts} deltaPrefix="" deltaSuffix=" pts" precision={1} />
                    <KPI label="Utilization" value={`${projUtil.toFixed(0)}%`} delta={totalUtilPct} deltaPrefix="" deltaSuffix="%" precision={1} />
                    <KPI label="Cash runway" value={`${projRunway.toFixed(0)} d`} delta={totalCashDays} deltaPrefix="" deltaSuffix=" d" precision={1} />
                </div>
            </div>

            {/* Scenario-log card */}
            <div
                className="rounded-xl border p-3"
                style={{
                    background: "rgba(15,22,38,0.7)",
                    borderColor: "rgba(148,163,184,0.15)",
                    opacity: baselineShown,
                }}
            >
                <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500">Applied scenarios</span>
                </div>
                <div className="flex flex-col gap-1.5">
                    {SCENARIOS.map((sc, i) => {
                        const active = i === 0 ? sc1Active : i === 1 ? sc2Active : i === 2 ? sc3Active : sc4Active;
                        const mix = i === 0 ? sc1P : i === 1 ? sc2P : i === 2 ? sc3P : sc4P;
                        const toneBg = i === 0 ? "251,191,36" : i === 1 ? "96,165,250" : i === 2 ? "167,139,250" : "251,113,133";
                        const show = (active && mix > 0) || compoundActive;
                        return (
                            <div
                                key={sc.label}
                                className="flex items-center gap-3 text-[10px] rounded border px-2 py-1.5"
                                style={{
                                    background: `rgba(${toneBg}, ${show ? 0.08 : 0.03})`,
                                    borderColor: `rgba(${toneBg}, ${show ? 0.4 : 0.12})`,
                                    opacity: show ? 1 : 0.4,
                                    transform: `translateX(${show ? 0 : -4}px)`,
                                    transition: "opacity 0.3s, background 0.3s, border-color 0.3s, transform 0.3s",
                                }}
                            >
                                <span
                                    className="text-[8.5px] font-mono tabular-nums px-1.5 py-0.5 rounded"
                                    style={{ background: `rgba(${toneBg}, 0.25)`, color: `rgba(${toneBg}, 1)` }}
                                >
                                    {sc.pct > 0 ? "+" : ""}{sc.pct}%
                                </span>
                                <span className="text-slate-300 flex-1 truncate">{sc.label}</span>
                                <span className="text-[8.5px] font-mono text-slate-500 tabular-nums">
                                    {sc.impact.revMo > 0 ? "+" : ""}{(sc.impact.revMo / 1000).toFixed(0)}K/mo
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* AR projection sparkline */}
            <div
                className="rounded-xl border p-3 flex-1 flex flex-col"
                style={{
                    background: "rgba(15,22,38,0.7)",
                    borderColor: "rgba(148,163,184,0.15)",
                    opacity: baselineShown,
                }}
            >
                <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500">AR receivables · 30-day projection</span>
                    <span className="text-[9px] tabular-nums text-slate-400">
                        <span className="text-slate-500">Apr end · </span>
                        <span className="font-semibold text-white">AED {Math.round(projectedAR[projectedAR.length - 1])}K</span>
                    </span>
                </div>
                <div className="relative flex-1 min-h-[72px]">
                    <DualLine baseline={baselineAR} projected={projectedAR} />
                </div>
                <div className="mt-1 flex items-center gap-3 text-[8px] font-mono uppercase tracking-[0.15em]">
                    <span className="flex items-center gap-1 text-slate-500">
                        <span className="w-3 h-[1px] bg-slate-500 border-t border-dashed" />
                        baseline
                    </span>
                    <span className="flex items-center gap-1" style={{ color: "#60a5fa" }}>
                        <span className="w-3 h-[1.5px]" style={{ background: "#60a5fa" }} />
                        projected
                    </span>
                </div>
            </div>

            {/* Compound verdict — color flips based on sign of net revenue impact */}
            <div
                className="rounded-xl border px-4 py-2 flex items-center justify-between"
                style={{
                    background: totalRevMo >= 0
                        ? "linear-gradient(135deg, rgba(52,211,153,0.12), rgba(15,22,38,0.8))"
                        : "linear-gradient(135deg, rgba(251,113,133,0.12), rgba(15,22,38,0.8))",
                    borderColor: compoundActive
                        ? (totalRevMo >= 0 ? "rgba(52,211,153,0.5)" : "rgba(251,113,133,0.5)")
                        : "rgba(148,163,184,0.15)",
                    opacity: compoundActive ? compoundP : 0.35,
                    boxShadow: compoundActive
                        ? (totalRevMo >= 0 ? "0 0 30px rgba(52,211,153,0.15)" : "0 0 30px rgba(251,113,133,0.18)")
                        : "none",
                    transition: "border-color 0.4s, box-shadow 0.4s, background 0.4s",
                }}
            >
                <div>
                    <p
                        className="text-[9px] font-mono uppercase tracking-[0.2em] mb-0.5"
                        style={{ color: totalRevMo >= 0 ? "rgba(110,231,183,0.9)" : "rgba(251,113,133,0.9)" }}
                    >
                        {totalRevMo >= 0 ? "If applied company-wide" : "Downside risk · if applied"}
                    </p>
                    <p className="text-[10.5px] text-slate-300">
                        {totalRevMo >= 0 ? "Net monthly revenue · cash runway extended" : "Net monthly revenue drops · runway contracts"}
                    </p>
                </div>
                <div className="text-right">
                    <p
                        className="tabular-nums font-bold"
                        style={{ fontSize: 18, color: totalRevMo >= 0 ? "#34d399" : "#fb7185" }}
                    >
                        {totalRevMo >= 0 ? "+" : "−"}AED {Math.abs(Math.round(totalRevMo / 1000)).toLocaleString()}K/mo
                    </p>
                    <p className="text-[8.5px] font-mono tabular-nums text-slate-500">
                        {totalCashDays > 0 ? "+" : ""}{totalCashDays.toFixed(0)} days cash runway
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Small components ───────────────────────────────────
function KPI({
    label,
    value,
    delta,
    deltaPrefix = "",
    deltaSuffix = "",
    deltaScale,
    precision = 0,
}: {
    label: string;
    value: string;
    delta: number;
    deltaPrefix?: string;
    deltaSuffix?: string;
    deltaScale?: "k";
    precision?: number;
}) {
    const showDelta = Math.abs(delta) > 0.01;
    const deltaColor = delta >= 0 ? "#34d399" : "#fb7185";
    const formattedDelta = deltaScale === "k"
        ? `${delta > 0 ? "+" : ""}${(delta / 1000).toFixed(precision)}K`
        : `${delta > 0 ? "+" : ""}${delta.toFixed(precision)}`;
    return (
        <div className="flex flex-col">
            <span className="text-[8px] font-mono uppercase tracking-[0.18em] text-slate-500 mb-0.5">{label}</span>
            <span className="text-[15px] tabular-nums font-semibold text-white leading-tight">{value}</span>
            <span
                className="text-[9px] tabular-nums font-mono"
                style={{ color: showDelta ? deltaColor : "#475569", opacity: showDelta ? 1 : 0.5 }}
            >
                {showDelta ? `${deltaPrefix}${formattedDelta}${deltaSuffix}` : "—"}
            </span>
        </div>
    );
}

// ─── Pricing Calendar · Apr 2026 ───────────────────────
// Shows each day of the month tinted by its active pricing modifier
// (weekend uplift, festival peak, demand premium, etc.). A subtle
// scanning highlight sweeps left→right to show the system is live.
type DayRegime = "normal" | "weekend" | "festival" | "peak" | "longwk" | "lowdemand";

const DAY_REGIMES: Record<number, DayRegime> = (() => {
    const m: Record<number, DayRegime> = {};
    // Apr 1, 2026 is a Wednesday. Weekend = Fri+Sat (ME convention).
    // Fri: 3, 10, 17, 24 · Sat: 4, 11, 18, 25
    for (const d of [3, 4, 10, 11, 17, 18, 24, 25]) m[d] = "weekend";
    // Eid al-Fitr festival peak (demo): Apr 11–13
    for (const d of [11, 12, 13]) m[d] = "festival";
    // Long-weekend / high-demand: Apr 14-16 bridging days
    for (const d of [14, 15, 16]) m[d] = "peak";
    // Low-demand slot (mid-month bridge): Apr 6-7 softer pricing
    for (const d of [6, 7]) m[d] = "lowdemand";
    return m;
})();

const REGIME_CONFIG: Record<DayRegime, { color: string; label: string; mult: string }> = {
    normal:    { color: "#64748b", label: "Weekday base",     mult: "×1.00" },
    weekend:   { color: "#fbbf24", label: "Weekend uplift",    mult: "×1.15" },
    festival:  { color: "#fb7185", label: "Eid festival peak", mult: "×1.20" },
    peak:      { color: "#a78bfa", label: "High-demand peak",  mult: "×1.08" },
    longwk:    { color: "#22d3ee", label: "Long-weekend",      mult: "×1.10" },
    lowdemand: { color: "#60a5fa", label: "Low-demand soft",   mult: "×0.92" },
};

function PricingCalendar() {
    const daysInMonth = 30;
    // Apr 1 2026 = Wednesday (index 3, with Sun=0)
    const firstDayWeekday = 3;
    const weeks: Array<Array<number | null>> = [];
    let week: Array<number | null> = Array(firstDayWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
        week.push(d);
        if (week.length === 7) { weeks.push(week); week = []; }
    }
    if (week.length > 0) { while (week.length < 7) week.push(null); weeks.push(week); }

    const legendOrder: DayRegime[] = ["normal", "weekend", "festival", "peak", "lowdemand"];

    // Short tag per regime — shown INLINE on each cell
    const regimeTag: Record<DayRegime, string> = {
        normal: "",
        weekend: "+15%",
        festival: "+20%",
        peak: "+8%",
        longwk: "+10%",
        lowdemand: "−8%",
    };

    return (
        <div className="mt-4 pt-3 border-t" style={{ borderColor: "rgba(148,163,184,0.1)" }}>
            <div className="flex items-baseline justify-between mb-2.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">
                    Pricing calendar · APR 2026
                </p>
                <span className="text-[8px] font-mono text-slate-500">
                    each day priced by its rule mix
                </span>
            </div>

            {/* Legend FIRST so reader knows what colors mean before seeing grid */}
            <div className="mb-2 grid grid-cols-5 gap-1.5">
                {legendOrder.map((r) => {
                    const cfg = REGIME_CONFIG[r];
                    return (
                        <div
                            key={r}
                            className="rounded border px-2 py-1 flex items-center gap-1.5"
                            style={{
                                background: r === "normal"
                                    ? "rgba(30,41,59,0.4)"
                                    : `linear-gradient(135deg, ${cfg.color}18, rgba(15,22,38,0.5))`,
                                borderColor: r === "normal" ? "rgba(148,163,184,0.18)" : `${cfg.color}40`,
                            }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-sm flex-shrink-0"
                                style={{ background: cfg.color, boxShadow: r !== "normal" ? `0 0 5px ${cfg.color}` : "none" }}
                            />
                            <span className="text-[9px] font-semibold text-slate-200 truncate">
                                {cfg.label.replace(/^(Weekend|Weekday|Eid|High-demand|Low-demand)\s*/, (m) => m)}
                            </span>
                            <span className="ml-auto text-[8.5px] font-mono tabular-nums" style={{ color: cfg.color }}>
                                {cfg.mult}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Week-day column headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="text-[8px] font-mono uppercase tracking-[0.18em] text-slate-600 text-center">
                        {d}
                    </div>
                ))}
            </div>

            {/* Days grid with in-cell multiplier */}
            <div className="flex flex-col gap-1">
                {weeks.map((w, wi) => (
                    <div key={wi} className="grid grid-cols-7 gap-1">
                        {w.map((d, di) => {
                            if (d === null) return <div key={di} />;
                            const regime = DAY_REGIMES[d] ?? "normal";
                            const cfg = REGIME_CONFIG[regime];
                            const tag = regimeTag[regime];
                            const isFestival = regime === "festival";
                            return (
                                <div
                                    key={di}
                                    className="relative rounded-md flex flex-col items-center justify-center"
                                    style={{
                                        height: 42,
                                        background: regime === "normal"
                                            ? "rgba(30,41,59,0.45)"
                                            : `linear-gradient(135deg, ${cfg.color}35, ${cfg.color}12)`,
                                        border: `1px solid ${regime === "normal" ? "rgba(148,163,184,0.12)" : `${cfg.color}55`}`,
                                    }}
                                >
                                    <span
                                        className="tabular-nums font-semibold leading-none"
                                        style={{
                                            fontSize: 12,
                                            color: regime === "normal" ? "#cbd5e1" : "#f1f5f9",
                                            textShadow: regime !== "normal" ? "0 1px 2px rgba(0,0,0,0.4)" : "none",
                                        }}
                                    >
                                        {d}
                                    </span>
                                    {tag && (
                                        <span
                                            className="tabular-nums font-mono font-semibold leading-none mt-0.5"
                                            style={{ fontSize: 8.5, color: cfg.color }}
                                        >
                                            {tag}
                                        </span>
                                    )}
                                    {isFestival && d === 11 && (
                                        <span
                                            className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[7px] font-bold tracking-[0.15em] px-1 rounded"
                                            style={{ background: cfg.color, color: "#0a1020", boxShadow: `0 0 6px ${cfg.color}80` }}
                                        >
                                            EID
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

function SampleQuotes({
    getAdjustedRate,
    rateToColor,
    cssRGB,
}: {
    getAdjustedRate: (seg: Segment, cls: VClass) => number;
    rateToColor: (r: number) => { r: number; g: number; b: number };
    cssRGB: (c: { r: number; g: number; b: number }, a?: number) => string;
}) {
    const samples: Array<{ seg: Segment; cls: VClass; days: number; label: string }> = [
        { seg: "Corporate", cls: "SUV", days: 3, label: "Corp · SUV · 3-day weekend" },
        { seg: "Retail", cls: "Economy", days: 7, label: "Retail · Economy · 7-day" },
        { seg: "VIP", cls: "Luxury", days: 2, label: "VIP · Luxury · 2-day peak" },
    ];
    return (
        <div className="mt-4 pt-3 border-t" style={{ borderColor: "rgba(148,163,184,0.1)" }}>
            <p className="text-[8.5px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-2">
                Sample quotes · live recompute
            </p>
            <div className="grid grid-cols-3 gap-2">
                {samples.map((s) => {
                    const rate = getAdjustedRate(s.seg, s.cls);
                    const total = rate * s.days;
                    const color = rateToColor(rate);
                    return (
                        <div
                            key={s.label}
                            className="rounded-md border px-2.5 py-1.5 flex flex-col gap-0.5"
                            style={{
                                background: `linear-gradient(135deg, ${cssRGB(color, 0.08)}, rgba(15,22,38,0.7))`,
                                borderColor: cssRGB(color, 0.3),
                            }}
                        >
                            <span className="text-[8.5px] font-mono text-slate-400">{s.label}</span>
                            <div className="flex items-baseline justify-between mt-0.5">
                                <span className="text-[8px] font-mono text-slate-500 tabular-nums">
                                    {Math.round(rate)} × {s.days}
                                </span>
                                <span className="tabular-nums font-semibold text-white text-[13px]">
                                    AED {Math.round(total).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function DualLine({ baseline, projected }: { baseline: number[]; projected: number[] }) {
    const all = [...baseline, ...projected];
    const minV = Math.min(...all);
    const maxV = Math.max(...all);
    const range = Math.max(1, maxV - minV);
    const w = 100;
    const h = 100;
    const step = w / (baseline.length - 1);
    const mkPath = (pts: number[]) =>
        pts.map((p, i) => {
            const x = i * step;
            const y = h - ((p - minV) / range) * (h - 10) - 5;
            return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
        }).join(" ");
    const projPath = mkPath(projected);
    const basePath = mkPath(baseline);
    const area = `${projPath} L ${w} ${h} L 0 ${h} Z`;
    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
            <defs>
                <linearGradient id="s17DualArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill="url(#s17DualArea)" />
            <path d={basePath} stroke="#64748b" strokeWidth="0.9" strokeDasharray="2.5 1.8" fill="none" />
            <path d={projPath} stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function Sparkline({ points, tone }: { points: number[]; tone: string }) {
    if (points.length < 2) return null;
    const minV = Math.min(...points);
    const maxV = Math.max(...points);
    const range = Math.max(1, maxV - minV);
    const w = 100;
    const h = 100;
    const step = w / (points.length - 1);
    const path = points
        .map((p, i) => {
            const x = i * step;
            const y = h - ((p - minV) / range) * (h - 8) - 4;
            return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(" ");
    const area = `${path} L ${w} ${h} L 0 ${h} Z`;
    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
            <defs>
                <linearGradient id="s17SparkArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tone} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={tone} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill="url(#s17SparkArea)" />
            <path d={path} stroke={tone} strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
