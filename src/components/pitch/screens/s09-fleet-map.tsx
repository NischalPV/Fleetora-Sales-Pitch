"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────
// FLEET BRAIN — Interactive neural mesh
// ─────────────────────────────────────────────────────────

type NodeType = "brain" | "branch" | "vehicle" | "customer" | "decision" | "data";

interface BNode {
    id: string;
    x: number; y: number; // 0-100
    type: NodeType;
    label: string;
    sub?: string;
    stats?: { l: string; v: string }[];
}

const TYPE: Record<NodeType, { color: string; glow: string; size: number; label: string; blurb: string }> = {
    brain:    { color: "#a855f7", glow: "rgba(168,85,247,0.6)", size: 48, label: "AI CORE",    blurb: "Twelve models run in parallel — demand forecasting, vehicle matching, dynamic pricing, maintenance prediction, churn risk. Everything flows through here." },
    branch:   { color: "#f59e0b", glow: "rgba(245,158,11,0.5)", size: 22, label: "BRANCH",     blurb: "Physical locations. Brain watches inventory, walk-ins and returns in real time — balancing the fleet across the network automatically." },
    vehicle:  { color: "#3b82f6", glow: "rgba(59,130,246,0.5)", size: 13, label: "VEHICLE",    blurb: "Every car is a live node. Brain tracks location, fuel, mileage, and service windows — flagging maintenance and suggesting the best car for each booking." },
    customer: { color: "#10b981", glow: "rgba(16,185,129,0.5)", size: 12, label: "CUSTOMER",   blurb: "People and companies. Brain learns preferences, predicts churn, recommends upsells, and flags risk based on booking history." },
    decision: { color: "#06b6d4", glow: "rgba(6,182,212,0.5)", size: 15, label: "DECISION",    blurb: "Brain's output. Ranked actions with confidence scores and expected impact — your team accepts, tweaks, or overrides." },
    data:     { color: "#ec4899", glow: "rgba(236,72,153,0.5)", size: 14, label: "SIGNAL",     blurb: "External signals. Weather, traffic, events, holidays — Brain correlates these with demand so the network reacts before you ask." },
};

const NODES: BNode[] = [
    { id: "brain", x: 50, y: 50, type: "brain", label: "Fleet Brain", sub: "12 models · always-on",
        stats: [{ l: "Decisions / day", v: "45,287" }, { l: "Confidence", v: "94.2%" }, { l: "Latency", v: "18ms" }] },

    { id: "br-air", x: 68, y: 28, type: "branch", label: "Airport · Amman", sub: "Primary hub",
        stats: [{ l: "Fleet", v: "42 cars" }, { l: "Utilization", v: "92%" }, { l: "Revenue today", v: "12.4K JOD" }] },
    { id: "br-dt", x: 30, y: 30, type: "branch", label: "Downtown · Amman", sub: "Walk-in heavy",
        stats: [{ l: "Fleet", v: "28 cars" }, { l: "Utilization", v: "78%" }] },
    { id: "br-ds", x: 43, y: 75, type: "branch", label: "Dead Sea", sub: "Weekend spike",
        stats: [{ l: "Fleet", v: "16 cars" }, { l: "Utilization", v: "88%" }] },
    { id: "br-aq", x: 72, y: 72, type: "branch", label: "Aqaba", sub: "Coastal",
        stats: [{ l: "Fleet", v: "22 cars" }, { l: "Utilization", v: "71%" }] },
    { id: "br-ir", x: 20, y: 58, type: "branch", label: "Irbid", sub: "North hub",
        stats: [{ l: "Fleet", v: "18 cars" }, { l: "Utilization", v: "64%" }] },

    { id: "v1", x: 82, y: 18, type: "vehicle", label: "Tucson · B-4821", sub: "Active · Ahmad K.", stats: [{ l: "Speed", v: "82 km/h" }, { l: "Fuel", v: "67%" }] },
    { id: "v2", x: 88, y: 42, type: "vehicle", label: "Accent · 47-1203", sub: "Returning · 30m", stats: [{ l: "ETA", v: "4:47 PM" }] },
    { id: "v3", x: 85, y: 60, type: "vehicle", label: "Elantra · 33-9821", sub: "Available" },
    { id: "v4", x: 60, y: 88, type: "vehicle", label: "Sonata · 12-4455", sub: "Active · Omar R." },
    { id: "v5", x: 28, y: 85, type: "vehicle", label: "Creta · 21-7788", sub: "Maintenance flag", stats: [{ l: "Mileage", v: "62,450 km" }] },
    { id: "v6", x: 10, y: 72, type: "vehicle", label: "Tucson · 15-3321", sub: "Available" },
    { id: "v7", x: 8, y: 42, type: "vehicle", label: "Accent · 99-1100", sub: "Active · Layla H." },
    { id: "v8", x: 18, y: 18, type: "vehicle", label: "Elantra · 44-5566", sub: "Checkout in 10m" },
    { id: "v9", x: 55, y: 10, type: "vehicle", label: "Sonata · 88-2244", sub: "Available" },
    { id: "v10", x: 40, y: 92, type: "vehicle", label: "Creta · 66-7788", sub: "Returning" },

    { id: "c1", x: 95, y: 25, type: "customer", label: "Ahmad Khalil", sub: "B-4821 · VIP", stats: [{ l: "Bookings", v: "14" }, { l: "Lifetime", v: "8,230 JOD" }] },
    { id: "c2", x: 96, y: 52, type: "customer", label: "Fleet Corp", sub: "Corporate · 12 active", stats: [{ l: "Net-30", v: "On time" }] },
    { id: "c3", x: 72, y: 94, type: "customer", label: "Omar Rafiq", sub: "Repeat · 8 bookings" },
    { id: "c4", x: 15, y: 92, type: "customer", label: "Layla Hassan", sub: "VIP · 22 bookings" },
    { id: "c5", x: 2, y: 28, type: "customer", label: "Sara Mahmoud", sub: "New walk-in" },
    { id: "c6", x: 40, y: 4, type: "customer", label: "Noor Tawfiq", sub: "Repeat · SUV preference" },

    { id: "d1", x: 62, y: 20, type: "decision", label: "Rebalance", sub: "Airport → Downtown · 3 cars", stats: [{ l: "Est. gain", v: "+840 JOD/day" }, { l: "Confidence", v: "96%" }] },
    { id: "d2", x: 26, y: 45, type: "decision", label: "Maintenance alert", sub: "Tucson B-4821 · in 7 days", stats: [{ l: "Predicted saving", v: "2.3K JOD" }] },
    { id: "d3", x: 68, y: 52, type: "decision", label: "Dynamic pricing", sub: "+15% weekend · Dead Sea", stats: [{ l: "Demand spike", v: "+220%" }] },
    { id: "d4", x: 40, y: 55, type: "decision", label: "Risk flag", sub: "Age 21 · recommend full insurance" },

    { id: "s1", x: 50, y: 6, type: "data", label: "Weather", sub: "Sandstorm +24h", stats: [{ l: "Impact", v: "3 branches" }] },
    { id: "s2", x: 95, y: 78, type: "data", label: "Traffic", sub: "Airport → City +15m delay" },
    { id: "s3", x: 5, y: 14, type: "data", label: "Events", sub: "Concert Fri · 20K attendees", stats: [{ l: "Demand lift", v: "+47%" }] },
    { id: "s4", x: 50, y: 96, type: "data", label: "Calendar", sub: "Public holiday · Apr 26" },
];

const EDGES: [string, string][] = [
    ["brain", "br-air"], ["brain", "br-dt"], ["brain", "br-ds"], ["brain", "br-aq"], ["brain", "br-ir"],
    ["brain", "d1"], ["brain", "d2"], ["brain", "d3"], ["brain", "d4"],
    ["brain", "s1"], ["brain", "s2"], ["brain", "s3"], ["brain", "s4"],
    ["br-air", "v1"], ["br-air", "v2"], ["br-air", "v9"],
    ["br-dt", "v8"], ["br-dt", "v7"],
    ["br-ds", "v5"], ["br-ds", "v10"], ["br-ds", "v4"],
    ["br-aq", "v3"], ["br-aq", "v4"],
    ["br-ir", "v6"], ["br-ir", "v7"],
    ["v1", "c1"], ["v2", "c2"], ["v3", "c2"],
    ["v4", "c3"], ["v7", "c4"], ["v5", "c4"],
    ["v8", "c5"], ["v9", "c6"], ["v10", "c3"], ["v6", "c5"],
    ["d1", "br-air"], ["d1", "br-dt"],
    ["d2", "v1"],
    ["d3", "br-ds"], ["d3", "v5"],
    ["d4", "c4"],
    ["s1", "d3"], ["s2", "d1"], ["s3", "d1"], ["s4", "d3"],
];

const NODE_MAP = new Map(NODES.map((n) => [n.id, n]));

export function S09FleetMap() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 200);
        return () => clearTimeout(t);
    }, []);

    const hovered = hoveredId ? NODE_MAP.get(hoveredId) : null;
    const connected = new Set<string>();
    if (hoveredId) {
        EDGES.forEach(([a, b]) => {
            if (a === hoveredId) connected.add(b);
            if (b === hoveredId) connected.add(a);
        });
    }

    return (
        <section className="h-screen w-full relative overflow-hidden bg-slate-950">
            {/* Ambient radial glow */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(168,85,247,0.1) 0%, rgba(59,130,246,0.03) 45%, transparent 75%)" }} />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

            {/* Top eyebrow */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="absolute top-8 left-1/2 -translate-x-1/2 z-40 text-center">
                <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-purple-400">Meet Fleet Brain</p>
                <p className="text-[9px] text-slate-500 mt-1 tracking-wider">The mind behind every move</p>
            </motion.div>

            {/* SVG edges only — no particles */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {EDGES.map(([a, b], i) => {
                    const from = NODE_MAP.get(a)!;
                    const to = NODE_MAP.get(b)!;
                    const hi = hoveredId !== null && (a === hoveredId || b === hoveredId);
                    const dim = hoveredId !== null && !hi;
                    return (
                        <motion.line
                            key={i}
                            x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                            stroke={hi ? "#c084fc" : "#64748b"}
                            strokeWidth={hi ? 0.22 : 0.06}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={mounted ? { pathLength: 1, opacity: dim ? 0.08 : hi ? 1 : 0.22 } : {}}
                            transition={{ pathLength: { duration: 0.9, delay: 0.4 + i * 0.018, ease: "easeOut" }, opacity: { duration: 0.35 } }}
                            style={{ vectorEffect: "non-scaling-stroke", filter: hi ? "drop-shadow(0 0 3px #c084fc)" : undefined }}
                        />
                    );
                })}
            </svg>

            {/* Node layer — each node is a 0-size anchor with absolute children centered */}
            {NODES.map((node, i) => {
                const t = TYPE[node.type];
                const isHovered = node.id === hoveredId;
                const isConn = connected.has(node.id);
                const dimmed = hoveredId !== null && !isHovered && !isConn;

                return (
                    <div
                        key={node.id}
                        className="absolute"
                        style={{
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                            width: 0,
                            height: 0,
                            zIndex: isHovered ? 30 : node.type === "brain" ? 20 : 10,
                        }}
                    >
                        {/* Brain rings — centered on anchor */}
                        {node.type === "brain" && [0, 1, 2].map((ring) => (
                            <motion.div
                                key={ring}
                                className="absolute rounded-full pointer-events-none"
                                style={{
                                    width: t.size * 2.4,
                                    height: t.size * 2.4,
                                    left: -(t.size * 2.4) / 2,
                                    top: -(t.size * 2.4) / 2,
                                    border: `1px solid ${t.color}`,
                                }}
                                animate={{ scale: [0.8, 2.2], opacity: [0.6, 0] }}
                                transition={{ duration: 3, repeat: Infinity, delay: ring * 1, ease: "easeOut" }}
                            />
                        ))}

                        {/* Glow halo */}
                        <motion.div
                            className="absolute rounded-full pointer-events-none"
                            style={{
                                width: t.size * 2,
                                height: t.size * 2,
                                left: -t.size,
                                top: -t.size,
                                background: `radial-gradient(circle, ${t.glow} 0%, transparent 70%)`,
                            }}
                            animate={{ opacity: isHovered ? 1 : node.type === "brain" ? 0.45 : 0 }}
                            transition={{ duration: 0.3 }}
                        />

                        {/* Core circle — hover target */}
                        <motion.div
                            className="absolute rounded-full cursor-pointer"
                            style={{
                                width: t.size,
                                height: t.size,
                                left: -t.size / 2,
                                top: -t.size / 2,
                                background: `radial-gradient(circle at 30% 30%, ${t.color}, ${t.color}60 70%, ${t.color}20 100%)`,
                                boxShadow: `0 0 ${isHovered ? 32 : node.type === "brain" ? 40 : 12}px ${t.glow}, inset 0 0 ${t.size * 0.3}px rgba(255,255,255,0.15)`,
                                border: `1.5px solid ${t.color}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={mounted ? {
                                opacity: dimmed ? 0.25 : 1,
                                scale: isHovered ? 1.35 : node.type === "brain" ? [1, 1.06, 1] : 1,
                            } : {}}
                            transition={{
                                opacity: { duration: 0.35 },
                                scale: isHovered
                                    ? { type: "spring", stiffness: 260, damping: 16 }
                                    : node.type === "brain"
                                        ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                                        : { type: "spring", stiffness: 160, damping: 18, delay: node.type === "brain" ? 0.3 : 0.5 + i * 0.025 },
                            }}
                            onMouseEnter={() => setHoveredId(node.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {node.type === "brain" && (
                                <svg width={t.size * 0.55} height={t.size * 0.55} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                                    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
                                </svg>
                            )}
                        </motion.div>

                        {/* Label — always for brain + branches, on-hover for others */}
                        {(node.type === "brain" || node.type === "branch" || isHovered || isConn) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: dimmed ? 0.3 : 1 }}
                                className="absolute whitespace-nowrap pointer-events-none"
                                style={{
                                    top: t.size / 2 + 8,
                                    left: 0,
                                    transform: "translateX(-50%)",
                                    fontSize: node.type === "brain" ? "13px" : node.type === "branch" ? "10px" : "9px",
                                    fontWeight: node.type === "brain" ? 700 : 600,
                                    color: node.type === "brain" ? "#fff" : "#e2e8f0",
                                    textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.6)",
                                    letterSpacing: node.type === "brain" ? "0.08em" : "normal",
                                }}
                            >
                                {node.label}
                            </motion.div>
                        )}
                    </div>
                );
            })}

            {/* ═════════════════════════════════════════════════ */}
            {/* SECTION A — Description panel (bottom-left)        */}
            {/* ═════════════════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8 }}
                className="absolute bottom-10 left-10 z-40 w-[360px] rounded-2xl border border-white/10 overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.6))",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 20px 60px -15px rgba(0,0,0,0.6)",
                }}
            >
                <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-purple-400" />
                    <span className="text-[9px] uppercase tracking-[0.3em] text-purple-400 font-semibold">Description</span>
                </div>
                <div className="px-5 py-5 min-h-[200px]">
                    <AnimatePresence mode="wait">
                        {hovered ? (
                            <motion.div
                                key={`desc-${hovered.id}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: TYPE[hovered.type].color }} />
                                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: TYPE[hovered.type].color }}>
                                        {TYPE[hovered.type].label}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-white leading-tight mb-3">{hovered.label}</h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {TYPE[hovered.type].blurb}
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="desc-idle"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25 }}
                            >
                                <h2 className="text-3xl font-bold text-white leading-[1.1] tracking-tight mb-3">
                                    Every booking,<br />every vehicle,<br />
                                    <span className="bg-gradient-to-r from-purple-400 via-white to-purple-400 bg-clip-text text-transparent">one brain.</span>
                                </h2>
                                <p className="text-[13px] text-slate-400 leading-relaxed">
                                    Fleet Brain connects branches, vehicles, customers, and live signals — making thousands of decisions a day before you even ask.
                                </p>
                                <div className="flex items-center gap-2 mt-4 text-[10px] text-purple-400/80">
                                    <motion.span
                                        className="inline-block w-1 h-1 rounded-full bg-purple-400"
                                        animate={{ opacity: [1, 0.3, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                    Hover a node to begin
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* ═════════════════════════════════════════════════ */}
            {/* SECTION B — Interactivity panel (bottom-right)     */}
            {/* ═════════════════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 }}
                className="absolute bottom-10 right-10 z-40 w-[320px] rounded-2xl border border-white/10 overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.6))",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 20px 60px -15px rgba(0,0,0,0.6)",
                }}
            >
                <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <motion.div
                            className="w-1 h-1 rounded-full bg-cyan-400"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="text-[9px] uppercase tracking-[0.3em] text-cyan-400 font-semibold">Interactivity</span>
                    </div>
                    {hovered && (
                        <span className="text-[9px] text-slate-500">
                            <span className="text-white font-bold tabular-nums">{connected.size}</span> link{connected.size !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>
                <div className="px-5 py-5 min-h-[200px]">
                    <AnimatePresence mode="wait">
                        {hovered ? (
                            <motion.div
                                key={`inter-${hovered.id}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25 }}
                            >
                                <h3 className="text-base font-bold text-white">{hovered.label}</h3>
                                {hovered.sub && <p className="text-[11px] text-slate-400 mt-0.5">{hovered.sub}</p>}

                                {hovered.stats && (
                                    <div className="mt-4 space-y-2 pt-3 border-t border-white/5">
                                        {hovered.stats.map((s, si) => (
                                            <motion.div
                                                key={si}
                                                initial={{ opacity: 0, x: 8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: si * 0.06 }}
                                                className="flex justify-between items-center text-[11px]"
                                            >
                                                <span className="text-slate-500">{s.l}</span>
                                                <span className="text-white font-semibold tabular-nums">{s.v}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {/* Connected entities preview */}
                                {connected.size > 0 && (
                                    <div className="mt-4 pt-3 border-t border-white/5">
                                        <p className="text-[9px] uppercase tracking-widest text-slate-500 font-medium mb-2">Connected</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {Array.from(connected).slice(0, 6).map((cid) => {
                                                const cn = NODE_MAP.get(cid)!;
                                                return (
                                                    <span
                                                        key={cid}
                                                        className="text-[9px] px-2 py-0.5 rounded-full border"
                                                        style={{
                                                            color: TYPE[cn.type].color,
                                                            background: `${TYPE[cn.type].color}15`,
                                                            borderColor: `${TYPE[cn.type].color}40`,
                                                        }}
                                                    >
                                                        {cn.label.split(" · ")[0]}
                                                    </span>
                                                );
                                            })}
                                            {connected.size > 6 && <span className="text-[9px] text-slate-500 px-2 py-0.5">+{connected.size - 6}</span>}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="inter-idle"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25 }}
                            >
                                <p className="text-[11px] uppercase tracking-widest text-slate-500 font-medium mb-3">Brain · Live Stats</p>
                                <div className="space-y-2.5">
                                    {[{ v: "45,287", l: "decisions today" }, { v: "12", l: "active models" }, { v: "94.2%", l: "avg confidence" }, { v: "18ms", l: "latency" }].map((s, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 2.2 + i * 0.08 }}
                                            className="flex justify-between items-baseline"
                                        >
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">{s.l}</span>
                                            <span className="text-xl font-bold text-white tabular-nums">{s.v}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </section>
    );
}
