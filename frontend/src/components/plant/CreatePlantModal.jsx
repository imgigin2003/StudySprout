import React, { useState } from "react";
import { X, Sprout, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const plantTypes = [
  { value: "rose", label: "🌹 Rose", requiredStreak: 0 },
  { value: "cactus", label: "🌵 Cactus", requiredStreak: 0 },
  { value: "sunflower", label: "🌻 Sunflower", requiredStreak: 7 },
  { value: "tulip", label: "🌷 Tulip", requiredStreak: 7 },
  { value: "fern", label: "☘️ Fern", requiredStreak: 14 },
  { value: "daisy", label: "🌼 Daisy", requiredStreak: 14 },
];

export default function CreatePlantModal({
  isOpen,
  onClose,
  onSubmit,
  rowIndex,
  plotIndex,
  streakDays = 0,
}) {
  const [step, setStep] = useState("form"); // "form" | "mastery-confirm"
  const [subject, setSubject] = useState("");
  const [plantType, setPlantType] = useState("rose");
  const [xpValue, setXpValue] = useState("");
  const [growthDuration, setGrowthDuration] = useState("");
  const [description, setDescription] = useState("");
  const [isMastered, setIsMastered] = useState(false);
  const [tooltip, setTooltip] = useState(null);

  if (!isOpen) return null;

  const reset = () => {
    setStep("form");
    setSubject("");
    setPlantType("rose");
    setXpValue("");
    setGrowthDuration("");
    setDescription("");
    setIsMastered(false);
    setTooltip(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleMasteryToggle = (e) => {
    if (e.target.checked) {
      setStep("mastery-confirm");
    } else {
      setIsMastered(false);
    }
  };

  const confirmMastery = () => {
    setIsMastered(true);
    setStep("form");
  };

  const cancelMastery = () => {
    setIsMastered(false);
    setStep("form");
  };

  const handleSubmit = () => {
    if (!subject.trim()) return;
    const selected = plantTypes.find((p) => p.value === plantType);
    if (selected && streakDays < selected.requiredStreak) return;

    onSubmit({
      name: subject,
      plant_type: plantType,
      xpValue: parseInt(xpValue) || 100,
      growthDuration: parseInt(growthDuration) || 30,
      description,
      isMaster: isMastered,
      row_index: rowIndex,
      plot_index: plotIndex,
    });
    reset();
    onClose();
  };

  // Mastery confirmation screen
  if (step === "mastery-confirm") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
        <div className="w-full max-w-sm bg-card border-2 border-border rounded-lg p-5">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-4xl">🏆</div>
            <h2 className="font-heading text-xs text-foreground">
              MARK AS MASTERED?
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Are you sure you've fully mastered{" "}
              <span className="text-foreground font-medium">
                {subject || "this topic"}
              </span>
              ? This will mark the plant as mastered and harvest it immediately.
            </p>
            <div className="flex gap-2 w-full mt-2">
              <Button
                variant="outline"
                onClick={cancelMastery}
                className="flex-1 font-heading text-[8px] tracking-wider h-10"
              >
                NOT YET
              </Button>
              <Button
                onClick={confirmMastery}
                className="flex-1 font-heading text-[8px] tracking-wider h-10"
              >
                <Trophy size={14} className="mr-1" /> YES, MASTERED!
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-sm bg-card border-2 border-border rounded-lg p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xs text-foreground flex items-center gap-2">
            <Sprout size={16} /> PLANT A SEED
          </h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Subject */}
          <div>
            <label className="font-heading text-[8px] text-foreground block mb-1">
              🌱 SUBJECT NAME
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Organic Chemistry"
              className="font-body text-sm bg-background border-border"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-heading text-[8px] text-foreground block mb-1">
              📝 GOALS / DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Understand reaction mechanisms, complete 3 past papers..."
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* XP Value */}
          <div>
            <label className="font-heading text-[8px] text-foreground block mb-1">
              ⭐ TOTAL XP TO EARN
            </label>
            <Input
              type="number"
              value={xpValue}
              onChange={(e) => setXpValue(e.target.value)}
              placeholder="e.g. 500"
              min={1}
              className="font-body text-sm bg-background border-border"
            />
            <p className="font-body text-xs text-muted-foreground mt-1">
              How much XP should mastering this topic be worth?
            </p>
          </div>

          {/* Growth Duration */}
          <div>
            <label className="font-heading text-[8px] text-foreground block mb-1">
              ⏳ ESTIMATED STUDY TIME (MINUTES)
            </label>
            <Input
              type="number"
              value={growthDuration}
              onChange={(e) => setGrowthDuration(e.target.value)}
              placeholder="e.g. 120"
              min={1}
              className="font-body text-sm bg-background border-border"
            />
            <p className="font-body text-xs text-muted-foreground mt-1">
              How long until you expect to master this topic?
            </p>
          </div>

          {/* Plant Type */}
          <div>
            <label className="font-heading text-[8px] text-foreground block mb-2">
              🪴 CHOOSE YOUR PLANT
            </label>
            <div className="grid grid-cols-3 gap-2">
              {plantTypes.map((pt) => {
                const locked = streakDays < pt.requiredStreak;
                const isSelected = plantType === pt.value;
                return (
                  <div key={pt.value} className="relative">
                    <button
                      onClick={() => {
                        if (locked) {
                          setTooltip(tooltip === pt.value ? null : pt.value);
                        } else {
                          setPlantType(pt.value);
                          setTooltip(null);
                        }
                      }}
                      className={`w-full p-2 rounded-md border-2 text-center font-body text-sm transition-all ${
                        locked
                          ? "border-border bg-muted opacity-50 cursor-not-allowed"
                          : isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      {locked && (
                        <span className="absolute top-1 right-1 text-[10px]">
                          🔒
                        </span>
                      )}
                      {pt.label}
                    </button>
                    {locked && tooltip === pt.value && (
                      <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-foreground text-background font-heading text-[7px] text-center px-2 py-1.5 rounded-md shadow-lg">
                        🔥 REACH {pt.requiredStreak} DAY STREAK TO UNLOCK
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Already Mastered toggle */}
          <div className="flex items-center justify-between bg-secondary border border-border rounded-md px-3 py-2">
            <div>
              <p className="font-heading text-[8px] text-foreground">
                🏆 ALREADY MASTERED THIS?
              </p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">
                Mark topic as complete & harvest immediately
              </p>
            </div>
            <input
              type="checkbox"
              checked={isMastered}
              onChange={handleMasteryToggle}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
          </div>

          {isMastered && (
            <div className="bg-primary/10 border border-primary/30 rounded-md px-3 py-2 text-center">
              <span className="font-heading text-[8px] text-primary">
                🏆 WILL BE MARKED AS MASTERED ON PLANT
              </span>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!subject.trim()}
            className="w-full font-heading text-[9px] tracking-wider h-11"
          >
            🌱 PLANT SEED
          </Button>
        </div>
      </div>
    </div>
  );
}
