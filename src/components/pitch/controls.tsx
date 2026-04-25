"use client";

import { Play, Pause, Volume2, VolumeX, FileText } from "lucide-react";

interface ControlsProps {
    autoplay: boolean;
    onToggleAutoplay: () => void;
    ttsEnabled: boolean;
    onToggleTTS: () => void;
    isSpeaking: boolean;
    provider: string | null;
}

// ─────────────────────────────────────────────────────────
// Floating controls — bottom-right, above the slide counter.
// ─────────────────────────────────────────────────────────

export function Controls({
    autoplay,
    onToggleAutoplay,
    ttsEnabled,
    onToggleTTS,
    isSpeaking,
    provider,
}: ControlsProps) {
    return (
        <div
            className="absolute bottom-16 right-6 z-40 flex items-center gap-1.5 rounded-full px-2 py-1.5 backdrop-blur-md"
            style={{
                background: "rgba(15,22,38,0.75)",
                border: "1px solid rgba(148,163,184,0.18)",
            }}
        >
            <ControlButton
                label={autoplay ? "Pause autoplay" : "Play autoplay"}
                onClick={onToggleAutoplay}
                active={autoplay}
                accent="#34d399"
            >
                {autoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </ControlButton>

            <Divider />

            <ControlButton
                label={ttsEnabled ? "Mute narration" : "Enable narration"}
                onClick={onToggleTTS}
                active={ttsEnabled}
                accent="#60a5fa"
                pulse={isSpeaking}
            >
                {ttsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </ControlButton>

            <Divider />

            <a
                href="/transcript"
                target="_blank"
                rel="noopener noreferrer"
                title="Open transcript"
                className="flex items-center justify-center w-7 h-7 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
                <FileText className="w-3.5 h-3.5" />
            </a>

            {provider && (
                <span className="text-[8px] font-mono uppercase tracking-[0.18em] text-slate-500 pl-1.5 pr-1">
                    {provider === "sarvam" ? "● sarvam" : "● browser"}
                </span>
            )}
        </div>
    );
}

function ControlButton({
    label,
    onClick,
    active,
    accent,
    pulse,
    children,
}: {
    label: string;
    onClick: () => void;
    active: boolean;
    accent: string;
    pulse?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            title={label}
            aria-label={label}
            className="relative flex items-center justify-center w-7 h-7 rounded-full transition-all hover:scale-110"
            style={{
                background: active ? `${accent}22` : "transparent",
                color: active ? accent : "#94a3b8",
                border: active ? `1px solid ${accent}55` : "1px solid transparent",
            }}
        >
            {children}
            {pulse && (
                <span
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                        boxShadow: `0 0 0 2px ${accent}aa`,
                        animation: "pulse 1.4s ease-in-out infinite",
                    }}
                />
            )}
        </button>
    );
}

function Divider() {
    return <span className="w-px h-4 bg-slate-700/60 mx-0.5" />;
}
