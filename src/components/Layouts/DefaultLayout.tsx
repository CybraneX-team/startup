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
  const { loader, user } = useUser();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <div className="flex min-h-screen w-full flex-col">
      {loader && (
        <div className="absolute left-0 top-0 z-9999 h-full w-full bg-black-2 opacity-40"></div>
      )}

      {!isAuthPage && user?.isAiCustomizationDone  &&(
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      <div className={`relative flex flex-1 flex-col ${!isAuthPage && user?.isAiCustomizationDone ? 'lg:ml-72.5' : ''}`}>
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className={`w-full px-4 ${isAuthPage ? 'flex justify-center' : ''}`}>
          <div className={`mx-auto ${isAuthPage ? 'w-full max-w-lg pt-10' : 'max-w-screen-2xl p-4 md:p-6 2xl:p-10'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
