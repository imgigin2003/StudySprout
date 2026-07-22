// Renders the pixel-art sprout (src/lib/sproutPixels.js) into the source PNGs that
// the native icon tools consume. Run: `npm run icons:gen`
//
// Outputs into ./assets :
//   icon-only.png        1024  opaque, sprite ~78%   (iOS app icon / fallback)
//   icon.png             1024  same as icon-only     (Tauri source)
//   icon-foreground.png  1024  transparent, ~58%     (Android adaptive foreground)
//   icon-background.png  1024  solid theme green     (Android adaptive background)
//   splash.png           2732  light bg, sprite ~26% (Capacitor splash, light)
//   splash-dark.png      2732  dark bg,  sprite ~26% (Capacitor splash, dark)
//   favicon.png          256   opaque                (raster fallback favicon)

import { PNG } from "pngjs";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { GRID, PALETTE, BG_LIGHT, BG_DARK, GRID_SIZE } from "../src/lib/sproutPixels.js";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "../assets");
mkdirSync(outDir, { recursive: true });

const hexToRgba = (hex, a = 255) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
  a,
];

function fillRect(png, x0, y0, w, h, [r, g, b, a]) {
  for (let y = y0; y < y0 + h; y++) {
    if (y < 0 || y >= png.height) continue;
    for (let x = x0; x < x0 + w; x++) {
      if (x < 0 || x >= png.width) continue;
      const idx = (png.width * y + x) << 2;
      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = a;
    }
  }
}

// Draw the sprite centered on a canvas. spriteFraction = sprite size / canvas.
function render({ size, bg, spriteFraction }) {
  const png = new PNG({ width: size, height: size });

  // Background (transparent if bg is null)
  const bgColor = bg ? hexToRgba(bg) : [0, 0, 0, 0];
  fillRect(png, 0, 0, size, size, bgColor);

  // Integer cell size keeps pixels crisp.
  const cell = Math.floor((size * spriteFraction) / GRID_SIZE);
  const spriteSize = cell * GRID_SIZE;
  const offset = Math.round((size - spriteSize) / 2);

  for (let gy = 0; gy < GRID.length; gy++) {
    const row = GRID[gy];
    for (let gx = 0; gx < row.length; gx++) {
      const ch = row[gx];
      if (ch === ".") continue;
      fillRect(
        png,
        offset + gx * cell,
        offset + gy * cell,
        cell,
        cell,
        hexToRgba(PALETTE[ch]),
      );
    }
  }
  return png;
}

function save(name, png) {
  const buf = PNG.sync.write(png);
  writeFileSync(resolve(outDir, name), buf);
  console.log("  ✓", name, `(${png.width}x${png.height})`);
}

console.log("Generating sprout icons →", outDir);
save("icon-only.png", render({ size: 1024, bg: BG_LIGHT, spriteFraction: 0.78 }));
save("icon.png", render({ size: 1024, bg: BG_LIGHT, spriteFraction: 0.78 }));
save("icon-foreground.png", render({ size: 1024, bg: null, spriteFraction: 0.58 }));
save("icon-background.png", render({ size: 1024, bg: BG_LIGHT, spriteFraction: 0 }));
save("splash.png", render({ size: 2732, bg: BG_LIGHT, spriteFraction: 0.26 }));
save("splash-dark.png", render({ size: 2732, bg: BG_DARK, spriteFraction: 0.26 }));
save("favicon.png", render({ size: 256, bg: BG_LIGHT, spriteFraction: 0.82 }));
console.log("Done.");
