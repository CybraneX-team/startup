import React, { useState } from "react";
import { Users, CheckCircle } from "lucide-react";

interface TaskCardProps {
  title: string;
  turns: number;
  effect: {
    metric: string;
    value: string;
  };
  requiredTeam: string[];
  isCompleted?: boolean;
  onToggle: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  turns,
  effect,
  requiredTeam,
  isCompleted = false,
  onToggle,
}) => {
  return (
    <div
      className={`cursor-pointer rounded-xl border p-4 shadow-sm transition-all duration-200 hover:shadow-md
        ${
          isCompleted
            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
            : "border-stroke bg-white dark:border-strokedark dark:bg-boxdark"
        }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3
            className={`text-md mb-4 font-semibold 
            ${isCompleted ? "text-green-700 dark:text-green-400" : "text-black dark:text-white"}`}
          >
            {title}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Turns required</span>
              <span>{turns}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Effect on Metrics
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {effect.metric} {effect.value}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Required team members
              </span>
              <div className="flex flex-wrap gap-2">
                {requiredTeam.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700"
                  >
                    <Users className="h-3 w-3" />
                    <span>{member}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="ml-4">
          {isCompleted ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
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

  const tasks = [
    {
      title: "Launch an ad on TikTok",
      turns: 1,
      effect: { metric: "UA", value: "+109" },
      requiredTeam: ["Sales"],
    },
    {
      title: "Launch landing page for an alternate target audience",
      turns: 2,
      effect: { metric: "UA", value: "+102" },
      requiredTeam: ["Sales", "Developer"],
    },
    {
      title: "Promote your site on Instagram",
      turns: 2,
      effect: { metric: "UA", value: "+109" },
      requiredTeam: ["Sales"],
    },
    {
      title: "Set up ads in Google UAC",
      turns: 1,
      effect: { metric: "UA", value: "+113" },
      requiredTeam: ["Sales"],
    },
    {
      title: "Launch an ad on Twitter",
      turns: 3,
      effect: { metric: "UA", value: "+106" },
      requiredTeam: ["Sales", "CEO"],
    },
    {
      title: "SEO your website",
      turns: 3,
      effect: { metric: "UA", value: "+107" },
      requiredTeam: ["Sales", "Developer"],
    },
    {
      title: "Launch a mass media ad campaign",
      turns: 1,
      effect: { metric: "UA", value: "+113" },
      requiredTeam: ["Sales"],
    },
    {
      title: "Implement analytics from user calls",
      turns: 2,
      effect: { metric: "CA", value: "+113" },
      requiredTeam: ["Sales"],
    },
    {
      title: "Add payment method for cryptocurrency",
      turns: 2,
      effect: { metric: "CA", value: "+113" },
      requiredTeam: ["CEO", "Developer"],
    },
    {
      title: "Set up automated email platform",
      turns: 0,
      effect: { metric: "UA", value: "+113" },
      requiredTeam: ["Sales", "Developer"],
    },
  ];

  const toggleTask = (index: number) => {
    setCompletedTasks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="grid max-w-sm grid-cols-1 gap-4 p-4 md:mx-auto md:max-w-6xl md:grid-cols-2 md:gap-6">
      {tasks.map((task, index) => (
        <TaskCard
          key={index}
          {...task}
          isCompleted={completedTasks.includes(index)}
          onToggle={() => toggleTask(index)}
        />
      ))}
    </div>
  );
};

export default TaskGrid;
