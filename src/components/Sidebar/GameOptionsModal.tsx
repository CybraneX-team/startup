import React from "react";
import Image from "next/image";
import { X, RotateCcw, Rocket } from "lucide-react"; // Lucide icons
import image from '../../../illustrationImage.svg';

interface GameOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetGame: () => void;
  onStartNewGame: () => void;
}

const GameOptionsModal = ({
  isOpen,
  onClose,
  onResetGame,
  onStartNewGame,
}: GameOptionsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-[90%] max-w-md rounded-2xl bg-white dark:bg-[#1F2937] p-6 shadow-2xl">

        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Illustration */}
        <div className="flex justify-center mb-4">
          <Image
            src={image}
            alt="Game Options Illustration"
            width={160}
            height={160}
            className="object-contain"
          />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-4">
          What would you like to do?
        </h2>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white transition hover:bg-rose-700 dark:hover:bg-rose-500"
            onClick={() => {
              onResetGame();
              onClose();
            }}
          >
            <RotateCcw size={18} />
            Reset Current Game
          </button>
          <button
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 font-semibold text-white transition hover:bg-violet-700 dark:hover:bg-violet-500"
            onClick={() => {
              onStartNewGame();
              onClose();
            }}
          >
            <Rocket size={18} />
            Start New Simulation
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOptionsModal;
