// @ts-nocheck

import { useLocation } from "react-router-dom";
import { Sprout, Timer, BookOpen } from "lucide-react";
import SoundLink from "@/components/SoundLink";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();

  const gardenLabel = user?.gardenName
    ? user.gardenName.toUpperCase()
    : "MY GARDEN";

  const navItems = [
    { path: "/garden", label: gardenLabel, icon: Sprout },
    { path: "/timer", label: "STUDY TIMER", icon: Timer },
    { path: "/shelf", label: "MY SHELF", icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-primary border-t-2 border-border">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <SoundLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/60 hover:text-primary-foreground/80"
              }`}
            >
              <Icon size={20} strokeWidth={2.5} />
              <span className="font-heading text-[7px] tracking-wider truncate max-w-[80px] text-center">
                {item.label}
              </span>
            </SoundLink>
          );
        })}
      </div>
    </nav>
  );
}
