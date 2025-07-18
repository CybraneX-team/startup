"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Info, Edit, X } from "lucide-react";
import dynamic from 'next/dynamic';
import { ApexOptions } from "apexcharts";
import { useUser } from "@/context/UserContext";
import MarketInfoModal from "./MarketInfoModal";
import MentorsModal from "./MentorsModal";
import TeamManagementModal from "./TeamManagementModal";
import InvestorsModal from "./InvestorsModal";
import { roleIcons } from "../roleIcons";
import GameOptionsModal from "./GameOptionsModal";

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
  const { user, setUser, setUserState, setnotificationMessages, notificationMessages, setloader, setHeaderDark, elonStep } = useUser();
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

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

  useEffect(()=>{
    if (elonStep === 3 ) {
      setSidebarOpen(true)
      return 
    }else{
      setSidebarOpen(false)
    }
  }, [elonStep, setSidebarOpen])
  useEffect(() => {
    if (user?.financesBreakdown) {
      const breakdown = user.financesBreakdown as financesBreakdown;
  
      // console.log("breakdown is ", breakdown); // Debugging: Ensure correct structure
  
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
    return (
     null
    );
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
  const renderValue = (value : any) => {
    return Number.isInteger(value) ? value : value.toFixed(1);
  };

  async function resetTheGame(){
    setloader(true)
    
    const makeReq = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/resetGame`,
      {
        method : "POST",
        credentials: "include",
        body: JSON.stringify({
          gameId : user?.gameId
        }),
        headers: {
          "Content-Type": "application/json",
          token: `${localStorage.getItem("userToken")}` // or however you're passing the token
        }
      }
    )
    if (makeReq.ok) {
      const response = await makeReq.json()
      setUser(response)
      setUserState(response)
      setnotificationMessages([...notificationMessages, ...response.message])
      setloader(false)
    }
  }
  
  async function startNewSimulation(){
    try {
      const makeReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-new-game`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          token: `${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          gameId: user?.gameId
        })
      })
  
      if(makeReq.ok){
        const response = await makeReq.json()
        setUser(response)
        setUserState(response);
      }else {
        console.error(
          `Request failed with status ${makeReq.status}: ${makeReq.statusText}`,
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
      
    }
  }
  return (
    <>
      <aside
        className={`fixed left-0  ${elonStep === 3 ? 'z-9999' : 'z-999999'} top-0 lg:z-50 flex h-screen w-[300px]  flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ height: '100dvh' }} 
      >
        {/* Header - With gray background to match app header */}
        <div className="flex items-center  justify-between gap-2 px-6 py-5.5 bg-gray-100 dark:bg-gray-800">
          <Link href="/home" className="flex items-center">
            <Image
              width={24}
              height={24}
              src={"/favicon.ico"}
              alt="Logo"
              priority
            />
            <h1 
            className="mx-2 text-xl font-semibold text-black dark:text-white">
              Unicorn Simulator  
            </h1>
          </Link>
           <div onClick={()=>{setSidebarOpen(false)}} className="lg:hidden text-red-500"> <X /> </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col overflow-y-auto overflow-x-hidden px-6 py-4 custom-scrollbar">

          {/* Business Idea Section */}
          <div className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-black dark:text-white">
              Business Idea
              <span
                 onClick={() =>{ setOptionsModalOpen(true); setHeaderDark(true) }}
                className="ml-20 cursor-pointer text-xl"
              >
                {" "}
                ...{" "}
              </span>
            </h2>

            {/* <h2
              className={`text-sm font-semibold my-2 cursor-pointer text-black dark:text-white ${
                makevisible ? "block" : "hidden"
              }`}
              onClick={resetTheGame}
            >
              {" "}
              reset game{" "}
            </h2> */}
       <p className="relative rounded-lg bg-gray-100 text-gray-800 border  dark:bg-[#1A1F2E] dark:text-gray-300 dark:border-gray-700 bg-opacity-80 px-3 py-2 text-sm leading-relaxed">
          {user.businessDescription
            ? showFullDesc
              ? user.businessDescription
              : `${user.businessDescription.slice(0, 80)}...`
            : "Subscription service that delivers a monthly package of pet care items."}

          {user.businessDescription && user.businessDescription.length > 120 && (
            <button
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="ml-2 text-xs text-blue-600 hover:text-blue-500 underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              {showFullDesc ? "See less" : "See more"}
            </button>
          )}
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
              <span className="text-gray-600 mt-1  dark:text-white">Founder</span>
              <span className="font-medium mx-1 my-1 text-[#6577F3]">{renderValue(breakdown["Founder"])}%</span>
          </div>
          <div className={`flex text-sm ${elonStep ===3 ? `animate-pulse ring-1 dark:ring-blue-600 rounded-lg my-1` : ""}`} 
          onClick={openInvestorsModal} >
          <span className="inline-block h-3 w-3 mx-1 my-2 rounded-full cursor-pointer
           bg-[#A5D6A7] investment-step-1"></span>
            <span className="text-gray-600 mt-1 dark:text-white ">Investors</span>
            <span className="font-medium mx-1 my-1 text-[#A5D6A7]">{renderValue(breakdown.Investors)}%</span> </div>
          <div className={`flex text-sm ${elonStep ===3 ? `animate-pulse ring-1 dark:ring-blue-600 rounded-lg my-1` : ""}`}  
          onClick={openMentorsModal}>
            <span className="inline-block h-3 w-3 mx-1  my-2 rounded-full cursor-pointer
             bg-[#8FD0EF] mentor-step-1"></span>
            <span className="text-gray-600 mt-1 dark:text-white">Mentors</span>
            <span className="font-medium my-1 text-[#8FD0EF]">{renderValue(breakdown.Mentor)}%</span> </div>
              </div>
              
              {/* Donut Chart */}
              <div className="lg:-ml-17 md:-ml-12 -ml-5 relative">
              <ReactApexChart
                  options={options}
                  series={series}
                  type="donut"
                  height={150}
                />
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="text-gray-500 text-sm font-medium dark:text-white">Funds</span>
              <span className="text-sm font-bold text-gray-700 dark:text-white">${user.finances.toLocaleString() || "Not Logged in"}</span>
            </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-white">Revenue</span>
                <span className="text-sm font-medium  tabular-nums text-emerald-500">$ {user.revenue ?
                user.revenue : "$40" }</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-white">Salaries</span>
                <span className="text-sm font-medium  tabular-nums text-red-500">-${user.salaries ?
                user.salaries : "3400" }</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-white">Rent</span>
                <span className="text-sm font-medium  tabular-nums text-red-500">-${user.rent
                  ? user.rent  : "600"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-white">Marketing</span>
                <span className="text-sm font-medium  tabular-nums text-red-500">${user.marketing
                  ? user.marketing : "3600"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-white">Cost of Sales</span>
                <span className="text-sm font-medium  tabular-nums text-red-500">-${user.costOfSales
                  ? user.costOfSales : "44"}</span>
              </div>
            </div>

            {/* Available Market */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-white">Available Market</span>
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
                <div key={item._id} className="flex flex-col items-center">
                  <div className="mb-2 rounded-full bg-gray-100 dark:bg-[#1C2E5B] p-3">
                    {roleIcons[item.roleName.toLowerCase()] || <span>No Icon</span>}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-white">{item.roleName}</span>
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
      {optionsModalOpen && (
      <GameOptionsModal
        isOpen={optionsModalOpen}
        onClose={() => {setOptionsModalOpen(false) ; setHeaderDark(false) }}
        onResetGame={resetTheGame}
        onStartNewGame={
          startNewSimulation
        }
      />
      )}
    </>
  );
};

export default Sidebar;