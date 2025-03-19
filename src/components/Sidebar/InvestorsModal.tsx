"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface InvestorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvestorsModal: React.FC<InvestorsModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser, setUserState } = useUser();
  const [investmentsArray, setInvestmentsArray] = useState<any[]>([]);
  
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

  const signInvestmentOnClick = async (investmentSigned: any) => {
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
        console.log("res", response);
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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>

      <div className="relative w-full max-w-5xl rounded-xl bg-white p-6 shadow-lg ">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-medium text-gray-800">
              Available Investors
            </h2>
            <span className="text-2xl font-medium text-green-500">
              {user?.availableInvestments.length}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Each round new investors will be available to you. In addition to
            funds, they will provide invaluable knowledge, in exchange for
            shares in your company.
          </p>
        </div>

        {/* Scrollable cards container */}
        <div className="max-w-5xl max-w-fit overflow-x-auto pb-4">
          <div className="flex gap-4">
            {investmentsArray.map((e, index) => (
              <div
                key={index}
                className="min-w-[350px] flex-none rounded-xl border border-gray-200 p-5"
              >
                {/* Investor Name */}
                <h3 className="mb-2 text-xl font-medium text-gray-800">
                  {e.name}
                </h3>
                <p className="mb-3 text-sm italic text-blue-500">{e.quote}</p>

                {/* Investor Description */}
                <p className="mb-6 text-sm text-gray-600">{e.description}</p>

                {/* Investment Details */}
                <div className="space-y-4 border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Investment</span>
                    <span className="text-sm font-medium text-green-600">
                      $ {e.money}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Buyout price</span>
                    <span className="text-sm font-medium text-green-600">
                      $ 200,000
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Investor&apos;s share
                    </span>
                    <span className="text-sm font-medium text-blue-500">
                      {e.share} %
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-sm text-gray-600">
                      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                      Advantages
                    </span>
                    <span className="text-sm text-blue-500">
                      {e.bug_percent_point < 0
                        ? `Decreases bugs by ${e.bug_percent_point} %`
                        : `Increases bugs by ${e.bug_percent_point} %`}
                    </span>
                  </div>
                </div>

                {/* Signed Tag */}
                <div className="mt-4 text-right">
                  {user?.investmentsMade.some(
                    (element) => element.name === e.name,
                  ) ? (
                    <span className="rounded border border-green-600 px-2 py-1 font-semibold text-green-600">
                      SIGNED
                    </span>
                  ) : (
                    <span
                      onClick={() => signInvestmentOnClick(e)}
                      className="cursor-pointer rounded border border-green-600 px-2 py-1 font-semibold text-green-600"
                    >
                      Sign Investment
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorsModal;
