"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Typewriter } from "react-simple-typewriter";

interface ElonAssistantProps {
  onStepChange?: (step: number) => void;
}

interface Step {
  text: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  mobilePosition?: { top?: string; bottom?: string; left?: string; right?: string };
  tabletPosition?: { top?: string; bottom?: string; left?: string; right?: string };
}

const tutorialSteps: Step[] = [
  {
    text: "Hi there! I'm Elon. Let's build your startup together! 🚀",
    position: { bottom: "8rem", left: "6rem" },
    tabletPosition: { bottom: "9rem", left: "3rem" },
    mobilePosition: { bottom: "10rem", left: "1.25rem" },
  },
  {
    text: "This is your startup stage. Keep an eye on your growth goals!",
    position: { top: "5.4rem", left: "1rem" },
    tabletPosition: { top: "6rem", left: "2rem" },
    mobilePosition: { top: "18rem", left: "1.25rem" },
  },
  {
    text: "These are your key metrics — track them to make smart decisions.",
    position: { top: "9rem", left: "1.25rem" },
    tabletPosition: { top: "10rem", left: "2rem" },
    mobilePosition: { top: "4.75rem", left: "1.25rem" },
  },
  {
    text: "These dots are for Investors & Mentors. Click to learn more!",
    position: { top: "7.5rem", left: "3.125rem" },
    tabletPosition: { top: "8rem", left: "3rem" },
    mobilePosition: { top: "6.25rem", left: "1.25rem" },
  },
  {
    text: "Use these tasks to boost your metrics and fix problems.",
    position: { top: "52%", left: "2rem" },
    tabletPosition: { top: "50%", left: "2rem" },
    mobilePosition: { top: "45%", left: "1.25rem" },
  },
  {
    text: "Fix bugs fast with the Manage Bug feature",
    position: { bottom: "7rem", left: "50.25rem" },
    tabletPosition: { bottom: "6rem", left: "30rem" },
    mobilePosition: { bottom: "17.625rem", left: "1.25rem" },
  },
  {
    text: "Don't forget to use your credits to gain special advantages!",
    position: { top: "0.85rem", right: "29rem" },
    tabletPosition: { top: "2rem", right: "15rem" },
    mobilePosition: { top: "8.25rem", left: "0.25rem" },
  },
  {
    text: "Hit 'Make Turn' to progress in the simulation. 🚀",
    position: { bottom: "7.5rem", right: "5.25rem" },
    tabletPosition: { bottom: "6rem", right: "3rem" },
    mobilePosition: { bottom: "6.25rem", left: "1.25rem" },
  },
  {
    text: "You can ask me anything using the 'AI Advisor' button!",
    position: { top: "14.5rem", right: "15.5rem" },
    tabletPosition: { top: "16rem", right: "10rem" },
    mobilePosition: { top: "21.5rem", left: "1.25rem" },
  },
];

const ElonAssistant = ({ onStepChange }: ElonAssistantProps) => {
  const [step, setStep] = useState(0);
  const [textKey, setTextKey] = useState(0);
  const [visible, setVisible] = useState(true);
  const [waitingForClick, setWaitingForClick] = useState(true);
  const hasSkippedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = tutorialSteps[step];

  const playAudio = (stepIndex: number) => {
    if (hasSkippedRef.current) return;
    const audioPath = `/audio/dilouge${stepIndex}.mp3`;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(audioPath);
    audioRef.current = audio;

    audio.play().catch((err) => {
      if (err.name !== "AbortError") console.error("Audio playback error:", err);
    });
  };

  const handleUserClick = () => {
    if (!waitingForClick) return;
    setWaitingForClick(false);
    playAudio(step + 1);
  };

  useEffect(() => {
    onStepChange?.(step);

    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      let scrollOffset: string | undefined;
      if (width < 768 && tutorialSteps[step].mobilePosition) {
        scrollOffset = tutorialSteps[step].mobilePosition.top || tutorialSteps[step].mobilePosition.bottom;
      } else if (width >= 768 && width <= 1024 && tutorialSteps[step].tabletPosition) {
        scrollOffset = tutorialSteps[step].tabletPosition.top || tutorialSteps[step].tabletPosition.bottom;
      }

      if (scrollOffset) {
        let y = 0;
        if (scrollOffset.endsWith("rem")) {
          const remValue = parseFloat(scrollOffset);
          y = remValue * 16 - 40;
        } else if (scrollOffset.endsWith("%")) {
          const percent = parseFloat(scrollOffset) / 100;
          y = window.innerHeight * percent - 40;
        }

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [step]);

  useEffect(() => {
    if (waitingForClick || hasSkippedRef.current) return;

    playAudio(step + 1);

    if (step === tutorialSteps.length - 1) {
      const timer = setTimeout(() => {
        setVisible(false);
        audioRef.current?.pause();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [step, waitingForClick, onStepChange]);

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
      setStep((prev) => prev + 1);
      setTextKey((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
      setTextKey((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    hasSkippedRef.current = true;
    audioRef.current?.pause();
    setVisible(false);
    setStep(0);
  };

  if (!visible) return null;

  const getCurrentStyle = () => {
    if (typeof window === "undefined") return current.position;

    const width = window.innerWidth;
    if (width < 768 && current.mobilePosition) return current.mobilePosition;
    if (width >= 768 && width <= 1024 && current.tabletPosition) return current.tabletPosition;
    return current.position;
  };

  const style = getCurrentStyle();

  return (
    <>
      {waitingForClick ? (
        <div
          className="fixed inset-0 z-999999 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white text-center px-4"
          onClick={handleUserClick}
        >
          <div className="bg-black/80 px-6 py-4 rounded-xl text-sm font-medium shadow-lg">
            👋 Click anywhere to start Elon’s voice guide
          </div>
        </div>
      ) : (
        <div
          className="fixed z-[9999] transition-all duration-300 ease-in-out flex items-start gap-3 w-[80%] sm:w-auto max-w-xs sm:max-w-xs"
          style={style}
        >
          <div className="flex-shrink-0">
            <Image src={`elon.png`} alt="Elon Musk" width={64} height={64} className="rounded-full shadow-md" />
          </div>

          <div
            className={`rounded-2xl px-4 py-3 relative animate-fadeIn border border-gray-200 dark:border-gray-700 shadow-xl
              bg-white dark:bg-[#1E293B] backdrop-blur-sm bg-opacity-95 dark:bg-opacity-80
              text-sm font-medium text-black dark:text-white`}
          >
            <p className="leading-relaxed min-h-[50px]">
              <Typewriter
                key={textKey}
                words={[current.text]}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={20}
                deleteSpeed={0}
                delaySpeed={300}
              />
            </p>

            <div className="flex justify-between items-center mt-3 text-xs space-x-3">
              <button onClick={handleSkip} className="text-gray-500 dark:text-gray-400 hover:underline">
                ✕ Skip
              </button>
              {step > 0 && (
                <button onClick={handleBack} className="text-blue-500 dark:text-blue-400 hover:underline">
                  ← Back
                </button>
              )}
              {step < tutorialSteps.length - 1 && (
                <button onClick={handleNext} className="text-yellow-500 hover:underline">
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ElonAssistant;
