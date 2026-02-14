/**
 * storage.js
 * 
 * Replaces the 'db' object from the Express server.
 * In a real production app, this would connect to Supabase/Postgres.
 * For this "Easiest Free Build", we use in-memory objects that reset on cold starts,
 * but structured to be easily swapped for a database.
 */

// Initial Data (Copied from server/index.cjs)
const initialData = {
    admin: {
        email: 'terrell0780@gmail.com',
        pin: '1951',
        name: 'Terrell'
    },
    stats: {
        activeUsers: 12847,
        totalUsers: 15234,
        gpuUsage: 78,
        jobsQueued: 342,
        jobsCompleted: 89450,
        revenueToday: 4230,
        revenueWeek: 28450,
        revenueMonth: 89450,
        mrr: 18200,
        avgSessionTime: '12m 34s'
    },
    users: [
        { id: 1, username: 'alex_creator', email: 'alex@example.com', tier: 'Power', credits: 450, status: 'Active', joined: '2025-11-15', lastActive: '2026-01-04', totalGenerated: 234 },
        { id: 2, username: 'luna_studio', email: 'luna@example.com', tier: 'Studio', credits: 2000, status: 'Active', joined: '2025-10-22', lastActive: '2026-01-03', totalGenerated: 1205 },
        { id: 3, username: 'mike_designs', email: 'mike@example.com', tier: 'Basic', credits: 50, status: 'Active', joined: '2025-12-01', lastActive: '2026-01-04', totalGenerated: 89 },
        { id: 4, username: 'sarah_art', email: 'sarah@example.com', tier: 'Power', credits: 320, status: 'Active', joined: '2025-09-18', lastActive: '2026-01-02', totalGenerated: 567 },
        { id: 5, username: 'james_media', email: 'james@example.com', tier: 'Studio', credits: 1500, status: 'Suspended', joined: '2025-08-05', lastActive: '2025-12-15', totalGenerated: 2340 },
    ],
    transactions: [
        { id: 1, user: 'luna_studio', amount: 99.99, type: 'subscription', status: 'completed', date: '2026-01-04' },
        { id: 2, user: 'mike_designs', amount: 19.99, type: 'credits', status: 'completed', date: '2026-01-04' },
        { id: 3, user: 'alex_creator', amount: 29.99, type: 'subscription', status: 'completed', date: '2026-01-03' },
    ],
    // Governance / EliteAniCore State
    governance: {
        killSwitch: true,
        promoThrottle: 150,
        logs: []
    },
    promoEngine: {
        contentQueue: [],
        pushTo: ['coldEmail', 'blog', 'socialPost']
    }
};

// Global variable to persist across hot-reloads in development
// In serverless production, this resets per lambda instance (warm starts preserve it briefly)
let db = global.mockDb || initialData;
if (process.env.NODE_ENV !== 'production') global.mockDb = db;

export const storage = {
    getStats: () => db.stats,

    getUsers: () => db.users,

    getAdmin: () => db.admin,

    checkPin: (pin) => pin === db.admin.pin,

    // Governance
    getGovernance: () => db.governance,

    toggleKillSwitch: (enabled) => {
        db.governance.killSwitch = enabled;
        db.governance.logs.push({ action: 'killswitch_toggled', enabled, timestamp: new Date().toISOString() });
        return db.governance.killSwitch;
    },

    setPromoThrottle: (percent) => {
        db.governance.promoThrottle = percent;
        db.governance.logs.push({ action: 'throttle_set', percent, timestamp: new Date().toISOString() });
        return percent;
    },

    addLog: (action, details) => {
        db.governance.logs.push({ action, ...details, timestamp: new Date().toISOString() });
    },

    clearLogs: () => {
        const count = db.governance.logs.length;
        db.governance.logs = [];
        return count;
    },

    // Generate / Promo
    addPromoToQueue: (promo) => {
        db.promoEngine.contentQueue.push(promo);
        storage.addLog('promo_generated', { promo });
    },

    getPromoQueue: () => db.promoEngine.contentQueue,

    deployPromos: () => {
        const deployed = [...db.promoEngine.contentQueue];
        db.promoEngine.contentQueue = [];
        storage.addLog('promos_deployed', { count: deployed.length });
        return deployed;
    }
};
