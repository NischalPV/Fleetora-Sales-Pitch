"use client";

import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────
// "The Add-ons Marketplace" · light marketplace theme
// Real product photography, big cards, cream background.
// Visually distinct from the rest of the deck — this is a
// customer-facing marketplace, not an internal dashboard.
// ─────────────────────────────────────────────────────────

function clamp(x: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, x)); }
function ease(x: number) { return 1 - Math.pow(1 - clamp(x), 3); }

type Category = "Comfort" | "Experience" | "Drivers" | "Equipment";

interface Addon {
    id: string;
    name: string;
    cat: Category;
    img: string;
    price: number;
    unit: string;
    note?: string;
    driverScore?: number;
}

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=560&h=360&q=75`;

const ADDONS: Addon[] = [
    // Comfort
    { id: "c-umb",   name: "Umbrella · branded",   cat: "Comfort",    img: u("photo-1428592953211-077101b2021b"), price: 25,  unit: "trip" },
    { id: "c-baby",  name: "Baby seat · 0–4y",     cat: "Comfort",    img: u("photo-1601758125946-6ec2ef64daf8"), price: 45,  unit: "day" },
    { id: "c-sat",   name: "Sat-nav · offline",    cat: "Comfort",    img: u("photo-1581922814484-0b48460b7010"), price: 15,  unit: "day" },
    // Experience
    { id: "e-champ", name: "Champagne welcome",    cat: "Experience", img: u("photo-1547595628-c61a29f496f0"), price: 250, unit: "trip" },
    { id: "e-flow",  name: "Flower bouquet",       cat: "Experience", img: u("photo-1487530811176-3780de880c2d"), price: 120, unit: "trip" },
    { id: "e-kit",   name: "Welcome amenity kit",  cat: "Experience", img: u("photo-1513885535751-8b9238bd345a"), price: 85,  unit: "trip" },
    // Drivers · dynamic pricing by score
    { id: "d-std",   name: "Driver · standard",    cat: "Drivers",    img: u("photo-1556157382-97eda2d62296"), price: 350, unit: "day", driverScore: 4.6, note: "English · UAE license · 5+ yrs" },
    { id: "d-prem",  name: "Driver · premium",     cat: "Drivers",    img: u("photo-1573497019418-b400bb3ab074"), price: 520, unit: "day", driverScore: 4.9, note: "Multilingual · concierge trained" },
    { id: "d-vip",   name: "Chauffeur · VIP",      cat: "Drivers",    img: u("photo-1564564321837-a57b7070ac4f"), price: 750, unit: "day", driverScore: 5.0, note: "Suit · EN+AR · 10+ yrs" },
    // Equipment
    { id: "x-roof",  name: "Roof cargo box",       cat: "Equipment",  img: u("photo-1551522435-a13afa10f103"), price: 80,  unit: "day" },
    { id: "x-bike",  name: "Bike rack · 3-bike",   cat: "Equipment",  img: u("photo-1485965120184-e220f721d03e"), price: 60,  unit: "day" },
    { id: "x-snow",  name: "Snow chains · winter", cat: "Equipment",  img: u("photo-1483728642387-6c3bdd6c93e5"), price: 40,  unit: "day" },
];

const CATEGORIES: Category[] = ["Comfort", "Experience", "Drivers", "Equipment"];
const CAT_TONE: Record<Category, string> = {
    Comfort:    "#0891b2",
    Experience: "#c2410c",
    Drivers:    "#6d28d9",
    Equipment:  "#15803d",
};

// Cart auto-fill cycles
const CART_CYCLES: string[][] = [
    ["c-baby", "e-champ", "e-flow"],
    ["d-prem", "x-roof", "c-sat"],
    ["d-vip", "e-kit", "c-umb"],
    ["d-std", "x-bike", "c-baby"],
];
const CYCLE_DURATION = 9.0;
const ITEM_STAGGER = 1.2;

export function S19AddonsMarketplace() {
    const [phase, setPhase] = useState(0);
    const [, setTick] = useState(0);
    const tRef = useRef(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 200),
            setTimeout(() => setPhase(2), 700),
            setTimeout(() => setPhase(3), 1400),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    useEffect(() => {
        let raf = 0;
        let last = performance.now();
        const loop = (now: number) => {
            const dt = (now - last) / 1000;
            last = now;
            tRef.current += dt;
            setTick((p) => (p + 1) & 0xffff);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, []);

    const t = tRef.current;
    const cyclePhase = (t / CYCLE_DURATION) % CART_CYCLES.length;
    const cycleIdx = Math.floor(cyclePhase);
    const cycle = CART_CYCLES[cycleIdx] ?? CART_CYCLES[0];
    const cycleLocal = (cyclePhase - cycleIdx) * CYCLE_DURATION;
    const exitT = clamp((cycleLocal - (CYCLE_DURATION - 1.0)) / 1.0);

    const addedItems = cycle.map((id, i) => {
        const start = i * ITEM_STAGGER + 1.0;
        const inP = ease(clamp((cycleLocal - start) / 0.45));
        const item = ADDONS.find((a) => a.id === id);
        return { item, inP, start };
    }).filter((x) => x.item) as Array<{ item: Addon; inP: number; start: number }>;

    const lastFiringIdx = (() => {
        for (let i = addedItems.length - 1; i >= 0; i--) {
            const ageAfter = cycleLocal - (addedItems[i].start + 0.45);
            if (ageAfter >= 0 && ageAfter < 0.6) return i;
        }
        return -1;
    })();
    const highlightedId = lastFiringIdx >= 0 ? addedItems[lastFiringIdx].item.id : null;

    const cartTotal = addedItems.reduce((s, x) => s + x.item.price * (x.inP), 0);
    const cartCount = addedItems.filter((x) => x.inP > 0.5).length;

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden" style={{
            backgroundColor: "#f4f6fb",
        }}>
            {/* Hexagonal grid overlay */}
            <HexGrid />

            {/* Subtle pearl sheen */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,255,255,0.6) 0%, transparent 65%)",
            }} />

            {/* Header */}
            <div className="relative z-10 w-full max-w-[1380px] flex items-end justify-between mb-5 pb-3 border-b" style={{
                borderColor: "rgba(28,38,60,0.12)",
                opacity: phase >= 1 ? 1 : 0,
                transform: phase >= 1 ? "translateY(0)" : "translateY(-12px)",
                transition: "opacity 0.5s, transform 0.5s",
            }}>
                <div>
                    <p className="text-[10px] font-semibold tracking-[0.32em] uppercase mb-2" style={{ color: "#a16207" }}>
                        Chapter VI · The Marketplace
                    </p>
                    <p className="text-[28px] font-semibold leading-none tracking-tight" style={{ color: "#0f172a" }}>
                        Every booking. More revenue.
                    </p>
                    <p className="text-[13px] mt-2" style={{ color: "#64748b" }}>
                        Customers shop · franchise earns · drivers priced dynamically by score
                    </p>
                </div>
                <div className="flex items-center gap-7 text-right">
                    <div>
                        <p className="text-[8.5px] font-mono uppercase tracking-[0.22em]" style={{ color: "#94a3b8" }}>Avg lift</p>
                        <p className="text-[16px] mt-1 font-bold tabular-nums" style={{ color: "#15803d" }}>+18% per booking</p>
                    </div>
                    <div>
                        <p className="text-[8.5px] font-mono uppercase tracking-[0.22em]" style={{ color: "#94a3b8" }}>Margin</p>
                        <p className="text-[16px] mt-1 font-bold tabular-nums" style={{ color: "#a16207" }}>~70%</p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="relative z-10 w-full max-w-[1380px] grid grid-cols-[1fr_340px] gap-5 items-stretch" style={{
                opacity: phase >= 2 ? 1 : 0,
                transition: "opacity 0.6s",
            }}>
                <Storefront highlightedId={highlightedId} t={t} />
                <CartPanel addedItems={addedItems} total={cartTotal} count={cartCount} exitT={exitT} t={t} />
            </div>
        </section>
    );
}

// ─── Hex grid background ────────────────────────────────
function HexGrid() {
    // Pointy-top hexagon honeycomb · clean outlines
    const SIZE = 13;             // hex side length
    const W = SIZE * Math.sqrt(3); // hex flat-to-flat width
    const H = SIZE * 2;          // hex point-to-point height
    const STEP_X = W;
    const STEP_Y = H * 0.75;
    const COLS = 56;
    const ROWS = 38;

    const hexes: React.ReactNode[] = [];
    for (let row = -1; row < ROWS; row++) {
        for (let col = -1; col < COLS; col++) {
            const cx = col * STEP_X + (row % 2 === 0 ? 0 : STEP_X / 2);
            const cy = row * STEP_Y;
            const pts = [
                [cx, cy - SIZE],
                [cx + W / 2, cy - SIZE / 2],
                [cx + W / 2, cy + SIZE / 2],
                [cx, cy + SIZE],
                [cx - W / 2, cy + SIZE / 2],
                [cx - W / 2, cy - SIZE / 2],
            ].map((p) => p.join(",")).join(" ");
            hexes.push(
                <polygon
                    key={`${row}-${col}`}
                    points={pts}
                    fill="none"
                    stroke="rgba(28,38,60,0.04)"
                    strokeWidth={1}
                />
            );
        }
    }

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${COLS * STEP_X} ${ROWS * STEP_Y}`}
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            {hexes}
        </svg>
    );
}

// ─── Storefront ─────────────────────────────────────────
function Storefront({ highlightedId, t }: { highlightedId: string | null; t: number }) {
    const rowA = ADDONS.filter((a) => a.cat === "Comfort" || a.cat === "Experience");
    const rowB = ADDONS.filter((a) => a.cat === "Drivers" || a.cat === "Equipment");

    return (
        <div className="rounded-2xl flex flex-col overflow-hidden" style={{
            background: "#ffffff",
            boxShadow: "0 1px 0 rgba(28,38,60,0.04), 0 12px 32px -16px rgba(28,38,60,0.12)",
            border: "1px solid rgba(28,38,60,0.06)",
        }}>
            {/* Browser-ish header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: "rgba(28,38,60,0.06)" }}>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
                    <span className="w-2 h-2 rounded-full" style={{ background: "#eab308" }} />
                    <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
                </div>
                <p className="text-[11px] font-mono" style={{ color: "#64748b" }}>fleetora.market / booking · BK-2026-0422 · checkout</p>
                <span className="ml-auto flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.22em]" style={{ color: "#15803d" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> live
                </span>
            </div>

            {/* Category bar */}
            <div className="flex items-stretch border-b" style={{ borderColor: "rgba(28,38,60,0.06)" }}>
                {CATEGORIES.map((c) => (
                    <div key={c} className="flex-1 px-5 py-2.5 flex items-center gap-2 border-r last:border-r-0" style={{ borderColor: "rgba(28,38,60,0.05)" }}>
                        <span style={{ width: 7, height: 7, borderRadius: 2, background: CAT_TONE[c] }} />
                        <span className="text-[12px] font-semibold tracking-tight" style={{ color: "#0f172a" }}>{c}</span>
                        <span className="text-[10px] font-mono ml-auto" style={{ color: "#94a3b8" }}>
                            {ADDONS.filter((a) => a.cat === c).length}
                        </span>
                    </div>
                ))}
            </div>

            {/* Two infinite-scrolling rows · larger cards */}
            <div className="flex flex-col gap-4 py-5">
                <ScrollRow items={rowA} highlightedId={highlightedId} t={t} direction="left"  speed={28} />
                <ScrollRow items={rowB} highlightedId={highlightedId} t={t} direction="right" speed={32} />
            </div>
        </div>
    );
}

// ─── Infinite scroll row ────────────────────────────────
const CARD_W = 256;
const CARD_GAP = 16;

function ScrollRow({
    items, highlightedId, t, direction, speed,
}: {
    items: Addon[]; highlightedId: string | null; t: number;
    direction: "left" | "right"; speed: number;
}) {
    const setW = items.length * (CARD_W + CARD_GAP);
    const offset = ((t * speed) % setW + setW) % setW;
    const translateX = direction === "left" ? -offset : offset - setW;

    // Render items 3× for safe seamless loop in either direction
    const tripled = [...items, ...items, ...items];

    return (
        <div className="overflow-hidden relative" style={{ height: 340 }}>
            <div
                className="flex absolute top-0 left-0"
                style={{
                    gap: CARD_GAP,
                    transform: `translateX(${translateX}px)`,
                    willChange: "transform",
                    paddingLeft: 20,
                    paddingRight: 20,
                }}
            >
                {tripled.map((a, i) => (
                    <AddonCard
                        key={`${a.id}-${i}`}
                        addon={a}
                        highlighted={highlightedId === a.id}
                        t={t}
                    />
                ))}
            </div>
            {/* Edge fades for marquee feel */}
            <div className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none" style={{
                background: "linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0) 100%)",
            }} />
            <div className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none" style={{
                background: "linear-gradient(270deg, #ffffff 0%, rgba(255,255,255,0) 100%)",
            }} />
        </div>
    );
}

// ─── Add-on card ────────────────────────────────────────
function AddonCard({ addon, highlighted, t }: { addon: Addon; highlighted: boolean; t: number }) {
    const tone = CAT_TONE[addon.cat];
    const isDriver = addon.cat === "Drivers";

    const flicker = isDriver ? 1 + Math.sin(t * 1.2 + addon.price) * 0.005 : 1;
    const dynPrice = Math.round(addon.price * flicker);

    return (
        <div
            className="rounded-xl flex flex-col relative overflow-hidden transition-all duration-200 flex-shrink-0"
            style={{
                width: 256,
                background: "#ffffff",
                border: highlighted ? `2px solid ${tone}` : "1px solid rgba(28,38,60,0.08)",
                boxShadow: highlighted
                    ? `0 0 0 1px ${tone}40, 0 14px 32px -10px ${tone}55`
                    : "0 1px 2px rgba(28,38,60,0.04), 0 6px 16px -10px rgba(28,38,60,0.08)",
                transform: highlighted ? "translateY(-3px)" : "translateY(0)",
            }}
        >
            {/* Image */}
            <div className="relative w-full overflow-hidden" style={{
                height: 180,
                background: `linear-gradient(135deg, ${tone}14, #f8fafc)`,
            }}>
                <img
                    src={addon.img}
                    alt={addon.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ display: "block" }}
                />
                {/* Category chip */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.16em]" style={{
                    background: "rgba(255,255,255,0.94)",
                    color: tone,
                    backdropFilter: "blur(4px)",
                }}>
                    {addon.cat}
                </div>
                {/* Driver score */}
                {isDriver && addon.driverScore != null && (
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tabular-nums flex items-center gap-1" style={{
                        background: "rgba(255,255,255,0.94)",
                        color: "#a16207",
                        backdropFilter: "blur(4px)",
                    }}>
                        <span style={{ color: "#eab308" }}>★</span>
                        {addon.driverScore.toFixed(1)}
                    </div>
                )}
                {/* Added stamp */}
                {highlighted && (
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full text-[9.5px] font-bold uppercase tracking-[0.18em]" style={{
                        background: tone,
                        color: "#ffffff",
                        boxShadow: `0 4px 12px ${tone}55`,
                    }}>
                        ✓ Added
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-3.5 flex flex-col flex-1">
                <p className="text-[13px] font-semibold leading-tight" style={{ color: "#0f172a" }}>{addon.name}</p>
                {addon.note ? (
                    <p className="text-[10.5px] mt-1 leading-snug line-clamp-1" style={{ color: "#64748b" }}>{addon.note}</p>
                ) : (
                    <p className="text-[10.5px] mt-1" style={{ color: "#94a3b8" }}>Per {addon.unit}</p>
                )}

                <div className="mt-auto pt-3 flex items-end justify-between border-t" style={{ borderColor: "rgba(28,38,60,0.06)" }}>
                    <div>
                        <p className="text-[16px] font-bold tabular-nums leading-none tracking-tight" style={{ color: "#0f172a" }}>
                            JOD {dynPrice}
                        </p>
                        <p className="text-[9px] font-mono uppercase tracking-[0.18em] mt-1" style={{ color: "#94a3b8" }}>
                            /{addon.unit}{isDriver ? " · dyn" : ""}
                        </p>
                    </div>
                    <button
                        className="px-3 py-1.5 rounded-lg text-[10.5px] font-bold uppercase tracking-[0.16em] transition-all"
                        style={{
                            background: highlighted ? tone : "#0f172a",
                            color: "#ffffff",
                            boxShadow: highlighted ? `0 4px 12px ${tone}55` : "0 2px 6px rgba(15,23,42,0.18)",
                        }}
                    >
                        + Add
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Cart panel ─────────────────────────────────────────
function CartPanel({
    addedItems, total, count, exitT, t,
}: {
    addedItems: Array<{ item: Addon; inP: number; start: number }>;
    total: number;
    count: number;
    exitT: number;
    t: number;
}) {
    const baseFare = 1450;
    const grandTotal = baseFare + total;
    const liftPct = total / baseFare * 100;
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.4);

    return (
        <div className="rounded-2xl flex flex-col overflow-hidden" style={{
            background: "#ffffff",
            boxShadow: "0 1px 0 rgba(28,38,60,0.04), 0 12px 32px -16px rgba(28,38,60,0.12)",
            border: "1px solid rgba(28,38,60,0.06)",
            opacity: 1 - exitT,
        }}>
            <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(28,38,60,0.06)" }}>
                <div className="flex items-center gap-2">
                    <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: "#0f172a",
                        boxShadow: `0 0 ${4 + pulse * 6}px rgba(15,23,42,${0.2 + pulse * 0.3})`,
                    }} />
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "#0f172a" }}>Your booking · live</p>
                </div>
                <span className="text-[10px] font-mono tabular-nums" style={{ color: "#94a3b8" }}>{count} item{count !== 1 ? "s" : ""}</span>
            </div>

            {/* Base fare */}
            <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(28,38,60,0.06)" }}>
                <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: "#94a3b8" }}>Base fare</span>
                    <span className="text-[13px] font-mono tabular-nums" style={{ color: "#475569" }}>JOD {baseFare.toLocaleString()}</span>
                </div>
            </div>

            {/* Add-ons stream */}
            <div className="flex-1 px-5 py-4 flex flex-col gap-3 overflow-hidden">
                <p className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: "#94a3b8" }}>Add-ons</p>
                {addedItems.length === 0 && (
                    <p className="text-[12px] italic" style={{ color: "#cbd5e1" }}>Customer browsing…</p>
                )}
                {addedItems.map((ai, i) => {
                    const tone = CAT_TONE[ai.item.cat];
                    return (
                        <div
                            key={`${ai.item.id}-${i}`}
                            className="flex items-center gap-3"
                            style={{
                                opacity: ai.inP,
                                transform: `translateX(${(1 - ai.inP) * -10}px)`,
                            }}
                        >
                            <div className="rounded-lg overflow-hidden flex-shrink-0" style={{
                                width: 48, height: 48,
                                border: `1px solid ${tone}33`,
                            }}>
                                <img src={ai.item.img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-semibold truncate" style={{ color: "#0f172a" }}>{ai.item.name}</p>
                                <p className="text-[9.5px] font-mono uppercase tracking-[0.18em]" style={{ color: tone }}>{ai.item.cat}</p>
                            </div>
                            <span className="font-mono tabular-nums text-[12px] font-bold" style={{ color: "#15803d" }}>+JOD {ai.item.price}</span>
                        </div>
                    );
                })}
            </div>

            {/* Totals */}
            <div className="px-5 py-3 border-t" style={{ borderColor: "rgba(28,38,60,0.06)" }}>
                <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: "#94a3b8" }}>Add-ons total</span>
                    <span className="text-[13px] font-mono tabular-nums font-semibold" style={{ color: "#15803d" }}>+JOD {total.toFixed(0)}</span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: "#94a3b8" }}>Booking lift</span>
                    <span className="text-[11px] font-mono tabular-nums font-semibold" style={{ color: liftPct > 0 ? "#15803d" : "#94a3b8" }}>
                        {liftPct > 0 ? "+" : ""}{liftPct.toFixed(1)}%
                    </span>
                </div>
            </div>

            {/* Grand total */}
            <div className="px-5 py-4 flex items-baseline justify-between" style={{
                background: "#0f172a",
                color: "#ffffff",
            }}>
                <div>
                    <p className="text-[9.5px] font-mono uppercase tracking-[0.22em]" style={{ color: "#94a3b8" }}>Grand total</p>
                    <p className="text-[9px] font-mono mt-0.5" style={{ color: "#cbd5e1" }}>{count} add-on{count !== 1 ? "s" : ""} captured</p>
                </div>
                <span className="tabular-nums font-bold leading-none tracking-tight" style={{ fontSize: 24, color: "#fde68a", letterSpacing: "-0.02em" }}>
                    JOD {grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
            </div>
        </div>
    );
}
