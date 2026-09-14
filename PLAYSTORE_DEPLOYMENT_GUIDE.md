# 🚀 Google Play Store Deployment Guide for Interview Puzzles

This guide provides everything you need to upload and publish **Interview Puzzles** to the **Google Play Console**.

---

## 📦 1. Pre-built Release Files in Your Project Root

All necessary store assets and release binaries have been generated and placed in your project folder (`c:\Users\Suraj\Downloads\Interview_Puzzle`):

| File Name | Description | Where to Use on Play Console |
| :--- | :--- | :--- |
| `INTERVIEW_PUZZLES_PLAYSTORE_RELEASE.aab` | **Cryptographically Signed Release App Bundle** | **Production / Testing Releases** |
| `PLAYSTORE_ICON_512.png` | **512 × 512 px High-Res App Icon** | **Store Listing > App Icon** |
| `PLAYSTORE_FEATURE_GRAPHIC_1024x500.png` | **1024 × 500 px Feature Banner** | **Store Listing > Feature Graphic** |
| `APP_ICON_SQUIRCLE_512.png` | **512 × 512 px Squircle Icon** | Marketing, website, and GitHub |
| `INTERVIEW_PUZZLES_DEBUG.apk` | **Direct Install Debug APK** | Test directly on any phone without store |

---

## 🔑 2. Release Signing Keystore Information

Your release bundle is already signed with the newly created keystore:

- **Keystore File:** `android/app/release-key.jks`
- **Key Alias:** `interviewpuzzles`
- **Keystore Password:** `interviewpuzzles2026`
- **Key Password:** `interviewpuzzles2026`
- **Validity:** 10,000 days (~27 years)

> ⚠️ **Important:** Keep `release-key.jks` backed up safely! Google Play requires this key for all future updates of your app.

---

## 🛠️ 3. Step-by-Step Play Store Upload Process

### Step 1: Open Google Play Console
1. Go to [play.google.com/console](https://play.google.com/console).
2. Log in with your Google Developer account.
3. Click **Create app** (top right).

### Step 2: Basic App Details
- **App name:** `Interview Puzzles: Technical FAANG Prep`
- **Default language:** `English (United States) - en-US`
- **App or Game:** `Game` (or `App` > `Education`)
- **Free or Paid:** `Free`
- Accept the Developer Program Policies and US export laws checkboxes, then click **Create app**.

### Step 3: Set Up Main Store Listing
Navigate to **Grow > Store presence > Main store listing**:
1. **App icon:** Drag and drop `PLAYSTORE_ICON_512.png`.
2. **Feature graphic:** Drag and drop `PLAYSTORE_FEATURE_GRAPHIC_1024x500.png`.
3. **Short description:**
   > *Master 25 FAANG & Wall Street technical interview puzzles with interactive simulations and visual proofs.*
4. **Full description:**
   ```text
   Level up your algorithmic intuition and cognitive problem-solving with Interview Puzzles!

   Engineered for software engineers, quant traders, and tech candidates preparing for technical interviews at Google, Meta, Amazon, Apple, Microsoft, Netflix, and top trading firms.

   ✨ KEY FEATURES:
   • 25 Curated FAANG Interview Challenges: From classic balance scale weighing to dynamic coin games and graph invariants.
   • Interactive Visual Simulations: Test hypotheses and experiment in real-time.
   • Tiered Difficulty Roadmap: Master Easy Fundamentals, Medium Core FAANG, and Hard Staff-level challenges.
   • Progressive Hint System: Learn step-by-step without spoiling the core breakthrough.
   • Formal Proofs & Invariants: Deep algorithmic insights and interview takeaways explained clearly.
   • Offline Ready & Safe-Area Polished: Seamless mobile experience.
   ```
5. **Phone Screenshots:** Upload 2–8 screenshots from the app (you can take screenshots on your phone or use the inspection captures in your project).

### Step 4: Complete Policy Declarations
Under **Manage > Policy and programs > App content**:
- **Privacy policy:** Provide a link or hosted GitHub Pages privacy policy.
- **Target audience:** Ages 13+ or 18+.
- **Ads:** Select "No, my app does not contain ads" (or Yes if you add them later).
- **Data safety:** Fill out the questionnaire (no sensitive personal data collected).

### Step 5: Upload the Release Bundle
1. In the left menu, go to **Release > Production** (or **Internal testing** for immediate verification).
2. Click **Create new release**.
3. Choose **Google Play App Signing** (Use Google-generated key or keep your uploaded key).
4. In **App bundles**, click **Upload** and select:
   `INTERVIEW_PUZZLES_PLAYSTORE_RELEASE.aab`
5. Release name: `1.0.0 (1)`.
6. Release notes:
   ```text
   Initial launch of Interview Puzzles!
   - 25 FAANG & Wall Street technical interview challenges with interactive simulations.
   - 3-tier progressive difficulty roadmap.
   - Brand new official icon and streamlined candidate profile portal.
   ```
7. Click **Next**, review the release checks, and click **Save** / **Start rollout to Production**!

---

## 📱 4. Installing Directly on Your Phone (Debug APK)

If you want to install and play the updated version on your phone right now before store review:

1. Connect your Android phone via USB cable and enable **USB Debugging**.
2. Run in terminal:
   ```powershell
   & "C:\Users\Suraj\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r INTERVIEW_PUZZLES_DEBUG.apk
   ```
3. Or simply transfer `INTERVIEW_PUZZLES_DEBUG.apk` to your phone via Google Drive, WhatsApp, or USB cable, tap on it, and install!
