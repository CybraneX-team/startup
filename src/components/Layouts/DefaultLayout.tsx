"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { loader, user } = useUser();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  const sidebarWidth =
    !isAuthPage && user?.isAiCustomizationDone
      ? sidebarCollapsed
        ? 80
        : 300
      : 0;

  const layoutStyle = {
    "--sidebar-width": `${sidebarWidth}px`,
  } as React.CSSProperties;

  return (
    <div className="flex min-h-screen w-full flex-col" style={layoutStyle}>
      {loader && (
        <div className="absolute left-0 top-0 z-9999 h-full w-full bg-black-2 opacity-40"></div>
      )}

      {!isAuthPage && user?.isAiCustomizationDone && (
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
      )}

      <div className="relative flex flex-1 flex-col transition-all duration-300 lg:ml-[var(--sidebar-width)]">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className={`w-full px-4 pt-16 md:pt-20 ${isAuthPage ? 'flex justify-center' : ''}`}>
          <div className={`mx-auto ${isAuthPage ? 'w-full max-w-lg pt-10' : 'max-w-screen-2xl p-4 md:p-6 2xl:p-10'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
