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
