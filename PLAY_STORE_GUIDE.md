# 📱 Google Play Store Publishing Guide for PuzzleMaster

Your project is now fully configured as a **native Android app** that can be opened directly in **Android Studio** and published to the **Google Play Store**.

---

## 🚀 Quick Step 1: Open the Project in Android Studio

Since you already have Android Studio open:

1. Click **File** ➔ **Open...** (or click *Open* on the Android Studio Welcome Screen).
2. Browse to and select this exact folder:
   ```
   c:\Users\Suraj\Downloads\Interview_Puzzle\android
   ```
3. Click **OK**.
4. Android Studio will open the project and automatically run the initial Gradle Sync using the pre-configured JDK (`Open JDK 21`).

---

## 🎮 Quick Step 2: Test & Run on Emulator or Physical Phone

1. **Physical Phone (via USB or Wi-Fi):**
   - Enable **Developer Options** and **USB Debugging** on your Android phone.
   - Plug your phone into your PC with a USB cable.
   - In Android Studio's top toolbar device selector, your phone model will appear.
   - Click the green **Run ▶** button (or press `Shift + F10`).
2. **Virtual Device (Android Emulator):**
   - Click **Tools** ➔ **Device Manager** ➔ **Create Device** (e.g. Pixel 8 / Pixel 9).
   - Select the device and click the green **Run ▶** button.

The app will install and open with full hardware acceleration, sound effects, and native performance!

---

## 📦 Quick Step 3: Generate Signed Android App Bundle (`.aab`) for Google Play

Google Play Console requires an **Android App Bundle (`.aab`)** for all new apps.

### Method A: Through Android Studio UI (Recommended)

1. In Android Studio's top menu, click:
   **Build** ➔ **Generate Signed Bundle / APK...**
2. Select **Android App Bundle** and click **Next**.
3. **Key store path:**
   - If this is your first time creating a key:
     - Click **Create new...**
     - Choose a secure file destination (e.g., `C:\Users\Suraj\puzzlemaster-release.jks`).
     - Enter a password for the keystore and key.
     - Alias: `puzzlemaster`
     - Validity: `25` years.
     - First and Last Name: Your Name.
     - Click **OK**.
   - If you already created a key, browse to select it and enter passwords.
4. Select destination folder and choose **release** build variant.
5. Click **Create** (or **Finish**).
6. Android Studio will build the signed `.aab` file! A notification popup in the bottom right will show:
   *`App bundle(s) generated successfully: [Locate]`*.

---

### Method B: Via Terminal / NPM Scripts

Whenever you make updates to your web code, sync and build with:

```bash
# 1. Update web assets and sync with native Android:
npm run android:sync

# 2. Build Release Bundle (.aab):
npm run android:bundle

# 3. Or build Debug APK for quick sideloading:
npm run android:apk
```

Your generated files are located at:
- **Play Store AAB:** [`android/app/build/outputs/bundle/release/app-release.aab`](file:///c:/Users/Suraj/Downloads/Interview_Puzzle/android/app/build/outputs/bundle/release/app-release.aab)
- **Direct Test APK:** [`android/app/build/outputs/apk/debug/app-debug.apk`](file:///c:/Users/Suraj/Downloads/Interview_Puzzle/android/app/build/outputs/apk/debug/app-debug.apk)

---

## 🌐 Step 4: Publish to Google Play Console

### 1. Create Your Google Play Developer Account
- Go to [Google Play Console](https://play.google.com/console) and log in.

### 2. Create New App
- Click **Create app**.
- **App name:** `PuzzleMaster Interview`
- **Default language:** English (United States)
- **App or Game:** Application (or Game)
- **Free or Paid:** Free
- Accept declarations and click **Create app**.

### 3. Complete Store Presence Checklist
In the left sidebar, navigate to **Grow** ➔ **Store presence** ➔ **Main store listing**:
- **Short description (up to 80 chars):**
  > Master 25 FAANG & Wall Street Technical Interview Puzzles with Interactive Sims.
- **Full description:**
  > Master technical coding interview puzzles through playable games and visual simulations. Includes Heaven & Hell, 100 Doors, Monty Hall, River Crossing, 2 Eggs & 100 Floors, and more. Features progressive hints, mathematical proofs, domain analytics, and 3 difficulty tiers (Easy, Medium, Hard).
- **App Icon:** 512 × 512 px PNG (32-bit color).
- **Feature Graphic:** 1024 × 500 px JPG or PNG.
- **Phone Screenshots:** Upload 2 to 8 screenshots of the game screens and dashboard.

### 4. App Content & Policy
In the left sidebar, under **Policy and programs** ➔ **App content**:
- **Privacy Policy:** Link to a public privacy policy page (e.g. GitHub Pages or simple site stating no personal data is sold).
- **Ads:** Select *No, my app does not contain ads*.
- **App Access:** Select *All functionality is available without special access*.
- **Content Rating:** Fill out the rating questionnaire (All Ages / Everyone).
- **Target Audience:** Select 13+ or General Audience.
- **Data Safety:** Declare that data is kept locally on device (or declare analytics if added).

### 5. Upload the AAB & Rollout
- Go to **Release** ➔ **Production** (or **Testing** ➔ **Internal testing** first).
- Click **Create new release**.
- In the *App bundles* section, upload your signed `.aab` file:
  `android/app/build/outputs/bundle/release/app-release.aab`
- Enter Release name: `1.0.0 (1)`
- Add Release notes:
  > Initial release of PuzzleMaster: Interview Edition. 25 interactive simulations across Easy, Medium, and Hard tiers with multi-candidate profiles and offline persistence.
- Click **Next** ➔ **Save** ➔ **Start rollout to Production**!

---

## ⚙️ Technical Metadata Summary

| Property | Value |
|:---|:---|
| **Application ID / Package Name** | `com.puzzlemaster.interview` |
| **App Name** | `PuzzleMaster Interview` |
| **Minimum SDK** | API 24 (Android 7.0+) — Compatible with 99%+ of devices |
| **Target SDK** | API 36 (Android 16) — Fully compliant with Play Store requirements |
| **Compile SDK** | API 36 |
| **JDK Version** | Open JDK 21 (`C:\Program Files\Android\Android Studio\jbr`) |
| **Output Formats** | `.aab` (Play Store Bundle) & `.apk` (Direct Install) |
