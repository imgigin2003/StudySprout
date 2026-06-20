// @ts-nocheck

import { useCallback, useRef } from "react";

/**
 * useSound — plays a short one-shot sound effect on demand.
 *
 * Usage:
 *   const playClick = useSound("/sounds/button-click.mp3");
 *   <button onClick={() => { playClick(); doSomething(); }}>Click me</button>
 *
 * Each call creates a fresh Audio instance so rapid repeated calls
 * (e.g. fast clicking) overlap naturally instead of cutting each other off.
 */
export default function useSound(src, { volume = 0.5 } = {}) {
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  const play = useCallback(() => {
    try {
      const audio = new Audio(src);
      audio.volume = volumeRef.current;
      audio.play().catch((err) => {
        console.warn(`Sound failed to play (${src}):`, err);
      });
    } catch (err) {
      console.warn(`Sound error (${src}):`, err);
    }
  }, [src]);

  return play;
}
