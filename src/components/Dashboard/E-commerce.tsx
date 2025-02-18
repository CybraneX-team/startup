"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import TaskGrid from "../CardDataStats";

const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

interface MetricInfo {
  title: string;
  content: string;
}

interface StageInfo {
  title: string;
  content: string;
  roundGoal?: string;
  employees?: string[];
  investors?: string;
  mentors?: string;
}

interface MetricsData {
  [key: string]: MetricInfo;
}

interface StagesData {
  [key: string]: StageInfo;
}

interface Metric {
  title: string;
  value: string;
}

const InfoModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 dark:bg-boxdark">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="text-gray-600 dark:text-gray-300">{content}</div>
      </div>
    </div>
  );
};

const metricsInfo: MetricsData = {
  UA: {
    title: "User acquisition (UA)",
    content:
      'Shows how many users have become familiar with players\' products through marketing and other acquisition channels. Such as social media ads, billboards, sponsored content etc. Includes both paying and non-paying users, hereinafter referred to as "users". When running a website, consider "visitors."',
  },
  C1: {
    title: "Conversion Rate (C1)",
    content:
      "Tracks the percentage of website/app visitors who perform a desired action, such as buying or subscribing. It reveals the effectiveness of converting users into paying customers. A high conversion rate indicates successful persuasion of visitors to make a purchase.",
  },
  // Add other metrics info...
};

const stagesInfo: StagesData = {
  FFF: {
    title: "FFF Stage",
    content: "Friends, Family, and Fools investment stage...",
    roundGoal: "Initial funding from close connections",
    employees: ["Founder", "Co-founder"],
    investors: "No",
    mentors: "No",
  },
  ANGELS: {
    title: "Angels",
    content: "Angel investor funding stage...",
    roundGoal: "Secure angel investment",
    employees: ["CEO", "CTO", "Developer"],
    investors: "Yes",
    mentors: "Yes",
  },
  PRESEEDS: {
    title: "PreSeed",
    content:
      "You proved to early investors that your product has potential. Now you are ready for a public beta release — a massive launch of your product. You collected feedback from the first 100 users, tested hypotheses, built a development cycle, redesigned and performed testing. However, serial investors are still not sure if your product is scaleable. Your goal is to attract 500 users.",
    roundGoal: "Increase the number of users to 500",
    employees: ["CEO", "Developer", "Marketing", "Designer", "QA", "Manager"],
    investors: "Yes",
    mentors: "Yes",
  },
  // Add other stages...
};

interface ModalInfo {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
}

const ECommerce: React.FC = () => {
  const [modalInfo, setModalInfo] = useState<ModalInfo>({
    isOpen: false,
    title: "",
    content: "",
  });
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const handleMetricClick = (metricKey: string) => {
    const info = metricsInfo[metricKey];
    if (info) {
      setSelectedMetric(metricKey);
      setModalInfo({
        isOpen: true,
        title: info.title,
        content: info.content,
      });
    }
  };

  const handleStageClick = (stage: string) => {
    const stageKey = stage.toUpperCase();
    const info = stagesInfo[stageKey];
    if (info) {
      setSelectedStage(stage);
      setModalInfo({
        isOpen: true,
        title: info.title,
        content: (
          <div>
            <h3 className="mb-2 font-medium">Description</h3>
            <p className="mb-4">{info.content}</p>
            {info.roundGoal && (
              <>
                <h3 className="mb-2 font-medium">Round goal</h3>
                <p className="mb-4 text-blue-500">{info.roundGoal}</p>
              </>
            )}
            {info.employees && (
              <>
                <h3 className="mb-2 font-medium">Employees</h3>
                <ul className="mb-4 list-none">
                  {info.employees.map((emp, index) => (
                    <li key={index} className="text-blue-500">
                      {emp}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {info.investors && (
              <>
                <h3 className="mb-2 font-medium">Investors</h3>
                <p className="mb-4 text-green-500">{info.investors}</p>
              </>
            )}
            {info.mentors && (
              <>
                <h3 className="mb-2 font-medium">Mentors</h3>
                <p className="text-green-500">{info.mentors}</p>
              </>
            )}
          </div>
        ),
      });
    }
  };

  const handleModalClose = () => {
    setModalInfo({ isOpen: false, title: "", content: "" });
    setSelectedMetric(null);
    setSelectedStage(null);
  };

  const metrics = [
    { title: "UA", value: "651" },
    { title: "C1", value: "0.6%" },
    { title: "B", value: "3" },
    { title: "AOV", value: "9$" },
    { title: "Cogs", value: "45" },
    { title: "APC", value: "1.2" },
    { title: "CLTV", value: "65" },
    { title: "ARPU", value: "0.03$" },
    { title: "CPA", value: "0.4$" },
    { title: "CM", value: "-236.96$" },
  ];

  const stages = [
    "FFF",
    "Angels",
    "PreSeeds",
    "Seed",
    "A",
    "B",
    "C",
    "D",
    "pre-IPO",
    "IPO",
  ];

  return (
    <div className="relative h-screen">
      <h3 className="text-sm text-gray-500 dark:text-gray-400">
        Startup Stages
      </h3>
      <div className="my-2 flex gap-3 overflow-x-scroll">
        {stages.map((stage, index) => (
          <div
            key={index}
            onClick={() => handleStageClick(stage)}
            className={`flex min-w-[103px] cursor-pointer items-center justify-center overflow-x-scroll rounded-xl border border-stroke bg-white p-2 transition-colors dark:border-strokedark dark:bg-boxdark
              ${selectedStage === stage ? "bg-blue-50 dark:bg-blue-900" : ""}`}
          >
            <span className="text-sm font-medium text-black dark:text-white">
              {stage}
            </span>
          </div>
        ))}
      </div>
      <h3 className="text-sm text-gray-500 dark:text-gray-400">Metrics</h3>
      <div className="my-2 flex gap-3 overflow-x-scroll">
        {metrics.map((metric, index) => (
          <div
            key={index}
            onClick={() => handleMetricClick(metric.title)}
            className={`flex min-w-[103px] cursor-pointer items-center justify-around overflow-x-scroll rounded-xl border border-stroke bg-white px-2 py-3 transition-colors dark:border-strokedark dark:bg-boxdark
              ${selectedMetric === metric.title ? "bg-blue-50 dark:bg-blue-900" : ""}`}
          >
            <span
              className={`text-xs font-medium ${
                selectedMetric === metric.title
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {metric.title}
            </span>
            <span className="text-xs font-medium text-[#6577F3] dark:text-secondary">
              {metric.value}
            </span>
          </div>
        ))}
      </div>
      <InfoModal
        isOpen={modalInfo.isOpen}
        onClose={handleModalClose}
        title={modalInfo.title}
        content={modalInfo.content}
      />
      <div className="mt-4 w-full pb-28 md:mt-4 2xl:mt-7.5">
        <TaskGrid />
      </div>

      <div className="fixed bottom-0 -mx-4 flex w-full items-center justify-between bg-white p-5 dark:bg-boxdark">
        <div className="rounded-xl bg-[#eff4fb9a] p-3 dark:bg-[#1A222C]">
          <h3 className="text-sm text-emerald-600 dark:text-emerald-400">
            Welcome back to the game
          </h3>
          <p className="text-sm">
            Get your first 10 clients and prove that your company is solving
            someone's problem.
          </p>
        </div>

        <button className="w-60 max-w-xl rounded-xl bg-[#4fc387] p-3 md:mr-80">
          <span className="flex text-left font-semibold text-white">
            Make turn <br />
          </span>
          <div className="flex items-center justify-between">
            <span className="ifont-semibold text-white">income</span>
            <h3 className="font-bold text-white">-$4 326</h3>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ECommerce;
