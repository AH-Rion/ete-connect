## Fix Vercel Deployment

Since you didn't share the specific error, here's a plan covering the most common Vercel deployment failures for this project.

### Likely causes
1. **TypeScript/build errors** — recent edits (EventGallery, GalleryPage, AdminEventGallery) may have type errors that Vite ignores locally but Vercel's build catches.
2. **Missing environment variables** on Vercel — the external Supabase URL is hardcoded in `client.ts`, but `cloudClient.ts` uses `VITE_SUPABASE_*` env vars that must exist at build time.
3. **SPA routing** — already handled via `vercel.json` rewrites ✓
4. **Node/package version mismatch** — no `engines` field in package.json.

### Steps
1. Run a local production build to reproduce Vercel's failure (`npm run build`) and capture the exact error.
2. Fix any TypeScript/build errors surfaced (most likely in the newly added `GalleryPage.tsx`, `EventGallery.tsx`, `AdminEventGallery.tsx`).
3. Ensure `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` are set in Vercel project settings (these are normally in `.env` but Vercel needs them added in the dashboard). I'll also add safe fallbacks in `cloudClient.ts` if missing.
4. Add an `engines` field to `package.json` pinning a Node version Vercel supports (e.g., 20.x) to avoid mismatch.
5. Re-deploy and verify.

### What I need from you
- **Paste the Vercel build log error** (Deployments → failed deployment → Build Logs). Without it I'll start with step 1 (reproduce the build locally) and fix whatever surfaces.
- Confirm whether you've added the `VITE_SUPABASE_*` env vars in **Vercel → Project Settings → Environment Variables**.

### Technical notes
- `.env` is **not** committed/used by Vercel — env vars must be configured in the Vercel dashboard.
- The external Supabase URL in `src/integrations/supabase/client.ts` is hardcoded, so that part will work without env vars.
- `vercel.json` SPA rewrites are already correct.
