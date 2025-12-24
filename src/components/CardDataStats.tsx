"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Users, CheckSquare, Square, ChevronDown, Info, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { translateTaskName, translateTaskNameSync } from "@/utils/taskTranslator";
import { toast, ToastContainer, Bounce } from "react-toastify";
import { Sparkles } from "lucide-react"; // Optional icon
import Sparkle from "react-sparkle"; // ✅ Add this import
import { aiSkinnedEmployees, UserData } from "@/context/interface.types";
import TurnProgressModal from "@/components/TurnProgressModal";

// import { FixedSizeList as List } from 'react-window';

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
  const { setHeaderDark, setloader} = useUser();

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
    <div
      className="fixed inset-0 z-[3001] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-[#1A232F] dark:text-white">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          {t("modals.cancelTask.title")}
        </h2>

        <div className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h3 className="mb-3 text-base font-medium text-gray-900 dark:text-white">
            {translatedTaskName}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t("modals.cancelTask.turns")}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-900 dark:text-white">
                  {turns.current}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  /{turns.total}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t("modals.cancelTask.metrics")}
              </span>
              <div className="flex items-center gap-2">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {metric.name}
                    </span>
                    <span className="text-sm text-emerald-600 dark:text-emerald-400">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className="w-full rounded-lg bg-emerald-500 py-2.5 text-white transition-colors hover:bg-emerald-600"
          >
            {t("modals.cancelTask.confirm")}
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1A232F] dark:text-white dark:hover:bg-gray-800"
          >
            {t("modals.cancelTask.noCancel")}
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
  const { setHeaderDark, setloader, user} = useUser();

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
    <div className="fixed inset-0 z-[3002] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl rounded-[32px] bg-white/95 p-8 shadow-[0_25px_70px_rgba(15,23,42,0.15)] backdrop-blur-md dark:bg-gray-900/90 dark:text-white">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
              {t("modals.taskDetail.title")}
            </p>
            <h2 className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white leading-tight">
              {translatedTaskName}
            </h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {task.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-gray-200/80 p-2 text-gray-500 hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-900/40">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
              {t("modals.taskDetail.turnsRequired")}
            </p>
            <p className="mt-3 text-4xl font-semibold text-gray-900 dark:text-white">
              {task.turnsRequired}
            </p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-900/40">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
              {t("modals.taskDetail.type")}
            </p>
            <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
              {task.isBug ? t("modals.taskDetail.bug") : t("modals.taskDetail.task")}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-gray-100 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-900/40">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400 mb-3">
            {t("modals.taskDetail.effects")}
          </p>
          <div className="flex flex-wrap gap-2">
            {task.metricsImpact  && user?.difficultyMode === "basic" &&
              Object.entries(task.metricsImpact)
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

        <div className="mb-8 rounded-3xl border border-gray-100 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-900/40">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400 mb-3">
            {t("modals.taskDetail.requiredTeam")}
          </p>
          <div className="flex flex-wrap gap-2">
            {task.requiredTeamMembers &&
              Object.entries(task.requiredTeamMembers).map(([member, count]) =>
                count > 0 ? (
                  <div
                    key={member}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-200"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span className="capitalize">{member}</span>
                    <span>{count}</span>
                  </div>
                ) : null,
              )}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={onAdd}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            {t("modals.taskDetail.addToSelection")}
          </button>
          <button
            onClick={onMakeTurn}
            className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
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
    className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all duration-200
      ${
        isActive
          ? "bg-gray-900 text-white dark:bg-gray-700 dark:text-white shadow-sm"
          : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700"
      }`}
  >
    <span>{label}</span>
    {count !== undefined && (
      <span className={`ml-2 rounded px-2 py-0.5 text-xs font-semibold ${
        isActive
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

  // Translate asynchronously when component mounts or language changes
  useEffect(() => {
    if (language !== "en") {
      translateTaskName(name, language).then(setTranslatedName);
    } else {
      setTranslatedName(name);
    }
  }, [name, language]);
return (
  <div
    onClick={onToggle}
    className={`relative w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.09)] dark:border-gray-800 dark:bg-gray-900 ${
      isSelected ? "ring-2 ring-gray-900/50 dark:ring-gray-100/50" : ""
    }`}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex w-fit items-center rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold tracking-[0.3em] text-gray-500 dark:bg-gray-800 dark:text-gray-300">
            {isBug ? "BUG" : "TASK"}
          </span>
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
            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 dark:border-gray-700 dark:text-gray-300"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug">
          {translatedName}
        </h3>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`flex h-6 w-10 items-center justify-center rounded-full transition-all ${
          isSelected
            ? "border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900"
            : "border-gray-300 text-gray-400 hover:border-gray-500 dark:border-gray-700 dark:text-gray-400"
        }`}
      >
        {isSelected ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
      </button>
    </div>

    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
      <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200">
        Turns {turnsRequired}
      </span>
      {metricsImpact && user?.difficultyMode !== "intermediate" && 
        Object.entries(metricsImpact)
          .filter(([, value]) => value !== undefined && value !== 0)
          .map(([key, value], idx) => (
            <span
              key={idx}
              className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-200"
            >
              {getShortName(key)}: {signTeller(key)}
              {showDollarSign(key)}
              {value}
              {symbolToShow(key) ? "%" : ""}
            </span>
          ))}
      {requiredTeamMembers &&
        Object.entries(requiredTeamMembers).map(([member, count], index) =>
          count > 0 ? (
            <span
              key={index}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-200"
            >
              <Users className="h-3.5 w-3.5" />
              <span className="capitalize">{member}</span>
              <span>{count}</span>
            </span>
          ) : null,
        )}
    </div>

    {showDescription && (
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{description}</p>
    )}
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

  useEffect(() => {
    setHeaderDark(isOpen);
    return () => setHeaderDark(false);
  }, [isOpen, setHeaderDark]);

  if (!isOpen) return null;

  const extraTasks = powerBoost ? 5 : 0;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 sm:px-0">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 dark:bg-[#1A232F] dark:text-white">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          {t("dashboard.brainstormSession")}
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
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
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [brainstormModalOpen, setBrainstormModalOpen] = useState(false);
  const [powerBoost, setPowerBoost] = useState(false);
  const [detailModalTask, setDetailModalTask] = useState<TaskData | null>(null);
  const [showTurnProgressModal, setShowTurnProgressModal] = useState(false);
  const [previousUserState, setPreviousUserState] = useState<UserData | null>(null);
  const [turnNotifications, setTurnNotifications] = useState<Array<{ message: string; isPositive: boolean }>>([]);

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
  const { t } = useLanguage();

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

    if (newSelected.has(taskId)) {
      setCancelModal({ isOpen: true, taskId, task });
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
          ? [...prev, { bugId: task._id }]
          : [...prev, { taskId: task.taskId }];
      });
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
            .taskToGenerate
            ? brainstromTaskAmountMap[(user?.startupStage as Stage) || "FFF"]
                .taskToGenerate
            : 15
        }
        onConfirm={async () => {
          await makeBrainstrom(turnAmount);
          setBrainstormModalOpen(false);
        }}
        onCancel={() => setBrainstormModalOpen(false)}
        powerBoost={powerBoost}
        setPowerBoost={setPowerBoost}
      />

    <div className="flex flex-col space-y-4 px-4 pb-40 lg:pb-48">
        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
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
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {t("dashboard.resetFilters")}
            </button>
          </div>
          <button
            className="flex self-end rounded-lg bg-gray-900 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors shadow-sm"
            onClick={() => setBrainstormModalOpen(true)}
          >
            {t("dashboard.brainstorm")}
          </button>
        </div>
        <div className="columns-1 gap-4 space-y-4 sm:columns-2 xl:columns-3 pb-10">
          {user?.tasks.map((task: any, index: number) => (
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
    </>
  );
};

export default TaskGrid;
