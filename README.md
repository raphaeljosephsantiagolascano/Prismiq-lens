# Prismiq — React Native (Expo)

A premium AI Scanner Suite built with **Expo + React Native + TypeScript**, ported
1:1 from the Prismiq web design. One shell, four themed lenses (PlateLens,
FreshLens, PlantLens, RockLens), each behaving like its own mini-app with its own
bottom tabs — all frontend, all mock data.

> This is the **native mobile** app (iOS + Android). The web version lives in the
> separate `app/` project (deployed to Vercel).

## What's inside

- **Draggable lens wheel** — hold-and-drag 3D glass carousel with spring snap
  (react-native-gesture-handler + Reanimated), tap-to-select, indicator dots,
  and a glow behind the active lens.
- **Dynamic per-lens bottom tabs** with a consistent elevated center Scan button
  that recolors per lens.
- **PlateLens (most complete):** Today calorie-ring dashboard, Calendar with
  per-day progress rings + meal/macro breakdown, searchable History, Goal
  calculator (Mifflin–St Jeor).
- **Shared Scan → Analyzing → Result flow:** floating macro badges fade/bob in
  during analysis; result screen has a confidence bar, color-coded macro cards,
  per-lens detail lists, cautions, and an interactive "Refine with Prismiq AI"
  chat (read-only summary when opened from history).
- **FreshLens / PlantLens / RockLens** — Discover/Care/Explore dashboards, lists,
  collections, reminders, compare, guides.
- **Settings** bottom sheet — scan-token usage per lens + **dark mode** (re-themes
  the whole app).
- **Glassmorphism system** ported to native: translucent tint surfaces, soft
  shadows, SVG radial glow blobs, per-lens accent theming, bundled Inter Tight.

Everything is driven by one config: `src/config/lenses.ts`.

## Run it

```bash
npm install
npx expo start          # scan the QR with Expo Go (iOS/Android), or press i / a
```

- `npx expo start --web` runs it in a browser too.
- Requires Node 18+. On a phone, install **Expo Go** from the App Store / Play Store.

## Deploy this app version to Vercel

This repo can be deployed to **Vercel as an Expo web build plus built-in API routes**.

```bash
npm install
npm run build:web
```

That exports the production web bundle into `dist/`.

Recommended Vercel settings:

- Framework preset: `Other`
- Build command: `npm run build:web`
- Output directory: `dist`

Required Vercel environment variables:

- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional, defaults to `gemini-2.5-flash`)
- `APP_SECRET` (optional, if you also set `EXPO_PUBLIC_APP_KEY`)

For the deployed web app, the scanner calls the same Vercel project at `/api/analyze`.

For mobile builds later, point the app at this Vercel backend:

```bash
EXPO_PUBLIC_API_URL=https://your-vercel-domain.vercel.app
```

This setup is already captured in [`vercel.json`](./vercel.json).

## Ship to the stores (EAS — no Mac required)

```bash
npm install -g eas-cli
eas login
eas build:configure

eas build --platform ios      && eas submit --platform ios      # App Store Connect
eas build --platform android  && eas submit --platform android  # Google Play
```

Bundle ID / package: **`com.prismiq.app`** (set in `app.json`).

## Project structure

```
App.tsx                     font loading + providers (gesture root, safe-area)
app.json                    Expo config: icon, splash, bundle id, plugins
src/
  config/
    lenses.ts               ★ the 4-lens config + mock data (single source of truth)
    types.ts
  state/
    AppState.ts             state shape + Mifflin–St Jeor estimateGoal()
    AppContext.tsx          provider: all handlers (switchMode, startScan, chat…)
  lib/
    theme.ts                light/dark theme tokens + ink(alpha) helper
    icons.tsx               react-native-svg icons (lens, tab, UI) via SvgXml
    color.ts
  components/
    AppShell.tsx            background, scroll region, nav slot, settings
    Background.tsx          SVG radial glow blobs + gradient wash
    Welcome.tsx
    LensWheel.tsx           draggable wheel (gesture-handler + Reanimated)
    BottomNav.tsx           dynamic per-lens tab bar
    CalorieRing.tsx         concentric SVG rings
    SettingsSheet.tsx       token usage + dark mode
    Shared.tsx / ui.tsx     GlassCard, UsageCard, buttons, Txt (fonts), etc.
    screens/                one file per screen (Plate*, Lens*, Scan, Result)
```

## Notes / TODOs for real backend later

- 100% frontend with mock data. Scans run a ~2.2s timer to a canned result.
- Wire real camera capture into the Scan screen and the result photo slot.
- Replace the mock `usage` counter with real per-day persistence.
- Feed live model output (e.g. Gemini) into `result` fields/lists per lens.
- Keep the nutrition / plant / stone disclaimers — Apple looks for these in
  health-adjacent apps.
