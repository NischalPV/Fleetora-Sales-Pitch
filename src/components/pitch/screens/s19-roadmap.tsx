"use client";

import { useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────
// S19 — Chapter VI · "The Build Roadmap" (constellation)
//
// Editorial-style: a single horizontal timeline is the hero.
// Each phase is a "station" on the line. Detail blocks float
// above/below, alternating for rhythm. The active phase
// (Marketplace) gets a hero treatment — larger type,
// inline glyph, glowing connector. No boxed cards.
// ─────────────────────────────────────────────────────────

type Status = "shipped" | "now" | "next" | "later" | "vision";
type GlyphKind = "foundation" | "marketplace" | "reach" | "intelligence" | "autonomy";

interface Phase {
    n: string;
    period: string;
    title: string;
    status: Status;
    blurb: string;
    headline: string;     // single hero line for the active phase
    items: string[];
    ships: number;
    accent: string;
    glyph: GlyphKind;
    above: boolean;       // detail block sits above (true) or below (false) the line
}

const PHASES: Phase[] = [
    {
        n: "01",
        period: "Q1–Q2 2026",
        title: "Foundation",
        status: "shipped",
        blurb: "The operating core is live in production.",
        headline: "Branch ops, fleet map, HQ cockpit, AI rebalance — all shipped.",
        items: ["Branch ops", "Fleet map", "HQ cockpit", "AI rebalance"],
        ships: 18,
        accent: "#34d399",
        glyph: "foundation",
        above: true,
    },
    {
        n: "02",
        period: "Q3 2026",
        title: "Marketplace",
        status: "now",
        blurb: "Internal liquidity for vehicles and add-ons.",
        headline: "A live exchange where one branch's idle car becomes another's revenue.",
        items: ["Vehicle exchange", "Add-ons marketplace", "Match engine"],
        ships: 6,
        accent: "#60a5fa",
        glyph: "marketplace",
        above: false,
    },
    {
        n: "03",
        period: "Q4 2026",
        title: "Reach",
        status: "next",
        blurb: "Direct surfaces for drivers and customers.",
        headline: "Driver app, customer app, multi-currency, kiosks.",
        items: ["Driver app", "Customer app", "Multi-currency", "Kiosks"],
        ships: 8,
        accent: "#a78bfa",
        glyph: "reach",
        above: true,
    },
    {
        n: "04",
        period: "Q1 2027",
        title: "Intelligence v2",
        status: "later",
        blurb: "The brain gets sharper. The ledger gets smarter.",
        headline: "Dynamic pricing, predictive maintenance v2, embedded financing.",
        items: ["Dynamic pricing", "Predict v2", "Embedded financing"],
        ships: 7,
        accent: "#fbbf24",
        glyph: "intelligence",
        above: false,
    },
    {
        n: "05",
        period: "Q2+ 2027",
        title: "Autonomy",
        status: "vision",
        blurb: "Decisions move from people to the platform.",
        headline: "Autonomous booking, zero-touch ops, self-balancing fleet.",
        items: ["Autonomous booking", "Zero-touch ops", "Self-balancing"],
        ships: 5,
        accent: "#f472b6",
        glyph: "autonomy",
        above: true,
    },
];

const STATUS_LABEL: Record<Status, string> = {
    shipped: "Shipped",
    now: "Building now",
    next: "In design",
    later: "Planned",
    vision: "Vision",
};

export function S19Roadmap() {
    const [t, setT] = useState(0);
    const [reveal, setReveal] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setReveal(1), 200),   // header
            setTimeout(() => setReveal(2), 700),   // line draws
            setTimeout(() => setReveal(3), 1100),  // stations
            setTimeout(() => setReveal(4), 1500),  // detail blocks
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    useEffect(() => {
        let raf = 0;
        let last = performance.now();
        let acc = 0;
        const loop = (now: number) => {
            const dt = (now - last) / 1000;
            last = now;
            acc += dt;
            setT(acc);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <section
            className="h-screen w-full flex flex-col items-center relative overflow-hidden"
            style={{
                backgroundColor: "#0a1020",
                paddingTop: "clamp(2.5rem, 6vh, 5rem)",
                paddingBottom: "clamp(2rem, 5vh, 4rem)",
            }}
        >
            {/* Ambient backdrop */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(96,165,250,0.06) 0%, transparent 70%)",
            }} />
            {/* Faint grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: "linear-gradient(rgba(148,163,184,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.035) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                opacity: 0.5,
            }} />

            {/* Header */}
            <div
                className="text-center relative z-10"
                style={{
                    opacity: reveal >= 1 ? 1 : 0,
                    transform: reveal >= 1 ? "translateY(0)" : "translateY(-12px)",
                    transition: "opacity 0.6s, transform 0.6s",
                }}
            >
                <p
                    className="font-semibold tracking-[0.4em] uppercase text-violet-300/80 mb-3"
                    style={{ fontSize: "clamp(9px, 0.7vw, 12px)" }}
                >
                    Chapter VI · The Build Roadmap
                </p>
                <h2
                    className="font-semibold text-white tracking-tight leading-[0.98]"
                    style={{ fontSize: "clamp(34px, 3.6vw, 64px)" }}
                >
                    What ships, and when.
                </h2>
                <p
                    className="text-slate-400 mt-4 mx-auto leading-relaxed"
                    style={{
                        fontSize: "clamp(13px, 1.05vw, 17px)",
                        maxWidth: "clamp(420px, 44vw, 720px)",
                    }}
                >
                    Five phases on a single track. Bi-weekly releases, no big-bang migrations.
                </p>
            </div>

            {/* Constellation timeline — fills the rest of the viewport */}
            <div
                className="relative w-full flex-1 flex items-center justify-center"
                style={{ marginTop: "clamp(2rem, 5vh, 4rem)" }}
            >
                <Constellation phases={PHASES} reveal={reveal} t={t} />
            </div>
        </section>
    );
}

// ─── The constellation — central line with stations + detail blocks ──
function Constellation({
    phases,
    reveal,
    t,
}: {
    phases: Phase[];
    reveal: number;
    t: number;
}) {
    const STATION_PCT = [16, 33, 50, 67, 84];
    const NOW_INDEX = 0.95;
    const nowPct = STATION_PCT[0] + NOW_INDEX * (STATION_PCT[1] - STATION_PCT[0]);
    const lineY = "50%"; // vertical center of this section
    const pulse = 0.5 + Math.sin(t * 2.4) * 0.5;

    return (
        <div className="relative w-full h-full">
            {/* ── Edge-to-edge dashed base line — draws LTR ── */}
            <div
                className="absolute left-0 right-0"
                style={{
                    top: lineY,
                    height: 0,
                    borderTop: "1.5px dashed rgba(148,163,184,0.22)",
                    transformOrigin: "left center",
                    transform: reveal >= 2 ? "scaleX(1)" : "scaleX(0)",
                    transition: "transform 1.4s ease-out",
                }}
            />

            {/* ── Solid green shipped line: grows LEFT → RIGHT (origin: left center) ── */}
            <div
                className="absolute"
                style={{
                    top: `calc(${lineY} - 1px)`,
                    left: 0,
                    width: `${nowPct}%`,
                    height: 2,
                    background: "linear-gradient(90deg, rgba(52,211,153,0) 0%, rgba(52,211,153,0.7) 8%, rgba(52,211,153,1) 100%)",
                    boxShadow: "0 0 12px rgba(52,211,153,0.55)",
                    transformOrigin: "left center",
                    transform: reveal >= 2 ? "scaleX(1)" : "scaleX(0)",
                    transition: "transform 1.4s ease-out",
                }}
            />

            {/* ── Stations + detail blocks ── */}
            {phases.map((phase, i) => (
                <Station
                    key={phase.title}
                    phase={phase}
                    leftPct={STATION_PCT[i]}
                    revealStation={reveal >= 3}
                    revealDetail={reveal >= 4}
                    delay={i * 0.12}
                    t={t}
                />
            ))}
        </div>
    );
}

// ─── A single station: marker + connector + detail block ──
function Station({
    phase,
    leftPct,
    revealStation,
    revealDetail,
    delay,
    t,
}: {
    phase: Phase;
    leftPct: number;
    revealStation: boolean;
    revealDetail: boolean;
    delay: number;
    t: number;
}) {
    const isShipped = phase.status === "shipped";
    const isNow = phase.status === "now";
    const isFuture = !isShipped && !isNow;
    const pulse = isNow ? 0.5 + Math.sin(t * 2.4) * 0.5 : 0;
    const markerSize = isNow ? 14 : isShipped ? 11 : 9;

    // Detail block is offset above or below the line
    const isAbove = phase.above;

    return (
        <div
            className="absolute group"
            style={{
                left: `${leftPct}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                opacity: revealStation ? 1 : 0,
                transitionProperty: "opacity",
                transitionDuration: "0.6s",
                transitionDelay: `${delay}s`,
                cursor: "pointer",
            }}
        >
            <div className="relative flex flex-col items-center">
                {/* Detail block — sits above OR below depending on phase.above */}
                <div
                    className={`absolute left-1/2 -translate-x-1/2 ${isAbove ? "bottom-full" : "top-full"}`}
                    style={{
                        marginBottom: isAbove ? "clamp(36px, 5vh, 70px)" : undefined,
                        marginTop: !isAbove ? "clamp(36px, 5vh, 70px)" : undefined,
                        opacity: revealDetail ? 1 : 0,
                        transform: revealDetail
                            ? "translateX(-50%) translateY(0)"
                            : `translateX(-50%) translateY(${isAbove ? -6 : 6}px)`,
                        transition: `opacity 0.6s ${delay + 0.3}s, transform 0.6s ${delay + 0.3}s`,
                        width: isNow ? "clamp(280px, 22vw, 400px)" : "clamp(180px, 14vw, 260px)",
                    }}
                >
                    <DetailBlock phase={phase} status={phase.status} isAbove={isAbove} t={t} />
                </div>

                {/* Connector line from detail block to station */}
                <div
                    className={`absolute left-1/2 -translate-x-1/2 ${isAbove ? "bottom-1/2" : "top-1/2"}`}
                    style={{
                        width: 1.5,
                        height: `clamp(20px, 4vh, 50px)`,
                        background: isFuture
                            ? `linear-gradient(${isAbove ? "0deg" : "180deg"}, ${phase.accent}55, ${phase.accent}10)`
                            : `linear-gradient(${isAbove ? "0deg" : "180deg"}, ${phase.accent}, ${phase.accent}40)`,
                        opacity: revealDetail ? (isFuture ? 0.6 : 1) : 0,
                        transition: `opacity 0.5s ${delay + 0.45}s`,
                        boxShadow: isNow ? `0 0 6px ${phase.accent}` : "none",
                        [isAbove ? "transformOrigin" : "transformOrigin"]: isAbove ? "bottom center" : "top center",
                    }}
                />

                {/* The marker — small dot on the line */}
                <div
                    className="rounded-full transition-transform duration-300 group-hover:scale-125"
                    style={{
                        width: markerSize,
                        height: markerSize,
                        background: isFuture ? "#0a1020" : phase.accent,
                        border: isFuture ? `1.5px solid ${phase.accent}` : "none",
                        boxShadow: isNow
                            ? `0 0 ${4 + pulse * 12}px ${phase.accent}, 0 0 0 ${3 + pulse * 4}px ${phase.accent}24`
                            : isShipped
                                ? `0 0 8px ${phase.accent}90`
                                : `0 0 4px ${phase.accent}30`,
                    }}
                />
                {isNow && (
                    <div
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            top: "50%",
                            left: "50%",
                            width: markerSize + 14,
                            height: markerSize + 14,
                            transform: "translate(-50%, -50%)",
                            border: `1px dashed ${phase.accent}80`,
                            animation: "spin 14s linear infinite",
                        }}
                    />
                )}
            </div>
        </div>
    );
}

// ─── Detail block — typography + glyph ──────────────────
function DetailBlock({
    phase,
    status,
    isAbove,
    t,
}: {
    phase: Phase;
    status: Status;
    isAbove: boolean;
    t: number;
}) {
    const isShipped = status === "shipped";
    const isNow = status === "now";
    const isFuture = !isShipped && !isNow;

    const glyphSize = isNow
        ? "clamp(36px, 2.6vw, 48px)"
        : "clamp(26px, 1.9vw, 36px)";

    return (
        <div
            className="flex flex-col items-center text-center"
            style={{ gap: 4 }}
        >
            {/* Glyph badge — colored circle housing the phase icon */}
            <div
                className="rounded-full flex items-center justify-center mb-2"
                style={{
                    width: glyphSize,
                    height: glyphSize,
                    background: isFuture
                        ? "rgba(15,22,38,0.85)"
                        : `radial-gradient(circle at 30% 30%, ${phase.accent}55, ${phase.accent}12)`,
                    border: `1.5px solid ${isFuture ? `${phase.accent}60` : phase.accent}`,
                    boxShadow: isNow
                        ? `0 0 18px ${phase.accent}80, inset 0 0 10px ${phase.accent}25`
                        : isShipped
                            ? `0 0 12px ${phase.accent}70, inset 0 0 8px ${phase.accent}25`
                            : `0 0 6px ${phase.accent}25`,
                }}
            >
                <PhaseGlyph
                    kind={phase.glyph}
                    color="#fff"
                    active={isNow}
                    t={t}
                />
            </div>

            {/* Period + status pill */}
            <div className="flex items-center justify-center gap-2">
                <span
                    className="font-mono uppercase tracking-[0.28em]"
                    style={{
                        fontSize: "clamp(9px, 0.65vw, 11px)",
                        color: isFuture ? "#64748b" : `${phase.accent}cc`,
                    }}
                >
                    {phase.period}
                </span>
                <span className="text-slate-700">·</span>
                <StatusPill status={status} accent={phase.accent} />
            </div>

            {/* Phase number + title */}
            <div className="flex items-baseline gap-2 mt-1">
                <span
                    className="font-mono tabular-nums leading-none"
                    style={{
                        fontSize: "clamp(11px, 0.85vw, 14px)",
                        color: isFuture ? "#475569" : `${phase.accent}99`,
                        opacity: 0.9,
                    }}
                >
                    {phase.n}
                </span>
                <h3
                    className="font-semibold tracking-tight leading-[1.05]"
                    style={{
                        fontSize: isNow ? "clamp(22px, 1.85vw, 32px)" : "clamp(15px, 1.2vw, 22px)",
                        color: isFuture ? "#cbd5e1" : "#fff",
                    }}
                >
                    {phase.title}
                </h3>
            </div>

            {/* Headline (only the active phase gets a hero headline) */}
            {isNow && (
                <p
                    className="leading-snug mt-1 mx-auto"
                    style={{
                        fontSize: "clamp(13px, 1vw, 16px)",
                        color: "#cbd5e1",
                        maxWidth: "100%",
                    }}
                >
                    {phase.headline}
                </p>
            )}

            {/* Brief blurb for non-active */}
            {!isNow && (
                <p
                    className="leading-snug mt-0.5 mx-auto"
                    style={{
                        fontSize: "clamp(11px, 0.78vw, 13px)",
                        color: isFuture ? "#94a3b8" : "#cbd5e1",
                    }}
                >
                    {phase.blurb}
                </p>
            )}

            {/* Ships counter */}
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
                <span
                    className="font-mono tabular-nums font-bold leading-none"
                    style={{
                        fontSize: isNow ? "clamp(15px, 1.1vw, 19px)" : "clamp(11px, 0.85vw, 14px)",
                        color: isFuture ? "#64748b" : phase.accent,
                    }}
                >
                    {phase.ships}
                </span>
                <span
                    className="font-mono uppercase tracking-[0.22em]"
                    style={{
                        fontSize: "clamp(8.5px, 0.6vw, 10px)",
                        color: isFuture ? "#475569" : "#64748b",
                    }}
                >
                    ships
                </span>
            </div>
        </div>
    );
}

// ─── Compact status pill ────────────────────────────────
function StatusPill({ status, accent }: { status: Status; accent: string }) {
    const isShipped = status === "shipped";
    const isNow = status === "now";

    return (
        <span
            className="font-mono font-bold uppercase tracking-[0.22em] flex items-center gap-1"
            style={{
                fontSize: "clamp(8px, 0.58vw, 10px)",
                color: isShipped ? accent : isNow ? accent : "#64748b",
                opacity: isShipped || isNow ? 1 : 0.85,
            }}
        >
            {isShipped && <CheckIcon color={accent} />}
            {isNow && (
                <span
                    className="inline-block rounded-full"
                    style={{ width: 4, height: 4, background: accent }}
                />
            )}
            {STATUS_LABEL[status]}
        </span>
    );
}

function CheckIcon({ color }: { color: string }) {
    return (
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ─── Phase-specific glyphs ──────────────────────────────
function PhaseGlyph({
    kind,
    color,
    active,
    t,
}: {
    kind: GlyphKind;
    color: string;
    active: boolean;
    t: number;
}) {
    const size = 20;
    if (kind === "foundation") {
        return (
            <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
                <rect x="2" y="11" width="14" height="4" rx="0.6" fill={color} opacity="0.95" />
                <rect x="3.5" y="6.5" width="11" height="4" rx="0.6" fill={color} opacity="0.7" />
                <rect x="5" y="2" width="8" height="4" rx="0.6" fill={color} opacity="0.45" />
            </svg>
        );
    }
    if (kind === "marketplace") {
        return (
            <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
                <path d="M2 6 L13 6 M10 3 L13 6 L10 9" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 12 L5 12 M8 9 L5 12 L8 15" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    if (kind === "reach") {
        const cycle = 2.6;
        const phases = active ? [0, 0.33, 0.66] : [0];
        return (
            <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="2" fill={color} />
                {phases.map((ph, i) => {
                    const local = active ? ((t + ph * cycle) % cycle) / cycle : 0.6;
                    const r = 3 + local * 5;
                    const op = (1 - local) * 0.7 + 0.2;
                    return <circle key={i} cx="9" cy="9" r={r} fill="none" stroke={color} strokeWidth="1" opacity={op} />;
                })}
            </svg>
        );
    }
    if (kind === "intelligence") {
        return (
            <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
                <path d="M9 1 L10.5 7.5 L17 9 L10.5 10.5 L9 17 L7.5 10.5 L1 9 L7.5 7.5 Z" fill={color} opacity="0.95" />
                <circle cx="9" cy="9" r="1.4" fill="#0a1020" />
            </svg>
        );
    }
    const cycle = 4.0;
    const ang = ((t / cycle) * Math.PI * 2) % (Math.PI * 2);
    const cx = 9 + Math.cos(ang) * 5.5;
    const cy = 9 + Math.sin(ang) * 5.5;
    return (
        <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="6" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" strokeDasharray="2 2" />
            <circle cx="9" cy="9" r="2" fill={color} opacity="0.85" />
            <circle cx={cx} cy={cy} r="1.5" fill={color} />
        </svg>
    );
}
