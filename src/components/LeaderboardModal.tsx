"use client";

import React, { useEffect, useState } from "react";
import { X, Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { useSound } from "@/context/SoundContext";

// Interface matching the structure returned by your API
interface LeaderboardEntry {
  _id: string;
  revenueVelocity: number;
  currentRevenue: number;
  turnNumber: number;
  businessName?: string;
  userId: {
    _id: string;
    username: string;
  };
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useUser();
  const { t } = useLanguage();
  const { playSound } = useSound();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      playSound("modalOpen");
    }
  }, [isOpen, playSound]);

  // Handle modal open/close animations
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token"); // Assuming you store token here
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { token }), // Include token if needed by middleware, though route seems public
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data = await response.json();
      setLeaderboardData(data);
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      setError(t("modals.leaderboard.unableToLoad"));
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getInitials = (name: string) => {
    const parts = name?.split(" ").filter(Boolean) || [];
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  // Derived State
  const topPerformer = leaderboardData.length > 0 ? leaderboardData[0] : null;
  
  // Find current user's rank in the fetched list (Top 10)
  const currentUserIndex = user?.username
    ? leaderboardData.findIndex((entry) => entry.userId?.username === user.username)
    : -1;
    
  const currentUserRank = currentUserIndex !== -1 ? currentUserIndex + 1 : null;
  const currentUserEntry = currentUserIndex !== -1 ? leaderboardData[currentUserIndex] : null;

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-[#1B1B1D96] border border-white/10 p-6 shadow-lg backdrop-blur-sm bg-opacity-70 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => {
          playSound("modalClose");
          onClose();
        }}
      />
      <div className={`relative w-full max-w-5xl rounded-2xl sm:rounded-3xl bg-[#1B1B1D96] border border-white/10 p-4 sm:p-6 md:p-8 shadow-lg backdrop-blur-sm bg-opacity-70 shadow-2xl transition-all duration-300 max-h-[90vh] overflow-hidden flex flex-col ${
          isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}>
        
        {/* Header */}
        <div className="mb-4 sm:mb-8 flex items-center justify-between border-b border-gray-200/80 pb-4 sm:pb-6 dark:border-gray-700/80 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent truncate">
              {t("modals.leaderboard.title")}
            </h2>
          </div>
          <button
            onClick={() => {
              playSound("modalClose");
              onClose();
            }}
            className="rounded-xl p-2 sm:p-2.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100 hover:scale-110 flex-shrink-0"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* 3 Summary Boxes */}
        <div className="mb-4 sm:mb-8 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3 flex-shrink-0">
          
          {/* Box 1: Metric Explanation */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/60 p-4">
            <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t("modals.leaderboard.winningMetric")}
                </p>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("modals.leaderboard.revenueVelocity")}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("modals.leaderboard.totalRevenuePerTurns")}
            </p>
          </div>

          {/* Box 2: Top Performer */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              {t("modals.leaderboard.topPerformer")}
            </p>
            {topPerformer ? (
              <>
                <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {topPerformer.userId?.username || t("modals.leaderboard.unknown")}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(topPerformer.revenueVelocity)}
                  </span>
                  <span className="text-xs">{t("modals.leaderboard.perTurn")}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                 {loading ? t("modals.leaderboard.calculating") : t("modals.leaderboard.noDataYet")}
              </p>
            )}
          </div>

          {/* Box 3: Your Rank */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              {t("modals.leaderboard.yourRank")}
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentUserRank ? `#${currentUserRank}` : "—"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentUserEntry
                ? `${formatCurrency(currentUserEntry.revenueVelocity)} ${t("modals.leaderboard.perTurn")}`
                : t("modals.leaderboard.notInTop10")}
            </p>
          </div>
        </div>

        {/* Leaderboard List Content */}
        <div className="flex-1 min-h-0 max-h-[50vh] sm:max-h-[600px] overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
          {loading ? (
             <div className="py-16 text-center text-gray-500">{t("modals.leaderboard.loadingRankings")}</div>
          ) : error ? (
            <div className="py-16 text-center text-red-500">{error}</div>
          ) : leaderboardData.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {t("modals.leaderboard.noRankingsYet")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboardData.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = entry.userId?.username === user?.username;

                return (
                  <div
                    key={entry._id}
                    className={`group grid grid-cols-[auto,1fr,auto] gap-3 sm:gap-5 rounded-xl sm:rounded-2xl border p-3 sm:p-5 transition-all duration-200 ${
                      isCurrentUser
                        ? "border-gray-900 bg-gray-900/5 dark:border-gray-100 dark:bg-gray-100/5"
                        : "border-gray-200 bg-white/90 dark:border-gray-800 dark:bg-gray-900/60"
                    } hover:-translate-y-0.5 hover:shadow-md`}
                  >
                    {/* Rank Column */}
                    <div className="flex w-14 items-center justify-center">
                      {getRankIcon(rank) || (
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full border text-base font-semibold ${
                            isCurrentUser
                              ? "border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                              : "border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {rank}
                        </div>
                      )}
                    </div>

                    {/* User Info Column */}
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                            isCurrentUser
                              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {getInitials(entry.userId?.username || "Unknown")}
                        </div>
                        <div className="flex flex-col">
                            <span
                            className={`text-lg font-bold truncate ${
                                isCurrentUser
                                ? "text-gray-900 dark:text-gray-50"
                                : "text-gray-900 dark:text-white"
                            }`}
                            >
                            {entry.userId?.username || t("modals.leaderboard.unknown")}
                            </span>
                            {/* Optional: Show Business Name if available */}
                            {entry.businessName && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {entry.businessName}
                                </span>
                            )}
                        </div>
                        
                        {isCurrentUser && (
                          <span className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-md">
                            {t("modals.leaderboard.you")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Score Column */}
                    <div className="text-right">
                      <div className="inline-flex flex-col items-end rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 px-3 py-2 sm:px-4 sm:py-2.5 min-w-[90px] sm:min-w-[120px]">
                        <span className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {t("modals.leaderboard.velocity")}
                        </span>
                        <span
                          className={`text-base sm:text-xl font-semibold ${
                            isCurrentUser
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {formatCurrency(entry.revenueVelocity)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                             {t("modals.leaderboard.perTurn")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;