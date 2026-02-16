"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Menu, Search, Users, LogOut, Home, Activity, BarChart3, Wand2, Upload,
  Cloud, X, Paintbrush, ArrowUpCircle, Eraser, Film, DollarSign,
  Clock, TrendingUp, Sparkles, Palette, Zap, ChevronDown,
  Cpu, Target, Power, Link as LinkIcon, Mail, Sun, Moon
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
// PROMOTION PULSE COMPONENT
// ====================================================================
const PromotionPulse = ({ pulses }) => {
  const channels = [
    { id: 'socialPost', label: 'Social', icon: TrendingUp, color: 'text-pink-400' },
    { id: 'blog', label: 'Search/SEO', icon: Search, color: 'text-blue-400' },
    { id: 'coldEmail', label: 'Email Outreach', icon: Mail, color: 'text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {channels.map(chan => {
        const isActive = pulses.some(p => p.channel === chan.id);
        return (
          <div key={chan.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 flex flex-col items-center justify-center relative overflow-hidden group">
            {isActive && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className={`absolute inset-0 bg-current opacity-10 rounded-full ${chan.color}`}
              />
            )}
            <chan.icon size={24} className={`${chan.color} mb-2 ${isActive ? 'animate-bounce' : 'opacity-40'}`} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{chan.label}</p>
            {isActive && (
              <p className="text-[10px] text-emerald-400 mt-1 font-bold animate-pulse">DEPLOYING...</p>
            )}
          </div>
        );
      })}
    </div>
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
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const router = useRouter();

  const [promoPulses, setPromoPulses] = useState([]);
  const [governance, setGovernance] = useState({
    aiSpeed: 50,
    learningRate: 85,
    killSwitch: false,
    promoThrottle: 100,
    adProof: []
  });

  // Session Check & Data Fetch
  useEffect(() => {
    const session = localStorage.getItem('eliteani_session');
    if (!session) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(session);
    setUser(userData);

    // Load saved theme
    const savedTheme = localStorage.getItem('eliteani_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('light-mode', savedTheme === 'light');

    fetchStats();
    fetchGenerations();

    // Initial pulses fetch
    fetchPulses();

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchStats();
      fetchPulses();
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('eliteani_theme', newTheme);
    document.documentElement.classList.toggle('light-mode', newTheme === 'light');
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        setDbStats(data.stats);
        if (data.governance) setGovernance(data.governance);
      }
    } catch (err) {
      console.error('Stats fetch failed');
    }
  };

  const updateGovernance = async (action, value) => {
    try {
      const res = await fetch('/api/eliteani/governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, value })
      });
      const data = await res.json();
      if (data.success) {
        fetchStats(); // Refresh
      }
    } catch (err) {
      console.error('Governance update failed');
    }
  };

  const fetchGenerations = async () => {
    try {
      const res = await fetch('/api/generations');
      const data = await res.json();
      if (data.success) {
        setGeneratedImages(data.generations.map(g => ({
          url: g.url,
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

  const handleLogout = async () => {
    localStorage.removeItem('eliteani_session');
    await supabase.auth.signOut();
    router.push('/login');
  };

  const activePreset = STYLE_PRESETS.find(p => p.id === selectedPreset);

  return (
    <div className="flex h-screen overflow-hidden text-slate-200 font-sans selection:bg-purple-500/30 bg-slate-950 relative">

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? (typeof window !== 'undefined' && window.innerWidth < 1024 ? '85%' : '280px') : '0px',
          x: sidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0),
          opacity: sidebarOpen ? 1 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? 0 : 1)
        }}
        className={`fixed lg:relative z-50 h-full bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 overflow-hidden ${sidebarOpen ? 'p-6' : 'p-0'}`}
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-black tracking-tighter whitespace-nowrap">EliteAni<span className="text-indigo-500">Core</span></h2>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'create', label: 'Create Magic', icon: Wand2 },
            { id: 'studio', label: 'Studio Editor', icon: Palette },
            { id: 'governance', label: 'Governance', icon: Activity, adminOnly: true },
            { id: 'users', label: 'Users & CRM', icon: Users, adminOnly: true },
            { id: 'pricing', label: 'Revenue Loops', icon: DollarSign },
          ].filter(item => !item.adminOnly || user?.isAdmin).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === item.id
                ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-white border border-indigo-500/30 shadow-lg shadow-indigo-900/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon size={22} className={activeTab === item.id ? "text-indigo-400" : ""} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
              {activeTab === item.id && (
                <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/30">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-400 truncate tracking-tight">{user?.isAdmin ? 'Owner Access' : 'Active User'}</p>
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
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8 custom-scrollbar relative">
          {/* Mobile Header Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-3 bg-slate-900 border border-slate-800 rounded-xl"
            >
              <Menu size={20} />
            </button>
            <div className="font-black text-sm tracking-tighter">ELITEANI CORE</div>
            <button onClick={toggleTheme} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-yellow-400">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-1 capitalize">
                {activeTab} Hub
              </h1>
              <p className="text-slate-400 text-sm font-medium">System status: {governance.killSwitch ? 'HALTED' : 'NOMINAL'}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Search intelligence..."
                  className="pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all w-64"
                />
              </div>
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl border transition-all ${theme === 'light' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-yellow-400 border-slate-800 hover:bg-slate-800'}`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </header>
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
                  {/* Sentinel & ROI Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <GlassCard className="relative overflow-hidden border-indigo-500/30">
                      <div className="absolute top-0 right-0 p-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${dbStats?.governance?.sentinel?.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-blue-500'}`} />
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium text-slate-400">Sentinel AI</p>
                        <Activity size={16} className="text-indigo-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{dbStats?.governance?.sentinel?.status || 'Online'}</div>
                      <p className="text-xs text-indigo-400">Health: {dbStats?.governance?.sentinel?.healthScore || 100}%</p>
                    </GlassCard>

                    {[
                      { label: "Total Revenue", value: dbStats ? `$${(dbStats.revenueToday || 0).toLocaleString()}` : "$0", trend: "Live Tracking", color: "text-emerald-400", icon: DollarSign },
                      { label: "Active Users", value: dbStats?.activeUsers?.toLocaleString() || "0", trend: "Real-time", color: "text-blue-400", icon: Users },
                      { label: "MRR", value: dbStats ? `$${(dbStats.mrr || 0).toLocaleString()}` : "$0", trend: "Subscription Rev", color: "text-purple-400", icon: TrendingUp },
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
              {/* STUDIO EDITOR */}
              {/* ========================================== */}
              {activeTab === 'studio' && (
                <div className="space-y-6">
                  <GlassCard>
                    <h2 className="text-3xl font-bold mb-2">Studio Editor</h2>
                    <p className="text-slate-400 mb-6">Edit and enhance your generated images here.</p>
                    <p className="text-slate-500">Content for Studio Editor coming soon!</p>
                  </GlassCard>
                </div>
              )}

              {/* ========================================== */}
              {/* GOVERNANCE & PROMO ENGINE */}
              {/* ========================================== */}
              {activeTab === 'governance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Neural Core */}
                    <div className="space-y-6">
                      <GlassCard>
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-2xl font-black flex items-center gap-3">
                              <Cpu className="text-indigo-400 w-8 h-8" /> Neural Core
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">Direct orchestration of AI velocity and optimization.</p>
                          </div>
                          <div className={`px-4 py-2 rounded-2xl border transition-all ${governance.killSwitch ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                              <div className={`w-2 h-2 rounded-full animate-pulse ${governance.killSwitch ? 'bg-red-400' : 'bg-emerald-400'}`} />
                              {governance.killSwitch ? 'System Halted' : 'Active'}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6 mb-8">
                          <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <Zap className="text-yellow-400" size={20} />
                                <span className="font-bold text-sm uppercase">AI Speed</span>
                              </div>
                              <span className="text-2xl font-black text-indigo-400">{governance.aiSpeed}%</span>
                            </div>
                            <input
                              type="range"
                              min="0" max="100"
                              value={governance.aiSpeed}
                              onChange={(e) => updateGovernance('set_speed', parseInt(e.target.value))}
                              className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>

                          <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <TrendingUp className="text-emerald-400" size={20} />
                                <span className="font-bold text-sm uppercase">Optimization</span>
                              </div>
                              <span className="text-2xl font-black text-emerald-400">{governance.learningRate}%</span>
                            </div>
                            <input
                              type="range"
                              min="0" max="100"
                              value={governance.learningRate}
                              onChange={(e) => updateGovernance('set_learning', parseInt(e.target.value))}
                              className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => updateGovernance('toggle_killswitch', !governance.killSwitch)}
                          className={`w-full py-4 rounded-2xl font-black text-white transition-all transform active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 ${governance.killSwitch ? 'bg-emerald-600 shadow-emerald-900/40' : 'bg-red-600 shadow-red-900/40'}`}
                        >
                          <Power size={20} /> {governance.killSwitch ? 'Re-Engage Neural Core' : 'Global Emergency Killswitch'}
                        </button>
                      </GlassCard>

                      <GlassCard>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Sparkles className="text-purple-400" /> AI Promo Engine
                        </h3>
                        <PromotionPulse pulses={promoPulses} />
                        <button
                          onClick={handleGeneratePromo}
                          disabled={loading}
                          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold hover:from-purple-500 hover:to-indigo-500 transition shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
                        >
                          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={18} />}
                          Generate Master Promo
                        </button>
                      </GlassCard>
                    </div>

                    {/* Right Column: Proof of Growth & Logs */}
                    <div className="space-y-6">
                      <GlassCard>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Target className="text-blue-400" /> Proof of Growth
                        </h3>
                        <div className="space-y-3">
                          {governance.adProof.map((proof, i) => (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              key={proof.id || i}
                              className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                  <LinkIcon size={14} />
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-white uppercase">{proof.platform}</p>
                                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{proof.type}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-black text-emerald-400 uppercase">{proof.status}</p>
                                <p className="text-[8px] text-slate-600 font-bold">{new Date(proof.timestamp).toLocaleTimeString()}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-bold text-blue-400 uppercase tracking-widest text-xs">Monetization Velocity</p>
                            <span className="text-blue-400 font-bold">Scaling...</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                            <motion.div
                              animate={{ width: ['20%', '95%', '70%'] }}
                              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                              className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                            />
                          </div>
                        </div>
                      </GlassCard>

                      <GlassCard>
                        <h3 className="text-lg font-bold mb-4">Master Audit Logs</h3>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {dbStats?.logs?.length > 0 ? (
                            dbStats.logs.map((log, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg text-xs">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                                  <span className="text-slate-300 uppercase font-bold">{log.action}</span>
                                </div>
                                <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-center py-8 text-slate-500 italic">No activity logs recorded.</p>
                          )}
                        </div>
                      </GlassCard>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Studio Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} onAction={handleStudioAction} />
        )}
      </AnimatePresence>
    </div>
  );
}
