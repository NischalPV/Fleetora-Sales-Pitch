"use client";

import { motion } from "framer-motion";
import { useInView } from "../shared/use-in-view";

const LINES = [
    { text: "It\u2019s Tuesday afternoon.", className: "text-3xl md:text-5xl font-semibold text-slate-900" },
    { text: "Your busiest branch just turned away 3 customers. Meanwhile, 4 cars sit idle across town. Nobody knows.", className: "text-xl md:text-2xl text-slate-600 max-w-2xl" },
    { text: "A walk-in at the counter has been waiting 20 minutes. Paper contract. Phone calls to verify credit.", className: "text-xl md:text-2xl text-slate-600 max-w-2xl" },
    { text: "A corporate account is over-limit. The shared spreadsheet says otherwise.", className: "text-xl md:text-2xl text-slate-600 max-w-2xl" },
    { text: "Your cheapest SUV is in the workshop. Nobody noticed it was due for service.", className: "text-xl md:text-2xl text-slate-600 max-w-2xl" },
    { text: "\u2018Send two Tucsons to Airport tomorrow.\u2019 WhatsApp message. No trail. No tracking.", className: "text-xl md:text-2xl text-slate-600 max-w-2xl" },
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
