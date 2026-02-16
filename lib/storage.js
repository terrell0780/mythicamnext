/**
 * storage.js
 * 
 * Replaces the 'db' object from the Express server.
 * In a real production app, this would connect to Supabase/Postgres.
 * For this "Easiest Free Build", we use in-memory objects that reset on cold starts,
 * but structured to be easily swapped for a database.
 */

// Initial Data (Transitioned to Real-Time - No Fakes)
const initialData = {
    admin: {
        email: 'TERRELL0780@GMAIL.COM',
        pin: '1951',
        name: 'Terrell',
        role: 'Owner'
    },
    stats: {
        activeUsers: 0,
        totalUsers: 0,
        gpuUsage: 0,
        jobsQueued: 0,
        jobsCompleted: 0,
        revenueToday: 0,
        revenueWeek: 0,
        revenueMonth: 0,
        mrr: 0,
        avgSessionTime: '0m 0s'
    },
    users: [],
    transactions: [],
    // Governance / EliteAniCore State
    governance: {
        killSwitch: false,
        promoThrottle: 100,
        logs: [],
        sentinel: {
            status: 'Online',
            lastAudit: null,
            healthScore: 100,
            activeThreats: 0
        }
    },
    promoEngine: {
        contentQueue: [],
        pushTo: ['coldEmail', 'blog', 'socialPost'],
        activePulses: []
    }
};

// Global variable to persist across hot-reloads in development
let db = global.mockDb || initialData;
if (process.env.NODE_ENV !== 'production') global.mockDb = db;

export const storage = {
    getStats: () => db.stats,

    // Sentinel Status
    getSentinelState: () => db.governance.sentinel,
    updateSentinelStatus: (status, details = {}) => {
        db.governance.sentinel = { ...db.governance.sentinel, status, ...details };
        storage.addLog('sentinel_update', { status, ...details });
    },

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
    getGenerations: () => db.governance.logs
        .filter(l => l.action === 'generated_image')
        .map(l => ({
            url: l.imageUrl,
            prompt: l.prompt,
            created_at: l.timestamp
        })),

    addGeneration: (gen) => {
        storage.addLog('generated_image', gen);
    },

    addPromoToQueue: (promo) => {
        db.promoEngine.contentQueue.push(promo);
        storage.addLog('promo_generated', { promo });
    },

    getPromoQueue: () => db.promoEngine.contentQueue,

    deployPromos: () => {
        const deployed = [...db.promoEngine.contentQueue];
        db.promoEngine.contentQueue = [];
        storage.addLog('promos_deployed', { count: deployed.length });

        // Add random pulses for visual feedback
        const channels = db.promoEngine.pushTo;
        const newPulses = deployed.flatMap(() =>
            channels.map(channel => ({
                id: Math.random().toString(36).substr(2, 9),
                channel,
                timestamp: new Date().toISOString()
            }))
        );
        db.promoEngine.activePulses = [...db.promoEngine.activePulses, ...newPulses].slice(-20);

        return deployed;
    },

    getPromoPulses: () => db.promoEngine.activePulses,

    // Transactions
    getTransactions: () => {
        // combine static mock transactions with dynamic ones from logs
        const dynamicTx = db.governance.logs
            .filter(l => l.action === 'transaction')
            .map(l => l.tx);
        return [...db.transactions, ...dynamicTx];
    },

    addTransaction: (tx) => {
        storage.addLog('transaction', { tx });
    }
};
