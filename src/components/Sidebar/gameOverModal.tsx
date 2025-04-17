import React from 'react';
import rocketImage from '../../rocket.png';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';

const GameOverModal = () => {
  const {
    user,
    setloader,
    setUser,
    setUserState,
    setnotificationMessages,
    notificationMessages,
  } = useUser();

  async function resetTheGame() {
    setloader(true);
    const makeReq = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/resetGame`,
      {
        method: 'POST',
        body: JSON.stringify({
          gameId: user?.gameId,
        }),
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
      setnotificationMessages([...notificationMessages, response.message]);
      setloader(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#1A232F] rounded-3xl p-8 text-center max-w-sm w-full shadow-xl space-y-6">
        <Image
          src={`${rocketImage.src}`}
          alt="Rocket crash"
          className="w-24 h-24 mx-auto"
        />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Unfortunately, you’ve ran out of money
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Try again and you will definitely have better luck next time.
        </p>

        <div className="flex justify-around text-lg font-semibold text-gray-700 dark:text-white">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</p>
            <p className="text-blue-600 dark:text-blue-400">
              ${user?.revenue ? user?.revenue : ''}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Turns made</p>
            <p>{user?.turnNumber ? user?.turnNumber : ''}</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={resetTheGame}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl"
          >
            🚀 Start New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
