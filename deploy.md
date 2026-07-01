# 🚀 Roast My Landing Page — Deploy Checklist

## Step 1: GitHub OAuth (2 min)

1. Go to **https://github.com/settings/developers**
2. Delete the old "RoastMyLP" app if it exists
3. Click **New OAuth App**:
   - **Application name:** `RoastMyLP`
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. **Register Application** → **Generate a new client secret**
5. Copy both Client ID + Secret → update `.env`

## Step 2: Push to GitHub (2 min)

1. Go to **https://github.com/new** — name it `roast-my-landing-page`
2. **DO NOT** check "Add README" (repo must be empty)
3. Copy the repo URL and run in terminal:
   ```
   cd roast-my-landing-page
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main
   ```

## Step 3: Deploy to Vercel (3 min)

1. Go to **https://vercel.com** — Sign in with GitHub
2. **Add New → Project** → Import `roast-my-landing-page`
3. Copy ALL values from `.env` into Vercel's Environment Variables
4. Deploy!

## Step 4: Post-Deploy

1. Update **GitHub OAuth app** callback URL to `https://your-domain.vercel.app/api/auth/callback/github`
2. Update **NEXTAUTH_URL** in Vercel to `https://your-domain.vercel.app`
3. Configure **Paddle webhook** endpoint: `https://your-domain.vercel.app/api/paddle/webhook`
4. Add remaining Paddle price IDs (Pro, Agency, Full Audit, etc.)

---

## What's Already Done

- ✅ 17 routes (pages + API)
- ✅ AI Roast Engine (GPT-4o-mini)
- ✅ Paddle payments integration (MoR)
- ✅ 3-level referral system (50/30/20%)
- ✅ Dark-themed brutalist UI
- ✅ 4x build verified, 0 errors
- ✅ Prisma 7 + LibSQL database
- ✅ JWT auth strategy (compatible with Prisma 7)
- ✅ Mobile responsive (Tailwind)
- ✅ SEO optimized

## Files

| File | Purpose |
|---|---|
| `roast-my-landing-page/` | Complete Next.js project |
| `.env` | All API keys (7/7 configured) |
| `vercel.json` | Vercel deploy config |
| `.env.example` | Environment variables template |
