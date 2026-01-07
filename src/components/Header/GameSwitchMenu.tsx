"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Pencil, Check, Rocket, Search, Gamepad2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { startNewSimulation as startNewSimulationAction } from "@/utils/gameActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface userGameType {
  gameId: string;
  gameName: string;
}

const GameSwitchMenu = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUniAc, setisUniAc] = useState<boolean>(false);
  const dropdownRef = useRef(null);
  const { user, setUser, setUserState, setloader } = useUser();
  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setIsOpen(false);
        setEditIndex(null);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredGames = user?.userGames?.filter((game: userGameType, index: number) => {
    const nameToCheck = game.gameName !== "Game" ? game.gameName : `Game ${index + 1}`;
    return nameToCheck.toLowerCase().includes(searchTerm.toLowerCase());
  });

  async function getGameFromId(gameId: string) {
    try {
      setloader(true);
      const makeReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/switch-game/${gameId}`, {
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
        router.replace("/")
      } else {
        console.error(`Request failed with status ${makeReq.status}: ${makeReq.statusText}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setloader(false);
    }
  }

  const handleEditClick = (index: number, currentName: string) => {
    setEditIndex(index);
    setEditedName(currentName);
  };

  const handleSaveClick = async (index: number, realIndex: number) => {
    const gameId = user?.userGames[realIndex].gameId;

    if (!gameId) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-game-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          gameId: gameId,
          newGameName: editedName,
        }),
      });

      if (response.ok) {
        const res = await response.json();
        setUser(res);
        setUserState(res);
      }
    } catch (error) {
      console.error("Error while updating game name:", error);
    }
    setEditIndex(null);
  };

  const handleStartNewSimulation = async () => {
    const result = await startNewSimulationAction({
      user,
      setUser,
      setUserState,
      setloader,
    });

    

    if (result.insufficientCredits) {
      toast.error("You don't have enough Venture Coins!", { autoClose: 5000 });
      return;
    }

    if (result.uniAcLimit) {
      toast.error(
        "You can only run 2 simulations on a Uni account. Upgrade to continue.",
        { autoClose: 5000 }
      );
      return;
    }


    if (result.success) {
      setIsOpen(false);
    }
  };

  return (
    // FIX: Increased z-index from z-50 to z-[99999] to beat the "Make Turn" toast
    <div className="relative z-999999" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <Gamepad2 size={16} className="text-primary" />
          <span className="truncate max-w-[100px] sm:max-w-[140px] text-left">
            {user?.gameName || "Select Game"}
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 text-gray-400 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:right-0 mt-2 w-72 origin-top-right rounded-xl border border-gray-200 bg-white dark:border-strokedark dark:bg-boxdark shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">

          {/* 1. Search Bar Header */}
          <div className="p-3 border-b border-gray-100 dark:border-strokedark bg-gray-50 dark:bg-boxdark-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Find game..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-boxdark border border-gray-200 dark:border-strokedark rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* 2. Scrollable List Area */}
          <ul className="overflow-y-auto max-h-[250px] custom-scrollbar p-1">
            {filteredGames && filteredGames.length > 0 ? (
              filteredGames.map((gameObject: userGameType, index: number) => {
                const originalIndex = user?.userGames.findIndex((g: userGameType) => g.gameId === gameObject.gameId) || 0
                const displayName = gameObject.gameName !== "Game" ? gameObject.gameName : `Game ${originalIndex + 1}`;

                return (
                  <li
                    key={gameObject.gameId}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-all mb-1
                      ${user?.lastRequestMade === gameObject.gameId
                        ? "bg-primary/10 text-primary dark:text-white font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-strokedark"
                      }`}
                  >
                    <div className="flex items-center gap-3 flex-grow min-w-0" onClick={() => getGameFromId(gameObject.gameId)}>
                      <span className={`h-2 w-2 rounded-full flex-shrink-0 ${user?.lastRequestMade === gameObject.gameId ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-primary/50'}`} />

                      {editIndex === originalIndex ? (
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="w-full rounded border border-primary px-2 py-0.5 text-sm dark:bg-boxdark dark:text-white focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveClick(index, originalIndex);
                          }}
                          autoFocus
                        />
                      ) : (
                        <span className="truncate cursor-pointer select-none">
                          {displayName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center ml-2">
                      {editIndex === originalIndex ? (
                        <div className="flex gap-1">
                          <button onClick={(e) => { e.stopPropagation(); handleSaveClick(index, originalIndex); }} className="p-1 hover:bg-green-100 rounded text-green-600">
                            <Check size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditClick(originalIndex, displayName); }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-400 hover:text-primary transition-all"
                        >
                          <Pencil size={12} />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No games found
              </li>
            )}
          </ul>

          {/* 3. Footer */}
          <div className="border-t border-gray-100 dark:border-strokedark p-3 bg-gray-50 dark:bg-boxdark-2 z-10">
            <button
              onClick={handleStartNewSimulation}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <Rocket size={16} />
              {t("modals.gameOptions.startNewSimulation")}
            </button>
            <div className="mt-2 flex justify-center items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span>Cost:</span>
              <span className="font-bold text-orange-500 flex items-center gap-1">
                2,000 Coins
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSwitchMenu;