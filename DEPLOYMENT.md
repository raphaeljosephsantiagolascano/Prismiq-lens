# Deploying Prismiq

Prismiq has two frontends:

| Target | Codebase | How it ships |
|---|---|---|
| Web (Vercel) | `app/` — React + Vite | Static build (`app/dist`) |
| iOS App Store + Google Play | `mobile/` — Expo React Native | EAS cloud builds (no Mac required) |

> The `mobile/` Expo app is delivered separately (zip) and can be added to this
> repo later. The Capacitor projects that briefly lived in `app/ios` and
> `app/android` were removed in favor of React Native.

---

## 1. Host the web app on Vercel (~5 minutes)

1. Go to [vercel.com](https://vercel.com) and sign in **with your GitHub account**.
2. Click **Add New → Project** and import `raphaeljosephsantiagolascano/Prismiq-lens`.
3. Vercel reads `vercel.json` from the repo root automatically — you don't need to
   change any settings. (It installs and builds inside `app/` and serves `app/dist`.)
4. Click **Deploy**. You'll get a URL like `https://prismiq-lens.vercel.app`.

Every future `git push` to `main` redeploys automatically.

---

## 2. App stores via the Expo app (`mobile/`)

The React Native app is built and submitted with **EAS (Expo Application
Services)** — cloud builds, so you don't need a Mac even for iOS.

One-time setup:

```bash
cd mobile
npm install
npm install -g eas-cli
npx expo start          # test locally with the Expo Go app on your phone
eas login               # free Expo account
eas build:configure
```

### iOS App Store

```bash
eas build --platform ios          # cloud-builds a signed .ipa (guides you through Apple login)
eas submit --platform ios         # uploads straight to App Store Connect
```

Then in [App Store Connect](https://appstoreconnect.apple.com): create the app
listing (name **Prismiq**, bundle ID `com.prismiq.app`), add description,
screenshots, privacy info ("Data Not Collected" — the app is fully local),
select the uploaded build, and Submit for Review.

### Google Play

```bash
eas build --platform android      # cloud-builds a signed .aab
eas submit --platform android     # or upload the .aab manually in Play Console
```

In [Play Console](https://play.google.com/console): create the app (package
`com.prismiq.app`), upload the `.aab` in a Production release, complete the
store listing + content rating, and submit.

---

## Before you ship for real

- The app is currently **frontend-only with mock data** — scans show canned
  results after a fake 2-second analysis. Connect the real AI backend
  (e.g. Gemini) before charging users or making health claims.
- Nutrition/plant/stone disclaimers are already in the UI (Apple looks for
  these in health-adjacent apps).
- `com.prismiq.app` becomes permanent the moment you first publish on each
  store.
