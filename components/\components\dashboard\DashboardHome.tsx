"use client";

import React from 'react';
import { LayoutDashboard, Globe, Zap, CreditCard, Activity, ArrowUpRight, Shield, Clock, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardHome: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Welcome Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter mb-2">Core Intelligence</h1>
                    <p className="text-white/40">
                        Status: Fully Autonomous //
                        <span className="ml-1 opacity-70">
                            {typeof window !== 'undefined' ? new Date().toLocaleDateString() : 'LOADING...'}
                        </span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-colors">
                        <Clock className="w-4 h-4" /> Export Report
                    </button>
                    <button className="px-5 py-2.5 bg-primary text-base-950 rounded-xl text-sm font-bold flex items-center gap-2 hover:shadow-[0_0_30px_-5px_oklch(0.6_0.18_260)] transition-all">
                        <Zap className="w-4 h-4" /> Trigger Sync
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
                {[
                    { label: "Net Revenue (7d)", val: "$28,492", change: "+14.2%", icon: <TrendingUp className="w-4 h-4" /> },
                    { label: "Active Pipelines", val: "12", change: "+2", icon: <Zap className="w-4 h-4" /> },
                    { label: "Reach (Global)", val: "1.2M", change: "+24k", icon: <Users className="w-4 h-4" /> },
                    { icon: <Shield className="w-4 h-4" />, label: "Security Health", val: "99.9%", change: "Stable" }
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                        <div className="flex justify-between items-center mb-2">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                                {stat.icon}
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${i === 3 ? 'bg-green-500/10 text-green-400' : 'bg-primary/10 text-primary'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{stat.label}</div>
                        <div className="text-2xl font-bold">{stat.val}</div>
                    </div>
                ))}
            </div>

            {/* Main Charts & Lists */}
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-8">
                    {/* Revenue Chart Placeholder */}
                    <div className="h-80 rounded-2xl bg-white/5 border border-white/5 p-8 flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" /> Revenue Velocity
                            </h3>
                            <div className="flex gap-2">
                                {['1D', '1W', '1M', '1Y'].map((t) => (
                                    <button key={t} className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-colors ${t === '1W' ? 'bg-primary/10 border-primary text-primary' : 'border-white/5 text-white/20 hover:text-white'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 flex items-end justify-between gap-4">
                            {[40, 60, 45, 90, 75, 85, 55, 100, 80, 65, 45, 70].map((h, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white text-base-950 text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        ${(h * 120).toLocaleString()}
                                    </div>
                                    <div className="w-full bg-primary/20 rounded-t-lg group-hover:bg-primary transition-colors cursor-pointer" style={{ height: `${h}%` }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Platform Performance */}
                    <div className="space-y-4">
                        <h3 className="font-bold">Managed Platform Identity</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { name: 'YouTube', handle: '@AntiGravityHQ', status: 'Syncing', rev: '$12,400' },
                                { name: 'TikTok', handle: 'antigrav_core', status: 'Active', rev: '$8,293' }
                            ].map((p, i) => (
                                <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-lg">
                                            {p.name[0]}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">{p.name}</div>
                                            <div className="text-[10px] text-white/40">{p.handle}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-mono font-bold text-primary">{p.rev}</div>
                                        <div className="text-[10px] text-green-400 uppercase font-bold tracking-widest">{p.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-span-4 space-y-8">
                    <div className="rounded-2xl bg-primary/10 border border-primary/20 p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Deep Memory Enclave</h3>
                        <p className="text-xs text-white/50 mb-8 leading-relaxed">
                            Autonomous logs are being written to the blockchain layer. Security session is active.
                        </p>
                        <button className="w-full py-3 bg-primary text-base-950 rounded-xl text-sm font-bold">
                            VIEW AUDIT LOGS
                        </button>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/5 p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold">Monetization Rails</h3>
                            <CreditCard className="w-4 h-4 text-primary" />
                        </div>
                        <div className="space-y-3">
                            {[
                                { method: 'Stripe Connect', status: 'ACTIVE' },
                                { method: 'ACH / Direct Deposit', status: 'READY' },
                                { method: 'E-Transfer (CAD)', status: 'LOCKED' }
                            ].map((m, i) => (
                                <div key={i} className="flex justify-between items-center text-[10px] font-bold">
                                    <span className="text-white/40 uppercase tracking-widest">{m.method}</span>
                                    <span className="text-primary font-mono">{m.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/5 p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold">Legal Governance</h3>
                            <Shield className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Google Ecosystem Rules', status: 'COMPLIANT' },
                                { label: 'ToS Guardrail v2', status: 'ACTIVE' },
                                { label: 'Fraud Detection Core', status: 'SCANNING' }
                            ].map((l, i) => (
                                <div key={i} className="flex justify-between items-center text-[10px] font-bold">
                                    <span className="text-white/40 uppercase tracking-widest">{l.label}</span>
                                    <span className="text-green-400 font-mono">{l.status}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-2 border-t border-white/5">
                            <p className="text-[9px] text-white/20 italic leading-tight">
                                "Strict adherence to official platform policies. Zero synthetic traffic enforced."
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/5 p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold">Recent Payouts</h3>
                            <ArrowUpRight className="w-4 h-4 text-white/30" />
                        </div>
                        <div className="space-y-4">
                            {[
                                { date: 'Jan 28', amt: '$4,280.00', status: 'COMPLETED' },
                                { date: 'Jan 21', amt: '$3,920.50', status: 'COMPLETED' },
                                { date: 'Jan 14', amt: '$4,100.00', status: 'COMPLETED' }
                            ].map((p, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <div className="text-xs font-bold">{p.date}, 2026</div>
                                        <div className="text-[10px] text-green-400 font-bold">{p.status}</div>
                                    </div>
                                    <div className="text-sm font-mono font-bold">{p.amt}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
