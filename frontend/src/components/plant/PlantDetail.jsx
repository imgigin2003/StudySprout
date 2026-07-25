import React, { useState } from "react";
import { X, Play, Trash2, Sprout, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlantEmoji, {
  getGrowthStage,
  getGrowthProgress,
} from "@/components/garden/PlantEmoji";
import XPBar from "@/components/garden/XPBar";

const stageLabels = {
  seed: "SEED",
  sprout: "SPROUT",
  bloom: "BLOOM",
};

export default function PlantDetail({
  plant,
  isOpen,
  onClose,
  onStudy,
  onDelete,
  onHarvest,
}) {
  const [confirmHarvest, setConfirmHarvest] = useState(false);
  const [markMastered, setMarkMastered] = useState(false);
  const [confirmMaster, setConfirmMaster] = useState(false);

  if (!isOpen || !plant) return null;

  const isReadyToHarvest = plant?.plantStatus === "ready to harvest";
  const stage = getGrowthStage(
    plant.currentXP,
    plant.plant?.xpValue,
    plant.plant?.isMaster,
  );
  const progressPct = Math.round(
    getGrowthProgress(plant.currentXP, plant.plant?.xpValue) * 100,
  );

  const handleHarvestConfirm = () => {
    onHarvest(plant._id, markMastered);
    setConfirmHarvest(false);
    setMarkMastered(false);
  };

  // "Mark as mastered" = early mastery: fills XP to max, flags the plant as
  // mastered, and moves it to the shelf so it can go on the display window.
  const handleMasterConfirm = () => {
    onHarvest(plant._id, true);
    setConfirmMaster(false);
  };

  const alreadyMastered = plant.plant?.isMaster;

  return (
    <>
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
            <PlantEmoji type={plant.plant?.plantType} stage={stage} size="xl" />
            <div className="bg-secondary px-3 py-1 rounded-md border border-border">
              <span className="font-heading text-[8px] text-foreground">
                {plant.plant?.plantType?.toUpperCase()} · {stageLabels[stage]} ·{" "}
                {progressPct}%
              </span>
            </div>
            <div className="w-full">
              <XPBar
                current={plant.currentXP}
                max={plant.plant?.xpValue}
                size="md"
              />
              <p className="font-heading text-[7px] text-muted-foreground text-center mt-1">
                {plant.currentXP} / {plant.plant?.xpValue} XP
              </p>
            </div>

            {plant.plant?.description && (
              <div className="w-full bg-secondary border border-border rounded-md px-3 py-2">
                <p className="font-heading text-[7px] text-muted-foreground mb-1">
                  📝 GOALS
                </p>
                <p className="font-body text-xs text-foreground">
                  {plant.plant.description}
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex gap-2">
              {isReadyToHarvest ? (
                <Button
                  onClick={() => setConfirmHarvest(true)}
                  className="flex-1 font-heading text-[8px] tracking-wider h-10 bg-yellow-600 hover:bg-yellow-700"
                >
                  <Sprout size={14} className="mr-1" /> HARVEST
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    onClose();
                    onStudy(plant);
                  }}
                  className="flex-1 font-heading text-[8px] tracking-wider h-10"
                >
                  <Play size={14} className="mr-1" /> STUDY NOW
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={() => onDelete(plant._id)}
                className="font-heading text-[8px] tracking-wider h-10 px-3"
              >
                <Trash2 size={14} />
              </Button>
            </div>

            {/* Mark as mastered — shown while the plant is still growing, lets
                the user instantly master it (max XP + eligible for display). */}
            {!isReadyToHarvest && !alreadyMastered && (
              <Button
                variant="outline"
                onClick={() => setConfirmMaster(true)}
                className="w-full font-heading text-[8px] tracking-wider h-10 border-primary/40 text-primary hover:bg-primary/10"
              >
                <Award size={14} className="mr-1" /> MARK AS MASTERED
              </Button>
            )}
          </div>
        </div>
      </div>

      {confirmMaster && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-sm bg-card border-2 border-border rounded-lg p-5">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="text-4xl">🏆</div>
              <h3 className="font-heading text-xs text-foreground">
                MARK AS MASTERED?
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Are you sure you've mastered{" "}
                <span className="text-foreground font-medium">
                  {plant.plant?.name}
                </span>
                ? This fills it to{" "}
                <span className="text-foreground font-medium">
                  {plant.plant?.xpValue} XP
                </span>{" "}
                and moves it to your shelf, ready for the display window.
              </p>

              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => setConfirmMaster(false)}
                  className="flex-1 font-heading text-[8px] tracking-wider h-10"
                >
                  CANCEL
                </Button>
                <Button
                  onClick={handleMasterConfirm}
                  className="flex-1 font-heading text-[8px] tracking-wider h-10 bg-primary hover:bg-primary/90"
                >
                  MASTER 🏆
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmHarvest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-sm bg-card border-2 border-border rounded-lg p-5">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="text-4xl">🌸</div>
              <h3 className="font-heading text-xs text-foreground">
                HARVEST PLANT?
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                You're about to harvest{" "}
                <span className="text-foreground font-medium">
                  {plant.plant?.name}
                </span>
                . Did you fully master this topic?
              </p>

              <div className="w-full flex items-center gap-3 bg-secondary border border-border rounded-md px-3 py-2">
                <input
                  type="checkbox"
                  id="mastered-check"
                  checked={markMastered}
                  onChange={(e) => setMarkMastered(e.target.checked)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                <label
                  htmlFor="mastered-check"
                  className="font-heading text-[8px] text-foreground cursor-pointer"
                >
                  🏆 MARK AS MASTERED
                </label>
              </div>

              {markMastered && (
                <div className="w-full bg-primary/10 border border-primary/30 rounded-md px-3 py-2">
                  <p className="font-heading text-[7px] text-primary">
                    🏆 THIS PLANT WILL BE ADDED TO YOUR SHELF AS MASTERED
                  </p>
                </div>
              )}

              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => {
                    setConfirmHarvest(false);
                    setMarkMastered(false);
                  }}
                  className="flex-1 font-heading text-[8px] tracking-wider h-10"
                >
                  CANCEL
                </Button>
                <Button
                  onClick={handleHarvestConfirm}
                  className="flex-1 font-heading text-[8px] tracking-wider h-10"
                >
                  HARVEST 🌸
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
