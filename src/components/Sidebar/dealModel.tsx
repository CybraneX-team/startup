"use client";
import React from "react";

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorName: string;
  conditions: string;
  benefits: any[];
  limitations: any[];
  onSign: () => void;
}

const DealModal: React.FC<DealModalProps> = ({
  isOpen,
  onClose,
  mentorName,
  conditions,
  benefits,
  limitations,
  onSign,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 dark:bg-black/50"
        onClick={onClose}
      ></div>
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1A232F] dark:text-white">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 dark:text-white">
          Make a deal with {mentorName}?
        </h2>

        <div className="mb-4">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            <span>Conditions (required stake)</span>
            <span className="text-blue-500">{conditions}</span>
          </div>
          <div className="border-b border-gray-200 mb-3 dark:border-gray-600" />

          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Benefits
            </h4>
            <ul className="list-none space-y-1">
              {benefits.map((b, i) => (
                <li key={i} className="flex gap-2 text-sm text-blue-500">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-500 flex-none" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Limitations
            </h4>
            <ul className="list-none space-y-1">
              {limitations.map((l, i) => (
                <li key={i} className="flex gap-2 text-sm text-blue-500">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-500 flex-none" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={onSign}
            className="flex-1 rounded-lg bg-green-400 py-2 text-white font-semibold hover:bg-green-500 transition"
          >
            Yes, sign it
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 py-2 text-gray-700 font-medium hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealModal;
