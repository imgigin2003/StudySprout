import React, { useState, useEffect } from "react";
import {
  Sprout,
  Clock,
  Flame,
  Droplets,
  Lock,
  VolumeX,
  Volume2,
} from "lucide-react";
import api from "@/utils/api";
import PlantEmoji from "@/components/garden/PlantEmoji";
import HarvestedPlantDetail from "@/components/plant/HarvestedPlantDetail";
import { useMusic } from "@/components/MusicProvider";

const achievements = [
  {
    id: "first_bloom",
    name: "FIRST BLOOM",
    description: "Plant your first seed",
    icon: "🌸",
    bgColor: "bg-accent/20",
    borderColor: "border-accent",
    check: (stats, plants) => plants.length >= 1,
  },
  {
    id: "week_warrior",
    name: "WEEK WARRIOR",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/30",
    check: (stats) => (stats?.streakDays || 0) >= 7,
  },
  {
    id: "green_thumb",
    name: "GREEN THUMB",
    description: "Master 5 plants",
    icon: "🏆",
    bgColor: "bg-muted",
    borderColor: "border-border",
    check: (stats, plants) => plants.filter((p) => p.isMaster).length >= 5,
    progress: (stats, plants) => ({
      current: plants.filter((p) => p.isMaster).length,
      total: 5,
    }),
  },
];

export default function ShelfPage() {
  const { isPlaying, toggle } = useMusic();
  const [plants, setPlants] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const loadShelf = async () => {
    try {
      const response = await api.get("/plant/harvested");
      setPlants(response.data.harvestedPlants || []);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to load shelf:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShelf();
  }, []);

  const handleDelete = async (plantId) => {
    try {
      await api.delete("/plant/harvested", { data: { plantId } });
      loadShelf();
    } catch (error) {
      console.error("Failed to delete plant:", error);
    }
  };

  const mastered = plants.filter((p) => p.isMaster);
  const totalFocusHours = Math.round((stats?.totalFocusMinutes || 0) / 60);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const shelfRows = [
    { start: 0, end: 3 },
    { start: 3, end: 6 },
  ];

  return (
    <div className="px-4 py-4 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h1 className="font-heading text-sm text-foreground flex items-center justify-center gap-2">
            🌿 MY SHELF 🌿
          </h1>
          <p className="font-heading text-[7px] text-muted-foreground mt-1">
            MASTERED PLANTS · {mastered.length} OF {plants.length}
          </p>
        </div>
        <button
          onClick={toggle}
          className="bg-secondary border border-border rounded-md p-2 shrink-0"
          aria-label={isPlaying ? "Mute music" : "Play music"}
        >
          {isPlaying ? (
            <Volume2 size={16} className="text-foreground" />
          ) : (
            <VolumeX size={16} className="text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Shelf Display — mastered only */}
      <div className="bg-card border-2 border-border rounded-lg p-4 mb-5">
        <div className="flex justify-center mb-4 text-3xl">🪟</div>

        {shelfRows.map((row, rowIdx) => (
          <div key={rowIdx}>
            <div className="grid grid-cols-3 gap-3 mb-1">
              {Array.from({ length: 3 }).map((_, i) => {
                const idx = row.start + i;
                const plant = mastered[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => plant && setSelectedPlant(plant)}
                    className={`flex flex-col items-center p-3 rounded-md border-2 transition-colors ${
                      plant
                        ? "bg-secondary border-border hover:bg-secondary/80 cursor-pointer"
                        : "bg-muted/50 border-dashed border-border cursor-default"
                    }`}
                  >
                    {plant ? (
                      <>
                        <PlantEmoji
                          type={plant.plantType}
                          stage="bloom"
                          animate={false}
                          size="md"
                        />
                        <span className="font-heading text-[7px] text-foreground mt-1 uppercase">
                          {plant.plantType}
                        </span>
                        <span className="font-heading text-[6px] text-muted-foreground truncate w-full text-center">
                          {plant.name}
                        </span>
                        <span className="font-heading text-[6px] text-chart-1">
                          MASTERED ✅
                        </span>
                        <span className="font-body text-xs text-primary mt-0.5">
                          💚 {plant.xpValue} XP
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock
                          size={20}
                          className="text-muted-foreground mb-1"
                        />
                        <span className="font-heading text-[6px] text-muted-foreground">
                          EMPTY SLOT
                        </span>
                        <span className="font-body text-xs text-muted-foreground">
                          HARVEST MORE!
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="h-2 bg-amber-700/30 rounded-sm mb-4" />
          </div>
        ))}
      </div>

      {/* All harvested plants list */}
      {plants.length > 0 && (
        <div className="mb-5">
          <p className="font-heading text-[9px] text-foreground mb-3">
            🌿 ALL HARVESTED PLANTS
          </p>
          <div className="flex flex-col gap-2">
            {plants.map((plant) => (
              <button
                key={plant._id}
                onClick={() => setSelectedPlant(plant)}
                className="flex items-center gap-3 bg-secondary border border-border rounded-md px-3 py-2 hover:bg-secondary/80 transition-colors text-left w-full"
              >
                <PlantEmoji
                  type={plant.plantType}
                  stage="bloom"
                  animate={false}
                  size="sm"
                />
                <div className="flex-1">
                  <p className="font-heading text-[8px] text-foreground uppercase">
                    {plant.name}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    {plant.plantType} · {plant.xpValue} XP ·{" "}
                    {plant.growthDuration} min
                  </p>
                </div>
                {plant.isMaster && (
                  <span className="font-heading text-[6px] text-chart-1">
                    🏆 MASTERED
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {plants.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-4xl mb-2">🌱</div>
          <p className="font-heading text-[8px]">NO HARVESTED PLANTS YET</p>
          <p className="font-body text-xs mt-1">
            Grow and harvest plants in your garden!
          </p>
        </div>
      )}

      {/* Achievements */}
      <div className="mb-5">
        <h2 className="font-heading text-[9px] text-foreground mb-3 flex items-center gap-1">
          🏆 ACHIEVEMENTS ✦
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map((ach) => {
            const completed = ach.check(stats, plants);
            const prog = ach.progress ? ach.progress(stats, plants) : null;
            return (
              <div
                key={ach.id}
                className={`p-3 rounded-md border-2 ${ach.bgColor} ${ach.borderColor} text-center`}
              >
                <div className="text-2xl mb-1">
                  {completed ? ach.icon : "🔒"}
                </div>
                <p className="font-heading text-[6px] text-foreground">
                  {ach.name}
                </p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  {ach.description}
                </p>
                {completed && (
                  <p className="font-heading text-[6px] text-chart-1 mt-1">
                    COMPLETED ✅
                  </p>
                )}
                {!completed && prog && (
                  <div className="mt-1">
                    <div className="w-full h-2 bg-secondary rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-sm"
                        style={{
                          width: `${(prog.current / prog.total) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="font-body text-xs text-muted-foreground">
                      {prog.current} / {prog.total}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-4 gap-2">
        <StatBox
          icon={<Sprout size={18} className="text-primary" />}
          value={mastered.length}
          label="PLANTS MASTERED"
        />
        <StatBox
          icon={<Clock size={18} className="text-primary" />}
          value={totalFocusHours}
          label="HOURS FOCUSED"
        />
        <StatBox
          icon={<Flame size={18} className="text-destructive" />}
          value={stats?.streakDays || 0}
          label="DAY STREAK"
        />
        <StatBox
          icon={<Droplets size={18} className="text-chart-2" />}
          value={`${stats?.totalXP || 0} XP`}
          label="TOTAL XP"
        />
      </div>

      {/* Detail modal */}
      <HarvestedPlantDetail
        plant={selectedPlant}
        isOpen={!!selectedPlant}
        onClose={() => setSelectedPlant(null)}
        onDelete={handleDelete}
      />
    </div>
  );
}

function StatBox({ icon, value, label }) {
  return (
    <div className="bg-card border border-border rounded-md p-2 flex flex-col items-center gap-1 text-center">
      {icon}
      <span className="font-heading text-sm text-foreground">{value}</span>
      <span className="font-heading text-[4px] text-muted-foreground tracking-wider leading-tight">
        {label}
      </span>
    </div>
  );
}
