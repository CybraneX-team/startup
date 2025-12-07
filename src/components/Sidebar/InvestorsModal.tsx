"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { translateTaskName } from "@/utils/taskTranslator";

interface InvestorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Component to translate investor card content
const InvestorCard: React.FC<{
  investor: any;
  signed: boolean;
  onSignClick: () => void;
  user: any;
  t: any;
  language: string;
}> = ({ investor, signed, onSignClick, user, t, language }) => {
  const [translatedName, setTranslatedName] = useState(investor.name);
  const [translatedDescription, setTranslatedDescription] = useState(investor.description);
  const [translatedQuote, setTranslatedQuote] = useState(investor.quote || "");
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translateContent = async () => {
      if (language === 'en') {
        setTranslatedName(investor.name);
        setTranslatedDescription(investor.description);
        setTranslatedQuote(investor.quote || "");
        setIsTranslating(false);
        return;
      }

      setIsTranslating(true);
      try {
        const translations = await Promise.all([
          translateTaskName(investor.name, language as any),
          translateTaskName(investor.description, language as any),
          investor.quote ? translateTaskName(investor.quote, language as any) : Promise.resolve(""),
        ]);

        setTranslatedName(translations[0]);
        setTranslatedDescription(translations[1]);
        setTranslatedQuote(translations[2]);
      } catch (error) {
        console.warn('Failed to translate investor content:', error);
        setTranslatedName(investor.name);
        setTranslatedDescription(investor.description);
        setTranslatedQuote(investor.quote || "");
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [investor.name, investor.description, investor.quote, language]);

  const getInitials = (name: string) => {
    const parts = name?.split(" ").filter(Boolean) || [];
    if (parts.length === 0) return "I";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-red-500",
    ];
    const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <div className="w-full sm:w-[320px] flex-shrink-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A232F] p-5">
      <div className="flex items-center gap-4 mb-4">
        <div className={`h-16 w-16 rounded-full ${getAvatarColor(investor.name)} flex items-center justify-center flex-shrink-0`}>
          <span className="text-xl font-semibold text-white">
            {getInitials(investor.name)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
            {isTranslating ? t("common.loading") : translatedName}
          </h3>
          {investor.quote && (
            <p className="text-sm italic text-blue-500 dark:text-blue-400 mt-1 line-clamp-2">
              {isTranslating ? t("common.loading") : translatedQuote}
            </p>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        {isTranslating ? t("common.loading") : translatedDescription}
      </p>

      <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-white">{t("modals.investors.investment")}</span>
          <span className="text-green-600">${investor.money}</span>
        </div>
        {signed && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-white">{t("modals.investors.buyoutPrice")}</span>
            <span className="text-green-600">${investor.buyout}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-white">{t("modals.investors.investorsShare")}</span>
          <span className="text-blue-500">{investor.share}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-white flex items-center">
            <span className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
            {t("modals.investors.advantages")}
          </span>
          <span className="text-blue-500">
            {investor.bug_percent_point < 0
              ? t("modals.investors.decreasesBugs", { count: Math.abs(investor.bug_percent_point) })
              : t("modals.investors.increasesBugs", { count: investor.bug_percent_point })}
          </span>
        </div>
      </div>

      <div className="mt-4 text-right">
        {signed ? (
          <span className="rounded border border-green-600 px-2 py-1 text-sm font-semibold text-green-600">
            {t("modals.investors.signed")}
          </span>
        ) : (
          <button
            onClick={onSignClick}
            className="mt-2 rounded border border-gray-300 px-3 py-1 text-sm hover:border-green-500"
          >
            {t("modals.investors.signInvestment")}
          </button>
        )}
      </div>
    </div>
  );
};

const InvestorsModal: React.FC<InvestorsModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser, setUserState } = useUser();
  const { t, language } = useLanguage();
  const [investmentsArray, setInvestmentsArray] = useState<any[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<any | null>(null);
  const [showSignConfirm, setShowSignConfirm] = useState(false);
  const [showBuyoutConfirm, setShowBuyoutConfirm] = useState(false);
  const [translatedSelectedName, setTranslatedSelectedName] = useState("");

  // Translate selected investor name when it changes
  useEffect(() => {
    const translateSelectedName = async () => {
      if (!selectedInvestor) {
        setTranslatedSelectedName("");
        return;
      }

      if (language === 'en') {
        setTranslatedSelectedName(selectedInvestor.name);
        return;
      }

      try {
        const translated = await translateTaskName(selectedInvestor.name, language as any);
        setTranslatedSelectedName(translated);
      } catch (error) {
        console.warn('Failed to translate selected investor name:', error);
        setTranslatedSelectedName(selectedInvestor.name);
      }
    };

    translateSelectedName();
  }, [selectedInvestor, language]);

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
      <div className="fixed inset-0 z-[99999] flex items-center justify-center">
        {/* Full screen backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal Container */}
        <div className="relative w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-screen-xl max-h-[90vh] bg-white dark:bg-[#1A232F] rounded-xl shadow-lg overflow-y-auto overflow-x-hidden mx-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-[#1A232F] z-40">
            <h2 className="text-2xl font-medium text-gray-800 dark:text-white inline">
              {t("modals.investors.title")}{" "}
            </h2>
            <span className="text-2xl font-medium text-green-500">
              {user?.availableInvestments.length}
            </span>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {t("modals.investors.description")}
            </p>
          </div>

          {/* Cards */}
          <div className="sm:overflow-x-auto overflow-y-auto">
            <div className="flex flex-col sm:flex-row gap-4 p-6  lg:w-80 sm:min-w-full">
              {investmentsArray.map((e, i) => {
                const signed = user?.investmentsMade.some((inv: any) => inv.name === e.name);

                return (
                  <InvestorCard
                    key={i}
                    investor={e}
                    signed={signed}
                    onSignClick={() => {
                      setSelectedInvestor(e);
                      setShowSignConfirm(true);
                    }}
                    user={user}
                    t={t}
                    language={language}
                  />
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
              {showSignConfirm ? t("modals.investors.makeDeal") : t("modals.investors.buyoutShare")}
            </h2>
            <p className="mb-2">{translatedSelectedName || selectedInvestor.name}</p>
            <p className="text-sm">
              {showSignConfirm ? t("modals.investors.investment") : t("modals.investors.share")}:{" "}
              <span className="text-green-600">
                {showSignConfirm
                  ? `$${selectedInvestor.money}`
                  : `${selectedInvestor.share}%`}
              </span>
            </p>
            <p className="text-sm mb-4">
              {showSignConfirm ? (
                <>
                  {t("modals.investors.advantage")}:{" "}
                  <span className="text-blue-500">
                    {selectedInvestor.bug_percent_point < 0
                      ? t("modals.investors.reducesBugs", { count: Math.abs(selectedInvestor.bug_percent_point) })
                      : t("modals.investors.increasesBugs", { count: selectedInvestor.bug_percent_point })}
                  </span>
                </>
              ) : (
                <>
                  {t("modals.investors.buyoutPrice")}:{" "}
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
                {t("modals.investors.noCancel")}
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
                {t("modals.investors.yes")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvestorsModal;
