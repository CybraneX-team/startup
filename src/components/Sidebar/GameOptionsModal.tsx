import React, { useState } from "react";
import Image from "next/image";
import { X, RotateCcw, Rocket, AlertCircle } from "lucide-react";
import image from '../../../illustrationImage.svg';
import { useUser } from "@/context/UserContext";

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
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleConfirmStart = () => {
    onStartNewGame();
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      {/* Main Modal */}
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

          {/* Buttons */}
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
              onClick={() => setShowConfirm(true)}
            >
              <Rocket size={18} />
              Start New Simulation
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-sm px-3 py-2 rounded-md border bg-[#FFF8D6] text-yellow-900 border-yellow-400 text-center dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700">
  <div className="flex items-center gap-1">
    <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-300" />
    <span className="break-words text-sm">Starting a new simulation will cost</span>
  </div>
  <span className="text-violet-700 dark:text-violet-400 font-semibold">2000 Venture coins</span>
          </div>

          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-[90%] max-w-sm bg-white dark:bg-[#1F2937] rounded-2xl p-6 shadow-2xl text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
              Starting a new simulation will cost 
              <span className="font-bold text-violet-600 dark:text-violet-400">200 venture coins</span>
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStart}
                className="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 dark:hover:bg-violet-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameOptionsModal;
