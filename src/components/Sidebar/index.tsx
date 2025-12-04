"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Info, Edit, X, ChevronLeft, ChevronRight, DollarSign, Users, Lightbulb, TrendingUp, Building2 } from "lucide-react";
import dynamic from 'next/dynamic';
import { ApexOptions } from "apexcharts";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import MarketInfoModal from "./MarketInfoModal";
import MentorsModal from "./MentorsModal";
import TeamManagementModal from "./TeamManagementModal";
import InvestorsModal from "./InvestorsModal";
import { roleIcons } from "../roleIcons";
import GameOptionsModal from "./GameOptionsModal";
import { aiSkinnedEmployees } from "../../context/interface.types";
import { startNewSimulation as startNewSimulationAction } from "@/utils/gameActions";
import { toast } from "react-toastify";


// Dynamically import ReactApexChart to avoid window is not defined errors
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  sidebarCollapsed?: boolean;
  setSidebarCollapsed?: (arg: boolean) => void;
}
interface financesBreakdown {
  Founder: number;
  Investors: number;
  Mentor: number;
}
const Sidebar = ({ sidebarOpen, setSidebarOpen, sidebarCollapsed = false, setSidebarCollapsed }: SidebarProps) => {
  const [makevisible, setmakevisible] = useState(false);
  const [marketModalOpen, setMarketModalOpen] = useState(false);
  const [mentorsModalOpen, setMentorsModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [investorsModalOpen, setInvestorsModalOpen] = useState(false);
  const { user, setUser, setUserState, setnotificationMessages, notificationMessages, setloader, setHeaderDark, elonStep } = useUser();
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  console.log("user?.aiSkinnedEmployees" , user?.aiSkinnedEmployees)
  const { t } = useLanguage();

  const finances = user?.finances || 0;
  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    colors: ["#6577F3", "#A5D6A7", "#8FD0EF"],
    labels: [t("sidebar.founder"), t("sidebar.investors"), t("sidebar.mentors")],
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
  
      setChartData({
        series: [breakdown.Founder, breakdown.Investors, breakdown.Mentor],
        options: {
          chart: { type: "donut" },
          labels: [t("sidebar.founder"), t("sidebar.investors"), t("sidebar.mentors")],
        },
      });
    }
  }, [user, t]);
  

  // Ensure no undefined values before rendering
  if (!user || !chartData) {
    return (
     null
    );
  }
  
  
  const breakdown: financesBreakdown = user?.financesBreakdown ?? { Founder: 0, Investors: 0, Mentor: 0 };
  const series = [breakdown.Founder, breakdown.Investors, breakdown.Mentor];

  
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
          token: `${localStorage.getItem("userToken")}`
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
  
  async function startNewSimulation() {
    const result = await startNewSimulationAction({
      user,
      setUser,
      setUserState,
      setloader,
    });
    
    if (result.insufficientCredits) {
      toast.error("You don't have enough Venture Coins! You need 2000 coins to start a new simulation.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }
  return (
    <>
      <aside
        className={`fixed left-0 ${elonStep === 3 ? 'z-9999' : 'z-999999'} top-0 lg:z-50 flex h-screen flex-col overflow-y-hidden bg-white dark:bg-boxdark border-r border-stroke dark:border-strokedark duration-300 ease-linear lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarCollapsed ? "w-20" : "w-[300px]"}`}
        style={{ height: '100dvh' }} 
      >
        {/* Header */}
        <div className={`flex items-center justify-between gap-2 px-4 py-4 border-b border-stroke dark:border-strokedark ${sidebarCollapsed ? "px-3" : "px-4"}`}>
          {!sidebarCollapsed && (
            <Link href="/home" className="flex items-center gap-2">
              <Image
                width={24}
                height={24}
                src={"/favicon.ico"}
                alt="Logo"
                priority
              />
              <h1 className="text-lg font-bold text-black dark:text-white">
                Unicorn Simulator  
              </h1>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="flex justify-center w-full">
              <Image
                width={32}
                height={32}
                src={"/favicon.ico"}
                alt="Logo"
                priority
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            {setSidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={sidebarCollapsed ? t("sidebar.expandSidebar") : t("sidebar.collapseSidebar")}
              >
                {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                ) : (
                <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            )}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar flex-1 ${sidebarCollapsed ? "px-2 py-4" : "px-4 py-4"}`}>
          {sidebarCollapsed ? (
            /* Collapsed View - Show only icons */
            <div className="flex flex-col items-center gap-3 mt-4">
              <button
                onClick={() => { setOptionsModalOpen(true); setHeaderDark(true); }}
                className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-stroke dark:border-strokedark"
                title={t("sidebar.businessIdea")}
              >
                <Lightbulb className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-stroke dark:border-strokedark" title={t("sidebar.financials")}>
                <DollarSign className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-stroke dark:border-strokedark" title={t("sidebar.team")}>
                <Users className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
            </div>
          ) : (
            <>
          {/* Business Idea Section - Restructured at top */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-black dark:text-white">
                {t("sidebar.businessIdea")}
              </h2>
              <button
                onClick={() => { setOptionsModalOpen(true); setHeaderDark(true); }}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={t("sidebar.gameOptions")}
              >
                <Info className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <div className="rounded-lg bg-gray-50 dark:bg-boxdark-2 border border-stroke dark:border-strokedark p-3">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {user.businessDescription
                  ? showFullDesc
                    ? user.businessDescription
                    : `${user.businessDescription.slice(0, 80)}...`
                  : "Subscription service that delivers a monthly package of pet care items."}

                {user.businessDescription && user.businessDescription.length > 120 && (
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="ml-2 text-xs font-medium text-primary hover:underline"
                  >
                    {showFullDesc ? t("sidebar.seeLess") : t("sidebar.seeMore")}
                  </button>
                )}
              </p>
            </div>
          </div>

          {/* Financials Section - Restructured layout */}
          <div className="mb-5">
            <h2 className="mb-3 text-sm font-semibold text-black dark:text-white">
              {t("sidebar.financials")}
            </h2>

            {/* Funds Chart - New compact layout */}
            <div className="mb-4 rounded-lg bg-gray-50 dark:bg-boxdark-2 border border-stroke dark:border-strokedark p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{t("sidebar.fundDistribution")}</span>
                <span className="text-sm font-bold text-black dark:text-white">${user.finances.toLocaleString() || "0"}</span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Legend */}
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-block h-3 w-3 rounded-full bg-[#6577F3]"></span>
                    <span className="text-gray-800 dark:text-gray-200 flex-1">{t("sidebar.founder")}</span>
                    <span className="font-semibold text-black dark:text-white">{renderValue(breakdown["Founder"])}%</span>
                  </div>
                  <div 
                    className={`flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2 py-1 -mx-2 transition-colors ${elonStep === 3 ? `animate-pulse ring-1 ring-primary rounded` : ""}`} 
                    onClick={openInvestorsModal}
                  >
                    <span className="inline-block h-3 w-3 rounded-full bg-[#A5D6A7] investment-step-1"></span>
                    <span className="text-gray-800 dark:text-gray-200 flex-1">{t("sidebar.investors")}</span>
                    <span className="font-semibold text-black dark:text-white">{renderValue(breakdown.Investors)}%</span>
                  </div>
                  <div 
                    className={`flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2 py-1 -mx-2 transition-colors ${elonStep === 3 ? `animate-pulse ring-1 ring-primary rounded` : ""}`}  
                    onClick={openMentorsModal}
                  >
                    <span className="inline-block h-3 w-3 rounded-full bg-[#8FD0EF] mentor-step-1"></span>
                    <span className="text-gray-800 dark:text-gray-200 flex-1">{t("sidebar.mentors")}</span>
                    <span className="font-semibold text-black dark:text-white">{renderValue(breakdown.Mentor)}%</span>
                  </div>
                </div>
                
                {/* Donut Chart */}
                <div className="relative -ml-18">
                  <ReactApexChart 
                    options={options}
                    series={series}
                    type="donut"
                    height={120}
                    width={120}
                  />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="text-[10px] font-medium text-gray-800 dark:text-gray-200 uppercase">{t("sidebar.funds")}</span>
                    <span className="text-xs font-bold text-black dark:text-white">${user.finances.toLocaleString() || "0"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue & Expenses - Restructured as compact list */}
            <div className="mb-4 space-y-2 rounded-lg bg-gray-50 dark:bg-boxdark-2 border border-stroke dark:border-strokedark p-3">
              <div className="flex justify-between items-center py-1.5 border-b border-stroke dark:border-strokedark">
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{t("sidebar.revenue")}</span>
                <span className="text-sm font-semibold tabular-nums text-meta-3">${user.revenue || 40}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-stroke dark:border-strokedark">
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{t("sidebar.salaries")}</span>
                <span className="text-sm font-semibold tabular-nums text-meta-1">-${user.salaries || 3400}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-stroke dark:border-strokedark">
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{t("sidebar.rent")}</span>
                <span className="text-sm font-semibold tabular-nums text-meta-1">-${user.rent || 600}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-stroke dark:border-strokedark">
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{t("sidebar.marketing")}</span>
                <span className="text-sm font-semibold tabular-nums text-meta-5">${user.marketing || 3600}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{t("sidebar.costOfSales")}</span>
                <span className="text-sm font-semibold tabular-nums text-meta-1">-${user.costOfSales || 44}</span>
              </div>
            </div>

            {/* Available Market - Compact design */}
            <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-boxdark-2 border border-stroke dark:border-strokedark px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={openMarketModal}>
              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{t("sidebar.availableMarket")}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-black dark:text-white">
                  USD 999B
                </span>
                <Info 
                  className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300 cursor-pointer hover:text-primary transition-colors" 
                />
              </div>
            </div>
          </div>

          {/* Team Section - Restructured layout */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-black dark:text-white">
                {t("sidebar.team")}
              </h2>
              <button
                onClick={openTeamModal}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={t("sidebar.editTeam")}
              >
                <Edit className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              
              {user.teamMembers?.map((item, idx) =>{
                  const member = user.aiSkinnedEmployees?.find(
                  e  => e?.actualName?.toLowerCase() === item.roleName.toLowerCase()
                );
               return (
                <div 
                  key={item._id} 
                  className="flex flex-col items-center rounded-lg bg-gray-50 dark:bg-boxdark-2 border border-stroke dark:border-strokedark p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="mb-2 rounded-lg bg-white dark:bg-boxdark p-2">
                    {roleIcons[item.roleName.toLowerCase()] || <span>No Icon</span>}
                  </div>
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200 capitalize mb-0.5">
                    {member?.roleName ? member.roleName :  "" }
                  </span>
                  <span className="text-sm font-bold text-black dark:text-white tabular-nums">{
                  item.quantity
                  }</span>
                </div>
              )}
            )}
            </div>
          </div>
            </>
          )}
        </div>

        {/* Collapse/Expand Button at Bottom */}
        {setSidebarCollapsed && (
          <div className="border-t border-stroke dark:border-strokedark p-3 bg-gray-50 dark:bg-boxdark-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`w-full flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors py-2.5`}
              title={sidebarCollapsed ? t("sidebar.expandSidebar") : t("sidebar.collapseSidebar")}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        )}
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
