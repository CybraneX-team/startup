"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Users, CheckSquare } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { toast, ToastContainer, Bounce } from "react-toastify";
// import { FixedSizeList as List } from 'react-window';

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
  isBug?: boolean;
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
  const {HeaderDark, setHeaderDark} = useUser()
  useEffect(() => {
    setHeaderDark(isOpen);
    return () => setHeaderDark(false); // reset on unmount
  }, [isOpen]);
  if (!isOpen) return null;
  
  return (
    <div className={`fixed inset-0 z-50  flex items-center justify-center bg-black bg-opacity-50`}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-[#1A232F] dark:text-white">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Cancel task?
        </h2>

        <div className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h3 className="mb-3 text-base font-medium text-gray-900 dark:text-white">
            {taskName}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Turns required
              </span>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-900 dark:text-white">{turns.current}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">/{turns.total}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Effect on Metrics
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
            Yes, cancel
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1A232F] dark:text-white dark:hover:bg-gray-800"
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
  isBug,
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
  function signTeller (metricName: string) : string {
    const nameOfMetric = getShortName(metricName)
    if(
      nameOfMetric === "UA" || 
      nameOfMetric ==="C1"  || 
      nameOfMetric ==="AOV" || 
      nameOfMetric ==="APC"
    ){
      return "+"
    }else{
      return ""
    }
  }
  function symbolToShow (metricName: string): boolean {
    const nameOfMetric = getShortName(metricName)
    if (nameOfMetric === "C1") {
      return true
    }
    return false
  }
  function showDollarSign(metricName: string) : string {
    const nameOfMetric = getShortName(metricName)
    if (nameOfMetric === "AOV" || nameOfMetric === "COGS" || nameOfMetric === "CPA"){
      return "$"
    }else{
      return ""
    }
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
            {isBug? `🐛 Bug: ${name}` : name}
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
              {metricsImpact &&
                Object.entries(metricsImpact)
                  .filter(([, value]) => value !== undefined && value !== 0)
                  .map(([key, value]) => `${getShortName(key)}: ${signTeller(key)} ${showDollarSign(key)} ${value}
                  ${symbolToShow(key) ? "%" : "" }`)
                  .join(" , ")}
            </span>

            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                Required team members
              </span>
              <div className="flex flex-wrap gap-2">
              {requiredTeamMembers &&
              Object.entries(requiredTeamMembers).map(([member, count], index) =>
                count > 0 ? (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700"
                  >
                    <Users className="h-3 w-3" />
                    <span>{member}</span> <span>{count}</span>
                  </div>
                ) : null
              )}
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
  // const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(["all"]),
  );

  
  const { user, setTask, setUser,notificationMessages ,setnotificationMessages, selectedTaskIds, setSelectedTaskIds } = useUser();

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
      toast.info("You have been logged out");
      router.push("/auth/signup");
      return;
    }
  }, [user, router]);

  const handleTaskToggle = useCallback((task: any) => {
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
          task.isBug ? idObj.bugId === task._id : idObj.taskId === task.taskId
        );
        if (alreadyExists) return prev;
      
        return task.isBug
          ? [...prev, { bugId: task._id }]
          : [...prev, { taskId: task.taskId }];
      });
      
    }
  }, [selectedTasks, setTask, setSelectedTaskIds]);
  
  
  const handleCancelConfirm = () => {
    console.log(cancelModal)
    if (cancelModal.taskId) {
      // Remove from selectedTasks set
      setSelectedTasks((prev) => {
        const newSelected = new Set(prev);
        newSelected.delete(cancelModal.taskId? cancelModal.taskId : "" );
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
      bugPercentage : "bugPercentage"
    };
    return metricMap[metricName] || metricName;
  }

  const filteredTasks = useMemo(() => {
    if (!user?.tasks) return [];
  
    return user.tasks.filter((task: any, index: number) => {
      if (activeFilters.has("all")) return true;
      if (activeFilters.has("in_progress")) return selectedTasks.has(task._id);
      ;
  
      if (task.metricsImpact) {
        return Object.entries(task.metricsImpact).some(([metric, value]) => {
          const shortMetric = getShortName(metric);
          return activeFilters.has(shortMetric) && value !== 0;
        });
      }
      return false;
    });
  }, [user?.tasks, activeFilters, selectedTasks]);
  

  const metrics = ["UA", "C1", "AOV", "COGS", "APC", "CPA", "Bugs"];
  const makeBrainstrom = async (turnAmount: string)=>{
    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("User is not authenticated. Please log in.");
      return;
    }
    const makeReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/brainstrom`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body : JSON.stringify({
        turnAmount,
        gameId : user?.gameId
      })
    })
    if(makeReq.ok){
      const response = await makeReq.json();
      setUser(response);
      setnotificationMessages([...notificationMessages, response.message])
    }
  }
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

      <div className="flex flex-col space-y-4 px-4">
        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <FilterButton
              label="All tasks"
              count={user?.tasks.length}
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
          <button className="flex self-end rounded-lg 
          bg-white px-3 py-2 text-xs font-medium text-black shadow-xl dark:bg-blue-900/50 dark:text-blue-400"
          onClick={()=>{makeBrainstrom("4836")}}
          >
            Brainstrom
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {filteredTasks?.map((task: any, index) => (
            <TaskCard
              key={index}
              {...task}
              isSelected={selectedTasks.has(task._id)}
              onToggle={() => handleTaskToggle(task)}
            />
          ))}

          
        </div>
      </div>
    </>
  );
};

export default TaskGrid;
