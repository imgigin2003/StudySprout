// Original pixel-art sprout — a 16x16 grid used as the single source of truth for
// the app icon, the browser favicon, the native app icons, and the splash screen.
// Each character maps to a color in PALETTE ('.' = transparent / background).
//
//   L = light leaf   D = dark leaf   S = stem   M = soil   K = dark soil

export const GRID = [
  "..LL........LL..",
  ".LLLL......LLLL.",
  ".LLDLL....LLDLL.",
  "..LLDLL..LLDLL..",
  "...LLDLLLLDLL...",
  "....LLLDDLLL....",
  "......LLLL......",
  ".......SS.......",
  ".......SS.......",
  ".......SS.......",
  ".......SS.......",
  ".....KMMMMK.....",
  "...KKMMMMMMKK...",
  ".KMMMKMMMMKMMMK.",
  "KMMMMMMMMMMMMMMK",
  "KKMMMMMMMMMMMMKK",
];

// Hex colors for each grid cell.
export const PALETTE = {
  L: "#7cb342", // light leaf green
  D: "#4e7d2c", // dark leaf green (shading)
  S: "#6b9e39", // stem
  M: "#6d4c34", // soil (mid brown)
  K: "#3f2a1d", // soil (dark brown)
};

// App background tints, matching the theme in index.css.
export const BG_LIGHT = "#e8f1d6";
export const BG_DARK = "#17231b";

export const GRID_SIZE = 16;
