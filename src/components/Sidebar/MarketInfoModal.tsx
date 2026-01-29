"use client"
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface MarketInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MarketInfoModal = ({ isOpen, onClose }: MarketInfoModalProps) => {
  const { t } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[99999] px-4 sm:mx-8 my-4 lg:my-0 lg:mx-0 flex items-center justify-center">
      {/* Full-screen overlay */}
      <div
        className={`absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      <div className={`relative w-full max-w-lg rounded-xl bg-white p-6 shadow-lg dark:bg-[#1A232F] dark:text-white transition-all duration-300 ${
          isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}>
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
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <h2 className="text-lg sm:text-xl font-medium text-gray-700 dark:text-white">
              {t("modals.marketInfo.title")}
            </h2>
            <p className="text-base sm:text-xl font-medium text-green-500">$10 000 000 000</p>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {t("modals.marketInfo.description")}
          </p>
        </div>

        {/* Table headers */}
        <div className="mb-2 grid grid-cols-3 gap-2 sm:gap-6">
          <h3 className="text-xs sm:text-base font-medium text-gray-600 dark:text-gray-300">{t("modals.marketInfo.socialStatus")}</h3>
          <h3 className="text-xs sm:text-base font-medium text-gray-600 dark:text-gray-300">{t("modals.marketInfo.clients")}</h3>
          <h3 className="text-xs sm:text-base font-medium text-gray-600 dark:text-gray-300">{t("modals.marketInfo.capital")}</h3>
        </div>

        {/* Data rows */}
        {[
          [t("modals.marketInfo.workingClass"), "20 000 000", "$200 000 000"],
          [t("modals.marketInfo.middleClass"), "70 000 000", "$6 500 000 000"],
          [t("modals.marketInfo.wealthy"), "10 000 000", "$3 300 000 000"],
          [t("modals.marketInfo.available"), "100 000 000", "$9 999 999 950.5"],
        ].map(([label, clients, capital], i) => (
          <div
            key={i}
            className="mb-2 grid grid-cols-3 gap-2 sm:gap-6 rounded-lg bg-gray-50 p-2 sm:p-3 dark:bg-gray-800"
          >
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-100">{label}</p>
            <p className="text-sm text-blue-500">{clients}</p>
            <p className="text-sm text-green-500">{capital}</p>
          </div>
        ))}

        {/* Divider */}
        <div className="mb-4 h-px w-full bg-gray-200 dark:bg-gray-700"></div>

        {/* Ownership headers */}
        <div className="mb-2 grid grid-cols-2 gap-6">
          <h3 className="text-base font-medium text-gray-600 dark:text-gray-300">{t("modals.marketInfo.yours")}</h3>
          <h3 className="text-base font-medium text-gray-600 dark:text-gray-300">{t("modals.marketInfo.competitors")}</h3>
        </div>

        {/* Market share comparison */}
        <div className="grid grid-cols-2 gap-6 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-100">{t("modals.marketInfo.marketShare")}</p>
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
