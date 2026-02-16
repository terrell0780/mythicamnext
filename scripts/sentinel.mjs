import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = path.resolve(process.cwd(), '..');
const docsDir = path.join(rootDir, 'docs');
const healthReportPath = path.join(docsDir, 'health_check.md');

class SentinelAI {
    constructor() {
        this.status = 'Idle';
        this.healthScore = 100;
        this.logs = [];
    }

    log(message) {
        const entry = `[SENTINEL] [${new Date().toISOString()}] ${message}`;
        console.log(entry);
        this.logs.push(entry);
    }

    async updateHeartbeat() {
        try {
            await fetch('http://localhost:3000/api/eliteani/sentinel/heartbeat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: this.status,
                    healthScore: this.healthScore,
                    activeThreats: this.healthScore < 100 ? 1 : 0
                })
            });
        } catch (error) {
            this.log('Heartbeat failed: App server might be offline.');
        }
    }

    async selfHeal(missingFiles) {
        if (missingFiles.length === 0) return;

        this.log(`Initiating self-healing for ${missingFiles.length} files...`);
        missingFiles.forEach(file => {
            try {
                // Restoration logic (example: restoring .env.example if missing)
                if (file === '.env.example') {
                    const content = '# Sentinel Restored Environment Template\nNEXT_PUBLIC_SUPABASE_URL=YOUR_URL\nNEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY\n';
                    fs.writeFileSync(path.join(rootDir, file), content);
                    this.log(`Successfully restored ${file}`);
                }
            } catch (err) {
                this.log(`Self-healing failed for ${file}: ${err.message}`);
            }
        });
    }

    async performHealthAudit() {
        this.log('Initiating Autonomous System Audit...');
        let report = `# Sentinel Health Report - ${new Date().toISOString()}\n\n`;
        this.healthScore = 100;
        const missingFiles = [];

        // 1. Lint Check
        try {
            this.log('Running Lint Audit...');
            execSync('npm run lint', { cwd: rootDir, stdio: 'pipe' });
            report += `## 1. Code Quality\n✅ PASSED\n`;
        } catch (error) {
            this.log('Lint errors detected.');
            report += `## 1. Code Quality\n❌ FAILED\n`;
            this.healthScore -= 10;
        }

        // 2. Project Structure
        const criticalFiles = ['vercel.json', 'next.config.js', '.env.example'];
        report += `\n## 2. Critical Files Audit\n`;
        criticalFiles.forEach(file => {
            const exists = fs.existsSync(path.join(rootDir, file));
            report += `- ${file}: ${exists ? '✅ FOUND' : '❌ MISSING'}\n`;
            if (!exists) {
                this.healthScore -= 5;
                missingFiles.push(file);
            }
        });

        if (missingFiles.length > 0) {
            await this.selfHeal(missingFiles);
        }

        if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir);
        fs.writeFileSync(healthReportPath, report);
        this.log(`Audit complete. Health Score: ${this.healthScore}%`);
        await this.updateHeartbeat();
    }

    async processPromotions() {
        this.log('Scanning Promotional Queue...');
        try {
            const res = await fetch('http://localhost:3000/api/eliteani/promo/deploy', { method: 'POST' });
            const data = await res.json();
            if (data.success && data.deployed && data.deployed.length > 0) {
                this.log(`Successfully deployed ${data.deployed.length} promotional campaigns.`);
            } else {
                this.log('No promos in queue or deployment skipped.');
            }
        } catch (error) {
            this.log(`Promotion error: ${error.message}`);
        }
    }

    async run(once = false) {
        this.status = 'Active';
        await this.performHealthAudit();
        await this.processPromotions();

        if (!once) {
            this.log('Sentinel AI entering continuous monitoring mode...');
            setInterval(async () => {
                await this.performHealthAudit();
                await this.processPromotions();
            }, 60000); // Every 60 seconds for Real-Time monitoring
        } else {
            this.log('Sentinel AI single run complete.');
        }
    }
}

const args = process.argv.slice(2);
const sentinel = new SentinelAI();
sentinel.run(args.includes('--once'));
