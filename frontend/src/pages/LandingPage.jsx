import React from "react";
import { Sprout, LogIn, Volume2, VolumeX } from "lucide-react";
import Typewriter from "@/components/TypeWriter";
import { useMusic } from "@/components/MusicProvider";
import SoundLink from "@/components/SoundLink";

export default function LandingPage() {
  const { isPlaying, toggle } = useMusic();

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
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

      {/* Desktop: left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-secondary/40 border-r-2 border-border relative overflow-hidden">
        <div className="absolute top-10 left-10 text-primary/20 text-2xl">
          ✦
        </div>
        <div className="absolute bottom-16 right-16 text-primary/15 text-xl">
          ✦
        </div>
        <div className="flex flex-col items-center gap-6 px-10">
          <div className="flex items-end gap-6">
            <span className="text-6xl">🪴</span>
            <span className="text-7xl">🌱</span>
            <span className="text-6xl">🚿</span>
          </div>
          <p className="font-heading text-[10px] text-muted-foreground tracking-widest text-center max-w-xs">
            EVERY FOCUS SESSION HELPS YOUR GARDEN GROW
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 lg:px-16 max-w-lg lg:max-w-xl mx-auto w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl lg:text-3xl text-foreground tracking-tight leading-relaxed">
            StudySprout
          </h1>
          <p className="font-heading text-[9px] lg:text-[10px] text-primary mt-2 tracking-wide min-h-[1.2em]">
            <Typewriter
              text="WELCOME TO STUDYSPROUT"
              speed={120}
              startDelay={400}
            />
          </p>
          <div className="mt-3 text-4xl lg:hidden">🌱</div>
        </div>

        {/* Tagline */}
        <div className="border-2 border-border bg-card px-6 py-3 rounded-md mb-8">
          <p className="font-heading text-[8px] text-foreground text-center leading-relaxed tracking-wider">
            GROW YOUR FOCUS.
            <br />
            ONE SESSION AT A TIME.
          </p>
        </div>

        {/* Garden illustration (mobile only, desktop has the side panel) */}
        <div className="flex items-end gap-4 mb-10 lg:hidden">
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
            <span className="font-heading text-[9px] text-foreground tracking-wider">
              SIGN IN / LOGIN
            </span>
          </SoundLink>
          <SoundLink
            to="/garden"
            className="w-full flex items-center justify-center gap-2 bg-card border-2 border-border rounded-md py-3 px-4 hover:bg-secondary transition-colors"
          >
            <Sprout size={16} className="text-foreground" />
            <span className="font-heading text-[9px] text-foreground tracking-wider">
              CONTINUE AS GUEST
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
