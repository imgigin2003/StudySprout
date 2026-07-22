# 📦 Building StudySprout as Native Apps

StudySprout's React web app is wrapped into native executables **without rewriting any app code**:

| Platform            | Wrapper                | Output                     |
| ------------------- | ---------------------- | -------------------------- |
| macOS / Win / Linux | **Tauri** (Rust)       | `.app` / `.dmg` / `.exe`   |
| iOS                 | **Capacitor**          | `.ipa` (via Xcode)         |
| Android             | **Capacitor**          | `.apk` / `.aab` (via Studio) |

All targets load the **same** `dist/` build produced by `npm run build`, and all talk to the
hosted backend defined in `.env.production` (`VITE_API_URL`). No separate frontend codebases.

> Run every command below from the `frontend/` directory.

---

## 🖥️ Desktop (Tauri) — ready on this machine

Rust/cargo is already installed, so desktop works with no extra setup.

```bash
npm run desktop:dev      # hot-reload dev window (runs `vite` + a native window)
npm run desktop:build    # produces a distributable .app + .dmg
```

Build output lands in `src-tauri/target/release/bundle/`.

> On a clean machine you also need the [Rust toolchain](https://rustup.rs) and Xcode
> Command Line Tools (`xcode-select --install`) for the macOS build.

---

## ☁️ Mobile builds run in the cloud (GitHub Actions) — no local IDEs

You do **not** need Xcode or Android Studio installed. Two workflows in
`.github/workflows/` build the mobile apps on GitHub's runners:

| Workflow                        | Runner         | Output artifact                    |
| ------------------------------- | -------------- | ---------------------------------- |
| `.github/workflows/android.yml` | Ubuntu         | `studysprout-android-debug` (.apk) |
| `.github/workflows/ios.yml`     | macOS          | `studysprout-ios-simulator` (.app) |

**How to use them:**

1. Push this repo to GitHub.
2. They run automatically on every push to `main` that touches `frontend/**`,
   or trigger them manually from the repo's **Actions** tab → pick the workflow →
   **Run workflow**.
3. When a run finishes, open it and download the build from the **Artifacts** section.

The Android artifact is an installable **debug `.apk`**. The iOS artifact is an
**unsigned simulator `.app`** — it confirms the app compiles and runs in the iOS
Simulator.

### Getting a signed iOS `.ipa` / TestFlight build

That needs an **Apple Developer account ($99/yr)** and signing secrets. Once you
have them, add these repo secrets (Settings → Secrets → Actions) and extend
`ios.yml` to import the certificate and archive with signing:

- `BUILD_CERTIFICATE_BASE64` — your distribution `.p12`, base64-encoded
- `P12_PASSWORD` — its password
- `PROVISIONING_PROFILE_BASE64` — your provisioning profile, base64-encoded
- `KEYCHAIN_PASSWORD` — any temporary password for the CI keychain

(Ping me and I'll wire the signed-archive steps in when you're ready.)

---

## 🛠️ Building mobile locally instead (optional)

If you ever *do* install the toolchains, the same projects build locally:

**iOS** — needs Xcode (`xcode-select --install`). CocoaPods is *not* required
(this Capacitor version uses Swift Package Manager):

```bash
npm run ios:sync    # builds the web app + copies it into ios/
npm run ios:open    # opens Xcode → set a Signing Team → press ▶︎
```

**Android** — needs a **JDK 17** (`brew install --cask temurin`) plus either
Android Studio *or* just the Android command-line tools:

```bash
npm run android:sync   # builds the web app + copies it into android/
npm run android:open   # opens Android Studio
# ...or headless, no IDE:
cd android && ./gradlew assembleDebug
```

---

## 🔁 How it fits together

```
src/  ──►  npm run build  ──►  dist/  ──┬──►  Tauri     ──►  macOS/Win/Linux app
                                        ├──►  Capacitor ──►  ios/      ──►  iOS app
                                        └──►  Capacitor ──►  android/  ──►  Android app
```

Change your code once in `src/`, then re-sync each platform. The backend (`../backend`)
stays exactly as-is — every native app is just a shell around the web build hitting the
same API.

## Reference

- App identifier (all platforms): `com.studysprout.app`
- Capacitor config: `capacitor.config.json`
- Tauri config: `src-tauri/tauri.conf.json`
