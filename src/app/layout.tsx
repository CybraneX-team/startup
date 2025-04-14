"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import "./globals.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { UserProvider } from "@/context/UserContext";
import { Bounce, ToastContainer } from "react-toastify";
import Head from 'next/head';

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
          <UserProvider>
          {loading ? <Loader /> : children}
          </UserProvider>
        </div>
      </body>
    </html>
  );
}
