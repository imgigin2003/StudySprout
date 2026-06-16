import React from "react";
import { X, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlantEmoji from "@/components/garden/PlantEmoji";
import XPBar from "@/components/garden/XPBar";

export default function PlantDetail({
  plant,
  isOpen,
  onClose,
  onStudy,
  onDelete,
}) {
  if (!isOpen || !plant) return null;

  const stageLabels = {
    seed: "Seed",
    sprout: "Sprout",
    bud: "Bud",
    bloom: "Bloom",
    mastered: "Mastered!",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-sm bg-card border-2 border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xs text-foreground uppercase">
            {plant.plant?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <PlantEmoji
            type={plant.plant?.plantType}
            stage={plant.plantStatus}
            size="xl"
          />
          <div className="bg-secondary px-3 py-1 rounded-md border border-border">
            <span className="font-heading text-[8px] text-foreground">
              {plant.plant?.plantType?.toUpperCase()} ·{" "}
              {plant.plantStatus?.toUpperCase()}
            </span>
          </div>
          <div className="w-full">
            <XPBar
              current={plant.currentXP}
              max={plant.plant?.xpValue}
              size="md"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <Button
            onClick={() => {
              onClose();
              onStudy(plant);
            }}
            className="flex-1 font-heading text-[8px] tracking-wider h-10"
          >
            <Play size={14} className="mr-1" /> STUDY NOW
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(plant._id)}
            className="font-heading text-[8px] tracking-wider h-10 px-3"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
