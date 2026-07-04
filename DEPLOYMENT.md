# Deploying Prismiq

The app lives in `app/`. It is one codebase with three targets:

| Target | How |
|---|---|
| Web (Vercel) | Vite static build (`app/dist`) |
| iOS App Store | Capacitor project in `app/ios` |
| Google Play | Capacitor project in `app/android` |

---

## 1. Host on Vercel (~5 minutes)

1. Go to [vercel.com](https://vercel.com) and sign in **with your GitHub account**.
2. Click **Add New → Project** and import `raphaeljosephsantiagolascano/Prismiq-lens`.
3. Vercel reads `vercel.json` from the repo root automatically — you don't need to
   change any settings. (It installs and builds inside `app/` and serves `app/dist`.)
4. Click **Deploy**. You'll get a URL like `https://prismiq-lens.vercel.app`.

Every future `git push` to `main` redeploys automatically.

---

## 2. iOS App Store (needs your Mac + Apple Developer account)

One-time setup on your Mac:

```bash
git clone https://github.com/raphaeljosephsantiagolascano/Prismiq-lens.git
cd Prismiq-lens/app
npm install
npm run build
npx cap sync ios
npx cap open ios        # opens the project in Xcode
```

In Xcode:

1. Click the **App** project in the sidebar → **Signing & Capabilities** tab.
2. Set **Team** to your Apple Developer team. Xcode manages certificates
   automatically. The bundle ID is already `com.prismiq.app`.
3. Pick **Any iOS Device (arm64)** as the run destination.
4. Menu **Product → Archive**. When the Organizer window opens, click
   **Distribute App → App Store Connect → Upload**.

In [App Store Connect](https://appstoreconnect.apple.com):

1. **My Apps → + → New App**: platform iOS, name **Prismiq**, bundle ID
   `com.prismiq.app`, any SKU (e.g. `prismiq-001`).
2. Fill in the listing: description, keywords, support URL (your Vercel URL
   works), screenshots (run the app in Simulator: iPhone 15 Pro Max for 6.7",
   then **File → Save Screen** — Apple requires 6.7" and 5.5" sets).
3. Under **App Privacy**, declare "Data Not Collected" (true for now — the app
   is fully local with mock data).
4. Select the build you uploaded, then **Submit for Review**.

Review notes worth adding: mention that scanning/AI analysis currently shows
demo data (the Gemini backend is not connected yet). Apple sometimes rejects
apps whose core feature looks non-functional — if that happens, the fix is to
wire up the real backend first.

### Updating the app later

```bash
git pull
npm run build && npx cap sync ios && npx cap open ios
```

Bump **Version** (and **Build**) in Xcode's General tab, archive, upload again.

---

## 3. Google Play (no Mac needed)

One-time: create a [Play Console](https://play.google.com/console) developer
account ($25 once).

Build the signed bundle (any OS with Android Studio):

```bash
cd Prismiq-lens/app
npm install && npm run build && npx cap sync android
npx cap open android     # opens Android Studio
```

In Android Studio: **Build → Generate Signed App Bundle** → create a keystore
(keep it safe forever — losing it means you can never update the app) → build
the `.aab`.

In Play Console: **Create app** → name **Prismiq**, package `com.prismiq.app`
→ upload the `.aab` under **Production → Create new release** → fill in the
store listing + content rating questionnaire → submit.

---

## Icons & splash screens

Already generated and committed (all iOS sizes, all Android densities, PWA
icons). To regenerate after changing the logo, edit `app/assets/icon.svg`
and `app/assets/splash*.svg`, then:

```bash
cd app
node -e "const s=require('sharp');(async()=>{await s('assets/icon.svg').resize(1024,1024).png().toFile('assets/icon.png');await s('assets/splash.svg').resize(2732,2732).png().toFile('assets/splash.png');await s('assets/splash-dark.svg').resize(2732,2732).png().toFile('assets/splash-dark.png');})()"
npx capacitor-assets generate --iconBackgroundColor '#1E9B54' --iconBackgroundColorDark '#12341f' --splashBackgroundColor '#ffffff' --splashBackgroundColorDark '#0d0f14'
```

---

## Before you ship for real

- The app is currently **frontend-only with mock data** — scans show canned
  results after a fake 2-second analysis. Connect the real AI backend
  (e.g. Gemini) before charging users or making health claims.
- Nutrition/plant/stone disclaimers are already in the UI (Apple looks for
  these in health-adjacent apps).
- `com.prismiq.app` becomes permanent the moment you first publish on each
  store.
