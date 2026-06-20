import React from "react";
import { Sprout, LogIn, Volume2, VolumeX } from "lucide-react";
import Typewriter from "../components/TypeWriter";
import { useMusic } from "../components/MusicProvider";
import SoundLink from "../components/SoundLink";

export default function LandingPage() {
  const { isPlaying, toggle } = useMusic();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Decorative elements */}
      <div className="absolute top-10 left-6 text-primary-foreground/30 text-xl">
        ✦
      </div>
      <div className="absolute top-20 right-16 text-primary-foreground/20 text-sm">
        ✦
      </div>

      {/* Music toggle */}
      <button
        onClick={toggle}
        className="absolute top-6 left-6 bg-card border-2 border-border rounded-md p-2 z-10"
        aria-label={isPlaying ? "Mute music" : "Play music"}
      >
        {isPlaying ? (
          <Volume2 size={16} className="text-foreground" />
        ) : (
          <VolumeX size={16} className="text-muted-foreground" />
        )}
      </button>

      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-lg mx-auto w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl text-foreground tracking-tight leading-relaxed">
            StudySprout
          </h1>
          <p className="font-heading text-[9px] text-primary mt-2 tracking-wide min-h-[1.2em]">
            <Typewriter
              text="WELCOME TO STUDYSPROUT"
              speed={120}
              startDelay={400}
            />
          </p>
          <div className="mt-3 text-4xl">🌱</div>
        </div>

        {/* Tagline */}
        <div className="border-2 border-border bg-card px-6 py-3 rounded-md mb-8">
          <p className="font-heading text-[8px] text-foreground text-center leading-relaxed tracking-wider">
            GROW YOUR FOCUS.
            <br />
            ONE SESSION AT A TIME.
          </p>
        </div>

        {/* Garden illustration */}
        <div className="flex items-end gap-4 mb-10">
          <span className="text-3xl">🪴</span>
          <span className="text-4xl">🌱</span>
          <span className="text-3xl">🚿</span>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-3 max-w-xs">
          <SoundLink
            to="/login"
            className="w-full flex items-center justify-center gap-2 bg-card border-2 border-border rounded-md py-3 px-4 hover:bg-secondary transition-colors"
          >
            <LogIn size={16} className="text-foreground" />
            <Sprout size={16} className="text-foreground" />
            <span className="font-heading text-[9px] text-foreground tracking-wider">
              SIGN IN / LOGIN
            </span>
          </SoundLink>
        </div>

        {/* Footer tag */}
        <div className="mt-8 flex items-center gap-2 text-muted-foreground">
          <span className="text-sm">🌿</span>
          <span className="font-heading text-[7px] tracking-widest">
            FOCUS • GROW • THRIVE
          </span>
          <span className="text-sm">🌿</span>
        </div>
      </div>
    </div>
  );
}
