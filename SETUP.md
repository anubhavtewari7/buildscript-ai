# BuildScript AI — Setup Guide

## Prerequisites

- Node.js 18+
- npm 9+
- Android Studio (for Android builds)
- Xcode 15+ on a Mac (for iOS builds)

---

## Step 1 — Environment Variables

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

### Gemini API Key
1. Go to https://ai.google.dev
2. Click **Get API key** → Create a key
3. Paste it as `VITE_GEMINI_API_KEY`

### Firebase
1. Go to https://console.firebase.google.com
2. Create a new project (or use existing)
3. Go to **Project Settings** → **Your apps** → Add a Web app
4. Copy the config values into your `.env`
5. In Firebase Console, enable:
   - **Authentication** → Sign-in method → Enable **Email/Password**
   - **Firestore Database** → Create database (start in production mode)
6. Add this Firestore security rule:
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

### RevenueCat (for subscriptions)
1. Go to https://app.revenuecat.com and create a project
2. Add your app under **Apps** for both iOS and Android
3. Set up two **Entitlements**: `pro` and `premium`
4. Set up two **Products** in App Store Connect & Google Play Console:
   - `buildscript_pro_monthly` — $4.99/month
   - `buildscript_premium_monthly` — $15.99/month
5. Attach products to entitlements in RevenueCat
6. Copy API keys into `.env`

---

## Step 2 — Install Dependencies

```bash
npm install
```

---

## Step 3 — Run in Browser (Dev)

```bash
npm run dev
```

Open http://localhost:5173

---

## Step 4 — Build for Production

```bash
npm run build
```

---

## Step 5 — Android

```bash
# First build + sync
npm run cap:android
```

This opens Android Studio. Then:
1. Wait for Gradle sync to finish
2. Connect a device or start an emulator
3. Click **Run** (green play button)

For a release APK/AAB:
- Build → Generate Signed Bundle/APK
- Use your keystore (create one if needed)

---

## Step 6 — iOS (Mac only)

```bash
npm run cap:ios
```

This opens Xcode. Then:
1. Select your team in **Signing & Capabilities**
2. Change bundle ID from `com.buildscript.ai` to your own
3. Connect a device or use the simulator
4. Click **Run**

For App Store submission:
- Product → Archive
- Upload via Xcode Organizer

---

## App Store Submission Checklist

### Google Play
- [ ] App signing key generated and uploaded
- [ ] Store listing: screenshots (phone + tablet), icon (512px), feature graphic (1024x500)
- [ ] Content rating questionnaire completed
- [ ] Privacy policy URL added
- [ ] `buildscript_pro_monthly` and `buildscript_premium_monthly` in-app products created
- [ ] AAB (not APK) uploaded

### Apple App Store
- [ ] Bundle ID registered at developer.apple.com
- [ ] App Store Connect listing created
- [ ] Screenshots for 6.7" and 6.1" iPhones
- [ ] App icon (1024x1024, no alpha)
- [ ] Privacy policy URL
- [ ] In-App Purchase products created in App Store Connect
- [ ] RevenueCat Apple App connected and verified

---

## Project Structure

```
src/
  components/
    Navigation.tsx      # Bottom tab bar
    LoadingScreen.tsx   # Splash loading state
  pages/
    Welcome.tsx         # Onboarding + Firebase auth
    Dashboard.tsx       # Vehicle health + quick logs
    AIChat.tsx          # Gemini AI chat + image analysis
    DiagnosticTool.tsx  # OBD-II code analysis
    Modifications.tsx   # AI performance mods (Premium)
    Maintenance.tsx     # Service schedule tracker
    Profile.tsx         # Account + RevenueCat subscriptions
  services/
    firebase.ts         # Firebase app init
    auth.ts             # Firebase auth helpers
    db.ts               # Firestore CRUD
    gemini.ts           # All Gemini API calls
    purchases.ts        # RevenueCat IAP
  hooks/
    useAuth.ts          # Firebase auth state hook
  types.ts              # All TypeScript types
  App.tsx               # Root router + auth guard
  main.tsx              # Entry point + Capacitor init
```

---

## Key Notes

- **Gemini models used**: `gemini-2.5-pro` (diagnostics + mods), `gemini-2.5-flash` (chat + image analysis)
- **Subscriptions**: iOS/Android require in-app purchases — Stripe is NOT allowed for subscription revenue in App Store apps. RevenueCat handles this correctly.
- **Data**: All vehicle data and user profiles are stored in Firestore, not localStorage (except the maintenance schedule which is local per device).
- **Camera**: On native apps, uses Capacitor Camera plugin. Falls back to file input in browser.
