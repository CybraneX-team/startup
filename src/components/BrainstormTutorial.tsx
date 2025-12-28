"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface BrainstormTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  brainstormButtonRef: React.RefObject<HTMLButtonElement>;
}

const BrainstormTutorial: React.FC<BrainstormTutorialProps> = ({
  isOpen,
  onClose,
  brainstormButtonRef,
}) => {
  const { t } = useLanguage();
  const [buttonPosition, setButtonPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!isOpen || !brainstormButtonRef.current) return;

    const updatePosition = () => {
      const button = brainstormButtonRef.current;
      if (button) {
        const rect = button.getBoundingClientRect();
        setButtonPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    // Update position periodically to handle dynamic changes
    const interval = setInterval(updatePosition, 100);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      clearInterval(interval);
    };
  }, [isOpen, brainstormButtonRef]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99998]" style={{ pointerEvents: 'none' }}>
      {/* Dark overlay - but don't block button area */}
      {buttonPosition ? (
        <>
          {/* Top section */}
          <div 
            className="absolute bg-black/70 backdrop-blur-sm" 
            onClick={onClose}
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: `${buttonPosition.top}px`,
              pointerEvents: 'auto',
            }}
          />
          {/* Left section */}
          <div 
            className="absolute bg-black/70 backdrop-blur-sm" 
            onClick={onClose}
            style={{
              top: `${buttonPosition.top}px`,
              left: 0,
              width: `${buttonPosition.left}px`,
              height: `${buttonPosition.height}px`,
              pointerEvents: 'auto',
            }}
          />
          {/* Right section */}
          <div 
            className="absolute bg-black/70 backdrop-blur-sm" 
            onClick={onClose}
            style={{
              top: `${buttonPosition.top}px`,
              left: `${buttonPosition.left + buttonPosition.width}px`,
              right: 0,
              height: `${buttonPosition.height}px`,
              pointerEvents: 'auto',
            }}
          />
          {/* Bottom section */}
          <div 
            className="absolute bg-black/70 backdrop-blur-sm" 
            onClick={onClose}
            style={{
              top: `${buttonPosition.top + buttonPosition.height}px`,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'auto',
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      )}
      
      {/* Spotlight effect on brainstorm button */}
      {buttonPosition && (
        <div
          className="absolute rounded-lg border-2 border-gray-300 dark:border-gray-500 bg-white/10 dark:bg-white/5 pointer-events-none"
          style={{
            top: `${buttonPosition.top}px`,
            left: `${buttonPosition.left}px`,
            width: `${buttonPosition.width}px`,
            height: `${buttonPosition.height}px`,
            boxShadow: `0 0 20px rgba(255, 255, 255, 0.3)`,
          }}
        />
      )}

      {/* Tutorial Modal */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md mx-4 pointer-events-auto">
        <div className="bg-white dark:bg-[#1A232F] rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("tutorial.brainstorm.title") || "No Tasks Available"}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
              aria-label={t("common.close")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {t("tutorial.brainstorm.description") || "You've completed all available tasks. To continue progressing, you need to generate new tasks."}
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {t("tutorial.brainstorm.step1Title") || "Click the Brainstorm button"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t("tutorial.brainstorm.step1Description") || "The Brainstorm button is located in the task filters section. Click it to start a brainstorming session."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {t("tutorial.brainstorm.step2Title") || "Review the brainstorming session"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t("tutorial.brainstorm.step2Description") || "A modal will appear showing how many turns are required and how many new tasks will be generated."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {t("tutorial.brainstorm.step3Title") || "Confirm to generate tasks"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t("tutorial.brainstorm.step3Description") || "Click 'Start Brainstorming' to generate new tasks. These tasks will appear in your task list and you can select them for your next turn."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 pt-0">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              <span>{t("tutorial.brainstorm.gotIt") || "Got it"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainstormTutorial;

