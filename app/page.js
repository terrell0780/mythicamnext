"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Menu, Bell, Settings, Search, AlertCircle, Users, LogOut,
  Eye, EyeOff, ArrowLeft, Home, Activity, BarChart3, Wand2, Upload, Cloud
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// --- Components ---

const GlassCard = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass-panel rounded-2xl p-6 border border-slate-700/50 ${className}`}
  >
    {children}
  </motion.div>
);

// --- Main App ---

export default function MythicamApp() {
  // State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [studioFiles, setStudioFiles] = useState([]);
  const [dbStats, setDbStats] = useState(null);
  const router = useRouter();

  // Fetch Data on Load
  useEffect(() => {
    fetchStats();
    fetchGenerations();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) setDbStats(data.stats);
    } catch (err) {
      console.error('Stats fetch failed');
    }
  };

  const fetchGenerations = async () => {
    try {
      const res = await fetch('/api/generations');
      const data = await res.json();
      if (data.success) {
        setGeneratedImages(data.generations.map(g => ({
          url: g.image_url,
          prompt: g.prompt,
          date: new Date(g.created_at).toLocaleTimeString()
        })));
      }
    } catch (err) {
      console.error('Generations fetch failed');
    }
  };

  // Mock Data for Charts
  const revenueData = [
    { name: 'Mon', revenue: 4000, users: 2400 },
    { name: 'Tue', revenue: 3000, users: 1398 },
    { name: 'Wed', revenue: 2000, users: 9800 },
    { name: 'Thu', revenue: 2780, users: 3908 },
    { name: 'Fri', revenue: 1890, users: 4800 },
    { name: 'Sat', revenue: 2390, users: 3800 },
    { name: 'Sun', revenue: 3490, users: 4300 },
  ];

  // Handlers
  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();

      if (data.success) {
        setGeneratedImages(prev => [{
          url: data.imageUrl,
          prompt: prompt,
          date: new Date().toLocaleTimeString()
        }, ...prev]);
        setPrompt('');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden text-slate-200 font-sans selection:bg-purple-500/30">

      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="glass border-r border-slate-700/50 flex flex-col z-20"
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            >
              MYTHICAM
            </motion.h1>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg transition">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'create', label: 'Create Magic', icon: Wand2 },
            { id: 'studio', label: 'Studio', icon: Cloud },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === item.id
                ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-white border border-purple-500/30 shadow-lg shadow-purple-900/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon size={22} className={activeTab === item.id ? "text-purple-400" : ""} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
              {activeTab === item.id && (
                <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-8 bg-purple-500 rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/30">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold">T</div>
            {sidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">Terrell</p>
                <p className="text-xs text-slate-400 truncate">Admin</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="text-sm font-medium">Log Out</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]" />
        </div>

        {/* Header */}
        <div className="h-20 border-b border-slate-700/30 flex items-center justify-between px-8 z-10 glass bg-opacity-30 backdrop-blur-md">
          <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg bg-black/20 border border-white/10 text-sm focus:outline-none focus:border-purple-500/50 transition w-64"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 z-10 scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-7xl mx-auto"
            >

              {/* DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { label: "Total Revenue", value: dbStats ? `$${dbStats.revenue_today.toLocaleString()}` : "$0", trend: "+20.1%", color: "text-emerald-400" },
                      { label: "Active Users", value: dbStats ? dbStats.active_users.toLocaleString() : "0", trend: "+180.1%", color: "text-blue-400" },
                      { label: "Generations", value: generatedImages.length.toLocaleString(), trend: "+19%", color: "text-purple-400" },
                      { label: "GPU Usage", value: dbStats ? `${dbStats.gpu_usage}%` : "0%", trend: "Optimized", color: "text-orange-400" }
                    ].map((stat, i) => (
                      <GlassCard key={i}>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                          <Activity size={16} className="text-slate-500" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <p className={`text-xs ${stat.color}`}>{stat.trend}</p>
                      </GlassCard>
                    ))}
                  </div>

                  {/* Main Chart */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <GlassCard className="lg:col-span-2 min-h-[400px]">
                      <h3 className="text-lg font-semibold mb-6">Revenue Overview</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#e2e8f0' }}
                          />
                          <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[4, 4, 0, 0]} />
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </GlassCard>

                    <GlassCard>
                      <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition border border-transparent hover:border-white/5">
                            <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center">
                              <Users size={16} className="text-slate-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">New user registered</p>
                              <p className="text-xs text-slate-500">2 minutes ago</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>
                </div>
              )}

              {/* CREATE MAGIC */}
              {activeTab === 'create' && (
                <div className="max-w-4xl mx-auto">
                  <GlassCard className="mb-8 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">Create New Magic</h2>
                    <p className="text-slate-400 mb-8">Transform your ideas into stunning visuals with our advanced AI engine.</p>

                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative flex gap-4 bg-slate-900 rounded-xl p-2 border border-slate-700/50">
                        <input
                          type="text"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Describe your imagination... (e.g., A cyberpunk city in rain)"
                          className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 px-4 text-lg"
                          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <button
                          onClick={handleGenerate}
                          disabled={loading}
                          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-900/40 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Wand2 size={18} /> Generate
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Results Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {generatedImages.map((img, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/50 shadow-2xl"
                        >
                          <img src={img.url} alt={img.prompt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                            <p className="text-white font-medium line-clamp-2">{img.prompt}</p>
                            <p className="text-xs text-slate-400 mt-2">{img.date}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* STUDIO */}
              {activeTab === 'studio' && (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-slate-700/50 rounded-3xl p-16 text-center hover:border-purple-500/50 hover:bg-slate-800/30 transition-all cursor-pointer group">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-black/20">
                      <Upload className="text-purple-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Upload Assets</h3>
                    <p className="text-slate-400">Drag & Drop files here or click to browse</p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
