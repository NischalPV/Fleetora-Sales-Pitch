# Fleetora Pitch Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an 11-screen, scroll-snapping interactive pitch deck that replaces PowerPoint for $10M+ client presentations.

**Architecture:** Single Next.js route (`/`) renders a `PitchDeck` component that manages CSS scroll-snap navigation across 11 full-viewport screen components. Each screen animates on entry using Framer Motion. The existing `scroll-morph-hero.tsx` is reskinned for Screen 1 and communicates completion to the parent via an `onComplete` callback.

**Tech Stack:** Next.js 16, React 19, Framer Motion, Tailwind CSS v4, TypeScript. No new dependencies.

---

## Task 1: Global Theme & Shared Utilities

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/pitch/shared/use-in-view.ts`
- Create: `src/components/pitch/shared/animated-counter.tsx`
- Create: `src/components/pitch/shared/glow-text.tsx`
- Create: `src/components/pitch/shared/progress-bar.tsx`

- [ ] **Step 1: Update globals.css to dark radiant theme**

```css
@import "tailwindcss";
@import "tw-animate-css";

@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

:root {
  --background: #0f172a;
  --foreground: #f1f5f9;
  --accent-blue: #3b82f6;
  --accent-violet: #8b5cf6;
  --accent-green: #10b981;
  --accent-red: #ef4444;
  --accent-amber: #f59e0b;
  --accent-cyan: #06b6d4;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

- [ ] **Step 2: Create `use-in-view.ts` hook**

This hook uses `IntersectionObserver` to detect when a section enters the viewport and triggers animations. Every screen component will use this.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export function useInView(threshold = 0.3) {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, isInView };
}
```

- [ ] **Step 3: Create `animated-counter.tsx`**

Reusable count-up number component used in Screen 3 (Damage) and elsewhere.

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface AnimatedCounterProps {
    target: number;
    suffix?: string;
    duration?: number;
    active: boolean;
}

export function AnimatedCounter({ target, suffix = "", duration = 1.5, active }: AnimatedCounterProps) {
    const motionValue = useMotionValue(0);
    const spring = useSpring(motionValue, { stiffness: 50, damping: 20 });
    const [display, setDisplay] = useState("0");

    useEffect(() => {
        if (active) {
            motionValue.set(target);
        }
    }, [active, target, motionValue]);

    useEffect(() => {
        const unsubscribe = spring.on("change", (v) => {
            setDisplay(Math.round(v).toString());
        });
        return unsubscribe;
    }, [spring]);

    return (
        <span className="tabular-nums">
            {display}{suffix}
        </span>
    );
}
```

- [ ] **Step 4: Create `glow-text.tsx`**

Text component with radiant glow effect behind it, used on Screen 4 (Reveal) and headings.

```tsx
"use client";

import { motion } from "framer-motion";

interface GlowTextProps {
    text: string;
    className?: string;
    glowColor?: string;
    active: boolean;
    delay?: number;
}

export function GlowText({ text, className = "", glowColor = "rgba(59,130,246,0.4)", active, delay = 0 }: GlowTextProps) {
    return (
        <div className="relative inline-block">
            {/* Glow layer */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={active ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1.2, delay }}
                className="absolute inset-0 blur-3xl -z-10"
                style={{ background: `radial-gradient(ellipse, ${glowColor}, transparent 70%)` }}
            />
            {/* Text */}
            <motion.span
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={active ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
                transition={{ type: "spring", stiffness: 60, damping: 20, delay }}
                className={className}
            >
                {text}
            </motion.span>
        </div>
    );
}
```

- [ ] **Step 5: Create `progress-bar.tsx`**

Thin gradient progress bar fixed at top of viewport.

```tsx
"use client";

import { motion, useMotionValueEvent, useMotionValue } from "framer-motion";
import { useState } from "react";

interface ProgressBarProps {
    scrollProgress: number;
}

export function ProgressBar({ scrollProgress }: ProgressBarProps) {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent">
            <motion.div
                className="h-full"
                style={{
                    width: `${scrollProgress * 100}%`,
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                }}
                transition={{ duration: 0.1 }}
            />
        </div>
    );
}
```

- [ ] **Step 6: Verify the build compiles**

Run: `npx next build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css src/components/pitch/shared/
git commit -m "feat: add dark theme, shared pitch deck utilities (useInView, AnimatedCounter, GlowText, ProgressBar)"
```

---

## Task 2: Reskin Scroll-Morph Hero (Screen 1)

**Files:**
- Modify: `src/components/ui/scroll-morph-hero.tsx`

- [ ] **Step 1: Add `onComplete` prop and dark theme**

Update the component signature to accept an `onComplete` callback. Change background from `#FAFAFA` to `#0f172a`. Add blue glow to cards. Update copy. Remove "Explore Our Vision" content. Stop capturing wheel events after completion.

The key changes to `scroll-morph-hero.tsx`:

1. Add prop interface and `onComplete`:

```tsx
interface IntroAnimationProps {
    onComplete?: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
```

2. Track completion state and fire callback. Add after `scrollRef` declaration:

```tsx
const completedRef = useRef(false);
```

3. In the `handleWheel` function, after `virtualScroll.set(newScroll)`, add:

```tsx
if (newScroll >= MAX_SCROLL && !completedRef.current) {
    completedRef.current = true;
    onComplete?.();
    return;
}
if (completedRef.current) return;
```

4. Change the container background class from `bg-[#FAFAFA]` to `bg-[#0f172a]`:

```tsx
<div ref={containerRef} className="relative w-full h-full bg-[#0f172a] overflow-hidden">
```

5. Update the center heading text and styles:

```tsx
<motion.h1
    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
    animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
    transition={{ duration: 1 }}
    className="text-2xl font-semibold tracking-tight text-slate-100 md:text-4xl"
>
    The operations brain for modern car rental.
</motion.h1>
<motion.p
    initial={{ opacity: 0 }}
    animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.5 - morphValue } : { opacity: 0 }}
    transition={{ duration: 1, delay: 0.2 }}
    className="mt-4 text-xs font-bold tracking-[0.2em] text-slate-500"
>
    SCROLL TO BEGIN
</motion.p>
```

6. Remove the entire "Arc Active Content (Fades in)" `motion.div` block (lines 289-300 in current file — the "Explore Our Vision" section).

7. Add blue glow to FlipCard's front face. In the FlipCard component, change the front face div class:

```tsx
<div
    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl bg-gray-800"
    style={{ backfaceVisibility: "hidden", boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
>
```

8. Add a radial glow behind the circle formation. Inside the main container div, before the IMAGES.map, add:

```tsx
{introPhase === "circle" && (
    <div
        className="absolute rounded-full pointer-events-none"
        style={{
            width: Math.min(containerSize.width, containerSize.height) * 0.8,
            height: Math.min(containerSize.width, containerSize.height) * 0.8,
            background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
        }}
    />
)}
```

- [ ] **Step 2: Verify hero renders dark with updated copy**

Run: `npx next dev --port 3000`
Open http://localhost:3000 and confirm:
- Dark background
- "The operations brain for modern car rental." text in white
- "SCROLL TO BEGIN" subtitle
- Blue glow on cards and behind circle
- No "Explore Our Vision" section

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/scroll-morph-hero.tsx
git commit -m "feat: reskin scroll-morph hero with dark theme, Fleetora copy, onComplete callback"
```

---

## Task 3: Pitch Deck Shell & Scroll Navigation

**Files:**
- Create: `src/components/pitch/pitch-deck.tsx`
- Create: `src/components/pitch/screens/01-hero.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `01-hero.tsx` wrapper**

Wraps the existing scroll-morph-hero inside a snap section and forwards `onComplete`.

```tsx
"use client";

import IntroAnimation from "@/components/ui/scroll-morph-hero";

interface HeroScreenProps {
    onComplete: () => void;
}

export function HeroScreen({ onComplete }: HeroScreenProps) {
    return (
        <section className="h-screen w-full snap-start relative">
            <IntroAnimation onComplete={onComplete} />
        </section>
    );
}
```

- [ ] **Step 2: Create `pitch-deck.tsx` with scroll snap and keyboard nav**

```tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ProgressBar } from "./shared/progress-bar";
import { HeroScreen } from "./screens/01-hero";

const TOTAL_SCREENS = 11;

export function PitchDeck() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [heroComplete, setHeroComplete] = useState(false);

    // Track scroll progress for the progress bar
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            setScrollProgress(scrollTop / (scrollHeight - clientHeight));
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!heroComplete && (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ")) {
                return; // Let hero handle its own scroll
            }

            const vh = window.innerHeight;
            const currentScreen = Math.round(container.scrollTop / vh);

            if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
                e.preventDefault();
                const nextScreen = Math.min(currentScreen + 1, TOTAL_SCREENS - 1);
                container.scrollTo({ top: nextScreen * vh, behavior: "smooth" });
            } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                e.preventDefault();
                const prevScreen = Math.max(currentScreen - 1, 0);
                container.scrollTo({ top: prevScreen * vh, behavior: "smooth" });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [heroComplete]);

    // Hero completion handler — advance to Screen 2
    const handleHeroComplete = useCallback(() => {
        setHeroComplete(true);
        const container = containerRef.current;
        if (container) {
            container.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        }
    }, []);

    return (
        <div className="relative">
            <ProgressBar scrollProgress={scrollProgress} />
            <div
                ref={containerRef}
                className="h-screen overflow-y-auto snap-y snap-mandatory"
                style={{ scrollBehavior: "smooth" }}
            >
                {/* Screen 1: Hero */}
                <HeroScreen onComplete={handleHeroComplete} />

                {/* Screens 2-11: Placeholder sections */}
                {Array.from({ length: 10 }, (_, i) => (
                    <section
                        key={i + 2}
                        className="h-screen w-full snap-start flex items-center justify-center"
                    >
                        <p className="text-slate-500 text-lg">Screen {i + 2}</p>
                    </section>
                ))}
            </div>
        </div>
    );
}
```

- [ ] **Step 3: Update `page.tsx` to render PitchDeck**

```tsx
import { PitchDeck } from "@/components/pitch/pitch-deck";

export default function Home() {
    return <PitchDeck />;
}
```

- [ ] **Step 4: Verify scroll snap works**

Run dev server, confirm:
- Hero plays animation on Screen 1
- After hero completes, scroll snaps to Screen 2
- Arrow keys navigate between placeholder screens
- Progress bar fills as you scroll
- Spacebar advances screens

- [ ] **Step 5: Commit**

```bash
git add src/components/pitch/ src/app/page.tsx
git commit -m "feat: pitch deck shell with scroll-snap navigation, progress bar, keyboard controls"
```

---

## Task 4: Screen 2 — The Story

**Files:**
- Create: `src/components/pitch/screens/02-story.tsx`
- Modify: `src/components/pitch/pitch-deck.tsx` (replace placeholder)

- [ ] **Step 1: Create `02-story.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";

const LINES = [
    { text: "It's Tuesday afternoon.", className: "text-3xl md:text-5xl font-semibold text-slate-100" },
    { text: "Your busiest branch just turned away 3 customers. Meanwhile, 4 cars sit idle across town. Nobody knows.", className: "text-xl md:text-2xl text-slate-300 max-w-2xl" },
    { text: "A walk-in at the counter has been waiting 20 minutes. Paper contract. Phone calls to verify credit.", className: "text-xl md:text-2xl text-slate-300 max-w-2xl" },
    { text: "A corporate account is over-limit. The shared spreadsheet says otherwise.", className: "text-xl md:text-2xl text-slate-300 max-w-2xl" },
    { text: "Your cheapest SUV is in the workshop. Nobody noticed it was due for service.", className: "text-xl md:text-2xl text-slate-300 max-w-2xl" },
    { text: "\u2018Send two Tucsons to Airport tomorrow.\u2019 WhatsApp message. No trail. No tracking.", className: "text-xl md:text-2xl text-slate-300 max-w-2xl" },
    { text: "This is how most rental operations run today.", className: "text-2xl md:text-3xl font-semibold text-red-500" },
];

export function StoryScreen() {
    const { ref, isInView } = useInView(0.2);

    return (
        <section ref={ref} className="h-screen w-full snap-start flex flex-col items-center justify-center px-8">
            <div className="flex flex-col items-center gap-8 text-center max-w-3xl">
                {LINES.map((line, i) => (
                    <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                            type: "spring",
                            stiffness: 40,
                            damping: 15,
                            delay: i * 0.4,
                        }}
                        className={line.className}
                    >
                        {line.text}
                    </motion.p>
                ))}
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Import and replace placeholder in `pitch-deck.tsx`**

Add import at top:

```tsx
import { StoryScreen } from "./screens/02-story";
```

In the JSX, replace the first placeholder `<section>` (Screen 2) with:

```tsx
{/* Screen 2: The Story */}
<StoryScreen />
```

Update the placeholder array to start from index 3 (9 remaining):

```tsx
{Array.from({ length: 9 }, (_, i) => (
    <section
        key={i + 3}
        className="h-screen w-full snap-start flex items-center justify-center"
    >
        <p className="text-slate-500 text-lg">Screen {i + 3}</p>
    </section>
))}
```

- [ ] **Step 3: Verify Screen 2 renders with staggered text**

Open browser, scroll past hero. Confirm all 7 lines appear with staggered fade-in animation. Final red line is visually distinct.

- [ ] **Step 4: Commit**

```bash
git add src/components/pitch/screens/02-story.tsx src/components/pitch/pitch-deck.tsx
git commit -m "feat: Screen 2 — Tuesday afternoon narrative with staggered reveals"
```

---

## Task 5: Screen 3 — The Damage (Count-Up Numbers)

**Files:**
- Create: `src/components/pitch/screens/03-damage.tsx`
- Modify: `src/components/pitch/pitch-deck.tsx`

- [ ] **Step 1: Create `03-damage.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";
import { AnimatedCounter } from "../shared/animated-counter";

const STATS = [
    {
        value: 20,
        suffix: "+",
        label: "minutes per checkout",
        context: "That's 20 minutes your customer is questioning their choice.",
        color: "text-amber-500",
    },
    {
        value: 15,
        suffix: "%",
        label: "of your fleet is invisible",
        context: "Cars at the wrong branch. Revenue evaporating daily.",
        color: "text-amber-500",
    },
    {
        type: "text" as const,
        display: "Weeks",
        label: "before finance sees reality",
        context: "By the time the P\u0026L lands, the decision window has closed.",
        color: "text-amber-500",
    },
];

export function DamageScreen() {
    const { ref, isInView } = useInView(0.3);

    return (
        <section ref={ref} className="h-screen w-full snap-start flex items-center justify-center px-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24">
                {STATS.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ type: "spring", stiffness: 40, damping: 15, delay: i * 0.5 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className={`text-7xl md:text-[120px] font-bold tracking-tight leading-none ${stat.color}`}>
                            {"type" in stat && stat.type === "text" ? (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : {}}
                                    transition={{ duration: 0.8, delay: i * 0.5 + 0.3 }}
                                >
                                    {stat.display}
                                </motion.span>
                            ) : (
                                <AnimatedCounter
                                    target={"value" in stat ? stat.value : 0}
                                    suffix={"suffix" in stat ? stat.suffix : ""}
                                    active={isInView}
                                />
                            )}
                        </div>
                        <p className="text-lg md:text-xl text-slate-300 mt-4 font-medium">
                            {stat.label}
                        </p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: i * 0.5 + 0.8 }}
                            className="text-sm text-slate-500 mt-2 max-w-xs"
                        >
                            {stat.context}
                        </motion.p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Import and wire into `pitch-deck.tsx`**

Add import:

```tsx
import { DamageScreen } from "./screens/03-damage";
```

Replace the Screen 3 placeholder with `<DamageScreen />`. Update placeholder array to start from index 4 (8 remaining).

- [ ] **Step 3: Verify numbers count up on scroll entry**

Scroll to Screen 3. Confirm 20+, 15%, and "Weeks" all animate in with stagger. Context text fades in after each number.

- [ ] **Step 4: Commit**

```bash
git add src/components/pitch/screens/03-damage.tsx src/components/pitch/pitch-deck.tsx
git commit -m "feat: Screen 3 — count-up damage numbers with staggered reveals"
```

---

## Task 6: Screen 4 — The Reveal (Logo Moment)

**Files:**
- Create: `src/components/pitch/screens/04-reveal.tsx`
- Modify: `src/components/pitch/pitch-deck.tsx`

- [ ] **Step 1: Create `04-reveal.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";
import { GlowText } from "../shared/glow-text";

export function RevealScreen() {
    const { ref, isInView } = useInView(0.5);

    return (
        <section ref={ref} className="h-screen w-full snap-start flex flex-col items-center justify-center px-8 relative overflow-hidden">
            {/* Background glow bloom */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)",
                }}
            />

            {/* Logo */}
            <GlowText
                text="Fleetora"
                active={isInView}
                delay={0.3}
                className="text-6xl md:text-[72px] font-bold tracking-[-1px] text-slate-100"
                glowColor="rgba(99,102,241,0.4)"
            />

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
                className="text-lg md:text-xl text-slate-400 mt-6 text-center max-w-lg"
            >
                One command surface. Every branch. Every vehicle. Every decision.
            </motion.p>
        </section>
    );
}
```

- [ ] **Step 2: Wire into `pitch-deck.tsx`**

Add import and replace Screen 4 placeholder. Update placeholder array to start from index 5 (7 remaining).

- [ ] **Step 3: Verify the glow bloom and text animation**

Scroll to Screen 4. Confirm: dark pause, glow bloom expands, "Fleetora" scales in from blur, subtitle fades in after.

- [ ] **Step 4: Commit**

```bash
git add src/components/pitch/screens/04-reveal.tsx src/components/pitch/pitch-deck.tsx
git commit -m "feat: Screen 4 — Fleetora logo reveal with glow bloom"
```

---

## Task 7: Screen 5 — Three Reveals (Pillars)

**Files:**
- Create: `src/components/pitch/screens/05-pillars.tsx`
- Modify: `src/components/pitch/pitch-deck.tsx`

- [ ] **Step 1: Create `05-pillars.tsx`**

This screen contains three sub-screens that crossfade. A dot indicator shows which is active. Scroll within the section advances through them.

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "../shared/use-in-view";

const PILLARS = [
    {
        headline: "90 seconds.",
        subhead: "Walk-in to wheels out.",
        description: "ID scan. Credit check. Contract. Payment. Keys. What used to take 20 minutes now happens in a single automated flow.",
        accent: "#3b82f6",
        icon: (
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="36" stroke="#3b82f6" strokeWidth="2" strokeDasharray="226" strokeDashoffset="0" strokeLinecap="round" />
                <text x="40" y="46" textAnchor="middle" fill="#3b82f6" fontSize="20" fontWeight="700">90s</text>
            </svg>
        ),
    },
    {
        headline: "Your whole fleet.",
        subhead: "One screen.",
        description: "Utilization across every branch. Revenue in real time. Demand forecasts. Fleet Brain insights. The cockpit that replaces the spreadsheet.",
        accent: "#10b981",
        icon: (
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect x="8" y="16" width="64" height="40" rx="4" stroke="#10b981" strokeWidth="2" />
                <circle cx="24" cy="36" r="4" fill="#10b981" opacity="0.6" />
                <circle cx="40" cy="30" r="3" fill="#10b981" opacity="0.4" />
                <circle cx="56" cy="38" r="5" fill="#10b981" opacity="0.8" />
                <line x1="32" y1="60" x2="48" y2="60" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        headline: "Built for Tuesday afternoon.",
        subhead: "",
        description: "Vehicle swaps mid-rental. Multi-driver surcharges. Speed camera tickets reconciled weeks later. We handle the messy reality that other tools pretend doesn't exist.",
        accent: "#f59e0b",
        icon: (
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect x="12" y="12" width="56" height="56" rx="8" stroke="#f59e0b" strokeWidth="2" />
                <line x1="12" y1="28" x2="68" y2="28" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
                <line x1="12" y1="40" x2="68" y2="40" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
                <line x1="12" y1="52" x2="68" y2="52" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
                <circle cx="24" cy="34" r="2" fill="#f59e0b" />
                <circle cx="24" cy="46" r="2" fill="#f59e0b" />
                <circle cx="24" cy="58" r="2" fill="#f59e0b" />
            </svg>
        ),
    },
];

export function PillarsScreen() {
    const { ref, isInView } = useInView(0.3);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleWheel = (e: React.WheelEvent) => {
        if (e.deltaY > 0 && activeIndex < PILLARS.length - 1) {
            e.stopPropagation();
            setActiveIndex((prev) => Math.min(prev + 1, PILLARS.length - 1));
        } else if (e.deltaY < 0 && activeIndex > 0) {
            e.stopPropagation();
            setActiveIndex((prev) => Math.max(prev - 1, 0));
        }
    };

    const pillar = PILLARS[activeIndex];

    return (
        <section
            ref={ref}
            onWheel={handleWheel}
            className="h-screen w-full snap-start flex flex-col items-center justify-center px-8 relative"
        >
            {/* Dot indicator */}
            <div className="absolute top-8 flex gap-2">
                {PILLARS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i === activeIndex ? "bg-white scale-125" : "bg-slate-600"
                        }`}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                    className="flex flex-col items-center text-center max-w-2xl"
                >
                    {/* Icon */}
                    <div className="mb-8">{pillar.icon}</div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-100">
                        {pillar.headline}
                    </h2>
                    {pillar.subhead && (
                        <h3
                            className="text-3xl md:text-5xl font-semibold tracking-tight mt-2"
                            style={{ color: pillar.accent }}
                        >
                            {pillar.subhead}
                        </h3>
                    )}

                    {/* Description */}
                    <p className="text-base md:text-lg text-slate-400 mt-6 leading-relaxed max-w-lg">
                        {pillar.description}
                    </p>
                </motion.div>
            </AnimatePresence>
        </section>
    );
}
```

- [ ] **Step 2: Wire into `pitch-deck.tsx`**

Add import and replace Screen 5 placeholder. Update placeholder array to start from index 6 (6 remaining).

- [ ] **Step 3: Verify crossfade between three pillars**

Scroll to Screen 5. Confirm: dot indicator shows, scrolling within section cycles through 3 pillars with crossfade animation. Each has icon, headline, description.

- [ ] **Step 4: Commit**

```bash
git add src/components/pitch/screens/05-pillars.tsx src/components/pitch/pitch-deck.tsx
git commit -m "feat: Screen 5 — three reveal pillars with crossfade and dot navigation"
```

---

## Task 8: Screen 6 — Product Showcase (Three Roles)

**Files:**
- Create: `src/components/pitch/screens/06-product.tsx`
- Modify: `src/components/pitch/pitch-deck.tsx`

- [ ] **Step 1: Create `06-product.tsx`**

Stylized product mockups in browser frames with perspective tilt and floating animation.

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "../shared/use-in-view";

const ROLES = [
    {
        role: "Franchise Head",
        intro: "What the VP of Operations sees every morning.",
        color: "#3b82f6",
        mockup: (
            <div className="p-4 space-y-3">
                {/* Top metrics row */}
                <div className="flex gap-3">
                    {["Fleet Utilization", "Revenue Today", "Active Bookings", "Alerts"].map((label, i) => (
                        <div key={i} className="flex-1 bg-slate-700/50 rounded-lg p-3">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
                            <p className="text-lg font-bold text-slate-200 mt-1">{["87%", "$24.8K", "142", "3"][i]}</p>
                        </div>
                    ))}
                </div>
                {/* Chart area */}
                <div className="bg-slate-700/30 rounded-lg p-3 h-24 flex items-end gap-1">
                    {[40, 55, 45, 70, 65, 80, 75, 90, 85, 72, 88, 92].map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm bg-blue-500/60" style={{ height: `${h}%` }} />
                    ))}
                </div>
                {/* Branch list */}
                <div className="space-y-1">
                    {["Airport — 92%", "Downtown — 78%", "Mall — 85%"].map((b, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-700/20 rounded px-3 py-1.5">
                            <span className="text-xs text-slate-400">{b.split(" — ")[0]}</span>
                            <span className="text-xs font-medium text-slate-300">{b.split(" — ")[1]}</span>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        role: "Branch Staff",
        intro: "What the branch agent sees at the counter.",
        color: "#10b981",
        mockup: (
            <div className="p-4 space-y-3">
                <div className="flex gap-3">
                    {["Today", "Checkouts", "Returns", "Available"].map((label, i) => (
                        <div key={i} className="flex-1 bg-slate-700/50 rounded-lg p-3">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
                            <p className="text-lg font-bold text-slate-200 mt-1">{["Thu", "8", "5", "12"][i]}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3 flex items-center justify-center">
                    <span className="text-emerald-400 font-semibold text-sm">+ New Walk-in</span>
                </div>
                <div className="space-y-1">
                    {["Ahmad K. — Tucson — Due 5pm", "Sara M. — Accent — Overdue", "Fleet Co. — Elantra — Active"].map((b, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-700/20 rounded px-3 py-1.5">
                            <span className="text-xs text-slate-400">{b}</span>
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${i === 1 ? "bg-red-500/20 text-red-400" : "bg-slate-600/50 text-slate-400"}`}>
                                {i === 1 ? "OVERDUE" : "ACTIVE"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        role: "Finance Admin",
        intro: "What finance sees at month-end.",
        color: "#8b5cf6",
        mockup: (
            <div className="p-4 space-y-3">
                <div className="flex gap-3">
                    {["Revenue MTD", "Outstanding", "Deposits", "Overdue"].map((label, i) => (
                        <div key={i} className="flex-1 bg-slate-700/50 rounded-lg p-3">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
                            <p className="text-lg font-bold text-slate-200 mt-1">{["$186K", "$42K", "$28K", "$8.2K"][i]}</p>
                        </div>
                    ))}
                </div>
                <div className="space-y-1">
                    {["INV-2024-0892 — Fleet Corp — $12,400 — Paid", "INV-2024-0893 — Alpha Bank — $8,200 — Pending", "INV-2024-0894 — TeleCom — $5,600 — Overdue"].map((b, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-700/20 rounded px-3 py-1.5">
                            <span className="text-xs text-slate-400 truncate mr-2">{b.split(" — ").slice(0, 2).join(" — ")}</span>
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap ${
                                b.includes("Paid") ? "bg-green-500/20 text-green-400" :
                                b.includes("Overdue") ? "bg-red-500/20 text-red-400" :
                                "bg-amber-500/20 text-amber-400"
                            }`}>
                                {b.split(" — ").pop()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
];

function BrowserFrame({ children, color }: { children: React.ReactNode; color: string }) {
    return (
        <div
            className="w-full max-w-2xl rounded-xl overflow-hidden border border-slate-700/50"
            style={{ boxShadow: `0 20px 60px -10px ${color}25` }}
        >
            {/* Chrome */}
            <div className="bg-slate-800 px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                </div>
                <div className="flex-1 bg-slate-700/50 rounded-md px-3 py-1 ml-2">
                    <span className="text-[10px] text-slate-500">app.fleetora.com</span>
                </div>
            </div>
            {/* Content */}
            <div className="bg-slate-800/80">{children}</div>
        </div>
    );
}

export function ProductScreen() {
    const { ref, isInView } = useInView(0.3);
    const [activeIndex, setActiveIndex] = useState(0);
    const role = ROLES[activeIndex];

    const handleWheel = (e: React.WheelEvent) => {
        if (e.deltaY > 0 && activeIndex < ROLES.length - 1) {
            e.stopPropagation();
            setActiveIndex((prev) => Math.min(prev + 1, ROLES.length - 1));
        } else if (e.deltaY < 0 && activeIndex > 0) {
            e.stopPropagation();
            setActiveIndex((prev) => Math.max(prev - 1, 0));
        }
    };

    return (
        <section
            ref={ref}
            onWheel={handleWheel}
            className="h-screen w-full snap-start flex flex-col items-center justify-center px-8 gap-6"
        >
            {/* Role label */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                >
                    <p className="text-sm font-bold tracking-widest uppercase" style={{ color: role.color }}>
                        {role.role}
                    </p>
                    <p className="text-lg text-slate-400 mt-1">{role.intro}</p>
                </motion.div>
            </AnimatePresence>

            {/* Browser mockup */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    className="w-full flex justify-center"
                    style={{
                        transform: "perspective(1200px) rotateX(2deg)",
                    }}
                >
                    <BrowserFrame color={role.color}>
                        {role.mockup}
                    </BrowserFrame>
                </motion.div>
            </AnimatePresence>

            {/* Dot indicator */}
            <div className="flex gap-2">
                {ROLES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i === activeIndex ? "bg-white scale-125" : "bg-slate-600"
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Wire into `pitch-deck.tsx`**

Add import and replace Screen 6 placeholder. Update placeholder array to start from index 7 (5 remaining).

- [ ] **Step 3: Verify mockups render with browser chrome and perspective tilt**

Scroll to Screen 6. Confirm: three role mockups cycle on scroll, browser chrome visible, perspective tilt applied, content is styled data not screenshots.

- [ ] **Step 4: Commit**

```bash
git add src/components/pitch/screens/06-product.tsx src/components/pitch/pitch-deck.tsx
git commit -m "feat: Screen 6 — product showcase with animated browser mockups for three roles"
```

---

## Task 9: Screen 7 — Fleet Brain (AI Constellation)

**Files:**
- Create: `src/components/pitch/screens/07-fleet-brain.tsx`
- Modify: `src/components/pitch/pitch-deck.tsx`

- [ ] **Step 1: Create `07-fleet-brain.tsx`**

SVG constellation with animated pulses traveling between nodes. Text reveals below.

```tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";

const BRANCHES = [
    { label: "Airport", angle: 0 },
    { label: "Downtown", angle: 51 },
    { label: "Mall", angle: 103 },
    { label: "Industrial", angle: 154 },
    { label: "Beach", angle: 206 },
    { label: "Suburb", angle: 257 },
    { label: "Port", angle: 309 },
];

const INSIGHTS = [
    {
        headline: "It sees what you can\u2019t.",
        detail: "Fleet Brain detects Branch A is overstocked while Airport is at 92%. Recommends rebalancing before you ask.",
    },
    {
        headline: "It acts before you do.",
        detail: "Overdue returns flagged. Maintenance windows identified. Demand surges predicted. Proactive alerts, not reactive dashboards.",
    },
    {
        headline: "It learns from every decision.",
        detail: "Every operator choice trains the system. Your operation builds its own intelligence.",
    },
];

function ConstellationSVG({ active }: { active: boolean }) {
    const cx = 200;
    const cy = 200;
    const radius = 140;

    return (
        <svg viewBox="0 0 400 400" className="w-64 h-64 md:w-80 md:h-80">
            {/* Connection lines */}
            {BRANCHES.map((branch, i) => {
                const rad = (branch.angle * Math.PI) / 180;
                const x = cx + Math.cos(rad) * radius;
                const y = cy + Math.sin(rad) * radius;
                return (
                    <g key={i}>
                        <line x1={cx} y1={cy} x2={x} y2={y} stroke="#1e293b" strokeWidth="1" />
                        {/* Pulse */}
                        <motion.circle
                            r="3"
                            fill="#3b82f6"
                            initial={{ cx: cx, cy: cy, opacity: 0 }}
                            animate={active ? {
                                cx: [cx, x],
                                cy: [cy, y],
                                opacity: [0, 1, 0],
                            } : {}}
                            transition={{
                                duration: 2,
                                delay: i * 0.4,
                                repeat: Infinity,
                                repeatDelay: BRANCHES.length * 0.4,
                            }}
                        />
                    </g>
                );
            })}

            {/* Branch nodes */}
            {BRANCHES.map((branch, i) => {
                const rad = (branch.angle * Math.PI) / 180;
                const x = cx + Math.cos(rad) * radius;
                const y = cy + Math.sin(rad) * radius;
                return (
                    <g key={`node-${i}`}>
                        <motion.circle
                            cx={x}
                            cy={y}
                            r="16"
                            fill="#0f172a"
                            stroke="#334155"
                            strokeWidth="1"
                            initial={{ scale: 0 }}
                            animate={active ? { scale: 1 } : {}}
                            transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 80 }}
                        />
                        <text x={x} y={y + 3} textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="500">
                            {branch.label}
                        </text>
                    </g>
                );
            })}

            {/* Center node */}
            <motion.circle
                cx={cx}
                cy={cy}
                r="28"
                fill="#0f172a"
                stroke="#3b82f6"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={active ? { scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 60 }}
            />
            <motion.circle
                cx={cx}
                cy={cy}
                r="40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="0.5"
                opacity="0.3"
                initial={{ scale: 0 }}
                animate={active ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
            />
            <text x={cx} y={cy - 3} textAnchor="middle" fill="#3b82f6" fontSize="7" fontWeight="700">Fleet</text>
            <text x={cx} y={cy + 7} textAnchor="middle" fill="#3b82f6" fontSize="7" fontWeight="700">Brain</text>
        </svg>
    );
}

export function FleetBrainScreen() {
    const { ref, isInView } = useInView(0.3);

    return (
        <section ref={ref} className="h-screen w-full snap-start flex flex-col items-center justify-center px-8 gap-8">
            {/* Constellation */}
            <ConstellationSVG active={isInView} />

            {/* Insights */}
            <div className="flex flex-col gap-4 max-w-2xl w-full">
                {INSIGHTS.map((insight, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ type: "spring", stiffness: 40, damping: 15, delay: 1 + i * 0.4 }}
                        className="flex gap-4 items-start"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0" />
                        <div>
                            <p className="text-base md:text-lg font-semibold text-blue-400">{insight.headline}</p>
                            <p className="text-sm text-slate-400 mt-1">{insight.detail}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Wire into `pitch-deck.tsx`**

Add import and replace Screen 7 placeholder. Update placeholder array to start from index 8 (4 remaining).

- [ ] **Step 3: Verify constellation animates with pulses and text reveals**

Scroll to Screen 7. Confirm: central node appears, branch nodes animate in, pulses travel along connections, three insight texts fade in with stagger.

- [ ] **Step 4: Commit**

```bash
git add src/components/pitch/screens/07-fleet-brain.tsx src/components/pitch/pitch-deck.tsx
git commit -m "feat: Screen 7 — Fleet Brain constellation with animated data pulses"
```

---

## Task 10: Screen 8 — Automation Before/After

**Files:**
- Create: `src/components/pitch/screens/08-automation.tsx`
- Modify: `src/components/pitch/pitch-deck.tsx`

- [ ] **Step 1: Create `08-automation.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";

const PAIRS = [
    { before: "Manual ID scanning", after: "Auto ID capture & verification" },
    { before: "Phone calls to verify credit", after: "Live credit limit enforcement" },
    { before: "Paper contracts", after: "Digital contract + e-sign" },
    { before: "WhatsApp for transfers", after: "Tracked transfer orders with map" },
    { before: "End-of-month reconciliation", after: "Real-time financial visibility" },
    { before: "Gut-feel pricing", after: "AI-optimized dynamic pricing" },
];

export function AutomationScreen() {
    const { ref, isInView } = useInView(0.3);

    return (
        <section ref={ref} className="h-screen w-full snap-start flex flex-col items-center justify-center px-8">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-slate-100 mb-12 text-center"
            >
                What used to take hours.
            </motion.h2>

            <div className="grid grid-cols-2 gap-x-8 md:gap-x-16 gap-y-4 max-w-3xl w-full">
                {/* Headers */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3 }}
                    className="text-xs font-bold tracking-widest uppercase text-red-500 mb-2"
                >
                    Before
                </motion.p>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3 }}
                    className="text-xs font-bold tracking-widest uppercase text-blue-500 mb-2"
                >
                    With Fleetora
                </motion.p>

                {/* Rows */}
                {PAIRS.map((pair, i) => (
                    <div key={i} className="contents">
                        {/* Before */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.5 + i * 0.2 }}
                            className="relative"
                        >
                            <span className="text-sm md:text-base text-slate-500">{pair.before}</span>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={isInView ? { width: "100%" } : {}}
                                transition={{ delay: 0.8 + i * 0.2, duration: 0.3 }}
                                className="absolute top-1/2 left-0 h-[1px] bg-red-500/60"
                            />
                        </motion.div>
                        {/* After */}
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 1.0 + i * 0.2 }}
                        >
                            <span className="text-sm md:text-base text-blue-400 font-medium">{pair.after}</span>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    );
}
```

Note: `<div className="contents">` is used instead of `<React.Fragment>` to provide a `key` prop while rendering as a CSS `display: contents` element (invisible wrapper in the grid).

- [ ] **Step 2: Wire into `pitch-deck.tsx`**

Add import and replace Screen 8 placeholder. Update placeholder array to start from index 9 (3 remaining).

- [ ] **Step 3: Verify strikethrough animation and blue reveals**

Scroll to Screen 8. Confirm: "Before" text appears, strikethrough lines animate left-to-right, "With Fleetora" text lights up in blue on each row with stagger.

- [ ] **Step 4: Commit**

```bash
git add src/components/pitch/screens/08-automation.tsx src/components/pitch/pitch-deck.tsx
git commit -m "feat: Screen 8 — before/after automation comparison with strikethrough animation"
```

---

## Task 11: Screen 9 — Roadmap Timeline

**Files:**
- Create: `src/components/pitch/screens/09-roadmap.tsx`
- Modify: `src/components/pitch/pitch-deck.tsx`

- [ ] **Step 1: Create `09-roadmap.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";

const PHASES = [
    {
        label: "NOW",
        color: "#10b981",
        items: ["HQ Cockpit", "POS Dashboard", "Booking Detail", "Fleet Brain v1"],
    },
    {
        label: "NEXT",
        color: "#3b82f6",
        items: ["Live Tracking", "Maintenance Kanban", "Walk-in Flow", "Corporate Accounts"],
    },
    {
        label: "HORIZON",
        color: "#8b5cf6",
        items: ["Fleet Brain v2", "Dynamic Pricing", "Predictive Maintenance", "Multi-currency"],
    },
];

export function RoadmapScreen() {
    const { ref, isInView } = useInView(0.3);

    return (
        <section ref={ref} className="h-screen w-full snap-start flex flex-col items-center justify-center px-8">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-slate-100 mb-16 text-center"
            >
                And we&apos;re just getting started.
            </motion.h2>

            <div className="relative flex items-start justify-center gap-8 md:gap-16 max-w-4xl w-full">
                {/* Connecting line */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "100%" } : {}}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                    className="absolute top-4 left-0 h-[2px]"
                    style={{ background: "linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)" }}
                />

                {PHASES.map((phase, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5 + i * 0.4, type: "spring", stiffness: 50, damping: 15 }}
                        className="flex-1 flex flex-col items-center text-center relative z-10"
                    >
                        {/* Node */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={isInView ? { scale: 1 } : {}}
                            transition={{ delay: 0.5 + i * 0.4, type: "spring", stiffness: 80 }}
                            className="w-8 h-8 rounded-full border-2 flex items-center justify-center mb-4"
                            style={{
                                borderColor: phase.color,
                                backgroundColor: "#0f172a",
                                boxShadow: `0 0 20px ${phase.color}40`,
                            }}
                        >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: phase.color }} />
                        </motion.div>

                        {/* Label */}
                        <p className="text-xs font-bold tracking-widest mb-3" style={{ color: phase.color }}>
                            {phase.label}
                        </p>

                        {/* Items */}
                        <div className="flex flex-col gap-1.5">
                            {phase.items.map((item, j) => (
                                <motion.p
                                    key={j}
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : {}}
                                    transition={{ delay: 0.8 + i * 0.4 + j * 0.1 }}
                                    className="text-sm text-slate-400"
                                >
                                    {item}
                                </motion.p>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Wire into `pitch-deck.tsx`**

Add import and replace Screen 9 placeholder. Update placeholder array to start from index 10 (2 remaining).

- [ ] **Step 3: Verify timeline draws and nodes glow**

Scroll to Screen 9. Confirm: gradient line draws left-to-right, three nodes pulse into view, feature lists appear under each node with stagger.

- [ ] **Step 4: Commit**

```bash
git add src/components/pitch/screens/09-roadmap.tsx src/components/pitch/pitch-deck.tsx
git commit -m "feat: Screen 9 — roadmap timeline with progressive line draw and node reveals"
```

---

## Task 12: Screens 10 & 11 — Compound Effect & Close

**Files:**
- Create: `src/components/pitch/screens/10-compound.tsx`
- Create: `src/components/pitch/screens/11-close.tsx`
- Modify: `src/components/pitch/pitch-deck.tsx`

- [ ] **Step 1: Create `10-compound.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";

const LINES = [
    "Every booking becomes training data.",
    "Every return feeds back into pricing.",
    "Every decision sharpens the next one.",
];

// Exponential curve path
const CURVE_PATH = "M 20 180 Q 60 175 100 160 Q 150 140 180 100 Q 210 50 240 20 Q 260 5 280 2";

export function CompoundScreen() {
    const { ref, isInView } = useInView(0.3);

    return (
        <section ref={ref} className="h-screen w-full snap-start flex items-center justify-center px-8">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 max-w-4xl">
                {/* Curve */}
                <div className="w-64 h-48 md:w-80 md:h-56 shrink-0">
                    <svg viewBox="0 0 300 200" className="w-full h-full">
                        {/* Grid lines */}
                        <line x1="20" y1="180" x2="280" y2="180" stroke="#1e293b" strokeWidth="1" />
                        <line x1="20" y1="180" x2="20" y2="10" stroke="#1e293b" strokeWidth="1" />

                        {/* Curve */}
                        <motion.path
                            d={CURVE_PATH}
                            fill="none"
                            stroke="url(#curveGradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={isInView ? { pathLength: 1 } : {}}
                            transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
                        />

                        {/* Glow version */}
                        <motion.path
                            d={CURVE_PATH}
                            fill="none"
                            stroke="url(#curveGradient)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            opacity="0.2"
                            filter="blur(4px)"
                            initial={{ pathLength: 0 }}
                            animate={isInView ? { pathLength: 1 } : {}}
                            transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
                        />

                        <defs>
                            <linearGradient id="curveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Text */}
                <div className="flex flex-col gap-4">
                    {LINES.map((line, i) => (
                        <motion.p
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 1 + i * 0.4, type: "spring", stiffness: 40, damping: 15 }}
                            className="text-lg md:text-xl text-slate-300"
                        >
                            {line}
                        </motion.p>
                    ))}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 2.5, duration: 0.8 }}
                        className="text-xl md:text-2xl font-semibold text-blue-400 mt-4"
                    >
                        Your competitors can&apos;t copy an advantage that compounds daily.
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Create `11-close.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";

interface CloseScreenProps {
    email?: string;
}

export function CloseScreen({ email = "sales@monexatech.com" }: CloseScreenProps) {
    const { ref, isInView } = useInView(0.3);

    return (
        <section ref={ref} className="h-screen w-full snap-start flex flex-col items-center justify-center px-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="flex flex-col items-center text-center gap-8"
            >
                {/* Wordmark */}
                <p className="text-2xl font-bold tracking-tight text-slate-300">Fleetora</p>

                {/* Tagline */}
                <p className="text-xl text-slate-400 max-w-md leading-relaxed">
                    Built for the operators who refuse to run blind.
                </p>

                {/* Contact */}
                <div className="mt-8">
                    <p className="text-sm text-slate-600">{email}</p>
                </div>
            </motion.div>
        </section>
    );
}
```

- [ ] **Step 3: Wire both into `pitch-deck.tsx`**

Add imports:

```tsx
import { CompoundScreen } from "./screens/10-compound";
import { CloseScreen } from "./screens/11-close";
```

Replace the final two placeholder sections with:

```tsx
{/* Screen 10: Compound Effect */}
<CompoundScreen />

{/* Screen 11: Close */}
<CloseScreen />
```

Remove the entire placeholder `Array.from(...)` block — all screens are now real components.

- [ ] **Step 4: Final `pitch-deck.tsx` imports should be**

```tsx
import { HeroScreen } from "./screens/01-hero";
import { StoryScreen } from "./screens/02-story";
import { DamageScreen } from "./screens/03-damage";
import { RevealScreen } from "./screens/04-reveal";
import { PillarsScreen } from "./screens/05-pillars";
import { ProductScreen } from "./screens/06-product";
import { FleetBrainScreen } from "./screens/07-fleet-brain";
import { AutomationScreen } from "./screens/08-automation";
import { RoadmapScreen } from "./screens/09-roadmap";
import { CompoundScreen } from "./screens/10-compound";
import { CloseScreen } from "./screens/11-close";
```

And the JSX body:

```tsx
<HeroScreen onComplete={handleHeroComplete} />
<StoryScreen />
<DamageScreen />
<RevealScreen />
<PillarsScreen />
<ProductScreen />
<FleetBrainScreen />
<AutomationScreen />
<RoadmapScreen />
<CompoundScreen />
<CloseScreen />
```

- [ ] **Step 5: Verify both screens**

Scroll to Screen 10: exponential curve draws, text fades in with stagger, closing line appears in blue.
Scroll to Screen 11: slow fade-in, "Fleetora" wordmark, tagline, email.

- [ ] **Step 6: Commit**

```bash
git add src/components/pitch/screens/10-compound.tsx src/components/pitch/screens/11-close.tsx src/components/pitch/pitch-deck.tsx
git commit -m "feat: Screens 10-11 — compound effect with SVG curve and closing screen"
```

---

## Task 13: Full Integration Verification

**Files:**
- All files from Tasks 1-12

- [ ] **Step 1: Run build**

Run: `npx next build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 2: Run dev server and test full flow**

Run: `npx next dev --port 3000`

Test checklist:
1. Screen 1: Hero animation plays, dark theme, "operations brain" copy, scroll-morph works, onComplete fires and advances to Screen 2
2. Screen 2: All 7 story lines appear with staggered animation
3. Screen 3: Three numbers count up — 20+, 15%, "Weeks"
4. Screen 4: Logo glow bloom, subtitle fade-in
5. Screen 5: Three pillars crossfade on scroll, dot indicator works
6. Screen 6: Three role mockups in browser frames, perspective tilt
7. Screen 7: Constellation with animated pulses, three insight reveals
8. Screen 8: Before/after strikethrough animation
9. Screen 9: Timeline draws, nodes glow, feature lists appear
10. Screen 10: Exponential curve draws, text reveals
11. Screen 11: Slow fade-in, tagline, email
12. Progress bar fills correctly from 0% to 100%
13. Arrow keys / Space advance and retreat between screens
14. Scroll snapping works between all screens

- [ ] **Step 3: Commit final state**

```bash
git add -A
git commit -m "feat: complete Fleetora pitch deck — 11-screen Apple Keynote-style presentation"
```
