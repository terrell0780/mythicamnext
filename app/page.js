"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Menu, Search, Users, LogOut, Home, Activity, BarChart3, Wand2, Upload,
  Cloud, X, Paintbrush, ArrowUpCircle, Eraser, Film, DollarSign,
  Clock, TrendingUp, Sparkles, Palette, Zap, ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ====================================================================
// STYLE PRESETS DATA
// ====================================================================
const STYLE_PRESETS = [
  { id: 'none', label: 'No Style', icon: '✨', color: 'from-slate-600 to-slate-700', suffix: '' },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: '🌆', color: 'from-cyan-600 to-blue-700', suffix: ', cyberpunk style, neon lights, dark futuristic city, rain, holographic displays, high contrast, dramatic lighting' },
  { id: 'ghibli', label: 'Studio Ghibli', icon: '🌸', color: 'from-green-500 to-emerald-600', suffix: ', Studio Ghibli anime style, soft watercolor, whimsical, hand-painted, Miyazaki inspired, lush nature, warm tones' },
  { id: 'corporate', label: 'Corporate Vector', icon: '📊', color: 'from-blue-500 to-indigo-600', suffix: ', clean corporate vector illustration, flat design, modern business style, minimal, professional, vibrant solid colors' },
  { id: 'photorealism', label: 'Photorealistic', icon: '📷', color: 'from-amber-500 to-orange-600', suffix: ', photorealistic, 8K resolution, ultra detailed, DSLR quality, natural lighting, sharp focus, cinematic' },
  { id: 'anime', label: 'Anime', icon: '⚡', color: 'from-pink-500 to-rose-600', suffix: ', anime style, manga art, vibrant colors, dynamic composition, cel-shaded, Japanese animation' },
  { id: 'oil', label: 'Oil Painting', icon: '🎨', color: 'from-yellow-600 to-amber-700', suffix: ', oil painting style, classical art, rich textures, thick brushstrokes, museum quality, renaissance lighting' },
  { id: 'pixel', label: 'Pixel Art', icon: '👾', color: 'from-violet-500 to-purple-700', suffix: ', pixel art style, retro gaming, 16-bit, low resolution charm, nostalgic, sprite art' },
];

// ====================================================================
// GLASS CARD COMPONENT
// ====================================================================
const GlassCard = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass-panel rounded-2xl p-6 border border-slate-700/50 ${className}`}
  >
    {children}
  </motion.div>
);

// ====================================================================
// IMAGE MODAL (Studio Editor)
// ====================================================================
const ImageModal = ({ image, onClose, onAction }) => {
  const [actionLoading, setActionLoading] = useState(null);

  const handleAction = async (action) => {
    setActionLoading(action);
    await onAction(image, action);
    setActionLoading(null);
  };

  if (!image) return null;

  const actions = [
    { id: 'inpaint', label: 'In-Paint', icon: Paintbrush, desc: 'Edit specific regions', color: 'from-blue-600 to-cyan-600' },
    { id: 'upscale', label: 'Upscale 4x', icon: ArrowUpCircle, desc: 'Enhance to 4K resolution', color: 'from-emerald-600 to-green-600' },
    { id: 'removebg', label: 'Remove BG', icon: Eraser, desc: 'Transparent background', color: 'from-orange-600 to-amber-600' },
    { id: 'animate', label: 'Animate', icon: Film, desc: 'Create motion video', color: 'from-purple-600 to-pink-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Preview */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
          <img src={image.url} alt={image.prompt} className="w-full h-full object-cover aspect-square" />
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/60 rounded-full hover:bg-black/80 transition">
            <X size={20} />
          </button>
        </div>

        {/* Action Panel */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-700/50 flex flex-col">
          <h3 className="text-2xl font-bold text-white mb-1">Studio Editor</h3>
          <p className="text-slate-400 text-sm mb-6 line-clamp-2">{image.prompt}</p>

          <div className="grid grid-cols-1 gap-3 flex-1">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                disabled={actionLoading !== null}
                className={`flex items-center gap-4 p-4 rounded-xl border border-slate-700/40 hover:border-slate-500/60 bg-slate-800/50 hover:bg-slate-700/50 transition-all group ${actionLoading === action.id ? 'ring-2 ring-purple-500' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  {actionLoading === action.id ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <action.icon size={22} className="text-white" />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">{action.label}</p>
                  <p className="text-xs text-slate-400">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs text-emerald-400 flex items-center gap-2">
              <DollarSign size={14} /> Each action saves ~$50 vs. manual designer work
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ====================================================================
// MAIN APP
// ====================================================================
export default function EliteAniCoreApp() {
  // State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [dbStats, setDbStats] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState('none');
  const [selectedImage, setSelectedImage] = useState(null);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Session Check & Data Fetch
  useEffect(() => {
    const session = localStorage.getItem('eliteani_session');
    if (!session) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(session));
    fetchStats();
    fetchGenerations();
  }, [router]);

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

  // ---- Generate Handler (with Style Presets) ----
  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);

    const preset = STYLE_PRESETS.find(p => p.id === selectedPreset);
    const enhancedPrompt = prompt + (preset?.suffix || '');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: enhancedPrompt })
      });

      const data = await res.json();

      if (data.success) {
        setGeneratedImages(prev => [{
          url: data.imageUrl,
          prompt: prompt,
          style: preset?.label || 'None',
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

  // ---- Studio Action Handler ----
  const handleStudioAction = useCallback(async (image, action) => {
    try {
      const res = await fetch('/api/studio/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: image.url, action })
      });
      const data = await res.json();
      if (data.success) {
        alert(`${action.toUpperCase()} Successful: ${data.message}`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Studio action failed');
    }
  }, []);

  // ---- Governance Handlers ----
  const handleGeneratePromo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/eliteani/promo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Scale EliteAniCore to $100k MRR' })
      });
      const data = await res.json();
      alert(data.message || 'Promo generated in queue');
      fetchStats();
    } catch (err) {
      alert('Promo generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeployPromos = async () => {
    try {
      const res = await fetch('/api/eliteani/promo/deploy', { method: 'POST' });
      const data = await res.json();
      alert(data.message || 'All promos deployed');
      fetchStats();
    } catch (err) {
      alert('Deployment failed');
    }
  };

  const toggleKillSwitch = async (enabled) => {
    try {
      const res = await fetch('/api/eliteani/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_kill', enabled })
      });
      const data = await res.json();
      fetchStats();
      alert(`Kill Switch ${enabled ? 'Engaged' : 'Disengaged'}`);
    } catch (err) {
      alert('Failed to toggle kill switch');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('eliteani_session');
    router.push('/login');
  };

  // Current active preset
  const activePreset = STYLE_PRESETS.find(p => p.id === selectedPreset);

  return (
    <div className="flex h-screen overflow-hidden text-slate-200 font-sans selection:bg-purple-500/30">

      {/* ================================================================ */}
      {/* SIDEBAR */}
      {/* ================================================================ */}
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
              EliteAniCore
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
            { id: 'studio', label: 'Studio Editor', icon: Palette },
            { id: 'governance', label: 'Governance', icon: Activity },
            { id: 'users', label: 'Users & CRM', icon: Users },
            { id: 'pricing', label: 'Revenue Loops', icon: DollarSign },
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.isAdmin ? 'Admin' : 'Active User'}</p>
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

      {/* ================================================================ */}
      {/* MAIN CONTENT */}
      {/* ================================================================ */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]" />
        </div>

        {/* Header */}
        <div className="h-20 border-b border-slate-700/30 flex items-center justify-between px-8 z-10 glass bg-opacity-30 backdrop-blur-md">
          <h2 className="text-xl font-bold capitalize">{activeTab === 'create' ? 'Create Magic' : activeTab}</h2>
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

              {/* ========================================== */}
              {/* DASHBOARD (with ROI Metrics) */}
              {/* ========================================== */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* ROI Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { label: "Total Revenue", value: dbStats ? `$${(dbStats.revenueToday || 4230).toLocaleString()}` : "$4,230", trend: "+20.1%", color: "text-emerald-400", icon: DollarSign },
                      { label: "Time Saved", value: "487 hrs", trend: "vs. manual design", color: "text-blue-400", icon: Clock },
                      { label: "Cost / Asset", value: "$0.12", trend: "-94% vs. freelancer", color: "text-purple-400", icon: TrendingUp },
                      { label: "ROI Multiplier", value: "47x", trend: "Return on Investment", color: "text-amber-400", icon: Zap }
                    ].map((stat, i) => (
                      <GlassCard key={i}>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                          <stat.icon size={16} className={stat.color} />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <p className={`text-xs ${stat.color}`}>{stat.trend}</p>
                      </GlassCard>
                    ))}
                  </div>

                  {/* Revenue Chart + ROI Breakdown */}
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

                    {/* ROI Breakdown */}
                    <GlassCard>
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-emerald-400" /> ROI Breakdown
                      </h3>
                      <div className="space-y-5">
                        {[
                          { label: 'Freelancer Cost (Saved)', value: '$23,400', sub: '468 assets × $50 avg', color: 'text-emerald-400' },
                          { label: 'Platform Cost (Spent)', value: '$497', sub: 'Studio tier × 5 months', color: 'text-orange-400' },
                          { label: 'Net Savings', value: '$22,903', sub: '4,609% return', color: 'text-white' },
                          { label: 'Time Recovered', value: '487 hrs', sub: '≈ 12 work weeks', color: 'text-blue-400' },
                        ].map((item, i) => (
                          <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5">
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-slate-400">{item.label}</p>
                              <p className={`font-bold ${item.color}`}>{item.value}</p>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{item.sub}</p>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>
                </div>
              )}

              {/* ========================================== */}
              {/* CREATE MAGIC (with Style Presets) */}
              {/* ========================================== */}
              {activeTab === 'create' && (
                <div className="max-w-4xl mx-auto">
                  <GlassCard className="mb-8 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">Create New Magic</h2>
                    <p className="text-slate-400 mb-6">Transform your ideas into stunning visuals with AI — enhanced by style presets.</p>

                    {/* Style Presets */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Palette size={16} className="text-purple-400" />
                        <span className="text-sm font-medium text-slate-300">Style Preset</span>
                      </div>

                      {/* Preset Selector */}
                      <div className="relative">
                        <button
                          onClick={() => setPresetsOpen(!presetsOpen)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border border-slate-700/50 bg-slate-800/50 hover:bg-slate-700/50 transition`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{activePreset?.icon}</span>
                            <span className="font-medium text-white">{activePreset?.label}</span>
                            {selectedPreset !== 'none' && (
                              <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${activePreset?.color} text-white`}>Active</span>
                            )}
                          </div>
                          <ChevronDown size={18} className={`text-slate-400 transition-transform ${presetsOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {presetsOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-2 z-30 grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900 border border-slate-700/60 shadow-2xl"
                            >
                              {STYLE_PRESETS.map((preset) => (
                                <button
                                  key={preset.id}
                                  onClick={() => { setSelectedPreset(preset.id); setPresetsOpen(false); }}
                                  className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${selectedPreset === preset.id
                                    ? `bg-gradient-to-r ${preset.color} text-white shadow-lg`
                                    : 'bg-slate-800/70 hover:bg-slate-700/70 text-slate-300'
                                    }`}
                                >
                                  <span className="text-lg">{preset.icon}</span>
                                  <span className="text-sm font-medium">{preset.label}</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Prompt Input */}
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative flex gap-4 bg-slate-900 rounded-xl p-2 border border-slate-700/50">
                        <input
                          type="text"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Describe your imagination... (e.g., A cyberpunk city in rain)"
                          className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 px-4 text-lg focus:outline-none"
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

                    {/* Active Preset Indicator */}
                    {selectedPreset !== 'none' && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-slate-500 mt-3 flex items-center gap-2"
                      >
                        <Sparkles size={12} className="text-purple-400" />
                        Style &quot;{activePreset?.label}&quot; will be applied to your prompt automatically
                      </motion.p>
                    )}
                  </GlassCard>

                  {/* Results Grid (Clickable -> Studio Editor) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {generatedImages.map((img, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/50 shadow-2xl cursor-pointer"
                          onClick={() => setSelectedImage(img)}
                        >
                          <img src={img.url} alt={img.prompt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                            <p className="text-white font-medium line-clamp-2">{img.prompt}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-slate-400">{img.date}</p>
                              {img.style && img.style !== 'No Style' && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/20">{img.style}</span>
                              )}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition flex items-center justify-center gap-1.5">
                                <Paintbrush size={12} /> Edit
                              </button>
                              <button className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition flex items-center justify-center gap-1.5">
                                <ArrowUpCircle size={12} /> Upscale
                              </button>
                              <button className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-600/60 to-pink-600/60 hover:from-purple-500/80 hover:to-pink-500/80 text-xs font-medium transition flex items-center justify-center gap-1.5">
                                <Film size={12} /> Animate
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* ========================================== */}
              {/* GOVERNANCE & PROMO ENGINE */}
              {/* ========================================== */}
              {activeTab === 'governance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GlassCard>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Zap className="text-purple-400" /> AI Promo Engine
                      </h3>
                      <p className="text-slate-400 text-sm mb-6">Autonomous orchestration for content distribution and revenue scaling.</p>

                      <div className="space-y-3">
                        <button
                          onClick={handleGeneratePromo}
                          disabled={loading}
                          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold hover:from-purple-500 hover:to-indigo-500 transition shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
                        >
                          <Sparkles size={18} /> Generate Master Promo
                        </button>
                        <button
                          onClick={handleDeployPromos}
                          className="w-full py-4 bg-slate-800 border border-slate-700/50 rounded-xl font-bold hover:bg-slate-700 transition flex items-center justify-center gap-2"
                        >
                          <Cloud size={18} /> Deploy To All Channels
                        </button>
                      </div>
                    </GlassCard>

                    <GlassCard>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Activity className="text-red-400" /> System Governance
                      </h3>
                      <p className="text-slate-400 text-sm mb-6">Master controls for system operation and emergency protocols.</p>

                      <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl mb-4">
                        <div>
                          <p className="font-bold text-red-400 uppercase tracking-widest text-xs">Emergency Kill-Switch</p>
                          <p className="text-slate-400 text-xs mt-1">Halt all AI generation & payments globally</p>
                        </div>
                        <button
                          onClick={() => toggleKillSwitch(!dbStats?.killSwitch)}
                          className={`w-14 h-8 rounded-full relative transition-colors ${dbStats?.killSwitch ? 'bg-red-600' : 'bg-slate-700'}`}
                        >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${dbStats?.killSwitch ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>

                      <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-bold text-blue-400 uppercase tracking-widest text-xs">Promo Throttle</p>
                          <span className="text-blue-400 font-bold">{dbStats?.promoThrottle || 150}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-blue-500" style={{ width: `${(dbStats?.promoThrottle || 150) / 1.5}%` }} />
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                  {/* System Logs */}
                  <GlassCard>
                    <h3 className="text-lg font-bold mb-4">Master Audit Logs</h3>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {dbStats?.logs?.length > 0 ? (
                        dbStats.logs.map((log, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg text-xs">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-purple-500" />
                              <span className="text-slate-300 uppercase font-bold">{log.action}</span>
                            </div>
                            <span className="text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-8 text-slate-500">No recent activity logged</p>
                      )}
                    </div>
                  </GlassCard>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ================================================================ */}
      {/* IMAGE MODAL (Studio Editor Overlay) */}
      {/* ================================================================ */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
            onAction={handleStudioAction}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
