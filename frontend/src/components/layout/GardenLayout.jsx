import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function GardenLayout() {
  return (
    /*
     * On mobile the page content sits above the fixed bottom nav (pb-20).
     * `overflow-y-auto` + `min-h-screen` ensures every page can scroll
     * vertically on small screens, so nothing is clipped behind the nav bar.
     */
    <div className="min-h-screen bg-background pb-20 lg:pb-0 lg:pl-56 overflow-y-auto">
      <div className="max-w-lg lg:max-w-4xl mx-auto">
        <Outlet />
      </div>
      <Navbar />
    </div>
  );
}
