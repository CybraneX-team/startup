import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownMessage from "./DropdownMessage";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import GameSwitchMenu from "./GameSwitchMenu";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
    const {HeaderDark, user} = useUser()
  
  return (
<header className={`sticky top-0 z-[900] w-full ${HeaderDark ? 'bg-[#878C94]' : "bg-white"} dark:bg-boxdark dark:drop-shadow-none`}>

{/* Top banner if AI customization not done */}
{/* {!user?.isAiCustomizationDone && 
  <div className="flex justify-start gap-2 px-4 py-3 bg-gray-100 dark:bg-[#24303F]">
    <Link href="/" className="flex items-center gap-2">
      <Image
        width={24}
        height={24}
        src={"/favicon.ico"}
        alt="Logo"
        priority
      />
      <h1 className="text-lg font-semibold text-black dark:text-white">
        Startup Simulator
      </h1>
    </Link>
  </div>
} */}

{/* Main Header Row (ALWAYS flex row for both mobile and desktop) */}
<div className="flex flex-wrap sm:flex-nowrap items-center justify-between px-4 py-3 md:px-6 2xl:px-11 gap-2">

  {/* Left: Hamburger and Logo */}
  <div className="flex items-center gap-2">
    {/* Hamburger only on mobile */}
    <button
      aria-controls="sidebar"
      onClick={(e) => {
        e.stopPropagation();
        props.setSidebarOpen(!props.sidebarOpen);
      }}
      className="rounded-sm border border-stroke bg-white p-2 dark:border-strokedark dark:bg-boxdark lg:hidden"
    >
      <span className="block w-5 h-0.5 bg-black dark:bg-white mb-1"></span>
      <span className="block w-5 h-0.5 bg-black dark:bg-white mb-1"></span>
      <span className="block w-5 h-0.5 bg-black dark:bg-white"></span>
    </button>

    {/* Logo (always visible) */}
    {/* <Link href="/" className="flex items-center gap-2">
      <Image
        width={24}
        height={24}
        src={"/images/logo/logo-icon.svg"}
        alt="Logo"
      />
      <h1 className="text-lg font-semibold text-black dark:text-white hidden sm:block">
        Startup Simulator
      </h1>
    </Link> */}
  </div>

  {/* Right Controls */}
  <div className="flex flex-nowrap items-center gap-2 sm:gap-3">
    <DarkModeSwitcher />
    <GameSwitchMenu />
    <DropdownUser />
  </div>

</div>
</header>


  );
};

export default Header;