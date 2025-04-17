"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { getInvestorImage } from "../investorImages";
import Image from "next/image";

interface InvestorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvestorsModal: React.FC<InvestorsModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser, setUserState } = useUser();
  const [investmentsArray, setInvestmentsArray] = useState<any[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<any | null>(null);
  const [showSignConfirm, setShowSignConfirm] = useState(false);
  const [showBuyoutConfirm, setShowBuyoutConfirm] = useState(false);

  
  useEffect(() => {
    
    if (user) {
      const investmentsMade = user.investmentsMade || [];
      const availableInvestments = user.availableInvestments || [];

      const hasMatchingNames = investmentsMade.some((investmentMade) =>
        availableInvestments.some(
          (available) => available.name === investmentMade.name,
        ),
      );

      if (hasMatchingNames) {
        setInvestmentsArray([...availableInvestments]);
      } else {
        setInvestmentsArray([...availableInvestments, ...investmentsMade]);
      }
    }
  }, [user]);
  
  if (!isOpen) return null;

  const signInvestmentOnClick = async (investmentSigned: any, buyoutPrice: any) => {
    
    try {
      const makeReq = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/makeInvestment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: `${localStorage.getItem("userToken")}`,
          },
          body: JSON.stringify({
            investmentSigned,
            investmentAmount: investmentSigned.money,
            investorsShare: investmentSigned.share,
            gameId: user?.gameId,
          }),
        },
      );

      if (makeReq.ok) {
        const response = await makeReq.json();
        setUser(response);
        setUserState(response);
      } else {
        console.error(
          `Request failed with status ${makeReq.status}: ${makeReq.statusText}`,
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const buyoutInvestment  = async (investmentToBuyout : any) =>{
    try {
      const makeReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buyoutInvestor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          gameId: user?.gameId,
          investmentName: investmentToBuyout.name,
          buyoutAmount : investmentToBuyout.buyout,
        }),
      })
      if (makeReq.ok) {
        const response = await makeReq.json();
        setUser(response);
        setUserState(response);
      } else {
        console.error(
          `Request failed with status ${makeReq.status}: ${makeReq.statusText}`,
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
      
    }
  }

  return (

    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center custom-scrollbar">
      <div className="absolute inset-0 bg-black/30  "  onClick={onClose}></div>

      <div className="relative w-full  max-w-5xl my-6 rounded-xl bg-white p-6 shadow-lg dark:bg-[#1A232F] ">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-medium text-gray-800 dark:text-white">
              Available Investors
            </h2>
            <span className="text-2xl font-medium text-green-500">
              {user?.availableInvestments.length}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-white">
            Each round new investors will be available to you. In addition to
            funds, they will provide invaluable knowledge, in exchange for
            shares in your company.
          </p>
        </div>

        {/* Scrollable cards container */}
        <div 
        className="max-w-5xl  overflow-x-auto pb-4">
          <div 
          className="flex gap-4 "
          >
            {investmentsArray.map((e, index) => {
              
              const isSigned = user?.investmentsMade.some((inv) => inv.name === e.name)
              return  (
                <div
                  key={index}
                  className={`min-w-[250px] flex-none rounded-xl border border-gray-200 p-5 ${
                    !isSigned ? 'hover:cursor-pointer' : ''
                  }`}
                  onClick={() => {
                    const isSigned = user?.investmentsMade.some((inv) => inv.name === e.name);
                    setSelectedInvestor(e);
                    isSigned ? setShowBuyoutConfirm(true) : setShowSignConfirm(true);
                  }}
                >
                  {/* Image + Name + Quote Header */}
                  <div className="flex items-center gap-4 mb-4">
                    {getInvestorImage(e.name) && (
                      <Image
                        src={getInvestorImage(e.name).src}
                        alt={e.name}
                        className="h-24 w-24 object-contain"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{e.name}</h3>
                      <p className="text-sm italic text-blue-500 dark:text-blue-500">{e.quote}</p>
                    </div>
                  </div>
              
                  {/* Investor Description */}
                  <div className="mb-6 text-sm w-100 h-auto text-gray-600 dark:text-gray-50 dark:font-light">
                    {e.description}
                  </div>
              
                  {/* Investment Details */}
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-white">Investment</span>
                      <span className="text-sm font-medium text-green-600">$ {e.money}</span>
                    </div>
              
                    {user?.investmentsMade.some((element) => element.name === e.name) && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-white">Buyout price</span>
                        <span className="text-sm font-medium text-green-600">
                          $ {e.buyout?.toLocaleString()}
                        </span>
                      </div>
                    )}
              
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-white">
                        Investor&apos;s share
                      </span>
                      <span className="text-sm font-medium text-blue-500">{e.share} %</span>
                    </div>
              
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-sm text-gray-600 dark:text-white">
                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500" />
                        Advantages
                      </span>
                      <span className="text-sm text-blue-500">
                        {e.bug_percent_point < 0
                          ? `Decreases bugs by ${Math.abs(e.bug_percent_point)} %`
                          : `Increases bugs by ${e.bug_percent_point} %`}
                      </span>
                    </div>
                  </div>
              
                  {/* Signed or CTA */}
                  <div className="mt-4 text-right">
                    {user?.investmentsMade.some((element) => element.name === e.name) ? (
                      <span className="rounded border border-green-600 px-2 py-1 font-semibold text-green-600">
                        SIGNED
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          const isSigned = user?.investmentsMade.some((inv) => inv.name === e.name);
                          setSelectedInvestor(e);
                          isSigned ? setShowBuyoutConfirm(true) : setShowSignConfirm(true);
                        }}
                        className={`
                          min-w-[150px] flex-none rounded-xl border p-3 transition-all mt-2 duration-200
                          ${
                            user?.investmentsMade.some((element) => element.name === e.name)
                              ? 'border-gray-300 hover:border-blue-400 cursor-pointer'
                              : 'border-gray-300 hover:border-green-400 cursor-pointer'
                          }
                        `}
                      >
                        Sign Investment
                      </span>
                    )}
                  </div>
                </div>
              );
              
            })}
          </div>
        </div>
      </div>
      </div>
      {showSignConfirm && selectedInvestor && (
  <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50">
    <div className="rounded-xl bg-white dark:bg-[#1A232F] p-6 shadow-xl max-w-sm w-full text-gray-800 dark:text-white">
      <h2 className="text-lg font-semibold mb-2">Make a deal with investor?</h2>
      <p className="mb-2">{selectedInvestor.name}</p>
      <p className="text-sm">
        Investment: <span className="text-green-600">${selectedInvestor.money}</span>
      </p>
      <p className="text-sm">
        Investor’s share: <span className="text-blue-600">{selectedInvestor.share}%</span>
      </p>
      <p className="text-sm mb-4">
        Advantages: <span className="text-blue-500">
          {selectedInvestor.bug_percent_point < 0
            ? `Reduces bugs by ${Math.abs(selectedInvestor.bug_percent_point)}%`
            : `Increases bugs by ${selectedInvestor.bug_percent_point}%`}
        </span>
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setShowSignConfirm(false);
            setSelectedInvestor(null);
            buyoutInvestment(selectedInvestor);
          }}
          className="px-4 py-2 border rounded text-gray-600 dark:text-white dark:border-gray-500"
        >
          No, cancel
        </button>
        <button
          onClick={() => {
            signInvestmentOnClick(selectedInvestor, selectedInvestor.buyout);
            setShowSignConfirm(false);
            setSelectedInvestor(null);
          }}
          className="px-4 py-2 rounded bg-green-500 text-white"
        >
          Yes, sign it
        </button>
      </div>
    </div>
  </div>
      )}
      {showBuyoutConfirm && selectedInvestor && (
  <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50">
    <div className="rounded-xl bg-white dark:bg-[#1A232F] p-6 shadow-xl max-w-sm w-full text-gray-800 dark:text-white">
      <h2 className="text-lg font-semibold mb-2">Buyout share from investor?</h2>
      <p className="mb-2">{selectedInvestor.name}</p>
      <p className="text-sm">
        Share: <span className="text-blue-600">{selectedInvestor.share}%</span>
      </p>
      <p className="text-sm mb-4">
        Buyout price: <span className="text-green-600">${selectedInvestor.buyout}</span>
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setShowBuyoutConfirm(false);
            setSelectedInvestor(null);
          }}
          className="px-4 py-2 border rounded text-gray-600 dark:text-white dark:border-gray-500"
        >
          No, cancel
        </button>
        <button
          onClick={() => {
            buyoutInvestment(selectedInvestor);
            setShowBuyoutConfirm(false);
            setSelectedInvestor(null);
          }}
          className="px-4 py-2 rounded bg-green-500 text-white"
        >
          Yes, buyout
        </button>
      </div>
    </div>
  </div>
)}


    </>
  );
};

export default InvestorsModal;
