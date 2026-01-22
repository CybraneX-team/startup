"use client";

import React, { useEffect, useState } from "react";
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  DollarSign,
  Users,
  Target,
  Activity
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { UserData, Metrics } from "@/context/interface.types";
import { translateTaskName } from "@/utils/taskTranslator";
import { useSound } from "@/context/SoundContext";

interface TurnProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousState: UserData | null;
  currentState: UserData | null;
  notifications: Array<{ message: string; isPositive: boolean }>;
}

interface MetricChange {
  key: string;
  label: string;
  previous: number;
  current: number;
  change: number;
  changePercent: number;
  icon?: React.ReactNode;
  isCurrency?: boolean;
}

interface FinancialChange {
  label: string;
  previous: number;
  current: number;
  change: number;
  icon?: React.ReactNode;
}

const TurnProgressModal: React.FC<TurnProgressModalProps> = ({
  isOpen,
  onClose,
  previousState,
  currentState,
  notifications,
}) => {
  const { t, language } = useLanguage();
  const { playSound } = useSound();
  const [translatedNotifications, setTranslatedNotifications] = useState<Array<{ message: string; isPositive: boolean }>>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      playSound("modalOpen");
    }
  }, [isOpen, playSound]);

  useEffect(() => {
    if (!isOpen || !notifications.length) {
      setTranslatedNotifications([]);
      return;
    }

    const translateNotifications = async () => {
      setIsTranslating(true);
      try {
        const translated = await Promise.all(
          notifications.map(async (notif) => {
            if (language === 'en') return notif;
            const translatedMsg = await translateTaskName(notif.message, language);
            return { ...notif, message: translatedMsg };
          })
        );
        setTranslatedNotifications(translated);
      } catch (error) {
        console.error("Error translating notifications:", error);
        setTranslatedNotifications(notifications);
      } finally {
        setIsTranslating(false);
      }
    };

    translateNotifications();
  }, [isOpen, notifications, language]);

  if (!isOpen || !previousState || !currentState) return null;

  // Get icon for metric
  const getMetricIcon = (key: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      userAcquisition: <Users className="h-3.5 w-3.5" />,
      conversionFirstPurchase: <Target className="h-3.5 w-3.5" />,
      buyerCount: <Users className="h-3.5 w-3.5" />,
      averageOrderValue: <DollarSign className="h-3.5 w-3.5" />,
      costOfGoodsSold: <DollarSign className="h-3.5 w-3.5" />,
      averagePaymentCount: <Activity className="h-3.5 w-3.5" />,
      customerLifetimeValue: <DollarSign className="h-3.5 w-3.5" />,
      averageRevenuePerUser: <DollarSign className="h-3.5 w-3.5" />,
      costPerAcquisition: <DollarSign className="h-3.5 w-3.5" />,
      contributionMargin: <BarChart3 className="h-3.5 w-3.5" />,
    };
    return iconMap[key] || <BarChart3 className="h-3.5 w-3.5" />;
  };

  // Get icon for financial field
  const getFinancialIcon = (label: string) => {
    if (label.includes("Fund")) return <DollarSign className="h-3.5 w-3.5" />;
    if (label.includes("Revenue")) return <TrendingUp className="h-3.5 w-3.5" />;
    if (label.includes("Salary")) return <Users className="h-3.5 w-3.5" />;
    if (label.includes("Rent")) return <DollarSign className="h-3.5 w-3.5" />;
    if (label.includes("Marketing")) return <Activity className="h-3.5 w-3.5" />;
    if (label.includes("Cost")) return <DollarSign className="h-3.5 w-3.5" />;
    return <DollarSign className="h-3.5 w-3.5" />;
  };

  // Calculate metric changes
  const calculateMetricChanges = (): MetricChange[] => {
    const metricLabels: Record<keyof Metrics, { label: string; isCurrency: boolean }> = {
      userAcquisition: { label: t("metrics.ua"), isCurrency: false },
      conversionFirstPurchase: { label: t("metrics.c1"), isCurrency: false },
      buyerCount: { label: t("metrics.b"), isCurrency: false },
      averageOrderValue: { label: t("metrics.aov"), isCurrency: true },
      costOfGoodsSold: { label: t("metrics.cogs"), isCurrency: true },
      averagePaymentCount: { label: t("metrics.apc"), isCurrency: false },
      customerLifetimeValue: { label: t("metrics.cltv"), isCurrency: true },
      averageRevenuePerUser: { label: t("metrics.arpu"), isCurrency: true },
      costPerAcquisition: { label: t("metrics.cpa"), isCurrency: true },
      contributionMargin: { label: t("metrics.cm"), isCurrency: true },
    };

    const changes: MetricChange[] = [];
    const prevMetrics = previousState.metrics;
    const currMetrics = currentState.metrics;

    (Object.keys(metricLabels) as Array<keyof Metrics>).forEach((key) => {
      const prev = prevMetrics[key] || 0;
      const curr = currMetrics[key] || 0;
      const change = curr - prev;

      if (Math.abs(change) > 0.01) {
        const changePercent = prev !== 0 ? ((change / prev) * 100) : (change > 0 ? 100 : -100);
        const { label, isCurrency } = metricLabels[key];
        changes.push({
          key,
          label,
          previous: prev,
          current: curr,
          change,
          changePercent,
          icon: getMetricIcon(key),
          isCurrency,
        });
      }
    });

    return changes;
  };

  // Calculate financial changes
  const calculateFinancialChanges = (): FinancialChange[] => {
    const changes: FinancialChange[] = [];

    const financialFields: Array<{ key: keyof UserData; label: string }> = [
      { key: "finances", label: t("sidebar.funds") },
      { key: "revenue", label: t("sidebar.revenue") },
      { key: "salaries", label: t("sidebar.salaries") },
      { key: "rent", label: t("sidebar.rent") },
      { key: "marketing", label: t("sidebar.marketing") },
      { key: "costOfSales", label: t("sidebar.costOfSales") },
    ];

    financialFields.forEach(({ key, label }) => {
      const prev = (previousState[key] as number) || 0;
      const curr = (currentState[key] as number) || 0;
      const change = curr - prev;

      if (Math.abs(change) > 0.01) {
        changes.push({ 
          label, 
          previous: prev, 
          current: curr, 
          change,
          icon: getFinancialIcon(label),
        });
      }
    });

    return changes;
  };

  const metricChanges = calculateMetricChanges();
  const financialChanges = calculateFinancialChanges();
  const stageChanged = previousState.startupStage !== currentState.startupStage;
  const turnNumber = currentState.turnNumber || 0;

  const formatNumber = (num: number, isCurrency = false, isPercent = false): string => {
    if (isPercent) {
      return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
    }
    if (isCurrency) {
      return `$${Math.abs(num).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 my-4 bg-[#1B1B1D96] border rounded-3xl border-white/10 p-6 shadow-lg backdrop-blur-md bg-opacity-90 overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <BarChart3 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("modals.turnProgress.title")} #{turnNumber}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {t("modals.turnProgress.subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
            aria-label={t("common.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          {/* Stage Change Alert */}
          {stageChanged && (
            <div className="p-4 rounded-xl bg-[#111113]">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{t("modals.turnProgress.stageUpgraded")}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-xs font-medium">
                      {previousState.startupStage}
                    </span>
                    <ArrowRight className="h-3 w-3" />
                    <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-xs font-medium">
                      {currentState.startupStage}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Metrics Changes */}
          {metricChanges.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("modals.turnProgress.metricsChanges")}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {metricChanges.map((change) => {
                  const isPositive = change.change > 0;
                  return (
                    <div
                      key={change.key}
                      className="p-3 rounded-lg bg-[#111113]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="text-gray-600 dark:text-gray-400">
                            {change.icon}
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {change.label}
                          </span>
                        </div>
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        )}
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>Previous:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {formatNumber(change.previous, change.isCurrency)}
                          </span>
                        </div>
                        <div className="flex items-center justify-center py-0.5">
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Current:</span>
                          <span className="font-bold text-sm text-gray-900 dark:text-white">
                            {formatNumber(change.current, change.isCurrency)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between rounded px-2 py-2 rounded bg-[#1a1a1a]">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Change:
                          </span>
                          <span className={`text-xs font-bold ${
                            isPositive 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {isPositive ? "+" : ""}{formatNumber(change.change, change.isCurrency)}
                            {Math.abs(change.changePercent) > 0.1 && (
                              <span className={`ml-1.5 ${
                                isPositive 
                                  ? "text-green-600 dark:text-green-400" 
                                  : "text-red-600 dark:text-red-400"
                              }`}>
                                ({formatNumber(change.changePercent, false, true)})
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Financial Changes */}
          {financialChanges.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("modals.turnProgress.financialChanges")}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {financialChanges.map((change, index) => {
                  const isPositive = change.change > 0;
                  const isExpense = change.label === t("sidebar.salaries") || 
                                   change.label === t("sidebar.rent") || 
                                   change.label === t("sidebar.marketing") ||
                                   change.label === t("sidebar.costOfSales");
                  const isGood = isExpense ? change.change < 0 : change.change > 0;
                  
                  return (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-[#111113]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="text-gray-600 dark:text-gray-400">
                            {change.icon}
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {change.label}
                          </span>
                        </div>
                        {isGood ? (
                          <TrendingUp className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        )}
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>Previous:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {formatNumber(change.previous, true)}
                          </span>
                        </div>
                        <div className="flex items-center justify-center py-0.5">
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Current:</span>
                          <span className="font-bold text-sm text-gray-900 dark:text-white">
                            {formatNumber(change.current, true)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between px-2 py-2 rounded bg-[#1a1a1a]">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Change:
                          </span>
                          <span className={`text-xs font-bold ${
                            isGood 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {isGood ? "+" : ""}{formatNumber(change.change, true)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notifications */}
          {translatedNotifications.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("modals.turnProgress.activities")}
                </h3>
              </div>
              <div className="space-y-2">
                {isTranslating ? (
                  <div className="p-4 text-center text-gray-600 dark:text-gray-400 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="inline-flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      {t("common.loading")}
                    </div>
                  </div>
                ) : (
                  translatedNotifications.map((notif, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-[#111113] flex items-start gap-3"
                    >
                      {/* <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-800 flex-shrink-0 mt-0.5">
                        {notif.isPositive ? (
                          <CheckCircle2 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        )}
                      </div> */}
                      <p className="text-sm text-gray-900 dark:text-white flex-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* No Changes Message */}
          {metricChanges.length === 0 && financialChanges.length === 0 && translatedNotifications.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex p-3 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {t("modals.turnProgress.noChanges")}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5">
          <button
            onClick={() => {
              playSound("click");
              onClose();
            }}
            className="w-full py-3 px-6 rounded-full text-black bg-gradient-to-b from-[#F5D0FE] via-[#E9D5FF] to-[#DDD6FE] hover:from-[#FCE7F3] hover:via-[#F3E8FF] hover:to-[#E9D5FF] transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-100 font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors border border-gray-300 dark:border-gray-600"
          >
            {t("modals.turnProgress.continue")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurnProgressModal;
