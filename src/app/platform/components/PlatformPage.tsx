"use client";

import React, { useState } from "react";
import { ModuleCard } from "./";
import "./platform.css";
import Image from "next/image";

const PlatformPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Calculate total completion
  const totalModules = 14;
  const completedModules = 3;
  const completionPercentage = Math.round(
    (completedModules / totalModules) * 100,
  );

  // Sample module data
  const modules = [
    {
      id: 1,
      title: "Welcome on board!",
      moduleNumber: 1,
      completedItems: 1,
      totalItems: 1,
      isCompleted: true,
    },
    {
      id: 2,
      title: "Introduction to Unit Economics",
      moduleNumber: 2,
      completedItems: 1,
      totalItems: 1,
      isCompleted: true,
    },
    {
      id: 3,
      title: "User Acquisition",
      moduleNumber: 3,
      completedItems: 0,
      totalItems: 8,
      isActive: true,
    },
    {
      id: 4,
      title: "Conversion Rate",
      moduleNumber: 4,
      completedItems: 1,
      totalItems: 1,
      isCompleted: true,
    },
    {
      id: 5,
      title: "Course roadmap",
      moduleNumber: 5,
      completedItems: 0,
      totalItems: 5,
    },
    {
      id: 6,
      title: "Quiz",
      moduleNumber: 6,
      completedItems: 0,
      totalItems: 10,
    },
    {
      id: 7,
      title: "Course roadmap",
      moduleNumber: 7,
      completedItems: 0,
      totalItems: 8,
    },
    {
      id: 8,
      title: "Assignment",
      moduleNumber: 8,
      completedItems: 0,
      totalItems: 3,
    },
    {
      id: 9,
      title: "Course roadmap",
      moduleNumber: 9,
      completedItems: 0,
      totalItems: 5,
    },
    {
      id: 10,
      title: "Quiz",
      moduleNumber: 10,
      completedItems: 0,
      totalItems: 10,
    },
    {
      id: 11,
      title: "Course roadmap",
      moduleNumber: 11,
      completedItems: 0,
      totalItems: 8,
    },
    {
      id: 12,
      title: "Assignment",
      moduleNumber: 12,
      completedItems: 0,
      totalItems: 3,
    },
    {
      id: 13,
      title: "Final Project",
      moduleNumber: 13,
      completedItems: 0,
      totalItems: 1,
    },
    {
      id: 14,
      title: "Certification",
      moduleNumber: 14,
      completedItems: 0,
      totalItems: 1,
    },
  ];

  // Find active module
  const activeModule = modules.find((module) => module.isActive);

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
                <span className="text-xl font-semibold">Startup simulator</span>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="px-6 py-4">
              <p className="mb-4 text-md font-medium text-gray-800 dark:text-white">
                Finished {completedModules}/{totalModules} modules (
                {completionPercentage}%)
              </p>
              <div className="mb-6 h-1 w-full rounded-full bg-gray-200">
                <div
                  className=" h-1 rounded-full"
                ></div>
              </div>
            </div>

            {/* Active Module Section */}
            {activeModule && (
              <div className="px-6">
                <h3 className="mb-4 text-md font-bold">Active Module</h3>
                <div className="active-module rounded-lg border border-gray-200 p-4">
                  <p className="mb-1 font-medium uppercase text-gray-500">
                    MODULE {activeModule.moduleNumber}
                  </p>
                  <h4 className="mb-6 text-xl font-bold">
                    {activeModule.title}
                  </h4>
                  <p className="mb-2 text-gray-600">
                    {activeModule.completedItems} completed (
                    {Math.round(
                      (activeModule.completedItems / activeModule.totalItems) *
                        100,
                    )}
                    %)
                  </p>
                  <div className="mb-2 h-1 w-full rounded-full bg-gray-200">
                    <div
                      className="progress-bar h-1 rounded-full"
                      style={{
                        width: `${(activeModule.completedItems / activeModule.totalItems) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-black">
                    {activeModule.totalItems} items
                  </p>
                </div>
              </div>
            )}
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

            {/* Rocket Icon with hover effect */}
            <div className="collapsed-item mb-8 rounded-md border border-gray-300 p-2">
              <span className="text-xl">🚀</span>
            </div>

            {/* Divider */}
            <div className="my-4 h-px w-12 bg-gray-200"></div>

            {/* Active Module */}
            {activeModule && (
              <div className="mb-4 text-center">
                <p className="font-medium text-gray-500">
                  MODULE {activeModule.moduleNumber}
                </p>
                <p className="text-gray-500">
                  (
                  {Math.round(
                    (activeModule.completedItems / activeModule.totalItems) *
                      100,
                  )}
                  %)
                </p>
              </div>
            )}

            {/* Play Button with hover effect */}
            <div className="collapsed-item rounded-full border border-gray-300 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Takes remaining width */}
      <div className="ml-0 md:ml-[100px] lg:ml-[384px] w-full py-8 px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-8">Course Modules</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              moduleNumber={module.moduleNumber}
              title={module.title}
              completedItems={module.completedItems}
              totalItems={module.totalItems}
              isCompleted={module.isCompleted}
              isActive={module.isActive}
              id={module.id}
            />
          ))}
        </div>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default PlatformPage;
