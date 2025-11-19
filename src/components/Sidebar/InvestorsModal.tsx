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
      const made = user.investmentsMade || [];
      const avail = user.availableInvestments || [];
      const merged = made.some((m) => avail.some((a) => a.name === m.name))
        ? [...avail]
        : [...avail, ...made];
      setInvestmentsArray(merged);
    }
  }, [user]);

  if (!isOpen) return null;

  const signInvestment = async (e: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/makeInvestment`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("userToken") || "",
      },
      body: JSON.stringify({
        investmentSigned: e,
        investmentAmount: e.money,
        investorsShare: e.share,
        gameId: user?.gameId,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      setUser(json);
      setUserState(json);
    }
  };

  const buyoutInvestment = async (e: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/buyoutInvestor`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("userToken") || "",
      },
      body: JSON.stringify({
        gameId: user?.gameId,
        investmentName: e.name,
        buyoutAmount: e.buyout,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      setUser(json);
      setUserState(json);
    }
  };

  return (
    <>
      <div className="fixed md:top-20 top-10 lg:top-8 lg:w-full  m-5 lg:m-0 z-[99999] flex justify-center items-center bg-black/40 backdrop-blur-sm px-2">
        <button
          onClick={onClose}
          className="absolute top-4 right-4  lg:right-32  md:right-15 z-50 text-red-500 hover:text-red-600"
        >
          <X className="h-6 w-6" />
        </button>


        {/* Modal Container */}
        <div className="relative w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-screen-xl max-h-[90vh] bg-white dark:bg-[#1A232F] rounded-xl shadow-lg overflow-y-auto overflow-x-hidden">

          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-[#1A232F] z-40">
            <h2 className="text-2xl font-medium text-gray-800 dark:text-white inline">
              Available Investors{" "}
            </h2>
            <span className="text-2xl font-medium text-green-500">
              {user?.availableInvestments.length}
            </span>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Each round, new investors will be available to you. They bring
              funds and benefits in exchange for shares.
            </p>
          </div>

          {/* Cards */}
          <div className="sm:overflow-x-auto overflow-y-auto">
            <div className="flex flex-col sm:flex-row gap-4 p-6  lg:w-80 sm:min-w-full">
              {investmentsArray.map((e, i) => {
                const signed = user?.investmentsMade.some((inv: any) => inv.name === e.name);

                return (
                  <div
                    key={i}
                    className="w-full sm:w-[320px] flex-shrink-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A232F] p-5"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {getInvestorImage(e.name) && (
                        <div className="h-20 w-20 rounded-full overflow-hidden">
                          <Image
                            src={getInvestorImage(e.name) ?? "/elon.png"} 
                            alt={e.name}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {e.name}
                        </h3>
                        <p className="text-sm italic text-blue-500 dark:text-blue-400">
                          {e.quote}
                        </p>
                      </div>
                    </div>

                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{e.description}</p>

                    <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-white">Investment</span>
                        <span className="text-green-600">${e.money}</span>
                      </div>
                      {signed && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-white">Buyout price</span>
                          <span className="text-green-600">${e.buyout}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-white">Investor&apos;s share</span>
                        <span className="text-blue-500">{e.share}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-white flex items-center">
                          <span className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                          Advantages
                        </span>
                        <span className="text-blue-500">
                          {e.bug_percent_point < 0
                            ? `Decreases bugs by ${Math.abs(e.bug_percent_point)}%`
                            : `Increases bugs by ${e.bug_percent_point}%`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 text-right">
                      {signed ? (
                        <span className="rounded border border-green-600 px-2 py-1 text-sm font-semibold text-green-600">
                          SIGNED
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedInvestor(e);
                            setShowSignConfirm(true);
                          }}
                          className="mt-2 rounded border border-gray-300 px-3 py-1 text-sm hover:border-green-500"
                        >
                          Sign Investment
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {(showSignConfirm || showBuyoutConfirm) && selectedInvestor && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="rounded-xl bg-white dark:bg-[#1A232F] p-6 shadow-xl max-w-sm w-full text-gray-800 dark:text-white">
            <h2 className="text-lg font-semibold mb-2">
              {showSignConfirm ? "Make a deal with investor?" : "Buyout investor’s share?"}
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
                  Advantage:{" "}
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
                    signInvestment(selectedInvestor);
                  } else {
                    buyoutInvestment(selectedInvestor);
                  }
                  setShowBuyoutConfirm(false);
                  setShowSignConfirm(false);
                  setSelectedInvestor(null);
                }}
                className="px-4 py-2 rounded bg-green-500 text-white"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvestorsModal;
