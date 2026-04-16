"use client";

import { useEffect, useState } from "react";
import { useSpring, useMotionValue } from "framer-motion";

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
