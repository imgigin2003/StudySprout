import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const MusicContext = createContext(null);

/**
 * MusicProvider — owns a single <audio> element for the whole app's
 * lifetime. Mount this ONCE at the top of the component tree (in App.jsx,
 * above the Router) so navigating between pages never recreates or
 * restarts the audio.
 *
 * When the user toggles mute, both the background music AND all click /
 * UI sounds are silenced. The mute state is shared via:
 *   1. The MusicContext value (`isMuted`) for React components.
 *   2. A global `window.__soundsMuted` flag for non-React helpers such as
 *      the module-level `playClickSound` in button.jsx.
 *
 * By default, sounds are UNMUTED (isMuted = false).
 */
export function MusicProvider({ src, volume = 0.12, loop = true, children }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // `isMuted` tracks whether the user has silenced ALL sounds (BGM + SFX).
  // Default: false (sounds are ON by default).
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Initialize the global mute flag to match the initial state (unmuted).
    window.__soundsMuted = false;

    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;
    audioRef.current = audio;

    const tryPlay = () => {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    tryPlay();

    // If autoplay was blocked, start on the very first user interaction
    // anywhere in the app — this only needs to happen once, ever.
    const onFirstInteraction = () => {
      if (audio.paused && !isMuted) tryPlay();
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
    window.addEventListener("click", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);
    window.addEventListener("touchstart", onFirstInteraction);

    return () => {
      audio.pause();
      audio.src = "";
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
    // Intentionally only runs once for the app's lifetime (mount/unmount of MusicProvider).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const nowMuted = !isMuted;
    setIsMuted(nowMuted);
    // Expose mute state globally so non-React click-sound helpers can read it.
    window.__soundsMuted = nowMuted;

    if (nowMuted) {
      // Mute: pause BGM and silence all SFX.
      audio.pause();
      setIsPlaying(false);
    } else {
      // Unmute: resume BGM.
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, isMuted, toggle }}>
      {children}
    </MusicContext.Provider>
  );
}

/**
 * useMusic — read the shared music state/controls from any page.
 *
 * Usage:
 *   const { isPlaying, isMuted, toggle } = useMusic();
 */
export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return ctx;
}
