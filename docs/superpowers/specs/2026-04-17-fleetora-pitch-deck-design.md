# Fleetora Pitch Deck — Design Spec

An interactive, scroll-driven pitch deck that replaces PowerPoint. Built as a Next.js single-page application with Framer Motion animations. Targets $10M+ franchise operators in the car rental industry. Apple Keynote-level presentation quality.

## Design Decisions

- **Structure**: 4 acts, 11 scroll-stops. Each scroll-stop is a full viewport height.
- **Navigation**: Scroll (wheel/touch), arrow keys, and spacebar advance between screens. A thin gradient progress bar at the top tracks position.
- **Theme**: Dark radiant — slate-900 (`#0f172a`) base with blue (`#3b82f6`) to violet (`#8b5cf6`) gradient accents. Glow/bloom effects on key moments.
- **Typography**: Geist Sans (already in the project). Headlines 48-72px semibold. Body 16-18px regular. Tracking tight on headlines.
- **Animation engine**: Framer Motion (already installed). Scroll-triggered spring physics. Each screen animates in on entry.
- **Existing component**: The scroll-morph-hero component is reskinned for Screen 1 (dark background, blue glow, updated copy). It retains its virtual scroll behavior within its own section.

## Architecture

The page is a single Next.js route (`/`) containing a `PitchDeck` component that manages scroll position and renders 11 screen components. Each screen is a full-viewport section.

```
src/
  app/
    page.tsx              — renders <PitchDeck />
    globals.css           — dark theme, fonts, base styles
    layout.tsx            — existing, unchanged
  components/
    ui/
      scroll-morph-hero.tsx  — existing, reskinned for dark theme
    pitch/
      pitch-deck.tsx      — scroll manager, progress bar, keyboard nav
      screens/
        01-hero.tsx        — scroll-morph animation (wraps existing component)
        02-story.tsx       — "Tuesday afternoon" narrative cascade
        03-damage.tsx      — count-up numbers
        04-reveal.tsx      — logo reveal with glow bloom
        05-pillars.tsx     — three reveals (5a/5b/5c within one screen)
        06-product.tsx     — animated product mockups (three roles)
        07-fleet-brain.tsx — AI constellation visualization
        08-automation.tsx  — before/after split screen
        09-roadmap.tsx     — horizontal timeline
        10-compound.tsx    — exponential curve + three lines
        11-close.tsx       — final screen with contact
      shared/
        use-scroll-snap.ts  — hook: manages full-page scroll snapping
        use-in-view.ts      — hook: triggers animations when screen enters viewport
        animated-counter.tsx — reusable count-up number component
        glow-text.tsx        — text with radiant glow effect
        progress-bar.tsx     — top gradient progress indicator
```

### Scroll Management

The `pitch-deck.tsx` component uses CSS `scroll-snap-type: y mandatory` on the container. Each screen section has `scroll-snap-align: start` and `height: 100vh`. This gives native snap-to-screen behavior.

Keyboard support: `ArrowDown`, `ArrowRight`, `Space` advance to the next screen. `ArrowUp`, `ArrowLeft` go back. Implemented via a `useEffect` keydown listener that calls `scrollTo` on the container.

The progress bar reads `scrollTop / scrollHeight` and renders a fixed-position gradient bar at the top.

### Screen 1 Exception

Screen 1 (the scroll-morph hero) has its own internal virtual scroll. While the user is in Screen 1, the hero's wheel handler captures scroll events via `e.preventDefault()`. Once the hero animation completes (virtual scroll reaches `MAX_SCROLL`), the hero calls an `onComplete` prop. The parent (`pitch-deck.tsx`) listens for this and programmatically scrolls the snap container to Screen 2 using `container.scrollTo({ top: window.innerHeight, behavior: 'smooth' })`. After completion, the hero stops capturing wheel events so normal snap scrolling resumes.

## Screens

### Screen 1 — The Hook (Scroll-Morph Hero)

**What changes from current:**
- Background: `#FAFAFA` becomes `#0f172a` (dark slate)
- Card images: car fleet images (already updated)
- Card styling: add subtle blue glow/shadow (`box-shadow: 0 0 20px rgba(59,130,246,0.3)`)
- Center text: "The operations brain for modern car rental." (replaces "The future is built on AI")
- Subtitle: "SCROLL TO BEGIN" (replaces "SCROLL TO EXPLORE")
- "Explore Our Vision" content removed entirely
- Circle formation gets a subtle radial glow behind it (`radial-gradient` pseudo-element)

**Presenter note:** You say nothing. Let the animation play. The room watches cars scatter, form a line, then orbit into a circle. First impression: "this is not a PowerPoint."

### Screen 2 — The Story: "It's Tuesday Afternoon"

**Layout:** Full dark screen. Text appears centered, one line at a time, triggered by scroll micro-steps within the screen.

**Implementation:** A single viewport-height section with 7 text blocks stacked vertically. Each block fades in (opacity 0 to 1, y: 20 to 0) when its scroll threshold is reached. Uses `useTransform` mapped to the section's internal scroll progress.

**Copy (each line appears alone, then dims as the next appears):**

1. "It's Tuesday afternoon." *(No city name — lets every client project their own operation onto the story.)*
2. "Your busiest branch just turned away 3 customers. Meanwhile, 4 cars sit idle across town. Nobody knows."
3. "A walk-in at the counter has been waiting 20 minutes. Paper contract. Phone calls to verify credit."
4. "A corporate account is over-limit. The shared spreadsheet says otherwise."
5. "Your cheapest SUV is in the workshop. Nobody noticed it was due for service."
6. "'Send two Tucsons to Airport tomorrow.' WhatsApp message. No trail. No tracking."
7. (Red accent) "This is how most rental operations run today."

**Animation:** Each line fades in with `spring` transition, holds for a scroll beat, then dims to 30% opacity as the next line appears. Final red line stays full opacity.

### Screen 3 — The Damage: Count-Up Numbers

**Layout:** Three scroll-stops within one section. Each shows one massive number centered on a dark screen.

**Numbers:**
1. **20+** — "minutes per checkout" / "That's 20 minutes your customer is questioning their choice."
2. **15%** — "of your fleet is invisible" / "Cars at the wrong branch. Revenue evaporating daily."
3. **Weeks** — "before finance sees reality" / "By the time the P&L lands, the decision window has closed."

**Implementation:** The `animated-counter.tsx` shared component handles the count-up. Numbers animate from 0 with spring easing over 1.5s. "Weeks" uses a typewriter-style reveal instead of a counter. The number is rendered at ~120px font size. Context line at ~18px below.

**Animation:** Number counts up on entry. Context line fades in 500ms after the number lands.

### Screen 4 — The Reveal: Logo Moment

**Layout:** Completely dark screen. The Fleetora wordmark appears centered.

**Animation sequence:**
1. 300ms dark pause
2. "Fleetora" text scales from 0.8 to 1.0, blur(10px) to blur(0), opacity 0 to 1 — spring transition
3. Simultaneously, a radial gradient glow blooms behind the text (blue to violet, `radial-gradient` expanding from 0% to 100% size)
4. 500ms pause
5. Subtitle fades in below: "One command surface. Every branch. Every vehicle. Every decision."

**Typography:** "Fleetora" at 72px, font-weight 700, letter-spacing -1px. Subtitle at 18px, font-weight 400, color `#94a3b8`.

### Screen 5 — Three Reveals

**Layout:** One section containing three sub-screens that crossfade on scroll. A small dot indicator (3 dots) shows which reveal is active.

**Reveal 5a: Speed**
- Headline: "90 seconds. Walk-in to wheels out."
- Visual: An animated countdown ring that ticks from 90 to 0. Below it, 5 steps appear and collapse into one: ID scan, credit check, contract, payment, keys — all automated into a single flow.

**Reveal 5b: Visibility**
- Headline: "Your whole fleet. One screen."
- Visual: A stylized mockup of the HQ Cockpit that assembles itself — cards slide in from edges, chart lines draw, a mini-map populates with dots. Not a screenshot, but a CSS/SVG recreation that animates.

**Reveal 5c: Depth**
- Headline: "Built for Tuesday afternoon."
- Visual: A dense booking detail view fading in, showing real complexity — multi-driver badges, mileage tracking bars, swap history, ticket ledger. Message: we handle the messy reality.

**Transition:** Horizontal crossfade between reveals. Dot indicator updates. Scroll within the section advances through 5a → 5b → 5c.

### Screen 6 — Product Showcase: Three Roles

**Layout:** Three product mockups presented sequentially on scroll. Each shows a browser frame with a stylized product screen inside, floating with perspective tilt and a blue glow underneath.

**Screens:**
1. **Franchise Head** — "What the VP of Operations sees every morning." HQ Cockpit mockup with utilization donut, revenue chart, branch health cards, Fleet Brain insights panel.
2. **Branch Staff** — "What the branch agent sees at the counter." POS Dashboard with today's bookings table, quick metrics bar, walk-in flow button.
3. **Finance Admin** — "What finance sees at month-end." Finance workspace with invoice table, deposit reconciliation, P&L summary.

**Implementation:** Each mockup is a styled `div` with `transform: perspective(1200px) rotateX(5deg) rotateY(-5deg)` that animates to flat on hover. Browser chrome (dots, address bar) wraps the content. The content inside is a simplified CSS recreation, not a screenshot.

**Animation:** Each mockup slides in from bottom with scale 0.9 to 1.0 and opacity transition. Subtle floating animation (`y: -5px` to `y: 5px`, repeating) when at rest.

### Screen 7 — Fleet Brain: "The System Thinks With You"

**Layout:** Full dark screen with an animated constellation/network diagram centered. Text reveals below on scroll.

**Visual:** SVG-based network visualization. A central node (Fleetora) with 6-8 branch nodes arranged in a circle. Animated pulses (small circles) travel along connection lines between nodes — representing data flow and insight generation. Subtle particle effects around the central node.

**Text reveals (scroll-triggered):**
1. "It sees what you can't." — "Fleet Brain detects Branch A is overstocked while Airport is at 92%. Recommends rebalancing before you ask."
2. "It acts before you do." — "Overdue returns flagged. Maintenance windows identified. Demand surges predicted. Proactive alerts, not reactive dashboards."
3. "It learns from every decision." — "ReasoningBank memory. Every operator choice trains the system. Your operation builds its own intelligence."

**Presenter note:** "Everything I've shown you so far? That's the product today. Now let me show you where this goes."

### Screen 8 — Automation Engine: Before/After

**Layout:** Split screen. Left column: "BEFORE" (red accent). Right column: "WITH FLEETORA" (blue accent).

**Pairs (6 rows):**
| Before | With Fleetora |
|--------|--------------|
| Manual ID scanning | Auto ID capture & verification |
| Phone calls to verify credit | Live credit limit enforcement |
| Paper contracts | Digital contract + e-sign |
| WhatsApp for transfers | Tracked transfer orders with map |
| End-of-month reconciliation | Real-time financial visibility |
| Gut-feel pricing | AI-optimized dynamic pricing |

**Animation:** On entry, the "Before" column appears first (red, slightly dimmed). Then each row's "Before" text gets a strikethrough animation (left to right, 200ms per row, staggered). As each line strikes through, the corresponding "With Fleetora" line lights up in blue. Visual: the old way dying, the new way igniting.

### Screen 9 — The Roadmap: "We're Just Getting Started"

**Layout:** A horizontal timeline that builds left-to-right as the user scrolls through the section.

**Three phases:**
- **NOW** (green `#10b981`) — HQ Cockpit, POS Dashboard, Booking Detail, Fleet Brain v1
- **NEXT** (blue `#3b82f6`) — Live Tracking, Maintenance Kanban, Walk-in Flow, Corporate Accounts
- **HORIZON** (violet `#8b5cf6`) — Fleet Brain v2, Dynamic Pricing, Predictive Maintenance, Multi-currency

**Implementation:** CSS horizontal line with three node markers. Each phase's node glows and its feature list fades in as scroll progress reaches its threshold. The line draws itself (width animation from 0% to 100%).

**Animation:** Line draws progressively. Each node pulses once when reached. Feature labels fade in below each node with stagger.

### Screen 10 — The Compound Effect

**Layout:** Dark screen. An animated exponential curve on the left half. Three text lines on the right, appearing in sequence.

**Visual:** SVG path that draws an exponential curve from bottom-left to top-right. The curve draws itself on entry (stroke-dashoffset animation). A glowing dot follows the curve's path.

**Text (staggered fade-in):**
1. "Every booking becomes training data."
2. "Every return feeds back into pricing."
3. "Every decision sharpens the next one."

Then, below, with blue accent: **"Your competitors can't copy an advantage that compounds daily."**

### Screen 11 — The Close

**Layout:** Minimal. Dark. Centered.

**Content:**
- Fleetora wordmark, small (~24px), subtle
- One line: "Built for the operators who refuse to run blind."
- Spacer
- Presenter name and email *(configurable via props — defaults to `sales@monexatech.com`)*

**Animation:** Slow fade-in (1.5s duration). No spring, no bounce. `ease-out` only. Let the words breathe.

**Typography:** The tagline at 20px, font-weight 400, color `#cbd5e1`. Contact info at 14px, color `#64748b`.

## Design Constants

| Property | Value |
|----------|-------|
| Background | `#0f172a` (slate-900) with per-screen radial gradient accents |
| Text primary | `#f1f5f9` (slate-100) |
| Text secondary | `#94a3b8` (slate-400) |
| Text muted | `#64748b` (slate-500) |
| Accent blue | `#3b82f6` |
| Accent violet | `#8b5cf6` |
| Accent green | `#10b981` |
| Accent red | `#ef4444` |
| Accent amber | `#f59e0b` |
| Accent cyan | `#06b6d4` |
| Gradient primary | `linear-gradient(135deg, #3b82f6, #8b5cf6)` |
| Glow effect | `box-shadow: 0 0 60px rgba(59,130,246,0.3)` |
| Font | Geist Sans (variable, already loaded) |
| Headline size | 48-72px, font-weight 600-700, letter-spacing -0.5px to -1px |
| Body size | 16-18px, font-weight 400, line-height 1.6 |
| Transition default | `type: "spring", stiffness: 40, damping: 15` |
| Snap behavior | `scroll-snap-type: y mandatory` on container |

## Technical Notes

- **No new dependencies required.** Framer Motion handles all animations. Tailwind handles all styling. SVGs are inline for the constellation and curve visualizations.
- **Product mockups** are CSS recreations (styled divs with border, shadow, and layout), not images. This keeps them sharp at any resolution and animatable.
- **Responsive:** The primary target is a laptop screen being presented to a room (1280-1440px width). Mobile support is secondary but the scroll-snap pattern adapts naturally.
- **Performance:** Each screen only animates when in view. Off-screen components render but skip animation. The scroll-morph hero already handles its own performance via virtual scroll.
- **Presenter controls:** Arrow keys and spacebar work as expected. The progress bar gives spatial awareness. No "click to advance" UI — scroll is the primary input.

## Presentation Timing Guide

| Act | Screens | Duration | Presenter Action |
|-----|---------|----------|-----------------|
| I — The World Is Broken | 1-3 | 3-4 min | Narrate the story. Pause on each number. |
| II — There Is A Better Way | 4-6 | 4-5 min | "We built something." Three reveals. Show the product. |
| III — The Intelligence Layer | 7-9 | 3-4 min | "One more thing..." AI story. Before/after. Roadmap. |
| IV — The Conviction | 10-11 | 1-2 min | Compound effect. Close quiet. "Questions?" |
| **Total** | **11** | **~12-15 min** | |
