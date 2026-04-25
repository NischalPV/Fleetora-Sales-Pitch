"use client";

import { useState, useEffect, useMemo, useRef } from "react";

// ─────────────────────────────────────────────────────────
// S15 — The Finance Stack · Chapter V · 01 / 05
// Seven Corporate Finance capability cards, auto-advancing.
// Each card: left-pane feature copy with a per-card text
// animation, right-pane live mini-visual demonstrating the
// capability. Summary strip holds at the end.
// ─────────────────────────────────────────────────────────

type TextAnim =
    | "type" | "wordBlur" | "lineSlide" | "letterShuffle"
    | "leftSwipe" | "counting" | "scanline";

type VisualKey =
    | "orgtree" | "revrec" | "journal" | "tax"
    | "aging" | "bankmatch" | "audit";

interface Card {
    num: string;
    eyebrow: string;
    name: string;
    desc: string;
    chips: string[];
    tone: string;
    textAnim: TextAnim;
    visual: VisualKey;
}

const CARDS: Card[] = [
    {
        num: "01", eyebrow: "Capability", name: "Multi-entity billing",
        desc: "One master agreement. Many riders. Fleet Corp rolls up 127 employees across 4 departments into one consolidated monthly invoice — with per-department credit limits enforced in real time.",
        chips: ["Consolidated invoicing", "Per-dept credit", "Master agreement", "Net-30"],
        tone: "#fbbf24", textAnim: "type", visual: "orgtree",
    },
    {
        num: "02", eyebrow: "Capability", name: "Daily revenue recognition",
        desc: "Revenue recognized every 24 hours, not every 30 days. Multi-day bookings are amortized across their rental window so every line in the P&L reflects real earned revenue — IFRS 15 compliant, zero manual journals.",
        chips: ["IFRS 15", "Daily accrual", "Deferred revenue", "Multi-day amortization"],
        tone: "#60a5fa", textAnim: "wordBlur", visual: "revrec",
    },
    {
        num: "03", eyebrow: "Capability", name: "Auto-journalization",
        desc: "Every booking, payment, refund and adjustment spawns its GL entries the moment it happens. Debit and credit columns balance themselves. Trial balance, always within fifteen seconds of the last event.",
        chips: ["Debits = Credits", "15-sec balance", "Every event logged", "Exportable"],
        tone: "#34d399", textAnim: "lineSlide", visual: "journal",
    },
    {
        num: "04", eyebrow: "Capability", name: "VAT & withholding engine",
        desc: "Multi-jurisdiction tax resolved at the transaction level. VAT, withholding, reverse-charge — applied based on rider location, vehicle, and corporate status. Filing packets pre-assembled on demand.",
        chips: ["Multi-jurisdiction", "Real-time lookup", "Filing packets", "Reverse-charge"],
        tone: "#a78bfa", textAnim: "letterShuffle", visual: "tax",
    },
    {
        num: "05", eyebrow: "Capability", name: "AR aging & auto-dunning",
        desc: "Every open invoice aged to the day. When an invoice crosses 30, 60, 90 — the dunning ladder fires on its own: polite reminder, escalation, finance review. Your DSO gets shorter while you sleep.",
        chips: ["Aging buckets", "Auto-dunning", "Escalation ladder", "DSO tracking"],
        tone: "#fb7185", textAnim: "leftSwipe", visual: "aging",
    },
    {
        num: "06", eyebrow: "Capability", name: "Statement-based reconciliation",
        desc: "Drop in a weekly or monthly bank statement — CSV, OFX, PDF. The platform reconciles 847 of 850 lines against the ledger on its own. The 3 that don't go to an exception queue with suggested matches, not a spreadsheet full of question marks.",
        chips: ["Statement upload", "Suggested matches", "Exception queue", "Month-end ready"],
        tone: "#22d3ee", textAnim: "counting", visual: "bankmatch",
    },
    {
        num: "07", eyebrow: "Capability", name: "Full audit trail",
        desc: "Every event hash-linked to the previous. Immutable log, 7-year retention, exportable at any cut point. Your auditor gets read-only access; your close gets zero findings; your board gets receipts.",
        chips: ["Immutable log", "7-year retention", "SOX-ready", "Read-only auditor view"],
        tone: "#eab308", textAnim: "scanline", visual: "audit",
    },
];

const CARD_DUR = 4.8;
const CARD_OVERLAP = 0.4;
const CARD_STEP = CARD_DUR - CARD_OVERLAP; // 4.4
const LOOP_TOTAL = CARDS.length * CARD_STEP; // 30.8 — perfectly cyclic

// Intro: heading enters large & centered, then settles to its final small top position,
// then the carousel fades in and starts.
const INTRO_FADE_IN = 0.9;      // heading opacity 0→1
const INTRO_SETTLE_START = 1.25; // heading begins shrinking / moving up
const INTRO_SETTLE_END = 2.15;   // heading seated at final position
const CAROUSEL_REVEAL_START = 1.95;
const CAROUSEL_REVEAL_END = 2.55;
const INTRO_DUR = CAROUSEL_REVEAL_END; // carousel time begins after this

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function clamp(x: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, x)); }
function ease(x: number) { return 1 - Math.pow(1 - clamp(x), 3); }

// Intro word-reveal for the stack heading
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
                if (!isSpace) widx++;
                const delay = isSpace ? 0 : (widx / wordCount) * 0.75;
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
                        {t.word === " " || isSpace ? " " : t.word}
                    </span>
                );
            })}
        </>
    );
}

// ─── TEXT ANIMATIONS ────────────────────────────────────
function TypewriterText({ text, progress }: { text: string; progress: number }) {
    const n = Math.floor(text.length * clamp(progress));
    return (
        <>
            {text.slice(0, n)}
            <span style={{ opacity: progress < 1 ? 0.55 : 0, marginLeft: 1 }}>▊</span>
        </>
    );
}

function WordBlurText({ text, progress }: { text: string; progress: number }) {
    const words = useMemo(() => text.split(/(\s+)/), [text]);
    return (
        <>
            {words.map((w, i) => {
                const wDelay = (i / words.length) * 0.85;
                const wP = clamp((progress - wDelay) / 0.22);
                return (
                    <span
                        key={i}
                        style={{
                            display: "inline-block",
                            opacity: wP,
                            filter: `blur(${(1 - wP) * 5}px)`,
                            transform: `translateY(${(1 - wP) * 6}px)`,
                        }}
                    >
                        {w === " " ? " " : w}
                    </span>
                );
            })}
        </>
    );
}

function LineSlideText({ text, progress }: { text: string; progress: number }) {
    const lines = useMemo(() => {
        const words = text.split(/\s+/);
        const per = Math.ceil(words.length / 3);
        return [
            words.slice(0, per).join(" "),
            words.slice(per, per * 2).join(" "),
            words.slice(per * 2).join(" "),
        ];
    }, [text]);
    return (
        <>
            {lines.map((l, i) => {
                const lDelay = i * 0.22;
                const lP = clamp((progress - lDelay) / 0.3);
                return (
                    <div
                        key={i}
                        style={{
                            opacity: lP,
                            transform: `translateY(${(1 - lP) * 12}px)`,
                        }}
                    >
                        {l}
                    </div>
                );
            })}
        </>
    );
}

function LetterShuffleText({ text, progress }: { text: string; progress: number }) {
    const chars = useMemo(() => {
        return text.split("").map((c, i) => {
            const seed = ((i * 2654435761) >>> 0) % 1000;
            return { c, delay: (seed / 1000) * 0.6 };
        });
    }, [text]);
    return (
        <>
            {chars.map((ch, i) => {
                const cP = clamp((progress - ch.delay) / 0.2);
                return (
                    <span
                        key={i}
                        style={{
                            opacity: cP,
                            transform: `translateY(${(1 - cP) * 5}px)`,
                            display: "inline-block",
                        }}
                    >
                        {ch.c === " " ? " " : ch.c}
                    </span>
                );
            })}
        </>
    );
}

function LeftSwipeText({ text, progress }: { text: string; progress: number }) {
    const p = clamp(progress);
    return (
        <div
            style={{
                clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
                WebkitClipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
            }}
        >
            {text}
        </div>
    );
}

function CountingText({ text, progress }: { text: string; progress: number }) {
    // Ramp "847" from 0 and fade prose
    const target = 847;
    const p = clamp(progress);
    const current = Math.floor(target * clamp(p * 1.15));
    const replaced = text.replace("847", String(current).padStart(3, "0"));
    return <div style={{ opacity: p }}>{replaced}</div>;
}

function ScanlineText({
    text, progress, tone,
}: { text: string; progress: number; tone: string }) {
    const p = clamp(progress);
    return (
        <div className="relative">
            <div style={{ opacity: p }}>{text}</div>
            {p > 0.02 && p < 0.98 && (
                <div
                    className="absolute left-0 right-0 pointer-events-none"
                    style={{
                        top: `${p * 100}%`,
                        height: 2,
                        background: `linear-gradient(to right, transparent, ${tone}, transparent)`,
                        filter: "blur(1px)",
                    }}
                />
            )}
        </div>
    );
}

function Description({
    anim, text, progress, tone,
}: { anim: TextAnim; text: string; progress: number; tone: string }) {
    switch (anim) {
        case "type": return <TypewriterText text={text} progress={progress} />;
        case "wordBlur": return <WordBlurText text={text} progress={progress} />;
        case "lineSlide": return <LineSlideText text={text} progress={progress} />;
        case "letterShuffle": return <LetterShuffleText text={text} progress={progress} />;
        case "leftSwipe": return <LeftSwipeText text={text} progress={progress} />;
        case "counting": return <CountingText text={text} progress={progress} />;
        case "scanline": return <ScanlineText text={text} progress={progress} tone={tone} />;
    }
}

// ─── MINI VISUALS (right pane) ───────────────────────────

function VisOrgTree({ p, tone }: { p: number; tone: string }) {
    const depts = [
        { name: "Sales", riders: 38, used: 62, limit: 100 },
        { name: "Operations", riders: 52, used: 67, limit: 80 },
        { name: "Executive", riders: 8, used: 12, limit: 30 },
        { name: "Engineering", riders: 29, used: 22, limit: 40 },
    ];
    return (
        <div className="h-full flex flex-col justify-center gap-3 px-8">
            {/* Parent badge */}
            <div
                className="self-center px-4 py-2 rounded-md border text-center"
                style={{
                    borderColor: `${tone}55`,
                    background: `${tone}10`,
                    opacity: ease(clamp(p / 0.15)),
                }}
            >
                <p className="text-[9px] uppercase tracking-[0.25em] font-bold" style={{ color: tone }}>
                    Fleet Corp · Master Agreement
                </p>
                <p className="text-[11px] font-semibold text-white mt-0.5 tabular-nums">
                    127 riders · Net-30 · Gold Tier
                </p>
            </div>
            {/* Connecting spine */}
            <div
                className="self-center w-px"
                style={{
                    height: 20,
                    background: tone,
                    opacity: 0.4 * ease(clamp((p - 0.1) / 0.1)),
                }}
            />
            {/* Dept cards */}
            <div className="grid grid-cols-4 gap-2">
                {depts.map((d, i) => {
                    const dP = ease(clamp((p - 0.2 - i * 0.08) / 0.25));
                    const barP = ease(clamp((p - 0.55 - i * 0.05) / 0.35));
                    return (
                        <div
                            key={d.name}
                            className="rounded-md border p-2 flex flex-col gap-1"
                            style={{
                                background: "rgba(15,22,38,0.6)",
                                borderColor: "rgba(148,163,184,0.15)",
                                opacity: dP,
                                transform: `translateY(${(1 - dP) * 8}px)`,
                            }}
                        >
                            <div className="flex items-baseline justify-between">
                                <span className="text-[9.5px] font-semibold text-white truncate">{d.name}</span>
                                <span className="text-[8px] text-slate-500 tabular-nums">{d.riders}</span>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="text-[7px] uppercase tracking-wider text-slate-500">Credit</span>
                                <span className="text-[8.5px] font-semibold tabular-nums" style={{ color: tone }}>
                                    {Math.round((d.used / d.limit) * barP * 100)}%
                                </span>
                            </div>
                            <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(148,163,184,0.1)" }}>
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${(d.used / d.limit) * barP * 100}%`,
                                        background: tone,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Consolidated bar */}
            <div
                className="rounded-md border px-3 py-2 mt-2"
                style={{
                    background: "rgba(15,22,38,0.55)",
                    borderColor: `${tone}40`,
                    opacity: ease(clamp((p - 0.7) / 0.2)),
                }}
            >
                <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[8.5px] uppercase tracking-[0.2em] text-slate-500 font-medium">Consolidated credit</span>
                    <span className="text-[10px] tabular-nums">
                        <span className="text-white font-semibold">JOD {Math.round(180 * ease(clamp((p - 0.75) / 0.25)))}K</span>
                        <span className="text-slate-600"> / 250K</span>
                    </span>
                </div>
                <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(148,163,184,0.12)" }}>
                    <div
                        className="h-full rounded-full"
                        style={{
                            width: `${72 * ease(clamp((p - 0.75) / 0.25))}%`,
                            background: `linear-gradient(90deg, #60a5fa, ${tone})`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

function VisRevRec({ p, tone }: { p: number; tone: string }) {
    const totalAmount = 900;
    const perDay = 300;
    // Day indicator starts collapsed, splits into 3 segments, then each day "peels" down
    const segmentP = ease(clamp((p - 0.05) / 0.3));
    const days = [0, 1, 2];
    return (
        <div className="h-full flex flex-col justify-center gap-4 px-8">
            <div
                className="rounded-md border p-3"
                style={{
                    background: "rgba(15,22,38,0.55)",
                    borderColor: `${tone}40`,
                    opacity: ease(clamp(p / 0.15)),
                }}
            >
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-medium mb-2">
                    Booking BK-1047 · 3-day rental · Total JOD {totalAmount}
                </p>
                <div className="flex h-5 rounded overflow-hidden" style={{ background: "rgba(148,163,184,0.1)" }}>
                    {days.map((d) => (
                        <div
                            key={d}
                            className="relative flex-1"
                            style={{
                                background: `${tone}${segmentP > (d / 3) ? "55" : "10"}`,
                                borderRight: d < 2 ? "1px solid rgba(10,16,32,0.6)" : "none",
                                opacity: segmentP,
                            }}
                        >
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold text-white tabular-nums">
                                Day {d + 1}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ledger rows peeling off */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-medium">Rental revenue · daily accrual</span>
                    <span className="text-[9px] text-slate-600 font-mono">IFRS 15</span>
                </div>
                {days.map((d) => {
                    const rowP = ease(clamp((p - 0.4 - d * 0.15) / 0.2));
                    const amt = Math.round(perDay * ease(clamp((p - 0.4 - d * 0.15) / 0.3)));
                    return (
                        <div
                            key={d}
                            className="rounded border px-3 py-1.5 flex items-center justify-between"
                            style={{
                                background: "rgba(15,22,38,0.5)",
                                borderColor: `${tone}30`,
                                opacity: rowP,
                                transform: `translateX(${(1 - rowP) * -12}px)`,
                            }}
                        >
                            <span className="text-[9.5px] text-slate-400">
                                Apr {11 + d} · Revenue recognized
                            </span>
                            <span className="text-[10px] font-semibold tabular-nums" style={{ color: tone }}>
                                + JOD {amt.toLocaleString()}
                            </span>
                        </div>
                    );
                })}
                <div
                    className="mt-1 pt-1.5 border-t flex items-baseline justify-between"
                    style={{
                        borderColor: "rgba(148,163,184,0.1)",
                        opacity: ease(clamp((p - 0.85) / 0.15)),
                    }}
                >
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Total recognized</span>
                    <span className="text-[13px] font-bold tabular-nums" style={{ color: tone }}>JOD 900</span>
                </div>
            </div>
        </div>
    );
}

function VisJournal({ p, tone }: { p: number; tone: string }) {
    const entries = [
        { event: "Booking BK-1142 created", dr: "A/R — Fleet Corp", cr: "Deferred Revenue", amt: 420 },
        { event: "Insurance activated", dr: "Insurance Receivable", cr: "Insurance Revenue", amt: 80 },
        { event: "Day 1 revenue recognized", dr: "Deferred Revenue", cr: "Rental Revenue", amt: 140 },
        { event: "Payment received", dr: "Cash — Bank 1", cr: "A/R — Fleet Corp", amt: 500 },
        { event: "Mileage overage", dr: "A/R — Fleet Corp", cr: "Overage Revenue", amt: 30 },
    ];
    return (
        <div className="h-full flex flex-col justify-center px-8">
            <div
                className="rounded-md border overflow-hidden"
                style={{
                    background: "rgba(15,22,38,0.6)",
                    borderColor: `${tone}35`,
                    opacity: ease(clamp(p / 0.1)),
                }}
            >
                <div className="px-3 py-1.5 border-b grid grid-cols-[1fr_110px_110px_60px] gap-2 text-[8px] uppercase tracking-[0.2em] font-semibold text-slate-500" style={{ borderColor: "rgba(148,163,184,0.1)" }}>
                    <span>Event</span>
                    <span>Debit</span>
                    <span>Credit</span>
                    <span className="text-right">Amt</span>
                </div>
                {entries.map((e, i) => {
                    const rowP = ease(clamp((p - 0.15 - i * 0.12) / 0.25));
                    return (
                        <div
                            key={i}
                            className="px-3 py-1.5 grid grid-cols-[1fr_110px_110px_60px] gap-2 items-center border-b text-[9.5px] tabular-nums"
                            style={{
                                borderColor: "rgba(148,163,184,0.06)",
                                opacity: rowP,
                                transform: `translateY(${(1 - rowP) * 4}px)`,
                            }}
                        >
                            <span className="text-white truncate">{e.event}</span>
                            <span className="text-blue-400 truncate">{e.dr}</span>
                            <span className="text-emerald-400 truncate">{e.cr}</span>
                            <span className="text-white text-right font-semibold">{e.amt}</span>
                        </div>
                    );
                })}
                {/* Trial balance footer */}
                <div
                    className="px-3 py-1.5 bg-emerald-500/5 flex items-center justify-between"
                    style={{ opacity: ease(clamp((p - 0.85) / 0.15)) }}
                >
                    <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">Trial balance</span>
                    <span className="text-[10px] text-emerald-400 font-semibold tabular-nums">
                        Debits = Credits · 1,170 / 1,170 ✓
                    </span>
                </div>
            </div>
        </div>
    );
}

function VisTax({ p, tone }: { p: number; tone: string }) {
    const subtotal = 48000;
    const vat = Math.round(subtotal * 0.16);
    const wht = Math.round(subtotal * 0.05);
    const total = subtotal + vat - wht;
    const stages = [
        { label: "Subtotal · rental revenue", val: subtotal, sign: "" },
        { label: "VAT · 16% · UAE", val: vat, sign: "+" },
        { label: "Withholding · 5% · KSA rider", val: wht, sign: "−" },
    ];
    return (
        <div className="h-full flex flex-col justify-center gap-3 px-8">
            <div
                className="rounded-md border p-4"
                style={{
                    background: "rgba(15,22,38,0.6)",
                    borderColor: `${tone}40`,
                    opacity: ease(clamp(p / 0.1)),
                }}
            >
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[9px] uppercase tracking-[0.22em] text-slate-500 font-medium">Invoice INV-2026-0892 · tax stack</p>
                    <p className="text-[8.5px] tabular-nums font-mono" style={{ color: tone }}>multi-jurisdiction</p>
                </div>
                {stages.map((s, i) => {
                    const sP = ease(clamp((p - 0.15 - i * 0.22) / 0.3));
                    const displayVal = Math.round(s.val * sP);
                    return (
                        <div
                            key={s.label}
                            className="py-1.5 flex items-baseline justify-between border-b"
                            style={{
                                borderColor: "rgba(148,163,184,0.08)",
                                opacity: sP,
                            }}
                        >
                            <span className="text-[10px] text-slate-400">{s.label}</span>
                            <span className="text-[12px] font-semibold text-white tabular-nums">
                                {s.sign} JOD {displayVal.toLocaleString()}
                            </span>
                        </div>
                    );
                })}
                <div
                    className="pt-3 flex items-baseline justify-between"
                    style={{ opacity: ease(clamp((p - 0.85) / 0.15)) }}
                >
                    <span className="text-[10px] uppercase tracking-[0.22em] font-bold" style={{ color: tone }}>Total due</span>
                    <span className="text-[22px] font-black text-white tabular-nums leading-none">
                        JOD {total.toLocaleString()}
                    </span>
                </div>
            </div>
            {/* Filing packet tag */}
            <div
                className="self-start px-3 py-1.5 rounded border flex items-center gap-2"
                style={{
                    background: `${tone}10`,
                    borderColor: `${tone}35`,
                    opacity: ease(clamp((p - 0.9) / 0.1)),
                }}
            >
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: tone }}>Filing packet</span>
                <span className="text-[10px] text-slate-300">Q2 2026 · ready</span>
            </div>
        </div>
    );
}

function VisAging({ p, tone }: { p: number; tone: string }) {
    const buckets = [
        { label: "Current (0-29d)", amount: 142000, pct: 68, color: "#34d399" },
        { label: "30-59 days", amount: 42000, pct: 20, color: "#fbbf24" },
        { label: "60-89 days", amount: 18000, pct: 9, color: "#fb923c" },
        { label: "90+ days", amount: 8200, pct: 3, color: "#f87171" },
    ];
    return (
        <div className="h-full flex flex-col justify-center gap-2.5 px-8">
            <div className="flex items-baseline justify-between" style={{ opacity: ease(clamp(p / 0.1)) }}>
                <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-slate-400">AR aging · Fleet Corp</p>
                <p className="text-[9px] tabular-nums text-slate-500">Total outstanding JOD 210,200</p>
            </div>
            {buckets.map((b, i) => {
                const bP = ease(clamp((p - 0.12 - i * 0.12) / 0.3));
                return (
                    <div key={b.label} className="flex flex-col gap-1" style={{ opacity: bP }}>
                        <div className="flex items-baseline justify-between">
                            <span className="text-[10px] text-slate-300">{b.label}</span>
                            <span className="text-[10px] tabular-nums text-white font-semibold">JOD {b.amount.toLocaleString()}</span>
                        </div>
                        <div className="h-[8px] rounded overflow-hidden" style={{ background: "rgba(148,163,184,0.08)" }}>
                            <div
                                className="h-full rounded"
                                style={{
                                    width: `${b.pct * bP}%`,
                                    background: b.color,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
            {/* Dunning fired row */}
            <div
                className="mt-2 rounded border px-3 py-2 flex items-center gap-3"
                style={{
                    background: `${tone}10`,
                    borderColor: `${tone}40`,
                    opacity: ease(clamp((p - 0.7) / 0.15)),
                }}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={tone} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16v16H4z" />
                    <path d="M4 4l8 8 8-8" />
                </svg>
                <div className="flex-1 min-w-0">
                    <p className="text-[9.5px] font-semibold" style={{ color: tone }}>Dunning sent · Level 2 escalation</p>
                    <p className="text-[9px] text-slate-400">INV-2026-0746 · 62 days · JOD 4,100 · Fleet Corp AP notified</p>
                </div>
            </div>
        </div>
    );
}

function VisBankMatch({ p, tone }: { p: number; tone: string }) {
    const pairs = [
        { bank: "APR 12 · SWIFT IN · 420.00", book: "BK-1142 · paid" },
        { bank: "APR 14 · ACH · 180.00", book: "BK-1159 · paid" },
        { bank: "APR 16 · SWIFT IN · 2,340.00", book: "INV-0892 partial" },
        { bank: "APR 18 · CARD · 86.50", book: "Overage · BK-1142" },
        { bank: "APR 20 · TRANSFER · 500.00", book: "DEP-0341" },
    ];
    // Upload-first narrative: first ~18% shows the statement dropping in, then matching runs.
    const uploadT = clamp(p / 0.18);
    const matchP = clamp((p - 0.18) / 0.72);
    const matched = Math.floor(5 * clamp((matchP - 0.05) / 0.7));
    const counter = Math.floor(847 * ease(matchP));
    return (
        <div className="h-full flex flex-col justify-center gap-3 px-8">
            {/* Upload banner — fades out once the reconciliation begins */}
            <div
                className="rounded border border-dashed flex items-center gap-2 px-3 py-1.5"
                style={{
                    background: `${tone}10`,
                    borderColor: `${tone}55`,
                    opacity: ease(clamp(uploadT / 0.5)) * (1 - ease(clamp((matchP - 0.4) / 0.4)) * 0.85),
                    transform: `translateY(${(1 - ease(uploadT)) * -4}px)`,
                }}
            >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2V11M8 2L4.5 5.5M8 2L11.5 5.5" stroke={tone} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 13H14" stroke={tone} strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <span className="text-[9px] font-mono tabular-nums text-slate-200">bank-apr-2026.csv</span>
                <span className="text-[8.5px] text-slate-500">· 850 lines · 42 KB</span>
                <span className="ml-auto text-[8.5px] font-bold uppercase tracking-[0.18em]" style={{ color: tone }}>
                    {uploadT < 0.9 ? "parsing…" : "parsed"}
                </span>
            </div>
            <div className="flex items-baseline justify-between" style={{ opacity: ease(clamp((p - 0.12) / 0.1)) }}>
                <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-slate-400">Reconciliation · from statement</p>
                <p className="text-[10px] tabular-nums">
                    <span className="font-semibold text-white">{counter}</span>
                    <span className="text-slate-500"> / 850 matched</span>
                </p>
            </div>
            <div className="relative grid grid-cols-[1fr_40px_1fr] gap-2 items-center">
                <div className="flex flex-col gap-1">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-slate-500 font-semibold mb-0.5">Statement line</p>
                    {pairs.map((pair, i) => (
                        <div
                            key={i}
                            className="rounded border px-2 py-1.5 text-[9px] tabular-nums font-mono"
                            style={{
                                background: "rgba(15,22,38,0.55)",
                                borderColor: i < matched ? `${tone}50` : "rgba(148,163,184,0.1)",
                                color: i < matched ? "#e2e8f0" : "#94a3b8",
                                opacity: ease(clamp((matchP - i * 0.04) / 0.18)),
                            }}
                        >
                            {pair.bank}
                        </div>
                    ))}
                </div>
                {/* Connectors */}
                <svg width="100%" height="100%" viewBox="0 0 40 150" preserveAspectRatio="none" className="self-stretch">
                    {pairs.map((_, i) => {
                        const y = 14 + i * 28;
                        const drawP = clamp((matchP - 0.1 - i * 0.08) / 0.18);
                        return (
                            <line
                                key={i}
                                x1="2" y1={y} x2={2 + 36 * drawP} y2={y}
                                stroke={i < matched ? tone : "#334155"}
                                strokeWidth="1.2"
                                strokeDasharray="3 2"
                            />
                        );
                    })}
                </svg>
                <div className="flex flex-col gap-1">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-slate-500 font-semibold mb-0.5 text-right">Ledger</p>
                    {pairs.map((pair, i) => (
                        <div
                            key={i}
                            className="rounded border px-2 py-1.5 text-[9px] font-mono tabular-nums text-right"
                            style={{
                                background: "rgba(15,22,38,0.55)",
                                borderColor: i < matched ? `${tone}50` : "rgba(148,163,184,0.1)",
                                color: i < matched ? "#e2e8f0" : "#94a3b8",
                                opacity: ease(clamp((matchP - i * 0.04) / 0.18)),
                            }}
                        >
                            {pair.book}
                        </div>
                    ))}
                </div>
            </div>
            <div
                className="rounded border px-3 py-1.5 flex items-center justify-between"
                style={{
                    background: `${tone}10`,
                    borderColor: `${tone}35`,
                    opacity: ease(clamp((p - 0.85) / 0.15)),
                }}
            >
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: tone }}>Reconciled</span>
                <span className="text-[9.5px] text-slate-300">3 exceptions · queued for review</span>
            </div>
        </div>
    );
}

function VisAudit({ p, tone }: { p: number; tone: string }) {
    const events = [
        { time: "11:47:02", event: "Invoice INV-2026-0892 · sealed", hash: "a7e2c194" },
        { time: "11:47:18", event: "GL posting · batch #4812", hash: "3f9d1b08" },
        { time: "11:48:01", event: "VAT filing · Q2 packet assembled", hash: "8c0e4d27" },
        { time: "07:45:10", event: "Fleet Corp AP · receipt confirmed", hash: "e1f3a956" },
        { time: "07:45:11", event: "Cash posting · Bank 1", hash: "5b9c7e03" },
        { time: "08:02:44", event: "Reconciliation · 847/850 matched", hash: "d2e8f104" },
        { time: "08:03:15", event: "Trial balance · verified", hash: "b6a09c5d" },
        { time: "08:04:00", event: "Period April 2026 · closed", hash: "9f1e2a70" },
    ];
    return (
        <div className="h-full flex flex-col justify-center gap-2 px-8">
            <div className="flex items-center justify-between" style={{ opacity: ease(clamp(p / 0.08)) }}>
                <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-slate-400">Audit ledger · append-only</p>
                <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={tone} strokeWidth="2">
                        <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                    </svg>
                    <span className="text-[9px] uppercase tracking-wider font-bold" style={{ color: tone }}>Immutable · 7y retention</span>
                </div>
            </div>
            <div
                className="rounded-md border overflow-hidden"
                style={{
                    background: "rgba(15,22,38,0.6)",
                    borderColor: `${tone}30`,
                    opacity: ease(clamp(p / 0.1)),
                }}
            >
                {events.map((e, i) => {
                    const eP = ease(clamp((p - 0.1 - i * 0.08) / 0.2));
                    return (
                        <div
                            key={i}
                            className="px-3 py-1 grid grid-cols-[70px_1fr_90px] gap-2 items-center border-b text-[9.5px] tabular-nums"
                            style={{
                                borderColor: "rgba(148,163,184,0.06)",
                                opacity: eP,
                                transform: `translateX(${(1 - eP) * -6}px)`,
                            }}
                        >
                            <span className="font-mono text-slate-500">{e.time}</span>
                            <span className="text-slate-200 truncate">{e.event}</span>
                            <span className="font-mono text-[8.5px]" style={{ color: tone }}>{e.hash}</span>
                        </div>
                    );
                })}
                <div
                    className="px-3 py-1.5 flex items-center justify-between"
                    style={{
                        background: `${tone}08`,
                        opacity: ease(clamp((p - 0.85) / 0.15)),
                    }}
                >
                    <span className="text-[8.5px] uppercase tracking-wider font-semibold" style={{ color: tone }}>Chain verified</span>
                    <span className="text-[9px] text-slate-400 font-mono">SOX · IFRS 15 · read-only</span>
                </div>
            </div>
        </div>
    );
}

function VisualFor({ visual, p, tone }: { visual: VisualKey; p: number; tone: string }) {
    switch (visual) {
        case "orgtree": return <VisOrgTree p={p} tone={tone} />;
        case "revrec": return <VisRevRec p={p} tone={tone} />;
        case "journal": return <VisJournal p={p} tone={tone} />;
        case "tax": return <VisTax p={p} tone={tone} />;
        case "aging": return <VisAging p={p} tone={tone} />;
        case "bankmatch": return <VisBankMatch p={p} tone={tone} />;
        case "audit": return <VisAudit p={p} tone={tone} />;
    }
}

// ─── CARD LAYOUT ─────────────────────────────────────────
interface CardState {
    card: Card;
    index: number;
    x: number;
    opacity: number;
    descP: number;
    chipsP: number;
    visualP: number;
}

function renderCard({ card, x, opacity, descP, chipsP, visualP }: CardState) {
    return (
        <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
                transform: `translate3d(${x}%, 0, 0)`,
                opacity,
                pointerEvents: "none",
                willChange: "transform, opacity",
            }}
        >
            <div
                className="relative grid grid-cols-[38%_62%] gap-6 rounded-2xl border overflow-hidden"
                style={{
                    width: "min(1400px, 82%)",
                    height: "min(560px, 68%)",
                    background: "linear-gradient(135deg, rgba(15,22,38,0.85), rgba(10,16,32,0.95))",
                    borderColor: `${card.tone}40`,
                    boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px ${card.tone}20, 0 0 60px ${card.tone}15`,
                }}
            >
                {/* tone accent bar left edge */}
                <div
                    className="absolute top-0 left-0 bottom-0 w-[3px]"
                    style={{ background: `linear-gradient(to bottom, transparent, ${card.tone}, transparent)` }}
                />
                {/* Number in top-right */}
                <div className="absolute top-5 right-5 flex items-center gap-2 text-[10px] font-mono tabular-nums text-slate-500">
                    <span>{card.num}</span>
                    <span className="text-slate-700">/</span>
                    <span>07</span>
                </div>

                {/* LEFT — feature copy */}
                <div className="relative flex flex-col justify-center p-8 pl-10">
                    <p
                        className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3"
                        style={{ color: card.tone }}
                    >
                        {card.eyebrow}
                    </p>
                    <h3
                        className="text-white tracking-[-0.02em] leading-[1.08] mb-4"
                        style={{ fontSize: "clamp(24px, 2.1vw, 32px)", fontWeight: 600 }}
                    >
                        {card.name}
                    </h3>
                    <div
                        className="text-slate-300 leading-relaxed mb-5"
                        style={{ fontSize: "clamp(12px, 0.95vw, 14px)", minHeight: "96px" }}
                    >
                        <Description
                            anim={card.textAnim}
                            text={card.desc}
                            progress={descP}
                            tone={card.tone}
                        />
                    </div>
                    {/* chips */}
                    <div className="flex flex-wrap gap-1.5">
                        {card.chips.map((ch, i) => {
                            const cP = ease(clamp((chipsP - i * 0.12) / 0.3));
                            return (
                                <span
                                    key={ch}
                                    className="text-[9.5px] font-medium px-2 py-0.5 rounded border"
                                    style={{
                                        color: card.tone,
                                        background: `${card.tone}10`,
                                        borderColor: `${card.tone}35`,
                                        opacity: cP,
                                        transform: `translateY(${(1 - cP) * 6}px)`,
                                    }}
                                >
                                    {ch}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT — mini visual */}
                <div className="relative border-l" style={{ borderColor: "rgba(148,163,184,0.08)" }}>
                    <VisualFor visual={card.visual} p={visualP} tone={card.tone} />
                </div>
            </div>
        </div>
    );
}

// ─── MAIN ────────────────────────────────────────────────
export function S15Corporate() {
    const [paused, setPaused] = useState(false);
    const [, setTick] = useState(0);
    const pausedRef = useRef(false);
    pausedRef.current = paused;

    // Two clocks:
    //   wallRef     — always advances; drives intro + content animations within the active card.
    //   carouselRef — pauses on hover; drives which card is visible and its entry/exit.
    const wallRef = useRef(0);
    const carouselRef = useRef(0);
    const activeIdxRef = useRef(-1);
    const activeEnterWallRef = useRef(0);

    useEffect(() => {
        let raf = 0;
        let last = performance.now();
        const frame = (now: number) => {
            const dt = (now - last) / 1000;
            last = now;
            wallRef.current += dt;
            if (wallRef.current >= INTRO_DUR && !pausedRef.current) {
                carouselRef.current += dt;
            }
            if (wallRef.current >= INTRO_DUR) {
                const localTNow = carouselRef.current % LOOP_TOTAL;
                const idx = Math.floor(localTNow / CARD_STEP) % CARDS.length;
                if (idx !== activeIdxRef.current) {
                    activeIdxRef.current = idx;
                    activeEnterWallRef.current = wallRef.current;
                }
            }
            setTick((t) => (t + 1) & 0x7fffffff);
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, []);

    const elapsedS = wallRef.current;
    // Intro progress
    const introFadeT = ease(clamp(elapsedS / INTRO_FADE_IN));
    const settleT = ease(clamp((elapsedS - INTRO_SETTLE_START) / (INTRO_SETTLE_END - INTRO_SETTLE_START)));
    const carouselRevealT = ease(clamp((elapsedS - CAROUSEL_REVEAL_START) / (CAROUSEL_REVEAL_END - CAROUSEL_REVEAL_START)));
    const introDone = elapsedS >= INTRO_DUR;

    const localT = introDone ? carouselRef.current % LOOP_TOTAL : -1;
    const currentIdx = introDone ? Math.max(0, activeIdxRef.current) : 0;
    const activeContentT = introDone ? wallRef.current - activeEnterWallRef.current : 0;

    const cardStates: CardState[] = !introDone ? [] : CARDS.map((card, i) => {
        const baseStart = i * CARD_STEP;
        // pick the carousel-relative t in [0, CARD_DUR] — either direct or wrapped
        const candidates = [localT - baseStart, localT - baseStart + LOOP_TOTAL, localT - baseStart - LOOP_TOTAL];
        let t = Number.POSITIVE_INFINITY;
        for (const c of candidates) {
            if (c >= 0 && c <= CARD_DUR && c < t) t = c;
        }
        if (!Number.isFinite(t)) return null as unknown as CardState;

        let x = 0, opacity = 1;
        const entryDur = 0.55;
        const exitDur = 0.55;

        if (t < entryDur) {
            const p = ease(t / entryDur);
            x = 60 * (1 - p);
            opacity = p;
        } else if (t < CARD_DUR - exitDur) {
            x = 0;
            opacity = 1;
        } else {
            const p = ease((t - (CARD_DUR - exitDur)) / exitDur);
            x = -60 * p;
            opacity = 1 - p;
        }

        // Content time: active card uses wall-clock since entry (keeps animating while paused),
        // exiting/entering-but-not-yet-active cards use carousel-relative t (already clamped).
        const contentT = i === currentIdx ? activeContentT : t;
        const descP = clamp((contentT - 0.35) / 1.3);
        const chipsP = clamp((contentT - 1.5) / 0.8);
        const visualP = clamp((contentT - 0.5) / 3.3);

        return { card, index: i, x, opacity, descP, chipsP, visualP };
    }).filter(Boolean) as CardState[];

    return (
        <section className="h-full w-full relative overflow-hidden" style={{ backgroundColor: "#0a1020" }}>
            {/* Ambient glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(251,191,36,0.05) 0%, transparent 70%)",
                }}
            />

            {/* Header chrome */}
            <div
                className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between pointer-events-none"
                style={{ padding: "32px 72px 0 160px" }}
            >
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-slate-400">Fleetora · Finance</span>
                    <span className="text-slate-700">/</span>
                    <span className="text-[10px] tracking-wider text-slate-500">Chapter V — The Finance Stack</span>
                </div>
                <span className="text-[10px] tracking-wider text-slate-500 tabular-nums">01 / 05</span>
            </div>

            {/* Stack heading — large centered on entry, settles to small top position.
                Uses scale transform (not font-size) so the line never reflows. */}
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
                    The Finance Stack
                </p>
                <h2
                    className="text-white tracking-[-0.025em] leading-[1.08]"
                    style={{
                        fontSize: "clamp(20px, 1.75vw, 28px)",
                        fontWeight: 600,
                        opacity: introFadeT,
                    }}
                >
                    <WordReveal
                        progress={introFadeT}
                        parts={[
                            { text: "Everything your finance team owns. " },
                            { text: "One system.", className: "text-amber-300" },
                        ]}
                    />
                </h2>
            </div>

            {/* Cards — carousel region, fades in after heading settles */}
            <div
                className="absolute left-0 right-0"
                style={{
                    top: "22%",
                    bottom: "14%",
                    opacity: carouselRevealT,
                    transform: `translateY(${(1 - carouselRevealT) * 14}px)`,
                    pointerEvents: carouselRevealT > 0.5 ? "auto" : "none",
                }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {cardStates.map((cs) => (
                    <div key={cs.index}>{renderCard(cs)}</div>
                ))}
            </div>

            {/* Progress rail — lifted above deck's bottom dots (bottom-6 z-40) */}
            <div
                className="absolute left-0 right-0 z-30 flex flex-col items-center gap-2 pointer-events-none"
                style={{ bottom: 72, opacity: carouselRevealT }}
            >
                <div className="flex items-center gap-1.5">
                    {CARDS.map((c, i) => {
                        const active = i === currentIdx;
                        return (
                            <div
                                key={i}
                                className="rounded-full transition-all duration-300"
                                style={{
                                    width: active ? 22 : 5,
                                    height: 5,
                                    background: active ? c.tone : "rgba(148,163,184,0.22)",
                                }}
                            />
                        );
                    })}
                </div>
                <span
                    className="text-[9px] font-mono uppercase tracking-[0.25em] tabular-nums transition-colors duration-200"
                    style={{ color: paused ? "#fbbf24" : "rgba(148,163,184,0.45)" }}
                >
                    {paused ? "◼ paused · move cursor to resume" : "▶ hover card to pause"}
                </span>
            </div>
        </section>
    );
}
