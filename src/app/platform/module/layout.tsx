"use client";

import React, { ReactNode, useState } from 'react';
import '../components/platform.css';
import Image from 'next/image';

interface ModuleLayoutProps {
  children: ReactNode;
}

export default function ModuleLayout({ children }: ModuleLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-boxdark-2">
      {/* Sidebar - Fixed position */}
      <div
        className={`sidebar fixed left-0 top-0 z-50 h-screen transition-all duration-300 ${
          sidebarOpen
            ? "expanded w-full max-w-sm bg-white shadow-lg dark:bg-boxdark"
            : "collapsed w-[100px] bg-white dark:bg-boxdark"
        }`}
      >
        {sidebarOpen ? (
          // Expanded Sidebar Content
          <>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                🎓 Educational platform
                </h3>
              </div>
              <div className="flex items-center">
                <button className="mr-4 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
                <button onClick={toggleSidebar} className="text-gray-500">
                  <Image
                    src="https://platform.teachmegrow.com/static/media/closeMenu.2188aba65727607a5657a5d58977f657.svg"
                    alt="menu"
                  />
                </button>
              </div>
            </div>

            {/* Course Title with fancy hover effect */}
            <div className="course-title mx-6 my-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <span className="mr-2">🚀</span>
                <span className="text-xl font-semibold">Unicorn simulator</span>
              </div>
            </div>

            {/* Navigation links */}
            <div className="px-6 py-4">
              <ul className="space-y-2">
                <li>
                  <a 
                    href="/platform" 
                    className="flex items-center rounded-md bg-gray-100 px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="mr-3 h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 6h16M4 12h16M4 18h16" 
                      />
                    </svg>
                    All Modules
                  </a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          // Collapsed Sidebar Content
          <div className="flex h-full flex-col items-center py-6">
            {/* Education Icon with Arrow */}
            <div className="collapsed-header mb-8 flex w-[80px] items-center justify-between rounded-full bg-gray-100 px-4 py-2">
              <h2 className="mr-2 text-xl">🎓</h2>
              <button onClick={toggleSidebar} className="text-gray-700">
                <Image
                  style={{ transform: 'rotate(180deg)' }}
                  src="https://platform.teachmegrow.com/static/media/closeMenu.2188aba65727607a5657a5d58977f657.svg"
                  alt="menu"
                />
              </button>
            </div>

            {/* Divider */}
            <div className="my-4 h-px w-12 bg-gray-200"></div>

            {/* Navigation Icon */}
            <a href="/platform" className="collapsed-nav-item mb-4 p-3 rounded-full hover:bg-gray-100">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Main Content */}
      {children}
    </div>
  );
} 