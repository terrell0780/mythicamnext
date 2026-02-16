import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Menu, Bell, Settings, Search, AlertCircle, Users, LogOut, Eye, EyeOff, ArrowLeft, Home, Activity, BarChart3 } from 'lucide-react';

// Trusted IPs that bypass login
import { api } from './api';

// Trusted IPs that bypass login
const TRUSTED_HOSTS = ['localhost', '127.0.0.1', '192.168.101.136'];

const MythicamApp = () => {
    const isTrustedIP = TRUSTED_HOSTS.includes(window.location.hostname);

    // State management
    const [currentPage, setCurrentPage] = useState(isTrustedIP ? 'dashboard' : 'login');
    const [darkMode, setDarkMode] = useState(true);
    const [isAdmin, setIsAdmin] = useState(isTrustedIP);
    const [userEmail, setUserEmail] = useState(isTrustedIP ? 'terrell0780@gmail.com' : '');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPw, setShowForgotPw] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    // adminPin removed as it's not needed for client-side validaton anymore
    const [showPinSettings, setShowPinSettings] = useState(false);
    const [newPin, setNewPin] = useState('');
    const [error, setError] = useState('');
    const [selectedNav, setSelectedNav] = useState('dashboard');
    const [loading, setLoading] = useState(false);

    // Data state
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [tierData, setTierData] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [studioFiles, setStudioFiles] = useState([]);

    // Fetch Dashboard Data
    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsData, chartsData, activityData] = await Promise.all([
                api.getStats(),
                api.getCharts(),
                api.getActivity()
            ]);
            setStats(statsData);
            setChartData(chartsData.revenue.map((item, i) => ({ ...item, users: chartsData.users[i].value })));
            setTierData(chartsData.tierDistribution);
            setRecentActivity(activityData);
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Users (lazy load)
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    // Effect to load initial data if already logged in (e.g. trusted IP)
    React.useEffect(() => {
        if (currentPage === 'dashboard') {
            fetchDashboardData();
        }
    }, [currentPage]);

    // Effect to load users when tab changes
    React.useEffect(() => {
        if (selectedNav === 'users') {
            fetchUsers();
        }
    }, [selectedNav]);


    // Theme styles
    const bg = darkMode ? 'bg-slate-950' : 'bg-white';
    const bgCard = darkMode ? 'bg-slate-900' : 'bg-slate-50';
    const textPrimary = darkMode ? 'text-white' : 'text-slate-900';
    const textSecondary = darkMode ? 'text-slate-400' : 'text-slate-600';
    const borderColor = darkMode ? 'border-slate-800' : 'border-slate-200';

    // Handler functions
    const handleEmailLogin = async () => {
        setError('');
        if (!loginEmail || !loginPassword) {
            setError('Email and password required');
            return;
        }

        try {
            const result = await api.login(loginEmail, loginPassword);
            if (result.success) {
                setUserEmail(result.user.email);
                setIsAdmin(result.user.isAdmin);
                setCurrentPage('dashboard');
                setLoginEmail('');
                setLoginPassword('');
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    const handleChangePin = async () => {
        setError('');
        if (!newPin || newPin.length < 4) {
            setError('PIN must be at least 4 characters');
            return;
        }
        try {
            const result = await api.changePin(newPin);
            if (result.success) {
                setNewPin('');
                setShowPinSettings(false);
                alert('PIN changed successfully');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to change PIN');
        }
    };

    // Studio Drag & Drop Handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    const handleFiles = (files) => {
        const newFiles = files.map(file => ({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            type: file.type,
            url: URL.createObjectURL(file), // Preview
            status: 'Uploading...'
        }));

        setStudioFiles(prev => [...newFiles, ...prev]);

        // Simulate upload for each file
        newFiles.forEach((file, index) => {
            setTimeout(() => {
                setStudioFiles(prev => prev.map(f =>
                    f.name === file.name ? { ...f, status: 'Completed' } : f
                ));
            }, 1500 + index * 500);
        });
    };

    const handleLogout = () => {
        try {
            setCurrentPage('login');
            setUserEmail('');
            setIsAdmin(false);
            setError('');
            // Reset data
            setStats(null);
            setUsers([]);
        } catch (err) {
            setError('Logout failed');
        }
    };

    const handleGenerateCheck = async (prompt) => {
        if (!prompt) return;
        setLoading(true);
        try {
            const result = await api.generateImage(prompt);
            if (result.success) {
                setStudioFiles(prev => [{
                    name: prompt,
                    url: result.imageUrl,
                    type: 'image/png',
                    size: '1024x1024',
                    status: 'Completed',
                    isGenerated: true
                }, ...prev]);
            } else {
                alert('Generation failed: ' + result.message);
            }
        } catch (e) {
            alert('Error creating magic');
        } finally {
            setLoading(false);
        }
    };

    // Logout Page
    if (currentPage === 'login') {
        // ... (login code remains same, skipping specific lines inside)
        return (
            <div className={`flex items-center justify-center min-h-screen ${bg}`}>
                <div className={`${bgCard} p-10 rounded-2xl border ${borderColor} w-full max-w-md shadow-2xl`}>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2 text-center">MYTHICAM</h1>
                    <p className={`text-center ${textSecondary} mb-8`}>AI Content Creation Platform</p>

                    {!showForgotPw ? (
                        <div className="space-y-4">
                            {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
                            <input
                                type="email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                placeholder="Email"
                                className={`w-full px-4 py-3 rounded-lg ${bgCard} border ${borderColor} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    placeholder="PIN / Password"
                                    className={`w-full px-4 py-3 rounded-lg ${bgCard} border ${borderColor} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                />
                                <button onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-3 ${textSecondary}`}>
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <button
                                onClick={handleEmailLogin}
                                disabled={loading}
                                className={`w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition font-semibold text-white ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                            <button onClick={() => setShowForgotPw(true)} className="w-full text-sm text-blue-400 hover:text-blue-300 py-2">Forgot password?</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
                            <button onClick={() => setShowForgotPw(false)} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"><ArrowLeft size={18} /> Back</button>
                            <input
                                type="email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                placeholder="your@email.com"
                                className={`w-full px-4 py-3 rounded-lg ${bgCard} border ${borderColor} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                            <button onClick={() => setError('✅ Reset link sent to ' + forgotEmail)} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition font-semibold text-white">Send Reset Link</button>
                        </div>
                    )}

                    <button onClick={() => setDarkMode(!darkMode)} className={`w-full mt-6 py-2 border ${borderColor} rounded-lg hover:bg-slate-800 transition text-sm`}>
                        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                </div>
            </div>
        );
    }

    // Access Denied
    if (currentPage === 'dashboard' && !isAdmin) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${bg}`}>
                <div className={`${bgCard} p-8 rounded-xl border ${borderColor} max-w-md text-center`}>
                    <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                    <h1 className={`text-2xl font-bold ${textPrimary} mb-2`}>Access Denied</h1>
                    <p className={`${textSecondary} mb-6`}>Only admins can access this dashboard.</p>
                    <button onClick={handleLogout} className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition">Logout</button>
                </div>
            </div>
        );
    }

    // Admin Dashboard
    return (
        <div className={`flex h-screen ${bg}`}>
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} ${bgCard} border-r ${borderColor} transition-all duration-300 flex flex-col`}>
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    {sidebarOpen && <h1 className="text-xl font-black text-purple-400">MYTHICAM</h1>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 hover:bg-slate-800 rounded transition ${textPrimary}`}><Menu size={20} /></button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: Home },
                        { id: 'create', label: 'Create', icon: Settings }, // Using Settings icon temporarily as Sparkles/Wand2 might not be imported
                        { id: 'studio', label: 'Studio', icon: Settings },
                        { id: 'users', label: 'Users', icon: Users },
                        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                        { id: 'activity', label: 'Activity', icon: Activity }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedNav(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${selectedNav === item.id ? 'bg-purple-600/20 text-purple-400' : `${textPrimary} hover:bg-slate-800`}`}>
                            <item.icon size={20} /> {sidebarOpen && item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-700 space-y-2">
                    <button onClick={() => setShowPinSettings(true)} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${textSecondary} hover:bg-slate-800 transition`}><Settings size={20} /> {sidebarOpen && 'PIN'}</button>
                    <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${textSecondary} hover:bg-red-600/20 transition`}><LogOut size={20} /> {sidebarOpen && 'Logout'}</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className={`${bgCard} border-b ${borderColor} px-8 py-4 flex items-center justify-between`}>
                    <h2 className={`text-2xl font-bold ${textPrimary}`}>{selectedNav.charAt(0).toUpperCase() + selectedNav.slice(1)}</h2>
                    <div className="flex gap-4">
                        <button className={`px-4 py-2 bg-slate-800 rounded-lg flex items-center gap-2 ${textPrimary} hover:bg-slate-700 transition`}><Search size={18} /> Search</button>
                        <button className={`px-4 py-2 bg-slate-800 rounded-lg flex items-center gap-2 ${textPrimary} hover:bg-slate-700 transition`}><Bell size={18} /></button>
                        <button onClick={() => setDarkMode(!darkMode)} className={`px-4 py-2 bg-slate-800 rounded-lg`}>{darkMode ? '☀️' : '🌙'}</button>
                        <div className={`px-4 py-2 ${bgCard} border ${borderColor} rounded-lg text-sm`}><p className={textSecondary}>Admin</p><p className={`font-semibold ${textPrimary}`}>{userEmail}</p></div>
                    </div>
                </div>

                {/* PIN Settings Modal */}
                {showPinSettings && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className={`${bgCard} p-6 rounded-xl border ${borderColor} w-full max-w-sm`}>
                            <h3 className={`text-xl font-bold ${textPrimary} mb-4`}>Change Admin PIN</h3>
                            {error && <div className="p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
                            <input
                                type="password"
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value)}
                                placeholder="Enter new PIN (min 4 chars)"
                                className={`w-full px-4 py-3 rounded-lg ${bgCard} border ${borderColor} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4`}
                            />
                            <div className="flex gap-3">
                                <button onClick={() => setShowPinSettings(false)} className={`flex-1 py-2 border ${borderColor} rounded-lg ${textSecondary} hover:bg-slate-800 transition`}>Cancel</button>
                                <button onClick={handleChangePin} className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:opacity-90 transition">Save PIN</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-8">
                    {selectedNav === 'dashboard' && (
                        <div className="space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-5 gap-4">
                                {stats ? [
                                    { label: 'Active Users', value: stats.activeUsers.toLocaleString() },
                                    { label: 'GPU Usage', value: `${stats.gpuUsage}%` },
                                    { label: 'Jobs Queued', value: stats.jobsQueued.toLocaleString() },
                                    { label: 'Revenue Today', value: `$${stats.revenueToday.toLocaleString()}` },
                                    { label: 'MRR', value: `$${stats.mrr.toLocaleString()}` }
                                ].map((stat, i) => (
                                    <div key={i} className={`${bgCard} p-6 rounded-xl border ${borderColor}`}>
                                        <p className={`text-sm ${textSecondary} mb-2`}>{stat.label}</p>
                                        <p className={`text-2xl font-bold ${textPrimary}`}>{stat.value}</p>
                                    </div>
                                )) : <p className={`${textPrimary} col-span-5`}>Loading stats...</p>}
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`${bgCard} p-6 rounded-xl border ${borderColor}`}>
                                    <h3 className={`text-lg font-bold ${textPrimary} mb-4`}>Revenue & Users</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                                            <XAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                                            <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                                            <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#f8fafc', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }} />
                                            <Legend />
                                            <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
                                            <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className={`${bgCard} p-6 rounded-xl border ${borderColor}`}>
                                    <h3 className={`text-lg font-bold ${textPrimary} mb-4`}>User Tier Distribution</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={tierData} cx="50%" cy="50%" labelLine={false} label={(entry) => entry.name} outerRadius={80} fill="#8884d8" dataKey="value">
                                                {tierData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedNav === 'users' && (
                        <div className={`${bgCard} rounded-xl border ${borderColor} overflow-hidden`}>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className={`bg-slate-800`}>
                                        <tr>
                                            <th className={`px-6 py-3 text-left text-sm font-semibold ${textPrimary}`}>Username</th>
                                            <th className={`px-6 py-3 text-left text-sm font-semibold ${textPrimary}`}>Email</th>
                                            <th className={`px-6 py-3 text-left text-sm font-semibold ${textPrimary}`}>Tier</th>
                                            <th className={`px-6 py-3 text-left text-sm font-semibold ${textPrimary}`}>Credits</th>
                                            <th className={`px-6 py-3 text-left text-sm font-semibold ${textPrimary}`}>Status</th>
                                            <th className={`px-6 py-3 text-left text-sm font-semibold ${textPrimary}`}>Joined</th>
                                            <th className={`px-6 py-3 text-left text-sm font-semibold ${textPrimary}`}>Generated</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className={`border-t ${borderColor} hover:bg-slate-800/50 transition`}>
                                                <td className={`px-6 py-3 text-sm ${textPrimary}`}>{user.username}</td>
                                                <td className={`px-6 py-3 text-sm ${textSecondary}`}>{user.email}</td>
                                                <td className={`px-6 py-3 text-sm`}><span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">{user.tier}</span></td>
                                                <td className={`px-6 py-3 text-sm ${textPrimary}`}>{user.credits}</td>
                                                <td className={`px-6 py-3 text-sm`}><span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">{user.status}</span></td>
                                                <td className={`px-6 py-3 text-sm ${textSecondary}`}>{user.joined}</td>
                                                <td className={`px-6 py-3 text-sm ${textPrimary}`}>{user.totalGenerated}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {selectedNav === 'analytics' && (
                        <div className={`${bgCard} p-6 rounded-xl border ${borderColor}`}>
                            <h3 className={`text-lg font-bold ${textPrimary} mb-4`}>Weekly Analytics</h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                                    <XAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                                    <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                                    <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#f8fafc', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }} />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="users" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {selectedNav === 'activity' && (
                        <div className="space-y-3">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className={`${bgCard} p-4 rounded-lg border ${borderColor} flex items-center justify-between`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <div>
                                            <p className={`text-sm font-semibold ${textPrimary}`}>{activity.user}</p>
                                            <p className={`text-xs ${textSecondary}`}>{activity.action}</p>
                                        </div>
                                    </div>
                                    <p className={`text-xs ${textSecondary}`}>{activity.time}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedNav === 'studio' && (
                        <div className="space-y-6">
                            {/* Drag & Drop Zone */}
                            <div
                                className={`border-2 border-dashed ${borderColor} rounded-2xl p-12 text-center transition-colors hover:border-purple-500 hover:bg-slate-800/30 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <div className="flex flex-col items-center gap-4 pointer-events-none">
                                    <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                                        <Settings className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold ${textPrimary}`}>Drag & Drop Media</h3>
                                        <p className={textSecondary}>or click to browse files</p>
                                    </div>
                                    <button
                                        onClick={() => document.getElementById('fileInput').click()}
                                        className="mt-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition pointer-events-auto"
                                    >
                                        Upload Assets
                                    </button>
                                </div>
                                <input
                                    id="fileInput"
                                    type="file"
                                    className="hidden"
                                    multiple
                                    onChange={handleFileSelect}
                                />
                            </div>

                            {/* File Grid */}
                            {studioFiles.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {studioFiles.map((file, i) => (
                                        <div key={i} className={`${bgCard} group relative aspect-square rounded-xl border ${borderColor} overflow-hidden hover:shadow-xl transition-all`}>
                                            {file.type.startsWith('image/') ? (
                                                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                                    <span className="text-4xl">📄</span>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                                <p className="text-white font-semibold truncate">{file.name}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className="text-xs text-slate-300">{file.size}</p>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${file.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                                        {file.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {selectedNav === 'create' && (
                        <div className="max-w-4xl mx-auto space-y-8">
                            <div className={`${bgCard} p-8 rounded-2xl border ${borderColor}`}>
                                <h1 className={`text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2`}>
                                    Create New Magic
                                </h1>
                                <p className={`${textSecondary} mb-6`}>Describe what you want to see, and let AI do the rest.</p>

                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="A futuristic city with neon lights, cyberpunk style, highly detailed..."
                                        className={`flex-1 px-6 py-4 rounded-xl ${bgCard} border ${borderColor} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg`}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const prompt = e.target.value;
                                                // Assuming a state for handling generation, or simple direct call for now
                                                // Ideally should be state driven, but for quick insertion:
                                                if (prompt) handleGenerateCheck(prompt);
                                            }
                                        }}
                                        id="promptInput"
                                    />
                                    <button
                                        onClick={() => handleGenerateCheck(document.getElementById('promptInput').value)}
                                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:opacity-90 transition shadow-lg shadow-purple-500/20"
                                        disabled={loading}
                                    >
                                        {loading ? 'Thinking...' : 'Generate ➜'}
                                    </button>
                                </div>
                            </div>

                            {/* Result Area */}
                            {studioFiles.filter(f => f.isGenerated).length > 0 && (
                                <div className="space-y-4">
                                    <h3 className={`text-xl font-bold ${textPrimary}`}>Recent Creations</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {studioFiles.filter(f => f.isGenerated).map((file, i) => (
                                            <div key={i} className={`${bgCard} rounded-xl border ${borderColor} overflow-hidden shadow-xl`}>
                                                <img src={file.url} alt={file.name} className="w-full h-auto" />
                                                <div className="p-4">
                                                    <p className={`text-sm ${textPrimary} font-medium`}>{file.name}</p>
                                                    <p className={`text-xs ${textSecondary} mt-1`}>Generated with DALL-E 3</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper for generation (can be moved inside component but keeping local for less diff churn)
// Since I can't easily add a new function inside the component without replacing a huge block, 
// I'll rely on a small trick or just replace the whole component body if needed.
// Actually, I can replace the whole sidebar nav list to include 'Create'.
// And I need to inject the handleGenerate function.
// Let's do a multi-replace for the component updates.
export default MythicamApp;

