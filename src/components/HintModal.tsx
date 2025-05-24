// components/HintModal.tsx
"use client";
import React from "react";

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: string;
}

const HintModal: React.FC<HintModalProps> = ({ isOpen, onClose, title = "AI Hint", content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-boxdark p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
            ✕
          </button>
        </div>
        <div className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
          {content}
        </div>
      </div>
    </div>
  );
};

export default HintModal;
