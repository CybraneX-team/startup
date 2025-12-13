"use client";

import React, { useEffect, useState } from "react";
import { X, Rocket, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translateTaskName } from "@/utils/taskTranslator";

interface StageUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousStage: string;
  currentStage: string;
  nextGoal: string;
}

const StageUpgradeModal: React.FC<StageUpgradeModalProps> = ({
  isOpen,
  onClose,
  previousStage,
  currentStage,
  nextGoal,
}) => {
  const { t, language } = useLanguage();
  const [translatedGoal, setTranslatedGoal] = useState(nextGoal);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!isOpen || !nextGoal) {
      setTranslatedGoal(nextGoal);
      return;
    }

    const translateGoal = async () => {
      if (language === 'en') {
        setTranslatedGoal(nextGoal);
        return;
      }

      setIsTranslating(true);
      try {
        const translated = await translateTaskName(nextGoal, language);
        setTranslatedGoal(translated);
      } catch (error) {
        console.error("Error translating goal:", error);
        setTranslatedGoal(nextGoal);
      } finally {
        setIsTranslating(false);
      }
    };

    translateGoal();
  }, [isOpen, nextGoal, language]);

  if (!isOpen) return null;

  // Format stage name for display
  const formatStageName = (stage: string): string => {
    const stageMap: Record<string, string> = {
      'FFF': 'FFF',
      'Angels': 'Angels',
      'pre_seed': 'preSeed',
      'Seed': 'Seed',
      'a': 'A',
      'b': 'B',
      'c': 'C',
      'd': 'D',
      'preIpo': 'pre-IPO',
      'IPO': 'IPO',
    };
    return stageMap[stage] || stage;
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-[#1A232F] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 z-10"
          aria-label={t("common.close")}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Illustration/Brain Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              {/* Brain/Sparkle Icon */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/30 to-orange-500/30"></div>
                <div className="relative z-10">
                  <div className="text-4xl">🧠</div>
                </div>
                {/* Sparkles around */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute -top-1 -right-3 w-3 h-3 bg-orange-400 rounded-full animate-pulse delay-75"></div>
                <div className="absolute -bottom-2 -left-1 w-3 h-3 bg-yellow-300 rounded-full animate-pulse delay-150"></div>
                <div className="absolute -bottom-1 -right-2 w-4 h-4 bg-orange-300 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>

          {/* Congratulations Text */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t("modals.stageUpgrade.congratulations") || "Congratulations!"}
          </h2>

          {/* Stage Transition */}
          <div className="mb-6">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-3">
              {t("modals.stageUpgrade.madeItTo") || "You've made it to"} <span className="font-semibold text-gray-900 dark:text-white">{formatStageName(currentStage)}</span> {t("modals.stageUpgrade.round") || "round"}
            </p>
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                {formatStageName(previousStage)}
              </span>
              <ArrowRight className="h-4 w-4 text-gray-500" />
              <span className="px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold">
                {formatStageName(currentStage)}
              </span>
            </div>
          </div>

          {/* Next Goal */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {t("modals.stageUpgrade.yourNextGoal") || "Your next goal"}
            </p>
            {isTranslating ? (
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  {t("common.loading")}
                </div>
              </div>
            ) : (
              <p className="text-base font-semibold text-gray-900 dark:text-white px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                {translatedGoal}
              </p>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={onClose}
            className="w-full py-4 px-6 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl"
          >
            <span>{t("modals.stageUpgrade.letsGrow") || "Let's Grow!"}</span>
            <Rocket className="h-5 w-5 group-hover:translate-y-[-2px] transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StageUpgradeModal;

