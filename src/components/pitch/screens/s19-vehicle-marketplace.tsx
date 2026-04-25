"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────
// "The Marketplace" · The Match Engine
//
// Thesis: Your network IS the marketplace. A car idle in
// Abu Dhabi flows to a fleet in Dubai through Fleetora's
// matching engine — internal liquidity, no middlemen.
//
// Slide cycles through real deals. Each tells a story:
//   1. Two parties appear (SELL · BUY)
//   2. Engine prices the trade (ASK → MATCHED)
//   3. "MATCHED" lands · result band reveals saved $/days
//   4. Deal slides into ledger · next pair takes the stage
//
// Background: subtle topology of MENA branches always
// breathing — pinging nodes, edges flickering — so the
// matched deal feels like one transaction in a live network.
// ─────────────────────────────────────────────────────────

function clamp(x: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, x)); }
function smoothstep(e0: number, e1: number, x: number) {
    const t = clamp((x - e0) / (e1 - e0));
    return t * t * (3 - 2 * t);
}
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

interface Deal {
    id: string;
    sell: {
        photo: string; year: number; make: string; model: string; trim: string;
        odo: number; ask: number; city: string; branch: string; condition: string;
    };
    buy: {
        photo: string; year: number; make: string; model: string; trim: string;
        need: string; city: string; branch: string; intent: string;
    };
    matched: number;       // settled price
    daysToMatch: number;   // headline result
    savedVsAuction: number;
    color: string;         // accent
}

const PHOTO = (id: string) => `https://images.unsplash.com/${id}?w=720&q=80&auto=format&fit=crop`;

const DEALS: Deal[] = [
    {
        id: "FLX-1284",
        sell: { photo: PHOTO("photo-1742230285052-8c3b445c01fc"), year: 2024, make: "Nissan", model: "Patrol", trim: "Platinum 4WD", odo: 32100, ask: 245000, city: "Abu Dhabi", branch: "AUH-03 · Khalifa City", condition: "Excellent · 1 owner" },
        buy:  { photo: PHOTO("photo-1742230285052-8c3b445c01fc"), year: 2024, make: "Nissan", model: "Patrol", trim: "Platinum 4WD", need: "3-yr corporate lease", city: "Dubai", branch: "DXB-07 · DIP Corporate", intent: "Replace ageing Land Cruisers" },
        matched: 238500, daysToMatch: 2.4, savedVsAuction: 12400, color: "#34d399",
    },
    {
        id: "FLX-1285",
        sell: { photo: PHOTO("photo-1643628067815-3c32ff04f23e"), year: 2026, make: "MG", model: "ZS EV", trim: "Long Range", odo: 4280, ask: 96500, city: "Sharjah", branch: "SHJ-02 · Industrial 5", condition: "Excellent · ex-showroom" },
        buy:  { photo: PHOTO("photo-1643628067815-3c32ff04f23e"), year: 2026, make: "MG", model: "ZS EV", trim: "Long Range", need: "EV subscription pool ×6", city: "Dubai", branch: "DXB-04 · Al Quoz EV Hub", intent: "Charging-corridor expansion" },
        matched: 93800, daysToMatch: 1.1, savedVsAuction: 4800, color: "#60a5fa",
    },
    {
        id: "FLX-1286",
        sell: { photo: PHOTO("photo-1643142311296-304953706775"), year: 2023, make: "Mazda", model: "CX-5", trim: "Signature AWD", odo: 64800, ask: 92000, city: "Dubai", branch: "DXB-11 · JLT Returns", condition: "Good · off-lease" },
        buy:  { photo: PHOTO("photo-1643142311296-304953706775"), year: 2023, make: "Mazda", model: "CX-5", trim: "Signature AWD", need: "Driver-program tier 2", city: "Riyadh", branch: "RUH-01 · Olaya Hub", intent: "Mid-segment expansion" },
        matched: 89200, daysToMatch: 3.6, savedVsAuction: 7400, color: "#fbbf24",
    },
];

export function S19VehicleMarketplace() {
    const [t, setT] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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

    // Deal cycle: each deal occupies CYCLE seconds, with internal phases.
    const CYCLE = 7.2;
    const safeT = Number.isFinite(t) && t >= 0 ? t : 0;
    const cycleP = (safeT % CYCLE) / CYCLE;
    const dealIdx = ((Math.floor(safeT / CYCLE) % DEALS.length) + DEALS.length) % DEALS.length;
    const deal = DEALS[dealIdx] ?? DEALS[0];
    if (!deal) return null;

    // Internal phase markers within a single deal cycle:
    //   0.00 - 0.12  enter      (cards & engine slide in)
    //   0.12 - 0.55  matching   (price ticks from ask down to matched)
    //   0.55 - 0.62  lock       (MATCHED stamp lands · bloom)
    //   0.62 - 0.85  reveal     (result band shows saved $/days)
    //   0.85 - 1.00  exit       (slide to ledger · next enters)
    const enterT = smoothstep(0.00, 0.10, cycleP);
    const exitT  = smoothstep(0.88, 1.00, cycleP);
    const stageOpacity = enterT * (1 - exitT);
    const stageY = (1 - enterT) * 24 + exitT * -16;

    const matchT = smoothstep(0.14, 0.55, cycleP);
    const livePrice = lerp(deal.sell.ask, deal.matched, matchT);

    const lockT = smoothstep(0.55, 0.62, cycleP);
    const revealT = smoothstep(0.62, 0.78, cycleP);

    const bloomT = lockT * (1 - smoothstep(0.78, 0.92, cycleP));

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#0a1020" }}>
            {/* ── Layer 1: Live network topology (always breathing) ── */}
            <NetworkBackdrop t={t} />

            {/* ── Layer 2: Header ── */}
            <div className="relative w-full max-w-[1280px] px-12 mb-7">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-violet-300/80 mb-3">
                            Chapter VI · The Marketplace
                        </p>
                        <h2 className="text-[42px] font-semibold text-white tracking-tight leading-[1.02]">
                            Your network <span className="italic text-slate-400 font-light">is</span> the marketplace.
                        </h2>
                        <p className="text-[14px] text-slate-400 mt-3 max-w-xl leading-relaxed">
                            Idle vehicles in one branch flow to demand in another — priced, matched, and settled by the platform. No middlemen. No auction haircut.
                        </p>
                    </div>
                    <DealCounter t={t} />
                </div>
            </div>

            {/* ── Layer 3: The Match Stage ── */}
            <div
                className="relative w-full max-w-[1280px] px-12"
                style={{
                    opacity: stageOpacity,
                    transform: `translateY(${stageY}px)`,
                    willChange: "transform, opacity",
                }}
            >
                <div className="flex items-stretch gap-0 relative" style={{ minHeight: 280 }}>
                    {/* SELL party */}
                    <PartyCard
                        side="sell"
                        deal={deal}
                        enterT={enterT}
                        exitT={exitT}
                    />

                    {/* Connector + Engine */}
                    <div className="flex-1 flex flex-col items-center justify-center relative" style={{ minWidth: 280 }}>
                        <ConnectorFlow side="left" t={t} color={deal.color} matchT={matchT} />
                        <MatchingEngine
                            deal={deal}
                            cycleP={cycleP}
                            livePrice={livePrice}
                            matchT={matchT}
                            lockT={lockT}
                            bloomT={bloomT}
                            revealT={revealT}
                        />
                        <ConnectorFlow side="right" t={t} color={deal.color} matchT={matchT} />
                    </div>

                    {/* BUY party */}
                    <PartyCard
                        side="buy"
                        deal={deal}
                        enterT={enterT}
                        exitT={exitT}
                    />
                </div>
            </div>

            {/* ── Layer 4: Aggregate ledger (always-on, summarizes the week) ── */}
            <LedgerStrip t={t} />
        </section>
    );
}

// ─── Live network topology backdrop ─────────────────────
function NetworkBackdrop({ t }: { t: number }) {
    // Branches across MENA — kept to outer perimeter so they
    // don't overlap the central card stage. (relative coords)
    const NODES = [
        { x: 0.06, y: 0.18, code: "RUH-01" },
        { x: 0.04, y: 0.46, code: "JED-02" },
        { x: 0.08, y: 0.74, code: "AMM-01" },
        { x: 0.04, y: 0.88, code: "CAI-01" },
        { x: 0.95, y: 0.18, code: "SHJ-02" },
        { x: 0.96, y: 0.42, code: "DXB-07" },
        { x: 0.94, y: 0.66, code: "AUH-03" },
        { x: 0.96, y: 0.86, code: "MCT-01" },
        { x: 0.50, y: 0.92, code: "MUS-01" },
        { x: 0.30, y: 0.94, code: "DOH-01" },
        { x: 0.72, y: 0.93, code: "BEY-01" },
    ];
    // Edges (subset, all between perimeter nodes)
    const EDGES: [number, number][] = [
        [0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7],
        [0, 4], [3, 8], [7, 8], [9, 10], [1, 5], [2, 6],
    ];

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* radial vignette */}
            <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(167,139,250,0.06) 0%, transparent 70%)",
            }} />
            {/* grid faint */}
            <div className="absolute inset-0" style={{
                backgroundImage: "linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                opacity: 0.5,
            }} />

            <svg className="absolute inset-0 w-full h-full">
                {/* Edges with traveling data packets */}
                {EDGES.map(([a, b], i) => {
                    const A = NODES[a], B = NODES[b];
                    const x1 = `${A.x * 100}%`, y1 = `${A.y * 100}%`;
                    const x2 = `${B.x * 100}%`, y2 = `${B.y * 100}%`;
                    return (
                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(148,163,184,0.12)" strokeWidth={0.6} strokeDasharray="2 6" />
                    );
                })}
            </svg>

            {/* Nodes — pulsing dots with codes */}
            {NODES.map((n, i) => {
                const cycle = 2.4;
                const phase = ((t + i * 0.31) % cycle) / cycle;
                const pulse = Math.sin(phase * Math.PI * 2) * 0.5 + 0.5;
                return (
                    <div key={i}
                        className="absolute"
                        style={{
                            left: `${n.x * 100}%`,
                            top: `${n.y * 100}%`,
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <div
                            className="rounded-full"
                            style={{
                                width: 4 + pulse * 2,
                                height: 4 + pulse * 2,
                                background: "#a78bfa",
                                boxShadow: `0 0 ${6 + pulse * 8}px rgba(167,139,250,${0.3 + pulse * 0.4})`,
                            }}
                        />
                        <span className="absolute top-[8px] left-[7px] text-[8px] font-mono uppercase tracking-[0.18em] text-slate-600 whitespace-nowrap">
                            {n.code}
                        </span>
                    </div>
                );
            })}

            {/* Traveling packets — small dots running along a couple of edges */}
            {EDGES.slice(0, 6).map(([a, b], i) => {
                const A = NODES[a], B = NODES[b];
                const cycle = 4.2;
                const phase = ((t + i * 0.7) % cycle) / cycle;
                const x = lerp(A.x, B.x, phase);
                const y = lerp(A.y, B.y, phase);
                const op = Math.sin(phase * Math.PI);
                return (
                    <div key={`p-${i}`}
                        className="absolute rounded-full"
                        style={{
                            left: `${x * 100}%`,
                            top: `${y * 100}%`,
                            transform: "translate(-50%, -50%)",
                            width: 3, height: 3,
                            background: "#60a5fa",
                            boxShadow: "0 0 6px rgba(96,165,250,0.7)",
                            opacity: op * 0.8,
                        }}
                    />
                );
            })}
        </div>
    );
}

// ─── Aggregate weekly counter (live ticker, top-right) ──
function DealCounter({ t }: { t: number }) {
    // Slowly tick up the deal count for "this week"
    const base = 38;
    const dealsThisWeek = base + Math.floor((t / 8)) % 4;
    const aedM = 184 + ((t / 12) % 1) * 0.8;
    return (
        <div className="text-right">
            <p className="text-[9px] font-mono uppercase tracking-[0.28em] text-slate-500 mb-1">This week · live</p>
            <div className="flex items-baseline gap-3 justify-end">
                <div>
                    <p className="text-[28px] font-semibold text-white tabular-nums leading-none">{dealsThisWeek}</p>
                    <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-slate-500 mt-1">deals matched</p>
                </div>
                <span className="text-slate-700 text-[18px]">·</span>
                <div>
                    <p className="text-[28px] font-semibold text-white tabular-nums leading-none">JOD {aedM.toFixed(1)}M</p>
                    <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-slate-500 mt-1">routed · internal</p>
                </div>
            </div>
        </div>
    );
}

// ─── A party card (left=SELL or right=BUY) ──────────────
function PartyCard({
    side,
    deal,
    enterT,
    exitT,
}: {
    side: "sell" | "buy";
    deal: Deal;
    enterT: number;
    exitT: number;
}) {
    const isSell = side === "sell";
    const v = isSell ? deal.sell : deal.buy;
    const accent = isSell ? "#fb7185" : deal.color;
    const accentSoft = isSell ? "rgba(251,113,133,0.10)" : `${deal.color}1a`;
    const label = isSell ? "SELL · Asking" : "BUY · Demand";
    const fromLabel = isSell ? "From" : "To";

    const slideX = isSell ? -1 : 1;
    const x = (1 - enterT) * 30 * slideX + exitT * -8 * slideX;

    return (
        <div
            className="rounded-2xl border overflow-hidden flex"
            style={{
                width: 380,
                background: `linear-gradient(165deg, ${accentSoft} 0%, rgba(15,22,38,0.95) 65%)`,
                borderColor: `rgba(148,163,184,0.18)`,
                boxShadow: `0 16px 40px -12px rgba(0,0,0,0.6), 0 0 0 1px ${accent}18`,
                transform: `translateX(${x}px)`,
                willChange: "transform",
            }}
        >
            {/* Photo */}
            <div className="relative overflow-hidden flex-shrink-0" style={{ width: 150 }}>
                <Image
                    src={v.photo}
                    alt={`${v.year} ${v.make} ${v.model}`}
                    fill
                    sizes="150px"
                    className="object-cover"
                    style={{ transform: "scale(1.08)" }}
                />
                <div className="absolute inset-0" style={{
                    background: isSell
                        ? "linear-gradient(90deg, rgba(10,16,32,0) 50%, rgba(10,16,32,0.85) 100%)"
                        : "linear-gradient(270deg, rgba(10,16,32,0) 50%, rgba(10,16,32,0.85) 100%)",
                }} />
                <div
                    className="absolute top-0 bottom-0"
                    style={{
                        [isSell ? "right" : "left"]: 0,
                        width: 3,
                        background: accent,
                        boxShadow: `0 0 14px ${accent}`,
                    } as React.CSSProperties}
                />
            </div>

            {/* Body */}
            <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                <div>
                    <p className="text-[9px] font-mono font-bold uppercase tracking-[0.28em] mb-1.5" style={{ color: accent }}>
                        {label}
                    </p>
                    <h4 className="text-[18px] font-semibold text-white leading-tight tracking-tight truncate">
                        {v.year} {v.make} {v.model}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">{v.trim}</p>
                </div>

                {/* Mid: party-specific data */}
                <div className="mt-3 mb-3 space-y-1.5">
                    {isSell ? (
                        <>
                            <SpecLine label="Odometer" value={`${deal.sell.odo.toLocaleString()} km`} />
                            <SpecLine label="Condition" value={deal.sell.condition} />
                            <SpecLine label="Asking" value={`JOD ${deal.sell.ask.toLocaleString()}`} accent={accent} bold />
                        </>
                    ) : (
                        <>
                            <SpecLine label="Need" value={deal.buy.need} />
                            <SpecLine label="Intent" value={deal.buy.intent} />
                        </>
                    )}
                </div>

                {/* Footer: branch */}
                <div className="pt-2 border-t" style={{ borderColor: "rgba(148,163,184,0.12)" }}>
                    <p className="text-[8.5px] font-mono uppercase tracking-[0.22em] text-slate-500">{fromLabel}</p>
                    <p className="text-[12px] text-slate-200 font-medium tracking-tight truncate">{v.branch}</p>
                </div>
            </div>
        </div>
    );
}

function SpecLine({ label, value, accent, bold }: { label: string; value: string; accent?: string; bold?: boolean }) {
    return (
        <div className="flex items-baseline justify-between gap-3">
            <span className="text-[9.5px] font-mono uppercase tracking-[0.22em] text-slate-500 flex-shrink-0">{label}</span>
            <span
                className={`text-[12px] tabular-nums truncate ${bold ? "font-bold" : "font-medium"}`}
                style={{ color: accent || "#e2e8f0" }}
            >
                {value}
            </span>
        </div>
    );
}

// ─── Connector flow with traveling dots between cards/engine ──
function ConnectorFlow({ side, t, color, matchT }: { side: "left" | "right"; t: number; color: string; matchT: number }) {
    // 3 traveling dots, evenly phased
    const dots = [0, 0.33, 0.66];
    const intensity = 0.4 + matchT * 0.6;
    return (
        <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none" style={{
            [side]: 0,
            width: side === "left" ? "calc(50% - 88px)" : "calc(50% - 88px)",
            height: 2,
        } as React.CSSProperties}>
            {/* Base line */}
            <div className="absolute inset-0" style={{
                background: `linear-gradient(${side === "left" ? "90deg" : "270deg"}, ${color}10, ${color}50)`,
                opacity: intensity,
            }} />
            {/* Traveling dots */}
            {dots.map((offset, i) => {
                const cycle = 1.6;
                const phase = ((t + offset * cycle) % cycle) / cycle;
                const x = side === "left" ? phase * 100 : (1 - phase) * 100;
                return (
                    <div key={i}
                        className="absolute top-1/2 -translate-y-1/2 rounded-full"
                        style={{
                            left: `${x}%`,
                            width: 5,
                            height: 5,
                            background: color,
                            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}80`,
                            opacity: Math.sin(phase * Math.PI) * intensity,
                        }}
                    />
                );
            })}
        </div>
    );
}

// ─── The Matching Engine — center hero ──────────────────
function MatchingEngine({
    deal,
    cycleP,
    livePrice,
    matchT,
    lockT,
    bloomT,
    revealT,
}: {
    deal: Deal;
    cycleP: number;
    livePrice: number;
    matchT: number;
    lockT: number;
    bloomT: number;
    revealT: number;
}) {
    const accent = deal.color;
    const matched = lockT > 0.5;

    const status = cycleP < 0.12 ? "ENTERING"
        : cycleP < 0.55 ? "MATCHING"
            : cycleP < 0.62 ? "LOCKING"
                : cycleP < 0.88 ? "MATCHED"
                    : "SETTLED";

    return (
        <div
            className="relative rounded-full flex flex-col items-center justify-center"
            style={{
                width: 220,
                height: 220,
                background: `radial-gradient(circle at 50% 50%, ${accent}1a 0%, rgba(15,22,38,0.95) 70%)`,
                border: `1px solid ${accent}40`,
                boxShadow: `0 0 ${20 + bloomT * 60}px ${accent}${Math.round(bloomT * 80 + 30).toString(16).padStart(2, "0")}, inset 0 0 30px ${accent}10`,
            }}
        >
            {/* Rotating ring */}
            <div
                className="absolute inset-0 rounded-full"
                style={{
                    border: `1.5px dashed ${accent}50`,
                    animation: "spin 18s linear infinite",
                }}
            />
            {/* Inner ring with progress arc */}
            <svg className="absolute inset-0" width="220" height="220" viewBox="0 0 220 220">
                <circle cx="110" cy="110" r="92" fill="none" stroke={`${accent}20`} strokeWidth="2" />
                <circle
                    cx="110" cy="110" r="92" fill="none"
                    stroke={accent}
                    strokeWidth="2"
                    strokeDasharray={`${matchT * 578} 578`}
                    strokeLinecap="round"
                    transform="rotate(-90 110 110)"
                    style={{ filter: `drop-shadow(0 0 6px ${accent})` }}
                />
            </svg>

            {/* Status pill */}
            <div
                className="absolute top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-[0.24em] uppercase"
                style={{
                    background: matched ? accent : "rgba(15,22,38,0.85)",
                    color: matched ? "#0a1020" : accent,
                    border: matched ? "none" : `1px solid ${accent}60`,
                }}
            >
                {status}
            </div>

            {/* Live price */}
            <div className="text-center">
                <p className="text-[8.5px] font-mono uppercase tracking-[0.28em] text-slate-500 mb-1">
                    {matched ? "Settled at" : "Live price"}
                </p>
                <p
                    className="text-[26px] font-bold tabular-nums tracking-tight leading-none transition-colors"
                    style={{ color: matched ? accent : "#fff" }}
                >
                    {Math.round(livePrice).toLocaleString()}
                </p>
                <p className="text-[8.5px] font-mono uppercase tracking-[0.22em] text-slate-500 mt-1">JOD</p>
            </div>

            {/* Result band — appears after lock */}
            <div
                className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap"
                style={{
                    opacity: revealT,
                    transform: `translateX(-50%) translateY(${(1 - revealT) * 8}px)`,
                }}
            >
                <div
                    className="rounded-full px-4 py-2 flex items-center gap-3 backdrop-blur-md"
                    style={{
                        background: "rgba(15,22,38,0.85)",
                        border: `1px solid ${accent}50`,
                    }}
                >
                    <span className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: accent }}>{deal.id}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-[11px] text-white font-medium tabular-nums">
                        {deal.daysToMatch.toFixed(1)}d
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-slate-500">to match</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-[11px] tabular-nums font-bold" style={{ color: accent }}>
                        +JOD {(deal.savedVsAuction / 1000).toFixed(1)}K
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-slate-500">vs auction</span>
                </div>
            </div>

            {/* Bloom flash on lock */}
            <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${accent}80 0%, transparent 60%)`,
                    opacity: bloomT * 0.4,
                }}
            />
        </div>
    );
}

// ─── Aggregate ledger strip — proof at scale ────────────
function LedgerStrip({ t }: { t: number }) {
    const cycle = 4.2;
    const tick = Math.floor(t / cycle) % 4;
    const metrics = [
        { v: "JOD 184M", label: "routed this week" },
        { v: "2.8 days", label: "avg time to match" },
        { v: "-34%", label: "fleet idle days" },
        { v: "-19%", label: "acquisition cost" },
        { v: "12 → 40", label: "branches connected" },
    ];

    return (
        <div className="relative w-full max-w-[1280px] px-12 mt-20 flex items-center justify-center">
            <div
                className="flex items-center gap-7 px-6 py-3 rounded-full backdrop-blur-md whitespace-nowrap"
                style={{
                    background: "rgba(15,22,38,0.65)",
                    border: "1px solid rgba(148,163,184,0.15)",
                }}
            >
                <div className="flex items-center gap-2 pr-3 border-r" style={{ borderColor: "rgba(148,163,184,0.18)" }}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#34d399", animation: "pulse 1.4s ease-in-out infinite" }} />
                    <span className="text-[9px] font-mono uppercase tracking-[0.28em] text-slate-400">Ledger · live</span>
                </div>
                {metrics.map((m, i) => {
                    const highlighted = i === tick;
                    return (
                        <div key={i} className="flex items-baseline gap-2 whitespace-nowrap">
                            <span
                                className="text-[14px] font-semibold tabular-nums tracking-tight transition-colors"
                                style={{ color: highlighted ? "#fff" : "#cbd5e1" }}
                            >
                                {m.v}
                            </span>
                            <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-slate-500 whitespace-nowrap">
                                {m.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
