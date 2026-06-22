// @ts-nocheck

import { useLocation } from "react-router-dom";
import { Sprout, Timer, BookOpen, LogOut } from "lucide-react";
import SoundLink from "@/components/SoundLink";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { user, isGuest, logout } = useAuth();

  const gardenLabel = isGuest
    ? "GUEST GARDEN"
    : user?.gardenName
      ? user.gardenName.toUpperCase()
      : "MY GARDEN";

  const navItems = [
    { path: "/garden", label: gardenLabel, icon: Sprout },
    { path: "/timer", label: "STUDY TIMER", icon: Timer },
    { path: "/shelf", label: "MY SHELF", icon: BookOpen },
  ];

  return (
    <>
      {/* Mobile: fixed bottom bar (below lg breakpoint) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-primary border-t-2 border-border">
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
          {/* Mobile logout button */}
          <button
            onClick={logout}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-md transition-all text-primary-foreground/60 hover:text-primary-foreground/80"
            aria-label="Logout"
          >
            <LogOut size={20} strokeWidth={2.5} />
            <span className="font-heading text-[7px] tracking-wider truncate max-w-[80px] text-center">
              LOGOUT
            </span>
          </button>
        </div>
      </nav>

      {/* Desktop: fixed left sidebar (lg and up) */}
      <nav className="hidden lg:flex fixed top-0 left-0 bottom-0 z-50 w-56 flex-col bg-primary border-r-2 border-border">
        <div className="px-5 py-6 border-b-2 border-border">
          <span className="font-display text-lg text-primary-foreground tracking-tight">
            StudySprout
          </span>
          <div className="mt-1 text-2xl">🌱</div>
        </div>

        <div className="flex-1 flex flex-col gap-2 px-3 py-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <SoundLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-primary-foreground/60 hover:text-primary-foreground/80 hover:bg-primary-foreground/10"
                }`}
              >
                <Icon size={20} strokeWidth={2.5} />
                <span className="font-heading text-[9px] tracking-wider truncate">
                  {item.label}
                </span>
              </SoundLink>
            );
          })}
        </div>

        {/* Desktop logout button at the bottom */}
        <div className="px-3 py-5 border-t-2 border-border">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all text-primary-foreground/60 hover:text-primary-foreground/80 hover:bg-primary-foreground/10"
            aria-label="Logout"
          >
            <LogOut size={20} strokeWidth={2.5} />
            <span className="font-heading text-[9px] tracking-wider truncate">
              LOGOUT
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
