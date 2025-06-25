"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

// تعريف النوع الخاص بالحالة
interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// إنشاء السياق مع قيم افتراضية
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// مكون لتوفير السياق للمكونات الأخرى
export const SidebarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // تحميل القيمة من localStorage عند أول تشغيل
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("sidebar-open");
      if (storedValue !== null) {
        setIsSidebarOpen(storedValue === "true");
      }
    }
  }, []);

  // تحديث localStorage عند تغيير الحالة
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-open", String(isSidebarOpen));
    }
  }, [isSidebarOpen]);

  // التبديل بين حالة السايد بار
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// هوك للوصول إلى السياق
export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
