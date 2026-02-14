Payments integration notes

Overview
- This project includes mock endpoints for payments in `server/index.js`:
  - `POST /api/payments/charge` — simulate a customer charge and record a completed transaction.
  - `POST /api/payments/etransfer` — simulate initiating an e-transfer (marked `pending`).
  - `POST /api/payments/payout` — simulate a direct deposit/payout (completed).

Production integration recommendations

1) Customer payments (cards / ACH / bank debits)
- Use a PCI-compliant provider such as Stripe:
  - `stripe.com` supports card payments, ACH debits (US), BECS (AU), and payouts to bank accounts.
  - Implement server-side routes that call Stripe's APIs; avoid sending secret keys to the client.
  - Use Stripe Connect for marketplace-style payouts to connected accounts.

2) Bank account linking and verification
- Use Plaid (or similar) to allow users to link bank accounts securely and get a bank token you can use for ACH/debits or payouts.

3) Interac e-Transfer (Canada)
- Interac e-Transfer is typically available via partner banks or gateways; there is no single public API for generic e-Transfer.
- Work with your acquiring bank or a payments partner that exposes an Interac API. Expect KYC and compliance requirements.

4) Koho and other fintechs
- Koho is a regulated fintech; to integrate deposits or payouts you need a formal partnership or use Plaid-like linking plus a payout rail (Stripe, Dwolla, or bank ACH).

5) Direct deposits / payroll-like payouts
- Use payment processors that support bank transfers and payouts (Stripe Connect, PayPal Payouts, etc.).
- For high-volume or bank-level payouts, partner with an ACH/Bank provider.

Monitoring & Automation
- Run the server with a process manager (PM2) or as a service (systemd on Linux).
- Add health endpoints (e.g., `/health`) and use uptime monitoring (UptimeRobot, Healthchecks.io).
- Add logging (structured logs) and alerting (Sentry, Datadog, or similar).

Security & Compliance
- Never store raw bank account numbers or full PANs in plaintext.
- Use tokenization (providers like Stripe) and follow PCI/DSS and local banking regulations.

Next steps for me (pick):
- Wire Stripe + Plaid example server integration (I can scaffold server routes and show how to test in sandbox).
- Add health-check endpoint and a basic PM2 ecosystem file.
- Harden logging and add simple GitHub Actions workflow for build/deploy.
