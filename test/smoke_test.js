const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    page.on('dialog', async dialog => {
        console.log('DIALOG:', dialog.message());
        await dialog.accept();
    });

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    try {
        const url = process.env.URL || 'http://localhost:5000';
        console.log('Opening', url);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait for app root to render
        await page.waitForSelector('h1, h2', { timeout: 10000 });

        // If login screen present, perform login
        const signInButtons = await page.$$("xpath///button[contains(., 'Sign In')]");
        if (signInButtons.length) {
            // attempt empty sign-in to observe validation (will trigger alert)
            console.log('Clicking Sign In (empty)');
            await signInButtons[0].click();
            await sleep(600);

            // fill credentials
            const email = await page.$('input[type="email"]');
            const pw = await page.$('input[type="password"]');
            if (email && pw) {
                await email.click({ clickCount: 3 });
                await email.type('terrell0780@gmail.com', { delay: 50 });
                await pw.type('1951', { delay: 50 });
                console.log('Signing in with admin credentials');
                const signInButtons2 = await page.$$("xpath///button[contains(., 'Sign In')]");
                if (signInButtons2.length) await signInButtons2[0].click();
            }
        }

        // Wait for dashboard header
        await page.waitForSelector("xpath///h2[contains(., 'Dashboard')]", { timeout: 10000 });
        console.log('Dashboard loaded');

        // Open PIN modal if available
        const pinBtn = await page.$$("xpath///button[contains(., 'PIN')]");
        if (pinBtn.length) {
            console.log('Opening PIN modal');
            await pinBtn[0].click();
            await page.waitForSelector('input[placeholder="Enter new PIN (min 4 chars)"]', { timeout: 5000 });
            await page.type('input[placeholder="Enter new PIN (min 4 chars)"]', '9999', { delay: 50 });
            const saveBtn = (await page.$$("xpath///button[contains(., 'Save')]")).shift();
            if (saveBtn) {
                console.log('Saving new PIN');
                await saveBtn.click();
                await sleep(600);
            }
        }

        // Logout
        const logoutBtns = await page.$$("xpath///button[contains(., 'Logout')]");
        if (logoutBtns.length) {
            console.log('Clicking Logout');
            await logoutBtns[0].click();
            await sleep(600);
            console.log('Logged out');
        }

        await browser.close();
        console.log('Smoke test completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        try { await browser.close(); } catch (e) { }
        process.exit(2);
    }
})();


