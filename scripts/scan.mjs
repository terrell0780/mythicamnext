import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function findRoot(dir) {
    if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return dir; // Reached root
    return findRoot(parent);
}

const rootDir = findRoot(process.cwd());
const docsDir = path.join(rootDir, 'docs');

if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
}

const healthReportPath = path.join(docsDir, 'health_check.md');

function log(message) {
    console.log(`[SCANNER] ${message}`);
}

function runCommand(command, desc) {
    log(`Running ${desc}...`);
    try {
        const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
        return { success: true, output };
    } catch (error) {
        const output = (error.stdout || '') + (error.stderr || '') + (error.message || '');
        return { success: false, output };
    }
}

async function performScan() {
    log('Starting Autonomous System Scan...');

    const timestamp = new Date().toISOString();
    let report = `# System Health Report - ${timestamp}\n\n`;

    // 1. Lint Check
    const lintResult = runCommand('npm run lint', 'Lint Audit');
    report += `## 1. Code Quality (Lint)\n`;
    report += lintResult.success ? `✅ PASSED\n` : `❌ FAILED\n`;
    if (!lintResult.success) report += `\`\`\`\n${lintResult.output}\n\`\`\`\n`;

    // 2. Build Check
    const buildResult = runCommand('npm run build', 'Build Verification');
    report += `\n## 2. Build Integrity\n`;
    report += buildResult.success ? `✅ PASSED\n` : `❌ FAILED\n`;
    if (!buildResult.success) report += `\`\`\`\n${buildResult.output}\n\`\`\`\n`;

    // 3. Project Structure
    const srcExists = fs.existsSync(path.join(rootDir, 'src'));
    const legacyExists = fs.existsSync(path.join(rootDir, 'legacy'));
    report += `\n## 3. Architecture Status\n`;
    report += `- Legacy cleanup: ${!srcExists && legacyExists ? '✅ COMPLETED' : '⚠️ PENDING'}\n`;

    // 4. Critical Files
    const criticalFiles = ['vercel.json', 'next.config.js', '.env.example'];
    report += `\n## 4. Critical Files Audit\n`;
    criticalFiles.forEach(file => {
        const exists = fs.existsSync(path.join(rootDir, file));
        report += `- ${file}: ${exists ? '✅ FOUND' : '❌ MISSING'}\n`;
    });

    fs.writeFileSync(healthReportPath, report);
    log(`Health report generated at: ${healthReportPath}`);

    if (lintResult.success && buildResult.success) {
        log('System Health: 100% - All checks passed.');
    } else {
        log('System Health: ERRORS DETECTED - Review health_check.md');
        process.exit(1);
    }
}

performScan();
