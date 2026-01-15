"use client";

import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownUser from "./DropdownUser";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import GameSwitchMenu from "./GameSwitchMenu";
import LanguageSwitcher from "../LanguageSwitcher";
import { Coins, Trophy, Bell, Crown, Settings, ChevronLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import LeaderboardModal from "../LeaderboardModal";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";

import useColorMode from "@/hooks/useColorMode";
import { useSound } from "@/context/SoundContext";

const Header = (props: {
  sidebarOpen: string | boolean | undefined | any;
  setSidebarOpen: (arg0: boolean) => void | any;
}) => {
  useColorMode();

  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  const { HeaderDark, user, elonStep, notificationMessages } = useUser();
  const { t } = useLanguage();
  const { playSound } = useSound();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const { openNotificationModal } = useNotification();
  const unreadCount = notificationMessages?.length || 0;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] w-full bg-transparent backdrop-blur-md
         dark:bg-gray-900/95 border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300`}
      >
        <div className="flex flex-nowrap items-center justify-between px-3 py-2 md:px-6 md:py-3 gap-2">
          {/* Left: Back Button & Hamburger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
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
            </button>
          </div>

          {/* Right Controls Container */}
          <div className="flex flex-nowrap items-center justify-end gap-1.5 sm:gap-3 w-full">
            {/* 1. CREDITS / LEADERBOARD */}
            {elonStep === 6 ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg ring-1 ring-yellow-400 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-semibold text-xs sm:text-sm">
                <Coins className="w-3.5 h-3.5" />
                <span>{user?.credits}</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsLeaderboardOpen(true)}
                  className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-700 text-xs font-semibold text-white hover:bg-gray-800 transition-all"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{t("header.leaderboard")}</span>
                </button>

                <div className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-semibold border border-gray-200 dark:border-gray-700">
                  <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" />
                  <span>{user?.credits}</span>
                  <span className="hidden sm:inline ml-1">
                    {t("header.ventureCoins")}
                  </span>
                </div>
              </>
            )}

            {/* 2. UPGRADE BUTTON */}
            <Link href="/subscribe">
              <div className="flex items-center justify-center p-2 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
                <Crown className="w-4 h-4 fill-yellow-200" />
                <span className="hidden sm:block ml-2 text-sm font-bold tracking-wide">
                  Upgrade
                </span>
              </div>
            </Link>

            {/* 3. NOTIFICATIONS */}
            <button
              onClick={() => {
                playSound("notification");
                openNotificationModal();
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              title={t("modals.notifications.title")}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* 4. SETTINGS DROPDOWN */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsSettingsOpen(!isSettingsOpen);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isSettingsOpen
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
    </>
  );
};

export default Header;