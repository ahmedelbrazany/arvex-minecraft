'use client';

import { SessionProvider } from "next-auth/react";
import { AlertProvider } from "@/context/AlertContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { WebSocketProvider } from "@/context/WebSocketContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AlertProvider>
        <SidebarProvider>
          <WebSocketProvider>
            {children}
          </WebSocketProvider>
        </SidebarProvider>
      </AlertProvider>
    </SessionProvider>
  );
} 