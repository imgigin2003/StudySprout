import React, { useEffect, useRef, useState } from "react";

import roseSeed from "../../assets/plants/rose-seed.png";
import roseSprout from "../../assets/plants/rose-sprout.png";
import roseBloom from "../../assets/plants/rose-bloom.png";

import cactusSeed from "../../assets/plants/cactus-seed.png";
import cactusSprout from "../../assets/plants/cactus-sprout.png";
import cactusBloom from "../../assets/plants/cactus-bloom.png";

import tulipSeed from "../../assets/plants/tulip-seed.png";
import tulipSprout from "../../assets/plants/tulip-sprout.png";
import tulipBloom from "../../assets/plants/tulip-bloom.png";

import lilySeed from "../../assets/plants/lily-seed.png";
import lilySprout from "../../assets/plants/lily-sprout.png";
import lilyBloom from "../../assets/plants/lily-bloom.png";

import orchidSeed from "../../assets/plants/orchid-seed.png";
import orchidSprout from "../../assets/plants/orchid-sprout.png";
import orchidBloom from "../../assets/plants/orchid-bloom.png";

import daffodilSeed from "../../assets/plants/daffodil-seed.png";
import daffodilSprout from "../../assets/plants/daffodil-sprout.png";
import daffodilBloom from "../../assets/plants/daffodil-bloom.png";

import daisySeed from "../../assets/plants/daisy-seed.png";
import daisySprout from "../../assets/plants/daisy-sprout.png";
import daisyBloom from "../../assets/plants/daisy-bloom.png";

import irisSeed from "../../assets/plants/iris-seed.png";
import irisSprout from "../../assets/plants/iris-sprout.png";
import irisBloom from "../../assets/plants/iris-bloom.png";

import stephanitosSeed from "../../assets/plants/stephanitos-hoop-seed.png";
import stephanitosSprout from "../../assets/plants/stephanitos-hoop-sprout.png";
import stephanitosBloom from "../../assets/plants/stephanitos-hoop-bloom.png";

import sunflowerSeed from "../../assets/plants/sunflower-seed.png";
import sunflowerSprout from "../../assets/plants/sunflower-sprout.png";
import sunflowerBloom from "../../assets/plants/sunflower-bloom.png";

import pachiraSeed from "../../assets/plants/pachira-seed.png";
import pachiraSprout from "../../assets/plants/pachira-sprout.png";
import pachiraBloom from "../../assets/plants/pachira-bloom.png";

import hangingSpiderSeed from "../../assets/plants/hanging-spider-seed.png";
import hangingSpiderSprout from "../../assets/plants/hanging-spider-sprout.png";
import hangingSpiderBloom from "../../assets/plants/hanging-spider-bloom.png";

// Pixel art image sets per plant type. Each type maps to seed/sprout/bloom images.
const plantImages = {
  rose: { seed: roseSeed, sprout: roseSprout, bloom: roseBloom },
  cactus: { seed: cactusSeed, sprout: cactusSprout, bloom: cactusBloom },
  tulip: { seed: tulipSeed, sprout: tulipSprout, bloom: tulipBloom },
  lily: { seed: lilySeed, sprout: lilySprout, bloom: lilyBloom },
  orchid: { seed: orchidSeed, sprout: orchidSprout, bloom: orchidBloom },
  daffodil: {
    seed: daffodilSeed,
    sprout: daffodilSprout,
    bloom: daffodilBloom,
  },
  daisy: { seed: daisySeed, sprout: daisySprout, bloom: daisyBloom },
  iris: { seed: irisSeed, sprout: irisSprout, bloom: irisBloom },
  stephanitos: {
    seed: stephanitosSeed,
    sprout: stephanitosSprout,
    bloom: stephanitosBloom,
  },
  sunflower: {
    seed: sunflowerSeed,
    sprout: sunflowerSprout,
    bloom: sunflowerBloom,
  },
  pachira: { seed: pachiraSeed, sprout: pachiraSprout, bloom: pachiraBloom },
  "hanging-spider": {
    seed: hangingSpiderSeed,
    sprout: hangingSpiderSprout,
    bloom: hangingSpiderBloom,
  },
};

// Emoji fallback in case a pixel art asset is missing for a given type
const emojiFallback = {
  seed: "🌰",
  sprout: "🌱",
  bloom: "🌸",
};

/**
 * Derive a plant's growth stage from study progress.
 *
 * - "seed"   : 0%   -> 33% of XP earned
 * - "sprout" : 33%  -> 99% of XP earned
 * - "bloom"  : 100% of XP earned, OR early mastery
 *
 * @param {number} currentXP - XP the user has earned studying this plant
 * @param {number} xpValue - total XP required to fully grow/master the plant
 * @param {boolean} isMaster - true if user marked it mastered early (e.g. early harvest)
 * @returns {"seed"|"sprout"|"bloom"}
 */
export function getGrowthStage(currentXP = 0, xpValue = 1, isMaster = false) {
  if (isMaster) return "bloom";

  const safeMax = xpValue > 0 ? xpValue : 1;
  const progress = Math.min(currentXP / safeMax, 1);

  if (progress >= 1) return "bloom";
  if (progress >= 1 / 3) return "sprout";
  return "seed";
}

/**
 * Get a 0-1 progress value for a plant, useful for progress bars.
 */
export function getGrowthProgress(currentXP = 0, xpValue = 1) {
  const safeMax = xpValue > 0 ? xpValue : 1;
  return Math.min(currentXP / safeMax, 1);
}

const sizes = {
  sm: "w-8 h-8",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-36 h-36",
};

const sizesEmoji = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
  xl: "text-8xl",
};

export default function PlantEmoji({
  type = "sunflower",
  stage = "seed",
  size = "lg",
  animate = true,
}) {
  // "mastered" and "ready to harvest" map onto the bloom visual
  const normalizedStage =
    stage === "mastered" || stage === "ready to harvest" || stage === "bloom"
      ? "bloom"
      : stage === "sprout"
        ? "sprout"
        : "seed";

  const images = plantImages[type];
  const src = images?.[normalizedStage];

  const prevStageRef = useRef(normalizedStage);
  const [justBloomed, setJustBloomed] = useState(false);
  const [justGrew, setJustGrew] = useState(false);

  useEffect(() => {
    const prevStage = prevStageRef.current;
    if (animate && prevStage !== normalizedStage) {
      if (normalizedStage === "bloom") {
        setJustBloomed(true);
        const t = setTimeout(() => setJustBloomed(false), 900);
        prevStageRef.current = normalizedStage;
        return () => clearTimeout(t);
      } else {
        // seed -> sprout transition gets a lighter pop, no sparkles
        setJustGrew(true);
        const t = setTimeout(() => setJustGrew(false), 500);
        prevStageRef.current = normalizedStage;
        return () => clearTimeout(t);
      }
    }
    prevStageRef.current = normalizedStage;
  }, [normalizedStage, animate]);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizes[size]}`}
    >
      {/* Sparkle burst — only on bloom */}
      {justBloomed && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute text-yellow-400 sparkle-particle"
              style={{
                left: "50%",
                top: "50%",
                "--angle": `${i * 60}deg`,
              }}
            >
              ✨
            </span>
          ))}
        </div>
      )}

      {src ? (
        <img
          src={src}
          alt={`${type} ${normalizedStage}`}
          className={`w-full h-full object-contain pixelated ${
            justBloomed ? "plant-bloom-pop" : justGrew ? "plant-grow-pop" : ""
          }`}
          draggable={false}
        />
      ) : (
        <div
          className={`${sizesEmoji[size]} leading-none ${
            justBloomed ? "plant-bloom-pop" : justGrew ? "plant-grow-pop" : ""
          }`}
        >
          {emojiFallback[normalizedStage]}
        </div>
      )}

      <style>{`
        .pixelated {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }

        @keyframes plantBloomPop {
          0% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.25); opacity: 1; }
          60% { transform: scale(0.95); }
          80% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .plant-bloom-pop {
          animation: plantBloomPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes plantGrowPop {
          0% { transform: scale(0.85); opacity: 0.6; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        .plant-grow-pop {
          animation: plantGrowPop 0.4s ease-out;
        }

        @keyframes sparkleBurst {
          0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0) scale(0.3);
            opacity: 0;
          }
          30% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-18px) scale(1);
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-38px) scale(0.4);
            opacity: 0;
          }
        }
        .sparkle-particle {
          font-size: 14px;
          animation: sparkleBurst 0.9s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
