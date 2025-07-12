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
        <div className="z-99999">
        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
        </div>

        <Providers>
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
        </Providers>
      </div>
      <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="beforeInteractive"
          />
    </div>
  );
}

import { Providers } from "./providers";import Script from "next/script";
import { Bounce, ToastContainer } from "react-toastify";

