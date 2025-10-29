<div align="center">
  <img src="https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/next.svg" alt="Next.js" width="72" height="72" />
  <h1>AetherVPN Command Center</h1>
  <p>Real-time IP intelligence and VPN fleet orchestration dashboard built with Next.js 14 + Tailwind.</p>
</div>

## Quick Start

```bash
npm install
npm run dev
```

Deploy instantly to Vercel:

```bash
npx vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-7e800983
```

## Features

- Live IP telemetry with automatic refresh every 30s (ipapi/ipwho.is fallback)
- Carrier, geofence, and coordinate insights rendered in a cinematic glassmorphism UI
- Interactive VPN server matrix with load/latency indicators and status tagging
- Tailwind-powered theming, custom brand colors, and global background effects
- Strict TypeScript config, ESLint (Next core-web-vitals), and modern Next.js app router

## Tech Stack

- Next.js 14 (App Router)
- React 18 with client components
- Tailwind CSS 3.4
- TypeScript 5

## Project Structure

```
.
├─ app/               # App router entrypoints
│  ├─ layout.tsx      # Global layout / metadata
│  ├─ page.tsx        # Main dashboard
│  └─ globals.css     # Tailwind + custom styles
├─ lib/
│  └─ vpnServers.ts   # Server fleet metadata
├─ public/            # Static assets (drop logos/fonts here)
├─ tailwind.config.ts # Tailwind theme
├─ tsconfig.json      # TS compiler opts + path aliases
└─ next.config.mjs    # Next.js configuration
```

## Scripts

- `npm run dev` – start local dev server
- `npm run build` – create production build
- `npm run start` – serve production build locally
- `npm run lint` – run ESLint (Next defaults)

## Customization Ideas

- Add auth + user profiles for multi-device session management
- Wire up WebSockets for sub-second telemetry streaming
- Integrate billing / plan management for VPN subscriptions
- Connect to real VPN provisioning APIs for live server metrics

## License

MIT © AetherVPN Labs
