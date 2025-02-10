"use client";
import dynamic from "next/dynamic";
import React from "react";
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
  "preSeeds",
  "Seed",
  "A",
  "B",
  "C",
  "D",
  "pre-IPO",
  "IPO",
];

const ECommerce: React.FC = () => {
  return (
    <>
      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5"> */}
      <h3 className="text-sm text-gray-500 dark:text-gray-400">
        Startup Stages
      </h3>
      <div className="my-2 flex gap-3 overflow-x-scroll">
        {stages.map((stage, index) => (
          <div className="flex min-w-[103px] items-center justify-center overflow-x-scroll rounded-xl border border-stroke bg-white p-2 dark:border-strokedark dark:bg-boxdark">
            <span className="text-sm font-medium text-black dark:text-white">
              {stage}
            </span>
          </div>
        ))}
      </div>
      <h3 className="text-sm text-gray-500 dark:text-gray-400">Metrics</h3>
      <div className="my-2 flex gap-3 overflow-x-scroll">
        {metrics.map((metric, index) => (
          <div className="flex min-w-[103px] items-center justify-around overflow-x-scroll rounded-xl border border-stroke bg-white px-2 py-3 dark:border-strokedark dark:bg-boxdark">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {metric.title}
            </span>
            <span className="text-xs font-medium text-[#6577F3] dark:text-secondary">
              {metric.value}
            </span>
          </div>
        ))}
      </div>
      <div className=" mt-4 md:mt-4 2xl:mt-7.5">
        <TaskGrid />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div>
    </>
  );
};

export default ECommerce;
