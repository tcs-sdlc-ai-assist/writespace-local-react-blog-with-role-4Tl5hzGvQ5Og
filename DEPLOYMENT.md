# Deployment Guide — WriteSpace

## Platform: Vercel

This guide covers deploying the WriteSpace application to Vercel.

---

## Prerequisites

- A [Vercel](https://vercel.com) account
- The [Vercel CLI](https://vercel.com/docs/cli) installed (optional, for CLI-based deploys):
  ```bash
  npm i -g vercel
  ```
- Node.js 18+ installed locally
- The project repository pushed to GitHub, GitLab, or Bitbucket (for Git-based deploys)

---

## Build Configuration

| Setting          | Value     |
| ---------------- | --------- |
| Framework Preset | Vite      |
| Build Command    | `npm run build` |
| Output Directory | `dist`    |
| Install Command  | `npm install`   |

When importing the project into Vercel via the dashboard, Vercel should auto-detect the Vite framework. If it does not, set the values above manually in **Project Settings → General → Build & Development Settings**.

---

## SPA Rewrite Configuration

WriteSpace is a single-page application (SPA) using client-side routing. All routes must resolve to `index.html` so that the React router can handle navigation. Create a `vercel.json` file in the project root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures that direct URL access (e.g., navigating directly to `/posts/123` or refreshing the page on a nested route) serves the SPA entry point instead of returning a 404.

---

## Environment Variables

**No environment variables are required.** WriteSpace uses browser `localStorage` for data persistence and does not connect to any external APIs or databases. There is nothing to configure in the Vercel dashboard under **Project Settings → Environment Variables**.

If you extend the application in the future to use external services, add variables prefixed with `VITE_` so they are exposed to the client bundle via `import.meta.env.VITE_*`.

---

## Deploying

### Option 1: Git Integration (Recommended)

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Confirm the build settings (see table above).
4. Click **Deploy**.

Every subsequent push to the `main` branch will trigger a production deployment automatically. Pull requests will generate preview deployments.

### Option 2: Vercel CLI

From the project root:

```bash
# First-time setup — links the project to Vercel
vercel

# Production deployment
vercel --prod
```

---

## Troubleshooting

### Direct URL access returns 404

**Cause:** The `vercel.json` rewrite rule is missing or misconfigured.

**Fix:** Ensure `vercel.json` exists in the project root with the SPA rewrite configuration shown above. Redeploy after adding the file.

### Blank page after deployment

**Cause:** The `base` path in `vite.config.ts` may be set incorrectly, or assets are not being resolved.

**Fix:**
- Ensure `vite.config.ts` does not set a custom `base` unless you are deploying to a subdirectory.
- Open the browser developer console and check for 404 errors on JS/CSS assets.
- Verify the **Output Directory** is set to `dist` in Vercel project settings.

### Build fails with TypeScript errors

**Cause:** Type errors that may not surface during local development with `vite dev` (which skips type checking).

**Fix:** Run `npx tsc --noEmit` locally to surface all type errors before pushing. Fix any reported issues and redeploy.

### Stale content after deployment

**Cause:** Browser or CDN caching.

**Fix:** Hard-refresh the page (`Ctrl+Shift+R` / `Cmd+Shift+R`). Vite's default build output uses content-hashed filenames, so new deployments should bust the cache automatically for JS and CSS assets.

---

## CI/CD Notes

- **Automatic deployments:** When connected via Git integration, Vercel builds and deploys on every push to the production branch (`main` by default). No additional CI/CD pipeline is required.
- **Preview deployments:** Every pull request or branch push generates a unique preview URL. Use these to verify changes before merging.
- **Build caching:** Vercel caches `node_modules` between builds. If you encounter stale dependency issues, trigger a redeployment with the cache cleared via **Project Settings → Deployments → Redeploy** with the "Clear Build Cache" option checked.
- **Custom CI pipelines:** If you use GitHub Actions or another CI system alongside Vercel, you can run linting and tests in CI and let Vercel handle only the build and deploy step. Use the Vercel GitHub integration's "Ignored Build Step" setting or a `vercel.json` `ignoreCommand` to skip redundant builds if needed.

---

## Useful Commands Reference

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Start local development server       |
| `npm run build`      | Production build to `dist/`          |
| `npm run preview`    | Preview production build locally     |
| `npx tsc --noEmit`   | Type-check without emitting files    |
| `vercel`             | Deploy to preview                    |
| `vercel --prod`      | Deploy to production                 |