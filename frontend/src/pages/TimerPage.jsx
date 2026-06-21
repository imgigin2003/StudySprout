import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/utils/api";
import { ChevronLeft, VolumeX, Volume2 } from "lucide-react";
import PomodoroTimer from "@/components/timer/PomodroTimer";
import { useMusic } from "@/components/MusicProvider";

export default function TimerPage() {
  const { isPlaying, toggle } = useMusic();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plotId = searchParams.get("plotId");

  const [plant, setPlant] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(!!plotId);

  useEffect(() => {
    if (plotId) {
      const fetchPlot = async () => {
        try {
          const response = await api.get("/garden");
          const plot = response.data.garden.find((p) => p._id === plotId);
          if (plot) setPlant(plot);
        } catch (error) {
          console.error("Failed to fetch plot:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPlot();
    }
  }, [plotId]);

  const handleStart = async (minutes) => {
    try {
      const response = await api.post("/pomodoro/start", {
        plotId: plotId,
        timeDuration: minutes,
      });
      setSessionId(response.data.sessionDetail._id);
    } catch (error) {
      console.error("Failed to start session:", error.response?.data?.message);
    }
  };

  const handleComplete = async () => {
    try {
      await api.post("/pomodoro/complete", { sessionId });
      navigate("/garden");
    } catch (error) {
      console.error(
        "Failed to complete session:",
        error.response?.data?.message,
      );
    }
  };

  const handleStopEarly = async () => {
    try {
      await api.post("/pomodoro/stop", { sessionId });
      navigate("/garden");
    } catch (error) {
      console.error("Failed to stop session:", error.response?.data?.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 lg:px-8 lg:py-8">
      {/* Header — three-column flex row, nothing absolutely positioned */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <button
          onClick={() => navigate("/garden")}
          className="flex items-center gap-1 text-foreground font-heading text-[8px] shrink-0"
        >
          <ChevronLeft size={16} /> GARDEN
        </button>
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-lg shrink-0">🌱</span>
          <span className="font-heading text-xs text-foreground truncate">
            FOCUS MODE
          </span>
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

      {/* Timer */}
      <PomodoroTimer
        plant={plant}
        onStart={handleStart}
        onComplete={handleComplete}
        onCancel={handleStopEarly}
      />
    </div>
  );
}
