// @ts-nocheck
import { useLocation } from "react-router-dom";
import { Lock, UserRound } from "lucide-react";
import SoundLink from "@/components/SoundLink";

const authNavItems = [
  { path: "/login", label: "LOG IN", icon: Lock },
  { path: "/register", label: "REGISTER", icon: UserRound },
];

export default function AuthNavbar() {
  const location = useLocation();

  // Only show this bottom bar on the landing/login/register routes.
  const isAuthRoute =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  if (!isAuthRoute) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-primary border-t-2 border-border">
      <div className="max-w-lg lg:max-w-xs mx-auto h-16 flex items-center justify-center px-4">
        <div className="w-full grid grid-cols-2 gap-2 lg:gap-4">
          {authNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <SoundLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-md transition-all ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-primary-foreground/60 hover:text-primary-foreground/80"
                }`}
              >
                <Icon size={20} strokeWidth={2.5} />
                <span className="font-heading text-[7px] tracking-wider leading-none">
                  {item.label}
                </span>
              </SoundLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
