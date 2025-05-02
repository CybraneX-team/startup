"use client"
import React from "react";

interface MarketInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MarketInfoModal = ({ isOpen, onClose }: MarketInfoModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] mx-8 my-4 lg:my-0 lg:mx-0 flex items-center justify-center">
      {/* Full-screen overlay */}
      <div
        className="absolute inset-0 bg-black/30 dark:bg-black/50"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-lg dark:bg-[#1A232F] dark:text-white">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Header section */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-medium text-gray-700 dark:text-white">
              Total market value
            </h2>
            <p className="text-xl font-medium text-green-500">$10 000 000 000</p>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Here you can see the overall climate of the market, as well as your share.
          </p>
        </div>

        {/* Table headers */}
        <div className="mb-2 grid grid-cols-3 gap-6">
          <h3 className="text-base font-medium text-gray-600 dark:text-gray-300">Social Status</h3>
          <h3 className="text-base font-medium text-gray-600 dark:text-gray-300">Clients</h3>
          <h3 className="text-base font-medium text-gray-600 dark:text-gray-300">Capital</h3>
        </div>

        {/* Data rows */}
        {[
          ["Working class", "20 000 000", "$200 000 000"],
          ["Middle Class", "70 000 000", "$6 500 000 000"],
          ["Wealthy", "10 000 000", "$3 300 000 000"],
          ["Available", "100 000 000", "$9 999 999 950.5"],
        ].map(([label, clients, capital], i) => (
          <div
            key={i}
            className="mb-2 grid grid-cols-3 gap-6 rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
          >
            <p className="text-sm text-gray-700 dark:text-gray-100">{label}</p>
            <p className="text-sm text-blue-500">{clients}</p>
            <p className="text-sm text-green-500">{capital}</p>
          </div>
        ))}

        {/* Divider */}
        <div className="mb-4 h-px w-full bg-gray-200 dark:bg-gray-700"></div>

        {/* Ownership headers */}
        <div className="mb-2 grid grid-cols-2 gap-6">
          <h3 className="text-base font-medium text-gray-600 dark:text-gray-300">Yours</h3>
          <h3 className="text-base font-medium text-gray-600 dark:text-gray-300">Competitors</h3>
        </div>

        {/* Market share comparison */}
        <div className="grid grid-cols-2 gap-6 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-100">Market Share</p>
            <p className="text-sm text-blue-500">0%</p>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-red-500">0%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketInfoModal;
