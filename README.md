# Mythicam: Unified Digital Portfolio Platform 🚀

This is the production-ready Next.js application for Mythicam, featuring real AI generation, Supabase authentication, and a "Zero Bot" real-data policy.

## 🛠️ Setup & Deployment

### 1. Environment Variables
You must update `.env.local` with your actual credentials before the app will work.



### 2. Database Schema
Run the contents of `schema.sql` in your Supabase SQL Editor to create the necessary tables and policies.

- **`generations`**: Stores prompt and image URLs.
- **`profiles`**: Stores user data (linked to Auth).
- **`site_stats`**: Stores global metrics (Revenue, MRR).

### 3. Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

### 4. Admin Access
- To access the Dashboard, you must log in at `/login`.
- The dashboard is protected by Middleware and will redirect unauthenticated users.

### 5. Deployment
This project is optimized for Vercel.
1. Push to GitHub.
2. Import project in Vercel.
3. Add the Environment Variables in Vercel Project Settings.
4. Deploy.

---
**Note**: All analytics counters start at 0. This is intentional to reflect real business growth.
