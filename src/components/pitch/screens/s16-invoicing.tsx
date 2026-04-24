"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────
// S16 — Chapter V · 02 / 05 · "A Finance Month, In Motion"
// A single horizontal timeline representing April 2026.
// A playhead sweeps Day 1 → Day 30. Four instruments hang
// off the timeline at their active day-zones; each lights
// up and animates internally when the playhead crosses it.
// At month end, a red CLOSED stamp slams down.
// ─────────────────────────────────────────────────────────

const INTRO_FADE_IN = 0.9;
const INTRO_SETTLE_START = 1.25;
const INTRO_SETTLE_END = 2.15;
const TIMELINE_DRAW_START = 1.95;
const TIMELINE_DRAW_END = 2.8;
const MONTH_START = 2.9;       // playhead begins sweeping
const MONTH_END = 22.9;        // playhead reaches Apr 30 (20s sweep)
const SEAL_START = 23.0;       // CLOSED stamp lands
const SEAL_HOLD = 4.5;         // stamp + totals held
const LOOP_TOTAL = SEAL_START + SEAL_HOLD; // ~27.5s

function clamp(x: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, x)); }
function ease(x: number) { return 1 - Math.pow(1 - clamp(x), 3); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// Day ranges for each instrument
const ZONE = {
    billing: { from: 1, to: 8 },
    treasury: { from: 8, to: 22 },
    vehicles: { from: 10, to: 28 },
    close: { from: 26, to: 30 },
};

// ─── Word reveal for the heading ─────────────────────────
function WordReveal({
    progress,
    parts,
}: {
    progress: number;
    parts: Array<{ text: string; className?: string }>;
}) {
    const flat = useMemo(() => {
        const out: Array<{ word: string; className?: string; key: string }> = [];
        parts.forEach((p, pi) => {
            const tokens = p.text.split(/(\s+)/);
            tokens.forEach((tok, ti) => {
                if (tok.length === 0) return;
                out.push({ word: tok, className: p.className, key: `${pi}-${ti}` });
            });
        });
        return out;
    }, [parts]);
    const wordCount = Math.max(1, flat.filter(t => t.word.trim().length > 0).length);
    let widx = -1;
    return (
        <>
            {flat.map((t) => {
                const isSpace = t.word.trim().length === 0;
                if (isSpace) {
                    return <span key={t.key}>{" "}</span>;
                }
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

// ─── Instrument 1 · Corporate billing roll-up ────────────
function InstrBilling({ p, lit, tone }: { p: number; lit: boolean; tone: string }) {
    const rides = [
        { id: "BK-1142", who: "K. Akhtar", amt: 120 },
        { id: "BK-1159", who: "S. Nair", amt: 340 },
        { id: "BK-1163", who: "A. Yusuf", amt: 210 },
        { id: "BK-1174", who: "P. Rao", amt: 460 },
        { id: "BK-1181", who: "M. Farid", amt: 280 },
    ];
    const show = Math.floor(rides.length * clamp(p / 0.55));
    const rollupT = clamp((p - 0.55) / 0.2);
    const invoiceT = clamp((p - 0.68) / 0.3);
    const total = rides.reduce((s, r) => s + r.amt, 0);
    const lineOpacity = lit ? 1 : 0.35;

    return (
        <div className="relative w-full h-full" style={{ opacity: lineOpacity, transition: "opacity 0.5s" }}>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: tone, boxShadow: lit ? `0 0 8px ${tone}` : "none" }} />
                <p className="text-[9px] font-bold uppercase tracking-[0.28em]" style={{ color: lit ? tone : "#64748b" }}>
                    01 · Corporate billing roll-up
                </p>
            </div>
            <div className="relative rounded-lg border p-3" style={{
                height: 260,
                background: "rgba(15,22,38,0.7)",
                borderColor: lit ? `${tone}40` : "rgba(148,163,184,0.12)",
                boxShadow: lit ? `0 0 30px ${tone}18` : "none",
            }}>
                {/* Ride stack — hide completely once invoice overlay takes over */}
                <div className="flex flex-col gap-0.5" style={{ opacity: 1 - invoiceT }}>
                    {rides.map((r, i) => {
                        const visible = i < show;
                        return (
                            <div
                                key={r.id}
                                className="text-[9px] font-mono tabular-nums rounded px-2 py-1 flex items-center gap-2"
                                style={{
                                    background: "rgba(30,41,59,0.55)",
                                    borderLeft: `2px solid ${visible ? `${tone}70` : "transparent"}`,
                                    opacity: visible ? 1 : 0,
                                    transform: `translateY(${visible ? 0 : 6}px) translateX(${rollupT * 20}px)`,
                                    transition: "transform 0.4s, opacity 0.3s",
                                }}
                            >
                                <span className="text-slate-500">{r.id}</span>
                                <span className="text-slate-300 truncate">{r.who}</span>
                                <span className="ml-auto text-white">AED {r.amt}</span>
                            </div>
                        );
                    })}
                </div>
                {/* Invoice result */}
                <div
                    className="absolute inset-3 flex flex-col justify-center rounded px-4"
                    style={{
                        background: `linear-gradient(135deg, ${tone}10, rgba(15,22,38,0.92))`,
                        border: `1px solid ${tone}60`,
                        opacity: invoiceT,
                        transform: `scale(${lerp(0.94, 1, ease(invoiceT))})`,
                    }}
                >
                    <div className="flex items-baseline justify-between mb-1">
                        <span className="text-[8.5px] font-mono tracking-[0.15em] uppercase" style={{ color: tone }}>
                            INV-APR-042 · Fleet Corp
                        </span>
                        <span className="text-[8px] font-mono text-slate-500">NET-30</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-[11px] text-slate-400">Consolidated</span>
                        <span className="ml-auto tabular-nums font-semibold text-white" style={{ fontSize: 18 }}>
                            AED {total.toLocaleString()}
                        </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(148,163,184,0.18)" }}>
                            <div style={{
                                height: "100%",
                                width: `${Math.min(100, (total / 15000) * 100)}%`,
                                background: `linear-gradient(to right, ${tone}, ${tone}99)`,
                            }} />
                        </div>
                        <span className="text-[8px] tabular-nums text-slate-500">credit · AED 15,000</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Instrument 2 · Treasury cash runway ────────────────
function InstrTreasury({ p, lit, tone }: { p: number; lit: boolean; tone: string }) {
    const bars = [
        { label: "W1", rec: 8, obl: 3 },
        { label: "W2", rec: 14, obl: 6 },
        { label: "W3", rec: 19, obl: 8 },
        { label: "W4", rec: 23, obl: 10 },
    ];
    const barP = clamp(p / 0.8);
    const runway = Math.floor(lerp(12, 47, ease(clamp((p - 0.2) / 0.7))));
    const lineOpacity = lit ? 1 : 0.35;

    return (
        <div className="relative w-full h-full" style={{ opacity: lineOpacity, transition: "opacity 0.5s" }}>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: tone, boxShadow: lit ? `0 0 8px ${tone}` : "none" }} />
                <p className="text-[9px] font-bold uppercase tracking-[0.28em]" style={{ color: lit ? tone : "#64748b" }}>
                    02 · Treasury · cash runway
                </p>
            </div>
            <div className="relative rounded-lg border p-3" style={{
                height: 260,
                background: "rgba(15,22,38,0.7)",
                borderColor: lit ? `${tone}40` : "rgba(148,163,184,0.12)",
                boxShadow: lit ? `0 0 30px ${tone}18` : "none",
            }}>
                <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[8.5px] font-mono tracking-[0.15em] uppercase text-slate-500">Receivables · Obligations</span>
                    <span className="text-[9px] tabular-nums">
                        <span className="text-slate-400">Runway</span>{" "}
                        <span className="font-bold text-white">{runway}</span>
                        <span className="text-slate-500"> days</span>
                    </span>
                </div>
                <div className="flex items-end gap-3" style={{ height: 86 }}>
                    {bars.map((b, i) => {
                        const stageP = clamp((barP - i * 0.08) / 0.25);
                        const recH = 70 * ease(stageP) * (b.rec / 25);
                        const oblH = 70 * ease(stageP) * (b.obl / 25);
                        return (
                            <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                                <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: 70 }}>
                                    <div style={{
                                        width: "42%",
                                        height: recH,
                                        background: `linear-gradient(to top, ${tone}90, ${tone}50)`,
                                        borderRadius: "3px 3px 0 0",
                                    }} />
                                    <div style={{
                                        width: "42%",
                                        height: oblH,
                                        background: "linear-gradient(to top, rgba(148,163,184,0.5), rgba(148,163,184,0.2))",
                                        borderRadius: "3px 3px 0 0",
                                    }} />
                                </div>
                                <span className="text-[7.5px] font-mono tracking-wide text-slate-500">{b.label}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-2 flex items-center gap-3 text-[7.5px] font-mono uppercase tracking-[0.15em]">
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-sm" style={{ background: tone }} />
                        <span className="text-slate-500">Inflow</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-sm bg-slate-400" />
                        <span className="text-slate-500">Outflow</span>
                    </span>
                </div>
            </div>
        </div>
    );
}

// ─── Instrument 3 · Vehicle P&L ladder ──────────────────
function InstrVehicles({ p, lit, tone }: { p: number; lit: boolean; tone: string }) {
    const vehicles = [
        { id: "V-142", margin: 3200 },
        { id: "V-093", margin: 2800 },
        { id: "V-218", margin: 2150 },
        { id: "V-061", margin: 1640 },
        { id: "V-177", margin: 820 },
        { id: "V-047", margin: -410 },
    ];
    const maxAbs = 3200;
    const show = Math.floor(vehicles.length * clamp(p / 0.6));
    const lineOpacity = lit ? 1 : 0.35;

    return (
        <div className="relative w-full h-full" style={{ opacity: lineOpacity, transition: "opacity 0.5s" }}>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: tone, boxShadow: lit ? `0 0 8px ${tone}` : "none" }} />
                <p className="text-[9px] font-bold uppercase tracking-[0.28em]" style={{ color: lit ? tone : "#64748b" }}>
                    03 · Vehicle P&L · by margin
                </p>
            </div>
            <div className="relative rounded-lg border p-3" style={{
                height: 260,
                background: "rgba(15,22,38,0.7)",
                borderColor: lit ? `${tone}40` : "rgba(148,163,184,0.12)",
                boxShadow: lit ? `0 0 30px ${tone}18` : "none",
            }}>
                <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-[8.5px] font-mono tracking-[0.15em] uppercase text-slate-500">Rank · top earners / losers</span>
                    <span className="text-[8.5px] tabular-nums text-slate-500">42 vehicles · Apr</span>
                </div>
                <div className="flex flex-col gap-0.5">
                    {vehicles.map((v, i) => {
                        const visible = i < show;
                        const isTop = i === 0;
                        const isLoss = v.margin < 0;
                        const barW = (Math.abs(v.margin) / maxAbs) * 100;
                        const clr = isLoss ? "#fb7185" : (i < 2 ? "#34d399" : "#a7f3d0");
                        return (
                            <div
                                key={v.id}
                                className="grid grid-cols-[44px_1fr_64px] items-center gap-2 text-[9px] font-mono"
                                style={{
                                    opacity: visible ? 1 : 0,
                                    transform: `translateX(${visible ? 0 : -8}px)`,
                                    transition: "transform 0.3s, opacity 0.3s",
                                }}
                            >
                                <span className="tabular-nums text-slate-400">{v.id}</span>
                                <div className="relative h-3 rounded-sm" style={{ background: "rgba(148,163,184,0.1)" }}>
                                    <div style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: `${visible ? barW : 0}%`,
                                        background: `linear-gradient(to right, ${clr}90, ${clr}50)`,
                                        borderRadius: 2,
                                        transition: "width 0.5s",
                                    }} />
                                    {isTop && visible && (
                                        <span
                                            className="absolute top-1/2 -translate-y-1/2 -right-1 text-[7px] font-bold px-1 rounded-sm"
                                            style={{ background: "rgba(52,211,153,0.18)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}
                                        >TOP</span>
                                    )}
                                    {isLoss && visible && (
                                        <span
                                            className="absolute top-1/2 -translate-y-1/2 right-1 text-[7px] font-bold px-1 rounded-sm"
                                            style={{ background: "rgba(251,113,133,0.18)", color: "#fb7185", border: "1px solid rgba(251,113,133,0.3)" }}
                                        >BLEED</span>
                                    )}
                                </div>
                                <span className="tabular-nums text-right" style={{ color: isLoss ? "#fb7185" : "#e2e8f0" }}>
                                    {v.margin > 0 ? "+" : ""}{v.margin.toLocaleString()}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ─── Instrument 4 · Month-end close checklist ───────────
function InstrClose({ p, lit, tone }: { p: number; lit: boolean; tone: string }) {
    const items = [
        "All bookings recognized",
        "Bank reconciled · 847/850",
        "VAT packet assembled",
        "Trial balance · balanced",
        "Exceptions · 0 open",
    ];
    const checked = Math.floor(items.length * clamp(p / 0.8));
    const lineOpacity = lit ? 1 : 0.35;

    return (
        <div className="relative w-full h-full" style={{ opacity: lineOpacity, transition: "opacity 0.5s" }}>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: tone, boxShadow: lit ? `0 0 8px ${tone}` : "none" }} />
                <p className="text-[9px] font-bold uppercase tracking-[0.28em]" style={{ color: lit ? tone : "#64748b" }}>
                    04 · Month-end close
                </p>
            </div>
            <div className="relative rounded-lg border p-3" style={{
                height: 260,
                background: "rgba(15,22,38,0.7)",
                borderColor: lit ? `${tone}40` : "rgba(148,163,184,0.12)",
                boxShadow: lit ? `0 0 30px ${tone}18` : "none",
            }}>
                <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[8.5px] font-mono tracking-[0.15em] uppercase text-slate-500">Period · APR 2026</span>
                    <span className="text-[8.5px] tabular-nums">
                        <span className="font-semibold text-white">{checked}</span>
                        <span className="text-slate-500"> / {items.length} · closing</span>
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    {items.map((it, i) => {
                        const done = i < checked;
                        return (
                            <div
                                key={it}
                                className="flex items-center gap-2 text-[10px]"
                                style={{
                                    opacity: i <= checked ? 1 : 0.25,
                                    transition: "opacity 0.3s",
                                }}
                            >
                                <div
                                    className="w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0"
                                    style={{
                                        borderColor: done ? tone : "rgba(148,163,184,0.3)",
                                        background: done ? `${tone}22` : "transparent",
                                        transition: "background 0.25s, border-color 0.25s",
                                    }}
                                >
                                    {done && (
                                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                            <path d="M1.5 4L3.3 5.8L6.8 2.3" stroke={tone} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                                <span style={{ color: done ? "#e2e8f0" : "#64748b" }}>{it}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ─── Timeline rail + playhead ───────────────────────────
function TimelineRail({
    drawT,
    monthT,
    zoneTones,
}: {
    drawT: number;
    monthT: number;
    zoneTones: { billing: string; treasury: string; vehicles: string; close: string };
}) {
    const dayTicks = [1, 5, 10, 15, 20, 25, 30];
    const playheadX = clamp(monthT) * 100;
    return (
        <div className="relative w-full" style={{ height: 58 }}>
            <div
                className="absolute left-0 right-0 top-[22px] h-[2px] rounded-full origin-left"
                style={{
                    background: "linear-gradient(to right, rgba(251,191,36,0.7), rgba(96,165,250,0.7), rgba(52,211,153,0.7), rgba(251,113,133,0.7))",
                    transform: `scaleX(${drawT})`,
                    boxShadow: "0 0 14px rgba(148,163,184,0.12)",
                }}
            />
            {dayTicks.map((d) => {
                const tx = ((d - 1) / 29) * 100;
                const drawn = drawT * 100 > tx - 1;
                return (
                    <div
                        key={d}
                        className="absolute -translate-x-1/2 flex flex-col items-center"
                        style={{
                            left: `${tx}%`,
                            top: 16,
                            opacity: drawn ? 1 : 0,
                            transition: "opacity 0.2s",
                        }}
                    >
                        <div className="w-[1px] h-[14px] bg-slate-500/60" />
                        <span className="text-[8px] font-mono tabular-nums text-slate-500 mt-1">Apr {d}</span>
                    </div>
                );
            })}
            {(Object.entries(ZONE) as Array<[keyof typeof ZONE, { from: number; to: number }]>).map(([k, z]) => {
                const xs = ((z.from - 1) / 29) * 100;
                const xw = ((z.to - z.from) / 29) * 100;
                const toneC = zoneTones[k];
                return (
                    <div
                        key={k}
                        className="absolute rounded-full"
                        style={{
                            left: `${xs}%`,
                            width: `${xw}%`,
                            top: 20,
                            height: 6,
                            background: `${toneC}30`,
                            border: `1px solid ${toneC}50`,
                            opacity: drawT > 0.9 ? 1 : 0,
                            transition: "opacity 0.3s",
                        }}
                    />
                );
            })}
            {monthT >= 0 && monthT <= 1.001 && (
                <div
                    className="absolute flex flex-col items-center -translate-x-1/2"
                    style={{ left: `${playheadX}%`, top: 0 }}
                >
                    <div
                        className="text-[7.5px] font-mono font-bold tabular-nums px-1.5 py-0.5 rounded-sm"
                        style={{
                            background: "#fbbf24",
                            color: "#0a1020",
                            boxShadow: "0 0 14px rgba(251,191,36,0.5)",
                        }}
                    >
                        APR {Math.max(1, Math.min(30, Math.round(1 + monthT * 29)))}
                    </div>
                    <div className="w-[2px] h-[34px]" style={{ background: "linear-gradient(to bottom, #fbbf24, rgba(251,191,36,0.2))" }} />
                </div>
            )}
        </div>
    );
}

// ─── CLOSED stamp ───────────────────────────────────────
function ClosedStamp({ t }: { t: number }) {
    if (t <= 0) return null;
    const dropP = ease(clamp(t / 0.35));
    const settleP = ease(clamp((t - 0.35) / 0.4));
    const scale = lerp(1.9, 1.0, dropP);
    const rot = lerp(-8, -4, Math.max(dropP, settleP));
    const shake = t > 0.35 && t < 0.6 ? Math.sin(t * 40) * 2 * (1 - (t - 0.35) / 0.25) : 0;
    return (
        <div
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
                transform: `translate(-50%, -50%) translate(${shake}px, 0) rotate(${rot}deg) scale(${scale})`,
                opacity: dropP,
                zIndex: 25,
            }}
        >
            <div
                className="flex flex-col items-center px-6 py-3 border-[3px] rounded"
                style={{
                    borderColor: "#fb7185",
                    color: "#fb7185",
                    background: "rgba(251,113,133,0.08)",
                    boxShadow: "0 0 40px rgba(251,113,133,0.3), inset 0 0 20px rgba(251,113,133,0.15)",
                }}
            >
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase">APR 2026</span>
                <span className="text-[28px] font-black tracking-[0.18em] uppercase leading-none my-0.5">CLOSED</span>
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase opacity-80">00:42 to close</span>
            </div>
        </div>
    );
}

// ─── MAIN ────────────────────────────────────────────────
export function S16Invoicing() {
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
            if (wallRef.current >= TIMELINE_DRAW_START && !pausedRef.current) {
                sceneRef.current += dt;
                if (sceneRef.current >= LOOP_TOTAL) {
                    sceneRef.current = sceneRef.current % LOOP_TOTAL;
                }
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
    const railDrawT = ease(clamp((wall - TIMELINE_DRAW_START) / (TIMELINE_DRAW_END - TIMELINE_DRAW_START)));

    const monthT = clamp((scene - MONTH_START) / (MONTH_END - MONTH_START));
    const sealT = clamp((scene - SEAL_START) / 1.0);
    const playheadDay = 1 + monthT * 29;

    const tones = {
        billing: "#fbbf24",
        treasury: "#60a5fa",
        vehicles: "#34d399",
        close: "#fb7185",
    };

    const billingP = clamp((playheadDay - ZONE.billing.from) / (ZONE.billing.to - ZONE.billing.from));
    const treasuryP = clamp((playheadDay - ZONE.treasury.from) / (ZONE.treasury.to - ZONE.treasury.from));
    const vehiclesP = clamp((playheadDay - ZONE.vehicles.from) / (ZONE.vehicles.to - ZONE.vehicles.from));
    const closeP = clamp((playheadDay - ZONE.close.from) / (ZONE.close.to - ZONE.close.from));

    const litBilling = playheadDay >= ZONE.billing.from - 0.2;
    const litTreasury = playheadDay >= ZONE.treasury.from - 0.2;
    const litVehicles = playheadDay >= ZONE.vehicles.from - 0.2;
    const litClose = playheadDay >= ZONE.close.from - 0.2;

    return (
        <section className="h-full w-full relative overflow-hidden" style={{ backgroundColor: "#0a1020" }}>
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 75% 55% at 50% 55%, rgba(96,165,250,0.06) 0%, transparent 70%)",
                }}
            />

            <div
                className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between pointer-events-none"
                style={{ padding: "32px 72px 0 72px" }}
            >
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-slate-400">Fleetora · Finance</span>
                    <span className="text-slate-700">/</span>
                    <span className="text-[10px] tracking-wider text-slate-500">Chapter V — A Finance Month</span>
                </div>
                <span className="text-[10px] tracking-wider text-slate-500 tabular-nums">02 / 05</span>
            </div>

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
                    One month · four instruments
                </p>
                <h2
                    className="text-white tracking-[-0.025em] leading-[1.08]"
                    style={{ fontSize: "clamp(20px, 1.75vw, 28px)", fontWeight: 600 }}
                >
                    <WordReveal
                        progress={introFadeT}
                        parts={[
                            { text: "Your finance team's whole April. " },
                            { text: "On its own.", className: "text-amber-300" },
                        ]}
                    />
                </h2>
            </div>

            <div
                className="absolute left-0 right-0 flex flex-col items-center"
                style={{
                    top: "17%",
                    bottom: "13%",
                    opacity: railDrawT,
                    pointerEvents: railDrawT > 0.5 ? "auto" : "none",
                }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <div className="relative flex flex-col justify-center gap-5" style={{ width: "min(1460px, 84%)", height: "100%" }}>
                    <div className="grid grid-cols-2 gap-6">
                        <InstrBilling p={billingP} lit={litBilling} tone={tones.billing} />
                        <InstrTreasury p={treasuryP} lit={litTreasury} tone={tones.treasury} />
                    </div>

                    <TimelineRail drawT={railDrawT} monthT={monthT} zoneTones={tones} />

                    <div className="grid grid-cols-2 gap-6">
                        <InstrVehicles p={vehiclesP} lit={litVehicles} tone={tones.vehicles} />
                        <InstrClose p={closeP} lit={litClose} tone={tones.close} />
                    </div>

                    <ClosedStamp t={sealT} />
                </div>
            </div>

            <div
                className="absolute left-0 right-0 z-30 flex flex-col items-center gap-2 pointer-events-none"
                style={{ bottom: 72, opacity: railDrawT }}
            >
                <div className="flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.25em] tabular-nums">
                    <span style={{ color: litBilling ? tones.billing : "#475569" }}>01 Billing</span>
                    <span className="text-slate-700">·</span>
                    <span style={{ color: litTreasury ? tones.treasury : "#475569" }}>02 Treasury</span>
                    <span className="text-slate-700">·</span>
                    <span style={{ color: litVehicles ? tones.vehicles : "#475569" }}>03 P&L</span>
                    <span className="text-slate-700">·</span>
                    <span style={{ color: sealT > 0 || litClose ? tones.close : "#475569" }}>04 Close</span>
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
