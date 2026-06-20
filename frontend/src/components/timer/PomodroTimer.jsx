// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";
import { Pause, Play, Check, X, Settings } from "lucide-react";
import PlantEmoji, { getGrowthStage } from "@/components/garden/PlantEmoji";

const stageLabels = {
  seed: "SEED",
  sprout: "SPROUT",
  bloom: "BLOOM",
};

export default function PomodoroTimer({
  plant,
  onStart,
  onComplete,
  onCancel,
}) {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState(1);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);
  const totalTime = isBreak
    ? (session % 4 === 0 ? longBreak : shortBreak) * 60
    : focusMinutes * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const isLocked = !plant;

  // Derive the plant's growth stage live from XP progress, so it updates
  // as the session progresses (e.g. after a "complete" XP bump from backend)
  const stage = plant
    ? getGrowthStage(
        plant.currentXP,
        plant.plant?.xpValue,
        plant.plant?.isMaster,
      )
    : "seed";

  const startTimer = useCallback(() => {
    setIsRunning(true);
    if (onStart) onStart(focusMinutes);
  }, [onStart, focusMinutes]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            if (!isBreak) {
              if (session < 4) {
                setIsBreak(true);
                setIsRunning(false);
                return (session % 4 === 0 ? longBreak : shortBreak) * 60;
              } else {
                onComplete(focusMinutes * 4);
                return 0;
              }
            } else {
              setIsBreak(false);
              setSession((s) => s + 1);
              setIsRunning(false);
              return focusMinutes * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [
    isRunning,
    isBreak,
    session,
    focusMinutes,
    shortBreak,
    longBreak,
    onComplete,
  ]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  const handleComplete = () => {
    const minutesStudied =
      Math.ceil((totalTime - timeLeft) / 60) + (session - 1) * focusMinutes;
    onComplete(Math.max(minutesStudied, 1));
  };

  const resetDefaults = () => {
    setFocusMinutes(25);
    setShortBreak(5);
    setLongBreak(15);
    setTimeLeft(25 * 60);
    setSession(1);
    setIsBreak(false);
    setIsRunning(false);
  };

  const adjustTime = (setter, current, delta, min = 1, max = 60) => {
    const newVal = Math.max(min, Math.min(max, current + delta));
    setter(newVal);
    if (!isRunning && !isBreak) {
      setTimeLeft(newVal * 60);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Subject Header */}
      <div className="text-center">
        <p className="font-body text-lg text-muted-foreground flex items-center justify-center gap-1">
          STUDYING
        </p>
        <h1 className="font-heading text-lg text-foreground mt-1 uppercase leading-relaxed">
          {plant?.plant?.name || "Free Study"}
        </h1>
        {plant && (
          <div className="mt-2 bg-secondary px-3 py-1 rounded-md border border-border inline-block">
            <span className="font-heading text-[7px] text-foreground">
              🌿 {plant.plant?.name?.toUpperCase()} ·{" "}
              {plant.plant?.plantType?.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Timer Display */}
      <div className="w-full bg-card border-2 border-border rounded-lg p-5 text-center relative">
        <div className="flex items-center justify-center gap-1 mb-2">
          <span className="font-heading text-[8px] text-muted-foreground">
            ⏳ FOCUS TIME
          </span>
        </div>
        <div className="font-display text-6xl text-foreground tracking-wider">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
        <div className="mt-2 flex items-center justify-center gap-1">
          <span className="text-sm">🌸</span>
          <span className="font-heading text-[7px] text-muted-foreground">
            {isBreak ? "BREAK TIME" : `POMODORO · SESSION ${session} OF 4`}
          </span>
        </div>

        {/* Settings button */}
        <button
          onClick={() => setShowSettings(true)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Plant Visual — stage is derived live from XP progress */}
      {plant && (
        <div className="flex flex-col items-center">
          <PlantEmoji type={plant.plant?.plantType} stage={stage} size="xl" />
          <div className="mt-2 bg-secondary px-3 py-1 rounded-md border border-border">
            <span className="font-heading text-[7px] text-foreground">
              🌿 {plant.plant?.plantType?.toUpperCase()} · {stageLabels[stage]}{" "}
              STAGE
            </span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          disabled={isLocked}
          className={`w-16 h-16 bg-secondary border-2 border-border rounded-lg flex items-center justify-center transition-colors ${isLocked ? "opacity-30 cursor-not-allowed" : "hover:bg-secondary/80"}`}
        >
          {isRunning ? (
            <Pause size={28} className="text-primary" />
          ) : (
            <Play size={28} className="text-primary" />
          )}
        </button>
        <button
          onClick={handleComplete}
          disabled={isLocked}
          className={`w-16 h-16 bg-secondary border-2 border-border rounded-lg flex items-center justify-center transition-colors ${isLocked ? "opacity-30 cursor-not-allowed" : "hover:bg-secondary/80"}`}
        >
          <Check size={28} className="text-chart-1" />
        </button>
        <button
          onClick={onCancel}
          disabled={isLocked}
          className={`w-16 h-16 bg-destructive/10 border-2 border-destructive/30 rounded-lg flex items-center justify-center transition-colors ${isLocked ? "opacity-30 cursor-not-allowed" : "hover:bg-destructive/20"}`}
        >
          <X size={28} className="text-destructive" />
        </button>
      </div>

      <div className="flex gap-8 font-heading text-[7px] text-muted-foreground -mt-1">
        <span>{isRunning ? "PAUSE" : "START"}</span>
        <span>COMPLETE</span>
        <span>CANCEL</span>
      </div>
      {isLocked && (
        <p className="font-heading text-[8px] text-muted-foreground text-center">
          🌱 SELECT A PLANT FROM YOUR GARDEN TO START FOCUSING
        </p>
      )}

      {/* Streak bonus */}
      <div className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-center">
        <span className="font-heading text-[7px] text-foreground">
          🔥 STREAK BONUS: +2 XP / MIN
        </span>
      </div>

      {/* Progress */}
      <div className="w-full">
        <div className="flex justify-between mb-1">
          <span className="font-heading text-[7px] text-foreground">
            SESSION PROGRESS
          </span>
          <span className="font-heading text-[7px] text-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-4 bg-secondary border border-border rounded-sm overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Message */}
      <div className="w-full bg-card border border-border rounded-md px-3 py-2 flex items-center justify-between">
        <span className="font-body text-sm text-foreground flex items-center gap-1">
          🌱 Stay focused, your garden is growing!
        </span>
        <span className="text-xl">🪴</span>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-sm bg-card border-2 border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-[9px] text-foreground">
                ✦ FOCUS SETTINGS ✦
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              <TimeAdjust
                label="⏳ POMODORO TIMER"
                sublabel="Focus time"
                value={focusMinutes}
                onChange={(d) => adjustTime(setFocusMinutes, focusMinutes, d)}
              />
              <div className="border-t border-border" />
              <TimeAdjust
                label="🍵 SHORT BREAK"
                sublabel="Short break between sessions"
                value={shortBreak}
                onChange={(d) => adjustTime(setShortBreak, shortBreak, d)}
              />
              <div className="border-t border-border" />
              <TimeAdjust
                label="☕ LONG BREAK"
                sublabel="Long break after 4 sessions"
                value={longBreak}
                onChange={(d) => adjustTime(setLongBreak, longBreak, d)}
              />
            </div>

            <button
              onClick={resetDefaults}
              className="w-full mt-5 bg-primary text-primary-foreground font-heading text-[8px] tracking-wider py-3 rounded-md hover:opacity-90 transition-opacity"
            >
              ↻ RESET TO DEFAULTS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TimeAdjust({ label, sublabel, value, onChange }) {
  return (
    <div>
      <p className="font-heading text-[8px] text-foreground mb-2">{label}</p>
      <div className="flex items-center gap-3 justify-center">
        <button
          onClick={() => onChange(-5)}
          className="w-10 h-10 bg-secondary border-2 border-border rounded-md flex items-center justify-center font-heading text-lg text-foreground hover:bg-secondary/80"
        >
          −
        </button>
        <div className="w-24 h-10 bg-background border-2 border-border rounded-md flex items-center justify-center">
          <span className="font-display text-xl text-foreground">
            {String(value).padStart(2, "0")}:00
          </span>
        </div>
        <button
          onClick={() => onChange(5)}
          className="w-10 h-10 bg-secondary border-2 border-border rounded-md flex items-center justify-center font-heading text-lg text-foreground hover:bg-secondary/80"
        >
          +
        </button>
      </div>
      <p className="font-body text-sm text-muted-foreground text-center mt-1">
        {sublabel}
      </p>
    </div>
  );
}
