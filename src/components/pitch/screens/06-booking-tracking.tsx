"use client";

import { motion } from "framer-motion";

export function BookingTrackingScreen() {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-widest uppercase text-blue-600 mb-4">Booking Detail</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-slate-900 text-center tracking-tight mb-3">Live GPS Tracking</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base text-slate-500 text-center mb-10 max-w-lg">Every checked-out vehicle, on the map, in real time. Speed, heading, fuel — continuously updating.</motion.p>

            <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.3 }} className="w-full max-w-4xl rounded-2xl border border-slate-200 overflow-hidden bg-white" style={{ boxShadow: "0 25px 80px -15px rgba(0,0,0,0.08)" }}>
                <div className="grid grid-cols-3 h-[420px]">
                    {/* Map area */}
                    <div className="col-span-2 bg-slate-100 relative overflow-hidden">
                        {/* Fake map grid */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                        {/* Roads */}
                        <svg className="absolute inset-0 w-full h-full opacity-20">
                            <path d="M0 200 Q150 180 300 210 Q450 240 600 200" stroke="#64748b" fill="none" strokeWidth="3" />
                            <path d="M200 0 Q220 150 180 300 Q160 400 200 500" stroke="#64748b" fill="none" strokeWidth="3" />
                        </svg>
                        {/* Vehicle pin */}
                        <motion.div className="absolute" style={{ left: "55%", top: "45%" }} animate={{ x: [0, 5, 0], y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                            <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2L4 14h5l-1 8 8-12h-5l1-8z" /></svg>
                            </div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600/30 rounded-full animate-ping" />
                        </motion.div>
                        {/* Geo-fence */}
                        <motion.div className="absolute border-2 border-dashed border-blue-400/30 rounded-lg" style={{ left: "15%", top: "20%", width: "70%", height: "60%" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                            <span className="absolute -top-5 left-2 text-[9px] text-blue-400 font-medium">Operating Zone</span>
                        </motion.div>
                    </div>
                    {/* Telemetry panel */}
                    <div className="border-l border-slate-200 p-4 flex flex-col gap-4">
                        <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Vehicle</p>
                            <p className="text-sm font-bold text-slate-900 mt-1">Tucson HSE</p>
                            <p className="text-xs text-slate-400">ABC-1234 • Airport</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Customer</p>
                            <p className="text-sm font-medium text-slate-900 mt-1">Ahmad Khalil</p>
                            <p className="text-xs text-slate-400">Corp: Fleet Corp</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Speed", value: "82 km/h", icon: "🏎" },
                                { label: "Heading", value: "NW", icon: "🧭" },
                                { label: "Fuel", value: "67%", icon: "⛽" },
                                { label: "Trip km", value: "142", icon: "📏" },
                            ].map((t, i) => (
                                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }} className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                                    <p className="text-[8px] text-slate-400 uppercase">{t.label}</p>
                                    <p className="text-sm font-bold text-slate-900 mt-0.5">{t.icon} {t.value}</p>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-auto">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-1">Last Updated</p>
                            <motion.p className="text-xs text-emerald-600 font-medium" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }}>● Live — 3s ago</motion.p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
