"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext"; // استيراد هوك السياق
import Sidebar from "./sideBar";

const TopBar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar(); // استخدام السياق هنا

  return (
    <div className="topBar">
      <div className="flex justify-between items-center p-2 bg-gray-800 fixed top-0 left-0 w-full z-50">
        {/* زر فتح السايد بار */}
        <button
          onClick={toggleSidebar} // استخدام التبديل من السياق
          className="p-2 bg-gray-800 text-white rounded-md"
        >
          ☰
        </button>

        {/* توسِيط النص */}
        <div className="flex justify-center items-center flex-1">
          <div className="text-4xl font-bold arvex-gradient-text">
            A R V E X
          </div>
        </div>
      </div>

      {/* تمرير حالة السايد بار الى المكون Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={toggleSidebar} />
    </div>
  );
};

export default TopBar;
