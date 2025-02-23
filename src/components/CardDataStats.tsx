"use client";

import React, { useEffect, useState } from "react";
import { Users, CheckSquare } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { toast, ToastContainer, Bounce } from "react-toastify";

interface FilterButtonProps {
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}

interface TaskCardProps {
  name: string;
  turnsRequired: number;
  metricsImpact: {
    conversionFirstPurchase: number;
    averageOrderValue: number;
    userAcquisition: number;
    buyerCount: number;
    costOfGoodsSold: number;
    averagePaymentCount: number;
    customerLifetimeValue: number;
    averageRevenuePerUser: number;
    costPerAcquisition: number;
    contributionMargin: number;
  };
  requiredTeamMembers: {
    ceo: number;
    developer: number;
    sales: number;
  };
  requiredTeam: string[];
  isSelected: boolean;
  onToggle: () => void;
}

interface CancelTaskModalProps {
  isOpen: boolean;
  taskName: string;
  turns: { current: number; total: number };
  metrics: { name: string; value: number }[];
  onConfirm: () => void;
  onCancel: () => void;
}

const CancelTaskModal: React.FC<CancelTaskModalProps> = ({
  isOpen,
  taskName,
  turns,
  metrics,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Cancel task?</h2>
        
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-base font-medium text-gray-900">{taskName}</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Turns required</span>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-900">{turns.current}</span>
                <span className="text-sm text-gray-500">/{turns.total}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Effect on Metrics</span>
              <div className="flex items-center gap-2">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <span className="text-sm text-gray-900">{metric.name}</span>
                    <span className="text-sm text-emerald-600">+{metric.value}</span>
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
            Yes, cancel
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-gray-900 transition-colors hover:bg-gray-50"
          >
            No
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
    className={`flex items-center rounded-full px-4 py-1.5 text-sm transition-colors
      ${
        isActive
          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
          : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-boxdark dark:text-gray-400 dark:hover:bg-gray-800"
      }`}
  >
    <span>{label}</span>
    {count !== undefined && (
      <span className="ml-2 rounded-full bg-white px-2 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        {count}
      </span>
    )}
  </button>
);

const TaskCard: React.FC<TaskCardProps> = ({
  name,
  turnsRequired,
  requiredTeamMembers,
  metricsImpact,
  requiredTeam,
  isSelected,
  onToggle,
}) => {
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
    };
    return metricMap[metricName] || metricName;
  }

  return (
    <div
      className={`w-full cursor-pointer rounded-xl border p-4 shadow-sm transition-all duration-200 hover:shadow-md
        ${
          isSelected
            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
            : "border-stroke bg-white dark:border-strokedark dark:bg-boxdark"
        }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3
            className={`text-md mb-4 truncate font-semibold
            ${isSelected ? "text-green-700 dark:text-green-400" : "text-black dark:text-white"}`}
          >
            {name}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Turns required</span>
              <span>{turnsRequired}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Effect on Metrics
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {
                  Object.entries(metricsImpact)
                    .filter(([, value]) => value !== undefined && value !== 0)
                    .map(([key, value]) => `${getShortName(key)}: +${value}%`)
                    .join(" , ")
                }
              </span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                Required team members
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(requiredTeamMembers).map(([member, count], index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700"
                  >
                    <Users className="h-3 w-3" />
                    <span>{member}</span> <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          {isSelected ? (
            <CheckSquare className="h-6 w-6 text-green-500" />
          ) : (
            <div className="h-6 w-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
          )}
        </div>
      </div>
    </div>
  );
};

const TaskGrid: React.FC = () => {
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(["all"]));
  const { user, setTask } = useUser();
  const [Tasks, setTasks] = useState([]);
  const router = useRouter();

  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean;
    taskIndex: number | null;
    task: any | null;
  }>({
    isOpen: false,
    taskIndex: null,
    task: null,
  });

  useEffect(() => {
    if (!user?.gameId) {
      toast.error("Please login. Game ID not available.");
      router.push("/auth/signup");
      return;
    }

    async function fetchTasks() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ gameId: user?.gameId }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const taskJson = await response.json();
        setTasks(taskJson.tasks);
      } catch (error) {
        console.error("Failed to load tasks. Please try again.", error);
      }
    }

    fetchTasks();
  }, [user, router]);

  const handleTaskToggle = (index: number, task: any) => {
    if (selectedTasks.has(index)) {
      // Show cancel modal when deselecting
      setCancelModal({
        isOpen: true,
        taskIndex: index,
        task: task,
      });
    } else {
      // Directly select the task
      setSelectedTasks(prev => {
        const newSelected = new Set(prev);
        newSelected.add(index);
        return newSelected;
      });
      setTask(task._id);
    }
  };

  const handleCancelConfirm = () => {
    if (cancelModal.taskIndex !== null) {
      setSelectedTasks(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(cancelModal.taskIndex);
        return newSelected;
      });
    }
    setCancelModal({ isOpen: false, taskIndex: null, task: null });
  };

  const handleCancelDismiss = () => {
    setCancelModal({ isOpen: false, taskIndex: null, task: null });
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => {
      const newFilters = new Set(prev);
      if (filter === "all") {
        return new Set(["all"]);
      }
      newFilters.delete("all");
      if (newFilters.has(filter)) {
        newFilters.delete(filter);
        if (newFilters.size === 0) {
          return new Set(["all"]);
        }
      } else {
        newFilters.add(filter);
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
    };
    return metricMap[metricName] || metricName;
  }

  const filteredTasks = Tasks.filter((task: any, index: number) => {
    if (activeFilters.has("all")) return true;
    if (activeFilters.has("in_progress")) return selectedTasks.has(index);
    
    if (task.metricsImpact) {
      return Object.entries(task.metricsImpact).some(([metric, value]) => {
        const shortMetric = getShortName(metric).toUpperCase();
        return activeFilters.has(shortMetric) && value !== 0;
      });
    }
    return false;
  });

  const metrics = ["UA", "C1", "AOV", "COGS", "APC", "CPA"];

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
                  value: value,
                }))
            : []
        }
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelDismiss}
      />
      
      <div className="space-y-4 px-4">
        <div className="flex flex-wrap gap-2">
          <FilterButton
            label="All tasks"
            count={Tasks.length}
            isActive={activeFilters.has("all")}
            onClick={() => toggleFilter("all")}
          />
          <FilterButton
            label="In progress"
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
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Reset filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {filteredTasks.map((task: any, index: number) => (
            <TaskCard
              key={index}
              {...task}
              isSelected={selectedTasks.has(index)}
              onToggle={() => handleTaskToggle(index, task)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default TaskGrid;