# Setup Guide

## Prerequisites
- Node.js 18+
- A Supabase account (free tier works)
- A Vercel account (for deployment)

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Fill in your `.env`:
- `VITE_SUPABASE_URL` — from Supabase project Settings → API
- `VITE_SUPABASE_ANON_KEY` — from Supabase project Settings → API
- `VITE_ADMIN_PASSWORD` — choose a strong password

### 3. Set up Supabase database
1. Go to your Supabase project → SQL Editor
2. Paste and run the contents of `supabase/schema.sql`
3. Confirm the analytics tables appear in the Table Editor
4. Apply the later migrations so `portfolio_projects` exists for the public site and admin editor

### 4. Run the dev server
```bash
npm run dev
```
Visit `http://localhost:5173`

---

## Before You Ship

### Update your content
- `src/data/profile.json` — your name, title, bio, and social links
- `src/data/projects.json` — fallback/seed source for `portfolio_projects`
- `public/resume.pdf` — add your actual resume PDF
- `public/favicon.svg` — update initials from `YN` to yours
- `index.html` — update `<title>` and `<meta name="description">`

### Deploy to Vercel
See `docs/DEPLOYMENT.md` (generated in App Hardening phase).

---

## Admin Portal
Visit `/admin` on the live site. Enter `VITE_ADMIN_PASSWORD` to access.
Not linked anywhere publicly — share the URL only with yourself.
