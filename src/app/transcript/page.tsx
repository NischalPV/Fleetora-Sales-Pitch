"use client";

import { useState } from "react";
import { SCRIPTS, TOTAL_DURATION_SEC } from "@/components/pitch/slide-scripts";

// ─────────────────────────────────────────────────────────
// /transcript — printable, copyable transcript for sales reps.
// ─────────────────────────────────────────────────────────

export default function TranscriptPage() {
    const [copied, setCopied] = useState(false);

    // Group by chapter for nicer reading
    const chapters: Array<{ name: string; entries: typeof SCRIPTS }> = [];
    for (const e of SCRIPTS) {
        const last = chapters[chapters.length - 1];
        if (last && last.name === e.chapter) {
            last.entries.push(e);
        } else {
            chapters.push({ name: e.chapter, entries: [e] });
        }
    }

    const totalMin = Math.round(TOTAL_DURATION_SEC / 60);

    const fullText = SCRIPTS.map(
        (s) =>
            `${s.chapter}\n${s.slideTitle}\n\n${s.narration}${
                s.speakerNotes ? `\n\nSpeaker notes: ${s.speakerNotes}` : ""
            }`
    ).join("\n\n———\n\n");

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // ignore
        }
    };

    const handleDownload = () => {
        const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "fleetora-pitch-transcript.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <main className="min-h-screen bg-white text-slate-900">
            <style jsx global>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    .page-break {
                        page-break-before: always;
                    }
                    body {
                        font-size: 12pt;
                    }
                }
            `}</style>

            {/* Top bar (hidden on print) */}
            <div className="no-print sticky top-0 z-10 bg-white border-b border-slate-200">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight">Fleetora · Pitch Transcript</h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {SCRIPTS.length} slides · ~{totalMin} min spoken
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="px-3 py-1.5 text-xs font-medium rounded border border-slate-300 hover:bg-slate-50 transition-colors"
                        >
                            {copied ? "Copied ✓" : "Copy all"}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="px-3 py-1.5 text-xs font-medium rounded border border-slate-300 hover:bg-slate-50 transition-colors"
                        >
                            Download .txt
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-3 py-1.5 text-xs font-medium rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                        >
                            Print / PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Transcript body */}
            <article className="max-w-3xl mx-auto px-6 py-12">
                <header className="mb-12">
                    <p className="text-[10px] font-semibold tracking-[0.32em] uppercase text-slate-500 mb-3">
                        Sales · Pitch Script · Internal
                    </p>
                    <h1 className="text-4xl font-bold tracking-tight mb-3">
                        Fleetora — The Operations Brain for Modern Car Rental
                    </h1>
                    <p className="text-base text-slate-600 leading-relaxed">
                        Full narration script across {SCRIPTS.length} slides, designed for ~{totalMin} minutes of presentation. Each slide includes the spoken narration and, where applicable, presenter notes for objection handling and transition cues.
                    </p>
                </header>

                {chapters.map((ch, ci) => (
                    <section key={ch.name} className={ci > 0 ? "mt-12 page-break" : "mt-12"}>
                        <h2 className="text-xs font-bold tracking-[0.32em] uppercase text-blue-700 border-b border-slate-200 pb-2 mb-6">
                            Chapter · {ch.name}
                        </h2>

                        {ch.entries.map((s, idx) => (
                            <div key={s.slideId} className={idx > 0 ? "mt-10" : ""}>
                                <div className="flex items-baseline gap-3 mb-3">
                                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                                        {String(SCRIPTS.indexOf(s) + 1).padStart(2, "0")}
                                    </span>
                                    <h3 className="text-xl font-semibold tracking-tight">
                                        {s.slideTitle}
                                    </h3>
                                    <span className="ml-auto text-[11px] font-mono text-slate-400">
                                        ~{Math.round(s.durationSec)}s
                                    </span>
                                </div>

                                <p className="text-base leading-relaxed text-slate-800 mb-4">
                                    {s.narration}
                                </p>

                                {s.speakerNotes && (
                                    <div className="border-l-2 border-amber-400 bg-amber-50 px-4 py-3 rounded-r">
                                        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-amber-700 mb-1">
                                            Speaker note
                                        </p>
                                        <p className="text-sm leading-relaxed text-slate-700">
                                            {s.speakerNotes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                ))}

                <footer className="mt-16 pt-8 border-t border-slate-200 text-xs text-slate-500">
                    <p>Generated transcript · {SCRIPTS.length} slides · ~{totalMin} minutes total runtime · Fleetora pitch deck</p>
                </footer>
            </article>
        </main>
    );
}
