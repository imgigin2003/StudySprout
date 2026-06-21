import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function GardenLayout() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0 lg:pl-56">
      <div className="max-w-lg lg:max-w-4xl mx-auto">
        <Outlet />
      </div>
      <Navbar />
    </div>
  );
}
