"use client";

import { useState } from "react";

import ScrollToTop from "../utils/ScrollToTop/ScrollToTop";
import Header from "../components/GobalComponents/Header/Header";
import Sidebar from "../components/GobalComponents/Sidebar/Sidebar";

function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 text-black">
      <ScrollToTop />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
