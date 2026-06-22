// @ts-nocheck

import * as React from "react";
import { Link } from "react-router-dom";

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

function playClickSound(volume = DEFAULT_CLICK_VOLUME) {
  // Respect the global mute flag set by MusicProvider.toggle().
  // Default to false (sounds ON) if the flag is not set.
  const isMuted = window.__soundsMuted === true;
  if (isMuted) return;
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

/**
 * SoundLink — drop-in replacement for react-router-dom's <Link> that
 * plays the shared button-click sound on click, in addition to navigating.
 *
 * Usage:
 *   <SoundLink to="/garden" className="...">My Garden</SoundLink>
 *
 * Set `silent` to skip the sound on a specific link.
 */
const SoundLink = React.forwardRef(
  ({ onClick, silent = false, clickVolume, ...props }, ref) => {
    const handleClick = (event) => {
      if (!silent) {
        playClickSound(clickVolume);
      }
      if (onClick) onClick(event);
    };

    return <Link ref={ref} onClick={handleClick} {...props} />;
  },
);
SoundLink.displayName = "SoundLink";

export default SoundLink;
