"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import TaskGrid from "../CardDataStats";
import { InfoIcon, ArrowRight, X } from "lucide-react";
import TooltipModal from "@/components/TooltipModal";
import { Bell } from "lucide-react";
import { Tooltip } from 'react-tooltip'
import SpotlightModal from "@/components/SpotlightModal";
import TurnLoader from "@/components/Loader/TurnLoader";
import StageStar from "@/components/StageStar";

// import { Dice1, InfoIcon } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { UserData } from "@/context/interface.types";
import { useNotification } from "@/context/NotificationContext";
import { useSound } from "@/context/SoundContext";
import { useRouter } from "next/navigation";
import { translateTaskName } from "@/utils/taskTranslator";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "@/components/Dashboard/index.css";
import GameOverModal from "../Sidebar/gameOverModal";
// import NotEnoughVenture coins from "../Sidebar/notEnoughVenture coins";

import ElonAssistant from "@/components/Elon";
import TurnProgressModal from "@/components/TurnProgressModal";
import StageUpgradeModal from "@/components/StageUpgradeModal";

import TypewriterText from "@/components/TypewriterText/TypewriterText";
// import elonMusk from "@/app/elon.png";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import NotEnoughCredits from "../Sidebar/notEnoughCredits";
import TeamManagementModal from "../Sidebar/TeamManagementModal";
import InvestorsModal from "../Sidebar/InvestorsModal";
import MentorsModal from "../Sidebar/MentorsModal";
// import notEnoughVenture coins from "../Sidebar/notEnoughVenture coins";

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

const DevIcon = () => (
  <Image src="/employees/developerIcon.svg" alt="Developer" width={32} height={32} />
);

const CeoIcon = () => (
  <Image src="/employees/ceoIcon.svg" alt="CEO" width={32} height={32} />
);

const SalesIcon = () => (
  <Image src="/employees/salesIcon.svg" alt="Sales" width={32} height={32} />
);

const InfoModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;
  
  const isMetricModal = Object.values(metricsInfo).some(
    (metric) => metric.title === title,
  );

  return (
    <>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4 sm:px-0">
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
        ></div>
        <div
          className={`relative w-full ${isMetricModal ? "max-w-sm" : "max-w-3xl"} rounded-2xl bg-white p-4 sm:p-6 dark:bg-boxdark transition-all duration-300 max-h-[90vh] overflow-y-auto ${
            isAnimating 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
          <div className="-m-4 sm:-m-6 mb-3 sm:mb-4 flex items-center justify-between rounded-tl-2xl rounded-tr-2xl bg-[#f3f3f3] p-4 sm:p-5 dark:bg-transparent">
            <h2 className="text-lg sm:text-xl font-semibold truncate pr-2">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 flex-shrink-0"
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
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
          <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{content}</div>
        </div>
      </div>
    </>
  );
};

// Component to translate stage content dynamically
const StageModalContent: React.FC<{ info: any }> = ({ info }) => {
  const { t, language } = useLanguage();
  const [translatedContent, setTranslatedContent] = React.useState(info.content);
  const [translatedRoundGoal, setTranslatedRoundGoal] = React.useState(info.roundGoal || "");
  const [isTranslating, setIsTranslating] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const runTranslation = async () => {
      if (language === "en") {
        if (!isMounted) return;
        setTranslatedContent(info.content);
        setTranslatedRoundGoal(info.roundGoal || "");
        setIsTranslating(false);
        return;
      }

      try {
        setIsTranslating(true);
        const [contentTx, goalTx] = await Promise.all([
          translateTaskName(info.content, language as any),
          info.roundGoal
            ? translateTaskName(info.roundGoal, language as any)
            : Promise.resolve(info.roundGoal || ""),
        ]);

        if (!isMounted) return;
        setTranslatedContent(contentTx);
        setTranslatedRoundGoal(goalTx || "");
      } finally {
        if (isMounted) setIsTranslating(false);
      }
    };

    runTranslation();

    return () => {
      isMounted = false;
    };
  }, [info, language]);

  if (isTranslating) {
    return (
      <div className="py-4 text-sm text-gray-500 dark:text-gray-300">
        {t("common.loading")}
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-2 font-medium">{t("modals.stageModal.description")}</h3>
      <p className="border-b border-[#d0cdcd] pb-4">{translatedContent}</p>
      {info.roundGoal && (
        <>
          <h3 className="mb-2 mt-3 font-medium">{t("modals.stageModal.roundGoal")}</h3>
          <p className="mb-4 border-b border-[#d0cdcd] pb-4 text-blue-500">
            {translatedRoundGoal}
          </p>
        </>
      )}
      {info.employees && (
        <>
          <h3 className="mb-2 mt-3 font-medium">{t("modals.stageModal.employees")}</h3>
          <ul className="mb-4 list-none border-b border-[#d0cdcd] pb-4">
            {info.employees.map((emp: string, index: number) => (
              <li key={index} className="italic text-blue-500">
                • {emp}
              </li>
            ))}
          </ul>
        </>
      )}
      {info.investors && (
        <>
          <h3 className="mb-2 font-medium">{t("modals.stageModal.investors")}</h3>
          <p className="mb-4 border-b border-[#d0cdcd] pb-4 text-green-500">
            {info.investors}
          </p>
        </>
      )}
      {info.mentors && (
        <>
          <h3 className="mb-2 font-medium">{t("modals.stageModal.mentors")}</h3>
          <p className="text-green-500">{info.mentors}</p>
        </>
      )}
    </div>
  );
};

// Component to translate metric content dynamically
const MetricModalContent: React.FC<{ title: string; content: string }> = ({ title, content }) => {
  const { t, language } = useLanguage();
  const [translatedTitle, setTranslatedTitle] = React.useState(title);
  const [translatedContent, setTranslatedContent] = React.useState(content);
  const [isTranslating, setIsTranslating] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const runTranslation = async () => {
      if (language === "en") {
        if (!isMounted) return;
        setTranslatedTitle(title);
        setTranslatedContent(content);
        setIsTranslating(false);
        return;
      }

      try {
        setIsTranslating(true);
        const [titleTx, contentTx] = await Promise.all([
          translateTaskName(title, language as any),
          translateTaskName(content, language as any),
        ]);

        if (!isMounted) return;
        setTranslatedTitle(titleTx);
        setTranslatedContent(contentTx);
      } finally {
        if (isMounted) setIsTranslating(false);
      }
    };

    runTranslation();

    return () => {
      isMounted = false;
    };
  }, [title, content, language]);

  if (isTranslating) {
    return (
      <div className="py-4 text-sm text-gray-500 dark:text-gray-300">
        {t("common.loading")}
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-600 dark:text-gray-300">{translatedContent}</p>
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
    setnotificationMessages,
    turnAmount,
    selectedTaskIds,
    setSelectedTaskIds,
    HeaderDark,
    userLoaded,
    loaderMessage,
    elonStep,
    setElonStep,
    setLoaderMessage
  } = useUser();
  const { t, language } = useLanguage();
  const { isNotificationModalOpen, closeNotificationModal } = useNotification();
  const { playSound } = useSound();

  const router = useRouter();

  const [, forceRender] = useState(0);
  useEffect(() => {
    // console.log("User state changed:", user);
    forceRender((prev) => prev + 1);


    // Don't initialize previous metrics from current metrics on first load
    // This would prevent showing changes. Only load from localStorage or set after a turn.
  }, [user]);

  useEffect(() => {
    if (!userLoaded) return; // Wait until user context is ready

    if (!user) {
      router.push("/home"); // Not logged in
    } else if (!user.isAiCustomizationDone) {
      router.push("/formQuestion"); // Logged in but setup not complete
    }
  }, [user, router, userLoaded]);


  useEffect(() => {
    setGameOverModal(user && user?.finances < 0 ? true : false)
  }, [user]);

  useEffect(() => {
    if (!user || !user.startupStage) return;

    const isEarlyStage = user.startupStage === "FFF" || user.startupStage === "Angels";

    if (isEarlyStage) {
      setnotEnoughCredits(false);
    } else {
      setnotEnoughCredits(!user.isPurchaseDone);
    }
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


  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsOpen(true);
  //     setCurrentStep(0);
  //   }, 1000); // Wait 1 second after mount

  //   return () => clearTimeout(timer);
  // }, [setCurrentStep, setIsOpen]);
  useEffect(() => {
    setSelectedTaskIds(
      (prev) => {
        return prev.filter((elem: any) => {
          return user?.tasks.some((e) => {
            if (elem.bugId) return e._id === elem.bugId && e.isBug
            if (elem.taskId) return e.taskId === elem.taskId && !e.isBug

          })
        })
      }
    )
  }, [user, setSelectedTaskIds])


  // showMore removed - no longer needed

  // Translate notification messages when language or notificationMessages change
  useEffect(() => {
    const translateNotifications = async () => {
      if (!notificationMessages || notificationMessages.length === 0) {
        setTranslatedNotifications([]);
        return;
      }

      // If English, use original messages
      if (language === 'en') {
        setTranslatedNotifications(notificationMessages);
        return;
      }

      setIsTranslatingNotifications(true);
      try {
        const translated = await Promise.all(
          notificationMessages.map(async (msg) => ({
            ...msg,
            message: await translateTaskName(msg.message, language as any),
          }))
        );
        setTranslatedNotifications(translated);
      } catch (error) {
        console.warn('Failed to translate notifications:', error);
        setTranslatedNotifications(notificationMessages);
      } finally {
        setIsTranslatingNotifications(false);
      }
    };

    translateNotifications();
  }, [notificationMessages, language]);

  const [showElon, setShowElon] = useState<boolean>(false);

  // inside ECommerce component (after user & userLoaded are available)
  useEffect(() => {
    if (!userLoaded || !user) return;

    const seenKey = `elon_seen_v1_${user?.gameId ?? user?.username ?? "guest"}`;
    const hasSeen = typeof window !== "undefined" && localStorage.getItem(seenKey);

    if (!hasSeen) {
      // mark as seen so subsequent refreshes won't re-show
      try {
        localStorage.setItem(seenKey, "1");
      } catch (err) {
        console.warn("Could not write elon seen flag", err);
      }

      // show assistant this session, and set the context step
      setShowElon(true);
      setElonStep(1);
    } else {
      // do not mount the assistant
      setShowElon(false);
      // keep the context step cleared
      setElonStep(null);
    }
    // only run when userLoaded/user changes
  }, [userLoaded, user, setElonStep]);


  const [confirmationAction, setConfirmationAction] = useState<null | 'skip' | 'buyout' | 'prevent'>(null);
  const [activeFinanceView, setActiveFinanceView] = useState<"funds" | "breakdown">("funds");


  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [translatedGreeting, setTranslatedGreeting] = useState("");

  const [chatMessages, setChatMessages] = useState([
    { sender: 'elon', text: "" }
  ]);
  const [userInput, setUserInput] = useState("");

  // Translate greeting message when language changes
  useEffect(() => {
    const translateGreeting = async () => {
      const greetingText = t("modals.aiAdvisor.greeting");
      if (language === 'en') {
        setTranslatedGreeting(greetingText);
        setChatMessages(prev => {
          // Only update if chat is empty or has only empty greeting, or if first message is from elon
          if (prev.length === 0 || (prev.length === 1 && prev[0].sender === 'elon' && prev[0].text === "")) {
            return [{ sender: 'elon', text: greetingText }];
          } else if (prev.length === 1 && prev[0].sender === 'elon') {
            // Update the first message if it's the greeting
            return [{ sender: 'elon', text: greetingText }];
          }
          return prev;
        });
        return;
      }

      try {
        const translated = await translateTaskName(greetingText, language as any);
        setTranslatedGreeting(translated);
        setChatMessages(prev => {
          // Only update if chat is empty or has only empty greeting, or if first message is from elon
          if (prev.length === 0 || (prev.length === 1 && prev[0].sender === 'elon' && prev[0].text === "")) {
            return [{ sender: 'elon', text: translated }];
          } else if (prev.length === 1 && prev[0].sender === 'elon') {
            // Update the first message if it's the greeting
            return [{ sender: 'elon', text: translated }];
          }
          return prev;
        });
      } catch (error) {
        console.warn('Failed to translate greeting:', error);
        setTranslatedGreeting(greetingText);
        setChatMessages(prev => {
          if (prev.length === 0 || (prev.length === 1 && prev[0].sender === 'elon' && prev[0].text === "")) {
            return [{ sender: 'elon', text: greetingText }];
          } else if (prev.length === 1 && prev[0].sender === 'elon') {
            return [{ sender: 'elon', text: greetingText }];
          }
          return prev;
        });
      }
    };

    translateGreeting();
  }, [language, t]);

  useEffect(() => {
    const scrollTarget = messagesEndRef.current;
    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [chatMessages, isTyping]);
  useEffect(() => {
    const el = document.querySelector("textarea");
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [userInput]);

  async function handleBugPrevention() {
    const token = localStorage.getItem("userToken");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/credits/bugPrevention`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
      },
      body: JSON.stringify({ gameId: user?.gameId }),
    });

    const data = await response.json();
    // console.log("data", data)
    if (response.ok) {
      setUser(data);
      setUserState(data);
      toast.success("Bug prevention activated 🛡️");
    } else {
      toast.error(data.message || "Could not activate bug prevention");
    }
  }

  async function handleBuyoutBug() {
    const token = localStorage.getItem("userToken");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/credits/buyoutBug`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
      },
      body: JSON.stringify({ gameId: user?.gameId }),
    });

    const data = await response.json();

    if (response.ok) {
      setUser(data);
      setUserState(data);
      setnotificationMessages([...notificationMessages, ...data.message])
      toast.success(data.message?.[0]?.message || "Bug bought out 🧹");
    } else {
      toast.error(data.message || "Could not buyout bug");
    }
  }

  const handleConfirmBugAction = () => {
    if (!user) return;

    switch (confirmationAction) {
      case 'skip':
      case 'buyout':
        handleBuyoutBug();
        break;
      case 'prevent':
        handleBugPrevention();
        break;
    }

    setConfirmationAction(null);
    setShowSkipBugModal(false);
  };


  const [modalInfo, setModalInfo] = useState<ModalInfo>({
    isOpen: false,
    title: "",
    content: "",
    anchorEl: null,
  });

  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  // showMore state removed - notifications moved to header
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [showBoostModal, setShowBoostModal] = useState(false);
  // Notification modal is now managed by NotificationContext
  const [translatedNotifications, setTranslatedNotifications] = useState<Array<{ message: string; isPositive: boolean }>>([]);
  const [isTranslatingNotifications, setIsTranslatingNotifications] = useState(false);
  const [showSkipBugModal, setShowSkipBugModal] = useState(false);
  const [gameOverModal, setGameOverModal] = useState(() => {
    return user?.finances !== undefined && user.finances < 0;
  });
  const [notEnoughCredits, setnotEnoughCredits] = useState(false);

  const [hintModalOpen, setHintModalOpen] = useState(false);
  const [hintContent, setHintContent] = useState("");

  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const dollarMetrics = ['AOV', 'Cogs', 'CLTV', 'ARPU', 'CPA', 'CM'];
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showTurnProgressModal, setShowTurnProgressModal] = useState(false);
  const [previousUserState, setPreviousUserState] = useState<UserData | null>(null);
  const [turnNotifications, setTurnNotifications] = useState<Array<{ message: string; isPositive: boolean }>>([]);
  const [previousMetrics, setPreviousMetrics] = useState<Metrics | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showStageUpgradeModal, setShowStageUpgradeModal] = useState(false);
  const [stageUpgradeData, setStageUpgradeData] = useState<{
    previousStage: string;
    currentStage: string;
    nextGoal: string;
  } | null>(null);
  const [pendingTurnProgress, setPendingTurnProgress] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showInvestorsModal, setShowInvestorsModal] = useState(false);
  const [showMentorsModal, setShowMentorsModal] = useState(false);
  const [showFoundersModal, setShowFoundersModal] = useState(false);
  const [stagesCardCollapsed, setStagesCardCollapsed] = useState(false);

  // Load persisted data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load persisted notifications
      const savedNotifications = localStorage.getItem('gameNotifications');
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setnotificationMessages(parsed);
          }
        } catch (e) {
          console.warn('Failed to parse saved notifications:', e);
        }
      }

      // Load persisted previous metrics
      const savedMetrics = localStorage.getItem('previousMetrics');
      if (savedMetrics) {
        try {
          const parsed = JSON.parse(savedMetrics);
          setPreviousMetrics(parsed);
        } catch (e) {
          console.warn('Failed to parse saved previous metrics:', e);
        }
      }
    }
  }, []);

  // Persist notifications when they change
  useEffect(() => {
    if (typeof window !== 'undefined' && notificationMessages.length > 0) {
      localStorage.setItem('gameNotifications', JSON.stringify(notificationMessages));
    }
  }, [notificationMessages]);

  // Persist previous metrics when they change
  useEffect(() => {
    if (typeof window !== 'undefined' && previousMetrics) {
      localStorage.setItem('previousMetrics', JSON.stringify(previousMetrics));
    }
  }, [previousMetrics]);

  // Event listener for bug modal from sidebar
  useEffect(() => {
    const handleOpenBugModal = () => {
      setShowSkipBugModal(true);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('openBugModal', handleOpenBugModal);
      return () => {
        window.removeEventListener('openBugModal', handleOpenBugModal);
      };
    }
  }, []);

  // Scroll detection for Make Turn button
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;


    const handleScroll = () => {
      setIsScrolling(true);


      // Clear existing timeout
      clearTimeout(scrollTimeout);


      // Set timeout to detect when scrolling stops
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // 150ms after scrolling stops
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
      };
    }
  }, []);


  async function makeTurn(turnAmount: string) {
    setloader(true);
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const token = localStorage.getItem("userToken");

    if (!token) {
      alert("User is not authenticated. Please log in.");
      setloader(false);
      return;
    }

    // Store previous state before making the turn
    const previousState = user ? { ...user } : null;
    // Store previous metrics BEFORE the turn for comparison
    const previousMetricsSnapshot = user?.metrics ? { ...user.metrics } : null;
    if (previousMetricsSnapshot) {
      setPreviousMetrics(previousMetricsSnapshot);
      // Persist previous metrics
      if (typeof window !== 'undefined') {
        localStorage.setItem('previousMetrics', JSON.stringify(previousMetricsSnapshot));
      }
    }

    let bugId: string[] = []
    let taskId: string[] = []

    selectedTaskIds.forEach(element => {
      if (element.bugId) {
        bugId.push(element.bugId)
      } else if (element.taskId) {
        taskId.push(element.taskId)
      }
    });

    let requestBody = {
      gameId: user?.gameId,
      employees: user?.teamMembers,
      turnAmount,
      bugIds: bugId,
      taskIds: taskId,
      preventBug: user?.preventBug
    }

    // Construct API URL - handle both cases where NEXT_PUBLIC_API_URL includes /api or not
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, ''); // Remove trailing slash
    const apiUrl = baseUrl?.endsWith('/api') ? `${baseUrl}/turn` : `${baseUrl}/api/turn`;
    const makeReq = await fetch(apiUrl, {
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
      const updatedNotifications = [...notificationMessages, ...response.message];
      setnotificationMessages(updatedNotifications);


      // Persist updated notifications
      if (typeof window !== 'undefined') {
        localStorage.setItem('gameNotifications', JSON.stringify(updatedNotifications));
      }

      // Check for stage upgrade
      const stageChanged = previousState && previousState.startupStage !== response.startupStage;


      if (stageChanged && previousState) {
        // Get next goal from stagesInfo
        const getNextGoal = (stage: string): string => {
          const stageKeyMap: Record<string, string> = {
            'FFF': 'FFF',
            'Angels': 'ANGELS',
            'pre_seed': 'PRE_SEED',
            'Seed': 'SEED',
            'a': 'A',
            'b': 'B',
            'c': 'C',
            'd': 'D',
            'preIpo': 'PREIPO',
            'IPO': 'IPO',
          };
          const key = stageKeyMap[stage] || stage.toUpperCase();
          const stageInfo = stagesInfo[key];
          return stageInfo?.roundGoal || '';
        };

        const nextGoal = getNextGoal(response.startupStage);


        // Set stage upgrade data and show modal
        setStageUpgradeData({
          previousStage: previousState.startupStage,
          currentStage: response.startupStage,
          nextGoal: nextGoal,
        });
        setShowStageUpgradeModal(true);
        playSound("stageUpgrade");
        // Mark that we need to show turn progress modal after stage upgrade modal closes
        setPendingTurnProgress(true);
        setPreviousUserState(previousState);
        setTurnNotifications(response.message || []);
      } else {
        // Show turn progress modal directly if no stage change
        if (previousState) {
          setPreviousUserState(previousState);
          setTurnNotifications(response.message || []);
          setShowTurnProgressModal(true);
          playSound("turnComplete");
        }
      }

      // Store current metrics as previous for next turn (they become the baseline)
      if (response.metrics) {
        setPreviousMetrics(response.metrics);
        if (typeof window !== 'undefined') {
          localStorage.setItem('previousMetrics', JSON.stringify(response.metrics));
        }
      }

      // Show toast notification for the last notification
      if (response.message && response.message.length > 0) {
        const lastNotification = response.message[response.message.length - 1];
        playSound("notification");
        if (lastNotification.isPositive) {
          playSound("success");
          toast.success(lastNotification.message, {
            position: "top-right",
            autoClose: 4000,
          });
        } else {
          playSound("error");
          toast.error(lastNotification.message, {
            position: "top-right",
            autoClose: 4000,
          });
        }
      }
    }

    // await delay(1000);
    setloader(false);
  }
  // 67e0705d89fe231396228b83
  const handleShowTutorial = () => {
    if (typeof window === "undefined" || !user) return;
    const seenKey = `elon_seen_v1_${user?.gameId ?? user?.username ?? "guest"}`;
    // allow re-showing by removing the seen flag
    try {
      localStorage.removeItem(seenKey);
    } catch (err) {
      console.warn("Couldn't clear seen flag", err);
    }
    // show the assistant and set starting step
    setShowElon(true);
    setElonStep(1);
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
      bugPercentage: "bugPercentage"
    };

    return metricMap[metricName] || metricName;
  }

  function getFullMetricName(metricName: string): string {
    const fullNameMap: Record<string, string> = {
      userAcquisition: "User Acquisition",
      conversionFirstPurchase: "Conversion Rate",
      averageOrderValue: "Average Order Volume",
      costOfGoodsSold: "Cost of Goods Sold",
      averagePaymentCount: "Average Payment Count",
      customerLifetimeValue: "Customer Lifetime Value",
      averageRevenuePerUser: "Average Revenue Per User",
      costPerAcquisition: "Cost Per Acquisition",
      contributionMargin: "Contribution Margin",
      buyerCount: "Buyer",
      bugPercentage: "Bug Percentage"
    };

    return fullNameMap[metricName] || metricName;
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
  const activeStageIndex =
    user && user.startupStage
      ? stages.findIndex((s) => s === user.startupStage)
      : -1;

  const getRoleCount = (role: string) => {
    return (
      user?.teamMembers?.find(
        (m: any) => m.roleName?.toLowerCase() === role.toLowerCase(),
      )?.quantity || 0
    );
  };
  const handleMetricClick = async (
    metricKey: string,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    const info = metricsInfo[metricKey];
    if (info) {
      setSelectedMetric(metricKey);


      // Translate title if not English
      let translatedTitle = info.title;
      if (language !== 'en') {
        try {
          translatedTitle = await translateTaskName(info.title, language as any);
        } catch (error) {
          console.warn('Failed to translate metric title:', error);
        }
      }


      setModalInfo({
        isOpen: true,
        title: translatedTitle,
        content: (
          <MetricModalContent
            title={info.title}
            content={info.content}
          />
        ),
        anchorEl: event.currentTarget,
      });
    }
  };
  const handleStageClick = (stage: string, event: React.MouseEvent<HTMLElement>) => {
    const stageKey = stage.toUpperCase();
    const info = stagesInfo[stageKey];
    if (info) {
      setSelectedStage(stage);
      setModalInfo({
        isOpen: true,
        title: info.title,
        anchorEl: event.currentTarget,
        content: (
          <StageModalContent
            info={info}
          />
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
    <div className="relative w-full bg-[#050509] text-gray-100">
      <Tooltip id="my-tooltip" />
      {showElon && <ElonAssistant onStepChange={setElonStep} />}
      {loader && <TurnLoader message={loaderMessage} />}

      {gameOverModal ? <GameOverModal /> : null}

      {notEnoughCredits ? <NotEnoughCredits /> : null}

      {/* Dashboard background + centered content column */}
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full flex-col gap-6 px-0 pt-4 pb-10  md:px-0 md:pt-6">
        {/* Startup stages card */}
        <div
          className={`rounded-3xl border border-gray-800 bg-[#151516] px-4 py-6 sm:px-6 sm:py-7 shadow-[0_24px_80px_rgba(0,0,0,0.6)] transition-all duration-300 ${
            elonStep === 1 ? "ring-2 ring-blue-500 animate-pulse" : ""
          }`}
        >
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Business idea */}
            <div className="z-10 flex w-full flex-col items-start text-left sm:absolute sm:left-0 sm:top-1/2 sm:w-[180px] sm:min-w-[180px] sm:-translate-y-1/2">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500 text-left sm:text-center">
                Business Idea
              </p>
              <p className="mt-1 text-sm font-semibold text-white text-left sm:text-center">
                {user?.gameName || "Your Startup"}
              </p>
            </div>

            {/* Progress track + stages */}
            <div className="flex-1 w-full sm:pl-40 sm:pr-44">
              {/* Mobile: collapsible — collapsed = horizontal bar + prev/current/next; expanded = full zig-zag */}
              <div className="md:hidden">
                <motion.div
                  className="overflow-hidden"
                  initial={false}
                  animate={{
                    maxHeight: stagesCardCollapsed ? 88 : 520,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  {stagesCardCollapsed ? (
                    /* Collapsed: 3-stage view (prev/current/next), progress fills from left star to current star */
                    (() => {
                      const idx = activeStageIndex < 0 ? 0 : activeStageIndex;
                      const prevStage = idx > 0 ? stages[idx - 1] : null;
                      const currentStage = stages[idx];
                      const nextStage = idx < stages.length - 1 ? stages[idx + 1] : null;
                      const isLockedPrev = (idx - 1) > 1 && !user?.isPurchaseDone;
                      const isLockedCurrent = idx > 1 && !user?.isPurchaseDone;
                      const isLockedNext = (idx + 1) > 1 && !user?.isPurchaseDone;
                      // For collapsed view: progress from prev (left, 0%) to current (center, 50%)
                      // If at first stage (no prev), progress is 0; otherwise it's 50%
                      const collapsedProgress = prevStage ? 50 : 0;
                      return (
                        <motion.div
                          className="relative mt-3 px-3 pb-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          {/* Base track — horizontal line spanning left to right */}
                          <div className="absolute left-3 right-3 top-3 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-gray-800 via-gray-800 to-gray-800 z-0" />
                          {/* Active progress — fills from left to center (current stage) */}
                          <motion.div
                            className="absolute left-3 top-3 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-[#FAA2FF] via-[#FF8EEE] to-[#7A38FF] z-0"
                            initial={false}
                            animate={{ width: `${collapsedProgress}%` }}
                            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                            style={{ willChange: "width" }}
                          />
                          {/* Stars + labels row — same as desktop: items-center justify-between */}
                          <div className="relative flex items-center justify-between z-50">
                            {prevStage ? (
                              <button
                                type="button"
                                onClick={(e) => handleStageClick(prevStage, e)}
                                className="flex flex-col items-center gap-1 focus:outline-none opacity-100 blur-[0.5px] -ml-2 transition-opacity hover:opacity-70 disabled:opacity-40"
                                disabled={isLockedPrev}
                              >
                                <div className="relative scale-90">
                                  <StageStar isActive={false} isCompleted={idx > 0} isLocked={isLockedPrev} />
                                </div>
                                <span className="text-[10px] font-medium text-gray-400">{prevStage.toUpperCase()}</span>
                              </button>
                            ) : (
                              <div className="w-9" />
                            )}
                            {currentStage && (
                              <button
                                type="button"
                                onClick={(e) => handleStageClick(currentStage, e)}
                                className="flex flex-col items-center gap-1 focus:outline-none relative z-10"
                                disabled={isLockedCurrent}
                              >
                                <div className="relative">
                                  <StageStar isActive={true} isCompleted={false} isLocked={isLockedCurrent} />
                                </div>
                                <span className="text-[11px] font-medium text-white">{currentStage.toUpperCase()}</span>
                              </button>
                            )}
                            {nextStage ? (
                              <button
                                type="button"
                                onClick={(e) => handleStageClick(nextStage, e)}
                                className="flex flex-col items-center gap-1 focus:outline-none opacity-100 blur-[0.5px] -mr-2 transition-opacity hover:opacity-70 disabled:opacity-40"
                                disabled={isLockedNext}
                              >
                                <div className="relative scale-90">
                                  <StageStar isActive={false} isCompleted={false} isLocked={isLockedNext} />
                                </div>
                                <span className="text-[10px] font-medium text-gray-400">{nextStage.toUpperCase()}</span>
                              </button>
                            ) : (
                              <div className="w-9" />
                            )}
                          </div>
                        </motion.div>
                      );
                    })()
                  ) : (
                    <motion.div
                      className="mt-4 relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    >
                      {/* Vertical base track */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-gray-800 via-gray-800 to-gray-800" />
                      {/* Active progress along the track */}
                      {activeStageIndex > -1 && stages.length > 1 && (
                        <div
                          className="absolute left-1/2 top-0 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#FAA2FF] via-[#FF8EEE] to-[#7A38FF]"
                          style={{
                            height: `${(activeStageIndex / (stages.length - 1)) * 100}%`,
                          }}
                        />
                      )}
                      {/* Zig-zag stars + labels vertically */}
                      <div className="relative flex flex-col gap-4 px-10">
                        {stages.map((stage, index) => {
                          const isLocked = index > 1 && !user?.isPurchaseDone;
                          const isActive = user?.startupStage === stage;
                          const isCompleted =
                            activeStageIndex > -1 && index < activeStageIndex;
                          const alignLeft = index % 2 === 0;

                          return (
                            <button
                              key={stage}
                              type="button"
                              onClick={(e) => handleStageClick(stage, e)}
                              onMouseEnter={() => setHoveredStage(stage)}
                              onMouseLeave={() => setHoveredStage(null)}
                              className={`relative flex items-center gap-3 text-left focus:outline-none ${
                                alignLeft
                                  ? "self-start pr-10"
                                  : "self-end pl-10 flex-row-reverse"
                              }`}
                              data-tooltip-id="my-tooltip"
                              data-tooltip-content={
                                isLocked ? t("dashboard.purchasePlanToPlay") : ""
                              }
                              disabled={isLocked}
                            >
                              <div className="relative">
                                <StageStar
                                  isActive={isActive}
                                  isCompleted={isCompleted}
                                  isLocked={isLocked}
                                />
                                {isLocked && (
                                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] text-gray-200">
                                    <Lock size={10} />
                                  </span>
                                )}
                              </div>
                              <span
                                className={`text-[11px] font-medium ${
                                  isActive ? "text-white" : "text-gray-400"
                                }`}
                              >
                                {stage.toUpperCase()}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
                {/* Minimal collapse/expand toggle — mobile only */}
                <button
                  type="button"
                  onClick={() => setStagesCardCollapsed((c) => !c)}
                  className="mt-2 flex w-full items-center justify-center gap-1 py-1.5 text-[10px] font-medium uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-400 focus:outline-none"
                  aria-label={stagesCardCollapsed ? "Expand stages" : "Collapse stages"}
                >
                  {stagesCardCollapsed ? (
                    <>
                      <span className="inline-block translate-y-px">⋯</span>
                      <span>Show all stages</span>
                    </>
                  ) : (
                    <>
                      <span className="inline-block translate-y-px">−</span>
                      <span>Collapse</span>
                    </>
                  )}
                </button>
              </div>

              {/* Desktop / tablet: original horizontal timeline */}
              <div className="mt-3 hidden md:block">
                <div className="relative">
                  {/* Base track */}
                  <div className="absolute left-3 right-3 top-3 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-gray-800 via-gray-800 to-gray-800 z-0" />

                  {/* Active progress */}
                  {activeStageIndex > -1 && stages.length > 1 && (
                    <div
                      className="absolute left-3 top-3 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-[#FAA2FF] via-[#FF8EEE] to-[#7A38FF]"
                      style={{
                        width: `${(activeStageIndex / (stages.length - 1)) * 100}%`,
                      }}
                    />
                  )}

                  {/* Stars + labels */}
                  <div className="relative flex items-center justify-between">
                    {stages.map((stage, index) => {
                      const isLocked = index > 1 && !user?.isPurchaseDone;
                      const isActive = user?.startupStage === stage;
                      const isCompleted =
                        activeStageIndex > -1 && index < activeStageIndex;

                      return (
                        <button
                          key={stage}
                          type="button"
                          onClick={(e) => handleStageClick(stage, e)}
                          onMouseEnter={() => setHoveredStage(stage)}
                          onMouseLeave={() => setHoveredStage(null)}
                          className="flex flex-col items-center gap-1 text-center focus:outline-none relative z-10"
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content={
                            isLocked ? t("dashboard.purchasePlanToPlay") : ""
                          }
                          disabled={isLocked}
                        >
                          {/* Desktop StageStar marker - using stars.svg */}
                          <div className="relative flex items-center justify-center">
                            <div className={`relative ${isLocked ? "opacity-40" : "opacity-100"}`}>
                              {(isActive || isCompleted) && (
                                <span
                                  className="absolute inset-0 rounded-full blur-lg bg-gradient-to-r from-[#FAA2FF] via-[#FF8EEE] to-[#7A38FF] opacity-70"
                                  aria-hidden="true"
                                />
                              )}
                              <Image
                                src="/stars.svg"
                                alt="Stage star"
                                width={35}
                                height={35}
                                className="relative h-7 w-7 drop-shadow-[0_0_14px_rgba(122,56,255,0.9)]"
                              />
                            </div>
                            {isLocked && (
                              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] text-gray-200">
                                <Lock size={10} />
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[11px] font-medium ${
                              isActive ? "text-white" : "text-gray-400"
                            }`}
                          >
                            {stage.toUpperCase()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Goal */}
            <div className="hidden  absolute right-0 top-1/2 -translate-y-1/2 min-w-[160px] flex-col items-end text-right sm:flex">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                Goal:
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {user?.startupStage === "FFF"
                  ? t("dashboard.reachBuyers", { count: 10 })
                  : user?.startupStage === "Angels"
                    ? t("dashboard.reachBuyers", { count: 100 })
                    : user?.startupStage === "pre_seed"
                      ? t("dashboard.reachBuyers", { count: 500 })
                      : user?.startupStage === "Seed"
                        ? t("dashboard.reachBuyersWithCM", {
                          count: "2,500",
                        })
                        : user?.startupStage === "a"
                          ? t("dashboard.reachBuyersWithCMAndRevenue", {
                            count: "10,000",
                            cm: "100k",
                            revenue: "0",
                          })
                          : user?.startupStage === "b"
                            ? t("dashboard.reachBuyersWithCMAndRevenue", {
                              count: "50,000",
                              cm: "500k",
                              revenue: "100k",
                            })
                            : user?.startupStage === "c"
                              ? t("dashboard.reachBuyersWithCMAndRevenue", {
                                count: "100,000",
                                cm: "1M",
                                revenue: "500k",
                              })
                              : t("dashboard.highestStageUnlocked")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
          {/* Card 1: Financials */}
          <div className="lg:col-span-2 rounded-3xl border border-gray-800 bg-[#1B1B1D] p-3 sm:p-4 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
            {/* Mobile toggle between Available Funds and Breakdown */}
            <div className="mb-3 flex w-full md:hidden rounded-full bg-[#151516] p-1 text-xs font-medium text-gray-300">
              <button
                type="button"
                onClick={() => setActiveFinanceView("funds")}
                className={`flex-1 rounded-full px-3 py-2 transition-colors ${
                  activeFinanceView === "funds"
                    ? "bg-gradient-to-b from-[#F5D0FE] via-[#E9D5FF] to-[#DDD6FE] text-black"
                    : "text-gray-400"
                }`}
              >
                Available Funds
              </button>
              <button
                type="button"
                onClick={() => setActiveFinanceView("breakdown")}
                className={`flex-1 rounded-full px-3 py-2 transition-colors ${
                  activeFinanceView === "breakdown"
                    ? "bg-gradient-to-b from-[#F5D0FE] via-[#E9D5FF] to-[#DDD6FE] text-black"
                    : "text-gray-400"
                }`}
              >
                Financial Breakdown
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* Left Section: Available Funds */}
              <div
                className={`w-full md:w-auto flex-1 rounded-3xl bg-[#161618] p-4 ${
                  activeFinanceView === "funds" ? "block" : "hidden"
                } md:flex md:flex-col`}
              >


                {/* Header */}
                <div className="mb-4 text-left">
                  <p className="text-xs text-gray-400 mb-1">Available Funds</p>
                  <p className="text-2xl font-bold text-white">${user?.finances?.toLocaleString() ?? "0"}</p>
                </div>

                {/* Progress Bars with Labels - Mobile optimized */}
                <div className="flex flex-col gap-4 mt-6 md:mt-16">
                  {/* Investors */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        playSound("click");
                        setShowInvestorsModal(true);
                      }}
                      className="flex items-center gap-2 text-sm text-white hover:text-gray-300 transition-colors cursor-pointer w-full text-left"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#34c9a5]" />
                      <span>Investors</span>
                    </button>
                    <div className="relative h-3 w-full rounded-full overflow-hidden bg-gray-800">
                      <div
                        className="h-full rounded-full bg-[#34c9a5]"
                        style={{
                          width: `${Math.min(100, Math.max(0, user?.financesBreakdown?.Investors ?? 0))}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Founders */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        playSound("click");
                        setShowFoundersModal(true);
                      }}
                      className="flex items-center gap-2 text-sm text-white hover:text-gray-300 transition-colors cursor-pointer w-full text-left"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#7b5ef7]" />
                      <span>Founders</span>
                    </button>
                    <div className="relative h-3 w-full rounded-full overflow-hidden bg-gray-800">
                      <div
                        className="h-full rounded-full bg-[#7b5ef7]"
                        style={{
                          width: `${Math.min(100, Math.max(0, user?.financesBreakdown?.Founder ?? 0))}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Mentors */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        playSound("click");
                        setShowMentorsModal(true);
                      }}
                      className="flex items-center gap-2 text-sm text-white hover:text-gray-300 transition-colors cursor-pointer w-full text-left"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#ff6d63]" />
                      <span>Mentors</span>
                    </button>
                    <div className="relative h-3 w-full rounded-full overflow-hidden bg-gray-800">
                      <div
                        className="h-full rounded-full bg-[#ff6d63]"
                        style={{
                          width: `${Math.min(100, Math.max(0, user?.financesBreakdown?.Mentor ?? 0))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section: Financial metrics */}
              <div
                className={`w-full md:w-auto mt-4 md:mt-0 ${
                  activeFinanceView === "breakdown" ? "block" : "hidden"
                } md:flex md:flex-col`}
              >
                <div className="space-y-2">
                  {[
                    {
                      label: t("sidebar.salaries"),
                      value: user?.salaries ?? 0,
                      positive: false,
                      iconKey: (
                        <svg width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <foreignObject x="-4.15409" y="-4.67271" width="34.8348" height="23.7231">
                            <div style={{ backdropFilter: "blur(2.7px)", clipPath: "url(#bgblur_0_6543_2_clip_path)", height: "100%", width: "100%" }}></div>
                          </foreignObject>
                          <path data-figma-bg-blur-radius="5.4" d="M6.9135 0.891882L24.8444 5.69646C25.1087 5.76757 25.2507 6.0551 25.1466 6.30821C25.096 6.43084 24.994 6.52584 24.8679 6.56717L3.84111 13.4524C2.34107 13.9436 0.930726 12.4977 1.45933 11.0106L4.63179 2.09122C4.96368 1.15804 5.9568 0.635675 6.9135 0.891882Z" fill="url(#paint0_linear_6543_2)" stroke="url(#paint1_linear_6543_2)" strokeWidth="0.2" />
                          <foreignObject x="-5.03101" y="0.363428" width="38.2267" height="30.7209">
                            <div style={{ backdropFilter: "blur(2.7px)", clipPath: "url(#bgblur_1_6543_2_clip_path)", height: "100%", width: "100%" }}></div>
                          </foreignObject>
                          <path data-figma-bg-blur-radius="5.4" d="M3.36996 5.86304H24.7948C26.3964 5.86304 27.6961 7.16184 27.6961 8.76343V11.2371H18.7918C17.0798 11.2371 15.6922 12.6246 15.6922 14.3367V17.1111C15.6922 18.8232 17.0798 20.2107 18.7918 20.2107H27.6961V22.6843C27.6961 24.2859 26.3964 25.5847 24.7948 25.5847H3.36996C1.7683 25.5847 0.468597 24.2859 0.468597 22.6843V8.76343C0.468597 7.16184 1.7683 5.86304 3.36996 5.86304Z" fill="url(#paint2_linear_6543_2)" fillOpacity="0.3" stroke="url(#paint3_linear_6543_2)" strokeWidth="0.2" />
                          <path d="M27.7948 19.0632H19.1942C17.8136 19.0632 16.6943 17.9438 16.6942 16.5632V14.8845C16.6942 13.5038 17.8135 12.3845 19.1942 12.3845H27.7948V19.0632ZM20.8055 14.2849C20.0112 14.2851 19.3673 14.929 19.3671 15.7234C19.3671 16.5179 20.0111 17.1626 20.8055 17.1628C21.6002 17.1628 22.245 16.518 22.245 15.7234C22.2448 14.9289 21.6001 14.2849 20.8055 14.2849Z" fill="url(#paint4_linear_6543_2)" />
                          <path d="M8.21473 19.4516V12.1789H8.68064V19.4516H8.21473ZM9.45052 14.5795C9.4278 14.3503 9.33026 14.1723 9.15791 14.0454C8.98556 13.9185 8.75166 13.855 8.45621 13.855C8.25545 13.855 8.08594 13.8835 7.94768 13.9403C7.80943 13.9952 7.70336 14.0719 7.6295 14.1704C7.55753 14.2689 7.52155 14.3806 7.52155 14.5056C7.51776 14.6098 7.53954 14.7007 7.58689 14.7783C7.63613 14.856 7.70336 14.9232 7.78859 14.98C7.87382 15.035 7.9723 15.0833 8.08405 15.1249C8.19579 15.1647 8.31511 15.1988 8.442 15.2272L8.96473 15.3522C9.21852 15.409 9.45147 15.4848 9.66359 15.5795C9.87571 15.6742 10.0594 15.7907 10.2147 15.9289C10.37 16.0672 10.4903 16.23 10.5755 16.4175C10.6626 16.605 10.7072 16.82 10.709 17.0624C10.7072 17.4185 10.6162 17.7272 10.4363 17.9886C10.2583 18.248 10.0007 18.4497 9.66359 18.5937C9.32836 18.7357 8.92401 18.8068 8.45052 18.8068C7.98083 18.8068 7.57174 18.7348 7.22325 18.5908C6.87666 18.4469 6.60583 18.2338 6.41075 17.9516C6.21757 17.6675 6.11624 17.3162 6.10677 16.8977H7.29711C7.31037 17.0927 7.36624 17.2556 7.46473 17.3863C7.56511 17.5151 7.69863 17.6126 7.8653 17.6789C8.03386 17.7433 8.2242 17.7755 8.43632 17.7755C8.64465 17.7755 8.82552 17.7452 8.97893 17.6846C9.13424 17.624 9.2545 17.5397 9.33973 17.4318C9.42496 17.3238 9.46757 17.1997 9.46757 17.0596C9.46757 16.9289 9.42874 16.8191 9.35109 16.73C9.27533 16.641 9.16359 16.5653 9.01586 16.5028C8.87003 16.4403 8.69105 16.3835 8.47893 16.3323L7.84541 16.1732C7.35488 16.0539 6.96757 15.8674 6.68348 15.6136C6.39939 15.3598 6.25829 15.0179 6.26018 14.588C6.25829 14.2357 6.35204 13.928 6.54143 13.6647C6.73272 13.4014 6.99503 13.196 7.32836 13.0482C7.6617 12.9005 8.04049 12.8266 8.46473 12.8266C8.89655 12.8266 9.27344 12.9005 9.59541 13.0482C9.91927 13.196 10.1712 13.4014 10.3511 13.6647C10.531 13.928 10.6238 14.2329 10.6295 14.5795H9.45052Z" fill="url(#paint5_linear_6543_2)" />
                          <defs>
                            <clipPath id="bgblur_0_6543_2_clip_path" transform="translate(4.15409 4.67271)">
                              <path d="M6.9135 0.891882L24.8444 5.69646C25.1087 5.76757 25.2507 6.0551 25.1466 6.30821C25.096 6.43084 24.994 6.52584 24.8679 6.56717L3.84111 13.4524C2.34107 13.9436 0.930726 12.4977 1.45933 11.0106L4.63179 2.09122C4.96368 1.15804 5.9568 0.635675 6.9135 0.891882Z" />
                            </clipPath>
                            <clipPath id="bgblur_1_6543_2_clip_path" transform="translate(5.03101 -0.363428)">
                              <path d="M3.36996 5.86304H24.7948C26.3964 5.86304 27.6961 7.16184 27.6961 8.76343V11.2371H18.7918C17.0798 11.2371 15.6922 12.6246 15.6922 14.3367V17.1111C15.6922 18.8232 17.0798 20.2107 18.7918 20.2107H27.6961V22.6843C27.6961 24.2859 26.3964 25.5847 24.7948 25.5847H3.36996C1.7683 25.5847 0.468597 24.2859 0.468597 22.6843V8.76343C0.468597 7.16184 1.7683 5.86304 3.36996 5.86304Z" />
                            </clipPath>
                            <linearGradient id="paint0_linear_6543_2" x1="8.06828" y1="-4.29703" x2="27.1224" y2="25.9254" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#79FFD7" />
                              <stop offset="0.275735" stopColor="#D8DBFF" />
                              <stop offset="1" stopColor="#78D4FF" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_6543_2" x1="2.22811" y1="0.156011" x2="18.9824" y2="21.0146" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#706BFF" />
                              <stop offset="1" stopColor="#B7ECFF" />
                            </linearGradient>
                            <linearGradient id="paint2_linear_6543_2" x1="1.98809" y1="0.552272" x2="28.2147" y2="24.8143" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#79FFD7" />
                              <stop offset="0.275735" stopColor="#D8DBFF" />
                              <stop offset="1" stopColor="#78D4FF" />
                            </linearGradient>
                            <linearGradient id="paint3_linear_6543_2" x1="-1.65338" y1="6.54462" x2="25.8971" y2="25.6857" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#706BFF" />
                              <stop offset="1" stopColor="#B7ECFF" />
                            </linearGradient>
                            <linearGradient id="paint4_linear_6543_2" x1="18.066" y1="15.563" x2="25.9761" y2="18.7058" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#95B8FF" />
                              <stop offset="1" stopColor="#3BFFD8" />
                            </linearGradient>
                            <linearGradient id="paint5_linear_6543_2" x1="6.1243" y1="11.7244" x2="11.0201" y2="20.1571" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#F8DAFF" />
                              <stop offset="1" stopColor="#3BC1FF" />
                            </linearGradient>
                          </defs>
                        </svg>
                      )
                    },
                    {
                      label: t("sidebar.revenue"),
                      value: user?.revenue ?? 0,
                      positive: true,
                      iconKey: (
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1.04178" y="0.5" width="16.2114" height="16.2114" rx="8.10571" fill="url(#paint0_linear_6543_7)" />
                          <rect x="1.04178" y="0.5" width="16.2114" height="16.2114" rx="8.10571" stroke="url(#paint1_linear_6543_7)" />
                          <path d="M8.90379 13.5148V4.42389H9.48618V13.5148H8.90379ZM10.4485 7.4246C10.4201 7.13815 10.2982 6.91561 10.0828 6.75699C9.86734 6.59837 9.57496 6.51906 9.20564 6.51906C8.95469 6.51906 8.74281 6.55458 8.56999 6.6256C8.39717 6.69425 8.26459 6.79014 8.17226 6.91324C8.0823 7.03635 8.03732 7.17603 8.03732 7.33228C8.03258 7.46248 8.05981 7.57612 8.11899 7.67318C8.18055 7.77025 8.26459 7.85429 8.37112 7.92532C8.47766 7.99397 8.60076 8.05434 8.74044 8.10642C8.88012 8.15614 9.02927 8.19875 9.18789 8.23426L9.84129 8.39051C10.1585 8.46154 10.4497 8.55623 10.7149 8.6746C10.98 8.79298 11.2097 8.93857 11.4038 9.11139C11.5979 9.28422 11.7483 9.48782 11.8548 9.72219C11.9637 9.95657 12.0193 10.2253 12.0217 10.5283C12.0193 10.9734 11.9057 11.3593 11.6808 11.686C11.4582 12.0103 11.1363 12.2624 10.7149 12.4424C10.2958 12.6199 9.7904 12.7087 9.19854 12.7087C8.61142 12.7087 8.10005 12.6187 7.66445 12.4388C7.23121 12.2589 6.89267 11.9925 6.64882 11.6398C6.40735 11.2847 6.28069 10.8455 6.26885 10.3223H7.75678C7.77335 10.5662 7.84319 10.7698 7.96629 10.9331C8.09177 11.0941 8.25867 11.216 8.467 11.2989C8.67771 11.3794 8.91563 11.4196 9.18078 11.4196C9.4412 11.4196 9.66729 11.3818 9.85905 11.306C10.0532 11.2302 10.2035 11.1249 10.31 10.9899C10.4166 10.855 10.4698 10.6999 10.4698 10.5247C10.4698 10.3614 10.4213 10.2241 10.3242 10.1128C10.2296 10.0015 10.0899 9.90685 9.90522 9.82872C9.72292 9.7506 9.4992 9.67958 9.23405 9.61566L8.44215 9.41679C7.82898 9.26764 7.34485 9.03445 6.98973 8.71722C6.63462 8.39998 6.45825 7.97266 6.46061 7.43526C6.45825 6.99492 6.57543 6.61021 6.81218 6.28114C7.05129 5.95207 7.37917 5.6952 7.79584 5.51054C8.21251 5.32588 8.68599 5.23355 9.21629 5.23355C9.75607 5.23355 10.2272 5.32588 10.6296 5.51054C11.0345 5.6952 11.3493 5.95207 11.5742 6.28114C11.7992 6.61021 11.9152 6.99137 11.9223 7.4246H10.4485Z" fill="white" />
                          <foreignObject x="-5" y="-0.937744" width="34.6465" height="29.0869">
                            <div style={{ backdropFilter: "blur(2.5px)", clipPath: "url(#bgblur_0_6543_7_clip_path)", height: "100%", width: "100%" }}></div>
                          </foreignObject>
                          <path data-figma-bg-blur-radius="5" d="M1.33887 15.9529H3.38184C3.73192 15.9529 4.04525 16.0586 4.26855 16.2253C4.49186 16.3922 4.62012 16.6158 4.62012 16.8533V22.1492C4.62012 22.3866 4.49181 22.6093 4.26855 22.7761C4.04524 22.943 3.732 23.0496 3.38184 23.0496H1.33887C0.988767 23.0496 0.67546 22.9429 0.452148 22.7761C0.228844 22.6093 0.0996094 22.3866 0.0996094 22.1492V16.8533C0.0996094 16.6158 0.228844 16.3922 0.452148 16.2253C0.675445 16.0587 0.988889 15.9529 1.33887 15.9529ZM7.98047 12.4031H10.0234C10.3734 12.4031 10.6869 12.5088 10.9102 12.6755C11.1334 12.8423 11.2626 13.0651 11.2627 13.3025V22.1492C11.2627 22.3866 11.1335 22.6093 10.9102 22.7761C10.6868 22.9429 10.3735 23.0496 10.0234 23.0496H7.98047C7.63034 23.0495 7.31705 22.9429 7.09375 22.7761C6.87053 22.6093 6.74219 22.3866 6.74219 22.1492V13.3025C6.74228 13.0651 6.87054 12.8423 7.09375 12.6755C7.31705 12.5087 7.63034 12.4031 7.98047 12.4031ZM14.623 8.98022H16.666C17.0161 8.98025 17.3294 9.08586 17.5527 9.25269C17.7759 9.41945 17.9042 9.6423 17.9043 9.87964V22.1492C17.9043 22.3866 17.776 22.6093 17.5527 22.7761C17.3294 22.9429 17.0161 23.0495 16.666 23.0496H14.623C14.273 23.0496 13.9596 22.9429 13.7363 22.7761C13.513 22.6093 13.3838 22.3866 13.3838 22.1492V9.87964C13.3839 9.64229 13.5131 9.41946 13.7363 9.25269C13.9596 9.08598 14.273 8.98022 14.623 8.98022ZM21.2646 4.16187H23.3076C23.6577 4.16187 23.971 4.26852 24.1943 4.4353C24.4176 4.60213 24.5469 4.82481 24.5469 5.06226V22.1492C24.5469 22.3866 24.4176 22.6093 24.1943 22.7761C23.971 22.9429 23.6577 23.0496 23.3076 23.0496H21.2646C20.9145 23.0496 20.6012 22.943 20.3779 22.7761C20.1547 22.6093 20.0264 22.3866 20.0264 22.1492V5.06226C20.0264 4.82484 20.1547 4.60212 20.3779 4.4353C20.6012 4.26847 20.9145 4.16187 21.2646 4.16187Z" fill="url(#paint2_linear_6543_7)" fillOpacity="0.3" stroke="url(#paint3_linear_6543_7)" strokeWidth="0.2" />
                          <defs>
                            <clipPath id="bgblur_0_6543_7_clip_path" transform="translate(5 0.937744)">
                              <path d="M1.33887 15.9529H3.38184C3.73192 15.9529 4.04525 16.0586 4.26855 16.2253C4.49186 16.3922 4.62012 16.6158 4.62012 16.8533V22.1492C4.62012 22.3866 4.49181 22.6093 4.26855 22.7761C4.04524 22.943 3.732 23.0496 3.38184 23.0496H1.33887C0.988767 23.0496 0.67546 22.9429 0.452148 22.7761C0.228844 22.6093 0.0996094 22.3866 0.0996094 22.1492V16.8533C0.0996094 16.6158 0.228844 16.3922 0.452148 16.2253C0.675445 16.0587 0.988889 15.9529 1.33887 15.9529ZM7.98047 12.4031H10.0234C10.3734 12.4031 10.6869 12.5088 10.9102 12.6755C11.1334 12.8423 11.2626 13.0651 11.2627 13.3025V22.1492C11.2627 22.3866 11.1335 22.6093 10.9102 22.7761C10.6868 22.9429 10.3735 23.0496 10.0234 23.0496H7.98047C7.63034 23.0495 7.31705 22.9429 7.09375 22.7761C6.87053 22.6093 6.74219 22.3866 6.74219 22.1492V13.3025C6.74228 13.0651 6.87054 12.8423 7.09375 12.6755C7.31705 12.5087 7.63034 12.4031 7.98047 12.4031ZM14.623 8.98022H16.666C17.0161 8.98025 17.3294 9.08586 17.5527 9.25269C17.7759 9.41945 17.9042 9.6423 17.9043 9.87964V22.1492C17.9043 22.3866 17.776 22.6093 17.5527 22.7761C17.3294 22.9429 17.0161 23.0495 16.666 23.0496H14.623C14.273 23.0496 13.9596 22.9429 13.7363 22.7761C13.513 22.6093 13.3838 22.3866 13.3838 22.1492V9.87964C13.3839 9.64229 13.5131 9.41946 13.7363 9.25269C13.9596 9.08598 14.273 8.98022 14.623 8.98022ZM21.2646 4.16187H23.3076C23.6577 4.16187 23.971 4.26852 24.1943 4.4353C24.4176 4.60213 24.5469 4.82481 24.5469 5.06226V22.1492C24.5469 22.3866 24.4176 22.6093 24.1943 22.7761C23.971 22.9429 23.6577 23.0496 23.3076 23.0496H21.2646C20.9145 23.0496 20.6012 22.943 20.3779 22.7761C20.1547 22.6093 20.0264 22.3866 20.0264 22.1492V5.06226C20.0264 4.82484 20.1547 4.60212 20.3779 4.4353C20.6012 4.26847 20.9145 4.16187 21.2646 4.16187Z" />
                            </clipPath>
                            <linearGradient id="paint0_linear_6543_7" x1="4.45044" y1="4.31416" x2="14.3016" y2="12.3337" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FFC109" />
                              <stop offset="1" stopColor="#FFA02B" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_6543_7" x1="14.1531" y1="0.749924" x2="9.14749" y2="17.2114" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FF8000" />
                              <stop offset="1" stopColor="#FFE373" />
                            </linearGradient>
                            <linearGradient id="paint2_linear_6543_7" x1="1.55e-07" y1="19.501" x2="27.6013" y2="24.4758" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FFAEAE" />
                              <stop offset="1" stopColor="#FFBC40" />
                            </linearGradient>
                            <linearGradient id="paint3_linear_6543_7" x1="12.3232" y1="4.06226" x2="12.3232" y2="23.1492" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FFC47D" />
                              <stop offset="1" stopColor="white" />
                            </linearGradient>
                          </defs>
                        </svg>
                      )
                    },
                    {
                      label: t("sidebar.marketing"),
                      value: user?.marketing ?? 0,
                      positive: false,
                      iconKey: (
                        <svg width="29" height="27" viewBox="0 0 29 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <foreignObject x="9.5799" y="-5" width="23.9182" height="21.2107">
                            <div style={{ backdropFilter: "blur(2.5px)", clipPath: "url(#bgblur_0_6544_91_clip_path)", height: "100%", width: "100%" }}></div>
                          </foreignObject>
                          <rect data-figma-bg-blur-radius="5" x="14.6799" y="0.1" width="13.7182" height="11.0107" rx="2.9" fill="url(#paint0_linear_6544_91)" fillOpacity="0.3" stroke="url(#paint1_linear_6544_91)" strokeWidth="0.2" />
                          <path d="M11.4008 7.54261C10.2525 9.53157 7.79341 10.2617 5.90832 9.1733C4.02324 8.08494 3.42598 5.59029 4.57431 3.60133C5.72263 1.61237 8.1817 0.882285 10.0668 1.97064C11.9519 3.05899 12.5491 5.55365 11.4008 7.54261Z" fill="url(#paint2_linear_6544_91)" />
                          <path d="M16.862 10.6956C15.7137 12.6846 13.2546 13.4147 11.3695 12.3263C9.48443 11.238 8.88717 8.74331 10.0355 6.75435C11.1838 4.76539 13.6429 4.03531 15.528 5.12366C17.4131 6.21201 18.0103 8.70667 16.862 10.6956Z" fill="url(#paint3_linear_6544_91)" />
                          <path d="M6.34516 15.0123C6.23557 15.0445 6.12132 14.9785 6.09441 14.8675L4.04593 6.41742L14.6874 12.5613L6.34516 15.0123Z" fill="url(#paint4_linear_6544_91)" />
                          <path d="M11.6225 10.3116C11.2206 11.0077 10.1307 11.1309 9.18817 10.5867C8.24563 10.0426 7.80736 9.03709 8.20927 8.34095C8.61119 7.64482 9.70109 7.52163 10.6436 8.06581C11.5862 8.60999 12.0244 9.61546 11.6225 10.3116Z" fill="url(#paint5_linear_6544_91)" />
                          <path d="M21.6064 7.65894L22.3223 3.2953H23.0041L22.2882 7.65894H21.6064ZM19.6525 6.57655L19.7655 5.89473H23.1746L23.0616 6.57655H19.6525ZM20.0723 7.65894L20.7882 3.2953H21.47L20.7541 7.65894H20.0723ZM19.9018 5.0595L20.0169 4.37769H23.426L23.3109 5.0595H19.9018Z" fill="white" />
                          <foreignObject x="-2.28458" y="3.65894" width="32.1263" height="27.822">
                            <div style={{ backdropFilter: "blur(2.5px)", clipPath: "url(#bgblur_1_6544_91_clip_path)", height: "100%", width: "100%" }}></div>
                          </foreignObject>
                          <rect data-figma-bg-blur-radius="5" x="2.81542" y="8.75894" width="21.9263" height="17.6221" rx="2.9" fill="url(#paint6_linear_6544_91)" fillOpacity="0.3" stroke="url(#paint7_linear_6544_91)" strokeWidth="0.2" />
                          <path d="M17.0594 18.7781L15.9708 14.7231C15.8524 14.2822 15.3106 14.1197 14.9684 14.4226L14.2823 15.0298C13.5187 15.7056 12.608 16.1947 11.6223 16.4583C10.7972 16.6789 10.3082 17.5279 10.5293 18.3514C10.7504 19.1749 11.5991 19.6661 12.4242 19.4454C13.41 19.1818 14.4436 19.1508 15.4434 19.3551L16.3419 19.5385C16.7899 19.6301 17.1778 19.219 17.0594 18.7781Z" stroke="white" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12.3642 16.249L13.6133 20.8724" stroke="white" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                          <defs>
                            <clipPath id="bgblur_0_6544_91_clip_path" transform="translate(-9.5799 5)">
                              <rect x="14.6799" y="0.1" width="13.7182" height="11.0107" rx="2.9" />
                            </clipPath>
                            <clipPath id="bgblur_1_6544_91_clip_path" transform="translate(2.28458 -3.65894)">
                              <rect x="2.81542" y="8.75894" width="21.9263" height="17.6221" rx="2.9" />
                            </clipPath>
                            <linearGradient id="paint0_linear_6544_91" x1="21.539" y1="0" x2="21.539" y2="11.2107" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#43FFBD" />
                              <stop offset="1" stopColor="#36ABFF" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_6544_91" x1="21.539" y1="0" x2="21.539" y2="11.2107" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#43FFBD" />
                              <stop offset="1" stopColor="#36ABFF" />
                            </linearGradient>
                            <linearGradient id="paint2_linear_6544_91" x1="12.7974" y1="3.54715" x2="6.14385" y2="15.0714" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FF4379" />
                              <stop offset="1" stopColor="#FF363A" />
                            </linearGradient>
                            <linearGradient id="paint3_linear_6544_91" x1="12.7974" y1="3.54715" x2="6.14385" y2="15.0714" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FF4379" />
                              <stop offset="1" stopColor="#FF363A" />
                            </linearGradient>
                            <linearGradient id="paint4_linear_6544_91" x1="12.7974" y1="3.54715" x2="6.14385" y2="15.0714" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FF4379" />
                              <stop offset="1" stopColor="#FF363A" />
                            </linearGradient>
                            <linearGradient id="paint5_linear_6544_91" x1="12.7974" y1="3.54715" x2="6.14385" y2="15.0714" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FF4379" />
                              <stop offset="1" stopColor="#FF363A" />
                            </linearGradient>
                            <linearGradient id="paint6_linear_6544_91" x1="13.7786" y1="8.65894" x2="13.7786" y2="26.481" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FF4379" />
                              <stop offset="1" stopColor="#FF363A" />
                            </linearGradient>
                            <linearGradient id="paint7_linear_6544_91" x1="13.7786" y1="8.65894" x2="13.7786" y2="26.481" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FF4379" />
                              <stop offset="1" stopColor="#FF363A" />
                            </linearGradient>
                          </defs>
                        </svg>
                      )
                    },
                    {
                      label: t("sidebar.rent"),
                      value: user?.rent ?? 0,
                      positive: false,
                      iconKey: (
                        <svg width="26" height="33" viewBox="0 0 26 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.3457 14.1238L10.8709 4.02972C11.6707 2.9569 13.278 2.9569 14.0778 4.02972L21.603 14.1238" stroke="url(#paint0_linear_6638_766)" strokeLinecap="round" strokeLinejoin="round" />
                          <foreignObject x="-3.6543" y="9" width="33" height="25">
                            <div
                              style={{
                                backdropFilter: "blur(2px)",
                                clipPath: "url(#bgblur_0_6638_766_clip_path)",
                                height: "100%",
                                width: "100%"
                              }}
                            ></div>
                          </foreignObject>
                          <g data-figma-bg-blur-radius="4">
                            <rect x="0.445703" y="13.1" width="24.8" height="16.8" rx="1.9" fill="url(#paint1_linear_6638_766)" fillOpacity="0.3" />
                            <rect x="0.445703" y="13.1" width="24.8" height="16.8" rx="1.9" stroke="url(#paint2_linear_6638_766)" strokeWidth="0.2" />
                            <path d="M5.9817 23.5V19.096H6.5697V23.5H5.9817ZM8.6877 23.5L7.2357 21.55H7.9257L9.4017 23.5H8.6877ZM6.3477 21.916V21.394H7.5237C7.7077 21.394 7.8657 21.356 7.9977 21.28C8.1297 21.204 8.2317 21.1 8.3037 20.968C8.3757 20.832 8.4117 20.678 8.4117 20.506C8.4117 20.334 8.3757 20.182 8.3037 20.05C8.2317 19.914 8.1297 19.808 7.9977 19.732C7.8657 19.652 7.7077 19.612 7.5237 19.612H6.3477V19.096H7.4157C7.7357 19.096 8.0157 19.144 8.2557 19.24C8.4957 19.336 8.6817 19.484 8.8137 19.684C8.9457 19.884 9.0117 20.142 9.0117 20.458V20.554C9.0117 20.87 8.9437 21.128 8.8077 21.328C8.6757 21.528 8.4897 21.676 8.2497 21.772C8.0137 21.868 7.7357 21.916 7.4157 21.916H6.3477ZM11.4023 23.608C11.1223 23.608 10.8803 23.56 10.6763 23.464C10.4723 23.368 10.3063 23.242 10.1783 23.086C10.0503 22.926 9.95428 22.748 9.89028 22.552C9.83028 22.356 9.80028 22.156 9.80028 21.952V21.844C9.80028 21.636 9.83028 21.434 9.89028 21.238C9.95428 21.042 10.0503 20.866 10.1783 20.71C10.3063 20.55 10.4683 20.424 10.6643 20.332C10.8643 20.236 11.0983 20.188 11.3663 20.188C11.7143 20.188 12.0003 20.264 12.2243 20.416C12.4523 20.564 12.6203 20.756 12.7283 20.992C12.8403 21.228 12.8963 21.48 12.8963 21.748V22.006H10.0523V21.574H12.4763L12.3443 21.808C12.3443 21.58 12.3083 21.384 12.2363 21.22C12.1643 21.052 12.0563 20.922 11.9123 20.83C11.7683 20.738 11.5863 20.692 11.3663 20.692C11.1383 20.692 10.9483 20.744 10.7963 20.848C10.6483 20.952 10.5363 21.094 10.4603 21.274C10.3883 21.454 10.3523 21.662 10.3523 21.898C10.3523 22.126 10.3883 22.332 10.4603 22.516C10.5363 22.696 10.6523 22.84 10.8083 22.948C10.9643 23.052 11.1623 23.104 11.4023 23.104C11.6543 23.104 11.8583 23.048 12.0143 22.936C12.1743 22.824 12.2703 22.694 12.3023 22.546H12.8423C12.7983 22.766 12.7103 22.956 12.5783 23.116C12.4463 23.276 12.2803 23.398 12.0803 23.482C11.8803 23.566 11.6543 23.608 11.4023 23.608ZM13.7141 23.5V20.296H14.1701V21.67H14.0981C14.0981 21.354 14.1401 21.088 14.2241 20.872C14.3121 20.652 14.4441 20.486 14.6201 20.374C14.7961 20.258 15.0181 20.2 15.2861 20.2H15.3101C15.7141 20.2 16.0121 20.326 16.2041 20.578C16.4001 20.83 16.4981 21.194 16.4981 21.67V23.5H15.9221V21.55C15.9221 21.302 15.8521 21.104 15.7121 20.956C15.5721 20.804 15.3801 20.728 15.1361 20.728C14.8841 20.728 14.6801 20.806 14.5241 20.962C14.3681 21.118 14.2901 21.326 14.2901 21.586V23.5H13.7141ZM18.8 23.536C18.56 23.536 18.352 23.502 18.176 23.434C18.004 23.366 17.87 23.25 17.774 23.086C17.682 22.918 17.636 22.692 17.636 22.408V19.324H18.188V22.48C18.188 22.652 18.234 22.786 18.326 22.882C18.422 22.974 18.556 23.02 18.728 23.02H19.292V23.536H18.8ZM17.084 20.728V20.296H19.292V20.728H17.084Z" fill="white" />
                          </g>
                          <circle cx="12.4747" cy="2.91565" r="1.74182" fill="url(#paint3_linear_6638_766)" />
                          <defs>
                            <clipPath id="bgblur_0_6638_766_clip_path" transform="translate(3.6543 -9)">
                              <rect x="0.445703" y="13.1" width="24.8" height="16.8" rx="1.9" />
                            </clipPath>
                            <linearGradient id="paint0_linear_6638_766" x1="12.4744" y1="1.87891" x2="12.4744" y2="14.1238" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FFAD76" />
                              <stop offset="1" stopColor="#FF7E47" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_6638_766" x1="12.8457" y1="13" x2="12.8457" y2="30" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FFAD76" />
                              <stop offset="1" stopColor="#FF7E47" />
                            </linearGradient>
                            <linearGradient id="paint2_linear_6638_766" x1="23.9003" y1="13" x2="0.431332" y2="27.8511" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FFAD76" />
                              <stop offset="1" stopColor="#FF6828" />
                            </linearGradient>
                            <linearGradient id="paint3_linear_6638_766" x1="12.4747" y1="1.17383" x2="12.4747" y2="4.65747" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FF9955" />
                              <stop offset="0.951281" stopColor="#FF812D" />
                            </linearGradient>
                          </defs>
                        </svg>
                      )
                    },
                    {
                      label: t("sidebar.costOfSales"),
                      value: user?.costOfSales ?? 0,
                      positive: false,
                      iconKey: (
                        <svg width="31" height="24" viewBox="0 0 31 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g filter="url(#filter0_d_6544_83)">
                            <rect x="4.54169" y="6.65576" width="13.6167" height="3.37426" rx="1" fill="url(#paint0_linear_6544_83)" />
                          </g>
                          <foreignObject x="-4.99997" y="2.69238" width="32.7502" height="26.0955">
                            <div
                              style={{
                                backdropFilter: "blur(2.5px)",
                                clipPath: "url(#bgblur_0_6544_83_clip_path)",
                                height: "100%",
                                width: "100%"
                              }}
                            ></div>
                          </foreignObject>
                          <path data-figma-bg-blur-radius="5" d="M0.793976 7.79199H21.9561C22.3392 7.79199 22.6501 8.10242 22.6504 8.48535V22.9941C22.6502 23.3773 22.3393 23.6875 21.9561 23.6875H0.793976C0.410905 23.6873 0.099812 23.3771 0.0996399 22.9941V8.48535C0.100005 8.1026 0.41096 7.7922 0.793976 7.79199Z" fill="url(#paint1_linear_6544_83)" fillOpacity="0.3" stroke="url(#paint2_linear_6544_83)" strokeWidth="0.2" />
                          <path d="M21.75 4.04858C22.3023 4.04858 22.75 4.4963 22.75 5.04858V6.42261C22.75 6.97483 22.3023 7.42261 21.75 7.42261H1.00003C0.447895 7.42249 0.000104814 6.97475 3.05176e-05 6.42261V5.04858C3.05176e-05 4.49637 0.447849 4.04871 1.00003 4.04858H21.75ZM8.93655 4.74585C8.78267 4.74605 8.65834 4.87124 8.65823 5.02515C8.65823 5.17914 8.7826 5.30425 8.93655 5.30444H14.6719C14.826 5.30444 14.9512 5.17926 14.9512 5.02515C14.9511 4.87112 14.826 4.74585 14.6719 4.74585H8.93655Z" fill="url(#paint3_linear_6544_83)" />
                          <g filter="url(#filter2_dd_6544_83)">
                            <path d="M17.6785 4.79235C17.7949 4.23905 18.3484 3.89279 18.897 4.02992L21.7048 4.73179C21.9371 4.7899 22.141 4.93031 22.2787 5.12621L26.6457 11.3361C26.9619 11.7858 26.8548 12.4073 26.406 12.7247L22.8765 15.2191C22.4261 15.5375 21.8025 15.4297 21.4851 14.9787L17.1559 8.82238C16.9971 8.59633 16.9395 8.31409 16.9963 8.04369L17.6785 4.79235ZM18.6521 5.49946C18.5714 5.82302 18.7679 6.15063 19.0914 6.23163C19.4151 6.31253 19.7434 6.11607 19.8245 5.79254C19.9055 5.46879 19.7083 5.14013 19.3845 5.0592C19.0608 4.97842 18.733 5.17579 18.6521 5.49946Z" fill="url(#paint4_linear_6544_83)" />
                          </g>
                          <path d="M23.2462 12.3451L20.6225 8.63333L20.8603 8.46525L23.484 12.177L23.2462 12.3451ZM22.21 9.18112C22.0887 9.0465 21.9375 8.98232 21.7564 8.98858C21.5753 8.99484 21.3948 9.06152 21.2151 9.1886C21.0836 9.28153 20.9836 9.3841 20.9151 9.49632C20.8475 9.60786 20.8125 9.72032 20.81 9.83369C20.8085 9.94639 20.8412 10.0501 20.9082 10.1448C20.9642 10.2241 21.0312 10.2789 21.1092 10.3093C21.1875 10.338 21.2699 10.3501 21.3565 10.3454C21.4424 10.3398 21.5268 10.3258 21.6096 10.3035C21.6917 10.2802 21.7654 10.2564 21.8308 10.2319L22.1898 10.1C22.2814 10.0656 22.3873 10.0328 22.5073 10.0016C22.6283 9.96974 22.7541 9.95399 22.8848 9.95436C23.0158 9.95308 23.1437 9.98013 23.2684 10.0355C23.393 10.0909 23.5046 10.1882 23.6029 10.3274C23.7164 10.4878 23.7768 10.6625 23.7843 10.8515C23.7927 11.0398 23.7437 11.2288 23.6372 11.4186C23.5317 11.6077 23.3649 11.7829 23.1367 11.9441C22.9241 12.0945 22.7157 12.1903 22.5116 12.2317C22.3084 12.2724 22.119 12.2628 21.9433 12.2029C21.7685 12.1423 21.618 12.0349 21.4916 11.8807L21.8627 11.6183C21.9517 11.7236 22.055 11.7898 22.1726 11.8168C22.2906 11.8421 22.4129 11.8368 22.5397 11.8008C22.6667 11.7632 22.7892 11.7027 22.9072 11.6194C23.0444 11.5223 23.152 11.413 23.2298 11.2913C23.3069 11.1687 23.349 11.0447 23.356 10.9194C23.3625 10.7931 23.3274 10.6758 23.2509 10.5675C23.1812 10.4689 23.0969 10.4082 22.9981 10.3853C22.8993 10.3624 22.7912 10.3633 22.674 10.3882C22.5568 10.4131 22.4357 10.4479 22.3108 10.4927L21.8717 10.6466C21.5925 10.7439 21.3416 10.7785 21.1188 10.7504C20.896 10.7224 20.7139 10.6083 20.5725 10.4082C20.455 10.2419 20.3974 10.0652 20.3998 9.87791C20.4026 9.68899 20.456 9.50624 20.5602 9.32965C20.6647 9.15142 20.8117 8.99534 21.0012 8.86142C21.1926 8.72614 21.3869 8.6402 21.5843 8.60361C21.781 8.56605 21.9645 8.57548 22.1349 8.63192C22.3062 8.68766 22.4472 8.78874 22.558 8.93515L22.21 9.18112Z" fill="white" />
                          <defs>
                            <filter id="filter0_d_6544_83" x="0.541687" y="6.65576" width="21.6168" height="12.3743" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                              <feFlood floodOpacity="0" result="BackgroundImageFix" />
                              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                              <feOffset dy="5" />
                              <feGaussianBlur stdDeviation="2" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix type="matrix" values="0 0 0 0 0.810203 0 0 0 0 0.482371 0 0 0 0 1 0 0 0 0.25 0" />
                              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6544_83" />
                              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6544_83" result="shape" />
                            </filter>
                            <clipPath id="bgblur_0_6544_83_clip_path" transform="translate(4.99997 -2.69238)">
                              <path d="M0.793976 7.79199H21.9561C22.3392 7.79199 22.6501 8.10242 22.6504 8.48535V22.9941C22.6502 23.3773 22.3393 23.6875 21.9561 23.6875H0.793976C0.410905 23.6873 0.099812 23.3771 0.0996399 22.9941V8.48535C0.100005 8.1026 0.41096 7.7922 0.793976 7.79199Z" />
                            </clipPath>
                            <filter id="filter2_dd_6544_83" x="12.9749" y="0" width="17.8524" height="21.4021" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                              <feFlood floodOpacity="0" result="BackgroundImageFix" />
                              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                              <feOffset />
                              <feGaussianBlur stdDeviation="2" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.347756 0 0 0 0 0.869551 0 0 0 0.21 0" />
                              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6544_83" />
                              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                              <feOffset dy="2" />
                              <feGaussianBlur stdDeviation="2" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.56 0" />
                              <feBlend mode="normal" in2="effect1_dropShadow_6544_83" result="effect2_dropShadow_6544_83" />
                              <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_6544_83" result="shape" />
                            </filter>
                            <linearGradient id="paint0_linear_6544_83" x1="8.09095" y1="6.65576" x2="11.4563" y2="12.1791" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#738DFF" />
                              <stop offset="1" stopColor="#CA4FFF" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_6544_83" x1="5.92997" y1="7.69238" x2="21.5399" y2="16.6658" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#738DFF" />
                              <stop offset="1" stopColor="#CA4FFF" />
                            </linearGradient>
                            <linearGradient id="paint2_linear_6544_83" x1="5.92997" y1="7.69238" x2="21.5399" y2="16.6658" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#738DFF" />
                              <stop offset="1" stopColor="#F1D2FF" />
                            </linearGradient>
                            <linearGradient id="paint3_linear_6544_83" x1="5.92997" y1="4.04858" x2="8.36732" y2="10.7328" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#738DFF" />
                              <stop offset="1" stopColor="#CA4FFF" />
                            </linearGradient>
                            <linearGradient id="paint4_linear_6544_83" x1="15.7701" y1="13.5496" x2="29.11" y2="8.90281" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#738DFF" />
                              <stop offset="1" stopColor="#8A4FFF" />
                            </linearGradient>
                          </defs>
                        </svg>
                      )
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-3xl w-full bg-[#111113] px-4 py-3"
                    >
                      {/* Icon placeholder - SVG will be pasted here */}
                      <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center">
                        {/* SVG placeholder for {item.iconKey} */}
                        <div className="w-full h-full flex items-center justify-center text-md text-gray-500">
                          {item.iconKey}
                        </div>
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-xs text-gray-400">{item.label}</span>
                        <span className="text-sm font-medium text-white">
                          {item.positive ? `$${item.value}` : `-$${Math.abs(item.value)}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Core metrics */}
          <div
            className={`lg:col-span-3 rounded-3xl border border-gray-800 bg-[#151516] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col ${elonStep === 2 ? "ring-2 ring-blue-500 animate-pulse" : ""
              }`}
          >
            {/* <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  {t("dashboard.coreMetrics")}
                </p>
                <h3 className="text-lg font-semibold text-white">
                  {t("dashboard.trackNumbers")}
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("dashboard.tapMetric")}
              </p>
            </div> */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 flex-1 items-stretch">
              {user &&
                user.metrics &&
                orderedMetrics.map((metric, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleMetricClick(getShortName(metric), e)}
                    className="rounded-2xl border border-gray-800 bg-[#161618] p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gray-700 hover:bg-[#151623] h-full flex flex-col"
                  >
                    <div className="flex justify-between flex-col">
                      <span className="text-md font-medium text-[#fff]">
                        {getShortName(metric)} <br/>
                      </span>
                      <span className="text-xs font-medium text-[#5E5E5E]">
                        ({getFullMetricName(metric)})
                      </span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-white mt-auto">
                      {(() => {
                        const shortName = getShortName(metric);
                        const value = user?.metrics?.[metric] ?? 0;

                        let displayValue;
                        if (shortName === "UA" || shortName === "B") {
                          displayValue = Math.floor(value);
                        } else if (Number.isInteger(value) || countDecimalPlaces(value) <= 2) {
                          displayValue = value;
                        } else {
                          displayValue = value.toFixed(2);
                        }

                        let percentageChange: number | null = null;
                        if (previousMetrics && previousMetrics[metric] !== undefined && user?.metrics) {
                          const prevValue = previousMetrics[metric];
                          const currentValue = user.metrics[metric];
                          const change = currentValue - prevValue;
                          if (Math.abs(change) > 0.0001) {
                            if (Math.abs(prevValue) > 0.0001) {
                              percentageChange = (change / Math.abs(prevValue)) * 100;
                            } else if (Math.abs(currentValue) > 0.0001) {
                              percentageChange = currentValue > 0 ? 100 : -100;
                            } else {
                              percentageChange = null;
                            }
                          }
                        }

                        return (
                          <div className="flex flex-col">
                            <span>
                              {displayValue}
                              {shortName === "C1" ? "%" : ""}
                              {dollarMetrics.includes(shortName) ? "$" : ""}
                            </span>
                            {percentageChange !== null && Math.abs(percentageChange) >= 0.01 && (
                              <span
                                className={`mt-1 text-xs font-semibold ${percentageChange > 0
                                  ? "text-green-500"
                                  : "text-red-400"
                                  }`}
                              >
                                {percentageChange > 0 ? "+" : ""}
                                {percentageChange.toFixed(2)}%
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </p>
                  </button>
                ))}
            </div>
          </div>

          {/* Card 3: Team Cards */}
          <div className="lg:col-span-1 relative rounded-3xl border border-gray-800 bg-[#151516] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
            {/* Edit Team Button */}
            <button
              onClick={() => {
                playSound("click");
                setShowTeamModal(true);
              }}
              className="mb-4 rounded-3xl bg-[#0e0e10] px-3 py-2 inline-flex items-center gap-1.5 w-fit hover:bg-gray-200/15 transition-colors cursor-pointer"
            >
              <span className="text-xs font-medium text-white">Edit Team</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2H3.33333C2.97971 2 2.64057 2.14048 2.39052 2.39052C2.14048 2.64057 2 2.97971 2 3.33333V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H12.6667C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667V8" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.25 1.74991C12.5152 1.48469 12.8749 1.33569 13.25 1.33569C13.6251 1.33569 13.9848 1.48469 14.25 1.74991C14.5152 2.01512 14.6642 2.37483 14.6642 2.74991C14.6642 3.12498 14.5152 3.48469 14.25 3.74991L8.24136 9.75924C8.08305 9.9174 7.88749 10.0332 7.67269 10.0959L5.75735 10.6559C5.69999 10.6726 5.63918 10.6736 5.58129 10.6588C5.52341 10.644 5.47057 10.6139 5.42832 10.5716C5.38607 10.5294 5.35595 10.4765 5.34112 10.4186C5.32629 10.3607 5.32729 10.2999 5.34402 10.2426L5.90402 8.32724C5.96704 8.11261 6.08304 7.91728 6.24136 7.75924L12.25 1.74991Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Team Member List */}
            <div className="flex flex-col px-2 gap-5 flex-1 justify-center mt-1">
              {(() => {
                const stageKeyMap: Record<string, string> = {
                  FFF: "FFF",
                  Angels: "ANGELS",
                  pre_seed: "PRE_SEED",
                  Seed: "SEED",
                  a: "A",
                  b: "B",
                  c: "C",
                  d: "D",
                  "pre-IPO": "PREIPO",
                  preIpo: "PREIPO",
                  IPO: "IPO",
                };
                const stageKey = user?.startupStage
                  ? stageKeyMap[user.startupStage] || user.startupStage.toUpperCase()
                  : "FFF";
                const allowedEmployees = new Set(stagesInfo[stageKey]?.employees ?? []);

                const isUnlocked = (label: string) => {
                  if (label === "CEO" || label === "Developer" || label === "Sales") return true;
                  return allowedEmployees.has(label);
                };

                const roleCount = (label: string) => {
                  const get = (pred: (m: any) => boolean) =>
                    user?.teamMembers?.find(pred)?.quantity ?? 0;
                  if (label === "Developer") {
                    return get(
                      (m) =>
                        m.roleName?.toLowerCase() === "dev" ||
                        m.roleName?.toLowerCase() === "developer",
                    );
                  }
                  if (label === "CEO") return get((m) => m.roleName?.toLowerCase() === "ceo");
                  if (label === "Sales") return get((m) => m.roleName?.toLowerCase() === "sales");
                  if (label === "Designer")
                    return get((m) => m.roleName?.toLowerCase() === "designer");
                  if (label === "QA") return get((m) => m.roleName?.toLowerCase() === "qa");
                  if (label === "Manager")
                    return get((m) => m.roleName?.toLowerCase() === "manager");
                  return 0;
                };

                const roles = [
                  { label: "Developer", icon: <DevIcon /> },
                  { label: "CEO", icon: <CeoIcon /> },
                  { label: "Sales", icon: <SalesIcon /> },
                  {
                    label: "Designer",
                    icon: (
                      <Image
                        src="/employees/designerIcon.svg"
                        alt="Designer"
                        width={32}
                        height={32}
                      />
                    ),
                  },
                  {
                    label: "QA",
                    icon: (
                      <Image src="/employees/qaIcon.svg" alt="QA" width={32} height={32} />
                    ),
                  },
                  {
                    label: "Manager",
                    icon: (
                      <Image
                        src="/employees/managerIcon.svg"
                        alt="Manager"
                        width={32}
                        height={32}
                      />
                    ),
                  },
                ];

                return roles.map((role) => {
                  const unlocked = isUnlocked(role.label);
                  const count = unlocked ? roleCount(role.label) : 0;
                  return (
                <div key={role.label} className="flex items-center gap-3">
                  <div className="flex-shrink-0">{role.icon}</div>
                  <div className="flex-1">
                    <span
                      className={`text-md font-medium ${
                        unlocked ? "text-white" : "text-[#515152]"
                      }`}
                    >
                      {role.label}
                    </span>
                  </div>
                  <span
                    className={`text-md font-semibold ${
                      unlocked ? "text-[#D9D9D9]" : "text-[#515152]"
                    }`}
                  >
                    {count}
                  </span>
                </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* Secondary controls row (AI advisor + tutorial) */}
        {/* <div className="mb-2 mt-4 flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={() => {
              playSound("click");
              setChatModalOpen(true);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-100/5 px-5 py-2.5 text-sm font-medium text-white shadow-sm ring-1 ring-gray-700/60 backdrop-blur hover:bg-gray-100/10 hover:ring-gray-500 transition duration-200 sm:w-auto sm:min-w-[180px]"
          >
            <InfoIcon className="h-4 w-4" />
            {t("dashboard.askAIAdvisor")}
          </button>
          <button
            onClick={handleShowTutorial}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-700/70 bg-transparent px-5 py-2.5 text-sm font-medium text-gray-200 hover:border-gray-400 hover:bg-gray-100/5 transition duration-150 sm:w-auto"
            title={t("dashboard.startElonTutorial")}
          >
            <ArrowRight className="h-4 w-4" />
            {t("dashboard.showTutorial")}
          </button>
        </div> */}

        {/* Filters bar (restored) */}
        {/* <div className="mb-4 mt-2 w-full rounded-3xl bg-[#11121a]/90 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-gray-800">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
            <span className="px-3 py-2 text-sm font-semibold text-gray-400">Filters</span>
            <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#c26bff] to-[#5e7bff] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 transition">
              In Progress
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">×</span>
            </button>
            {["UA", "C1", "AOV", "COGS", "APC", "CPA", "BUGS"].map((label) => (
              <button
                key={label}
                className="rounded-full bg-[#0f1018] px-4 py-2 text-xs font-medium text-gray-200 hover:bg-[#161824] transition"
              >
                {label}
              </button>
            ))}
          </div>
        </div> */}

        {/* Tasks grid – main bottom section */}
        <SpotlightModal
          isOpen={modalInfo.isOpen}
          onClose={handleModalClose}
          title={modalInfo.title}
          content={modalInfo.content}
          anchorEl={modalInfo.anchorEl}
          selectedMetric={selectedMetric}
        />
        <div
          className={`relative w-full items-center rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] ${elonStep === 4 ? "ring-1 ring-blue-600 animate-pulse" : ""
            } lg:static`}
        >
          <TaskGrid />
        </div>
      </div>
      {/* Floating Make Turn Button - z-40 on mobile so modals (z-[99999]) always appear on top; desktop keeps z-[9999] */}
      <button
        onClick={() => {
          playSound("click");
          makeTurn(turnAmount);
        }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
        }}
        className={`z-40 md:z-[9999] rounded-lg bg-gradient-to-b from-[#F5D0FE] via-[#E9D5FF] to-[#DDD6FE] text-black backdrop-blur-md border border-gray-200/20 dark:border-gray-600/20 flex items-center justify-center transition-all duration-300 shadow-2xl
          hover:bg-gray-800/95 dark:hover:bg-gray-600/95 
          hover:scale-105 hover:-translate-y-1
          hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:shadow-gray-900/60
          active:scale-100 active:translate-y-0
          group relative overflow-hidden
          ${isScrolling
            ? 'px-4 py-3 min-w-[60px] md:min-w-[200px] rounded-full'
            : 'px-6 py-4 min-w-[180px] md:min-w-[200px] flex-col'
          }
          ${elonStep === 7 ? 'ring-2 ring-blue-500 animate-pulse' : ''}
        `}
      >
        {/* Animated gradient shimmer effect on hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></span>


        {/* Bug count badge */}
        {/* {(() => {
          const bugCount = user?.tasks?.filter((task: any) => task.isBug === true).length || 0;
          return bugCount > 0 ? (
            <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg ring-2 ring-white dark:ring-gray-900 z-20">
              {bugCount > 9 ? '9+' : bugCount}
            </span>
          ) : null;
        })()} */}


        {isScrolling ? (
          <span className="font-bold text-black text-lg relative z-10 group-hover:scale-110 transition-transform duration-300">{t("dashboard.makeTurn")}</span>
        ) : (
          <>
            <span className="font-bold text-black text-lg mb-2 relative z-10 group-hover:scale-105 transition-transform duration-300">{t("dashboard.makeTurn")}</span>
            <div className="flex justify-between items-center w-full px-2 pt-2 border-t border-black/10 relative z-10 group-hover:border-black/20 transition-colors duration-300">
              <span className="font-medium text-black text-sm">{t("dashboard.income")}</span>
              <span className={`text-lg font-bold transition-all duration-300 group-hover:scale-110 ${Number(turnAmount) >= 0 ? 'text-green-300 group-hover:text-green-400' : 'text-red-300 group-hover:text-red-400'}`}>${turnAmount}</span>
            </div>
          </>
        )}
      </button>






      {confirmationAction && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 sm:px-0">
          <div className="bg-white dark:bg-boxdark p-4 sm:p-6 rounded-xl w-full max-w-sm shadow-lg text-center max-h-[90vh] overflow-y-auto">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">Confirm Action</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
              Are you sure you want to {confirmationAction === 'skip'
                ? 'skip the bug fix duration (60 Venture coins)?'
                : confirmationAction === 'buyout'
                  ? 'buy out this bug (60 Venture coins)?'
                  : 'use Bug Prevention Insurance (25 Venture coins)?'}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmBugAction}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmationAction(null)}
                className="border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 text-gray-700 dark:text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Notification Modal */}
      {isNotificationModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-0">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeNotificationModal}
          />
          <div className="relative w-full max-w-5xl rounded-2xl bg-[#1B1B1D96] border border-white/10 p-4 sm:p-6 shadow-lg backdrop-blur-sm bg-opacity-70 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 flex-shrink-0">
              <h2 className="text-xl sm:text-2xl font-medium text-white">Logs</h2>
              <button
                onClick={closeNotificationModal}
                className="text-white hover:text-gray-300 transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Logs List */}
            <div className="flex-1 min-h-0 max-h-[60vh] sm:max-h-[500px] overflow-y-auto space-y-2 sm:space-y-3 pr-1 sm:pr-2">
              {isTranslatingNotifications ? (
                <p className="text-center text-gray-400 py-8">{t("common.loading")}</p>
              ) : translatedNotifications.length === 0 ? (
                <p className="text-center text-gray-400 py-8">{t("modals.notifications.noNotificationsAvailable")}</p>
              ) : (
                translatedNotifications
                  .slice()
                  .reverse()
                  .map((msg, idx) => {
                    // Parse message to extract type and description
                    const parseMessage = (message: string) => {
                      // Check for patterns like "Task completed :", "Great Move :", "Bad move", etc.
                      const colonIndex = message.indexOf(":");
                      if (colonIndex !== -1) {
                        const type = message.substring(0, colonIndex).trim();
                        const description = message.substring(colonIndex + 1).trim();
                        return { type, description };
                      }
                      // If no colon, check for "Bad move" or similar patterns
                      if (message.toLowerCase().includes("bad move")) {
                        const parts = message.split(/bad move/i);
                        return {
                          type: "Bad Move",
                          description: parts[1] ? parts[1].trim() : message
                        };
                      }
                      // Default: use entire message as description
                      return {
                        type: msg.isPositive ? "Great Move" : "Bad Move",
                        description: message
                      };
                    };

                    const { type, description } = parseMessage(msg.message);
                    const statusText = msg.isPositive ? "Great Move" : "Bad Move";
                    const statusType = type || (msg.isPositive ? "Task Completed" : "Error Occurred");

                    return (
                      <div
                        key={idx}
                        className="rounded-xl bg-[#161618] dark:bg-[#161618] p-4 border border-gray-700 dark:border-gray-700 flex items-start gap-4 justify-between items-center"
                      >
                        {/* Left side - Status */}
                        <div className="flex-shrink-0">
                          <p
                            className={`text-lg font-semibold mb-1 ${msg.isPositive
                              ? "text-green-500"
                              : "text-red-500"
                              }`}
                          >
                            {statusText}
                          </p>
                          <p className="text-xs text-gray-400">
                            {statusType}
                          </p>
                        </div>

                        {/* Right side - Description */}
                        <div className="flex-2 min-w-0">
                          <p className="text-sm text-gray-400">
                            {description}
                          </p>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {showSkipBugModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 sm:px-0">
          <div className="bg-white dark:bg-boxdark p-4 sm:p-6 rounded-xl w-full max-w-sm shadow-lg text-center max-h-[90vh] overflow-y-auto">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-2">Manage Bug</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mb-4">
              Choose how you want to resolve or prevent bugs. Options vary in cost and effect.
            </p>

            <div className="flex flex-col space-y-3">

              <button
                onClick={() => setConfirmationAction('buyout')}
                className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Buyout Bug
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2 mb-2">
                Permanently removes one active bug without a turn. Best for critical issues. Cost:  3500 Venture coins.
              </p>

              <div className="relative border-t pt-2 border-gray-300 dark:border-gray-600">
                <p className="text-xs uppercase text-gray-400 dark:text-gray-500">OR</p>
              </div>

              <button
                onClick={() => setConfirmationAction('prevent')}
                className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Bug Prevention Insurance
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
                Prevents bugs from triggering this turn. Usable once every 3 turns. Cost: 2500 Venture coins.
              </p>

              <button
                onClick={() => setShowSkipBugModal(false)}
                className="border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 text-gray-700 dark:text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {chatModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg h-[90vh] max-h-[650px] flex flex-col p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-2xl bg-white dark:bg-[#1b1f23]/70 dark:backdrop-blur-xl border border-gray-300 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2 sm:mb-3 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate pr-2">{t("modals.aiAdvisor.title")}</h2>
              <button
                onClick={() => {
                  setChatModalOpen(false);
                  setChatMessages([
                    {
                      sender: 'elon',
                      text: translatedGreeting || t("modals.aiAdvisor.greeting"),
                    },
                  ]);
                }}
                className="text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 text-lg font-bold"
              >
                ×
              </button>
            </div>

            {/* Chat Scrollable Area */}
            <div
              className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar"
              ref={(el) => {
                if (el && !isTyping) {
                  const lastMessage = el.lastElementChild;
                  if (lastMessage) {
                    lastMessage.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }
              }}
            >
              {chatMessages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
                      {isUser ? (
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                      ) : (
                        <Image
                          src="/elon.png"
                          alt="AI"
                          width={32}
                          height={32}
                          className="rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <div className={`whitespace-pre-wrap break-words px-4 py-3 rounded-2xl text-sm shadow-md ${isUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-[#2d3746]/70 text-gray-900 dark:text-white"
                        }`}>
                        {idx === 0 && !isUser
                          ? <TypewriterText text={msg.text} speed={20} />
                          : <p>{msg.text}</p>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {isTyping && (
                <div className="flex items-start gap-2">
                  <Image src="/elon.png" alt="AI" width={32} height={32} className="rounded-full" />
                  <div className="bg-gray-100 dark:bg-[#2c3440]/80 px-4 py-2 rounded-2xl text-sm shadow-md">
                    <div className="flex space-x-1 animate-pulse">
                      <span className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full" />
                      <span className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full" />
                      <span className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="mt-2 mb-2 bg-gray-100 dark:bg-[#1e2630]/60 p-2 rounded-xl shadow-inner max-h-[72px] overflow-y-auto">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">{t("modals.aiAdvisor.needHelp")}</p>
              <div className="flex flex-wrap gap-2">
                {[
                  t("modals.aiAdvisor.suggestions.increaseUA"),
                  t("modals.aiAdvisor.suggestions.prioritizeMetrics"),
                  t("modals.aiAdvisor.suggestions.reduceBugs"),
                  t("modals.aiAdvisor.suggestions.hireDecision"),
                  t("modals.aiAdvisor.suggestions.bestTasks"),
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setUserInput(prompt)}
                    className="text-xs sm:text-sm px-3 py-1 bg-white dark:bg-[#3c4658] hover:bg-gray-200 dark:hover:bg-[#485267] text-gray-900 dark:text-white rounded-full shadow-sm transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Field */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!userInput.trim()) return;
                const question = userInput.trim();
                setChatMessages(prev => [...prev, { sender: "user", text: question }]);
                setUserInput("");
                setIsTyping(true);

                try {
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai-hint`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      token: localStorage.getItem("userToken") || "",
                    },
                    body: JSON.stringify({ gameId: user?.gameId, promptFromUser: question }),
                  });

                  const data = await res.json();
                  setUser(data);
                  setChatMessages(prev => [
                    ...prev,
                    {
                      sender: "elon",
                      text: res.ok && data?.hint
                        ? data?.hint
                        : t("modals.aiAdvisor.errorUnknown"),
                    },
                  ]);
                } catch {
                  setChatMessages(prev => [
                    ...prev,
                    { sender: "elon", text: t("modals.aiAdvisor.errorGeneric") },
                  ]);
                } finally {
                  setIsTyping(false);
                }
              }}
              className="mt-2 flex items-end gap-2"
            >
              <textarea
                rows={1}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={t("modals.aiAdvisor.placeholder")}
                className="flex-grow resize-none overflow-hidden px-4 py-2 text-sm sm:text-base rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2c3440]/80 text-gray-900 dark:text-white shadow-sm placeholder:text-gray-500 dark:placeholder:text-gray-400"
                onInput={(e) => {
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                }}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-4 py-2 rounded-full"
              >
                {t("modals.aiAdvisor.send")}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {showBoostModal && (
        <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 sm:px-0">
          <div className="bg-white dark:bg-boxdark rounded-xl w-full max-w-md p-4 sm:p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4 gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white truncate">Special Task Speed Boost</h2>
              <button
                onClick={() => setShowBoostModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 font-bold flex-shrink-0"
              >
                ×
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
              Auto-complete any 1-turn task instantly. Saves time and opens up bandwidth for higher-value tasks. <br />
              <span className="text-indigo-500 font-medium">Cost: 50 Venture coins</span>
            </p>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {[
                { id: 1, name: "Fix Signup Flow", credits: 50 },
                { id: 2, name: "Optimize CTA", credits: 50 },
                { id: 3, name: "Polish UI Spacing", credits: 50 },
              ].map((task) => (
                <div key={task.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{task.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">1-turn task — Cost: 50 Venture coins</p>
                  </div>
                  <button
                    onClick={() => {
                      // console.log(`Boosted task: ${task.name}`);
                      setShowBoostModal(false);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1.5 rounded-lg"
                  >
                    Boost
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowBoostModal(false)}
              className="mt-4 w-full text-sm border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 px-4 py-2 rounded-lg text-gray-700 dark:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stage Upgrade Modal */}
      {stageUpgradeData && (
        <StageUpgradeModal
          isOpen={showStageUpgradeModal}
          onClose={() => {
            setShowStageUpgradeModal(false);
            setStageUpgradeData(null);
            // Show turn progress modal after stage upgrade modal closes
            if (pendingTurnProgress) {
              setPendingTurnProgress(false);
              setShowTurnProgressModal(true);
            }
          }}
          previousStage={stageUpgradeData.previousStage}
          currentStage={stageUpgradeData.currentStage}
          nextGoal={stageUpgradeData.nextGoal}
        />
      )}

      {/* Turn Progress Modal */}
      <TurnProgressModal
        isOpen={showTurnProgressModal}
        onClose={() => {
          setShowTurnProgressModal(false);
          setPreviousUserState(null);
          setTurnNotifications([]);
        }}
        previousState={previousUserState}
        currentState={user}
        notifications={turnNotifications}
      />

      {/* Team Management Modal */}
      <TeamManagementModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
      />

      {/* Investors Modal */}
      <InvestorsModal
        isOpen={showInvestorsModal}
        onClose={() => setShowInvestorsModal(false)}
      />

      {/* Mentors Modal */}
      <MentorsModal
        isOpen={showMentorsModal}
        onClose={() => setShowMentorsModal(false)}
      />

      {/* Founders Modal */}
      {showFoundersModal && (
        <InfoModal
          isOpen={showFoundersModal}
          onClose={() => setShowFoundersModal(false)}
          title={t("modals.founders.title") || "Founders"}
          content={
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t("modals.founders.description") || "Founders are the original creators and owners of the startup. They typically hold equity in the company and are responsible for its strategic direction and growth."}
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {t("modals.founders.equity") || "Equity Share"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {user?.financesBreakdown?.Founder ?? 0}%
                </p>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};
export default ECommerce;
