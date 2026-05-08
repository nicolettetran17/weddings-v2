# weddings-v2

Static prototype of **All In Weddings**, deployed via Vercel.

This repo bundles two things that live as siblings in development:

```
weddings-v2/
├── aiw-prototype/        # Homepage + planner (index.html, plan.html)
├── rcd-design-system/    # Tokens, fonts, logos, sample components
├── index.html            # Root splash / redirect to /aiw-prototype/
└── vercel.json           # cleanUrls + no trailing slash
```

## What's inside the prototype

**Homepage** (`/aiw-prototype/index.html`)
- Cinematic hero with self-hosted Nobu Los Cabos beach-wedding video
  (`assets/videos/nobu-hero.mp4`), muted + looped, with a still-photo poster
  fallback for `prefers-reduced-motion`
- "Imagine yourself here" headline + chat-style date / region capture
- Live social-proof card on date selection
- Interactive investment spectrum keyed to the portfolio carousel
- "Real couples, real bookings" stories
- Animated reveals (Ken Burns, scroll reveals, headline flourish, CTA shimmer)

**Planner** (`/aiw-prototype/plan.html`)
- Allie chat with collapsible "Your journey" header above the thread
- Default 7-step flow (Moodboard → Logistics → Venue → Space → Add-ons → Proposal → Save my date)
- Expedited "I'm ready to book" 5-stop flow (Venue → Space → Vendors → Proposal → Save my date)
- Vendor marketplace add-ons (categorized, vendor + tagline)
- Proposal page (Figma 310:2): transparent breakdown, dark summary, one-click "Save my date"
- Save My Date page (Figma 290:392): live 24-hour hold countdown, three time-bonus perks (free dance floor 5h, room block discount 10h, free couples massage 12h), "X brides looking now" social pressure pulse, swipe-to-lock thumb, confetti

## Local preview

```sh
# any static server works; e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

This repo deploys cleanly to Vercel as-is (no build step).
- Framework preset: **Other**
- Root directory: `./`
- Build command: *(none)*
- Output directory: *(none — Vercel serves the repo root)*
