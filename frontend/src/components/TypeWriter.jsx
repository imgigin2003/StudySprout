import React, { useEffect, useRef } from "react";
import { useState } from "react";

const CLICK_SOUND_SRC = "/sounds/typewriter-click.mp3";

// Web Audio API context and buffer for zero-latency typewriter sound playback.
let audioContext = null;
let typewriterBuffer = null;
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

async function loadTypewriterBuffer() {
  if (typewriterBuffer) return;
  if (isLoadingBuffer) return;
  if (!audioContext) await initAudioContext();
  if (!audioContext) return;

  isLoadingBuffer = true;
  try {
    const response = await fetch(CLICK_SOUND_SRC);
    const arrayBuffer = await response.arrayBuffer();
    typewriterBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (err) {
    console.warn("Failed to load typewriter sound:", err);
  } finally {
    isLoadingBuffer = false;
  }
}

function playTypewriterSound(volume = 0.4) {
  // Respect the global mute flag set by MusicProvider.toggle().
  if (window.__soundsMuted === true) return;
  if (!audioContext || !typewriterBuffer) return;

  try {
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    source.buffer = typewriterBuffer;
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
  } catch (err) {
    console.warn("Failed to play typewriter sound:", err);
  }
}

// Kick off audio context and buffer loading when the module is imported.
if (typeof window !== "undefined") {
  initAudioContext();
  // Defer buffer loading until first user interaction to avoid autoplay issues.
  const onFirstInteraction = async () => {
    await loadTypewriterBuffer();
    window.removeEventListener("click", onFirstInteraction);
    window.removeEventListener("keydown", onFirstInteraction);
    window.removeEventListener("touchstart", onFirstInteraction);
  };
  window.addEventListener("click", onFirstInteraction, { once: true });
  window.addEventListener("keydown", onFirstInteraction, { once: true });
  window.addEventListener("touchstart", onFirstInteraction, { once: true });
}

/**
 * Typewriter — types out `text` one letter at a time, pauses, erases,
 * pauses, then retypes — forever. A single typing-sound clip plays once
 * per typing pass, starting right as typing begins.
 *
 * Uses Web Audio API for zero-latency playback and respects the global
 * mute state (window.__soundsMuted).
 *
 * Usage:
 *   <Typewriter text="Welcome to StudySprout" speed={45} />
 */
export default function Typewriter({
  text,
  speed = 25,
  eraseSpeed = 25,
  startDelay = 300,
  pauseAfterTyped = 1800,
  pauseAfterErased = 500,
  className = "",
  playClickSound = true,
  clickVolume = 0.4,
}) {
  const [displayed, setDisplayed] = useState("");
  const charIndexRef = useRef(0);
  const phaseRef = useRef("waiting");
  const timeoutRef = useRef(null);

  const playTypingSound = () => {
    if (!playClickSound) return;
    playTypewriterSound(clickVolume);
  };

  useEffect(() => {
    charIndexRef.current = 0;
    phaseRef.current = "waiting";
    setDisplayed("");

    function tick() {
      const phase = phaseRef.current;

      if (phase === "waiting") {
        phaseRef.current = "typing";
        timeoutRef.current = setTimeout(tick, startDelay);
        return;
      }

      if (phase === "typing") {
        const next = charIndexRef.current + 1;

        if (charIndexRef.current === 0) {
          playTypingSound();
        }

        charIndexRef.current = next;
        setDisplayed(text.slice(0, next));

        if (next >= text.length) {
          phaseRef.current = "pausedTyped";
          timeoutRef.current = setTimeout(tick, pauseAfterTyped);
        } else {
          timeoutRef.current = setTimeout(tick, speed);
        }
        return;
      }

      if (phase === "pausedTyped") {
        phaseRef.current = "erasing";
        timeoutRef.current = setTimeout(tick, eraseSpeed);
        return;
      }

      if (phase === "erasing") {
        const next = charIndexRef.current - 1;
        charIndexRef.current = next;
        setDisplayed(text.slice(0, next));

        if (next <= 0) {
          phaseRef.current = "pausedErased";
          timeoutRef.current = setTimeout(tick, pauseAfterErased);
        } else {
          timeoutRef.current = setTimeout(tick, eraseSpeed);
        }
        return;
      }

      if (phase === "pausedErased") {
        phaseRef.current = "typing";
        timeoutRef.current = setTimeout(tick, speed);
        return;
      }
    }

    timeoutRef.current = setTimeout(tick, 0);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [text, speed, eraseSpeed, startDelay, pauseAfterTyped, pauseAfterErased, playClickSound, clickVolume]);

  return (
    <span className={className}>
      {displayed}
      <span className="typewriter-cursor">|</span>
      <style>{`
        .typewriter-cursor {
          display: inline-block;
          margin-left: 2px;
          animation: typewriterBlink 0.9s step-end infinite;
        }
        @keyframes typewriterBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
