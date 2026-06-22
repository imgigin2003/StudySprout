import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const CLICK_SOUND_SRC = "/sounds/button-click.mp3";
const DEFAULT_CLICK_VOLUME = 0.2;

// Web Audio API context and buffer for zero-latency click sound playback.
let audioContext = null;
let clickBuffer = null;
let isLoadingBuffer = false;

async function initAudioContext() {
  if (audioContext) return;
  if (typeof window === "undefined") return;

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  } catch (err) {
    console.warn("Web Audio API not supported:", err);
  }
}

async function loadClickBuffer() {
  if (clickBuffer) return;
  if (isLoadingBuffer) return;
  if (!audioContext) await initAudioContext();
  if (!audioContext) return;

  isLoadingBuffer = true;
  try {
    const response = await fetch(CLICK_SOUND_SRC);
    const arrayBuffer = await response.arrayBuffer();
    clickBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (err) {
    console.warn("Failed to load click sound:", err);
  } finally {
    isLoadingBuffer = false;
  }
}

function playClickSound(volume = DEFAULT_CLICK_VOLUME, muted = false) {
  if (muted) return;
  if (!audioContext || !clickBuffer) return;

  try {
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    source.buffer = clickBuffer;
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
  } catch (err) {
    console.warn("Failed to play click sound:", err);
  }
}

// Kick off audio context and buffer loading when the module is imported.
if (typeof window !== "undefined") {
  initAudioContext();
  // Defer buffer loading until first user interaction to avoid autoplay issues.
  const onFirstInteraction = async () => {
    await loadClickBuffer();
    window.removeEventListener("click", onFirstInteraction);
    window.removeEventListener("keydown", onFirstInteraction);
    window.removeEventListener("touchstart", onFirstInteraction);
  };
  window.addEventListener("click", onFirstInteraction, { once: true });
  window.addEventListener("keydown", onFirstInteraction, { once: true });
  window.addEventListener("touchstart", onFirstInteraction, { once: true });
}

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      onClick,
      // Set silent to true on any button that shouldn't play the click
      // sound (e.g. a button that triggers its own distinct sound effect).
      silent = false,
      clickVolume,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    // Read mute state from the global flag set by MusicProvider.
    // Default to false (sounds ON) if the flag is not set.
    const handleClick = (event) => {
      if (!silent) {
        const isMuted = window.__soundsMuted === true;
        playClickSound(clickVolume, isMuted);
      }
      if (onClick) onClick(event);
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
