"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Info, Edit } from "lucide-react";
import dynamic from 'next/dynamic';
import { ApexOptions } from "apexcharts";
import { useUser } from "@/context/UserContext";
import MarketInfoModal from "./MarketInfoModal";
import MentorsModal from "./MentorsModal";
import TeamManagementModal from "./TeamManagementModal";
import InvestorsModal from "./InvestorsModal";
import { roleIcons } from "../roleIcons";

// Dynamically import ReactApexChart to avoid window is not defined errors
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}
interface financesBreakdown {
  Founder: number;  // Uppercase matches API response
  Investors: number;
  Mentor: number;
}
const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [makevisible, setmakevisible] = useState(false);
  const [marketModalOpen, setMarketModalOpen] = useState(false);
  const [mentorsModalOpen, setMentorsModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [investorsModalOpen, setInvestorsModalOpen] = useState(false);
  const { resetTheGame, user } = useUser();
  const finances = user?.finances || 0;
  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: ["#6577F3", "#A5D6A7", "#8FD0EF"],
    labels: ["Founder", "Investors", "Mentors"],
    legend: {
      show: false,
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
  const [chartData, setChartData] = useState<{ series: number[]; options: ApexOptions } | null>(null);

  
  useEffect(() => {
    if (user?.financesBreakdown) {
      const breakdown = user.financesBreakdown as financesBreakdown;
  
      console.log("breakdown is ", breakdown); // Debugging: Ensure correct structure
  
      setChartData({
        series: [breakdown.Founder, breakdown.Investors, breakdown.Mentor],
        options: {
          chart: { type: "donut" },
          labels: ["Founder", "Investors", "Mentors"],
        },
      });
    }
  }, [user]);
  

  // Ensure no undefined values before rendering
  if (!user || !chartData) {
    return <div className="p-6">Loading...</div>;
  }
  
  const breakdown: financesBreakdown = user?.financesBreakdown ?? { Founder: 0, Investors: 0, Mentor: 0 };
  const series = [breakdown.Founder, breakdown.Investors, breakdown.Mentor];

  
  const makeVisible = () => {
    setmakevisible((prev) => !prev);
  };
  
  const openMarketModal = () => {
    setMarketModalOpen(true);
  };
  
  const closeMarketModal = () => {
    setMarketModalOpen(false);
  };

  const openMentorsModal = () => {
    setMentorsModalOpen(true);
  };
  
  const closeMentorsModal = () => {
    setMentorsModalOpen(false);
  };
  
  const openTeamModal = () => {
    setTeamModalOpen(true);
  };
  
  const closeTeamModal = () => {
    setTeamModalOpen(false);
  };
  
  const openInvestorsModal = () => {
    setInvestorsModalOpen(true);
  };
  
  const closeInvestorsModal = () => {
    setInvestorsModalOpen(false);
  };
  
  return (
    <>
      <aside
        className={`fixed left-0  top-0 z-50 flex h-screen w-[300px]  flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header - With gray background to match app header */}
        <div className="flex items-center  justify-between gap-2 px-6 py-5.5 bg-gray-100 dark:bg-gray-800">
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
            <h2 className="mb-3 text-sm font-semibold text-black">
              Business Idea
              <span
                onClick={makeVisible}
                className="ml-20 cursor-pointer text-xl"
              >
                {" "}
                ...{" "}
              </span>
            </h2>

            <h2
              className={`text-sm font-semibold cursor-pointer text-black ${
                makevisible ? "block" : "hidden"
              }`}
              onClick={resetTheGame}
            >
              {" "}
              reset game{" "}
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
            <div className="flex items-center">
              {/* Legend Column */}
              <div className=" flex flex-col">
             <div className="flex  text-sm">
              <span className="inline-block h-3 w-3 rounded-full cursor-pointer
               my-2 mx-1 bg-[#6577F3]"></span>
              <span className="text-gray-600 mt-1">Founder</span>
              <span className="font-medium mx-1 my-1 text-[#6577F3]">{breakdown["Founder"]}%</span>
          </div>
          <div className="flex text-sm" onClick={openInvestorsModal} >
          <span className="inline-block h-3 w-3 mx-1 my-2 rounded-full cursor-pointer
           bg-[#A5D6A7]"></span>
            <span className="text-gray-600 mt-1">Investors</span>
            <span className="font-medium mx-1 my-1 text-[#A5D6A7]">{breakdown.Investors}%</span>
          </div>
          <div className="flex  text-sm"  onClick={openMentorsModal}>
            <span className="inline-block h-3 w-3 mx-1  my-2 rounded-full cursor-pointer
             bg-[#8FD0EF]"></span>
            <span className="text-gray-600 mt-1">Mentors</span>
            <span className="font-medium my-1 text-[#8FD0EF]">{breakdown.Mentor}%</span>
          </div>
              </div>
              
              {/* Donut Chart */}
              <div className="-ml-17 relative">
                {/* {user?.finances} */}
                <ReactApexChart
                  options={options}
                  series={series}
                  type="donut"
                  height={150}
                />
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="text-gray-500 text-sm font-medium">Funds</span>
              <span className="text-sm font-bold text-gray-700">${user.finances.toLocaleString()}</span>
            </div>
                {/* <p></p>{user?.finances} */}
              </div>
            </div>

            {/* Financial Stats */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="text-sm font-medium  tabular-nums text-emerald-500">$ {user.revenue ?
                user.revenue : "$40" }</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Salaries</span>
                <span className="text-sm font-medium  tabular-nums text-red-500">-${user.salaries ?
                user.salaries : "3400" }</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rent</span>
                <span className="text-sm font-medium  tabular-nums text-red-500">-${user.rent
                  ? user.rent  : "600"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Marketing</span>
                <span className="text-sm font-medium  tabular-nums text-red-500">-${user.marketing
                  ? user.marketing : "3600"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cost of Sales</span>
                <span className="text-sm font-medium  tabular-nums text-red-500">-${user.costOfSales
                  ? user.costOfSales : "44"}</span>
              </div>
            </div>

            {/* Available Market */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">Available Market</span>
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-500">
                  USD 999B
                </span>
                <Info 
                  className="ml-1 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                  onClick={openMarketModal}
                />
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-black dark:text-white">
                Team
              </h2>
              {/* Edit button for Team */}
              <Edit 
                className="h-4 w-4 cursor-pointer text-blue-500  hover:text-blue-700" 
                onClick={openTeamModal}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {user.teamMembers?.map((item) => (
                <div key={item.role} className="flex flex-col items-center">
                  <div className="mb-2 rounded-full bg-gray-100 p-3">
                    {roleIcons[item.roleName] || <span>No Icon</span>}
                  </div>
                  <span className="text-sm text-gray-600">{item.roleName}</span>
                  <span className="text-sm font-medium">{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Market Info Modal */}
      {marketModalOpen && (
        <MarketInfoModal 
          isOpen={marketModalOpen} 
          onClose={closeMarketModal} 
        />
      )}

      {/* Mentors Modal */}
      {mentorsModalOpen && (
        <MentorsModal
          isOpen={mentorsModalOpen}
          onClose={closeMentorsModal}
        />
      )}

      {/* Team Management Modal */}
      {teamModalOpen && (
        <TeamManagementModal
          isOpen={teamModalOpen}
          onClose={closeTeamModal}
        />
      )}

      {/* Investors Modal */}
      {investorsModalOpen && (
        <InvestorsModal
          isOpen={investorsModalOpen}
          onClose={closeInvestorsModal}
        />
      )}
    </>
  );
};

export default Sidebar;