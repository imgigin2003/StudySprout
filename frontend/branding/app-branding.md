# StudySprout App Branding

This branding package preserves the existing StudySprout visual identity: a crisp pixel-art sprout growing from soil, a calm sage light theme, a deep forest dark theme, and the app’s existing retro focus aesthetic.

## Asset uploads

| Use | File | Dimensions | Upload / implementation note |
|---|---|---:|---|
| App icon, iOS and Android | `app-icon.png` | 1024 × 1024 | Use the same file for both platforms. It is opaque, square, and contains the sprout mark inside a safe margin. |
| Splash screen, light mode | `splash-light.png` | 2732 × 2732 | Use for iOS and Android light mode. The centered mark is intentionally text-free so the native launch screen remains clean while the webpage loads. |
| Splash screen, dark mode | `splash-dark.png` | 2732 × 2732 | Use for iOS and Android dark mode. |

The source-of-truth generator is `scripts/gen-icons.mjs`; run `npm run icons:gen` from `frontend/` if the PNGs ever need to be regenerated. The same source also feeds the existing Capacitor, Tauri, favicon, iOS, and Android resources.

## Median-style configuration

### App icon

Select **Match iOS & Android** and upload `app-icon.png`.

### Splash screen

Select **Match iOS & Android**.

| Setting | Light mode | Dark mode |
|---|---|---|
| Screen style | Light Mode | Dark Mode |
| Background color | `#E8F1D6` | `#17231B` |
| Image | `splash-light.png` | `splash-dark.png` |

These colors are taken from the project’s canonical `BG_LIGHT` and `BG_DARK` constants so the transition from the native launch screen to the web app is seamless.

### Primary / tint / accent color

Use the same brand color on iOS and Android:

| Platform | Light mode | Dark mode |
|---|---|---|
| iOS primary / tint | `#4E7D2C` | `#B2D193` |
| Android primary / accent | `#4E7D2C` | `#B2D193` |

`#4E7D2C` is the existing dark leaf green used in the pixel mark. `#B2D193` is the light, dark-theme companion corresponding to the project’s existing dark-mode primary tone.

### Status bar

Use an adaptive configuration so the system chrome follows the device theme:

| Platform | Text appearance | Light background | Dark background | Effect |
|---|---|---|---|---|
| iOS | Auto | `#E8F1D6` | `#17231B` | Overlay |
| Android | Auto | `#E8F1D6` | `#17231B` | Overlay |

Keep the status bar visible. Auto text appearance gives dark system text over the light sage theme and white system text over the dark forest theme.

### Android system navigation bar

| Setting | Light mode | Dark mode |
|---|---|---|
| Background color | `#E8F1D6` | `#17231B` |
| Icon / bar appearance | Auto | Auto |

## Palette reference

| Role | Hex | Existing source |
|---|---|---|
| Light background | `#E8F1D6` | `src/lib/sproutPixels.js` → `BG_LIGHT` |
| Dark background | `#17231B` | `src/lib/sproutPixels.js` → `BG_DARK` |
| Light leaf green | `#7CB342` | Pixel mark palette |
| Dark leaf green / primary | `#4E7D2C` | Pixel mark palette |
| Stem green | `#6B9E39` | Pixel mark palette |
| Soil brown | `#6D4C34` | Pixel mark palette |
| Dark soil | `#3F2A1D` | Pixel mark palette |

## Upload paths

The files in this folder are convenient copies for uploading to the app-branding screen. The canonical project assets remain in `frontend/assets/` and can be regenerated with the existing `icons:gen` script.
