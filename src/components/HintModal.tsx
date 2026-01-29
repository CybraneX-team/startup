// components/HintModal.tsx
"use client";
import React, { useEffect, useState } from "react";

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: string;
}

const HintModal: React.FC<HintModalProps> = ({ isOpen, onClose, title = "AI Hint", content }) => {
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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:px-0">
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>
      <div className={`relative w-full max-w-2xl rounded-2xl bg-white dark:bg-boxdark p-4 sm:p-6 transition-all duration-300 max-h-[90vh] overflow-y-auto ${
          isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}>
        <div className="flex justify-between items-center border-b pb-3 sm:pb-4 mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white truncate pr-2">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white flex-shrink-0">
            ✕
          </button>
        </div>
        <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm whitespace-pre-line">
          {content}
        </div>
      </div>
    </div>
  );
};

export default HintModal;
