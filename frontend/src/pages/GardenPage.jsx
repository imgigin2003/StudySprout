import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Sprout,
  Droplets,
  Calendar,
  Flame,
  VolumeX,
  Volume2,
} from "lucide-react";
import GardenGrid from "../components/garden/GardenGrid";
import XPBar from "../components/garden/XPBar";
import CreatePlantModal from "../components/plant/CreatePlantModal";
import PlantDetail from "../components/plant/PlantDetail";
import { useMusic } from "@/components/MusicProvider";
import api from "../utils/api";

export default function GardenPage() {
  const { isPlaying, toggle } = useMusic();
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createRow, setCreateRow] = useState(0);
  const [createPlot, setCreatePlot] = useState(0);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // Your backend returns { garden: [...] } from /garden
      // and { user: {...} } from /auth/profile for stats
      const [gardenRes, profileRes] = await Promise.all([
        api.get("/garden"),
        api.get("/auth/profile"),
      ]);

      // 'garden' in your User model is an array of { plant: {...}, currentXP, plantStatus }
      setPlants(gardenRes.data.garden || []);
      setStats(profileRes.data.user || null);
    } catch (error) {
      console.error("Failed to load garden data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePlant = async (data) => {
    try {
      await api.post("/garden/plant", {
        name: data.name,
        plant_type: data.plant_type,
        xpValue: data.xpValue,
        growthDuration: data.growthDuration,
        description: data.description,
        isMaster: data.isMaster,
      });
      loadData();
    } catch (error) {
      console.error("Failed to plant seed:", error);
    }
  };

  const handleDeletePlant = async (id) => {
    try {
      await api.delete("/garden/delete", { data: { plotId: id } });
      setSelectedPlant(null);
      loadData();
    } catch (error) {
      console.error("Failed to remove plant:", error);
    }
  };

  const handleStudy = (plant) => {
    // plant._id is the plot ID in your garden array
    navigate(`/timer?plotId=${plant._id}`);
  };

  const handleHarvestPlant = async (id, markMastered) => {
    try {
      await api.post("/garden/harvest", {
        plotId: id,
        isEarlyMastery: markMastered,
      });
      setSelectedPlant(null);
      loadData();
    } catch (error) {
      console.error("Failed to harvest plant:", error);
    }
  };

  const handleEmptyClick = (row, plot) => {
    setCreateRow(row);
    setCreatePlot(plot);
    setShowCreate(true);
  };

  // Map stats from your backend User model
  const totalXP = stats?.totalXP || 0;
  const gardenName = stats?.gardenName || "My Garden";
  const streak = stats?.streakDays || 0;
  const focusRate = 0; // Logic for this can be added to your backend later

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      {/* Top XP Bar */}
      <div className="mb-4">
        <p className="font-heading text-[7px] text-foreground mb-1">TOTAL XP</p>
        <div className="flex items-center gap-2">
          <Sprout size={16} className="text-primary" />
          <div className="flex-1">
            <XPBar current={totalXP} max={5000} size="lg" showLabel={false} />
          </div>
          <span className="font-body text-sm text-foreground">
            {totalXP.toLocaleString()} XP
          </span>
          <div className="flex items-center gap-1 bg-destructive/10 px-2 py-1 rounded-md">
            <Flame size={14} className="text-destructive" />
            <span className="font-heading text-[8px] text-foreground">
              {streak}
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate("/")}
          className="bg-secondary border border-border rounded-md p-2"
        >
          <ChevronLeft size={16} className="text-foreground" />
        </button>
        <div>
          <h1 className="font-heading text-sm text-foreground flex items-center gap-2 uppercase">
            🌱 {gardenName}
          </h1>
          <p className="font-heading text-[7px] text-muted-foreground mt-0.5">
            YOUR FOCUS, YOUR GARDEN
          </p>
        </div>
      </div>

      <button
        onClick={toggle}
        className="absolute top-6 left-6 bg-card border-2 border-border rounded-md p-2 z-10"
        aria-label={isPlaying ? "Mute music" : "Play music"}
      >
        {isPlaying ? (
          <Volume2 size={16} className="text-foreground" />
        ) : (
          <VolumeX size={16} className="text-muted-foreground" />
        )}
      </button>

      {/* Garden Grid */}
      <GardenGrid
        plants={plants}
        onPlantClick={(p) => setSelectedPlant(p)}
        onEmptyClick={handleEmptyClick}
      />

      {/* Garden Stats */}
      <div className="mt-6">
        <h2 className="font-heading text-[9px] text-foreground mb-3 flex items-center gap-1">
          🌿 GARDEN STATS
        </h2>
        <div className="grid grid-cols-4 gap-2">
          <StatCard
            icon={<Sprout size={18} className="text-primary" />}
            value={plants.length}
            label="PLANTS"
          />
          <StatCard
            icon={<span className="text-lg">⭐</span>}
            value={totalXP}
            label="TOTAL XP"
          />
          <StatCard
            icon={<Calendar size={18} className="text-primary" />}
            value={streak}
            label="DAY STREAK"
          />
          <StatCard
            icon={<Droplets size={18} className="text-chart-2" />}
            value={`${focusRate}%`}
            label="FOCUS RATE"
          />
        </div>
      </div>

      {/* Modals */}
      <CreatePlantModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreatePlant}
        rowIndex={createRow}
        plotIndex={createPlot}
        streakDays={streak}
      />
      <PlantDetail
        plant={selectedPlant}
        isOpen={!!selectedPlant}
        onClose={() => setSelectedPlant(null)}
        onStudy={handleStudy}
        onDelete={handleDeletePlant}
        onHarvest={handleHarvestPlant}
      />
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-card border border-border rounded-md p-2 flex flex-col items-center gap-1">
      {icon}
      <span className="font-heading text-sm text-foreground">{value}</span>
      <span className="font-heading text-[5px] text-muted-foreground tracking-wider">
        {label}
      </span>
    </div>
  );
}
