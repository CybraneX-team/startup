"use client"
import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useUser } from "@/context/UserContext";

const GameSwitchMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, setUser, setUserState, setloader } = useUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function getGameFromId(gameId: string) {
    try {
      setloader(true)
      const makeReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/switch-game/${gameId}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          token: `${localStorage.getItem("userToken")}`,
        },
      });

      if (makeReq.ok) {
        const response = await makeReq.json();
        setUser(response);
        setUserState(response);
        setIsOpen(false);
      } else {
        console.error(`Request failed with status ${makeReq.status}: ${makeReq.statusText}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }finally{
      setloader(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-md bg-gray-200 dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
      >
        Switch Game
        <ChevronRight
          size={16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-90" : "rotate-0"}`}
        />
      </button>

      {isOpen && (
        <ul className="absolute right-0 mt-2 w-44 rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-xl z-50">
          {user?.userGames?.length && user?.userGames?.length > 0 ? (
            user?.userGames.map((gameId: string, index: number) => (
              <li
                key={index}
                onClick={() => getGameFromId(gameId)}
                className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <span>Game {index + 1}</span>
                {user?.lastRequestMade === gameId && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                )}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No games available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default GameSwitchMenu;
