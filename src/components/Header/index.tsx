import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownMessage from "./DropdownMessage";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import GameSwitchMenu from "./GameSwitchMenu";
import LanguageSwitcher from "../LanguageSwitcher";
import { Coins, Trophy } from "lucide-react";
import { useState } from "react";
import LeaderboardModal from "../LeaderboardModal";

const Header = (props: {
  sidebarOpen: string | boolean | undefined | any;
  setSidebarOpen: (arg0: boolean) => void | any;
}) => {
    const {HeaderDark, user, elonStep} = useUser()
    const { t } = useLanguage();
    const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  
  return (
    <>
    <header className={`fixed top-0 left-0 right-0 z-[1000] w-full backdrop-blur-md border-b ${HeaderDark ? 'bg-[#878C94]/95' : "bg-white/95"} dark:bg-gray-900/95 border-gray-200 dark:border-gray-800 shadow-sm`}>

{/* Main Header Row */}
<div className="flex flex-wrap sm:flex-nowrap items-center justify-between px-4 py-3 md:px-6 2xl:px-11 gap-3">

  {/* Left: Hamburger and Logo */}
  <div className="flex items-center gap-3">
    {/* Hamburger only on mobile */}
    <button
      aria-controls="sidebar"
      onClick={(e) => {
        e.stopPropagation();
        props.setSidebarOpen(!props.sidebarOpen);
      }}
      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors lg:hidden"
    >
      <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 mb-1.5 transition-all"></span>
      <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 mb-1.5 transition-all"></span>
      <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all"></span>
    </button>
  </div>

  {/* Right Controls */}
  <div className="flex flex-nowrap items-center gap-2 sm:gap-3">
  {elonStep === 6 ? (
  <div className="flex items-center gap-2 px-4 py-2 rounded-lg ring-2 ring-yellow-400 animate-pulse bg-white/10 dark:bg-white/10 backdrop-blur-md shadow-lg transition-all duration-300 text-yellow-200 dark:text-yellow-100 font-semibold">
    <Coins className="w-4 h-4 text-yellow-300 animate-bounce" />
    <span className="text-sm tracking-wide">{t("header.credits")}: {user?.credits}</span>
  </div>
) : (
  <>
    <button
      onClick={() => setIsLeaderboardOpen(true)}
      className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-700 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-200"
      title="View Leaderboard"
    >
      <Trophy className="w-4 h-4 text-white" />
      <span className="text-sm font-semibold tracking-wide">{t("header.leaderboard")}</span>
    </button>
    <div
      className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-700 text-sm font-semibold text-white shadow-sm cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-200"
    >
      <Coins className="w-4 h-4 text-white" />
      <span className="text-sm font-semibold tracking-wide">
        {t("header.ventureCoins")}: {user?.credits}
      </span>
    </div>
  </>
)}




    <LanguageSwitcher />
    <DarkModeSwitcher />
    <GameSwitchMenu />
    <DropdownUser />
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