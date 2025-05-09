"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header2";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "react-modal-video/css/modal-video.css";
import "@/styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <div
        // suppressHydrationWarning={true}
        className={`flex w-screen flex-col bg-[#FCFCFC]  dark:bg-black ${inter.className}`}
      >
        <Providers>
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
        </Providers>
      </div>
    </div>
  );
}

import { Providers } from "./providers";
