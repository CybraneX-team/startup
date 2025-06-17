"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Pencil, Check } from "lucide-react";
import { useUser } from "@/context/UserContext";
interface userGameType{
  gameId: string;
  gameName: string;
}
const GameSwitchMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const dropdownRef = useRef(null);
  const { user, setUser, setUserState, setloader } = useUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setIsOpen(false);
        setEditIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      } else {
        console.error(`Request failed with status ${makeReq.status}: ${makeReq.statusText}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setloader(false);
    }
  }

  const handleEditClick = (index: number) => {
    setEditIndex(index);
    setEditedName(user?.gameName || `Game ${index + 1}`);
  };

  const handleSaveClick = async (index: number) => {
    const gameName = user?.userGames[index].gameName;
    const gameId = user?.userGames[index].gameId;


    if (!gameId) {
      console.error("No gameId found for this index");
      return;
    }

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
        const res = await response.json()
        // Optional: Update user.games locally
        setUser(res)
        setUserState(res)
      } else {
        console.error("Failed to update game name");
      }
    } catch (error) {
      console.error("Error while updating game name:", error);
    }

    setEditIndex(null);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-md bg-gray-200 dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
      >
        Switch Game
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {isOpen && (
        <ul className="absolute right-0 mt-2 max-w-[90vw] w-60 sm:w-72 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-xl z-50 overflow-hidden">
        {user?.userGames?.length && user?.userGames?.length > 0 ? (
            user?.userGames.map((gameObject: userGameType , index: number) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 flex-grow" onClick={() => getGameFromId(gameObject.gameId)}>
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full rounded-md border px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      autoFocus
                    />
                  ) : (
                    <span className="truncate">
                     {
                      gameObject.gameName !== "Game" ? gameObject.gameName  : `${gameObject?.gameName} ${index+1} `
                     }  
                  </span>
                  
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {user?.lastRequestMade === gameObject.gameId && (
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  )}
                  {editIndex === index ? (
                    <Check
                      size={16}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveClick(index);
                      }}
                      className="cursor-pointer text-green-500 hover:text-green-700"
                    />
                  ) : (
                    <Pencil
                      size={16}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(index);
                      }}
                      className="cursor-pointer text-gray-400 hover:text-gray-600"
                    />
                  )}
                </div>
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
