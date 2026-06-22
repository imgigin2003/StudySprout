import React, { useState } from "react";
import { X, Trash2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlantEmoji from "@/components/garden/PlantEmoji";

export default function HarvestedPlantDetail({
  plant,
  isOpen,
  onClose,
  onDelete,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !plant) return null;

  const handleDelete = () => {
    onDelete(plant._id);
    setConfirmDelete(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
        <div className="w-full max-w-sm bg-card border-2 border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xs text-foreground uppercase flex items-center gap-2">
              {plant.isMaster && (
                <Trophy size={14} className="text-yellow-500" />
              )}
              {plant.name}
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>

          {/* Plant visual — harvested plants are always fully bloomed */}
          <div className="flex flex-col items-center gap-3">
            <PlantEmoji
              type={plant.plantType}
              stage="bloom"
              size="xl"
              animate={false}
            />

            <div
              className={`px-3 py-1 rounded-md border ${plant.isMaster ? "bg-yellow-500/10 border-yellow-500/30" : "bg-secondary border-border"}`}
            >
              <span className="font-heading text-[8px] text-foreground">
                {plant.plantType?.toUpperCase()} ·{" "}
                {plant.isMaster ? "🏆 MASTERED" : "HARVESTED"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-secondary border border-border rounded-md px-3 py-2 text-center">
              <p className="font-heading text-[7px] text-muted-foreground mb-1">
                ⭐ TOTAL XP
              </p>
              <p className="font-heading text-sm text-foreground">
                {plant.xpValue}
              </p>
            </div>
            <div className="bg-secondary border border-border rounded-md px-3 py-2 text-center">
              <p className="font-heading text-[7px] text-muted-foreground mb-1">
                ⏳ STUDY TIME
              </p>
              <p className="font-heading text-sm text-foreground">
                {plant.growthDuration} MIN
              </p>
            </div>
          </div>

          {plant.description ? (
            <div className="mt-3 bg-secondary border border-border rounded-md px-3 py-2">
              <p className="font-heading text-[7px] text-muted-foreground mb-1">
                📝 GOALS
              </p>
              <p className="font-body text-xs text-foreground leading-relaxed">
                {plant.description}
              </p>
            </div>
          ) : (
            <div className="mt-3 bg-secondary border border-border rounded-md px-3 py-2">
              <p className="font-body text-xs text-muted-foreground text-center">
                No goals were set for this topic.
              </p>
            </div>
          )}

          <Button
            variant="destructive"
            onClick={() => setConfirmDelete(true)}
            className="w-full font-heading text-[8px] tracking-wider h-10 mt-4"
          >
            <Trash2 size={14} className="mr-1" /> REMOVE FROM SHELF
          </Button>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-sm bg-card border-2 border-border rounded-lg p-5">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="text-4xl">🗑️</div>
              <h3 className="font-heading text-xs text-foreground">
                REMOVE FROM SHELF?
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                This will permanently delete{" "}
                <span className="text-foreground font-medium">
                  {plant.name}
                </span>{" "}
                from your shelf. This cannot be undone.
              </p>
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 font-heading text-[8px] tracking-wider h-10"
                >
                  CANCEL
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1 font-heading text-[8px] tracking-wider h-10"
                >
                  DELETE
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
