"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Header2 from "@/components/Header2";
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
  const isFormQuestionPage = pathname?.startsWith("/formQuestion");
  const isModeSelectPage = pathname?.startsWith("/modeSelect");
  const useHomeNavbar = isAuthPage || isFormQuestionPage || isModeSelectPage;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#050509]">
      {loader && (
        <div className="absolute left-0 top-0 z-9999 h-full w-full bg-black-2 opacity-40" />
      )}

      {/* Top navigation / header */}
      {useHomeNavbar ? (
        <Header2 />
      ) : (
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      {/* Main dashboard area */}
      <main
        className={`flex-1 w-full ${
          isAuthPage ? "flex justify-center items-center px-4" : "px-4 pt-12"
        } ${isModeSelectPage ? "flex flex-col items-center" : ""}`}
      >
        <div
          className={`mx-auto ${
            isAuthPage
              ? "w-full max-w-lg"
              : isFormQuestionPage
              ? "w-full max-w-full pb-10"
              : isModeSelectPage
              ? "w-full max-w-5xl pb-10"
              : "w-full md:max-w-[90%] max-w-[100%] pb-10"
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
