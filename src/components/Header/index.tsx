"use client";

import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownUser from "./DropdownUser";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import GameSwitchMenu from "./GameSwitchMenu";
import LanguageSwitcher from "../LanguageSwitcher";
import { Coins, Trophy, Bell, Crown, Settings, ChevronLeft, InfoIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import LeaderboardModal from "../LeaderboardModal";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import useColorMode from "@/hooks/useColorMode";
import { useSound } from "@/context/SoundContext";
import { motion } from "framer-motion";
import Image from "next/image";
import TypewriterText from "@/components/TypewriterText/TypewriterText";
import { translateTaskName } from "@/utils/taskTranslator";

const Header = (props: {
  sidebarOpen: string | boolean | undefined | any;
  setSidebarOpen: (arg0: boolean) => void | any;
}) => {
  useColorMode();

  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { HeaderDark, user, elonStep, notificationMessages, setUser, setUserState } = useUser();
  const { t, language } = useLanguage();
  const { playSound } = useSound();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const { openNotificationModal } = useNotification();
  const unreadCount = notificationMessages?.length || 0;

  // Chat modal states
  const [isTyping, setIsTyping] = useState(false);
  const [translatedGreeting, setTranslatedGreeting] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: 'elon', text: "" }
  ]);
  const [userInput, setUserInput] = useState("");

  // Translate greeting message when language changes
  useEffect(() => {
    const translateGreeting = async () => {
      const greetingText = t("modals.aiAdvisor.greeting");
      if (language === 'en') {
        setTranslatedGreeting(greetingText);
        setChatMessages(prev => {
          // Only update if chat is empty or has only empty greeting, or if first message is from elon
          if (prev.length === 0 || (prev.length === 1 && prev[0].sender === 'elon' && prev[0].text === "")) {
            return [{ sender: 'elon', text: greetingText }];
          } else if (prev.length === 1 && prev[0].sender === 'elon') {
            // Update the first message if it's the greeting
            return [{ sender: 'elon', text: greetingText }];
          }
          return prev;
        });
        return;
      }

      try {
        const translated = await translateTaskName(greetingText, language as any);
        setTranslatedGreeting(translated);
        setChatMessages(prev => {
          // Only update if chat is empty or has only empty greeting, or if first message is from elon
          if (prev.length === 0 || (prev.length === 1 && prev[0].sender === 'elon' && prev[0].text === "")) {
            return [{ sender: 'elon', text: translated }];
          } else if (prev.length === 1 && prev[0].sender === 'elon') {
            // Update the first message if it's the greeting
            return [{ sender: 'elon', text: translated }];
          }
          return prev;
        });
      } catch (error) {
        console.warn('Failed to translate greeting:', error);
        setTranslatedGreeting(greetingText);
        setChatMessages(prev => {
          if (prev.length === 0 || (prev.length === 1 && prev[0].sender === 'elon' && prev[0].text === "")) {
            return [{ sender: 'elon', text: greetingText }];
          } else if (prev.length === 1 && prev[0].sender === 'elon') {
            return [{ sender: 'elon', text: greetingText }];
          }
          return prev;
        });
      }
    };

    translateGreeting();
  }, [language, t]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] w-full bg-transparent backdrop-blur-md shadow-sm transition-all duration-300`}
      >
        <div className="flex flex-nowrap items-center justify-between px-3 py-2 md:px-6 md:py-3 gap-2">
          {/* Left: Back Button & Hamburger */}
          <div className="flex items-center gap-2 shrink-0">
            {/* <button
              onClick={() => router.back()}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-gray-700 dark:text-gray-300 shadow-sm"
              title="Go Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              aria-controls="sidebar"
              onClick={e => {
                e.stopPropagation();
                props.setSidebarOpen(!props.sidebarOpen);
              }}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors lg:hidden"
            >
              <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 mb-1.5 transition-all"></span>
              <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 mb-1.5 transition-all"></span>
              <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all"></span>
            </button> */}

            {/* 3. NOTIFICATIONS */}
            <button
              onClick={() => {
                playSound("notification");
                openNotificationModal();
              }}
              className="flex ml-20 items-center justify-center px-6 py-2 rounded-full bg-[#1B1B1D] hover:bg-[#353535] transition-colors text-white font-normal text-md"
              title={t("modals.notifications.title")}
            >
              <span className="mr-2 flex items-center justify-center">
                <svg width="25" height="15" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.86279 4.97852H14.1961" stroke="url(#paint0_linear_6644_433)" strokeLinecap="round"/>
                  <path d="M4.86279 7.80005H10.6961" stroke="url(#paint1_linear_6644_433)" strokeLinecap="round"/>
                  <rect x="0.1" y="0.1" width="21.1049" height="14.8242" rx="3.9" fill="url(#paint2_linear_6644_433)" fillOpacity="0.12" stroke="url(#paint3_linear_6644_433)" strokeWidth="0.2"/>
                  <defs>
                    <linearGradient id="paint0_linear_6644_433" x1="13.7578" y1="5.07466" x2="13.5979" y2="6.4965" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#8DD5FF"/>
                      <stop offset="1" stopColor="#5CFFDE"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_6644_433" x1="10.4222" y1="7.8962" x2="10.1713" y2="9.29088" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#8DD5FF"/>
                      <stop offset="1" stopColor="#5CFFDE"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_6644_433" x1="20.3044" y1="1.44453" x2="9.96108" y2="15.423" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#8DD5FF"/>
                      <stop offset="1" stopColor="#5CFFDE"/>
                    </linearGradient>
                    <linearGradient id="paint3_linear_6644_433" x1="20.3044" y1="1.44453" x2="9.96108" y2="15.423" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#8DD5FF"/>
                      <stop offset="1" stopColor="#5CFFDE"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              Logs
            </button>
            {/* 3. ASK AI ADVISOR */}
            <button
            onClick={() => {
              playSound("click");
              setChatModalOpen(true);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-100/5 px-4 py-2 text-md font-medium text-white shadow-sm ring-1 ring-gray-700/60 backdrop-blur hover:bg-gray-100/10 hover:ring-gray-500 transition duration-200 sm:w-auto sm:min-w-[180px]"
          >
            <InfoIcon className="h-4 w-4" />
            {t("dashboard.askAIAdvisor")}
          </button>
          </div>


          {/* Right Controls Container */}
          <div className="flex flex-nowrap items-center justify-end gap-1.5 sm:gap-3 w-full">

            <div className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-full text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-semibold border border-gray-200">
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" />
              <span>{user?.credits}</span>
              <span className="hidden sm:inline ml-1">
                {t("header.ventureCoins")}
              </span>
            </div>
            {/* 1. CREDITS / LEADERBOARD */}
            {elonStep === 6 ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full ring-1 ring-yellow-400 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-semibold text-xs sm:text-sm">
                <Coins className="w-3.5 h-3.5" />
                <span>{user?.credits}</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsLeaderboardOpen(true)}
                  className="hidden border border-gray-200 lg:flex items-center gap-2 px-5 py-2 rounded-full text-md text-white hover:bg-gray-800 transition-all"
                >
                  <span>{t("header.leaderboard")}</span>
                  <svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 7.64501V2.85501C1 2.19001 1.385 2.03001 1.855 2.50001L3.15 3.79501C3.345 3.99001 3.665 3.99001 3.855 3.79501L5.645 2.00001C5.84 1.80501 6.16 1.80501 6.35 2.00001L8.145 3.79501C8.34 3.99001 8.66 3.99001 8.85 3.79501L10.145 2.50001C10.615 2.03001 11 2.19001 11 2.85501V7.65001C11 9.15001 10 10.15 8.5 10.15H3.5C2.12 10.145 1 9.02501 1 7.64501Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>


              </>
            )}

            {/* 2. UPGRADE BUTTON */}
            <Link href="/subscribe">
              <div
                className="flex items-center justify-center px-7 py-2 rounded-full text-white shadow-md transition-all duration-200 cursor-pointer"
                style={{
                  background: "linear-gradient(90deg, #F9C6FF 0%, #C1AEFF 100%)",
                }}
              >
                <span className="hidden sm:block text-md text-black font-bold tracking-wide">
                  Upgrade
                </span>
              </div>
            </Link>



            {/* 4. SETTINGS DROPDOWN */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsSettingsOpen(!isSettingsOpen);
                }}
                className={`p-2 rounded-lg transition-colors ${isSettingsOpen
                    ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
              >
                <Settings className="h-5 w-5" />
              </button>

              {isSettingsOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-3 flex flex-col gap-2 z-[1002] animate-in fade-in zoom-in-95 duration-200 origin-top-right"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Language
                    </span>
                    <LanguageSwitcher />
                  </div>

                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Theme
                    </span>
                    <ul className="flex items-center justify-end m-0 p-0">
                      <DarkModeSwitcher />
                    </ul>
                  </div>

                  <div className="pt-2 mt-1 border-t border-gray-100 dark:border-gray-700">
                    <div className="w-full">
                      <GameSwitchMenu />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. USER PROFILE */}
            <div className="shrink-0">
              <DropdownUser />
            </div>
          </div>
        </div>
      </header>

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {chatModalOpen && (
        <div className="fixed m-5 lg:m-0 inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg h-[90vh] max-h-[650px] flex flex-col p-5 rounded-3xl shadow-2xl bg-white dark:bg-[#1b1f23]/70 dark:backdrop-blur-xl border border-gray-300 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("modals.aiAdvisor.title")}</h2>
              <button
                onClick={() => {
                  setChatModalOpen(false);
                  setChatMessages([
                    {
                      sender: 'elon',
                      text: translatedGreeting || t("modals.aiAdvisor.greeting"),
                    },
                  ]);
                }}
                className="text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 text-lg font-bold"
              >
                ×
              </button>
            </div>

            {/* Chat Scrollable Area */}
            <div
              className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar"
              ref={(el) => {
                if (el && !isTyping) {
                  const lastMessage = el.lastElementChild;
                  if (lastMessage) {
                    lastMessage.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }
              }}
            >
              {chatMessages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
                      {isUser ? (
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                      ) : (
                        <Image
                          src="/elon.png"
                          alt="AI"
                          width={32}
                          height={32}
                          className="rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <div className={`whitespace-pre-wrap break-words px-4 py-3 rounded-2xl text-sm shadow-md ${isUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-[#2d3746]/70 text-gray-900 dark:text-white"
                        }`}>
                        {idx === 0 && !isUser
                          ? <TypewriterText text={msg.text} speed={20} />
                          : <p>{msg.text}</p>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {isTyping && (
                <div className="flex items-start gap-2">
                  <Image src="/elon.png" alt="AI" width={32} height={32} className="rounded-full" />
                  <div className="bg-gray-100 dark:bg-[#2c3440]/80 px-4 py-2 rounded-2xl text-sm shadow-md">
                    <div className="flex space-x-1 animate-pulse">
                      <span className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full" />
                      <span className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full" />
                      <span className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="mt-2 mb-2 bg-gray-100 dark:bg-[#1e2630]/60 p-2 rounded-xl shadow-inner max-h-[72px] overflow-y-auto">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">{t("modals.aiAdvisor.needHelp")}</p>
              <div className="flex flex-wrap gap-2">
                {[
                  t("modals.aiAdvisor.suggestions.increaseUA"),
                  t("modals.aiAdvisor.suggestions.prioritizeMetrics"),
                  t("modals.aiAdvisor.suggestions.reduceBugs"),
                  t("modals.aiAdvisor.suggestions.hireDecision"),
                  t("modals.aiAdvisor.suggestions.bestTasks"),
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setUserInput(prompt)}
                    className="text-xs sm:text-sm px-3 py-1 bg-white dark:bg-[#3c4658] hover:bg-gray-200 dark:hover:bg-[#485267] text-gray-900 dark:text-white rounded-full shadow-sm transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Field */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!userInput.trim()) return;
                const question = userInput.trim();
                setChatMessages(prev => [...prev, { sender: "user", text: question }]);
                setUserInput("");
                setIsTyping(true);

                try {
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai-hint`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      token: localStorage.getItem("userToken") || "",
                    },
                    body: JSON.stringify({ gameId: user?.gameId, promptFromUser: question }),
                  });

                  const data = await res.json();
                  setUser(data);
                  setUserState(data);
                  setChatMessages(prev => [
                    ...prev,
                    {
                      sender: "elon",
                      text: res.ok && data?.hint
                        ? data?.hint
                        : t("modals.aiAdvisor.errorUnknown"),
                    },
                  ]);
                } catch {
                  setChatMessages(prev => [
                    ...prev,
                    { sender: "elon", text: t("modals.aiAdvisor.errorGeneric") },
                  ]);
                } finally {
                  setIsTyping(false);
                }
              }}
              className="mt-2 flex items-end gap-2"
            >
              <textarea
                rows={1}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={t("modals.aiAdvisor.placeholder")}
                className="flex-grow resize-none overflow-hidden px-4 py-2 text-sm sm:text-base rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2c3440]/80 text-gray-900 dark:text-white shadow-sm placeholder:text-gray-500 dark:placeholder:text-gray-400"
                onInput={(e) => {
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                }}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-4 py-2 rounded-full"
              >
                {t("modals.aiAdvisor.send")}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Header;