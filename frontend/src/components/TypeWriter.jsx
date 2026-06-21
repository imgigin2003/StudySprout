import React, { useEffect, useRef } from "react";
import { useState } from "react";

const CLICK_SOUND_SRC = "/sounds/typewriter-click.mp3";

/**
 * Typewriter — types out `text` one letter at a time, pauses, erases,
 * pauses, then retypes — forever. A single typing-sound clip plays once
 * per typing pass, starting right as typing begins.
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
  const clickAudioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(CLICK_SOUND_SRC);
    audio.volume = clickVolume;
    clickAudioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (clickAudioRef.current) {
      clickAudioRef.current.volume = clickVolume;
    }
  }, [clickVolume]);

  const playTypingSound = () => {
    if (!playClickSound || !clickAudioRef.current) return;
    const audio = clickAudioRef.current;
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.warn(
        `Typewriter sound failed to play (check that ${CLICK_SOUND_SRC} exists in /public/sounds/):`,
        err,
      );
    });
  };

  const stopTypingSound = () => {
    const audio = clickAudioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
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
      stopTypingSound();
    };
  }, [text, speed, eraseSpeed, startDelay, pauseAfterTyped, pauseAfterErased]);

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
