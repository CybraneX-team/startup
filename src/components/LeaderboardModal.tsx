"use client";

import React, { useEffect, useState } from "react";
import { X, Trophy, Medal, Award } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface LeaderboardUser {
  username: string;
  value: number;
  rank: number;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MetricKey =
  | "userAcquisition"
  | "conversionFirstPurchase"
  | "buyerCount"
  | "averageOrderValue"
  | "costOfGoodsSold"
  | "averagePaymentCount"
  | "customerLifetimeValue"
  | "averageRevenuePerUser"
  | "costPerAcquisition"
  | "contributionMargin";

const metricLabels: Record<MetricKey, string> = {
  userAcquisition: "UA",
  conversionFirstPurchase: "C1",
  buyerCount: "B",
  averageOrderValue: "AOV",
  costOfGoodsSold: "COGS",
  averagePaymentCount: "APC",
  customerLifetimeValue: "CLTV",
  averageRevenuePerUser: "ARPU",
  costPerAcquisition: "CPA",
  contributionMargin: "CM",
};

const metricDisplayNames: Record<MetricKey, string> = {
  userAcquisition: "User Acquisition",
  conversionFirstPurchase: "Conversion Rate",
  buyerCount: "Buyers",
  averageOrderValue: "Average Order Value",
  costOfGoodsSold: "Cost of Goods Sold",
  averagePaymentCount: "Average Payment Count",
  customerLifetimeValue: "Customer Lifetime Value",
  averageRevenuePerUser: "Average Revenue per User",
  costPerAcquisition: "Cost per Acquisition",
  contributionMargin: "Contribution Margin",
};

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useUser();
  const [selectedMetric, setSelectedMetric] =
    useState<MetricKey>("contributionMargin");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);

  // Hardcoded leaderboard data
  const hardcodedLeaderboard: Record<MetricKey, LeaderboardUser[]> = {
    userAcquisition: [
      { username: "AlexTech", value: 1250, rank: 1 },
      { username: "StartupMaster", value: 1180, rank: 2 },
      { username: "InnovationHub", value: 1120, rank: 3 },
      { username: "TechVenture", value: 1050, rank: 4 },
      { username: "BusinessPro", value: 980, rank: 5 },
      { username: "GrowthHacker", value: 920, rank: 6 },
      { username: "ScaleUp", value: 870, rank: 7 },
      { username: "VentureLab", value: 820, rank: 8 },
      { username: "StartupGenius", value: 780, rank: 9 },
      { username: "InnovateNow", value: 750, rank: 10 },
    ],
    conversionFirstPurchase: [
      { username: "ConversionKing", value: 8.5, rank: 1 },
      { username: "SalesMaster", value: 8.2, rank: 2 },
      { username: "RevenuePro", value: 7.9, rank: 3 },
      { username: "GrowthExpert", value: 7.6, rank: 4 },
      { username: "BusinessGuru", value: 7.3, rank: 5 },
      { username: "ScaleMaster", value: 7.0, rank: 6 },
      { username: "TechLeader", value: 6.8, rank: 7 },
      { username: "InnovationPro", value: 6.5, rank: 8 },
      { username: "StartupElite", value: 6.2, rank: 9 },
      { username: "VentureStar", value: 6.0, rank: 10 },
    ],
    buyerCount: [
      { username: "BuyerChamp", value: 125, rank: 1 },
      { username: "CustomerKing", value: 118, rank: 2 },
      { username: "SalesHero", value: 110, rank: 3 },
      { username: "RevenueMaster", value: 105, rank: 4 },
      { username: "GrowthLeader", value: 98, rank: 5 },
      { username: "ScalePro", value: 92, rank: 6 },
      { username: "BusinessElite", value: 87, rank: 7 },
      { username: "TechGuru", value: 82, rank: 8 },
      { username: "InnovationStar", value: 78, rank: 9 },
      { username: "StartupPro", value: 75, rank: 10 },
    ],
    averageOrderValue: [
      { username: "AOVChampion", value: 25.50, rank: 1 },
      { username: "ValueMaster", value: 24.20, rank: 2 },
      { username: "RevenueKing", value: 23.10, rank: 3 },
      { username: "SalesElite", value: 22.40, rank: 4 },
      { username: "GrowthPro", value: 21.80, rank: 5 },
      { username: "ScaleMaster", value: 21.20, rank: 6 },
      { username: "BusinessStar", value: 20.60, rank: 7 },
      { username: "TechLeader", value: 20.10, rank: 8 },
      { username: "InnovationPro", value: 19.70, rank: 9 },
      { username: "StartupElite", value: 19.30, rank: 10 },
    ],
    costOfGoodsSold: [
      { username: "EfficiencyKing", value: 3.2, rank: 1 },
      { username: "CostMaster", value: 3.5, rank: 2 },
      { username: "OptimizerPro", value: 3.8, rank: 3 },
      { username: "LeanStartup", value: 4.1, rank: 4 },
      { username: "SmartOps", value: 4.4, rank: 5 },
      { username: "EfficientBiz", value: 4.7, rank: 6 },
      { username: "CostLeader", value: 5.0, rank: 7 },
      { username: "OptimizeNow", value: 5.3, rank: 8 },
      { username: "LeanMaster", value: 5.6, rank: 9 },
      { username: "EfficiencyPro", value: 5.9, rank: 10 },
    ],
    averagePaymentCount: [
      { username: "RetentionKing", value: 3.25, rank: 1 },
      { username: "LoyaltyMaster", value: 3.15, rank: 2 },
      { username: "RepeatChamp", value: 3.05, rank: 3 },
      { username: "CustomerPro", value: 2.95, rank: 4 },
      { username: "RetentionElite", value: 2.85, rank: 5 },
      { username: "LoyaltyStar", value: 2.75, rank: 6 },
      { username: "RepeatMaster", value: 2.65, rank: 7 },
      { username: "CustomerKing", value: 2.55, rank: 8 },
      { username: "RetentionPro", value: 2.45, rank: 9 },
      { username: "LoyaltyLeader", value: 2.35, rank: 10 },
    ],
    customerLifetimeValue: [
      { username: "CLTVChampion", value: 72.50, rank: 1 },
      { username: "ValueKing", value: 68.30, rank: 2 },
      { username: "LifetimeMaster", value: 64.20, rank: 3 },
      { username: "CustomerElite", value: 60.80, rank: 4 },
      { username: "ValuePro", value: 57.50, rank: 5 },
      { username: "LifetimeStar", value: 54.20, rank: 6 },
      { username: "CustomerLeader", value: 51.80, rank: 7 },
      { username: "ValueMaster", value: 49.50, rank: 8 },
      { username: "LifetimePro", value: 47.20, rank: 9 },
      { username: "CustomerKing", value: 45.10, rank: 10 },
    ],
    averageRevenuePerUser: [
      { username: "ARPUChamp", value: 2.85, rank: 1 },
      { username: "RevenueKing", value: 2.65, rank: 2 },
      { username: "ValueMaster", value: 2.45, rank: 3 },
      { username: "RevenueElite", value: 2.30, rank: 4 },
      { username: "ARPUPro", value: 2.15, rank: 5 },
      { username: "RevenueStar", value: 2.00, rank: 6 },
      { username: "ValueLeader", value: 1.85, rank: 7 },
      { username: "ARPUKing", value: 1.70, rank: 8 },
      { username: "RevenuePro", value: 1.55, rank: 9 },
      { username: "ValueElite", value: 1.40, rank: 10 },
    ],
    costPerAcquisition: [
      { username: "EfficientAcq", value: 0.15, rank: 1 },
      { username: "CostOptimizer", value: 0.18, rank: 2 },
      { username: "SmartMarketer", value: 0.21, rank: 3 },
      { username: "LeanGrowth", value: 0.24, rank: 4 },
      { username: "EfficientPro", value: 0.27, rank: 5 },
      { username: "CostMaster", value: 0.30, rank: 6 },
      { username: "SmartAcq", value: 0.33, rank: 7 },
      { username: "LeanPro", value: 0.36, rank: 8 },
      { username: "EfficientKing", value: 0.39, rank: 9 },
      { username: "CostLeader", value: 0.42, rank: 10 },
    ],
    contributionMargin: [
      { username: "ProfitKing", value: 125000, rank: 1 },
      { username: "MarginMaster", value: 115000, rank: 2 },
      { username: "RevenueChamp", value: 105000, rank: 3 },
      { username: "ProfitElite", value: 95000, rank: 4 },
      { username: "MarginPro", value: 85000, rank: 5 },
      { username: "RevenueStar", value: 75000, rank: 6 },
      { username: "ProfitLeader", value: 65000, rank: 7 },
      { username: "MarginKing", value: 55000, rank: 8 },
      { username: "RevenuePro", value: 45000, rank: 9 },
      { username: "ProfitElite", value: 35000, rank: 10 },
    ],
  };

  useEffect(() => {
    if (isOpen) {
      // Add current user to leaderboard if not already present
      const data = [...hardcodedLeaderboard[selectedMetric]];
      
      // If current user exists, replace a random entry or add them
      if (user?.username) {
        const userMetricValue = user.metrics?.[selectedMetric] || 0;
        const userEntry: LeaderboardUser = {
          username: user.username,
          value: userMetricValue,
          rank: 0, // Will be recalculated
        };

        // Check if user is already in the list
        const existingIndex = data.findIndex(
          (entry) => entry.username === user.username
        );

        if (existingIndex >= 0) {
          data[existingIndex] = userEntry;
        } else {
          data.push(userEntry);
        }

        // Re-sort based on metric
        data.sort((a, b) => {
          if (selectedMetric === "costOfGoodsSold" || selectedMetric === "costPerAcquisition") {
            return a.value - b.value; // Lower is better for cost metrics
          }
          return b.value - a.value; // Higher is better for others
        });

        // Take top 10 and update ranks
        const top10 = data.slice(0, 10).map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));

        setLeaderboardData(top10);
      } else {
        setLeaderboardData(hardcodedLeaderboard[selectedMetric]);
      }
    }
  }, [isOpen, selectedMetric, user]);

  const formatValue = (value: number, metric: MetricKey): string => {
    if (metric === "conversionFirstPurchase") {
      return `${value.toFixed(2)}%`;
    }
    if (metric === "averagePaymentCount" || metric === "costPerAcquisition") {
      return value.toFixed(2);
    }
    if (metric === "averageOrderValue" || metric === "averageRevenuePerUser" || metric === "customerLifetimeValue") {
      return `$${value.toFixed(2)}`;
    }
    if (metric === "costOfGoodsSold") {
      return value.toFixed(1);
    }
    return Math.floor(value).toString();
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) {
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    }
    if (rank === 2) {
      return <Medal className="w-5 h-5 text-gray-400" />;
    }
    if (rank === 3) {
      return <Award className="w-5 h-5 text-amber-600" />;
    }
    return null;
  };

  const getInitials = (name: string) => {
    const parts = name?.split(" ").filter(Boolean) || [];
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  const topPerformer = leaderboardData[0];
  const currentUserEntry = user?.username
    ? leaderboardData.find((entry) => entry.username === user.username)
    : null;
  const isCostMetric =
    selectedMetric === "costOfGoodsSold" || selectedMetric === "costPerAcquisition";
  const metricLabel = metricDisplayNames[selectedMetric];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl rounded-3xl bg-white/95 backdrop-blur-xl p-8 shadow-2xl dark:bg-boxdark/95 border border-gray-200/50 dark:border-gray-700/50">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-200/80 pb-6 dark:border-gray-700/80">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Leaderboard
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100 hover:scale-110"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Metric Tabs */}
        <div className="mb-6 flex flex-wrap gap-2.5">
          {Object.entries(metricLabels).map(([key, label]) => {
            const metricKey = key as MetricKey;
            const isActive = selectedMetric === metricKey;
            return (
              <button
                key={key}
                onClick={() => setSelectedMetric(metricKey)}
                className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gray-900 text-white border-gray-900 shadow-sm dark:bg-gray-100 dark:text-gray-900"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Metric Summary */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              Metric
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {metricLabel}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isCostMetric ? "Lower value ranks higher" : "Higher value ranks higher"}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              Top performer
            </p>
            {topPerformer ? (
              <>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {topPerformer.username}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatValue(topPerformer.value, selectedMetric)}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No data</p>
            )}
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              Your rank
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentUserEntry ? `#${currentUserEntry.rank}` : "—"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentUserEntry
                ? formatValue(currentUserEntry.value, selectedMetric)
                : "Play more turns to join the leaderboard"}
            </p>
          </div>
        </div>

        {/* Leaderboard Content */}
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
          {leaderboardData.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No leaderboard data available
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboardData.map((entry, index) => {
                const isCurrentUser = entry.username === user?.username;
                return (
                  <div
                    key={index}
                    className={`group grid grid-cols-[auto,1fr,auto] gap-5 rounded-2xl border p-5 transition-all duration-200 ${
                      isCurrentUser
                        ? "border-gray-900 bg-gray-900/5 dark:border-gray-100 dark:bg-gray-100/5"
                        : "border-gray-200 bg-white/90 dark:border-gray-800 dark:bg-gray-900/60"
                    } hover:-translate-y-0.5 hover:shadow-md`}
                  >
                    {/* Rank */}
                    <div className="flex w-14 items-center justify-center">
                      {getRankIcon(entry.rank) || (
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full border text-base font-semibold ${
                            isCurrentUser
                              ? "border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                              : "border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {entry.rank}
                        </div>
                      )}
                    </div>

                    {/* Username */}
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                            isCurrentUser
                              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {getInitials(entry.username)}
                        </div>
                        <span
                          className={`text-lg font-bold truncate ${
                            isCurrentUser
                              ? "text-gray-900 dark:text-gray-50"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {entry.username}
                        </span>
                        {isCurrentUser && (
                          <span className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-md">
                            You
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Value */}
                    <div className="text-right">
                      <div className="inline-flex flex-col items-end rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 px-4 py-2.5">
                        <span className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Score
                        </span>
                        <span
                          className={`text-xl font-semibold ${
                            isCurrentUser ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {formatValue(entry.value, selectedMetric)}
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

