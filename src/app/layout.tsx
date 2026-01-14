"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import "./globals.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { UserProvider } from "@/context/UserContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { SoundProvider } from "@/context/SoundContext";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from 'next/head';
import { TourProvider } from '@reactour/tour'
import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import AuthSyncHandler from "@/components/AuthSyncHandler";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <head>
        {/* Suppress 404 errors for non-existent CSS files */}
        <meta name="next-head-count" content="0" />
      </head>
      <body suppressHydrationWarning={true} className="custom-scrollbar">
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <LanguageProvider>
            <UserProvider>
              <SoundProvider>
                <NotificationProvider>
                  <SessionProvider>
                    <AuthSyncHandler />
                    {loading ? <Loader /> : children}
                    <ToastContainer
                      position="top-right"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="light"
                      transition={Bounce}
                      style={{ zIndex: 999999 }}
                      toastClassName="toast-high-z-index"
                    />
                </SessionProvider>
              </NotificationProvider>
            </SoundProvider>
          </UserProvider>
        </LanguageProvider>
      </div>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
