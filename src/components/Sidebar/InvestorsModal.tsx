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
          (available) => available.name === investmentMade.name
        )
      );

      if (hasMatchingNames) {
        setInvestmentsArray([...availableInvestments]);
      } else {
        setInvestmentsArray([...availableInvestments, ...investmentsMade]);
      }
    }
  }, [user]);

  if (!isOpen) return null;

  const signInvestmentOnClick = async (investmentSigned: any) => {
    try {
      const makeReq = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/makeInvestment`,
        {
          method: "POST",
          credentials: "include",
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
        }
      );

      if (makeReq.ok) {
        const response = await makeReq.json();
        setUser(response);
        setUserState(response);
      } else {
        console.error(`Request failed with status ${makeReq.status}: ${makeReq.statusText}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const buyoutInvestment = async (investmentToBuyout: any) => {
    try {
      const makeReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buyoutInvestor`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          token: `${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          gameId: user?.gameId,
          investmentName: investmentToBuyout.name,
          buyoutAmount: investmentToBuyout.buyout,
        }),
      });

      if (makeReq.ok) {
        const response = await makeReq.json();
        setUser(response);
        setUserState(response);
      } else {
        console.error(`Request failed with status ${makeReq.status}: ${makeReq.statusText}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center px-2 sm:px-0">
        <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>

        <div className="relative w-full max-w-screen-xl my-6 mx-2 sm:mx-auto rounded-xl bg-white p-6 shadow-lg dark:bg-[#1A232F] max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute right-7 lg:right-3 lg:top-4 text-red-500 hover:text-red-600"
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

          {/* Responsive Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2  lg:flex  gap-6">
            {investmentsArray.map((e, index) => {
              const isSigned = user?.investmentsMade.some((inv) => inv.name === e.name);

              return (
                <div
                  key={index}
                  className="rounded-xl  border border-gray-200 p-5 bg-white dark:bg-[#1A232F] 
                  hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedInvestor(e);
                    isSigned ? setShowBuyoutConfirm(true) : setShowSignConfirm(true);
                  }}
                >
                  <div className="flex lg:w-95 items-center gap-4 mb-4">
                    {getInvestorImage(e.name) && (
                      <div className="h-24 w-24 flex-shrink-0 shadow-md rounded-full overflow-hidden">
                        <Image
                          src={getInvestorImage(e.name)?.src || "fallback_image_path"}
                          alt={e.name || "Default Alt Text"}
                          width={96}
                          height={96}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {e.name}
                      </h3>
                      <p className="text-sm italic text-blue-500 dark:text-blue-400">{e.quote}</p>
                    </div>
                  </div>

                  <div className="mb-6 text-sm text-gray-600 dark:text-gray-100">{e.description}</div>

                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-white">Investment</span>
                      <span className="text-sm font-medium text-green-600">${e.money}</span>
                    </div>

                    {isSigned && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-white">Buyout price</span>
                        <span className="text-sm font-medium text-green-600">
                          ${e.buyout?.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-white">
                        Investor&apos;s share
                      </span>
                      <span className="text-sm font-medium text-blue-500">{e.share}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-sm text-gray-600 dark:text-white">
                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500" />
                        Advantages
                      </span>
                      <span className="text-sm text-blue-500">
                        {e.bug_percent_point < 0
                          ? `Decreases bugs by ${Math.abs(e.bug_percent_point)}%`
                          : `Increases bugs by ${e.bug_percent_point}%`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-right">
                    {isSigned ? (
                      <span className="rounded border border-green-600 px-2 py-1 font-semibold text-green-600">
                        SIGNED
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          setSelectedInvestor(e);
                          setShowSignConfirm(true);
                        }}
                        className="inline-block rounded-xl border px-4 py-2 mt-2 transition-all duration-200 border-gray-300 hover:border-green-400 text-sm font-medium"
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

      {/* Confirm Modals */}
      {(showSignConfirm || showBuyoutConfirm) && selectedInvestor && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 px-4">
          <div className="rounded-xl bg-white dark:bg-[#1A232F] p-6 shadow-xl max-w-sm w-full text-gray-800 dark:text-white">
            <h2 className="text-lg font-semibold mb-2">
              {showSignConfirm ? "Make a deal with investor?" : "Buyout share from investor?"}
            </h2>
            <p className="mb-2">{selectedInvestor.name}</p>
            <p className="text-sm">
              {showSignConfirm ? "Investment" : "Share"}:{" "}
              <span className="text-green-600">
                {showSignConfirm
                  ? `$${selectedInvestor.money}`
                  : `${selectedInvestor.share}%`}
              </span>
            </p>
            <p className="text-sm mb-4">
              {showSignConfirm ? (
                <>
                  Advantages:{" "}
                  <span className="text-blue-500">
                    {selectedInvestor.bug_percent_point < 0
                      ? `Reduces bugs by ${Math.abs(selectedInvestor.bug_percent_point)}%`
                      : `Increases bugs by ${selectedInvestor.bug_percent_point}%`}
                  </span>
                </>
              ) : (
                <>
                  Buyout price:{" "}
                  <span className="text-green-600">${selectedInvestor.buyout}</span>
                </>
              )}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowBuyoutConfirm(false);
                  setShowSignConfirm(false);
                  setSelectedInvestor(null);
                }}
                className="px-4 py-2 border rounded text-gray-600 dark:text-white dark:border-gray-500"
              >
                No, cancel
              </button>
              <button
                onClick={() => {
                  if (showSignConfirm) {
                    signInvestmentOnClick(selectedInvestor);
                  } else {
                    buyoutInvestment(selectedInvestor);
                  }
                  setShowBuyoutConfirm(false);
                  setShowSignConfirm(false);
                  setSelectedInvestor(null);
                }}
                className="px-4 py-2 rounded bg-green-500 text-white"
              >
                Yes, {showSignConfirm ? "sign it" : "buyout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvestorsModal;
