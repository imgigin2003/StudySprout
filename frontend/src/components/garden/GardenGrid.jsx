import React from "react";
import PlotSlot from "./PlotSlot";

export default function GardenGrid({ plants, onPlantClick, onEmptyClick }) {
  const maxRows = 3;
  const plotsPerRow = 3;
  const totalSlots = maxRows * plotsPerRow;
  const rows = [];

  for (let r = 0; r < maxRows; r++) {
    const slots = [];
    for (let p = 0; p < plotsPerRow; p++) {
      const index = r * plotsPerRow + p;
      const plot = plants[index] || null;
      slots.push(
        <PlotSlot
          key={`${r}-${p}`}
          plant={plot}
          onPlantClick={onPlantClick}
          onEmptyClick={() => onEmptyClick(r, p)}
        />,
      );
    }
    rows.push(
      <div key={r} className="border-2 border-border rounded-lg p-3 bg-card">
        <div className="grid grid-cols-3 gap-2">{slots}</div>
      </div>,
    );
  }

  return <div className="flex flex-col gap-4">{rows}</div>;
}
