const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI (graceful — server starts even without key)
let openai = null;
try {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} catch (e) {
    console.warn('⚠ OpenAI not configured (OPENAI_API_KEY missing). AI generation disabled.');
}

app.use(cors());
app.use(express.json());

// In-memory database
let db = {
    admin: {
        email: 'terrell0780@gmail.com',
        pin: '1951',
        name: 'Terrell'
    },
    users: [
        { id: 1, username: 'alex_creator', email: 'alex@example.com', tier: 'Power', credits: 450, status: 'Active', joined: '2025-11-15', lastActive: '2026-01-04', totalGenerated: 234 },
        { id: 2, username: 'luna_studio', email: 'luna@example.com', tier: 'Studio', credits: 2000, status: 'Active', joined: '2025-10-22', lastActive: '2026-01-03', totalGenerated: 1205 },
        { id: 3, username: 'mike_designs', email: 'mike@example.com', tier: 'Basic', credits: 50, status: 'Active', joined: '2025-12-01', lastActive: '2026-01-04', totalGenerated: 89 },
        { id: 4, username: 'sarah_art', email: 'sarah@example.com', tier: 'Power', credits: 320, status: 'Active', joined: '2025-09-18', lastActive: '2026-01-02', totalGenerated: 567 },
        { id: 5, username: 'james_media', email: 'james@example.com', tier: 'Studio', credits: 1500, status: 'Suspended', joined: '2025-08-05', lastActive: '2025-12-15', totalGenerated: 2340 },
    ],
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
    tiers: [
        { id: 1, name: 'Basic', price: 9.99, credits: 100, features: ['50 AI Images/month', 'Basic models', 'Email support'] },
        { id: 2, name: 'Power', price: 29.99, credits: 500, features: ['300 AI Images/month', 'All models', 'Priority support', 'API access'] },
        { id: 3, name: 'Studio', price: 99.99, credits: 2500, features: ['Unlimited AI Images', 'All models + Beta', 'Dedicated support', 'API access', 'Custom training'] }
    ],
    recentActivity: [
        { id: 1, user: 'alex_creator', action: 'Generated 5 images', time: '2 min ago', type: 'generation' },
        { id: 2, user: 'luna_studio', action: 'Upgraded to Studio tier', time: '15 min ago', type: 'upgrade' },
        { id: 3, user: 'mike_designs', action: 'Purchased 100 credits', time: '32 min ago', type: 'purchase' },
        { id: 4, user: 'sarah_art', action: 'Generated 12 images', time: '1 hour ago', type: 'generation' },
        { id: 5, user: 'new_user_92', action: 'Signed up for Basic', time: '2 hours ago', type: 'signup' },
    ],
    transactions: [
        { id: 1, user: 'luna_studio', amount: 99.99, type: 'subscription', status: 'completed', date: '2026-01-04' },
        { id: 2, user: 'mike_designs', amount: 19.99, type: 'credits', status: 'completed', date: '2026-01-04' },
        { id: 3, user: 'alex_creator', amount: 29.99, type: 'subscription', status: 'completed', date: '2026-01-03' },
        { id: 4, user: 'sarah_art', amount: 29.99, type: 'subscription', status: 'completed', date: '2026-01-02' },
        { id: 5, user: 'james_media', amount: 99.99, type: 'subscription', status: 'refunded', date: '2025-12-15' },
    ],
    chartData: {
        revenue: [
            { name: 'Mon', value: 3200 },
            { name: 'Tue', value: 4100 },
            { name: 'Wed', value: 3800 },
            { name: 'Thu', value: 4500 },
            { name: 'Fri', value: 5200 },
            { name: 'Sat', value: 4800 },
            { name: 'Sun', value: 4230 }
        ],
        users: [
            { name: 'Mon', value: 120 },
            { name: 'Tue', value: 145 },
            { name: 'Wed', value: 132 },
            { name: 'Thu', value: 178 },
            { name: 'Fri', value: 195 },
            { name: 'Sat', value: 167 },
            { name: 'Sun', value: 156 }
        ],
        tierDistribution: [
            { name: 'Basic', value: 8500, color: '#6366f1' },
            { name: 'Power', value: 4200, color: '#8b5cf6' },
            { name: 'Studio', value: 2534, color: '#d946ef' }
        ]
    },
    content: {
        hero: {
            title: 'Create Stunning AI Content',
            subtitle: 'Transform your ideas into reality with our powerful AI generation platform',
            cta: 'Start Creating Free'
        },
        features: [
            { title: 'AI Image Generation', description: 'Create photorealistic images from text descriptions', icon: 'image' },
            { title: 'Video Creation', description: 'Generate short videos and animations with AI', icon: 'video' },
            { title: 'Voice Synthesis', description: 'Natural text-to-speech in multiple languages', icon: 'audio' },
            { title: 'API Access', description: 'Integrate AI generation into your apps', icon: 'code' }
        ],
        testimonials: [
            { name: 'Sarah M.', role: 'Content Creator', text: 'Mythicam has revolutionized my workflow. I can create content 10x faster!' },
            { name: 'James K.', role: 'Marketing Director', text: 'The quality of AI-generated images is incredible. Our campaigns have never looked better.' },
            { name: 'Luna D.', role: 'Indie Game Dev', text: 'Perfect for generating game assets. Saved us months of work.' }
        ]
    }
};

// =============================================================
// EliteAniCore — Full Operational Build 2026
// © 2026 Terrell Hall — EliteAniCore
// All modules included and wired.
// =============================================================

// ---- Conversion Enhancers ----
const conversionEnhancers = {
    proSpotsLeft: 10,
    timeBasedBonus: true,
    foundersBadge: true,
    anchorPricingComparison: true
};

// ---- Social Proof Automation ----
const socialProof = {
    recentPurchaseTicker: [],
    someoneJustJoinedPulse: [],
    subscriberMilestones: []
};

// ---- Refund Confidence ----
const refundConfidence = {
    secureCheckout: true,
    transparentBilling: true,
    cancelAnytime: true
};

// ---- Traffic Warm-Up ----
const trafficWarmup = {
    domainPreWarmed: true,
    emailDomainWarmup: true,
    seoSitemapSubmitted: true,
    affiliateApprovalSecured: true
};

// ---- Interactive Video Layer ----
const interactiveVideo = {
    CTAsOverlay: true,
    scheduleLocked: true,
    overlaysNonBlocking: true
};

// ---- Animation Controls ----
const animationControls = {
    defaultOff: true,
    toggleOnOff: true,
    speedSlider: { min: 0.5, max: 2.0 },
    noObstruction: true
};

// ---- Revenue & Checkout (EliteAniCore) ----
const eliteRevenueCheckout = {
    paymentMethods: ['paypal', 'google_pay', 'e_transfer', 'direct_deposit'],
    adminPIN: '1234',
    promoThrottlePercent: 150,
    revenueGuarantee: false,
    transactions: []
};

// ---- Branding ----
const eliteBranding = {
    footerText: '© 2026 Terrell Hall — EliteAniCore',
    optionalWatermarkToggleable: true
};

// ---- Admin Governance ----
const adminGovernance = {
    killSwitch: true,
    fullLogging: true,
    promoSliderAdjustable: true,
    logs: []
};

// ---- AI Promo Engine ----
const promoEngine = {
    pushTo: ['coldEmail', 'blog', 'socialPost'],
    throttlePercent: 150,
    subscriberTrigger: 'first3Subscribers',
    contentQueue: [],
    generatePromo: (prompt) => {
        const promo = `[AI Generated Promo] ${prompt}`;
        promoEngine.contentQueue.push(promo);
        if (adminGovernance.fullLogging) {
            adminGovernance.logs.push({ action: 'promo_generated', promo, timestamp: new Date().toISOString() });
        }
        return promo;
    },
    deployPromo: () => {
        const deployed = [];
        promoEngine.contentQueue.forEach(promo => {
            promoEngine.pushTo.forEach(channel => {
                console.log(`Pushing promo to ${channel}:`, promo);
                deployed.push({ channel, promo });
            });
        });
        promoEngine.contentQueue = [];
        if (adminGovernance.fullLogging) {
            adminGovernance.logs.push({ action: 'promos_deployed', count: deployed.length, timestamp: new Date().toISOString() });
        }
        return { success: true, message: 'All promos deployed', deployed };
    }
};

// =============================================================
// EliteAniCore API Endpoints — /api/eliteani/*
// =============================================================

// Master Status
app.get('/api/eliteani/status', (req, res) => {
    res.json({
        status: 'EliteAniCore fully operational',
        uptime: process.uptime(),
        modules: [
            'Conversion', 'Social Proof', 'Refund Confidence',
            'Traffic Warm-Up', 'Interactive Video', 'Animation Controls',
            'Revenue & Checkout', 'Branding', 'Admin Governance', 'AI Promo Engine'
        ],
        promoThrottle: promoEngine.throttlePercent,
        killSwitch: adminGovernance.killSwitch,
        timestamp: new Date().toISOString()
    });
});

// GET endpoints — read module state
app.get('/api/eliteani/conversion', (req, res) => res.json(conversionEnhancers));
app.get('/api/eliteani/social-proof', (req, res) => res.json(socialProof));
app.get('/api/eliteani/refund', (req, res) => res.json(refundConfidence));
app.get('/api/eliteani/traffic', (req, res) => res.json(trafficWarmup));
app.get('/api/eliteani/video', (req, res) => res.json(interactiveVideo));
app.get('/api/eliteani/animation', (req, res) => res.json(animationControls));
app.get('/api/eliteani/revenue', (req, res) => res.json(eliteRevenueCheckout));
app.get('/api/eliteani/branding', (req, res) => res.json(eliteBranding));
app.get('/api/eliteani/admin', (req, res) => res.json(adminGovernance));
app.get('/api/eliteani/promo', (req, res) => res.json({
    pushTo: promoEngine.pushTo,
    throttlePercent: promoEngine.throttlePercent,
    subscriberTrigger: promoEngine.subscriberTrigger,
    contentQueue: promoEngine.contentQueue
}));

// POST — Promo Engine: Generate
app.post('/api/eliteani/promo/generate', (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: 'Prompt is required' });
    const promo = promoEngine.generatePromo(prompt);
    res.json({ success: true, promo });
});

// POST — Promo Engine: Deploy
app.post('/api/eliteani/promo/deploy', (req, res) => {
    const result = promoEngine.deployPromo();
    res.json(result);
});

// POST — Promo Engine: Set Throttle (0–150%)
app.post('/api/eliteani/promo/throttle', (req, res) => {
    const { percent } = req.body;
    if (percent === undefined || percent < 0 || percent > 150) {
        return res.status(400).json({ success: false, message: 'Throttle must be 0–150' });
    }
    promoEngine.throttlePercent = percent;
    eliteRevenueCheckout.promoThrottlePercent = percent;
    if (adminGovernance.fullLogging) {
        adminGovernance.logs.push({ action: 'throttle_set', percent, timestamp: new Date().toISOString() });
    }
    res.json({ success: true, throttlePercent: percent });
});

// POST — Social Proof: Update
app.post('/api/eliteani/social-proof/update', (req, res) => {
    const { action, user } = req.body;
    if (action === 'purchase') socialProof.recentPurchaseTicker.push({ user, timestamp: new Date().toISOString() });
    if (action === 'join') socialProof.someoneJustJoinedPulse.push({ user, timestamp: new Date().toISOString() });
    if (action === 'milestone') socialProof.subscriberMilestones.push({ user, timestamp: new Date().toISOString() });
    res.json({ success: true, socialProof });
});

// POST — Revenue: Add Transaction
app.post('/api/eliteani/revenue/add', (req, res) => {
    const { user, amount, method } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });
    const txn = { id: eliteRevenueCheckout.transactions.length + 1, user, amount, method, date: new Date().toISOString() };
    eliteRevenueCheckout.transactions.push(txn);
    if (adminGovernance.fullLogging) {
        adminGovernance.logs.push({ action: 'revenue_added', txn, timestamp: new Date().toISOString() });
    }
    res.json({ success: true, transaction: txn });
});

// POST — Admin Governance: Toggle Kill Switch
app.post('/api/eliteani/admin/killswitch', (req, res) => {
    const { enabled } = req.body;
    adminGovernance.killSwitch = !!enabled;
    adminGovernance.logs.push({ action: 'killswitch_toggled', enabled: adminGovernance.killSwitch, timestamp: new Date().toISOString() });
    res.json({ success: true, killSwitch: adminGovernance.killSwitch });
});

// POST — Admin Governance: Clear Logs
app.post('/api/eliteani/admin/clear-logs', (req, res) => {
    const count = adminGovernance.logs.length;
    adminGovernance.logs = [];
    res.json({ success: true, message: `Cleared ${count} log entries` });
});

// POST — Animation Controls: Update
app.post('/api/eliteani/animation/update', (req, res) => {
    const { defaultOff, toggleOnOff, speedMin, speedMax } = req.body;
    if (defaultOff !== undefined) animationControls.defaultOff = defaultOff;
    if (toggleOnOff !== undefined) animationControls.toggleOnOff = toggleOnOff;
    if (speedMin !== undefined) animationControls.speedSlider.min = speedMin;
    if (speedMax !== undefined) animationControls.speedSlider.max = speedMax;
    res.json({ success: true, animationControls });
});

// POST — Branding: Update
app.post('/api/eliteani/branding/update', (req, res) => {
    const { footerText, optionalWatermarkToggleable } = req.body;
    if (footerText !== undefined) eliteBranding.footerText = footerText;
    if (optionalWatermarkToggleable !== undefined) eliteBranding.optionalWatermarkToggleable = optionalWatermarkToggleable;
    res.json({ success: true, branding: eliteBranding });
});

// POST — Conversion Enhancers: Update
app.post('/api/eliteani/conversion/update', (req, res) => {
    const { proSpotsLeft, timeBasedBonus, foundersBadge, anchorPricingComparison } = req.body;
    if (proSpotsLeft !== undefined) conversionEnhancers.proSpotsLeft = proSpotsLeft;
    if (timeBasedBonus !== undefined) conversionEnhancers.timeBasedBonus = timeBasedBonus;
    if (foundersBadge !== undefined) conversionEnhancers.foundersBadge = foundersBadge;
    if (anchorPricingComparison !== undefined) conversionEnhancers.anchorPricingComparison = anchorPricingComparison;
    res.json({ success: true, conversionEnhancers });
});

// =============================================================
// End EliteAniCore Endpoints
// =============================================================

// Auth routes
app.post('/api/auth/login', (req, res) => {
    const { email, pin } = req.body;
    if (email === db.admin.email && pin === db.admin.pin) {
        res.json({ success: true, user: { email, name: db.admin.name, isAdmin: true } });
    } else if (email === db.admin.email) {
        res.status(401).json({ success: false, message: 'Invalid PIN' });
    } else {
        res.json({ success: true, user: { email, name: email.split('@')[0], isAdmin: false } });
    }
});

app.post('/api/auth/change-pin', (req, res) => {
    const { newPin } = req.body;
    if (newPin && newPin.length >= 4) {
        db.admin.pin = newPin;
        res.json({ success: true, message: 'PIN changed successfully' });
    } else {
        res.status(400).json({ success: false, message: 'PIN must be at least 4 characters' });
    }
});

// Stats routes
app.get('/api/stats', (req, res) => {
    res.json(db.stats);
});

app.get('/api/stats/charts', (req, res) => {
    res.json(db.chartData);
});

// Users routes
app.get('/api/users', (req, res) => {
    res.json(db.users);
});

app.get('/api/users/:id', (req, res) => {
    const user = db.users.find(u => u.id === parseInt(req.params.id));
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
});

app.put('/api/users/:id', (req, res) => {
    const index = db.users.findIndex(u => u.id === parseInt(req.params.id));
    if (index !== -1) {
        db.users[index] = { ...db.users[index], ...req.body };
        res.json(db.users[index]);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.delete('/api/users/:id', (req, res) => {
    const index = db.users.findIndex(u => u.id === parseInt(req.params.id));
    if (index !== -1) {
        db.users.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Tiers routes
app.get('/api/tiers', (req, res) => {
    res.json(db.tiers);
});

// Activity routes
app.get('/api/activity', (req, res) => {
    res.json(db.recentActivity);
});

// Transactions routes
app.get('/api/transactions', (req, res) => {
    res.json(db.transactions);
});

// Payments (mock) - create a charge (simulate customer payment)
app.post('/api/payments/charge', (req, res) => {
    const { amount, source, email } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });
    const tx = { id: db.transactions.length + 1, user: email || 'guest', amount, type: 'charge', status: 'completed', date: new Date().toISOString() };
    db.transactions.unshift(tx);
    res.json({ success: true, transaction: tx });
});

// E-Transfer (mock) - simulate sending e-transfer to a bank/recipient
app.post('/api/payments/etransfer', (req, res) => {
    const { amount, toBank, toAccount, note } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });
    const tx = { id: db.transactions.length + 1, user: toAccount || 'external', amount, type: 'etransfer', status: 'pending', toBank, note, date: new Date().toISOString() };
    db.transactions.unshift(tx);
    // In real integration, this would call Interac or banking API and update status asynchronously
    res.json({ success: true, transaction: tx, message: 'E-Transfer initiated (mock)' });
});

// Payout / Direct deposit (mock) - simulate sending payout to a bank account
app.post('/api/payments/payout', (req, res) => {
    const { amount, accountNumber, bankName } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });
    const tx = { id: db.transactions.length + 1, user: accountNumber || 'external', amount, type: 'payout', status: 'completed', bankName, date: new Date().toISOString() };
    db.transactions.unshift(tx);
    res.json({ success: true, transaction: tx });
});

// Studio Upload (mock) - simulate uploading a file using multer-like behavior
app.post('/api/studio/upload', (req, res) => {
    // In a real app, use multer to handle multipart/form-data
    res.json({ success: true, message: 'File uploaded successfully', url: '/uploads/mock-file.png' });
});

// AI Generation Endpoint (Real)
app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    if (!openai) {
        return res.status(503).json({ success: false, message: 'OpenAI not configured. Set OPENAI_API_KEY.' });
    }

    try {
        console.log(`Generating image for prompt: ${prompt}`);

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        const imageUrl = response.data[0].url;
        console.log('Generation successful:', imageUrl);

        // Log to activity
        db.recentActivity.unshift({
            id: db.recentActivity.length + 1,
            user: 'admin', // assuming admin for now
            action: `Generated AI Image: "${prompt.substring(0, 20)}..."`,
            time: 'Just now',
            type: 'generation'
        });

        // Deduct credits (mock)
        const adminUser = db.users.find(u => u.username === 'terrell'); // Adjust if needed
        if (adminUser) adminUser.credits -= 1;

        res.json({ success: true, imageUrl });

    } catch (error) {
        console.error('OpenAI Generation Error:', error);
        res.status(500).json({
            success: false,
            message: 'Image generation failed',
            error: error.message
        });
    }
});

// Content routes (for public site)
app.get('/api/content', (req, res) => {
    res.json(db.content);
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../build')));

// Health endpoint for readiness checks
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        env: process.env.NODE_ENV || 'development',
        transactions: db.transactions.length,
        users: db.users.length
    });
});

app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start server with improved logging and error handling
const server = app.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Mythicam + EliteAniCore Server`);
    console.log(`  Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Host        : http://localhost:${PORT}`);
    console.log(`  PID         : ${process.pid}`);
    console.log('----------------------------------------');
    console.log('  Mythicam Modules: Auth, Stats, Users, Tiers, Activity, Transactions, Payments, Generate, Content');
    console.log('  EliteAniCore Modules: Conversion, Social Proof, Refund, Traffic, Video, Animation, Revenue, Branding, Admin, AI Promo Engine');
    console.log(`  Promo Throttle: ${promoEngine.throttlePercent}%`);
    console.log(`  Kill Switch: ${adminGovernance.killSwitch ? 'ARMED' : 'OFF'}`);
    console.log('========================================');
});

server.on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    // allow logs to flush then exit
    setTimeout(() => process.exit(1), 100);
});

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
    setTimeout(() => process.exit(1), 100);
});
