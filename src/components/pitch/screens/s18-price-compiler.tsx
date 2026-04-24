"use client";

import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────
// S18 — Chapter V · 04 / 05 · "The Price Waterfall"
// A CFO-native view of how a single booking becomes a
// priced quote.  Booking enters as a ticket on top; a
// waterfall chart builds rule by rule (base bar, then
// uplifts / discounts as floating bars, with a running
// total stair-line) until the final AED figure lands as
// a stamped bar on the right.
// ─────────────────────────────────────────────────────────

const INTRO_BUILD = 0.8;
const RULES_START = 0.6;
const RULE_STEP = 0.58;
const FINAL_STAMP_OFFSET = 0.4;
const BOOKING_HOLD = 2.2;
const BOOKING_EXIT = 0.6;

function clamp(x: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, x)); }
function ease(x: number) { return 1 - Math.pow(1 - clamp(x), 3); }
function easeOutBack(x: number) { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

type BarKind = "base" | "up" | "down" | "zero" | "tax" | "final";
interface Rule {
    name: string;
    condition: string;
    deltaLabel: string;
    delta: number;
    runningAfter: number;
    kind: BarKind;
}
interface Booking {
    id: string;
    customer: string;
    segment: string;
    vehicle: string;
    vehicleModel: string;
    days: number;
    period: string;
    pickup: string;
    rules: Rule[];
}

function classify(delta: number, isBase: boolean, isTax: boolean): BarKind {
    if (isBase) return "base";
    if (isTax) return "tax";
    if (delta > 0.01) return "up";
    if (delta < -0.01) return "down";
    return "zero";
}

function compile(rows: Array<Omit<Rule, "kind" | "delta" | "runningAfter"> & { amount: number; type: "flat" | "pct"; isBase?: boolean; isTax?: boolean }>): Rule[] {
    let running = 0;
    return rows.map((r) => {
        const before = running;
        let delta = 0;
        if (r.isBase) {
            delta = r.amount;
            running = r.amount;
        } else if (r.type === "flat") {
            delta = r.amount;
            running = before + r.amount;
        } else {
            delta = before * (r.amount / 100);
            running = before + delta;
        }
        return {
            name: r.name,
            condition: r.condition,
            deltaLabel: r.deltaLabel,
            delta,
            runningAfter: running,
            kind: classify(delta, !!r.isBase, !!r.isTax),
        };
    });
}

const BOOKINGS: Booking[] = [
    {
        id: "BK-2026-0421",
        customer: "Fleet Corp · K. Akhtar",
        segment: "Corporate",
        vehicle: "SUV",
        vehicleModel: "Toyota Prado",
        days: 3,
        period: "Apr 15 → 17 · Wed–Fri",
        pickup: "DXB Airport T3",
        rules: compile([
            { name: "Base rate",         condition: "SUV · AED 300/day × 3",       deltaLabel: "AED 900",  amount: 900,  type: "flat", isBase: true },
            { name: "Corporate tier",    condition: "Fleet Corp · negotiated",     deltaLabel: "−10%",     amount: -10,  type: "pct"  },
            { name: "Peak demand",       condition: "Apr 14–16 · SUV scarce",      deltaLabel: "+8%",      amount: 8,    type: "pct"  },
            { name: "Airport pickup",    condition: "T3 convenience fee",          deltaLabel: "+AED 25",  amount: 25,   type: "flat" },
            { name: "Mileage allowance", condition: "300 km/day · included",       deltaLabel: "±0",       amount: 0,    type: "flat" },
            { name: "Insurance · basic", condition: "Corp default · CDW",          deltaLabel: "+AED 30",  amount: 30,   type: "flat" },
            { name: "VAT · UAE 5%",      condition: "Applied to total",            deltaLabel: "+5%",      amount: 5,    type: "pct", isTax: true },
        ]),
    },
    {
        id: "BK-2026-0422",
        customer: "Retail walk-in · S. Nair",
        segment: "Retail",
        vehicle: "Economy",
        vehicleModel: "Nissan Sunny",
        days: 7,
        period: "Apr 19 → 25 · Sun–Sat",
        pickup: "Downtown · Al Wasl",
        rules: compile([
            { name: "Base rate",         condition: "Economy · AED 180/day × 7",   deltaLabel: "AED 1,260", amount: 1260, type: "flat", isBase: true },
            { name: "Retail tier",       condition: "Walk-in · standard",          deltaLabel: "±0",        amount: 0,    type: "flat" },
            { name: "7-day discount",    condition: "Long-rental incentive",       deltaLabel: "−8%",       amount: -8,   type: "pct"  },
            { name: "Weekend uplift",    condition: "Fri–Sat · +15% × 2d",         deltaLabel: "+AED 50",   amount: 50,   type: "flat" },
            { name: "Mileage allowance", condition: "300 km/day · included",       deltaLabel: "±0",        amount: 0,    type: "flat" },
            { name: "Insurance · basic", condition: "CDW included",                deltaLabel: "+AED 30",   amount: 30,   type: "flat" },
            { name: "VAT · UAE 5%",      condition: "Applied to total",            deltaLabel: "+5%",       amount: 5,    type: "pct", isTax: true },
        ]),
    },
    {
        id: "BK-2026-0423",
        customer: "VIP · A. Al-Mahmood",
        segment: "VIP",
        vehicle: "Luxury",
        vehicleModel: "BMW 5-Series",
        days: 2,
        period: "Apr 11 → 12 · Eid holiday",
        pickup: "Palm Jumeirah villa",
        rules: compile([
            { name: "Base rate",           condition: "Luxury · AED 560/day × 2",    deltaLabel: "AED 1,120", amount: 1120, type: "flat", isBase: true },
            { name: "VIP tier",            condition: "Concierge · premium",         deltaLabel: "+5%",       amount: 5,    type: "pct"  },
            { name: "Eid festival peak",   condition: "Apr 11 festival window",      deltaLabel: "+20%",      amount: 20,   type: "pct"  },
            { name: "Weekend uplift",      condition: "Sat Apr 11 · +15%",           deltaLabel: "+AED 106",  amount: 105.84, type: "flat" },
            { name: "Villa valet",         condition: "Palm Jumeirah door-to-door",  deltaLabel: "+AED 45",   amount: 45,   type: "flat" },
            { name: "Insurance · full",    condition: "VIP comprehensive",           deltaLabel: "+AED 60",   amount: 60,   type: "flat" },
            { name: "VAT · UAE 5%",        condition: "Applied to total",            deltaLabel: "+5%",       amount: 5,    type: "pct", isTax: true },
        ]),
    },
];

function bookingDur(b: Booking) {
    return INTRO_BUILD + RULES_START + b.rules.length * RULE_STEP + FINAL_STAMP_OFFSET + BOOKING_HOLD + BOOKING_EXIT;
}
const LOOP_TOTAL = BOOKINGS.reduce((s, b) => s + bookingDur(b), 0);

const PALETTE = {
    base: "#60a5fa",
    up: "#f59e0b",        // uplift = amber (money-add)
    down: "#34d399",      // discount = emerald (money-save for customer, still positive)
    zero: "#475569",
    tax: "#c084fc",
    final: "#fbbf24",     // final quote = gold
};

// ─── Main ───────────────────────────────────────────────
export function S18PriceCompiler() {
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
            if (wallRef.current >= 0.6 && !pausedRef.current) {
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
    const bootT = ease(clamp(wall / 0.8));

    let bookingIdx = 0;
    let localT = scene;
    {
        let acc = 0;
        for (let i = 0; i < BOOKINGS.length; i++) {
            const d = bookingDur(BOOKINGS[i]);
            if (scene < acc + d) { bookingIdx = i; localT = scene - acc; break; }
            acc += d;
        }
    }
    const booking = BOOKINGS[bookingIdx];
    const totalDur = bookingDur(booking);
    const exitStart = totalDur - BOOKING_EXIT;
    const bookingOpacity = localT < exitStart
        ? ease(clamp(localT / 0.45))
        : 1 - ease(clamp((localT - exitStart) / BOOKING_EXIT));

    const introT = ease(clamp((localT) / INTRO_BUILD));
    const barsStart = INTRO_BUILD + RULES_START;
    const rulesWithState = booking.rules.map((r, i) => {
        const barT = (localT - barsStart) - i * RULE_STEP;
        const firing = barT >= 0 && barT < RULE_STEP * 1.15;
        const fired = barT >= 0;
        const growP = ease(clamp(barT / 0.4));
        return { rule: r, firing, fired, growP, index: i };
    });

    const rulesFiredCount = rulesWithState.filter(s => s.fired).length;
    const lastFired = rulesWithState.filter(s => s.fired).pop();
    const runningTotal = lastFired ? lastFired.rule.runningAfter : 0;
    const finalTotal = booking.rules[booking.rules.length - 1].runningAfter;
    const subtotalBeforeVat = booking.rules[booking.rules.length - 2].runningAfter;

    const finalStart = barsStart + booking.rules.length * RULE_STEP + FINAL_STAMP_OFFSET;
    const finalStampT = ease(clamp((localT - finalStart) / 0.8));

    return (
        <section className="h-full w-full relative overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#0a0e1a" }}>
            {/* Ambient */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 75% 55% at 50% 60%, rgba(251,191,36,0.035) 0%, transparent 72%)",
            }} />
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px)",
                backgroundSize: "100% 56px",
            }} />

            {/* Chapter tag */}
            <div className="absolute top-6 left-0 right-0 z-30 flex items-center justify-between pointer-events-none" style={{ padding: "0 72px" }}>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-slate-400">Chapter V · The Money</span>
                </div>
                <span className="text-[10px] tracking-wider text-slate-500 tabular-nums">04 / 05</span>
            </div>

            {/* Stage */}
            <div
                className="relative flex flex-col"
                style={{
                    width: "min(1420px, 92%)",
                    opacity: bootT,
                    transform: `translateY(${(1 - bootT) * 12}px)`,
                }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {/* Report-style header — not a floating heading, a document title */}
                <div className="flex items-end justify-between mb-4 pb-3 border-b" style={{ borderColor: "rgba(148,163,184,0.12)" }}>
                    <div>
                        <p className="text-[9.5px] font-semibold tracking-[0.35em] uppercase text-amber-400/80 mb-1.5">Quote Build · Price Waterfall</p>
                        <p className="text-[22px] font-semibold text-white leading-none tracking-tight">
                            How one booking becomes one price
                        </p>
                    </div>
                    <div className="flex items-center gap-6 text-right">
                        <div>
                            <p className="text-[8.5px] font-mono uppercase tracking-[0.22em] text-slate-500">Quote ref</p>
                            <p className="text-[12px] font-mono tabular-nums text-slate-200 mt-0.5">{booking.id}</p>
                        </div>
                        <div>
                            <p className="text-[8.5px] font-mono uppercase tracking-[0.22em] text-slate-500">Engine</p>
                            <p className="text-[11px] text-slate-200 mt-0.5">Deterministic · <span className="text-emerald-400">&lt; 50 ms</span></p>
                        </div>
                    </div>
                </div>

                {/* Booking ticket strip */}
                <BookingTicket booking={booking} bookingOpacity={bookingOpacity} introT={introT} />

                {/* Waterfall chart */}
                <div className="mt-5 grid grid-cols-[1fr_240px] gap-5 items-stretch">
                    <Waterfall
                        rules={rulesWithState}
                        finalTotal={finalTotal}
                        finalStampT={finalStampT}
                        bookingOpacity={bookingOpacity}
                    />
                    <FinalQuoteCard
                        booking={booking}
                        rulesFired={rulesFiredCount}
                        totalRules={booking.rules.length}
                        runningTotal={runningTotal}
                        finalTotal={finalTotal}
                        subtotalBeforeVat={subtotalBeforeVat}
                        finalStampT={finalStampT}
                        bookingOpacity={bookingOpacity}
                    />
                </div>

                {/* Footer strip */}
                <div className="mt-5 flex items-center justify-between text-[9.5px] font-mono uppercase tracking-[0.25em] tabular-nums">
                    <div className="flex items-center gap-2 text-slate-500">
                        {BOOKINGS.map((b, i) => {
                            const active = i === bookingIdx;
                            return (
                                <span key={b.id} className="flex items-center gap-1.5">
                                    <span style={{
                                        width: active ? 20 : 4, height: 4, borderRadius: 2,
                                        background: active ? "#fbbf24" : "#334155",
                                        transition: "width 0.35s, background 0.35s",
                                    }} />
                                    <span style={{ color: active ? "#e2e8f0" : "#475569" }}>Quote {i + 1}</span>
                                </span>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-4 text-slate-500">
                        <span>Rules applied <span className="text-slate-300">{rulesFiredCount} / {booking.rules.length}</span></span>
                        <span className="text-slate-700">·</span>
                        <span style={{ color: paused ? "#fbbf24" : "#64748b" }}>{paused ? "◼ paused" : "▶ hover to pause"}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── Booking ticket (top strip) ─────────────────────────
function BookingTicket({ booking, bookingOpacity, introT }: { booking: Booking; bookingOpacity: number; introT: number }) {
    const chips = [
        { lbl: "Customer", val: booking.customer, accent: "#e2e8f0" },
        { lbl: "Segment", val: booking.segment, accent: "#60a5fa" },
        { lbl: "Vehicle", val: `${booking.vehicle} · ${booking.vehicleModel}`, accent: "#e2e8f0" },
        { lbl: "Period", val: booking.period, accent: "#e2e8f0" },
        { lbl: "Days", val: `${booking.days} days`, accent: "#fbbf24" },
        { lbl: "Pickup", val: booking.pickup, accent: "#e2e8f0" },
    ];
    return (
        <div className="relative rounded-xl border overflow-hidden" style={{
            background: "linear-gradient(90deg, rgba(30,41,59,0.4) 0%, rgba(15,22,38,0.85) 100%)",
            borderColor: "rgba(251,191,36,0.18)",
            opacity: bookingOpacity * introT,
        }}>
            {/* Perforation line on left like a ticket stub */}
            <div className="absolute top-0 bottom-0 left-[150px] w-[1px] border-l border-dashed" style={{ borderColor: "rgba(148,163,184,0.18)" }} />
            <div className="flex items-stretch">
                <div className="flex flex-col justify-center px-4 py-3" style={{ width: 150, background: "rgba(251,191,36,0.06)" }}>
                    <p className="text-[7.5px] font-mono uppercase tracking-[0.22em] text-amber-400/80">Booking · Inbound</p>
                    <p className="text-[11px] font-mono tabular-nums text-white mt-1">{booking.id}</p>
                    <p className="text-[8.5px] font-mono text-slate-500 mt-1">Received 09:42 UTC</p>
                </div>
                <div className="flex-1 grid grid-cols-6 gap-0 divide-x" style={{ }}>
                    {chips.map((c, i) => (
                        <div key={i} className="flex flex-col justify-center px-3 py-3 min-w-0" style={{ borderColor: "rgba(148,163,184,0.08)" }}>
                            <p className="text-[7.5px] font-mono uppercase tracking-[0.22em] text-slate-500">{c.lbl}</p>
                            <p className="text-[11px] font-semibold truncate mt-0.5" style={{ color: c.accent }}>{c.val}</p>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center px-5" style={{ background: "rgba(148,163,184,0.04)" }}>
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8H14M14 8L9 3M14 8L9 13" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

// ─── Waterfall chart ────────────────────────────────────
interface RuleState {
    rule: Rule;
    firing: boolean;
    fired: boolean;
    growP: number;
    index: number;
}

function Waterfall({
    rules, finalTotal, finalStampT, bookingOpacity,
}: {
    rules: RuleState[]; finalTotal: number; finalStampT: number; bookingOpacity: number;
}) {
    const W = 920;
    const H = 420;
    const PAD_L = 64;
    const PAD_R = 40;
    const PAD_T = 28;
    const PAD_B = 68;

    const N = rules.length; // 7
    const finalSlot = 1; // extra column for FINAL bar
    const slots = N + finalSlot;

    // Find y-axis max
    const maxVal = Math.max(...rules.map(r => r.rule.runningAfter), finalTotal) * 1.12;
    const yRange = [0, maxVal];
    const chartH = H - PAD_T - PAD_B;
    const chartW = W - PAD_L - PAD_R;
    const slotW = chartW / slots;
    const barW = slotW * 0.52;

    const yFor = (v: number) => PAD_T + chartH - (v / yRange[1]) * chartH;

    // Gridlines
    const gridStep = 200;
    const gridLines: number[] = [];
    for (let v = 0; v <= maxVal; v += gridStep) gridLines.push(v);

    // Bar geometry
    const bars = rules.map((s, i) => {
        const xCenter = PAD_L + slotW * (i + 0.5);
        const prev = i === 0 ? 0 : rules[i - 1].rule.runningAfter;
        const curr = s.rule.runningAfter;
        const top = Math.min(prev, curr);
        const bot = Math.max(prev, curr);
        const x = xCenter - barW / 2;
        const yTop = yFor(bot);
        const yBot = yFor(top);
        const h = yBot - yTop;
        return { s, i, xCenter, x, yTop, yBot, h, prev, curr };
    });

    return (
        <div className="relative rounded-xl border" style={{
            background: "linear-gradient(180deg, rgba(15,22,38,0.7), rgba(10,14,26,0.9))",
            borderColor: "rgba(148,163,184,0.14)",
            opacity: bookingOpacity,
        }}>
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b" style={{ borderColor: "rgba(148,163,184,0.08)" }}>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-300">Price build · waterfall</p>
                </div>
                <div className="flex items-center gap-4 text-[8.5px] font-mono uppercase tracking-[0.2em] text-slate-500">
                    <LegendSwatch color={PALETTE.base} label="Base" />
                    <LegendSwatch color={PALETTE.up} label="Uplift" />
                    <LegendSwatch color={PALETTE.down} label="Discount" />
                    <LegendSwatch color={PALETTE.tax} label="Tax" />
                    <LegendSwatch color={PALETTE.final} label="Final" />
                </div>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
                <defs>
                    <linearGradient id="barBase" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={PALETTE.base} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={PALETTE.base} stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="barUp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={PALETTE.up} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={PALETTE.up} stopOpacity={0.35} />
                    </linearGradient>
                    <linearGradient id="barDown" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={PALETTE.down} stopOpacity={0.85} />
                        <stop offset="100%" stopColor={PALETTE.down} stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="barTax" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={PALETTE.tax} stopOpacity={0.85} />
                        <stop offset="100%" stopColor={PALETTE.tax} stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="barFinal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={PALETTE.final} stopOpacity={0.95} />
                        <stop offset="100%" stopColor={PALETTE.final} stopOpacity={0.55} />
                    </linearGradient>
                </defs>

                {/* Gridlines */}
                {gridLines.map((v) => {
                    const y = yFor(v);
                    return (
                        <g key={v}>
                            <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="rgba(148,163,184,0.08)" strokeWidth={1} strokeDasharray={v === 0 ? "" : "3 5"} />
                            <text x={PAD_L - 8} y={y + 3} textAnchor="end" fontSize={9} fill="#475569" fontFamily="monospace" fontWeight={500}>
                                {v === 0 ? "0" : v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString()}
                            </text>
                        </g>
                    );
                })}
                <text x={PAD_L - 52} y={PAD_T - 8} fontSize={8.5} fill="#64748b" fontFamily="monospace" letterSpacing="1.5">AED</text>

                {/* Bars */}
                {bars.map(({ s, i, xCenter, x, yTop, yBot, h, prev }) => {
                    if (!s.fired) return null;
                    const grow = s.growP;
                    const kind = s.rule.kind;
                    const grad =
                        kind === "base" ? "url(#barBase)" :
                        kind === "up"   ? "url(#barUp)"   :
                        kind === "down" ? "url(#barDown)" :
                        kind === "tax"  ? "url(#barTax)"  :
                        "rgba(100,116,139,0.4)"; // zero
                    const strokeCol =
                        kind === "base" ? PALETTE.base :
                        kind === "up"   ? PALETTE.up   :
                        kind === "down" ? PALETTE.down :
                        kind === "tax"  ? PALETTE.tax  :
                        PALETTE.zero;
                    const isBase = kind === "base";
                    const animH = isBase ? h * grow : h * grow;
                    const animY = isBase ? yBot - animH : (s.rule.delta >= 0 ? yBot - animH : yTop);
                    const isZero = kind === "zero";

                    return (
                        <g key={`bar-${i}`}>
                            {/* Bar */}
                            {isZero ? (
                                <line x1={x} y1={yFor(prev)} x2={x + barW} y2={yFor(prev)} stroke={strokeCol} strokeWidth={2} strokeOpacity={0.8 * grow} strokeDasharray="2 3" />
                            ) : (
                                <rect
                                    x={x} y={animY}
                                    width={barW} height={Math.max(1, animH)}
                                    fill={grad}
                                    stroke={strokeCol}
                                    strokeOpacity={0.9}
                                    strokeWidth={1}
                                    rx={2}
                                    opacity={grow}
                                />
                            )}
                            {/* Firing glow */}
                            {s.firing && !isZero && (
                                <rect
                                    x={x - 2} y={animY - 2}
                                    width={barW + 4} height={Math.max(1, animH) + 4}
                                    fill="none"
                                    stroke={strokeCol}
                                    strokeOpacity={0.5 * (1 - s.growP)}
                                    strokeWidth={2}
                                    rx={3}
                                />
                            )}
                            {/* Connector step to next bar */}
                            {i < rules.length - 1 && s.fired && (
                                <line
                                    x1={x + barW}
                                    y1={yFor(s.rule.runningAfter)}
                                    x2={x + barW + (slotW - barW)}
                                    y2={yFor(s.rule.runningAfter)}
                                    stroke="rgba(203,213,225,0.25)"
                                    strokeWidth={1}
                                    strokeDasharray="2 3"
                                    opacity={grow}
                                />
                            )}
                            {/* Label under X axis */}
                            <g opacity={grow}>
                                <text
                                    x={xCenter}
                                    y={H - PAD_B + 16}
                                    textAnchor="middle"
                                    fontSize={9.5}
                                    fill={s.firing ? "#f1f5f9" : "#94a3b8"}
                                    fontWeight={600}
                                >
                                    {s.rule.name}
                                </text>
                                <text
                                    x={xCenter}
                                    y={H - PAD_B + 30}
                                    textAnchor="middle"
                                    fontSize={8.5}
                                    fill={strokeCol}
                                    fontFamily="monospace"
                                    fontWeight={600}
                                >
                                    {s.rule.deltaLabel}
                                </text>
                            </g>
                            {/* Running total chip above bar */}
                            {s.fired && !isZero && grow > 0.5 && (
                                <g>
                                    <rect
                                        x={xCenter - 30}
                                        y={yFor(s.rule.runningAfter) - 20}
                                        width={60}
                                        height={14}
                                        rx={7}
                                        fill="rgba(15,22,38,0.9)"
                                        stroke="rgba(148,163,184,0.25)"
                                        strokeWidth={0.5}
                                        opacity={grow}
                                    />
                                    <text
                                        x={xCenter}
                                        y={yFor(s.rule.runningAfter) - 10}
                                        textAnchor="middle"
                                        fontSize={8.5}
                                        fill="#e2e8f0"
                                        fontFamily="monospace"
                                        fontWeight={600}
                                        opacity={grow}
                                    >
                                        {s.rule.runningAfter >= 1000 ? `${(s.rule.runningAfter / 1000).toFixed(2)}k` : s.rule.runningAfter.toFixed(0)}
                                    </text>
                                </g>
                            )}
                        </g>
                    );
                })}

                {/* FINAL bar */}
                {finalStampT > 0.01 && (() => {
                    const xCenter = PAD_L + slotW * (N + 0.5);
                    const x = xCenter - barW / 2;
                    const y = yFor(finalTotal);
                    const h = H - PAD_B - y;
                    const stamp = easeOutBack(clamp(finalStampT / 0.7));
                    return (
                        <g>
                            {/* Divider line between rules and final */}
                            <line
                                x1={PAD_L + slotW * N}
                                y1={PAD_T}
                                x2={PAD_L + slotW * N}
                                y2={H - PAD_B}
                                stroke="rgba(251,191,36,0.2)"
                                strokeWidth={1}
                                strokeDasharray="3 3"
                            />
                            <rect
                                x={x} y={y}
                                width={barW} height={h}
                                fill="url(#barFinal)"
                                stroke={PALETTE.final}
                                strokeWidth={1.5}
                                rx={2}
                                opacity={stamp}
                                style={{ filter: `drop-shadow(0 0 ${8 * finalStampT}px rgba(251,191,36,0.35))` }}
                            />
                            <text
                                x={xCenter}
                                y={H - PAD_B + 16}
                                textAnchor="middle"
                                fontSize={9.5}
                                fill="#fbbf24"
                                fontWeight={700}
                                opacity={stamp}
                            >
                                FINAL QUOTE
                            </text>
                            <text
                                x={xCenter}
                                y={H - PAD_B + 30}
                                textAnchor="middle"
                                fontSize={9}
                                fill="#fbbf24"
                                fontFamily="monospace"
                                fontWeight={700}
                                opacity={stamp}
                            >
                                AED {finalTotal.toFixed(2)}
                            </text>
                            {/* Big AED label above final bar */}
                            <g opacity={stamp}>
                                <text
                                    x={xCenter}
                                    y={y - 10}
                                    textAnchor="middle"
                                    fontSize={14}
                                    fill="#fde68a"
                                    fontFamily="monospace"
                                    fontWeight={700}
                                >
                                    {finalTotal >= 1000 ? `${(finalTotal / 1000).toFixed(2)}k` : finalTotal.toFixed(0)}
                                </text>
                            </g>
                        </g>
                    );
                })()}
            </svg>
        </div>
    );
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
    return (
        <span className="flex items-center gap-1.5">
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color, opacity: 0.75 }} />
            <span style={{ color: "#94a3b8" }}>{label}</span>
        </span>
    );
}

// ─── Final quote card (right sidebar) ──────────────────
function FinalQuoteCard({
    booking, rulesFired, totalRules, runningTotal, finalTotal, subtotalBeforeVat, finalStampT, bookingOpacity,
}: {
    booking: Booking;
    rulesFired: number;
    totalRules: number;
    runningTotal: number;
    finalTotal: number;
    subtotalBeforeVat: number;
    finalStampT: number;
    bookingOpacity: number;
}) {
    const vat = finalTotal - subtotalBeforeVat;
    const progress = rulesFired / totalRules;
    const stampScale = easeOutBack(clamp(finalStampT / 0.7));

    return (
        <div
            className="relative rounded-xl border flex flex-col overflow-hidden"
            style={{
                background: "linear-gradient(160deg, rgba(251,191,36,0.06) 0%, rgba(15,22,38,0.9) 60%)",
                borderColor: finalStampT > 0.3 ? "rgba(251,191,36,0.45)" : "rgba(148,163,184,0.16)",
                opacity: bookingOpacity,
                transition: "border-color 0.3s",
                boxShadow: finalStampT > 0.5 ? "0 0 32px rgba(251,191,36,0.08)" : "none",
            }}
        >
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b" style={{ borderColor: "rgba(148,163,184,0.08)" }}>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-300">Quote statement</p>
                </div>
                <span className="text-[8.5px] font-mono tabular-nums text-slate-500">42 ms</span>
            </div>

            <div className="flex-1 flex flex-col p-4 gap-2">
                <div>
                    <p className="text-[8px] font-mono uppercase tracking-[0.22em] text-slate-500">Base</p>
                    <p className="text-[12px] font-mono tabular-nums text-slate-200 mt-0.5">AED {booking.rules[0].runningAfter.toFixed(2)}</p>
                </div>

                {/* Progress bar for rule application */}
                <div className="mt-1">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-[8px] font-mono uppercase tracking-[0.22em] text-slate-500">Rules applied</p>
                        <p className="text-[9px] font-mono tabular-nums text-slate-400">{rulesFired} / {totalRules}</p>
                    </div>
                    <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(148,163,184,0.1)" }}>
                        <div className="h-full rounded-full transition-all duration-200" style={{
                            width: `${progress * 100}%`,
                            background: progress >= 1 ? "#fbbf24" : "#c084fc",
                            boxShadow: progress >= 1 ? "0 0 12px rgba(251,191,36,0.4)" : "none",
                        }} />
                    </div>
                </div>

                <div className="border-t border-dashed pt-2 mt-1" style={{ borderColor: "rgba(148,163,184,0.15)" }}>
                    <div className="flex items-baseline justify-between">
                        <p className="text-[8.5px] font-mono uppercase tracking-[0.22em] text-slate-500">Running</p>
                        <p className="text-[13px] font-mono tabular-nums font-semibold text-white">AED {runningTotal.toFixed(2)}</p>
                    </div>
                </div>

                {finalStampT > 0.1 && (
                    <>
                        <div className="flex items-baseline justify-between" style={{ opacity: ease(clamp((finalStampT - 0.1) / 0.3)) }}>
                            <p className="text-[8.5px] font-mono uppercase tracking-[0.22em] text-slate-500">Subtotal</p>
                            <p className="text-[10px] font-mono tabular-nums text-slate-300">AED {subtotalBeforeVat.toFixed(2)}</p>
                        </div>
                        <div className="flex items-baseline justify-between" style={{ opacity: ease(clamp((finalStampT - 0.2) / 0.3)) }}>
                            <p className="text-[8.5px] font-mono uppercase tracking-[0.22em] text-slate-500">VAT · 5%</p>
                            <p className="text-[10px] font-mono tabular-nums text-slate-300">AED {vat.toFixed(2)}</p>
                        </div>
                    </>
                )}

                <div
                    className="mt-auto rounded-md px-3 py-3 flex flex-col relative"
                    style={{
                        background: "rgba(251,191,36,0.08)",
                        border: "1px solid rgba(251,191,36,0.45)",
                        opacity: ease(clamp((finalStampT - 0.3) / 0.3)),
                        transform: `scale(${lerp(0.92, 1, ease(clamp(finalStampT / 0.5)))})`,
                    }}
                >
                    <p className="text-[8px] font-mono uppercase tracking-[0.22em] text-amber-300/90">Total · charged</p>
                    <p className="tabular-nums font-bold text-amber-300 leading-none mt-1.5" style={{ fontSize: 26, letterSpacing: "-0.02em" }}>
                        AED {finalTotal.toFixed(2)}
                    </p>
                    <p className="text-[8px] font-mono text-slate-500 mt-1.5">Net-30 · deterministic · replayable</p>

                    {finalStampT > 0.7 && (
                        <div
                            className="absolute -top-2 -right-2 rounded-full border flex items-center justify-center font-semibold uppercase"
                            style={{
                                width: 42, height: 42,
                                borderColor: "rgba(251,191,36,0.7)",
                                color: "#fbbf24",
                                background: "rgba(15,22,38,0.95)",
                                fontSize: 7,
                                letterSpacing: "0.14em",
                                transform: `scale(${stampScale}) rotate(-8deg)`,
                                opacity: stampScale,
                            }}
                        >
                            <div className="text-center leading-tight">
                                <div>PRICED</div>
                                <div className="text-[5.5px] mt-0.5 opacity-70" style={{ letterSpacing: "0.1em" }}>42ms</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
