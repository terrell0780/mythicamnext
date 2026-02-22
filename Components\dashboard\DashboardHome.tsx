"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Globe, Zap, CreditCard, Activity, ArrowUpRight, Shield, Clock, TrendingUp, Users, Cpu } from 'lucide-react';
import Link from 'next/link';

export const DashboardHome: React.FC = () => {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);

  const stats = [
    { label: "Net Revenue (7d)", val: "$28,492", change: "+14.2%", icon: <TrendingUp className="w-4 h-4" /> },
    { label: "Active Pipelines", val: "12", change: "+2", icon: <Zap className="w-4 h-4" /> },
    { label: "Reach (Global)", val: "1.2M", change: "+24k", icon: <Users className="w-4 h-4" /> },
    { label: "Security Health", val: "99.9%", change: "Stable", icon: <Shield className="w-4 h-4" /> }
  ];

  const platforms = [
    { name: 'YouTube', handle: '@AntiGravityHQ', status: 'Syncing', rev: '$12,400' },
    { name: 'TikTok', handle: 'antigrav_core', status: 'Active', rev: '$8,293' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Core Intelligence</h1>
          <p className="text-white/40 text-sm">
            Status: Fully Autonomous // <span className="ml-1 opacity-70">{date || 'LOADING...'}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition">
            <Clock className="w-4 h-4" /> Export Report
          </button>
          <button className="px-5 py-2.5 bg-primary text-base-950 rounded-xl text-sm font-bold flex items-center gap-2 hover:shadow-lg transition-all">
            <Zap className="w-4 h-4" /> Trigger Sync
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
            <div className="flex justify-between items-center mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">{stat.icon}</div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${i === 3 ? 'bg-green-500/10 text-green-400' : 'bg-primary/10 text-primary'}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{stat.label}</div>
            <div className="text-2xl font-bold">{stat.val}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="h-80 rounded-2xl bg-white/5 border border-white/5 p-8 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Revenue Velocity
          </h3>
          <div className="flex gap-2">
            {["1D", "1W", "1M", "1Y"].map((t) => (
              <button key={t} className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition ${t === "1W" ? 'bg-primary/10 border-primary text-primary' : 'border-white/10 text-white/40 hover:text-white'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex items-end justify-between gap-3">
          {[40, 60, 45, 90, 75, 85, 55, 100, 80, 65, 45, 70].map((h, i) => (
            <div key={i} className="flex-1 group relative">
              <div className="w-full bg-primary/30 rounded-t-lg group-hover:bg-primary transition cursor-pointer" style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Managed Platforms */}
      <div className="space-y-4">
        <h3 className="font-bold">Managed Platform Identity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {platforms.map((p, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/10 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-lg">{p.name[0]}</div>
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

      {/* Google + Apple Login */}
      <div className="rounded-2xl bg-white/5 border border-white/5 p-6 flex flex-col items-center gap-4">
        <h3 className="text-lg font-bold">Quick Connect</h3>
        <button className="w-full flex items-center justify-center gap-3 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-bold">
          <span>Connect Google</span>
        </button>
        <button className="w-full flex items-center justify-center gap-3 py-3 bg-black hover:bg-gray-800 rounded-xl text-white font-bold">
          <span>Connect Apple</span>
        </button>
        <p className="text-[10px] text-white/40 mt-2">Connect to quickly sync your accounts and data.</p>
      </div>
    </div>
  );
};
