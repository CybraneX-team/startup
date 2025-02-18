import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Info } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: ["#6577F3", "#A5D6A7", "#8FD0EF"],
    labels: ["Founder", "Investors", "Mentors"],
    legend: {
      show: true,
      position: "left",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 280,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  const series = [90, 10, 0];

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen w-[300px] flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5">
        <Link href="/" className="flex items-center">
          <Image
            width={24}
            height={24}
            src={"/favicon.ico"}
            alt="Logo"
            priority
          />
          <h1 className="mx-2 text-xl font-semibold text-black dark:text-white">
            Startup Simulator
          </h1>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col overflow-y-auto px-6 py-4">
        {/* Business Idea Section */}
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-black dark:text-white">
            Business Idea
          </h2>
          <p className="rounded-lg bg-gray-100 p-3 text-sm text-gray-600">
            Subscription service that delivers a monthly package of pet care
            items
          </p>
        </div>

        {/* Financials Section */}
        <div className="mb-6">
          <h2 className="mb-4 text-base font-medium text-black dark:text-white">
            Financials
          </h2>

          {/* Donut Chart with Static Center Label */}
          <div className="relative mb-4">
            <div id="chartThree" className="mx-auto flex justify-center">
              <ReactApexChart
                options={options}
                series={series}
                type="donut"
                height={200}
              />
              {/* Static center label */}
              <div className="absolute left-2/3 top-1/2 ml-3 -translate-x-1/2 -translate-y-1/2 transform text-center">
                <div className="text-xs font-normal text-gray-600">Funds</div>
                <div className="text-sm font-medium text-gray-900">
                  $100,000
                </div>
              </div>
            </div>
          </div>

          {/* Financial Stats */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Revenue</span>
              <span className="text-sm font-medium text-emerald-500">$49</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Salaries</span>
              <span className="text-sm font-medium text-red-500">-$3,400</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rent</span>
              <span className="text-sm font-medium text-red-500">-$800</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Marketing</span>
              <span className="text-sm font-medium text-red-500">-$280</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cost of Sales</span>
              <span className="text-sm font-medium text-red-500">-$55</span>
            </div>
          </div>

          {/* Available Market */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Available Market</span>
            <div className="flex items-center">
              <span className="text-sm font-medium text-blue-500">
                USD 999B
              </span>
              <Info className="ml-1 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="mb-4 text-sm font-semibold text-black dark:text-white">
            Team
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                role: "CEO",
                icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
              },
              { role: "Dev", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
              {
                role: "Sales",
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
              },
            ].map((item) => (
              <div key={item.role} className="flex flex-col items-center">
                <div className="mb-2 rounded-full bg-gray-100 p-3">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">{item.role}</span>
                <span className="text-sm font-medium">1</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
