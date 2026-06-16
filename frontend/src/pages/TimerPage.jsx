import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/api";

export default function TimerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plotId = searchParams.get("plotId"); // Your backend uses the plotId in the garden

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
      setSessionId(response.data.session._id);
    } catch (error) {
      console.error("Failed to start session:", error.response?.data?.message);
    }
  };

  // Call this when the timer naturally finishes
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

  // Call this if the user stops the timer early
  const handleStopEarly = async () => {
    try {
      // 4. Your backend /pomodoro/stop calculates partial XP based on time spent!
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
    <div className="px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate("/garden")}
          className="flex items-center gap-1 text-foreground font-heading text-[8px]"
        >
          <ChevronLeft size={16} /> GARDEN
        </button>
        <div className="flex items-center gap-1">
          <span className="text-lg">🌱</span>
          <span className="font-heading text-xs text-foreground">
            FOCUS MODE
          </span>
        </div>
        <div className="w-16" />
      </div>

      {/* Timer */}
      <PomodoroTimer
        plant={plant}
        onComplete={handleComplete}
        onCancel={handleStopEarly}
      />
    </div>
  );
}
