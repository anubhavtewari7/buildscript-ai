# BuildScript — Automotive Intelligence

A premium mobile-first automotive app built with React 18 + TypeScript + Vite + Capacitor.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS v4, Vite 8 |
| Native | Capacitor 6 (iOS + Android) |
| Auth + DB | Firebase 10 (Auth + Firestore) |
| AI | Google Gemini 2.0 Flash Lite |
| Payments | RevenueCat (IAP) |
| Maps | Google Places API |

---

## Features

| Feature | Status |
|---|---|
| Onboarding + Auth (sign up / login) | ✅ Live |
| Dashboard — vehicle health, oil/tire/EV logging | ✅ Live |
| OBD-II Diagnostics — 174 codes + universal decoder | ✅ Live |
| Modifications + Stage build plans | ✅ Live |
| Maintenance tracker (localStorage) | ✅ Live |
| Virtual Garage — custom build visualizer | ✅ Live |
| Recommended Tools store | ✅ Live |
| OBD Port Locator | ✅ Live |
| Checkout + saved cards | ✅ Live |
| Tow Services (GPS + Google Places) | ✅ Live |
| Find Shops Near Me (GPS + Google Places) | ✅ Live |
| Terms & Privacy | ✅ Live |
| AI Chat | 🔜 Coming Soon |

---

## Quick Start (Development)

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.example .env

# 3. Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables

Create a `.env` file at the project root (see `.env.example`):

```env
# Gemini AI — https://ai.google.dev (free tier)
VITE_GEMINI_API_KEY=your_key_here

# Firebase — https://console.firebase.google.com
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Google Maps Places API — needed for Tow Services + Find Shops
# https://console.cloud.google.com → Enable "Places API"
VITE_GOOGLE_MAPS_API_KEY=

# RevenueCat — fill in before App Store / Play Store submission
VITE_REVENUECAT_APPLE_KEY=
VITE_REVENUECAT_GOOGLE_KEY=
```

> **Without `VITE_GOOGLE_MAPS_API_KEY`:** Tow Services and Find Shops gracefully fall back to opening Google Maps in the browser. Everything else works fully without it.

---

## Production Build (Web)

```bash
npm run build
```

Output goes to `dist/`. Deploy to any static host (Vercel, Netlify, Firebase Hosting, etc.).

For Firebase Hosting:
```bash
npm run build
firebase deploy --only hosting
```

---

## iOS Deployment

### Prerequisites
- macOS with Xcode 15+
- Apple Developer account ($99/yr)
- CocoaPods: `sudo gem install cocoapods`

### Steps

```bash
# 1. Build web assets
npm run build

# 2. Sync to iOS
npx cap sync ios

# 3. Open in Xcode
npx cap open ios
```

In Xcode:
1. Select your team under **Signing & Capabilities**
2. Set Bundle Identifier (e.g. `com.yourname.buildscript`)
3. **Product → Archive** to create a release build
4. Upload to App Store Connect via the Organizer

### App Icon
Replace the placeholder icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset/` with exports of `public/icon.svg` at the required sizes (1024×1024 for App Store, plus all device sizes).

Use an icon generator: https://appicon.co — upload `public/icon.svg`, download the set, drag into Xcode.

---

## Android Deployment

### Prerequisites
- Android Studio (latest)
- Google Play Developer account ($25 one-time)

### Steps

```bash
# 1. Build web assets
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Open in Android Studio
npx cap open android
```

In Android Studio:
1. **Build → Generate Signed Bundle / APK**
2. Create a keystore (keep it safe — you can never change it)
3. Choose **Android App Bundle (.aab)** for Play Store
4. Upload the `.aab` to Google Play Console

### App Icon
In Android Studio, right-click `res/` → **New → Image Asset** → upload `public/icon.svg`.

---

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project
3. Enable **Authentication** → Email/Password
4. Enable **Firestore** → Start in production mode
5. Add Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. Copy the config values into your `.env`

---

## Google Places API (optional)

Powers the "Tow Services" and "Find Shops Near Me" features.

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Places API**
3. Create an API key → restrict to your app's bundle ID / domain
4. Add to `.env` as `VITE_GOOGLE_MAPS_API_KEY`

> Without this key the features still work — they open Google Maps directly instead of showing an in-app list.

---

## RevenueCat (Subscriptions)

1. Create a [RevenueCat](https://revenuecat.com) account
2. Set up your iOS and Android apps
3. Create products in App Store Connect / Google Play Console
4. Link them in RevenueCat
5. Copy the SDK keys into `.env`

---

## Project Structure

```
src/
├── assets/             Static assets
├── components/
│   ├── LoadingScreen.tsx
│   ├── Logo.tsx         BuildScript logo system (mark + wordmark + app icon)
│   └── Navigation.tsx   Bottom tab bar
├── data/
│   └── obdCodes.ts      174 OBD-II codes + universal structural decoder
├── hooks/
│   └── useAuth.ts       Firebase auth state
├── pages/
│   ├── AIChat.tsx        Coming Soon screen
│   ├── Checkout.tsx
│   ├── Dashboard.tsx
│   ├── DiagnosticTool.tsx
│   ├── Maintenance.tsx
│   ├── Modifications.tsx
│   ├── NearbyShops.tsx
│   ├── OBDPortLocator.tsx
│   ├── PaymentSuccess.tsx
│   ├── Profile.tsx
│   ├── RecommendedTools.tsx
│   ├── TermsPrivacy.tsx
│   ├── TowService.tsx
│   ├── VirtualGarage.tsx
│   └── Welcome.tsx
├── services/
│   ├── auth.ts          Firebase auth helpers
│   ├── db.ts            Firestore helpers
│   ├── gemini.ts        Gemini AI (chat, diagnostics, image analysis)
│   └── purchases.ts     RevenueCat IAP
├── types.ts             Shared TypeScript types
└── vite-env.d.ts        Vite env typing
public/
├── icon.svg             1024×1024 app icon (midnight indigo + white spark)
└── logo.svg             Full wordmark SVG
```

---

## Pre-Launch Checklist

- [ ] All `.env` values filled in
- [ ] Firebase Firestore security rules set
- [ ] App icon exported at all required sizes
- [ ] Bundle ID / package name set (iOS + Android)
- [ ] RevenueCat products linked
- [ ] Privacy Policy URL updated in `TermsPrivacy.tsx`
- [ ] `npm run build` completes with no errors
- [ ] Test on real device (not just browser) before submission
- [ ] Enable HTTPS on your web deployment (required for GPS)
