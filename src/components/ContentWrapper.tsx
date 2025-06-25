"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext"; // استيراد هوك السياق
import Footer from "@/components/footer";
type ContentWrapperProps = {
  children: React.ReactNode;
};

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  const { isSidebarOpen } = useSidebar(); // استخدام السياق هنا

  return (
    <div
      className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? "ml-[256px]" : "ml-[60px]"
      }`}
    >
      {children}
      <Footer />
    </div>
  );
};

export default ContentWrapper;
