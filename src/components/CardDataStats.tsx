"use client";
import React, { useEffect, useState } from "react";
import { Users, CheckSquare } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Bounce, toast, ToastContainer } from "react-toastify";

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
  isCompleted: boolean;
  onToggle: () => void;
}

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
  isCompleted = false,
  onToggle,
}) => {
  console.log("required team for task is: ", requiredTeam)
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
          isCompleted
            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
            : "border-stroke bg-white dark:border-strokedark dark:bg-boxdark"
        }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3
            className={`text-md mb-4 truncate font-semibold
            ${isCompleted ? "text-green-700 dark:text-green-400" : "text-black dark:text-white"}`}
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
                    .filter(([key, value]) => value !== undefined && value !== 0)
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
                {Object.keys(requiredTeamMembers).map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700"
                  >
                    <Users className="h-3 w-3" />
                    <span>{member}</span> <span> {requiredTeamMembers[member]} </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          {isCompleted ? (
            <CheckSquare className="h-6 w-6 text-green-500" />
          ) : (
            <div className="h-6 w-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
          )}
        </div>
      </div>
    </div>
  );
};

const TaskGrid = () => {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(["all"]),
  );
  const {user} = useUser()
  const [Tasks, setTasks] = useState([]);
  // const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(["all"]));
  const [inProgress, setInProgress] = useState<Set<number>>(new Set());
  const {setTask} = useUser()
  const router = useRouter(); 
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
            body: JSON.stringify({ gameId: user?.gameId }), // Pass gameId properly
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
  
        const taskJson = await response.json();
        setTasks(taskJson.tasks);
      } catch (error) {
        console.log("Failed to load tasks. Please try again.", error);
      }
    }
  
    fetchTasks();
  }, [user]);

  const toggleTask = (index: number) => {
    setCompletedTasks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
    if (!completedTasks.includes(index)) {
      setInProgress((prev) => {
        const newProgress = new Set(prev);
        if (newProgress.has(index)) {
          newProgress.delete(index);
        } else {
          newProgress.add(index);
        }
        return newProgress;
      });
    }
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

  const filteredTasks = Tasks.filter((task: any, index: number) => {
    if (activeFilters.has("all")) return true;
    if (activeFilters.has("in_progress")) return inProgress.has(index);
    return activeFilters.has(task.effect.metric);
  });

  const metrics = ["UA", "C1", "AOV", "Cogs", "APC", "CPA", "Bugs"];

  return (
    <>
    {/* <ToastContainer
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
  /> */}
    <div className="space-y-4 px-4">
      <div className="flex flex-wrap gap-2">
        <FilterButton
          label="All tasks"
          count={10}
          isActive={activeFilters.has("all")}
          onClick={() => toggleFilter("all")}
        />
        <FilterButton
          label="In progress"
          count={inProgress.size}
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
            isCompleted={completedTasks.includes(index)}
            onToggle={() => {
              toggleTask(index)
              setTask(task?._id)
            }}
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default TaskGrid;
