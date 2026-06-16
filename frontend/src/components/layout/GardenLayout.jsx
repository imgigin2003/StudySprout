import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function GardenLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto">
        <Outlet />
      </div>
      <Navbar />
    </div>
  );
}
