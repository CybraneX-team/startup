"use client"
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface InvestorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvestorsModal: React.FC<InvestorsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const {user, setUser, setUserState} = useUser()
  console.log("user is :",  user)
  const [investmentsArray, setInvestmentsArray] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const investmentsMade = user.investmentsMade || [];
      const availableInvestments = user.availableInvestments || [];
  
      const hasMatchingNames = investmentsMade.some(investmentMade =>
        availableInvestments.some(available => available.name === investmentMade.name)
      );
  
      if (hasMatchingNames) {
        setInvestmentsArray([...availableInvestments]);
      } else {
        setInvestmentsArray([
          ...availableInvestments,
          ...investmentsMade
        ]);
      }
    }
  }, [user]);
  

  const signInvestmentOnClick = async (investmentSigned: any) => {
    try {
      const makeReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/makeInvestment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          "token": `${localStorage.getItem("userToken")}` // Use a proper Authorization header
        },
        body: JSON.stringify({
          investmentSigned,
          investmentAmount: investmentSigned.money,
          investorsShare: investmentSigned.share,
          gameId: user?.gameId
        })
      });
  
      if (makeReq.ok) {
        const response = await makeReq.json();
        console.log("res", response); // Log the response
        setUser(response)
        setUserState(response)
        
      } else {
        console.error(`Request failed with status ${makeReq.status}: ${makeReq.statusText}`);
      }
    } catch (error) {
      console.error("An error occurred:", error); 
    }
  };
  
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {
        investmentsArray.map((e)=>{
        return   <div className="relative w-90 h-[85%] overflow-y-auto mx-5 max-w-md rounded-lg bg-white shadow-xl p-6">
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Modal Header */}
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Available Investors 
              {user?.availableInvestments.length}</h2>
            <p className="text-sm text-gray-600 mb-6">
              Each round new investors will be available to you. In addition to funds, they will provide invaluable knowledge, in exchange for shares in your company.
            </p>

            {/* Investor Category */}
            <h3 className="text-base font-semibold text-gray-900 mb-2">{e.name}</h3>
            <p className="text-sm text-blue-500 italic mb-3">
            { e.quote}
            </p>

            {/* Investor Description */}
            <p className="text-sm text-gray-600 mb-6">
              {e.description}
            </p>

            {/* Investment Details */}
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Investment</span>
                <span className="text-sm font-medium text-green-600">$ {e.money}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Buyout price</span>
                <span className="text-sm font-medium text-green-600">$ 200,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Investor's share</span>
                <span className="text-sm font-medium text-blue-500">{e.share} %</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Advantages
                </span>
                <span className="text-sm text-blue-500"> {e.bug_percent_point < 0? 
                `Decreases bugs by ${e.bug_percent_point} %` : `Increases bugs by ${e.bug_percent_point} %` } </span>
              </div>
            </div>

            {/* Signed Tag */}
            <div className="mt-4 text-right">
  {user?.investmentsMade.some((element) => element.name === e.name) ? (
    <span className="text-green-600 font-semibold border border-green-600 rounded px-2 py-1">
      SIGNED
    </span>
  ) : (
    <span
      onClick={() => signInvestmentOnClick(e)}
      className="text-green-600 font-semibold border cursor-pointer border-green-600 rounded px-2 py-1"
    >
      Sign Investment
    </span>
  )}
</div>

          </div>
        })
      
      }
    </div>
  );
};

export default InvestorsModal;
