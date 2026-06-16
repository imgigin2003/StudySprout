import React from "react";

export default function XPBar({ current, max, size = "md", showLabel = true }) {
  const pct = Math.min((current / max) * 100, 100);
  const heights = { sm: "h-2", md: "h-3", lg: "h-5" };

  return (
    <div className="w-full">
      <div
        className={`w-full ${heights[size]} bg-secondary border border-border rounded-sm overflow-hidden`}
      >
        <div
          className="h-full bg-primary transition-all duration-500 rounded-sm"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="font-body text-sm text-muted-foreground mt-0.5 text-center">
          {current} XP
        </p>
      )}
    </div>
  );
}
