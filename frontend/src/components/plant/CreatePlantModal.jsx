import React, { useState } from "react";
import { X, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const plantTypes = [
  { value: "sunflower", label: "🌻 Sunflower" },
  { value: "rose", label: "🌹 Rose" },
  { value: "cactus", label: "🌵 Cactus" },
  { value: "tulip", label: "🌷 Tulip" },
  { value: "fern", label: "☘️ Fern" },
  { value: "daisy", label: "🌼 Daisy" },
];

export default function CreatePlantModal({
  isOpen,
  onClose,
  onSubmit,
  rowIndex,
  plotIndex,
}) {
  const [subject, setSubject] = useState("");
  const [plantType, setPlantType] = useState("sunflower");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!subject.trim()) return;
    onSubmit({
      name: subject,
      subject,
      plant_type: plantType,
      row_index: rowIndex,
      plot_index: plotIndex,
    });
    setSubject("");
    setPlantType("sunflower");
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
              {plantTypes.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => setPlantType(pt.value)}
                  className={`p-2 rounded-md border-2 text-center font-body text-sm transition-all ${
                    plantType === pt.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  {pt.label}
                </button>
              ))}
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
