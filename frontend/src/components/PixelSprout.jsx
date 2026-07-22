// @ts-nocheck
import { GRID, PALETTE, GRID_SIZE } from "@/lib/sproutPixels";

// Renders the pixel-art sprout as a crisp, scalable SVG (no image asset needed).
// `size` is the rendered width/height in px.
export default function PixelSprout({ size = 96, className = "", style }) {
  const rects = [];
  for (let y = 0; y < GRID.length; y++) {
    const row = GRID[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === ".") continue;
      rects.push(
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={1.02} /* tiny overlap kills sub-pixel seams between cells */
          height={1.02}
          fill={PALETTE[ch]}
        />,
      );
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`}
      shapeRendering="crispEdges"
      className={className}
      style={style}
      role="img"
      aria-label="StudySprout"
    >
      {rects}
    </svg>
  );
}
