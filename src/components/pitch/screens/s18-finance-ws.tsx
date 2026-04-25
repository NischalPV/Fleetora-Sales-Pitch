"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

// ─── Live ticker hook (single RAF for all cards) ────────
function useLiveTick() {
    const [t, setT] = useState(0);
    useEffect(() => {
        let raf = 0;
        let last = performance.now();
        const loop = (now: number) => {
            const dt = (now - last) / 1000;
            last = now;
            setT((p) => p + dt);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, []);
    return t;
}

type AnimKind =
    | "counter"
    | "spark"
    | "bar"
    | "ticker"
    | "fxrate"
    | "stack"
    | "pulse"
    | "depr"
    | "flow"
    | "log"
    | "stamp";

interface Module {
    name: string;
    desc: string;
    icon: string;
    status: "Live" | "Q3 2026";
    tone: string;
    anim: AnimKind;
}

const MODULES: Module[] = [
    { name: "General Ledger",      desc: "Chart of accounts, journal entries, trial balance",      icon: "📒", status: "Live",     tone: "#fbbf24", anim: "counter" },
    { name: "Accounts Receivable", desc: "Invoice generation, aging, collections, dunning",        icon: "📥", status: "Live",     tone: "#34d399", anim: "stack"   },
    { name: "Accounts Payable",    desc: "Vendor management, purchase orders, payment runs",       icon: "📤", status: "Live",     tone: "#60a5fa", anim: "ticker"  },
    { name: "Revenue Recognition", desc: "IFRS 15 compliant, daily accrual, deferred revenue",     icon: "📈", status: "Live",     tone: "#a78bfa", anim: "bar"     },
    { name: "Cash Management",     desc: "Bank reconciliation, deposit tracking, cash forecasting",icon: "🏦", status: "Live",     tone: "#22d3ee", anim: "spark"   },
    { name: "Tax Engine",          desc: "VAT, withholding tax, multi-jurisdiction, auto-filing",  icon: "🧾", status: "Live",     tone: "#f59e0b", anim: "stamp"   },
    { name: "Credit Management",   desc: "Real-time limits, risk scoring, approval workflows",     icon: "💳", status: "Live",     tone: "#fb7185", anim: "pulse"   },
    { name: "Fixed Assets",        desc: "Vehicle depreciation, fleet valuation, disposal tracking", icon: "🚗", status: "Live",     tone: "#94a3b8", anim: "depr"    },
    { name: "Reporting & FP&A",    desc: "P&L, balance sheet, cash flow, scenario forecasting",    icon: "📊", status: "Live",     tone: "#c084fc", anim: "spark"   },
    { name: "Multi-Currency",      desc: "Real-time FX rates, revaluation, translation",           icon: "🌍", status: "Q3 2026",  tone: "#7dd3fc", anim: "fxrate"  },
    { name: "Intercompany",        desc: "Cross-entity transactions, elimination entries",         icon: "🔄", status: "Q3 2026",  tone: "#fcd34d", anim: "flow"    },
    { name: "Audit & Compliance",  desc: "Full trail, SOX readiness, role-based access",           icon: "🔒", status: "Live",     tone: "#86efac", anim: "log"     },
];

function clamp(x: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, x)); }

export function S18FinanceWs() {
    const [phase, setPhase] = useState(0);
    const t = useLiveTick();

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 400),
            setTimeout(() => setPhase(2), 1200),
            setTimeout(() => setPhase(3), 1900),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-slate-950">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">The Money</motion.p>

            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white text-center tracking-tight mb-2">
                Enterprise Finance Suite
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm text-slate-400 text-center mb-8 max-w-lg">
                Every financial operation — from journal entry to board report — in one integrated platform. No bolt-ons. No spreadsheets.
            </motion.p>

            {/* Pricing Engine — featured hero row */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                transition={{ type: "spring", stiffness: 65, damping: 20 }}
                className="max-w-5xl w-full mb-3"
            >
                <PricingEngineHero t={t} />
            </motion.div>

            {/* Module grid */}
            <div className="grid grid-cols-4 gap-3 max-w-5xl w-full">
                {MODULES.map((mod, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                        transition={{ type: "spring", stiffness: 60, damping: 18, delay: i * 0.045 }}
                    >
                        <ModuleCard mod={mod} t={t + i * 0.7} />
                    </motion.div>
                ))}
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={phase >= 3 ? { opacity: 1 } : {}}
                className="mt-6 text-sm text-slate-500 text-center"
            >
                Month-end close: <span className="text-white font-semibold">same day</span> — not 5 days. Zero manual reconciliation.
            </motion.p>
        </section>
    );
}

// ─── Pricing Engine — featured hero card ────────────────
function PricingEngineHero({ t }: { t: number }) {
    // Mini-heatmap with 4×4 rates that subtly pulse
    const SEGS = ["Retail", "Corp", "VIP", "Ent"];
    const CLASSES = ["Eco", "Mid", "SUV", "Lux"];
    const BASE = [
        [180, 240, 340, 560],
        [158, 212, 300, 495],
        [170, 225, 320, 520],
        [148, 198, 280, 460],
    ];

    // Currently-firing cell: walks diagonally over time
    const cellPeriod = 2.4;
    const cellPhase = (t / cellPeriod) % 16;
    const activeRow = Math.floor(cellPhase) >> 2;
    const activeCol = Math.floor(cellPhase) & 3;
    const activeP = cellPhase - Math.floor(cellPhase);

    // Live priced count
    const priceTickerStart = 14523;
    const priceTickerNow = Math.floor(priceTickerStart + (t * 1.7));

    // Latest "compiled" booking ticker (rotates through samples)
    const samples = [
        { id: "BK-…0421", price: "JOD 976", segment: "Corp · SUV" },
        { id: "BK-…0422", price: "JOD 1,301", segment: "Retail · Eco" },
        { id: "BK-…0423", price: "JOD 1,703", segment: "VIP · Lux" },
        { id: "BK-…0424", price: "JOD 845",  segment: "Ent · Mid" },
    ];
    const sampleIdx = ((Math.floor(t / 2.0) % samples.length) + samples.length) % samples.length;
    const sample = samples[sampleIdx] ?? samples[0];

    return (
        <div
            className="rounded-xl border p-3.5 flex items-stretch gap-4"
            style={{
                background: "linear-gradient(120deg, rgba(251,191,36,0.05) 0%, rgba(167,139,250,0.04) 60%, rgba(15,22,38,0.85) 100%)",
                borderColor: "rgba(251,191,36,0.28)",
                boxShadow: "0 0 28px rgba(251,191,36,0.05)",
            }}
        >
            {/* Title */}
            <div className="flex flex-col justify-center pr-3 border-r" style={{ borderColor: "rgba(148,163,184,0.12)", minWidth: 220 }}>
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-amber-300">★ Featured · Live</span>
                </div>
                <p className="text-[15px] font-bold text-white tracking-tight leading-tight">Pricing Engine</p>
                <p className="text-[10px] text-slate-400 leading-snug mt-1">
                    Rate matrix · dynamic rules · deterministic per-booking compile
                </p>
            </div>

            {/* Mini heatmap */}
            <div className="flex flex-col justify-center" style={{ width: 200 }}>
                <p className="text-[7.5px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-1">Rate matrix · JOD/day</p>
                <div className="grid grid-cols-[24px_repeat(4,1fr)] gap-px text-[8px] font-mono">
                    <span />
                    {CLASSES.map((c) => <span key={c} className="text-slate-500 text-center">{c}</span>)}
                    {SEGS.map((s, ri) => (
                        <ImmediateRow key={ri}>
                            <span className="text-slate-500 self-center pr-1">{s}</span>
                            {CLASSES.map((_, ci) => {
                                const isActive = ri === activeRow && ci === activeCol;
                                const cellHue = (BASE[ri][ci] - 148) / (560 - 148); // 0..1
                                const r = Math.round(96 + cellHue * 160);
                                const g = Math.round(100 + (1 - cellHue) * 100);
                                const b = Math.round(220 - cellHue * 130);
                                const pulse = isActive ? Math.sin(activeP * Math.PI) : 0;
                                return (
                                    <div
                                        key={ci}
                                        className="rounded-sm tabular-nums text-center py-[3px]"
                                        style={{
                                            background: `rgba(${r},${g},${b},${0.18 + pulse * 0.45})`,
                                            border: isActive ? "1px solid rgba(251,191,36,0.7)" : "1px solid rgba(148,163,184,0.08)",
                                            color: isActive ? "#fde68a" : "#cbd5e1",
                                            transition: "border-color 0.15s",
                                        }}
                                    >
                                        {BASE[ri][ci]}
                                    </div>
                                );
                            })}
                        </ImmediateRow>
                    ))}
                </div>
            </div>

            {/* Live booking compiled ticker */}
            <div className="flex flex-col justify-center pl-3 border-l flex-1" style={{ borderColor: "rgba(148,163,184,0.12)" }}>
                <p className="text-[7.5px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-1">Last compiled</p>
                <div key={sample.id} className="flex items-baseline gap-2 animate-pulse-fast" style={{ animation: "none" }}>
                    <span className="text-[9px] font-mono text-slate-400 tabular-nums">{sample.id}</span>
                    <span className="text-[9px] text-slate-500">·</span>
                    <span className="text-[9px] text-slate-300">{sample.segment}</span>
                </div>
                <p className="text-[15px] font-bold text-amber-300 tabular-nums mt-1 tracking-tight">{sample.price}</p>
                <div className="flex items-center gap-2 mt-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[8.5px] font-mono uppercase tracking-[0.18em] text-emerald-300">deterministic · 42 ms</span>
                </div>
            </div>

            {/* Throughput counter */}
            <div className="flex flex-col justify-center px-3 border-l text-right" style={{ borderColor: "rgba(148,163,184,0.12)", minWidth: 130 }}>
                <p className="text-[7.5px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-1">Priced today</p>
                <p className="text-[15px] font-bold text-white tabular-nums tracking-tight">
                    {priceTickerNow.toLocaleString()}
                </p>
                <p className="text-[8px] font-mono uppercase tracking-[0.18em] text-slate-500 mt-1.5">bookings · 24 h</p>
            </div>
        </div>
    );
}

// helper to avoid React.Fragment key issue inside grid
function ImmediateRow({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

// ─── Module card ────────────────────────────────────────
function ModuleCard({ mod, t }: { mod: Module; t: number }) {
    return (
        <div
            className="rounded-xl border bg-slate-900/50 p-4 hover:bg-slate-800/50 transition-colors flex flex-col"
            style={{ borderColor: "rgba(148,163,184,0.18)", minHeight: 132 }}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{mod.icon}</span>
                <span
                    className="text-[8px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{
                        background: mod.status === "Live" ? "rgba(52,211,153,0.18)" : "rgba(96,165,250,0.18)",
                        color: mod.status === "Live" ? "#34d399" : "#60a5fa",
                    }}
                >
                    {mod.status}
                </span>
            </div>
            <p className="text-xs font-bold text-white mb-1">{mod.name}</p>
            <p className="text-[10px] text-slate-500 leading-relaxed mb-2 flex-1">{mod.desc}</p>

            {/* Continuous live indicator strip */}
            <LiveStrip kind={mod.anim} tone={mod.tone} t={t} status={mod.status} />
        </div>
    );
}

// ─── Live indicator dispatch ────────────────────────────
function LiveStrip({ kind, tone, t, status }: { kind: AnimKind; tone: string; t: number; status: "Live" | "Q3 2026" }) {
    const dim = status !== "Live";
    if (kind === "counter")  return <CounterStrip tone={tone} t={t} dim={dim} />;
    if (kind === "spark")    return <SparkStrip tone={tone} t={t} dim={dim} />;
    if (kind === "bar")      return <BarStrip tone={tone} t={t} dim={dim} />;
    if (kind === "ticker")   return <TickerStrip tone={tone} t={t} dim={dim} />;
    if (kind === "fxrate")   return <FxStrip tone={tone} t={t} dim={dim} />;
    if (kind === "stack")    return <StackStrip tone={tone} t={t} dim={dim} />;
    if (kind === "pulse")    return <PulseStrip tone={tone} t={t} dim={dim} />;
    if (kind === "depr")     return <DeprStrip tone={tone} t={t} dim={dim} />;
    if (kind === "flow")     return <FlowStrip tone={tone} t={t} dim={dim} />;
    if (kind === "log")      return <LogStrip tone={tone} t={t} dim={dim} />;
    if (kind === "stamp")    return <StampStrip tone={tone} t={t} dim={dim} />;
    return null;
}

const stripBase: React.CSSProperties = {
    height: 22,
    borderRadius: 4,
    background: "rgba(15,22,38,0.7)",
};

// ── 1. counter (General Ledger): journal entry counter ticking up
function CounterStrip({ tone, t, dim }: { tone: string; t: number; dim?: boolean }) {
    const v = Math.floor(12847 + t * 1.4);
    return (
        <div className="flex items-center justify-between text-[8.5px] font-mono px-2 py-1" style={{ ...stripBase, opacity: dim ? 0.5 : 1 }}>
            <span className="text-slate-500">journal entries · today</span>
            <span className="tabular-nums font-semibold" style={{ color: tone }}>{v.toLocaleString()}</span>
        </div>
    );
}

// ── 2. spark (Cash Management / Reporting): mini sparkline
function SparkStrip({ tone, t, dim }: { tone: string; t: number; dim?: boolean }) {
    const N = 28;
    const W = 110;
    const H = 18;
    const pts = useMemo(() => {
        const arr: number[] = [];
        for (let i = 0; i < N; i++) {
            arr.push(0.5 + 0.35 * Math.sin(i * 0.5) + 0.15 * Math.cos(i * 1.2));
        }
        return arr;
    }, []);
    // Animate by shifting phase
    const shift = (t * 1.5) % 1;
    const path = pts.map((p, i) => {
        const x = (i / (N - 1)) * W;
        const y = H - p * (H - 4) - 2;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return (
        <div className="flex items-center justify-between px-2 py-1" style={{ ...stripBase, opacity: dim ? 0.5 : 1 }}>
            <span className="text-[8.5px] font-mono text-slate-500">7-day flow</span>
            <svg width={W} height={H} style={{ marginLeft: 6, transform: `translateX(${shift * -3}px)` }}>
                <path d={path} fill="none" stroke={tone} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                <circle
                    cx={W - 1}
                    cy={H - pts[N - 1] * (H - 4) - 2}
                    r={2}
                    fill={tone}
                />
            </svg>
        </div>
    );
}

// ── 3. bar (Revenue Recognition): daily accrual fill bar
function BarStrip({ tone, t, dim }: { tone: string; t: number; dim?: boolean }) {
    const dayP = (t * 0.04) % 1; // resets each "day"
    return (
        <div className="px-2 py-1" style={{ ...stripBase, opacity: dim ? 0.5 : 1 }}>
            <div className="flex items-center justify-between text-[8.5px] font-mono mb-1">
                <span className="text-slate-500">today · accrual</span>
                <span className="tabular-nums" style={{ color: tone }}>{(dayP * 100).toFixed(0)}%</span>
            </div>
            <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(148,163,184,0.12)" }}>
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${dayP * 100}%`,
                        background: tone,
                        boxShadow: `0 0 6px ${tone}80`,
                    }}
                />
            </div>
        </div>
    );
}

// ── 4. ticker (Accounts Payable): next payment run countdown
function TickerStrip({ tone, t, dim }: { tone: string; t: number; dim?: boolean }) {
    // Cycle 60s of wall-clock represents ~2.5 days remaining → 0 → resets
    const cycleS = 60;
    const remainingS = cycleS - (t % cycleS);
    const totalSecs = remainingS * (60 * 60); // remap to "real" seconds
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    return (
        <div className="flex items-center justify-between text-[8.5px] font-mono px-2 py-1" style={{ ...stripBase, opacity: dim ? 0.5 : 1 }}>
            <span className="text-slate-500">next run</span>
            <span className="tabular-nums font-semibold" style={{ color: tone }}>
                {days}d {hours.toString().padStart(2, "0")}h {mins.toString().padStart(2, "0")}m
            </span>
        </div>
    );
}

// ── 5. fxrate (Multi-Currency)
function FxStrip({ tone, t, dim }: { tone: string; t: number; dim?: boolean }) {
    const rate = 3.6725 + Math.sin(t * 0.3) * 0.0008 + Math.cos(t * 0.7) * 0.0004;
    const dir = Math.sin(t * 0.3) > 0 ? "▲" : "▼";
    return (
        <div className="flex items-center justify-between text-[8.5px] font-mono px-2 py-1" style={{ ...stripBase, opacity: dim ? 0.5 : 1 }}>
            <span className="text-slate-500">USD/JOD</span>
            <span className="flex items-center gap-1.5">
                <span className="tabular-nums" style={{ color: tone }}>{rate.toFixed(4)}</span>
                <span className="text-[8px]" style={{ color: dir === "▲" ? "#34d399" : "#fb7185" }}>{dir}</span>
            </span>
        </div>
    );
}

// ── 6. stack (Accounts Receivable): aging bar with shifting buckets
function StackStrip({ tone, t, dim }: { tone: string; t: number; dim?: boolean }) {
    // 4 buckets: current, 30, 60, 90+
    const buckets = [
        { c: "#34d399", v: 0.55 + Math.sin(t * 0.4) * 0.06 },
        { c: "#fbbf24", v: 0.22 + Math.cos(t * 0.5) * 0.04 },
        { c: "#fb923c", v: 0.13 + Math.sin(t * 0.6 + 1) * 0.025 },
        { c: "#f87171", v: 0.10 + Math.cos(t * 0.45 + 2) * 0.015 },
    ];
    const sum = buckets.reduce((s, b) => s + b.v, 0);
    return (
        <div className="px-2 py-1" style={{ ...stripBase, opacity: dim ? 0.5 : 1 }}>
            <div className="flex items-center justify-between text-[8.5px] font-mono mb-1">
                <span className="text-slate-500">AR aging</span>
                <span className="tabular-nums" style={{ color: tone }}>JOD 210k</span>
            </div>
            <div className="h-[3px] rounded-full overflow-hidden flex">
                {buckets.map((b, i) => (
                    <div key={i} style={{
                        width: `${(b.v / sum) * 100}%`,
                        background: b.c,
                        transition: "width 0.4s linear",
                    }} />
                ))}
            </div>
        </div>
    );
}

// ── 7. pulse (Credit Management): utilization with subtle pulse
function PulseStrip({ tone, t, dim }: { tone: string; t: number; dim?: boolean }) {
    const util = 0.62 + Math.sin(t * 0.55) * 0.04;
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.0);
    return (
        <div className="px-2 py-1" style={{ ...stripBase, opacity: dim ? 0.5 : 1 }}>
            <div className="flex items-center justify-between text-[8.5px] font-mono mb-1">
                <span className="text-slate-500">utilization</span>
                <span className="tabular-nums" style={{ color: tone }}>{Math.round(util * 100)}%</span>
            </div>
            <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(148,163,184,0.12)" }}>
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${util * 100}%`,
                        background: tone,
                        boxShadow: `0 0 ${4 + pulse * 6}px ${tone}90`,
                    }}
                />
            </div>
        </div>
    );
}

// ── 8. depr (Fixed Assets): depreciation amount slowly counting up
function DeprStrip({ tone, t, dim }: { tone: string; t: number; dim?: boolean }) {
    const v = Math.round(420 + t * 0.18);
    return (
        <div className="flex items-center justify-between text-[8.5px] font-mono px-2 py-1" style={{ ...stripBase, opacity: dim ? 0.5 : 1 }}>
            <span className="text-slate-500">depr · today</span>
            <span className="tabular-nums" style={{ color: tone }}>JOD {v.toLocaleString()}</span>
        </div>
    );
}

// ── 9. flow (Intercompany): entity arrow swap animation
function FlowStrip({ tone, t, dim }: { tone: string; t: number; dim?: boolean }) {
    const period = 3.0;
    const p = (t / period) % 1;
    return (
        <div className="flex items-center justify-between text-[8.5px] font-mono px-2 py-1 relative overflow-hidden" style={{ ...stripBase, opacity: dim ? 0.5 : 1 }}>
            <span className="text-slate-500">UAE → KSA</span>
            <div className="flex-1 mx-2 h-[2px] relative" style={{ background: "rgba(148,163,184,0.12)" }}>
                <div
                    className="absolute top-0 bottom-0"
                    style={{
                        left: `${p * 100}%`,
                        width: 12,
                        marginLeft: -6,
                        background: tone,
                        borderRadius: 1,
                        boxShadow: `0 0 6px ${tone}90`,
                    }}
                />
            </div>
            <span className="text-slate-500">eliminate</span>
        </div>
    );
}

// ── 10. log (Audit & Compliance): log row appearing
function LogStrip({ tone, t, dim }: { tone: string; t: number; dim?: boolean }) {
    const events = [
        "user.login · admin",
        "rule.write · pricing",
        "invoice.send · 0892",
        "payment.recv · 14k",
        "audit.export · q1",
    ];
    const idx = Math.floor((t / 1.4) % events.length);
    const fade = 1 - clamp(((t / 1.4) % 1) - 0.7, 0, 0.3) / 0.3;
    return (
        <div className="flex items-center gap-2 text-[8.5px] font-mono px-2 py-1" style={{ ...stripBase, opacity: dim ? 0.5 : 1 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: tone, boxShadow: `0 0 4px ${tone}90` }} />
            <span className="text-slate-300 truncate" style={{ opacity: fade }}>{events[idx]}</span>
        </div>
    );
}

// ── 11. stamp (Tax Engine): VAT applied counter / pulse
function StampStrip({ tone, t, dim }: { tone: string; t: number; dim?: boolean }) {
    const v = Math.floor(8420 + t * 0.55);
    const pulse = (t % 1.6) < 0.15;
    return (
        <div className="flex items-center justify-between text-[8.5px] font-mono px-2 py-1" style={{ ...stripBase, opacity: dim ? 0.5 : 1 }}>
            <span className="flex items-center gap-1">
                <span style={{
                    color: tone,
                    fontWeight: 700,
                    transform: pulse ? "scale(1.15)" : "scale(1)",
                    display: "inline-block",
                    transition: "transform 0.12s",
                }}>VAT</span>
                <span className="text-slate-500">filings</span>
            </span>
            <span className="tabular-nums" style={{ color: tone }}>{v.toLocaleString()}</span>
        </div>
    );
}
