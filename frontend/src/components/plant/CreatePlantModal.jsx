import React, { useState } from "react";
import { X, Sprout } from "lucide-react";
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
  const [subject, setSubject] = useState("");
  const [plantType, setPlantType] = useState("rose");
  const [tooltip, setTooltip] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!subject.trim()) return;
    const selected = plantTypes.find((p) => p.value === plantType);
    if (selected && streakDays < selected.requiredStreak) return;
    onSubmit({
      name: subject,
      subject,
      plant_type: plantType,
      row_index: rowIndex,
      plot_index: plotIndex,
    });
    setSubject("");
    setPlantType("rose");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-sm bg-card border-2 border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xs text-foreground flex items-center gap-2">
            <Sprout size={16} /> PLANT A SEED
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-heading text-[8px] text-foreground block mb-1">
              🌱 SUBJECT NAME
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Organic Chemistry"
              className="font-body text-lg bg-background border-border"
            />
          </div>

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

          <Button
            onClick={handleSubmit}
            className="w-full font-heading text-[9px] tracking-wider h-11"
          >
            🌱 PLANT SEED
          </Button>
        </div>
      </div>
    </div>
  );
}
