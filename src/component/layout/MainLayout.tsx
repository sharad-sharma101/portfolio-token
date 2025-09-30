import { Outlet } from "react-router-dom";
import Navbar from "../ui/Navbar";

export const MainLayout = () => {
  return (
    <div className="w-screen h-screen" >
      <Navbar />
      <Outlet />
    </div>
  );
};