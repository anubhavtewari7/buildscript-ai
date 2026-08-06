# BuildScript AI — Google Play Store Submission Package

---

## 1. App Identity (pre-filled from your config)

| Field | Value |
|---|---|
| **Package Name** | `com.buildscript.ai` |
| **App Name** | BuildScript AI |
| **Version Name** | 1.0.0 |
| **Version Code** | 1 |
| **Min SDK** | 22 (Android 5.1) — Capacitor 6 default |
| **Target SDK** | 34 (Android 14) — required for 2024+ Play submissions |

---

## 2. Store Listing Text

### Short Description (max 80 characters)
```
Your AI-powered automotive command centre. Diagnose. Maintain. Modify.
```
*(79 chars)*

### Full Description (max 4000 characters)
```
BuildScript AI puts a professional automotive intelligence suite in your pocket.

Whether you're a weekend enthusiast tracking mods on your daily driver, a DIY mechanic decoding a check-engine light, or someone who just wants to stay on top of routine maintenance — BuildScript is built for you.

──────────────────────────────────────────
FEATURES
──────────────────────────────────────────

🔍 OBD-II DIAGNOSTICS
Decode over 174 OBD-II fault codes instantly. Covers powertrain (P), chassis (C), body (B), and network (U) codes. Don't have a code reader? The universal decoder breaks down any valid OBD code structurally.

🛠 MAINTENANCE TRACKER
Never miss an oil change, tyre rotation, or brake inspection again. BuildScript tracks every service interval for each vehicle in your garage and alerts you when something is due.

🔧 MODIFICATIONS & STAGE PLANS
Browse and plan performance upgrades by category. Stage 1, Stage 2, and full-build plans laid out clearly so you know exactly what each upgrade involves and what to budget for.

🚗 VIRTUAL GARAGE
Build a custom profile for every vehicle you own. Track fuel type, mileage, health scores, and build history all in one place.

🏪 RECOMMENDED TOOLS
A curated store of professional-grade OBD readers, diagnostic tools, and accessories. Everything recommended by experienced mechanics.

📍 OBD PORT LOCATOR
Find your vehicle's OBD-II port location in seconds — no manual needed.

🆘 TOW SERVICES & REPAIR SHOPS
Broken down? Find the nearest tow truck or repair shop using live GPS location and Google Maps integration.

🛒 CHECKOUT & SAVED CARDS
Smooth in-app checkout for tools and accessories with saved payment methods.

🤖 AI CHAT (COMING SOON)
Conversational AI tuned for automotive questions — part codes, modification advice, diagnostic reasoning, and more. Launching soon.

──────────────────────────────────────────
BUILT FOR ENTHUSIASTS
──────────────────────────────────────────

BuildScript is designed with a premium dark UI optimised for use in a garage or workshop environment. Fast, focused, and distraction-free.

Clean interface. Powerful features. No bloat.

──────────────────────────────────────────
PRIVACY & SECURITY
──────────────────────────────────────────

• Secure Firebase Authentication
• Your vehicle data stays yours — never sold or shared
• GPS used only when actively finding nearby services
• Camera access used only for AI vehicle image analysis (coming soon)

Download BuildScript AI and take control of your vehicle today.
```
*(~1,850 chars — well within the 4,000 limit)*

---

## 3. App Categorisation

| Field | Value |
|---|---|
| **Category** | Auto & Vehicles |
| **Tags** | OBD, diagnostics, car maintenance, vehicle tracker, automotive |

---

## 4. Content Rating Questionnaire

Answer these in Play Console → **Policy → App content → Content ratings**:

| Question | Answer |
|---|---|
| Does the app contain violence? | No |
| Does the app contain sexual content? | No |
| Does the app contain profanity? | No |
| Does the app contain drug references? | No |
| Does the app allow user-generated content shared with others? | No |
| Does the app allow communication between users? | No |
| Does the app contain gambling? | No |
| Is the app designed for children under 13? | No |
| Does the app share location with others? | No |

**Expected rating: Everyone (E) / PEGI 3**

---

## 5. Privacy Policy

You need a live URL before submission. Options:

**Option A — Free generator (fastest)**
Go to: https://app-privacy-policy-generator.firebaseapp.com
Fill in:
- App name: BuildScript AI
- Company: your name / company
- Email: anubhav.tewari@slate.auto
- Check: Firebase Auth, Google Analytics (if used), Camera, Location

Then host the HTML on any free static host (GitHub Pages, Netlify, Firebase Hosting).

**Option B — Paste this minimal policy into a hosted page:**

```
Privacy Policy — BuildScript AI
Last updated: August 2026

BuildScript AI ("the app") is operated by [Your Name/Company].

DATA WE COLLECT
- Email address (for account creation via Firebase Auth)
- Vehicle data you enter (stored in Firestore, linked to your account)
- Approximate GPS location (only when using Tow Services or Find Shops; never stored)
- Device camera (only for AI vehicle image analysis; images are processed and discarded)

DATA WE DO NOT COLLECT
- We do not sell your data
- We do not share your data with third parties except as required to operate the app
  (Firebase/Google for auth and storage, Google Maps for location features)

THIRD PARTY SERVICES
- Google Firebase (auth + database): https://firebase.google.com/support/privacy
- Google Maps Platform: https://policies.google.com/privacy
- RevenueCat (payments): https://www.revenuecat.com/privacy

CONTACT
For privacy questions: anubhav.tewari@slate.auto
```

---

## 6. App Icon — Required Sizes for Android

Your source file is `public/icon.svg` (1024×1024 midnight indigo + white spark).

### Quickest method — Android Studio Image Asset wizard:
1. `npx cap open android`
2. In Android Studio: right-click `app/src/main/res/` → **New → Image Asset**
3. Source: **Local file** → select `public/icon.svg`
4. Layer name: `ic_launcher`
5. Background: `#0c0a2e` (midnight indigo)
6. Android Studio generates all sizes automatically

### Manual sizes (if needed):
| Density | Size | Folder |
|---|---|---|
| mdpi | 48×48 | `res/mipmap-mdpi/` |
| hdpi | 72×72 | `res/mipmap-hdpi/` |
| xhdpi | 96×96 | `res/mipmap-xhdpi/` |
| xxhdpi | 144×144 | `res/mipmap-xxhdpi/` |
| xxxhdpi | 192×192 | `res/mipmap-xxxhdpi/` |
| Play Store | 512×512 | Upload in Play Console |

For the **512×512 Play Store icon**: export `public/icon.svg` at 512×512 PNG using any image editor or https://svgtopng.com. Rounded corners are applied automatically by the Play Store.

---

## 7. Screenshots

Play Console requires at least **2 screenshots** for phones (16:9 or 9:16 portrait).
Recommended: 4–5 showing your best screens.

**Best screens to screenshot:**
1. Dashboard — vehicle health overview
2. OBD Diagnostics — code entry + result card
3. Modifications — stage build plan
4. Virtual Garage — vehicle profile
5. Find Shops / Tow Services — map list view

**How to take them:**
- Run `npm run cap:android` → deploy to Android emulator (Pixel 6 Pro profile recommended)
- In Android Studio emulator → camera icon (screenshot) → saves to Desktop
- Minimum size: 320×568px. Recommended: 1080×1920px

---

## 8. Step-by-Step Submission

### Phase 1 — Build the signed AAB

```bash
# In your project root:
npm run build
npx cap sync android
npx cap open android
```

In Android Studio:
1. **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle**
3. Click **Create new...** to create a keystore:
   - Key store path: save to somewhere permanent (e.g. `~/buildscript-release.jks`)
   - Key store password: strong password — save in 1Password/Bitwarden
   - Key alias: `buildscript`
   - Key password: same or different strong password
   - Validity: 25 years
   - Fill in at least First and Last Name
4. Select **release** build variant
5. Click **Finish** — AAB saved to `android/app/release/app-release.aab`

> ⚠️ CRITICAL: Back up `buildscript-release.jks` + both passwords immediately.
> If you lose the keystore you can NEVER update the app — you'd have to publish a new app from scratch.

---

### Phase 2 — Set up Google Play Console

1. Go to https://play.google.com/console
2. Create a developer account ($25 one-time fee, credit card required)
3. Click **Create app**
4. Fill in:
   - App name: `BuildScript AI`
   - Default language: English (United Kingdom) or English (United States)
   - App or game: **App**
   - Free or paid: **Free** (you can add subscriptions later via RevenueCat)
   - Agree to declarations
5. Click **Create app**

---

### Phase 3 — Fill in the store listing

In the left sidebar → **Grow → Store presence → Main store listing**:

- **App name:** `BuildScript AI`
- **Short description:** *(paste from Section 2 above)*
- **Full description:** *(paste from Section 2 above)*
- **App icon:** Upload your 512×512 PNG
- **Feature graphic:** 1024×500px banner (can be a simple dark gradient with your logo — or skip for now)
- **Screenshots:** Upload your phone screenshots (min 2)
- **Category:** Auto & Vehicles
- **Email address:** `anubhav.tewari@slate.auto`
- **Privacy policy URL:** *(your hosted privacy policy URL)*

---

### Phase 4 — Content rating

Left sidebar → **Policy → App content → Content ratings**
- Click **Start questionnaire**
- Category: **Utilities**
- Answer all questions per Section 4 above
- Submit → rating auto-generates as **Everyone**

---

### Phase 5 — App access

Left sidebar → **Policy → App content → App access**
- Select **All functionality is available without special access**
- (Your app has auth, so alternatively: select "Restricted" and provide a test account)
  - Test email: create a throwaway Firebase account
  - Test password: provide it

---

### Phase 6 — Upload the AAB

Left sidebar → **Testing → Internal testing** (start here, not Production)
1. Click **Create new release**
2. Upload your `app-release.aab`
3. Release name: `1.0.0`
4. Release notes: `Initial release of BuildScript AI.`
5. **Save → Review release → Start rollout**

Add yourself as an internal tester → install via the Play Store link → test thoroughly.

When happy: **Testing → Closed testing → Open testing → Production** (promote through tracks).

---

### Phase 7 — Production release

Left sidebar → **Release → Production**
1. Click **Create new release** (or promote from internal testing)
2. Review all warnings
3. **Send for review**

Google review time: **1–3 business days** for first submission.

---

## 9. Pre-Submission Checklist

- [ ] `npm run build` completes with zero TypeScript errors
- [ ] All `.env` values filled in (Firebase, Gemini, Google Maps, RevenueCat)
- [ ] `android/` project initialised: `npx cap add android` (if not done yet)
- [ ] App icon set via Android Studio Image Asset wizard
- [ ] Keystore created and backed up (`.jks` + both passwords)
- [ ] Signed `.aab` generated successfully
- [ ] Privacy policy hosted at a live URL
- [ ] Store listing text filled in (description, icon, screenshots)
- [ ] Content rating questionnaire completed
- [ ] Internal testing track install tested on a real device
- [ ] `versionCode` increments with every update (start at 1)

---

## 10. After Launch — Updating the App

Every update requires:
1. Increment `versionCode` in `android/app/build.gradle` (e.g. 1 → 2)
2. Update `versionName` to match (e.g. "1.0.1")
3. `npm run build && npx cap sync android`
4. Generate new signed AAB with the **same keystore**
5. Upload to Play Console → create new release in Production

---

*Generated for BuildScript AI — Package: com.buildscript.ai — v1.0.0*
