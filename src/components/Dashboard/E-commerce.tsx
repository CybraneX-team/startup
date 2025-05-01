"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import TaskGrid from "../CardDataStats";
import { InfoIcon, ArrowRight  } from "lucide-react";
import TooltipModal from "@/components/TooltipModal";
import { Bell } from "lucide-react";
import SpotlightModal from "@/components/SpotlightModal";

// import { Dice1, InfoIcon } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "@/components/Dashboard/index.css";
import GameOverModal from "../Sidebar/gameOverModal";
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
interface Task {
  _id: string;
  taskId: string;
  name: string;
  turnsRequired: number;
  turnsMade: number;
  isBug?: boolean; // optional, based on where it's used

  metricsImpact: {
    userAcquisition: number;
    conversionFirstPurchase: number;
    buyerCount: number;
    averageOrderValue: number;
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
    manager: number;
    qa: number;
    designer: number;
  };
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
  const isMetricModal = Object.values(metricsInfo).some(
    (metric) => metric.title === title,
  );

  return (
    <>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>
        <div
          className={`relative w-full ${isMetricModal ? "max-w-sm" : "max-w-3xl"} rounded-2xl bg-white p-6 dark:bg-boxdark`}
        >
          <div className="-m-6 mb-4 flex items-center justify-between rounded-tl-2xl rounded-tr-2xl bg-[#f3f3f3] p-5 dark:bg-transparent">
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
    </>
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
  B: {
    title: "Buyer (B)",
    content:
      'The number of paying customers that the player has acquired through the user acquisition process, referred to as "buyers" or "customers" in the simulator.',
  },
  AOV: {
    title: "Average order volume",
    content:
      "Measures the average value of each transaction made by your business. A higher AOV suggests that customers are spending more per transaction, which can indicate client loyalty or the success of upsell and cross-sell strategies.",
  },
  COGS: {
    title: "Cost of Good Sold (COGS)",
    content:
      "Cost incurred to produce or acquire the goods sold by a player's company. Includes: direct costs of materials, maintenance of hardware and software, etc",
  },
  APC: {
    title: "Average Payment Count (APC)",
    content:
      "Metric that represents the average number of payments made by a single customer over a specific period of time. It's essential to have precise calculations and to report the result with at least two decimal places, like 1.15, without rounding.",
  },
  CLTV: {
    title: "Customer lifetime value",
    content:
      "Predicts the gross profit that a player will receive from a customer over their predicted time as a subscriber. The higher the CLTV, the greater the amount of money a company can allocate towards acquiring new customers.",
  },
  ARPU: {
    title: "Average Revenue per User (ARPU)",
    content:
      "Characterizes the gross profit received by the player from each user (paying and non-paying combined). An important value for evaluating business performance. Comparing it with CPA, you can get an estimate of the return on marketing investment.",
  },
  CPA: {
    title: "Cost per Acquisition (CPA)",
    content:
      "The cost of attracting one user. Calculated by dividing the total marketing budget by all users. CPA is a decision metric because it does not depend on conversion.",
  },
  CM: {
    title: "Contribution Margin (CM)",
    content:
      "Measures the profit generated from all the users after subtracting all sales-related costs. The main value that determines the effectiveness of decisions.",
  },
};

const stagesInfo: StagesData = {
  FFF: {
    title: "FFF Stage",
    content:
      "At this very early stage, you rely on your personal relationships to obtain funding. You have nothing with which to entice investors, so you go to your FFFs: Friends, Fools, and Family. This is one of a startup's first rounds of funding. Your objective is to attract your first ten users and prove that your product or service solves someone's problem",
    roundGoal:
      "Get your first tenclients and prove that your company is solving someone's problem.",
    employees: ["CEO", "Developer", "Marketing"],
    investors: "No",
    mentors: "Yes",
  },
  ANGELS: {
    title: "Angels",
    content:
      "Angel investors are often the main source of funding for many startups that have created MVPs and attracted early adopters. These individuals invest their own capital during a company's early stages. In this round your goal is to attract 100 users, confirm that your sales are not just random luck, and that you understand the challenges and problems your customers face — and solve them.",
    roundGoal: "Increase the number of clients to 100",
    employees: ["CEO", "Developer", "Marketing"],
    investors: "Yes",
    mentors: "Yes",
  },
  PRE_SEED: {
    title: "PreSeed",
    content:
      "You proved to early investors that your product has potential. Now you are ready for a public beta release — a massive launch of your product. You collected feedback from the first 100 users, tested hypotheses, built a development cycle, redesigned and performed testing. However, serial investors are still not sure if your product is scaleable. Your goal is to attract 500 users.",
    roundGoal: "Increase the number of users to 500",
    employees: ["CEO", "Developer", "Marketing", "Designer", "QA", "Manager"],
    investors: "Yes",
    mentors: "Yes",
  },
  SEED: {
    title: "Seed",
    content:
      'Your product has shown great scalability and attracted the attention of a group of investors. That being said, for further scaling, it\'s important to achieve positive unit economics. There is nothing more illusory to a startup than negative unit economics, or selling a product for less than its variable cost. After all, growth is easy and success is "achieved" if you sell a dollar for ninety cents. Get 2,500 subscribers, achieve a positive contribution margin, and economic convergence. Start attracting customers through paid channels.',
    roundGoal:
      "Increase the number of your customers to 2,500, while ensuring that your contribution margin is positive.",
    employees: ["CEO", "Developer", "Marketing", "Designer", "QA", "Manager"],
    investors: "Yes",
    mentors: "Yes",
  },
  A: {
    title: "A",
    content:
      "Your unit economics is positive. Investors believe in your product. However, for further growth, the weekly turnover should also be positive. This will prove to investors that you are capable of running the company cost-effectively and that you deserve to be the CEO",
    roundGoal:
      "Bring the number of your clients to 10,000, and the contribution margin to at least $100,000. Lastly, you must also pass the breakeven point, that is, show a weekly income.",
    employees: ["CEO", "Developer", "Marketing", "Designer", "QA", "Manager"],
    investors: "Yes",
    mentors: "Yes",
  },
  B: {
    title: "B",
    content:
      "Learning, course-correcting, growing! Your company is breaking even and has achieved positive unit economics. Still, investors want to make sure that you're economically viable and can attract more customers and become a top seller in the local market.",
    roundGoal:
      "Your goal is 50,000 customers, a contribution margin of at least $500,000, and a weekly income of more than $100,000. Keep scaling up and earn your first $100,000!",
    employees: ["CEO", "Developer", "Marketing", "Designer", "QA", "Manager"],
    investors: "Yes",
    mentors: "Yes",
  },
  C: {
    title: "C",
    content:
      "You have achieved all your goals and hit the ceiling in your local market. It's time to keep scaling and expanding to international markets. But be careful: new markets present new unexpected problems!",
    roundGoal:
      "Number of customers: 100,000 Contribution margin: at least $1,000,000 Weekly income: more than $500,000 Keep scaling and earn your first $500,000",
    employees: ["CEO", "Developer", "Marketing", "Designer", "QA", "Manager"],
    investors: "Yes",
    mentors: "Yes",
  },
  D: {
    title: "D",
    content:
      "You have successfully entered the international market. Your global market share, however, is not yet significant enough for your startup to be considered by strategic investors. Prove to them that your international sales are sustainable and growing, and that your product is universal — not geographically limited.",
    roundGoal:
      "Number of customers: 500,000. Contribution margin: at least $10,000,000. Weekly income: >$5,000,000. Earn your first $5,000,000",
    employees: ["CEO", "Developer", "Marketing", "Designer", "QA", "Manager"],
    investors: "Yes",
    mentors: "Yes",
  },
  PREIPO: {
    title: "pre-IPO",
    content:
      "Your company is recognized as a leader in the global market. You have offices in major cities all over the world and your finances are stellar. However, preparing for an IPO requires operational decisions from a strong CEO. Get your company ready without impeding your steady growth. Increase the number of your clients to 1,000,000, expand the contribution margin to at least $15,000,000, and earn more than $10,000,000 a week. Remember that to begin the IPO process, you first need to partner with an investment bank or a large fund.",
    roundGoal:
      "Number of customers: 1,000,000. Contribution margin: at least $15,000,000. Weekly income: >$10,000,000. Begin IPO preparations. Choose and partner with an investment bank or a large fund.",
    employees: ["CEO", "Developer", "Marketing", "Designer", "QA", "Manager"],
    investors: "Yes",
    mentors: "Yes",
  },
};
interface ModalInfo {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  anchorEl: HTMLElement | null;
}
function formatAsPercentage(num: number): number {
  return parseFloat((num * 100).toFixed(1));
}
type MetricKey =
  | 'userAcquisition'
  | 'conversionFirstPurchase'
  | 'averageOrderValue'
  | 'costOfGoodsSold'
  | 'averagePaymentCount'
  | 'costPerAcquisition'
  | 'buyerCount'
  | 'customerLifetimeValue'
  | 'averageRevenuePerUser'
  | 'contributionMargin';

type Metrics = {
  [key in MetricKey]: number;
}
const orderedMetrics: MetricKey[] = [
  'userAcquisition',        // UA
  'conversionFirstPurchase',// C1
  'buyerCount',             // B
  'averageOrderValue',      // AOV
  'costOfGoodsSold',        // Cogs
  'averagePaymentCount',    // APC
  'customerLifetimeValue',  // CLTV
  'averageRevenuePerUser',  // ARPU
  'costPerAcquisition',     // CPA
  'contributionMargin',     // CM
];

// SEED: {
//     title: "Seed",
//     content:
//       "Your product has shown great scalability and attracted the attention of a group of investors. That being said, for further scaling, it's important to achieve positive unit economics. There is nothing more illusory to a startup than negative unit economics, or selling a product for less than its variable cost. After all, growth is easy and success is "achieved" if you sell a dollar for ninety cents. Get 2,500 subscribers, achieve a positive contribution margin, and economic convergence. Start attracting customers through paid channels.",
//     roundGoal:
//       "Increase the number of your customers to 2,500, while ensuring that your contribution margin is positive.",
//     employees: ["CEO", "Developer", "Marketing", "Designer", "QA", "Manager"],
//     investors: "Yes",
//     mentors: "Yes",
//   },
//   A: {
//     title: "A",
//     content:
//       "Your unit economics is positive. Investors believe in your product. However, for further growth, the weekly turnover should also be positive. This will prove to investors that you are capable of running the company cost-effectively and that you deserve to be the CEO",
//     roundGoal:
//       "Bring the number of your clients to 10,000, and the contribution margin to at least $100,000. Lastly, you must also pass the breakeven point, that is, show a weekly income.",
//     employees: ["CEO", "Developer", "Marketing", "Designer", "QA", "Manager"],
//     investors: "Yes",
//     mentors: "Yes",
//   },
//   B: {
//     title: "B",
//     content:
//       "Learning, course-correcting, growing! Your company is breaking even and has achieved positive unit economics. Still, investors want to make sure that you're economically viable and can attract more customers and become a top seller in the local market.",
//     roundGoal:
//       "Your goal is 50,000 customers, a contribution margin of at least $500,000, and a weekly income of more than $100,000. Keep scaling up and earn your first $100,000!",
//     employees: ["CEO", "Developer", "Marketing", "Designer", "QA", "Manager"],
//     investors: "Yes",
//     mentors: "Yes",
//   },
//   C: {
//     title: "C",
//     content:
//       "You have achieved all your goals and hit the ceiling in your local market. It's time to keep scaling and expanding to international markets. But be careful: new markets present new unexpected problems!",
//     roundGoal:
//       "Number of customers: 100,000 Contribution margin: at least $1,000,000 Weekly income: more than $500,000 Keep scaling and earn your first $500,000",
//     employees: ["CEO", "Developer", "Marketing", "Designer", "QA", "Manager"],
//     investors: "Yes",
//     mentors: "Yes",
//   },
//   D: {
//     title: "D",
//     content:
//       "You have successfully entered the international market. Your global market share, however, is not yet significant enough for your startup to be considered by strategic investors. Prove to them that your international sales are sustainable and growing, and that your product is universal — not geographically limited.",
//     roundGoal:
//       "Number of customers: 500,000. Contribution margin: at least $10,000,000. Weekly income: >$5,000,000. Earn your first $5,000,000",
//     employees: ["CEO", "Developer", "Marketing", "Designer", "QA", "Manager"],
//     investors: "Yes",
//     mentors: "Yes",
//   },
//   PREIPO: {
//     title: "pre-IPO",
//     content:
//       "Your company is recognized as a leader in the global market. You have offices in major cities all over the world and your finances are stellar. However, preparing for an IPO requires operational decisions from a strong CEO. Get your company ready without impeding your steady growth. Increase the number of your clients to 1,000,000, expand the contribution margin to at least $15,000,000, and earn more than $10,000,000 a week. Remember that to begin the IPO process, you first need to partner with an investment bank or a large fund.",
//     roundGoal:
//       "Number of customers: 1,000,000. Contribution margin: at least $15,000,000. Weekly income: >$10,000,000. Begin IPO preparations. Choose and partner with an investment bank or a large fund.",
//     employees: ["CEO", "Developer", "Marketing", "Designer", "QA", "Manager"],
//     investors: "Yes",
//     mentors: "Yes",
//   },
// };

const ECommerce: React.FC = () => {
  const { 
    user, 
    setUser, 
    setUserState, 
    loader, 
    setloader, 
    notificationMessages, 
    setnotificationMessages ,
    turnAmount,
    selectedTaskIds,
    setSelectedTaskIds,
    HeaderDark,
    userLoaded,
    loaderMessage
  } = useUser();
  
  const router = useRouter();

  const [, forceRender] = useState(0);
  useEffect(() => {
    // console.log("User state changed:", user);
    forceRender((prev) => prev + 1);
  }, [user]);

  useEffect(() => {
    if (userLoaded) {
      const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
      

  
      if (!user || !user.username || !token) {

        router.push("/auth/signup");
      } else {
      }
    }
  }, [userLoaded, user, router]);
  
  useEffect(() => {
    setGameOverModal( user && user?.finances < 0  ? true : false )
  }, [user]);

  useEffect(() => {
    // Function to check the screen size
    const checkScreenSize = () => {
      const isMobileScreen = window.matchMedia('(max-width: 1024px)').matches; // Tailwind's `lg` breakpoint
      setIsMobile(isMobileScreen);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for screen resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    setSelectedTaskIds(
      (prev)=>{
        return prev.filter((elem: any)=>{
          return user?.tasks.some((e)=>{
            return e.taskId === elem.taskId && e.isBug === elem.isBug
          })
        })
      }
    )
  }, [user,  setSelectedTaskIds])
  

  const [modalInfo, setModalInfo] = useState<ModalInfo>({
    isOpen: false,
    title: "",
    content: "",
    anchorEl: null,
  });

  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [showMore, setShowMore] = useState<boolean | null>(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [gameOverModal, setGameOverModal] = useState(() => {
    return user?.finances !== undefined && user.finances < 0;
  });
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const dollarMetrics = ['AOV', 'Cogs', 'CLTV', 'ARPU', 'CPA', 'CM'];
  const [isMobile, setIsMobile] = useState(false);
  async function makeTurn(turnAmount: string) {
    setloader(true);
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const token = localStorage.getItem("userToken");
  
    if (!token) {
      alert("User is not authenticated. Please log in.");
      setloader(false);
      return;
    }
  
    let bugId  : string[] = []
    let taskId : string[] = []
    
    selectedTaskIds.forEach(element => {
      if (element.bugId) {
        bugId.push(element.bugId)
      }else if(element.taskId) { 
        taskId.push(element.taskId)
      }
    });

    let requestBody = {
      gameId : user?.gameId,
      employees: user?.teamMembers,
      turnAmount,
      bugIds : bugId,
      taskIds : taskId
    }

    const makeReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/turn`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(requestBody),
    });
  
    if (makeReq.ok) {
      const response = await makeReq.json();
    
      setUser(response);
      setUserState(response);
      setnotificationMessages([...notificationMessages, ...response.message]);
      
    }
    
    // await delay(1000);
    setloader(false);
  }
  // 67e0705d89fe231396228b83
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
  const stages = [
    "FFF",
    "Angels",
    "pre_seed",
    "Seed",
    "A",
    "B",
    "C",
    "D",
    "pre-IPO",
    "IPO",
  ];
  const handleMetricClick = (
    metricKey: string,
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    const info = metricsInfo[metricKey];
    if (info) {
      setSelectedMetric(metricKey);
      setModalInfo({
        isOpen: true,
        title: info.title,
        content: info.content,
        anchorEl: event.currentTarget,
      });
    }
  };
  const handleStageClick = (stage: string, event: React.MouseEvent<HTMLDivElement>) => {
    const stageKey = stage.toUpperCase();
    const info = stagesInfo[stageKey];
    if (info) {
      setSelectedStage(stage);
      setModalInfo({
        isOpen: true,
        title: info.title,
        anchorEl: event.currentTarget,
        content: (
          <div>
            <h3 className="mb-2 font-medium">Description</h3>
            <p className="border-b border-[#d0cdcd] pb-4">{info.content}</p>
            {info.roundGoal && (
              <>
                <h3 className="mb-2 mt-3 font-medium">Round goal</h3>
                <p className="mb-4 border-b border-[#d0cdcd] pb-4 text-blue-500">
                  {info.roundGoal}
                </p>
              </>
            )}
            {info.employees && (
              <>
                <h3 className="mb-2 mt-3 font-medium">Employees</h3>
                <ul className="mb-4 list-none border-b border-[#d0cdcd] pb-4">
                  {info.employees.map((emp, index) => (
                    <li key={index} className="italic text-blue-500">
                      • {emp}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {info.investors && (
              <>
                <h3 className="mb-2 font-medium">Investors</h3>
                <p className="mb-4 border-b border-[#d0cdcd] pb-4 text-green-500">
                  {info.investors}
                </p>
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
    setModalInfo({
      isOpen: false,
      title: "",
      content: "",
      anchorEl: null,
    });
    setSelectedMetric(null);
    setSelectedStage(null);
  };
  function countDecimalPlaces(value: number): number {
    if (Math.floor(value) === value) return 0; // integer
    return value.toString().split(".")[1]?.length || 0;
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
      {loader && (
      <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black bg-opacity-50">
        <div className="flex gap-2 mb-4">
          <div className="h-4 w-4 animate-bounce rounded-full bg-blue-700 [animation-delay:.1s]"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-blue-700 [animation-delay:.3s]"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-blue-700 [animation-delay:.5s]"></div>
        </div>
        <p className="text-white text-sm font-medium mt-2">{loaderMessage}</p>
      </div>
    )}

      {
        gameOverModal ? <GameOverModal  /> : null
      }
      
      <h3 className="text-sm text-gray-500 dark:text-gray-400">
        Startup Stages
      </h3>
      {user?.startupStage === "FFF" ? (
        <p >Your goal is to reach 10 buyers</p>
      ) : user?.startupStage === "Angels" ? (
        <p >Your goal is to reach 100 buyers</p>
      ) : user?.startupStage === "pre_seed" ? (
        <p>Your goal is to reach 500 buyers</p>
      ) : user?.startupStage === "Seed" ? (
        <p>Your goal is to reach 2500 buyers and a positive contribution margin</p>
      ) : user?.startupStage === "a" ? (
        <p>Your goal is to reach 10,000 buyers and a contribution margin of $100,000</p>
      ) : user?.startupStage === "b" ? (
        <p>Your goal is to reach 50,000 buyers, a contribution margin of $500,000, and $100,000 in revenue</p>
      ) : user?.startupStage === "c" ? (
        <p>Your goal is to reach 100,000 buyers, a contribution margin of $1,000,000, and $500,000 in revenue</p>
      ) : (
        <p>Congratulations! You &apos; ve reached the highest stage 🚀</p>
      )}

<div className="my-2 flex gap-3 overflow-x-auto lg:w-auto lg:overflow-hidden 
  dark:bg-[#101d28] bg-white border border-gray-200 lg:dark:bg-transparent
  lg:border-0 dark:border-gray-700 rounded-xl p-5 lg:bg-transparent lg:p-0 ">
  {stages.map((stage, index) => (
    <div
      key={index}
      onClick={(e) => handleStageClick(stage, e)}
      onMouseEnter={() => setHoveredStage(stage)}
      onMouseLeave={() => setHoveredStage(null)}
      className={`min-w-[100px] max-w-[120px] cursor-pointer px-4 py-2 text-center rounded-lg border transition-all duration-200
        ${
          user?.startupStage === stage
            ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            : "bg-gray-100 dark:bg-[#1C2E5B] border-transparent hover:bg-gray-200 dark:hover:bg-[#223a5f]"
        }`}
    >
      <div className="flex items-center justify-center gap-1">
        <span className={`text-sm font-medium whitespace-nowrap 
          ${
            user?.startupStage === stage
              ? "text-black dark:text-white font-semibold py-1 lg:py-0 text-center"
              : "text-gray-600 dark:text-gray-400 py-1 text-center lg:py-0"
          }`}
        >
          {stage}
        </span>
        {hoveredStage === stage && (
          <InfoIcon size={12} className="text-gray-400 dark:text-gray-400" />
        )}
      </div>
    </div>
  ))}
</div>


      <h3 className="text-sm text-gray-500 dark:text-gray-400">Metrics</h3>
      <div 
      className="my-2 rounded-lg lg:rounded-none grid grid-cols-3 lg:flex 
      gap-5 lg:gap-3 overflow-x-scroll lg:overflow-x-hidden 
      p-4 lg:p-0 lg:bg-transparent dark:lg:bg-transparent  h-auto">
      {user && user.metrics && orderedMetrics.map((metric, index) => (
    <div
      key={index}
      onClick={(e) => handleMetricClick(getShortName(metric), e)}
      className="flex min-w-max lg:min-w-[9%]  lg:mx-0  items-center justify-around rounded-xl border 
      border-stroke bg-white px-2 py-3 dark:border-strokedark dark:bg-boxdark "
    >
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {getShortName(metric)}
      </span>
      <span className="text-xs font-medium text-[#6577F3] dark:text-secondary">
  {(() => {
    const shortName = getShortName(metric);
    const value = user.metrics[metric];

    let displayValue;
    if (shortName === 'UA' || shortName === 'B') {
      displayValue = Math.floor(value);
    } else if (Number.isInteger(value) || countDecimalPlaces(value) <= 2) {
      displayValue = value;
    } else {
      displayValue = value.toFixed(2);
    }

    return (
      <>
        {displayValue}
        {shortName === 'C1' ? '%' : ''}
        {dollarMetrics.includes(shortName) ? '$' : ''}
      </>
    );
  })()}
      </span>
    </div>
  ))}


</div>
      <SpotlightModal
        isOpen={modalInfo.isOpen}
        onClose={handleModalClose}
        title={modalInfo.title}
        content={modalInfo.content}
        anchorEl={modalInfo.anchorEl}
        selectedMetric={selectedMetric}
      />
      <div className="mt-4 w-[110%] right-5 relative items-center lg:w-full lg:static pb-28 md:mt-4 2xl:mt-7.5">
        <TaskGrid />
      </div>
    
      <div className={`fixed bottom-0 left-0 right-0 w-full p-3 z-[9999]  lg:left-75
${HeaderDark ? 'bg-[#878C94]' : "bg-white"} dark:bg-boxdark`}>

    {/* ====== MOBILE VIEW ====== */}
    <div className="flex flex-col lg:hidden w-full">

        {/* Show More Toggle at TOP */}
        <div onClick={() => setShowMore(!showMore)}
            className="flex justify-center mb-2 cursor-pointer">
            <p>{showMore ? "Show Less" : "Show More"}</p>
        </div>

        {/* Notification Box if showMore is true */}
        {showMore && (
            <div className="rounded-xl  bg-[#eff4fb9a] p-3 mb-3 dark:bg-[#1A222C]">
                <div className="flex justify-between items-center">
                    <h3 className={`text-sm ${
                        notificationMessages[notificationMessages.length - 1]?.isPositive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                    }`}>
                        {notificationMessages[notificationMessages.length - 1]?.message || "No notifications"}
                    </h3>
                    <button onClick={() => setShowNotifications(!showNotifications)}
                        className="text-gray-600 dark:text-gray-400">
                        {showNotifications ? (
                            <span className="flex items-center">
                                Hide notifications <Bell className="ml-1" size={16} />
                            </span>
                        ) : (
                            <span className="flex items-center">
                                Show notifications <Bell className="ml-1 text-red-500" size={16} />
                            </span>
                        )}
                    </button>
                </div>

                {/* Old notifications history (MOBILE) */}
                {showNotifications && (
                    <div className="max-h-24 overflow-y-scroll  mt-1 space-y-1 pr-1">
                        {notificationMessages
                            .slice(0, notificationMessages.length - 1)
                            .reverse()
                            .map((msg, idx) => (
                                <p key={idx} className={msg.isPositive ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
                                    {msg.message}
                                </p>
                            ))}
                    </div>
                )}
            </div>
        )}

        {/* Funds + Turn button side by side */}
        <div className="flex justify-between items-center space-x-4">
            <div className="text-sm">
                <p>Current funds</p>
                <p className="font-semibold">${user?.finances}</p>
            </div>
            <button onClick={() => makeTurn(turnAmount)}
                className="flex flex-col items-center rounded-xl bg-[#4fc387] px-4 py-2">
                <span className="font-semibold text-white">Make turn</span>
                <div className="flex justify-between">
                    <span className="font-semibold text-white">Income</span>
                    <h3 className="font-bold text-white ml-2">{user ? turnAmount : ""}</h3>
                </div>
            </button>
        </div>
    </div>

    {/* ====== DESKTOP VIEW (LG and above) ====== */}
    <div className="hidden lg:flex items-center justify-between w-full">

        {/* Left side: Notification box with history */}
        <div className="flex flex-col gap-2 bg-[#1A222C] rounded-xl px-4 py-2 max-w-[55%]">
    <div className="flex justify-between items-start gap-2">
        <p className={`text-sm ${
            notificationMessages[notificationMessages.length - 1]?.isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
        }`}>
            {notificationMessages[notificationMessages.length - 1]?.message || "Welcome to the game"}
        </p>
        <button onClick={() => setShowNotifications(!showNotifications)}
            className="text-gray-400 whitespace-nowrap">
            {showNotifications ? "Hide notifications" : (
                <span className="flex items-center">
                    Show notifications <Bell className="ml-1 text-red-500" size={16} />
                </span>
            )}
        </button>
    </div>

    {/* Old notifications scroll area */}
    {showNotifications && (
        <div className="max-h-24 overflow-y-scroll mt-1 space-y-1 pr-1">
            {notificationMessages
                .slice(0, notificationMessages.length - 1)
                .reverse()
                .map((msg, idx) => (
                    <p key={idx} className={msg.isPositive ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
                        {msg.message}
                    </p>
                ))}
        </div>
    )}
</div>


        {/* Right side: Bugs, Funds, Button */}
        <div className="flex flex-col justify-end space-y-2 lg:relative lg:right-75 h-full ">
        <div className="flex items-end space-x-8">
            <div className="text-sm">
                <p>Bugs</p>
                <p className="font-semibold">{user?.bugPercentage}%</p>
            </div>
            <div className="text-sm">
                <p>Current funds</p>
                <p className="font-semibold">${user?.finances}</p>
            </div>
            <button onClick={() => makeTurn(turnAmount)}
                className="rounded-xl bg-[#4fc387] px-6 lg:py-2 lg:px-2 py-3 w-72 lg:w-62 flex flex-col items-center justify-center space-y-1">

                <span className="font-semibold text-white text-lg">Make turn</span>

                <div className="flex justify-between w-full px-2">
                    <span className="font-medium text-white">Income</span>
                    <span className="font-bold text-white">
                       ${user ? Number(turnAmount).toLocaleString() : ""}
                    </span>
                </div>

            </button>
            </div>
        </div>
    </div>
</div>


      {/* </div> */}
    </>
  );
};

export default ECommerce;
