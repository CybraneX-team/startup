import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const NotEnoughCredits = () => {
    const {user} = useUser();
  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
  <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1e1e2f] text-center shadow-xl transition-all">
    
    {/* Close Button */}
    <div className="flex justify-end p-4"> 
      {/* <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button> */}
     </div> 

    {/* Custom SVG */}
    <div className="flex justify-center">
      <Image src="images/cantplay.svg" alt="Cannot Play Icon" width={25}  height={25} className="h-25 w-60 mb-4" />
    </div>

    {/* Modal Text */}
    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Alert</h3>
    <div className="px-6 pt-2 pb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">You can&apos;t play anymore</h2>
      <p className="text-gray-600 dark:text-gray-300">
        You need more venture coins  to continue
      </p>
    </div>

    {/* Button */}
    <div className="px-6 pb-6">
      <Link href="/subscribe">
      <button className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 transition duration-200">
        Buy Plan
      </button>
      </Link>
    </div>
  </div>
</div>


  )
}

export default NotEnoughCredits