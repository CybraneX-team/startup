import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, RotateCcw, Rocket, AlertCircle } from "lucide-react";
import image from '../../../illustrationImage.svg';
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useLanguage();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [confirmAnimating, setConfirmAnimating] = useState(false);
  const [confirmShouldRender, setConfirmShouldRender] = useState(false);

  // Handle modal open/close animations
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

  // Handle confirmation modal animations
  useEffect(() => {
    if (showConfirm) {
      setConfirmShouldRender(true);
      setTimeout(() => setConfirmAnimating(true), 10);
    } else {
      setConfirmAnimating(false);
      const timer = setTimeout(() => setConfirmShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [showConfirm]);

  if (!shouldRender) return null;

  const handleConfirmStart = () => {
    onStartNewGame();
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-[3000] flex items-center justify-center px-4 sm:px-0">
        <div 
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
        ></div>
        <div className={`relative w-full max-w-[90%] sm:max-w-md rounded-2xl bg-white dark:bg-[#1F2937] p-4 sm:p-6 shadow-2xl transition-all duration-300 max-h-[90vh] overflow-y-auto ${
            isAnimating 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 translate-y-4'
          }`}>

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
          <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-800 dark:text-white mb-3 sm:mb-4">
            {t("modals.gameOptions.title")}
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
              {t("modals.gameOptions.resetGame")}
            </button>

            <button
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 font-semibold text-white transition hover:bg-violet-700 dark:hover:bg-violet-500"
              onClick={() => setShowConfirm(true)}
            >
              <Rocket size={18} />
              {t("modals.gameOptions.startNewSimulation")}
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-sm px-3 py-2 rounded-md border bg-[#FFF8D6] text-yellow-900 border-yellow-400 text-center dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700">
  <div className="flex items-center gap-1">
    <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-300" />
    <span className="break-words text-sm">{t("modals.gameOptions.costWarning")}</span>
  </div>
  <span className="text-violet-700 dark:text-violet-400 font-semibold"> 2000 {t("modals.gameOptions.ventureCoins")}</span>
          </div>

          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmShouldRender && (
        <div className="fixed inset-0 z-[3001] flex items-center justify-center px-4 sm:px-0">
          <div 
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
              confirmAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setShowConfirm(false)}
          ></div>
          <div className={`w-full max-w-[90%] sm:max-w-sm bg-white dark:bg-[#1F2937] rounded-2xl p-4 sm:p-6 shadow-2xl text-center transition-all duration-300 ${
              confirmAnimating 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 translate-y-4'
            }`}>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              {t("modals.gameOptions.areYouSure")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
              {t("modals.gameOptions.costWarning")} 
              <span className="font-bold text-violet-600 dark:text-violet-400"> 2000 {t("modals.gameOptions.ventureCoins")}</span>
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleConfirmStart}
                className="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 dark:hover:bg-violet-500"
              >
                {t("modals.gameOptions.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameOptionsModal;
