// @ts-nocheck

import { useCallback, useEffect, useRef } from "react";

/**
 * useSound — plays a short one-shot sound effect on demand with zero latency.
 *
 * Uses the Web Audio API to decode and buffer the audio file once,
 * then plays it instantly on every call without any network/decode stall.
 *
 * Usage:
 *   const playClick = useSound("/sounds/button-click.mp3");
 *   <button onClick={() => { playClick(); doSomething(); }}>Click me</button>
 */
export default function useSound(src, { volume = 0.3 } = {}) {
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  const audioContextRef = useRef(null);
  const bufferRef = useRef(null);

  // Initialize Web Audio context and load the audio buffer on mount.
  useEffect(() => {
    let isMounted = true;

    const initAudio = async () => {
      try {
        // Create audio context if it doesn't exist.
        if (!audioContextRef.current) {
          audioContextRef.current =
            new (window.AudioContext || window.webkitAudioContext)();
        }

        // Fetch and decode the audio file.
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        const decodedBuffer = await audioContextRef.current.decodeAudioData(
          arrayBuffer,
        );

        if (isMounted) {
          bufferRef.current = decodedBuffer;
        }
      } catch (err) {
        console.warn(`Failed to load sound (${src}):`, err);
      }
    };

    initAudio();

    return () => {
      isMounted = false;
    };
  }, [src]);

  const play = useCallback(() => {
    try {
      const ctx = audioContextRef.current;
      const buffer = bufferRef.current;

      if (!ctx || !buffer) return;

      const source = ctx.createBufferSource();
      const gainNode = ctx.createGain();

      source.buffer = buffer;
      gainNode.gain.value = volumeRef.current;

      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(0);
    } catch (err) {
      console.warn(`Sound failed to play (${src}):`, err);
    }
  }, [src]);

  return play;
}
