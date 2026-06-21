// @ts-nocheck

import * as React from "react";
import { Link } from "react-router-dom";

const CLICK_SOUND_SRC = "/sounds/button-click.mp3";
const DEFAULT_CLICK_VOLUME = 0.2;

function playClickSound(volume = DEFAULT_CLICK_VOLUME) {
  try {
    const audio = new Audio(CLICK_SOUND_SRC);
    audio.volume = volume;
    audio.play().catch(() => {
      // Autoplay/permissions edge cases — never block navigation on this.
    });
  } catch {
    // Sound is a nice-to-have, never throw from a click handler because of it.
  }
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
