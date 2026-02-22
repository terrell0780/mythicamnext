"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Target, Globe, ShieldCheck, TrendingUp, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-3xl rounded-full opacity-50 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
                            System Intelligence <br /> <span className="text-indigo-500">Redefined.</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed mb-10">
                            EliteAniCore is the world's first autonomous growth engine designed to orchestrate revenue, ranking, and engagement with zero human intervention.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/login" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition shadow-lg">
                                Enter the Dashboard
                            </Link>
                            <Link href="/pricing" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition">
                                View Tiers
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Core Mission */}
            <section className="py-24 bg-gray-900/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[{
                            icon: Target,
                            title: "Top 3 Ranking",
                            desc: "Our Neural Core autonomously optimizes SEO and social signals to push your platform into the Top 3 globally.",
                            color: "indigo"
                        },{
                            icon: TrendingUp,
                            title: "Revenue Scaling",
                            desc: "Real-time monetization loops identify high-yield opportunities to maximize MRR and LTV.",
                            color: "emerald"
                        },{
                            icon: ShieldCheck,
                            title: "Neural Security",
                            desc: "Self-healing codebases ensure your income stream never halts, even during global volatility.",
                            color: "purple"
                        }].map((item, i) => (
                            <div key={i} className="space-y-4">
                                <div className={`w-12 h-12 bg-${item.color}-500/20 rounded-2xl flex items-center justify-center text-${item.color}-400`}>
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Intelligence Section */}
            <section className="py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                                Real-World <br /> <span className="text-indigo-500">Autonomous Growth.</span>
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                Unlike traditional SaaS, EliteAniCore doesn't just provide tools—it executes 24/7 to secure your market position.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { title: "Quantum Core Speed", desc: "Deployment at the speed of thought." },
                                    { title: "Legal Compliance", desc: "Operating within global regulatory frameworks." },
                                    { title: "No Placeholders", desc: "Pure, data-driven revenue generation." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-white/5 bg-white/5">
                                        <div className="mt-1 text-indigo-400"><Zap size={18} /></div>
                                        <div>
                                            <p className="font-bold text-sm text-white">{item.title}</p>
                                            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-black">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                            <div className="relative bg-gray-900/50 p-8 rounded-3xl border border-white/10 shadow-lg">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
                                                <Cpu className="text-white" size={20} />
                                            </div>
                                            <span className="font-black uppercase tracking-widest text-xs">Neural Audit</span>
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full">ACTIVE</div>
                                    </div>
                                    <div className="h-40 bg-gray-950/50 rounded-2xl border border-white/5 overflow-hidden flex items-end p-4">
                                        <div className="flex-1 flex gap-1 items-end">
                                            {[40, 70, 45, 90, 65, 80, 50, 95, 30].map((h, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ delay: i * 0.1, duration: 1 }}
                                                    className="flex-1 bg-indigo-500 rounded-t-sm"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Success Rate</p>
                                            <p className="text-xl font-black text-white">99.8%</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Scaling Velocity</p>
                                            <p className="text-xl font-black text-white">100x</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer / CTA */}
            <section className="py-24 text-center border-t border-white/5 bg-gray-900/20">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-black mb-8">Ready to Scale to the <span className="text-indigo-500">Top?</span></h2>
                    <Link href="/login" className="px-12 py-5 bg-white text-gray-950 font-black rounded-2xl hover:scale-105 transition shadow-lg">
                        Initialize System Connection
                    </Link>
                    <p className="mt-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                        Autonomous Intelligence Framework v2.0
                    </p>
                </div>
            </section>
        </div>
    );
}
