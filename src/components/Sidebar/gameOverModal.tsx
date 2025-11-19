import React, { useState } from 'react';
// import rocketImage from '../../rocket.png';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import { AlertCircle, CreditCard, X } from 'lucide-react';
import { toast } from 'react-toastify';

const GameOverModal = () => {
  const {
    user,
    setloader,
    setUser,
    setUserState,
    setnotificationMessages,
    notificationMessages,
  } = useUser();

  const [showConfirm, setShowConfirm] = useState(false);

  const resetTheGame = async () => {
    setloader(true);
    const makeReq = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/resetGame`,
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ gameId: user?.gameId }),
        headers: {
          'Content-Type': 'application/json',
          token: `${localStorage.getItem('userToken')}`,
        },
      }
    );
    if (makeReq.ok) {
      const response = await makeReq.json();
      setUser(response);
      setUserState(response);
      setnotificationMessages([...notificationMessages, ...response.message]);
      setloader(false);
    }
  };

  const resumeGameForCredits = async () => {
    setloader(true);
    setShowConfirm(false);
    const makeReq = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/resumeGame`,
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ gameId: user?.gameId }),
        headers: {
          'Content-Type': 'application/json',
          token: `${localStorage.getItem('userToken')}`,
        },
      }
    );
    if (makeReq.ok) {
      const response = await makeReq.json();
      setUser(response);
      setUserState(response);
      setnotificationMessages([...notificationMessages, ...response.message]);
      setloader(false);
    }
  };

  function onClose(){

  }

   async function handleStartOver() {
      const token = localStorage.getItem("userToken");
    
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/credits/startover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
        body: JSON.stringify({ gameId: user?.gameId }),
      });
    
      const data = await response.json();
    
      if (response.ok) {
        setUser(data);
        setUserState(data);
        setloader(false)
        toast.success("Game reset successful 🎯");
      } else {
        toast.error(data.message || "Failed to reset game");
      }
    }
  return (
    <>
      {/* Game Over Modal */}
      <div className="fixed inset-0 z-99999 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#1A232F] dark:border dark:border-blue-500 rounded-3xl p-6 sm:p-8 text-center w-full max-w-sm space-y-6 shadow-xl mx-4">
          {/* Image */}
          <Image
            src={`/rocket.png`}
            alt="Rocket crash"
            width={96}
            height={96}
            className="w-24 h-24 mx-auto"
          />

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Unfortunately, you&apos;ve ran out of money
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Try again and you will definitely have better luck next time.
          </p>

          {/* Stats */}
          <div className="flex justify-around text-base font-semibold text-gray-700 dark:text-white">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</p>
              <p className="text-blue-600 dark:text-blue-400">${user?.revenue ?? ''}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Turns made</p>
              <p>{user?.turnNumber ?? ''}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={resetTheGame}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl"
            >
              🚀 Start New Game
            </button>

            <button
              onClick={() => setShowConfirm(true)}
              className="w-full flex flex-wrap items-center justify-center gap-2 py-3 px-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm sm:text-base text-center"
            >
              <span className="whitespace-nowrap">Resume From Where You Left</span>
              <span className="whitespace-nowrap">(2000 venture coins)</span>
              <CreditCard size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow-2xl w-full max-w-xs text-center space-y-4">
            <AlertCircle className="mx-auto text-yellow-600 dark:text-yellow-300" size={32} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Resuming will cost <span className="font-bold text-violet-600 dark:text-violet-400">2000 credits</span>.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={() => {setShowConfirm(false)}}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleStartOver}
                className="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 dark:hover:bg-violet-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameOverModal;
