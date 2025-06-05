/** @format */
"use client";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="drawer lg:drawer-open">
        <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col">
          <Navbar />
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>

        <div className="drawer-side">
          <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
