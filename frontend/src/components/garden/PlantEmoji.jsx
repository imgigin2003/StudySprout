import React from "react";

const plantVisuals = {
  sunflower: {
    seed: "🌰",
    sprout: "🌱",
    bud: "🌿",
    bloom: "🌻",
    mastered: "🌻",
  },
  rose: { seed: "🌰", sprout: "🌱", bud: "🌿", bloom: "🌹", mastered: "🌹" },
  cactus: { seed: "🌰", sprout: "🌱", bud: "🌵", bloom: "🌵", mastered: "🌵" },
  tulip: { seed: "🌰", sprout: "🌱", bud: "🌿", bloom: "🌷", mastered: "🌷" },
  fern: { seed: "🌰", sprout: "🌱", bud: "🌿", bloom: "☘️", mastered: "☘️" },
  daisy: { seed: "🌰", sprout: "🌱", bud: "🌿", bloom: "🌼", mastered: "🌼" },
};

export default function PlantEmoji({
  type = "sunflower",
  stage = "seed",
  size = "lg",
}) {
  const emoji = plantVisuals[type]?.[stage] || "🌱";
  const sizes = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
    xl: "text-8xl",
  };

  return (
    <div className={`${sizes[size]} leading-none select-none`}>{emoji}</div>
  );
}
