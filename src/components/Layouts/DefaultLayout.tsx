"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loader } = useUser();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#050509]">
      {loader && (
        <div className="absolute left-0 top-0 z-9999 h-full w-full bg-black-2 opacity-40" />
      )}

      {/* Top navigation / header */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main dashboard area */}
      <main
        className={`flex-1 w-full px-4 pt-16 md:pt-20 ${
          isAuthPage ? "flex justify-center" : ""
        }`}
      >
        <div
          className={`mx-auto ${
            isAuthPage
              ? "w-full max-w-lg pt-10"
              : "w-full max-w-[90%] pb-10"
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
