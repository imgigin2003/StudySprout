import React, { useEffect, useRef } from "react";
import { useState } from "react";

const CLICK_SOUND_SRC = "/sounds/typewriter-click.mp3";

/**
 * Typewriter — types out `text` one letter at a time (with a click sound
 * per letter), pauses, erases, pauses, then retypes — forever.
 *
 * Usage:
 *   <Typewriter text="Welcome to StudySprout" speed={45} />
 */
export default function Typewriter({
  text,
  speed = 5,
  eraseSpeed = 20,
  startDelay = 400,
  pauseAfterTyped = 1800,
  pauseAfterErased = 500,
  className = "",
  playClickSound = true,
  clickVolume = 0.15,
}) {
  const [displayed, setDisplayed] = useState("");
  const charIndexRef = useRef(0);
  const phaseRef = useRef("waiting"); // waiting -> typing -> pausedTyped -> erasing -> pausedErased -> typing...
  const timeoutRef = useRef(null);

  const playClick = () => {
    if (!playClickSound) return;
    try {
      // New Audio instance per click so rapid successive clicks can
      // overlap naturally instead of cutting each other off.
      const audio = new Audio(CLICK_SOUND_SRC);
      audio.volume = clickVolume;
      audio.play().catch((err) => {
        console.warn(
          `Typewriter click sound failed to play (check that ${CLICK_SOUND_SRC} exists in /public/sounds/):`,
          err,
        );
      });
    } catch (err) {
      console.warn("Typewriter click sound error:", err);
    }
  };

  useEffect(() => {
    // Reset everything when the text itself changes
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
        charIndexRef.current = next;
        setDisplayed(text.slice(0, next));
        playClick();

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

    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, eraseSpeed, startDelay, pauseAfterTyped, pauseAfterErased]);

  return (
    <span className={className}>
      {displayed}
      <span className="typewriter-cursor">|</span>
      <style>{`
        .typewriter-cursor {
          display: inline-block;
          margin-left: 2px;
          animation: typewriterBlink 0.5s step-end infinite;
        }
        @keyframes typewriterBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
