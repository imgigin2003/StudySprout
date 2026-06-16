import React from "react";
import { Link } from "react-router-dom";
import { Sprout, LogIn } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Decorative elements */}
      <div className="absolute top-6 right-8">
        <div className="w-12 h-10 bg-accent rounded-sm" />
      </div>
      <div className="absolute top-10 left-6 text-primary-foreground/30 text-xl">
        ✦
      </div>
      <div className="absolute top-20 right-16 text-primary-foreground/20 text-sm">
        ✦
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-lg mx-auto w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl text-foreground tracking-tight leading-relaxed">
            StudySprout
          </h1>
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
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 bg-card border-2 border-border rounded-md py-3 px-4 hover:bg-secondary transition-colors"
          >
            <LogIn size={16} className="text-foreground" />
            <span className="font-heading text-[9px] text-foreground tracking-wider">
              SIGN IN / LOGIN
            </span>
          </Link>
          <Link
            to="/garden"
            className="w-full flex items-center justify-center gap-2 bg-card border-2 border-border rounded-md py-3 px-4 hover:bg-secondary transition-colors"
          >
            <Sprout size={16} className="text-foreground" />
            <span className="font-heading text-[9px] text-foreground tracking-wider">
              CONTINUE AS GUEST
            </span>
          </Link>
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

      {/* Bottom nav placeholder */}
      <div className="h-16 bg-primary border-t-2 border-border flex items-center justify-around max-w-lg mx-auto w-full">
        <Link
          to="/garden"
          className="flex flex-col items-center gap-1 text-primary-foreground/70"
        >
          <Sprout size={18} />
          <span className="font-heading text-[6px]">MY GARDEN</span>
        </Link>
        <Link
          to="/timer"
          className="flex flex-col items-center gap-1 text-primary-foreground/70"
        >
          <span className="text-sm">⏳</span>
          <span className="font-heading text-[6px]">STUDY TIMER</span>
        </Link>
        <Link
          to="/shelf"
          className="flex flex-col items-center gap-1 text-primary-foreground/70"
        >
          <span className="text-sm">📊</span>
          <span className="font-heading text-[6px]">MY SHELF</span>
        </Link>
      </div>
    </div>
  );
}
