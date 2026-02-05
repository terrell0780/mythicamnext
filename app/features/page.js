"use client";

import React from "react";
import {
    Zap, Shield, Globe, Cpu, BarChart3, MessageSquare,
    Settings, Lock, Repeat, Database
} from "lucide-react";
import Link from "next/link";

const features = [
    {
        title: "Autonomous Logistics",
        desc: "Self-routing data flows that prioritize high-yield nodes automatically.",
        icon: Zap,
        color: "text-yellow-400"
    },
    {
        title: "Sentiment Calibration",
        desc: "AI-driven tone adjustment across all customer touchpoints for maximum retention.",
        icon: MessageSquare,
        color: "text-blue-400"
    },
    {
        title: "Risk Orchestration",
        desc: "Proactive bottleneck detection and self-healing error protocols.",
        icon: Shield,
        color: "text-emerald-400"
    },
    {
        title: "Yield Maximization",
        desc: "Continuous A/B testing of pricing and offers across 10+ monetization vectors.",
        icon: BarChart3,
        color: "text-purple-400"
    },
    {
        title: "Global Distribution",
        desc: "Platform-agnostic execution across web, mobile, SaaS, and internal tools.",
        icon: Globe,
        color: "text-cyan-400"
    },
    {
        title: "Neural Optimization",
        desc: "Deep-learning models that update growth strategies in milliseconds.",
        icon: Cpu,
        color: "text-red-400"
    }
];

export default function Features() {
    return (
        <div className="min-h-screen bg-surface-950 py-24 px-6 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm font-medium mb-6">
                        <Repeat className="w-4 h-4" /> <span>Core Capabilities</span>
                    </div>
                    <h1 className="text-6xl font-extrabold mb-6">Platform <span className="gradient-text">Core</span></h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        The fundamental modules that drive the MythiCorCam autonomous ecosystem, optimized for zero-friction scale.
                    </p>
                    <div className="mt-10">
                        <Link href="/" className="text-blue-400 hover:text-blue-300 font-medium transition flex items-center justify-center gap-2">
                            ← Return to Intelligence Hub
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="glass-card p-12 rounded-[40px] group hover:bg-blue-600/5 transition-all duration-500 cursor-default">
                            <div className={`p-5 rounded-[24px] bg-white/5 w-fit mb-8 group-hover:scale-110 transition-transform ${f.color}`}>
                                <f.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-32 relative">
                    <div className="absolute inset-0 bg-blue-500/10 blur-[150px] -z-10"></div>
                    <div className="glass-card p-12 md:p-20 rounded-[60px] flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black leading-tight">
                                Designed for <br />
                                <span className="text-blue-400 uppercase tracking-tighter">Zero-Touch</span> <br />
                                Operation.
                            </h2>
                            <p className="text-xl text-slate-400 leading-relaxed">
                                Our features are not tools for humans—they are subsystems for the orchestrator. They function independently to stabilize the growth cycle without requiring manual intervention.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center gap-3">
                                    <Lock className="text-emerald-400" /> <span className="font-bold">Encrypted Logic</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Database className="text-blue-400" /> <span className="font-bold">Distributed Storage</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/3">
                            <div className="aspect-square rounded-[40px] bg-gradient-to-br from-blue-600 to-cyan-400 p-1 flex items-center justify-center relative group">
                                <div className="absolute inset-2 bg-slate-950 rounded-[36px] flex items-center justify-center transition-all duration-700 group-hover:inset-1">
                                    <div className="text-center">
                                        <div className="text-6xl font-black mb-2">99.9<span className="text-blue-400 text-4xl">%</span></div>
                                        <div className="text-slate-500 font-bold uppercase tracking-widest text-sm">Autonomy Index</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
