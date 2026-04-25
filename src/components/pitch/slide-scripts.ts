// ─────────────────────────────────────────────────────────
// Slide-synced narration scripts.
//
// Total deck length: ~22-25 minutes when spoken at 150 wpm.
// Each script: 150-200 words, conversational, sales-grade.
// `speakerNotes` are optional asides for the sales rep
// (objection handling, talking points, transition cues).
// `durationSec` is fallback dwell time when TTS is muted.
// ─────────────────────────────────────────────────────────

export interface ScriptEntry {
    slideId: string;
    chapter: string;
    slideTitle: string;
    narration: string;
    speakerNotes?: string;
    durationSec: number;
}

export const SCRIPTS: ScriptEntry[] = [
    {
        slideId: "hero",
        chapter: "I · The Hook",
        slideTitle: "The operations brain for modern car rental",
        narration:
            "Imagine running a rental fleet where every branch, every vehicle, every booking, and every dirham flows through one system that actually thinks. That's Fleetora. We're not another booking tool, not another telematics dashboard, and not another finance plug-in. We are the operations brain — the layer that connects the counter, the fleet floor, the AI, and the ledger into a single platform. Over the next twenty minutes, I'm going to walk you through exactly how that works, using your kind of operation as the story. By the end you'll see five things: how a walk-in customer becomes keys-in-hand in ninety seconds, how a regional director sees every car across every branch in real time, how AI rebalances supply before you even ask, how finance closes the books without a midnight scramble, and how your own branches turn into an internal marketplace for vehicles. Let's begin.",
        speakerNotes:
            "Open with confidence, slow tempo. The phrase 'operations brain' is the anchor — let it land. If asked 'so it's an ERP?' — answer: it's an ERP, a CRM, a TMS, and a marketplace, designed for car rental specifically. Don't get drawn into integrations talk yet — that comes in Chapter IV.",
        durationSec: 70,
    },
    {
        slideId: "intro",
        chapter: "I · The Hook",
        slideTitle: "One platform. Five stories.",
        narration:
            "What you're going to see today isn't a feature list — it's a journey. Five stories, each told from a different seat in your business. Story one is The Counter, where a branch staffer turns a walk-in into a happy customer in under ninety seconds. Story two is The Operations Floor, where a franchise head sees every vehicle across every branch and every city, in real time. Story three is The Intelligence — where AI doesn't just observe, it acts. It rebalances, it predicts, it prevents downtime. Story four is The Money — corporate accounts, invoicing, payments, GL, and the close — finance done by people who actually like sleeping at night. And story five is the future — the marketplace where your idle vehicles become someone else's revenue, and the roadmap that takes us through 2027. Each story builds on the last. By the time we get to story five, you'll see why this isn't five separate tools — it's one platform, one truth, one brain.",
        speakerNotes:
            "This is the table of contents. Set expectations: 20-25 min, interrupt with questions any time. The framing 'five stories' is more sticky than 'five modules' — keep it.",
        durationSec: 75,
    },
    {
        slideId: "cmd-bar",
        chapter: "II · The Counter",
        slideTitle: "Command bar — the staff superpower",
        narration:
            "Let's start where most rental businesses lose their first thirty seconds — at the counter. Today, your branch staff toggle between five tabs: customer lookup, vehicle availability, pricing, payment, and contracts. We replaced all five with one keyboard-first command bar. Watch what happens. The staff types a license plate, a customer name, a booking ID, or a phone number — anything — and Fleetora figures out what they meant. Hit enter, and the right action runs: pull up a customer, find a vehicle, generate a quote, modify a booking. No menu hunting. No tab switching. The same command bar works at every branch, in every workflow, for every staff role. New hires are productive in their first hour because there's only one thing to learn: just type what you want to do. This is what a modern operations layer feels like. The interface gets out of the way and lets the work happen.",
        speakerNotes:
            "Demo the command bar live if possible. The 'productive in their first hour' line is a strong onboarding/training cost talking point — anchor on training spend if they push back on price later.",
        durationSec: 70,
    },
    {
        slideId: "customer",
        chapter: "II · The Counter",
        slideTitle: "Customer 360 in one screen",
        narration:
            "When a customer walks up — whether they're new, a regular, or a corporate account holder — your staff needs to know everything about them in seconds. Not five clicks deep, not in a separate CRM. Right here. This is Customer 360. ID, license, contact, lifetime value, past bookings, outstanding balance, blacklist flags, accident history, preferred vehicle class, payment method on file, corporate affiliation if any — all of it surfaces the moment the customer is identified. Your staff sees a person, not a database row. And because this is the same record that finance, fleet, and the corporate desk all read from, there's no reconciling later. One customer, one truth, every time. Notice the loyalty score on the right — that's computed live from booking frequency, on-time return rate, payment behavior, and damage history. Your staff can decide right at the counter whether to upgrade them, waive the security hold, or flag them for manual review.",
        speakerNotes:
            "If they ask about KYC compliance — yes, ID and license capture flows through automated verification. The loyalty score is a one-line ML model under the hood — don't oversell it as 'AI' here, the AI story comes in Chapter III.",
        durationSec: 70,
    },
    {
        slideId: "checkout",
        chapter: "II · The Counter",
        slideTitle: "Ninety-second checkout",
        narration:
            "Now the part that matters: how fast can your staff get a customer into the car? Watch the clock. ID scanned — fields auto-fill. License verified against the regulator API in the background. Vehicle selected from live availability — segregated by branch, class, and current state. Pricing computed instantly from your dynamic rate matrix, with insurance tiers, add-ons, and corporate discounts already applied. Payment captured — card, wallet, bank transfer, or corporate invoice. Contract generated and digitally signed on a tablet. Keys handed over. Total elapsed time: ninety seconds. The industry average is six to eight minutes. That's not just better customer experience — it's branch capacity. A counter that used to handle ten walk-ins an hour now handles thirty, with the same headcount. Multiply that across your fleet, across peak hours, across busy weekends, and the throughput improvement compounds into millions of additional revenue per year.",
        speakerNotes:
            "Throughput math: if they push back, ask 'how many walk-ins do you turn away on a Friday at 5pm?' That number times 90% utilization times average JOD/booking is the back-of-envelope ROI.",
        durationSec: 70,
    },
    {
        slideId: "living-booking",
        chapter: "II · The Counter",
        slideTitle: "The living booking record",
        narration:
            "A booking isn't a row in a database — it's a story that lives, breathes, and changes from the moment it's created until the customer walks back out and the car returns to inventory. Every other rental system treats a booking as static — you create it, then you patch it with notes, sticky tickets, and emails. We made bookings alive. Here's a single booking record. Look at the timeline on the right. Every event — customer call, payment retry, branch transfer, mileage update, fuel charge, accident report, late return, damage assessment — is captured in sequence, automatically. Your staff can see the full history without asking around. Finance can audit it without a forensic dig. And legal has a clean, immutable trail if there's ever a dispute. This is what record integrity looks like when the platform is doing the work, not your people.",
        speakerNotes:
            "If they bring up GDPR / data retention: yes, configurable per-jurisdiction policies, hard delete after retention window. Don't open the audit log discussion unless asked — it's deep.",
        durationSec: 65,
    },
    {
        slideId: "pos",
        chapter: "III · The Operations Floor",
        slideTitle: "Branch POS — every transaction, one tap",
        narration:
            "Now we move from the customer's perspective to the branch's. This is the branch POS — the central nervous system of a single rental location. Every transaction that happens at this branch — rentals, returns, extensions, damage charges, fuel adjustments, refunds, deposits — flows through here. The branch manager sees today's revenue, today's utilization, today's open contracts, and today's exceptions, all on one screen. No more end-of-day reconciliation between three systems. No more 'where did this cash come from' on Monday morning. Cash drawer reconciliation is automated, with discrepancies flagged in real time. The handoff between shifts is one click — outgoing shift signs off, incoming shift signs in, and Fleetora generates a full activity log. This is what your branch managers have been asking for: operational clarity, without the spreadsheet.",
        speakerNotes:
            "If they have multiple POS hardware (Verifone, Ingenico, Pax) — we integrate. Confirm in the first technical deep-dive after the meeting. Don't get sucked into hardware specifics here.",
        durationSec: 65,
    },
    {
        slideId: "fleet-map",
        chapter: "III · The Operations Floor",
        slideTitle: "The live fleet map",
        narration:
            "Now zoom out. This is the live fleet map — every car, every branch, every city, in one view. Each dot is a vehicle. Color tells you state: green is on rent, blue is available, amber is in maintenance, red is on hold or in dispute. Click any dot and you get the car's full profile — current renter if any, telemetry, mileage, fuel, last service, days since cleaning, and current location. Drag-select an area to see all cars in that zone. Filter by class, by branch, by age, by utilization. The data refreshes every fifteen seconds from telematics on the vehicle plus operational events from the branch POS. For a regional director, this is the first time they've ever had a single map that shows what's actually happening across their network. No more emails to branch managers asking 'how many SUVs are available in Amman tomorrow?' — you can see it yourself, right now, with confidence.",
        speakerNotes:
            "Ask: 'How many telematics providers do you have today?' If answer is more than one — we normalize all of them. This is a major pain point for regional fleets.",
        durationSec: 70,
    },
    {
        slideId: "hq-cockpit",
        chapter: "III · The Operations Floor",
        slideTitle: "HQ cockpit — the command center",
        narration:
            "Above the fleet map sits the HQ cockpit — where the franchise head, regional director, or country GM lives during business hours. Twelve KPIs that actually matter: revenue today versus same day last year, utilization by branch, average daily rate trend, top-grossing vehicles, branch performance ranked, days-of-supply for each segment, accident-rate per thousand kilometers, days outstanding receivables, and four customizable widgets per role. The numbers update live. Every figure is drillable — click revenue, you see the contracts contributing to it. Click utilization, you see the cars driving the gap. This isn't a BI dashboard you stare at quarterly. This is the cockpit you fly the business from, every day. And because every figure ties back to the same operational record, you're never debating data quality with the finance team. There's one number, and it's the right one.",
        speakerNotes:
            "Push: 'How many Tuesday morning standups have ended in arguments about whose number is right?' That's the pain. Drillable, single source of truth.",
        durationSec: 65,
    },
    {
        slideId: "fleet-brain",
        chapter: "IV · The Intelligence",
        slideTitle: "Fleet Brain — AI that earns its keep",
        narration:
            "Here's where Fleetora stops being a system of record and starts being a system of intelligence. We call it Fleet Brain. It runs continuously in the background, watching every booking, every cancellation, every return, every utilization swing, every weather forecast, every event in your cities, every fuel-price tick, and every demand signal it can find. And it doesn't just report — it acts, or it tells you what to do, with confidence levels and expected impact. Think of it as a senior operations manager who never sleeps, never forgets, and has perfect recall of every car you've ever rented. The next three slides will show you specifically how Fleet Brain shows up in your day: rebalancing supply between branches before demand peaks, predicting cars that need maintenance before they break down, and surfacing pricing opportunities you'd otherwise miss. This is the layer that quietly turns a good operation into a great one.",
        speakerNotes:
            "If asked 'is this just a wrapper on ChatGPT?' — no. The Fleet Brain is a stack of purpose-built models for demand forecasting, anomaly detection, and rule-based optimization. LLMs are used selectively for natural-language summaries, not core decisions.",
        durationSec: 70,
    },
    {
        slideId: "rebalance",
        chapter: "IV · The Intelligence",
        slideTitle: "Auto-rebalance — supply meets demand",
        narration:
            "Here's Fleet Brain in action. Right now, you have eight extra SUVs sitting at your downtown branch, and a forecasted shortage of SUVs at the airport branch on Friday. Without Fleet Brain, this gets caught Friday morning when a customer is turned away. With Fleet Brain, you get a recommendation Wednesday: rebalance four SUVs from downtown to airport. The rec includes the predicted demand, the cost of the move, the expected revenue uplift, and a confidence score. One click, and a transfer is dispatched — driver assigned, fuel logged, ETA tracked, both branches notified. Or, if you prefer, set the threshold and let the system auto-approve below a certain cost. We've seen real customers eliminate thirty to forty percent of their stockout days in the first quarter just with this one capability. Idle vehicles in the wrong place cost real money. This is how you stop bleeding it.",
        speakerNotes:
            "The 30-40% number is a real-customer KPI — but lead with their data if they share it. Ask: 'What's your stockout rate at your busiest branch?' If they say >5%, this slide is gold.",
        durationSec: 65,
    },
    {
        slideId: "predict",
        chapter: "IV · The Intelligence",
        slideTitle: "Predict — see demand before it arrives",
        narration:
            "Rebalancing is reactive — but predicting demand is proactive. Fleet Brain forecasts demand at every branch, for every vehicle class, for every day, fourteen days out, with confidence bands. It learns from your historical bookings, but it also factors in events you don't even tell it about: school holidays, regional sports events, public holidays in source markets, fuel price shocks, weather, tourism arrivals, and even local news. Friday after a long weekend in Riyadh? It knows. New conference at the convention center on the twentieth? It saw the booking spike yesterday and adjusted. Your fleet planning team stops working in spreadsheets and starts working with a forecast that updates every hour. Long-tail capacity decisions — when to onboard new units, when to sell off aging stock, when to ramp up corporate-fleet contracts — all get sharper. And because the forecast is integrated into pricing and rebalancing, the system doesn't just predict — it acts on the prediction.",
        speakerNotes:
            "If they ask 'how accurate?' — typical MAPE in the 8-15% range for two-week horizon, depending on data history. Don't quote without context — small operators with thin data should expect lower accuracy in month one and improvement over time.",
        durationSec: 70,
    },
    {
        slideId: "maintenance",
        chapter: "IV · The Intelligence",
        slideTitle: "Predictive maintenance — zero downtime",
        narration:
            "Now the third pillar of Fleet Brain: maintenance. Every car in your fleet generates signals — engine hours, mileage between services, tire wear, brake wear, oil pressure, error codes, fuel-economy degradation, AC performance. Most rental businesses look at these once, when the service is scheduled. We look at them every minute. When the model sees a vehicle drifting from its baseline — a Camry whose fuel economy has slipped six percent over the last week, a Patrol whose oil-pressure variance is climbing — it doesn't wait for the failure. It schedules the service, books the bay, notifies the customer if needed, and reroutes the booking pipeline. Your downtime per vehicle drops. Your roadside-assistance calls drop. Your service costs drop, because catching a failing alternator early is one-tenth the cost of replacing a stranded car. And your customers stop having that 'this car broke down on my honeymoon' moment. Predictive maintenance is the single highest ROI thing AI has ever done for a fleet.",
        speakerNotes:
            "If they say 'we already have a maintenance schedule' — yes, and it's based on miles or time, not condition. Time-based maintenance over-services healthy cars and under-services sick ones. Condition-based catches both ends.",
        durationSec: 70,
    },
    {
        slideId: "corporate",
        chapter: "V · The Money",
        slideTitle: "Corporate accounts — built for B2B",
        narration:
            "Now we move from operations into finance. And we start with the part of your revenue that probably matters most: corporate accounts. Embassies, government, multinationals, fleet customers — these are your highest-value relationships, and historically the most painful to manage, because their billing rules don't fit a retail-rental schema. Multi-driver bookings under one master contract. Pre-negotiated rate cards by class and duration. Cost-center tagging for every booking. Custom invoicing cadence — weekly, monthly, on-completion. Volume discounts that retro-apply at quarter-end. Multi-currency consolidation across markets. Approval workflows for managers. We built every one of these as first-class concepts, not workarounds. A single corporate customer can have thousands of bookings under one umbrella, with finance reporting them exactly the way the customer's procurement team wants. Onboarding a corporate account that used to take six weeks of back-and-forth contracts, rate negotiations, and finance setup — now takes one afternoon.",
        speakerNotes:
            "If they have one or two big corporate accounts — ask which ones. If they say 'BG, embassies, oil companies' — you're talking about exactly the customers Fleetora was built for.",
        durationSec: 70,
    },
    {
        slideId: "invoicing",
        chapter: "V · The Money",
        slideTitle: "Invoicing without the chase",
        narration:
            "Invoicing is where most rental finance teams lose entire weeks. Generating invoices from raw bookings, applying corporate rate cards, splitting cost centers, validating tax codes, applying credit memos, sending the right document to the right approver, and chasing payment — all of it. We automated the entire chain. Every booking, the moment it closes, becomes an invoice line. Lines are grouped by customer, by cost center, by tax jurisdiction, by your invoicing rules. The invoice is generated, validated, signed, and emailed — to the right approver, in the right format, in the right language. PDF for the customer, e-invoice format for the regulator, structured data for your ERP. Payment status tracks itself. Aging buckets refresh hourly. Dunning sequences fire on schedule. Your finance team goes from spending Tuesday and Wednesday running the invoice batch to reviewing a queue of exceptions. Two days a week, back. And your DSO — days sales outstanding — drops, because nothing falls between the cracks.",
        speakerNotes:
            "If they're in a country with mandatory e-invoicing (KSA, Egypt, UAE, Jordan) — emphasize regulator-format generation is built-in. We're already certified or in active certification for major MENA markets.",
        durationSec: 70,
    },
    {
        slideId: "payments",
        chapter: "V · The Money",
        slideTitle: "Payments — every rail, one ledger",
        narration:
            "Payments. The simple-sounding part of finance that secretly runs on three different systems and requires a person to reconcile every Tuesday. Cards, bank transfers, wallets, corporate POs, cash, even crypto in some markets — every rail flows into Fleetora, gets matched to the right invoice automatically, and posts to the GL with the correct accounting entry. Auto-reconciliation runs continuously. Bank statements are imported, transactions matched against expected receipts, and exceptions surfaced — typically less than two percent of volume, versus the twenty percent your team is reconciling manually today. Refunds, chargebacks, and disputes are first-class workflows, not email threads. Every payment is traceable end-to-end: from the customer's card, to your processor, to your bank, to your GL, to the customer's invoice. Audit trail is automatic. Compliance reporting is automatic. And your CFO finally gets a cash position that's actually live — not a snapshot from last week.",
        speakerNotes:
            "If they ask about payment processors — we integrate with major regional ones (Network, Tabby, Tamara, Checkout.com) plus global (Stripe, Adyen). Don't oversell — confirm specific processor coverage in the technical session.",
        durationSec: 70,
    },
    {
        slideId: "price-compiler",
        chapter: "V · The Money",
        slideTitle: "The price compiler",
        narration:
            "Now this is one of my favorite features, and we call it the price compiler. Think of it like a build pipeline, but for prices. Your base rate by class. Your duration discounts. Weekend uplifts. Airport surcharges. Insurance options. Add-ons — child seat, GPS, valet, fuel pre-purchase. Corporate rate-card overrides. Seasonal modifiers. Promotional codes. Demand-driven uplifts from Fleet Brain. Every one of these is a rule, every rule has a stack order, and the compiler runs them in deterministic sequence to produce the final price. Watch the right side of the screen. Each rule applied lights up — base rate, then airport surcharge, then weekend uplift, then full insurance, then valet add-on. The final number is auditable down to the last fil. If a customer asks 'why am I paying this much?' your staff can show them exactly. If finance asks 'why did this booking earn this much?' the breakdown is there. No black-box pricing. No 'system says so.' Every dirham is explained.",
        speakerNotes:
            "Demo the compiler animation — it's visually compelling. The 'auditable to the last fil' line is a strong CFO talking point.",
        durationSec: 75,
    },
    {
        slideId: "finance-ws",
        chapter: "V · The Money",
        slideTitle: "Finance workstation — close in days, not weeks",
        narration:
            "And finally, the finance workstation. This is where your CFO and controller spend their days. Live GL, live trial balance, live receivables aging, live payables, live FX exposure, live intercompany positions if you operate in multiple countries. The month-end close, which today probably takes you ten to fifteen working days of manual reconciliation, journal entries, intercompany matching, and audit prep — happens in three to five. Why? Because every operational event already posts to the right GL account at the moment it happens. The booking that was created yesterday already has its revenue recognition on the right schedule, its insurance offset to the right liability account, and its corporate rate-card discount netted out. There's no batch posting at month-end. There's just review and approval. Auditors love it because every entry has a source document. Your CFO loves it because they can answer the board's questions on day six instead of day twenty. And the rest of finance gets their evenings back.",
        speakerNotes:
            "Close-cycle improvement is one of the strongest CFO ROI talking points. Ask 'when was your last clean close that ran less than 8 working days?' If they laugh, you're in.",
        durationSec: 75,
    },
    {
        slideId: "addons-marketplace",
        chapter: "VI · The Marketplace",
        slideTitle: "Add-ons marketplace — extra revenue per booking",
        narration:
            "Now we move into Chapter Six: the marketplace. Two parts — add-ons, and vehicles. Let's start with add-ons. Every booking has potential revenue beyond the base rental. Insurance upgrades, child seats, GPS, valet drop-off, additional driver fees, fuel pre-purchase, airport delivery, hotel pickup, gift bottles, even partner experiences like desert safaris or mall shuttles. Most rental systems treat these as line items your staff has to remember to upsell. We built them as a true marketplace. The system suggests the right add-ons at the right moment — at booking, at checkout, in the customer app, in the post-arrival upsell, in the return reminder. Conversion is measured. Revenue per booking lifts ten to twenty percent in markets we've measured. And because partner add-ons settle through Fleetora — desert safari operator, hotel chain, valet service — you participate in the margin without owning the operations. The booking becomes a journey, not just a car key.",
        speakerNotes:
            "If they have any partner relationships (hotels, tour operators) — this is where they monetize them properly. Don't get pulled into commercial terms; that's a business-development conversation.",
        durationSec: 70,
    },
    {
        slideId: "vehicle-marketplace",
        chapter: "VI · The Marketplace",
        slideTitle: "Vehicle marketplace — your network is the marketplace",
        narration:
            "And here's the part of the platform that's quietly the most strategic. The vehicle marketplace. Today, your branches each sit on their own inventory. A Patrol that's idle in Abu Dhabi for three weeks loses you eight thousand dirhams in opportunity cost — meanwhile a Dubai branch is turning corporate customers away because they can't source one. The vehicle marketplace solves this internally, before you ever go to an external auction. Every branch lists its idle inventory. Every branch posts its demand. The match engine sees both, prices the deal — including transfer cost, condition, days idle, and target margin — and proposes settlements. One click, the deal closes, the car moves, the books are reconciled. Across a network of forty branches, this is millions of dirhams of recovered revenue per year. And when you eventually do need to liquidate older units, you're competing in a transparent internal market — not a one-sided dealer auction. Your network becomes the marketplace.",
        speakerNotes:
            "This is the closer for the marketplace chapter. Lean into the 'internal liquidity' framing — it's a CFO concept, not just an ops one. If they have a multi-branch operation, this resonates immediately.",
        durationSec: 75,
    },
    {
        slideId: "roadmap",
        chapter: "VII · The Future",
        slideTitle: "The build roadmap — what ships, when",
        narration:
            "Before I close, here's exactly what's in production today and what's coming. Five phases on a single track. Phase one — Foundation — is live and running in production. Branch ops, fleet map, HQ cockpit, AI rebalance, predictive maintenance, the price compiler, the finance workstation. Eighteen features, all shipped. Phase two — Marketplace — is what we're building right now. Vehicle exchange, add-ons marketplace, match engine. Six features, in active development, shipping this quarter. Phase three — Reach — is the next quarter. Driver app, customer app, multi-currency support for KSA and Egypt, self-service kiosks. Phase four — Intelligence v2 — is early next year. Dynamic pricing live, predictive maintenance v2, embedded financing for renters. And phase five — Autonomy — is the long horizon. Autonomous booking, zero-touch operations, self-balancing fleet. Bi-weekly releases. No big-bang migrations. Every two weeks, your platform gets better, and your team feels it.",
        speakerNotes:
            "If they're worried about 'are you a real product or a deck' — this slide is the answer. 18 features shipped, in production. Ask if they want a reference call with an existing customer.",
        durationSec: 75,
    },
    {
        slideId: "close",
        chapter: "VII · The Future",
        slideTitle: "Close — start with one branch",
        narration:
            "And that's the platform. Five stories, one brain, one ledger, one truth. The way we usually start with new partners is a four-week pilot at one branch — your busiest one, ideally, because that's where the math is most visible. We bring in your data, your rates, your customers, your branch staff. In week one we're observing and tuning. In week two we're running parallel with your existing tools. In week three we cut over to Fleetora as the system of record at that branch. In week four we measure — utilization, throughput, revenue per booking, finance-cycle time, staff satisfaction — and decide together what comes next. Most of our partners go from one branch to network-wide in under six months. The pilot is fixed-fee, fixed-scope, and fully reversible if it doesn't deliver. So the only real question left is: which branch would you like to start with?",
        speakerNotes:
            "End on the question. Silent pause. Let them answer. Don't fill the gap. The pilot terms (fixed fee, reversible) handle most procurement objections — but specific commercial terms come in the follow-up.",
        durationSec: 75,
    },
];

// Map for quick lookup by slideId.
export const SCRIPT_BY_ID: Record<string, ScriptEntry> = SCRIPTS.reduce((acc, s) => {
    acc[s.slideId] = s;
    return acc;
}, {} as Record<string, ScriptEntry>);

// Total spoken duration (sum of durationSec) — useful for autoplay countdown / progress.
export const TOTAL_DURATION_SEC = SCRIPTS.reduce((sum, s) => sum + s.durationSec, 0);
