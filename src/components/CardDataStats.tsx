"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Users, CheckSquare, Square, ChevronDown, Info, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { useSound } from "@/context/SoundContext";
import { useRouter } from "next/navigation";
import { translateTaskName, translateTaskNameSync } from "@/utils/taskTranslator";
import { toast, ToastContainer, Bounce } from "react-toastify";
import { Sparkles } from "lucide-react"; 
import Sparkle from "react-sparkle"; 
import { aiSkinnedEmployees, UserData } from "@/context/interface.types";
import TurnProgressModal from "@/components/TurnProgressModal";
import BrainstormTutorial from "@/components/BrainstormTutorial";
import Image from "next/image";


interface FilterButtonProps {
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}
type BrainstormStats = {
  turnsRequired: number;
  taskToGenerate: number;
};
type Stage = "FFF" | "Angels" | "pre_seed" | "Seed" | "a" | "b" | "c" | "d";

const brainstromTaskAmountMap: Record<Stage, BrainstormStats> = {
  FFF: { turnsRequired: 1, taskToGenerate: 10 },
  Angels: { turnsRequired: 1, taskToGenerate: 10 },
  pre_seed: { turnsRequired: 1, taskToGenerate: 15 },
  Seed: { turnsRequired: 1, taskToGenerate: 15 },
  a: { turnsRequired: 1, taskToGenerate: 20 },
  b: { turnsRequired: 1, taskToGenerate: 20 },
  c: { turnsRequired: 1, taskToGenerate: 25 },
  d: { turnsRequired: 1, taskToGenerate: 25 },
};
interface TaskData {
  _id: string;
  taskId?: string;
  name: string;
  description: string;
  turnsRequired: number;
  metricsImpact: Record<string, number>;
  requiredTeamMembers: Record<string, number>;
  requiredTeam: string[];
  isBug?: boolean;
}

interface TaskCardProps extends TaskData {
  isSelected: boolean;
  onToggle: () => void;
  onShowDetails?: (task: TaskData) => void;
}

interface CancelTaskModalProps {
  isOpen: boolean;
  taskName: string;
  turns: { current: number; total: number };
  metrics: { name: string; value: number }[];
  onConfirm: () => void;
  onCancel: () => void;
}

interface TaskDetailModalProps {
  isOpen: boolean;
  task: TaskData | null;
  onClose: () => void;
  onAdd: () => void;
  onMakeTurn: () => void;
}

const CancelTaskModal: React.FC<CancelTaskModalProps> = ({
  isOpen,
  taskName,
  turns,
  metrics,
  onConfirm,
  onCancel,
}) => {
  const { language, t } = useLanguage();
  const { setHeaderDark, setloader } = useUser();

  const [translatedTaskName, setTranslatedTaskName] = useState(
    translateTaskNameSync(taskName, language)
  );

  useEffect(() => {
    if (language !== "en") {
      translateTaskName(taskName, language).then(setTranslatedTaskName);
    } else {
      setTranslatedTaskName(taskName);
    }
  }, [taskName, language]);
  useEffect(() => {
    setHeaderDark(isOpen);
    return () => setHeaderDark(false);
  }, [isOpen, setHeaderDark]); // ✅ Include setHeaderDark in deps

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3001] flex items-center justify-center bg-black/50 backdrop-blur-[4px] px-4 sm:px-0">
      <div className="relative w-full max-w-md rounded-2xl bg-[#1B1B1D96] border border-white/10 p-4 sm:p-6 shadow-lg backdrop-blur-md bg-opacity-80 sm:px-6 sm:py-7 shadow-lg border border-[#32343A] text-white">
        {/* Close button */}
        <button
          aria-label="Close"
          className="absolute right-4 top-4 sm:right-6 sm:top-6 text-gray-400 hover:text-white text-lg sm:text-xl"
          onClick={onCancel}
          tabIndex={0}
        >
          ×
        </button>
        {/* Title */}
        <h2 className="mb-4 sm:mb-5 text-lg sm:text-[1.25rem] font-semibold text-white leading-tight">
          {t("modals.cancelTask.title")}
        </h2>
        {/* Task Name */}
        <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold text-white leading-tight">
          {translatedTaskName}
        </h3>
        {/* Divider */}
        <div className="w-full h-[1px] bg-[#23252B] mb-3 sm:mb-4" />
        {/* Info Row */}
        <div className="flex flex-col sm:flex-row items-start justify-between w-full mb-5 sm:mb-7 gap-4 sm:gap-8">
          {/* Metrics */}
          <div className="flex-1 min-w-0">
            <div className="mb-1 text-sm text-gray-400">
              {t("modals.cancelTask.metrics")}
            </div>
            <div className="flex flex-col gap-2">
              {metrics.map((metric, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="font-semibold text-emerald-400 text-base">
                    {metric.name}
                  </span>
                  <span className="font-semibold text-emerald-400 text-base">
                    {metric.value > 0 ? "+" : ""}{metric.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Turns */}
          <div className="flex-1 min-w-0">
            <div className="mb-1 text-sm text-gray-400">
              {t("modals.cancelTask.turns")}
            </div>
            <div className="text-lg font-semibold text-white">
              <span className="text-white">{turns.current}</span>
              <span className="text-white/60">/{turns.total}</span>
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl bg-[#23252B] text-gray-200 font-semibold py-2.5 transition-colors text-sm sm:text-base hover:bg-[#2c2f35]"
          >
            {t("modals.cancelTask.noCancel")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-400 to-green-400 text-white font-bold py-2.5 text-sm sm:text-base transition-colors hover:from-emerald-500 hover:to-green-500 shadow-sm"
          >
            {t("modals.cancelTask.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  task,
  onClose,
  onAdd,
  onMakeTurn,
}) => {
  const { language, t } = useLanguage();
  const [translatedTaskName, setTranslatedTaskName] = useState(
    task ? translateTaskNameSync(task.name, language) : ''
  );
  const { setHeaderDark, setloader, user } = useUser();
  const isIntermediateMode = (user?.difficultyMode || "").toLowerCase() === "intermediate";
  const hasMetricEffects =
    !!task?.metricsImpact &&
    Object.entries(task.metricsImpact).some(([, value]) => value !== undefined && value !== 0);

  useEffect(() => {
    if (task && language !== 'en') {
      translateTaskName(task.name, language).then(setTranslatedTaskName);
    } else if (task) {
      setTranslatedTaskName(task.name);
    }
  }, [task, language]);


  useEffect(() => {
    setHeaderDark(isOpen);
    return () => setHeaderDark(false);
  }, [isOpen, setHeaderDark]);

  if (!isOpen || !task) return null;
  return (
    <div className="fixed inset-0 z-[3002] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 sm:px-0">
      <div className="w-full max-w-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-[0_25px_70px_rgba(15,23,42,0.15)] bg-[#1B1B1D96] shadow-lg backdrop-blur-md bg-opacity-80 max-h-[90vh] overflow-y-auto">
        <div className="mb-4 sm:mb-6 flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
              {t("modals.taskDetail.title")}
            </p>
            <h2 className="mt-1 text-xl sm:text-3xl font-semibold text-gray-900 dark:text-white leading-tight">
              {translatedTaskName}
            </h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {task.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-gray-200/80 p-1.5 sm:p-2 text-gray-500 hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 sm:mb-6 grid gap-3 sm:gap-4 sm:grid-cols-2">
          <div className="rounded-2xl sm:rounded-3xl bg-[#111113] p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
              {t("modals.taskDetail.turnsRequired")}
            </p>
            <p className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-semibold text-gray-900 dark:text-white">
              {task.turnsRequired}
            </p>
          </div>
          <div className="rounded-2xl sm:rounded-3xl bg-[#111113] p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
              {t("modals.taskDetail.type")}
            </p>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {task.isBug ? t("modals.taskDetail.bug") : t("modals.taskDetail.task")}
            </p>
          </div>
        </div>

        {!isIntermediateMode && user?.difficultyMode === "basic" && hasMetricEffects && (
          <div className="mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl bg-[#111113] p-3 sm:p-5">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
              {t("modals.taskDetail.effects")}
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {Object.entries(task.metricsImpact)
                .filter(([, value]) => value !== undefined && value !== 0)
                .map(([key, value]) => (
                  <span
                    key={key}
                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-200"
                  >
                    {getShortName(key)}: {signTeller(key)}
                    {showDollarSign(key)}
                    {value}
                    {symbolToShow(key) ? "%" : ""}
                  </span>
                ))}
            </div>
          </div>
        )}

        <div className="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl bg-[#111113] p-3 sm:p-5 backdrop-blur-sm bg-opacity-70">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
            {t("modals.taskDetail.requiredTeam")}
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {task.requiredTeamMembers &&
              Object.entries(task.requiredTeamMembers).map(([member, count]) =>
                count > 0 ? (
                  <div
                    key={member}
                    className="inline-flex items-center gap-1 rounded-full  bg-[#1a1a1a] px-3 py-1 text-xs font-semibold text-gray-200"
                  >
                    <span className="inline-flex items-center justify-center">
                      {member.toLowerCase() === "developer" ? <DevIcon /> : member.toLowerCase() === "ceo" ? <CeoIcon /> : member.toLowerCase() === "sales" ? <SalesIcon /> : <Users className="h-3.5 w-3.5" />}
                    </span>
                    <span>{count}</span>
                    <span className="capitalize">{member}</span>
                  </div>
                ) : null,
              )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center">
          <button
            onClick={onAdd}
            className="flex-1 rounded-full border border-gray-200 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            {t("modals.taskDetail.addToSelection")}
          </button>
          <button
            onClick={onMakeTurn}
            className="flex-1 rounded-full bg-gradient-to-b from-[#F5D0FE] via-[#E9D5FF] to-[#DDD6FE] hover:from-[#FCE7F3] hover:via-[#F3E8FF] hover:to-[#E9D5FF] transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-100 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {t("modals.taskDetail.makeTurnNow")}
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  count,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium capitalize transition-all duration-200
      ${isActive
        ? "bg-gray-900 text-white dark:bg-gray-700 dark:text-white shadow-sm"
        : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700"
      }`}
  >
    <span>{label}</span>
    {count !== undefined && (
      <span className={`ml-1.5 sm:ml-2 rounded px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold ${isActive
        ? "bg-white/20 text-white"
        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
        }`}>
        {count}
      </span>
    )}
  </button>
);

const metricMap: Record<string, string> = {
  userAcquisition: "UA",
  conversionFirstPurchase: "C1",
  averageOrderValue: "AOV",
  costOfGoodsSold: "COGS",
  averagePaymentCount: "APC",
  customerLifetimeValue: "CLTV",
  averageRevenuePerUser: "ARPU",
  costPerAcquisition: "CPA",
  contributionMargin: "CM",
  buyerCount: "B",
};

const getShortName = (metricName: string): string => {
  return metricMap[metricName] || metricName;
};

const signTeller = (metricName: string): string => {
  const nameOfMetric = getShortName(metricName);
  if (
    nameOfMetric === "UA" ||
    nameOfMetric === "C1" ||
    nameOfMetric === "AOV" ||
    nameOfMetric === "APC"
  ) {
    return "+";
  }
  return "";
};

const symbolToShow = (metricName: string): boolean =>
  getShortName(metricName) === "C1";

const showDollarSign = (metricName: string): string => {
  const nameOfMetric = getShortName(metricName);

  if (nameOfMetric === "AOV" || nameOfMetric === "COGS" || nameOfMetric === "CPA") {
    return "$";
  }
  return "";
};

// Icon components
const TurnsIcon = () => (
  <svg width="25" height="25" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-200">
    <g filter="url(#filter0_d_6553_189)">
      <path d="M16.3288 7.78348C16.8177 8.67877 17.0956 9.70584 17.0956 10.7978C17.0956 14.276 14.276 17.0956 10.7978 17.0956C7.31963 17.0956 4.5 14.276 4.5 10.7978C4.5 7.31963 7.31963 4.5 10.7978 4.5C11.637 4.5 12.4379 4.66415 13.1701 4.9621" stroke="currentColor" strokeLinecap="round" />
    </g>
    <path d="M15.0375 6.54897C15.0116 6.37896 15.1982 6.2577 15.3431 6.35038L17.7291 7.87705C17.871 7.96785 17.844 8.18266 17.684 8.23545L16.6372 8.58087C16.6044 8.5917 16.5749 8.61085 16.5517 8.63645L15.8101 9.45419C15.6969 9.57899 15.4896 9.5165 15.4642 9.34995L15.0375 6.54897Z" fill="currentColor" />
    <defs>
      <filter id="filter0_d_6553_189" x="0" y="0" width="21.5956" height="21.5957" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6553_189" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6553_189" result="shape" />
      </filter>
    </defs>
  </svg>
);

const DevIcon = () => (
  <Image src="/employees/developerIcon.svg" alt="Developer" width={28} height={24} />
);

const CeoIcon = () => (
  <Image src="/employees/ceoIcon.svg" alt="CEO" width={28} height={24} />
);

const SalesIcon = () => (
  <Image src="/employees/salesIcon.svg" alt="Sales" width={28} height={24} />
);

const TaskCard: React.FC<TaskCardProps> = ({
  _id,
  taskId,
  name,
  turnsRequired,
  requiredTeamMembers,
  metricsImpact,
  requiredTeam,
  isBug,
  isSelected,
  description,
  onToggle,
  onShowDetails,
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const { setHeaderDark, setloader, user } = useUser();
  const { language } = useLanguage();
  const [translatedName, setTranslatedName] = useState(translateTaskNameSync(name, language));
  const isIntermediateMode = user?.difficultyMode?.toLowerCase() === "intermediate";

  // Translate asynchronously when component mounts or language changes
  useEffect(() => {
    if (language !== "en") {
      translateTaskName(name, language).then(setTranslatedName);
    } else {
      setTranslatedName(name);
    }
  }, [name, language]);

  // Get icon for team member
  const getTeamMemberIcon = (member: string) => {
    const memberLower = member.toLowerCase();
    if (memberLower === "developer") return <DevIcon />;
    if (memberLower === "ceo") return <CeoIcon />;
    if (memberLower === "sales") return <SalesIcon />;
    return null;
  };

  // Get gradient class for team member
  const getTeamMemberGradient = (member: string) => {
    const memberLower = member.toLowerCase();
    if (memberLower === "developer") return "bg-gradient-to-r from-[#9FFFD9] via-[#BEA6FF] to-[#0088FF]";
    if (memberLower === "CEO") return "bg-gradient-to-r from-[#FFF948] via-[#FFC131] to-[#FFE600]";
    if (memberLower === "sales") return "bg-gradient-to-r from-[#FA9FFF] via-[#FFB7CF] to-[#FF0088]";
    return "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  return (
    <div
      onClick={onToggle}
      className={`relative w-full cursor-pointer overflow-hidden rounded-2xl px-4 py-4 sm:px-5 sm:py-6 transition-all duration-300 ${
        isSelected 
          ? "bg-emerald-50 dark:bg-emerald-900/20 scale-[1.02] shadow-[0_0_10px_rgba(16,185,129,0.3),0_0_60px_rgba(16,185,129,0.15),0_20px_0px_rgba(0,0,0,0.3)]" 
          : "bg-[#151516] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.09)]"
      }`}
    >
      {/* Green sparkle animation when selected - same as Power Boost */}
      {isSelected && (
        <Sparkle
          flickerSpeed="slowest"
          color={"darkgreen"}
          count={15}
          minSize={4}
          maxSize={8}
          overflowPx={0}
          fadeOutSpeed={15}
          flicker={false}
        />
      )}
      
      {/* Content wrapper */}
      <div className="relative z-10">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0 pr-2">

          <h3 className={`text-base sm:text-lg ml-0 sm:ml-5 font-semibold leading-snug transition-colors duration-300 ${
            isSelected ? "text-gray-800 dark:text-gray-200" : "text-gray-200"
          }`}>
            {translatedName}
            {isSelected && (
              <Sparkles className="inline-block h-3 w-3 sm:h-4 sm:w-4 ml-2 text-emerald-500 animate-pulse" />
            )}
          </h3>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border transition-all duration-300 flex-shrink-0 ${
            isSelected
              ? " bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-110 ring-2 ring-emerald-300/50"
              : "text-gray-400 border-none hover:border-gray-500"
          }`}
          style={{ minWidth: "1.75rem", minHeight: "1.75rem" }}
        >
          {isSelected ? <CheckSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Square className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
        </button>
      </div>

      {/* Oval icon buttons section */}
      <div className="mt-3 sm:mt-4 flex flex-wrap justify-between items-start sm:items-center gap-2 sm:gap-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
          {/* Turns button - white outline oval */}
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1 rounded-full bg-[#232223] px-2.5 py-1.5 sm:px-4 sm:py-2 transition-all flex-shrink-0"
          >
            <div className="flex items-center justify-center scale-75 sm:scale-100">
              <TurnsIcon />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-200 whitespace-nowrap">{turnsRequired} Turns</span>
          </button>

          {/* Team member buttons with gradients - oval shaped */}
          {requiredTeamMembers &&
            Object.entries(requiredTeamMembers).map(([member, count], index) =>
              count > 0 ? (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className={`flex items-center justify-center bg-[#232223] gap-1 sm:gap-2 rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2 transition-all hover:opacity-90 shadow-md flex-shrink-0`}
                >
                  <div className="flex items-center justify-center scale-75 sm:scale-100">
                    {getTeamMemberIcon(member)}
                  </div>
                  <span className="ml-0 sm:ml-1 text-xs sm:text-sm font-bold text-gray-300 whitespace-nowrap">
                    {count} &nbsp;
                    {member.toLowerCase() === "ceo"
                      ? member.toUpperCase()
                      : member.charAt(0).toUpperCase() + member.slice(1).toLowerCase()
                    }
                  </span>

                </button>
              ) : null,
            )}

          {/* Metrics impact buttons - dark gray background oval */}
          {metricsImpact && !isIntermediateMode &&
            Object.entries(metricsImpact)
              .filter(([, value]) => value !== undefined && value !== 0)
              .map(([key, value], idx) => {
                const shortName = getShortName(key);
                const displayValue = Math.abs(value);
                const isPositive = value > 0;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-1 sm:gap-2 rounded-full bg-gray-800 dark:bg-gray-800 px-2.5 py-1.5 sm:px-4 sm:py-2.5 transition-all hover:bg-gray-700 dark:hover:bg-gray-700 border border-gray-700 dark:border-gray-700 flex-shrink-0"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-white dark:text-white whitespace-nowrap">
                      {shortName} {isPositive ? "+" : "-"}{displayValue}
                      {symbolToShow(key) ? "%" : ""}
                      {showDollarSign(key) ? "$" : ""}
                    </span>
                  </button>
                );
              })}

        </div>
        <div className="inline-flex items-center gap-2 pr-0 sm:pr-1.5 flex-shrink-0">
          {/* <span className="inline-flex w-fit items-center rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold tracking-[0.3em] text-white">
            {isBug ? "BUG" : "TASK"}
          </span> */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShowDetails?.({
                _id,
                taskId,
                name,
                description,
                turnsRequired,
                requiredTeamMembers,
                metricsImpact,
                requiredTeam,
                isBug,
              });
            }}
            className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-gray-400"
          >
            <Info className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {showDescription && (
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">{description}</p>
      )}
      </div>
    </div>
  );
};
interface BrainstormModalProps {
  isOpen: boolean;
  turnsRequired: number;
  tasksGenerated: number;
  onConfirm: () => void;
  onCancel: () => void;
}

interface BrainstormModalProps {
  isOpen: boolean;
  turnsRequired: number;
  tasksGenerated: number;
  onConfirm: () => void;
  onCancel: () => void;
  powerBoost: boolean;
  setPowerBoost: any;
}

const BrainstormModal = ({
  isOpen,
  turnsRequired,
  tasksGenerated,
  onConfirm,
  onCancel,
  powerBoost,
  setPowerBoost,
}: BrainstormModalProps) => {
  const { setHeaderDark } = useUser();
  const { t } = useLanguage();
  const { playSound } = useSound();

  useEffect(() => {
    setHeaderDark(isOpen);
    if (isOpen) {
      playSound("modalOpen");
    }
    return () => setHeaderDark(false);
  }, [isOpen, setHeaderDark, playSound]);

  if (!isOpen) return null;

  const extraTasks = powerBoost ? 5 : 0;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 sm:px-0">
      <div className="relative bg-[#1B1B1D96] border border-white/10 p-4 sm:p-6 shadow-lg backdrop-blur-sm bg-opacity-70 w-full max-w-md rounded-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {t("dashboard.brainstormSession")}
        </h2>
        <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {t("dashboard.brainstormDescription")}
        </p>

        <div className="mb-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {t("dashboard.turnsRequired")}
            </span>
            <span className="text-gray-900 dark:text-white">
              {turnsRequired}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {t("dashboard.tasksGenerated")}
            </span>
            <span className="text-gray-900 dark:text-white">
              {tasksGenerated + extraTasks}
              {extraTasks > 0 && (
                <span className="ml-1 text-xs text-emerald-400">
                  (+{extraTasks})
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Power Boost Section with Sparkle Animation */}
        <div className="relative mb-6 flex items-center justify-between overflow-hidden rounded-lg bg-emerald-50 px-4 py-3 dark:bg-emerald-900/20">
          {/* Sparkle animation layer */}
          <Sparkle
            flickerSpeed="slowest"
            color={"darkgreen"}
            count={10}
            minSize={5}
            maxSize={10}
            overflowPx={0}
            fadeOutSpeed={15}
            flicker={false}
          />

          <div className="z-10 flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span className="text-gray-700 dark:text-gray-300">
              {t("dashboard.powerBoost")}
            </span>
          </div>

          <label className="relative z-10 inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={powerBoost}
              onChange={() => setPowerBoost(!powerBoost)}
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700"></div>
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onConfirm()}
            className="w-full rounded-lg bg-emerald-500 py-2.5 text-white hover:bg-emerald-600"
          >
            {t("dashboard.startBrainstorming")} {powerBoost ? t("dashboard.withPowerBoost") : ""}
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1A232F] dark:text-white dark:hover:bg-gray-800"
          >
            {t("dashboard.noCancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskGrid: React.FC = () => {
  // const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  // ... inside TaskGrid component ...

  // ✅ ADD THIS: Filter logic to process tasks based on activeFilters



  // ... rest of the component
  // ... rest of the component

  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [brainstormModalOpen, setBrainstormModalOpen] = useState(false);
  const [powerBoost, setPowerBoost] = useState(false);
  const [detailModalTask, setDetailModalTask] = useState<TaskData | null>(null);
  const [showTurnProgressModal, setShowTurnProgressModal] = useState(false);
  const [previousUserState, setPreviousUserState] = useState<UserData | null>(null);
  const [turnNotifications, setTurnNotifications] = useState<Array<{ message: string; isPositive: boolean }>>([]);
  const [showBrainstormTutorial, setShowBrainstormTutorial] = useState(false);
  const brainstormButtonRef = React.useRef<HTMLButtonElement>(null);

  // Close tutorial when brainstorm modal opens
  useEffect(() => {
    if (brainstormModalOpen && showBrainstormTutorial) {
      setShowBrainstormTutorial(false);
    }
  }, [brainstormModalOpen, showBrainstormTutorial]);

  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(["all"]),
  );

  const {
    user,
    setTask,
    setUser,
    notificationMessages,
    setnotificationMessages,
    userLoaded,
    setSelectedTaskIds,
    turnAmount,
    setloader
  } = useUser();
  const isIntermediateMode =
    (user?.difficultyMode || "").toLowerCase() === "intermediate";
  const filteredTasks = useMemo(() => {
    if (!user?.tasks) return [];

    // If "all" is active, return everything immediately
    if (activeFilters.has("all")) {
      return user.tasks;
    }

    return user.tasks.filter((task: any) => {
      // 1. Check "in_progress" filter
      if (activeFilters.has("in_progress")) {
        if (selectedTasks.has(task._id)) return true;
      }

      // 2. Check "bugs" filter (Note: "Bugs" button maps to "bugs" string in toggleFilter)
      if (activeFilters.has("bugs")) {
        if (task.isBug) return true;
      }

      // 3. Check Metric filters (UA, C1, etc.)
      if (task.metricsImpact) {
        // Check if any of the task's metrics match the active filters
        const affectsActiveMetric = Object.entries(task.metricsImpact).some(
          ([key, value]) => {
            const shortName = getShortName(key); // e.g. converts 'userAcquisition' to 'UA'
            return activeFilters.has(shortName) && value !== 0;
          }
        );
        if (affectsActiveMetric) return true;
      }

      return false;
    });
  }, [user?.tasks, activeFilters, selectedTasks]);

  const { t } = useLanguage();
  const { playSound } = useSound();

  // const [Tasks, setTasks] = useState([]);
  const router = useRouter();

  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean;
    taskId: string | null;
    task: any | null;
  }>({
    isOpen: false,
    taskId: null,
    task: null,
  });

  useEffect(() => {
    if (!user?.gameId) {
      router.push("/auth/signup");
      return;
    }
  }, [user, router, userLoaded]);

  useEffect(() => {
    if (!user?.isAiCustomizationDone) {
      router.push("/formQuestion");
      return;
    }
  }, [user, router, userLoaded]);

  // Show tutorial when there are no tasks
  useEffect(() => {
    if (user?.tasks && user.tasks.length === 0 && !showBrainstormTutorial) {
      // Small delay to ensure button is rendered
      const timer = setTimeout(() => {
        setShowBrainstormTutorial(true);
      }, 500);
      return () => clearTimeout(timer);
    } else if (user?.tasks && user.tasks.length > 0 && showBrainstormTutorial) {
      // Hide tutorial if tasks become available
      setShowBrainstormTutorial(false);
    }
  }, [user?.tasks, showBrainstormTutorial]);
  // inside TaskGrid component, after other useEffects that depend on `user`
  useEffect(() => {
    if (!user?.tasks) return;

    // Build sets for quick existence checks:
    const existingObjectIdSet = new Set(user.tasks.map((t: any) => t._id)); // _id (bugs + tasks)
    const existingTaskIdSet = new Set(
      user.tasks
        .filter((t: any) => !t.isBug && t.taskId)
        .map((t: any) => t.taskId)
    );

    // Clean selectedTasks (a Set of task._id)
    setSelectedTasks((prev) => {
      const newSet = new Set<string>();
      for (const id of Array.from(prev)) {
        if (existingObjectIdSet.has(id)) newSet.add(id);
      }
      return newSet;
    });

    // Clean selectedTaskIds (array of { taskId } or { bugId })
    setSelectedTaskIds((prevArr: any[]) => {
      return prevArr.filter((idObj) => {
        if (idObj.bugId) {
          return existingObjectIdSet.has(idObj.bugId);
        }
        if (idObj.taskId) {
          return existingTaskIdSet.has(idObj.taskId);
        }
        return false;
      });
    });
  }, [user?.tasks, setSelectedTaskIds]);

  const handleTaskToggle = (task: any) => {
    const newSelected = new Set(selectedTasks);
    const taskId = task._id;
    const isSelected = newSelected.has(taskId);

    if (isSelected) {
      setCancelModal({ isOpen: true, taskId, task });
      try {
        playSound("taskDeselect");
      } catch (e) {
        // Silently fail if sound fails
      }
    } else {
      newSelected.add(taskId);
      setSelectedTasks(newSelected);
      setTask(taskId);
      setSelectedTaskIds((prev) => {
        const alreadyExists = prev.some((idObj) =>
          task.isBug ? idObj.bugId === task._id : idObj.taskId === task.taskId,
        );
        if (alreadyExists) return prev;

        return task.isBug
          ? [...prev, { bugId: task._id, isBug: true }]
          : [...prev, { taskId: task.taskId, isBug: false }];

      });
      try {
        playSound("taskSelect");
      } catch (e) {
        // Silently fail if sound fails
      }
    }
  };

  const handleCancelConfirm = () => {
    if (cancelModal.taskId) {
      // Remove from selectedTasks set
      setSelectedTasks((prev) => {
        const newSelected = new Set(prev);
        newSelected.delete(cancelModal.taskId ? cancelModal.taskId : "");
        return newSelected;
      });

      // Remove from selectedTaskIds array
      setSelectedTaskIds((prev) => {
        if (!cancelModal.task) return prev;

        return prev.filter((idObj) => {
          if (cancelModal.task.isBug) {
            return idObj.bugId !== cancelModal.task._id;
          } else {
            return idObj.taskId !== cancelModal.task.taskId;
          }
        });
      });
    }

    // Close modal
    setCancelModal({ isOpen: false, taskId: null, task: null });
  };

  const handleCancelDismiss = () => {
    setCancelModal({ isOpen: false, taskId: null, task: null });
  };

  const handleShowDetails = (task: TaskData) => {
    setDetailModalTask(task);
  };

  const handleAddFromDetails = () => {
    if (!detailModalTask) return;

    if (selectedTasks.has(detailModalTask._id)) {
      toast.info("Task already selected");
    } else {
      handleTaskToggle(detailModalTask);
      toast.success("Task added to selection");
    }

    setDetailModalTask(null);
  };

  const handleImmediateTurn = async (task: TaskData) => {
    if (!user) {
      toast.error("User not found");
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please sign in to make a turn");
      return;
    }

    // Store previous state before making the turn
    const previousState = user ? { ...user } : null;

    setloader(true);
    try {
      const bugIds = task.isBug ? [task._id] : [];
      const taskIds = !task.isBug && task.taskId ? [task.taskId] : [];

      const requestBody = {
        gameId: user.gameId,
        employees: user.teamMembers,
        turnAmount,
        bugIds,
        taskIds,
        preventBug: user.preventBug,
      };

      // Construct API URL - handle both cases where NEXT_PUBLIC_API_URL includes /api or not
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, ''); // Remove trailing slash
      const apiUrl = baseUrl?.endsWith('/api') ? `${baseUrl}/turn` : `${baseUrl}/api/turn`;
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        const updatedNotifications = [...notificationMessages, ...(data.message || [])];
        setnotificationMessages(updatedNotifications);
        // Persist notifications
        if (typeof window !== 'undefined') {
          localStorage.setItem('gameNotifications', JSON.stringify(updatedNotifications));
        }
        setDetailModalTask(null);

        // Show turn progress modal
        if (previousState) {
          setPreviousUserState(previousState);
          setTurnNotifications(data.message || []);
          setShowTurnProgressModal(true);
        }

        // Show toast notification for the last notification
        if (data.message && data.message.length > 0) {
          const lastNotification = data.message[data.message.length - 1];
          if (lastNotification.isPositive) {
            toast.success(lastNotification.message, {
              position: "top-right",
              autoClose: 4000,
            });
          } else {
            toast.error(lastNotification.message, {
              position: "top-right",
              autoClose: 4000,
            });
          }
        } else {
          toast.success("Turn completed", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } else {
        toast.error(data.message || "Unable to make turn");
      }
    } catch (error) {
      toast.error("Something went wrong while making the turn");
    } finally {
      setloader(false);
    }
  };

  const toggleFilter = (filter: string) => {
    const mappedFilter = filter === "Bugs" ? "bugs" : filter;

    setActiveFilters((prev) => {
      const newFilters = new Set(prev);

      if (mappedFilter === "all") {
        return new Set(["all"]);
      }

      newFilters.delete("all");

      if (newFilters.has(mappedFilter)) {
        newFilters.delete(mappedFilter);

        if (newFilters.size === 0) {
          return new Set(["all"]);
        }
      } else {
        newFilters.add(mappedFilter);
      }

      return newFilters;
    });
  };

  function getShortName(metricName: string): string {
    const metricMap: Record<string, string> = {
      userAcquisition: "UA",
      conversionFirstPurchase: "C1",
      averageOrderValue: "AOV",
      costOfGoodsSold: "COGS",
      averagePaymentCount: "APC",
      customerLifetimeValue: "CLTV",
      averageRevenuePerUser: "ARPU",
      costPerAcquisition: "CPA",
      contributionMargin: "CM",
      buyerCount: "B",
      bugPercentage: "bugPercentage",
    };
    return metricMap[metricName] || metricName;
  }



  const metrics = ["UA", "C1", "AOV", "COGS", "APC", "CPA", "bugs"];
  const makeBrainstrom = async (turnAmount: string) => {
    setloader(true);
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        alert("User is not authenticated. Please log in.");
        return;
      }

      const makeReq = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/brainstrom`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            turnAmount: turnAmount,
            gameId: user?.gameId,
            brainstromBoost: powerBoost,
          }),
        }
      );

      if (makeReq.ok) {
        const response = await makeReq.json();
        setUser(response);
        const updatedNotifications = [...notificationMessages, ...response.message];
        setnotificationMessages(updatedNotifications);
        // Play success sound
        playSound("success");
        // Persist notifications
        if (typeof window !== 'undefined') {
          localStorage.setItem('gameNotifications', JSON.stringify(updatedNotifications));
        }
        setPowerBoost(false);
      } else {
        const errorResponse = await makeReq.json();
        console.error("Failed to make brainstrom request:", errorResponse);
        alert(errorResponse.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error in makeBrainstrom:", error);
      alert("An error occurred while making the request.");
    } finally {
      setloader(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <CancelTaskModal
        isOpen={cancelModal.isOpen}
        taskName={cancelModal.task?.name || ""}
        turns={{ current: 0, total: cancelModal.task?.turnsRequired || 0 }}
        metrics={
          cancelModal.task
            ? Object.entries(cancelModal.task.metricsImpact)
              .filter(([, value]) => value !== undefined && value !== 0)
              .map(([key, value]) => ({
                name: getShortName(key),
                value: value as number,
              }))
            : []
        }
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelDismiss}
      />
      <TaskDetailModal
        isOpen={!!detailModalTask}
        task={detailModalTask}
        onClose={() => setDetailModalTask(null)}
        onAdd={handleAddFromDetails}
        onMakeTurn={() => detailModalTask && handleImmediateTurn(detailModalTask)}
      />
      <BrainstormModal
        isOpen={brainstormModalOpen}
        turnsRequired={1}
        tasksGenerated={
          brainstromTaskAmountMap[(user?.startupStage as Stage) || "FFF"]
            ?.taskToGenerate || 15
        }
        onConfirm={async () => {
          playSound("click");
          await makeBrainstrom(turnAmount);
          setBrainstormModalOpen(false);
        }}
        onCancel={() => {
          playSound("modalClose");
          setBrainstormModalOpen(false);
        }}
        powerBoost={powerBoost}
        setPowerBoost={setPowerBoost}
      />

      <div className="flex flex-col">
        <div className="flex flex-wrap justify-between gap-2 mb-3 sm:mb-0">
          {!isIntermediateMode ?
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <FilterButton
                label={t("dashboard.allTasks")}
                count={user?.tasks?.length}
                isActive={activeFilters.has("all")}
                onClick={() => toggleFilter("all")}
              />
              <FilterButton
                label={t("dashboard.inProgress")}
                count={selectedTasks.size}
                isActive={activeFilters.has("in_progress")}
                onClick={() => toggleFilter("in_progress")}
              />
              {metrics.map((metric) => (
                <FilterButton
                  key={metric}
                  label={metric}
                  isActive={activeFilters.has(metric)}
                  onClick={() => toggleFilter(metric)}
                />
              ))}
              <button
                onClick={() => setActiveFilters(new Set(["all"]))}
                className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors px-2 py-1 sm:px-0 sm:py-0"
              >
                {t("dashboard.resetFilters")}
              </button>
            </div> : <></>}
        </div>
        <div className="columns-1 gap-4 space-y-4 sm:columns-2 pb-10">
          {filteredTasks.map((task: any, index: number) => (
            <div key={index} className="mb-4 break-inside-avoid">
              <TaskCard
                {...task}
                isSelected={selectedTasks.has(task._id)}
                onToggle={() => handleTaskToggle(task)}
                onShowDetails={handleShowDetails}
              />
            </div>
          ))}
        </div>

        {/* Brainstorm Button - below task grid */}
        <div className="flex justify-center">
          <button
            ref={brainstormButtonRef}
            className={`rounded-full bg-gradient-to-b from-[#F5D0FE] via-[#E9D5FF] to-[#DDD6FE] hover:from-[#FCE7F3] hover:via-[#F3E8FF] hover:to-[#E9D5FF] transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-100 text-black px-6 py-2.5 text-lg font-medium  ${showBrainstormTutorial
                ? 'ring-2 ring-gray-300 dark:ring-gray-500 ring-offset-2 ring-offset-transparent relative z-[99999]'
                : ''
              }`}
            onClick={(e) => {
              e.stopPropagation();
              playSound("brainstorm");
              // Close tutorial first
              if (showBrainstormTutorial) {
                setShowBrainstormTutorial(false);
              }
              // Then open brainstorm modal
              setBrainstormModalOpen(true);
            }}
          >
            {t("dashboard.brainstorm")}
          </button>
        </div>

      </div>

      {/* Turn Progress Modal */}
      <TurnProgressModal
        isOpen={showTurnProgressModal}
        onClose={() => {
          setShowTurnProgressModal(false);
          setPreviousUserState(null);
          setTurnNotifications([]);
        }}
        previousState={previousUserState}
        currentState={user}
        notifications={turnNotifications}
      />

      {/* Brainstorm Tutorial */}
      <BrainstormTutorial
        isOpen={showBrainstormTutorial}
        onClose={() => {
          setShowBrainstormTutorial(false);
        }}
        brainstormButtonRef={brainstormButtonRef}
      />
    </>
  );
};

export default TaskGrid;
