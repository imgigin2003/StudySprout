import React from "react";
import { Plus } from "lucide-react";
import PlantEmoji from "./PlantEmoji";
import XPBar from "./XPBar";

export default function PlotSlot({ plant, onPlantClick, onEmptyClick }) {
  if (!plant) {
    return (
      <button
        onClick={onEmptyClick}
        className="flex flex-col items-center justify-center w-full aspect-square bg-amber-800/30 border-2 border-dashed border-border rounded-md hover:bg-amber-800/40 transition-colors"
      >
        <Plus size={24} className="text-muted-foreground mb-1" />
        <span className="font-heading text-[6px] text-muted-foreground">
          EMPTY PLOT
        </span>
        <span className="font-body text-xs text-muted-foreground">
          TAP TO PLANT
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={() => onPlantClick(plant)}
      className="flex flex-col items-center justify-center w-full aspect-square bg-amber-800/20 border-2 border-border rounded-md hover:bg-amber-800/30 transition-colors p-2"
    >
      <PlantEmoji
        type={plant.plant_type}
        stage={plant.growth_stage}
        size="md"
      />
      <XPBar
        current={plant.xp}
        max={plant.xp_to_next}
        size="sm"
        showLabel={false}
      />
      <span className="font-body text-sm text-foreground mt-0.5">
        {plant.xp} XP
      </span>
      <span className="font-heading text-[7px] text-foreground tracking-wide uppercase mt-0.5">
        {plant.subject}
      </span>
    </button>
  );
}
