// @ts-nocheck
import { motion } from "framer-motion";
import PixelSprout from "./PixelSprout";
import { openExternal } from "@/utils/openExternal";

const CREATOR = "Negin";
const GITHUB_URL = "https://github.com/imgigin2003/StudySprout";
const PORTFOLIO_URL = "https://imgigin2003.github.io/My-Portfolio/";
const TAGLINE = "Grow your focus, one session at a time.";

// A small pixel-styled GitHub glyph (inlined so it never depends on an icon lib).
function GitHubIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.49
        0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49
        -.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85
        .09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75
        -.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 2.5-.34c.85 0
        1.71.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72
        1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0
        1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.26C22 6.58
        17.52 2 12 2z" />
    </svg>
  );
}

export default function SplashScreen({ ready = false, onContinue }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background px-6 text-center overflow-hidden">
      {/* Sprout: pops in, then gently bobs like it's breathing */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 12 }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <PixelSprout size={112} className="drop-shadow-sm" />
        </motion.div>
      </motion.div>

      {/* App name */}
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="mt-8 font-heading text-2xl sm:text-3xl text-primary tracking-tight"
      >
        StudySprout
      </motion.h1>

      {/* Inspiring line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-4 font-body text-xl sm:text-2xl text-muted-foreground max-w-xs"
      >
        {TAGLINE}
      </motion.p>

      {/* While auth is still loading, show bouncing pixel dots.
          Once ready, swap them for the action buttons. */}
      {!ready ? (
        <div className="mt-9 flex items-center gap-2" aria-label="Loading">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-2.5 w-2.5 bg-primary"
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-9 flex flex-col items-center gap-3 w-full max-w-[16rem]"
        >
          <button
            type="button"
            onClick={onContinue}
            className="w-full font-heading text-xs sm:text-sm px-6 py-3 bg-primary text-primary-foreground border-b-4 border-[hsl(120_25%_25%)] rounded-md transition-all hover:brightness-110 active:translate-y-0.5 active:border-b-2"
          >
            Continue
          </button>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noreferrer noopener"
            onClick={(e) => {
              e.preventDefault();
              openExternal(PORTFOLIO_URL);
            }}
            className="w-full text-center font-heading text-xs sm:text-sm px-6 py-3 bg-secondary text-secondary-foreground border-b-4 border-border rounded-md transition-all hover:brightness-105 active:translate-y-0.5 active:border-b-2"
          >
            Contact me
          </a>
        </motion.div>
      )}

      {/* Creator credit + GitHub link, bottom corner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-2 font-body text-base text-muted-foreground"
      >
        <span>Created by {CREATOR}</span>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer noopener"
          onClick={(e) => {
            e.preventDefault();
            openExternal(GITHUB_URL);
          }}
          aria-label="View StudySprout on GitHub"
          className="text-muted-foreground transition-colors hover:text-primary"
        >
          <GitHubIcon className="h-5 w-5" />
        </a>
      </motion.div>
    </div>
  );
}
