"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import TaskGrid from "../CardDataStats";
import { InfoIcon, ArrowRight, X } from "lucide-react";
import TooltipModal from "@/components/TooltipModal";
import { Bell } from "lucide-react";
import { Tooltip } from 'react-tooltip'
import SpotlightModal from "@/components/SpotlightModal";

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
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
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
            return e.taskId === elem.taskId && e.isBug === elem.isBug
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
    <>
      <Tooltip id="my-tooltip" />
      {showElon && <ElonAssistant onStepChange={setElonStep} />}
      {loader && (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex gap-2 mb-4">
            <div className="h-4 w-4 animate-bounce rounded-full bg-blue-700 [animation-delay:.1s]"></div>
            <div className="h-4 w-4 animate-bounce rounded-full bg-blue-700 [animation-delay:.3s]"></div>
            <div className="h-4 w-4 animate-bounce rounded-full bg-blue-700 [animation-delay:.5s]"></div>
          </div>
          <p className="text-white text-sm font-medium mt-2">{loaderMessage}</p>
        </div>
      )}

      {
        gameOverModal ? <GameOverModal /> : null
      }


      {
        notEnoughCredits ? <NotEnoughCredits /> : null
      }
      <div
        className={`mb-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-5 shadow-sm transition-all duration-300 ${
          elonStep === 1 ? "ring-2 ring-blue-500 animate-pulse" : ""
        }`}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              {t("dashboard.startupStages")}
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("dashboard.chooseStage")}
            </h3>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {user?.startupStage === "FFF"
              ? `${t("dashboard.goal")}: ${t("dashboard.reachBuyers", { count: 10 })}`
              : user?.startupStage === "Angels"
                ? `${t("dashboard.goal")}: ${t("dashboard.reachBuyers", { count: 100 })}`
                : user?.startupStage === "pre_seed"
                  ? `${t("dashboard.goal")}: ${t("dashboard.reachBuyers", { count: 500 })}`
                  : user?.startupStage === "Seed"
                    ? `${t("dashboard.goal")}: ${t("dashboard.reachBuyersWithCM", { count: "2,500" })}`
                    : user?.startupStage === "a"
                      ? `${t("dashboard.goal")}: ${t("dashboard.reachBuyersWithCMAndRevenue", { count: "10,000", cm: "100k", revenue: "0" })}`
                      : user?.startupStage === "b"
                        ? `${t("dashboard.goal")}: ${t("dashboard.reachBuyersWithCMAndRevenue", { count: "50,000", cm: "500k", revenue: "100k" })}`
                        : user?.startupStage === "c"
                          ? `${t("dashboard.goal")}: ${t("dashboard.reachBuyersWithCMAndRevenue", { count: "100,000", cm: "1M", revenue: "500k" })}`
                          : t("dashboard.highestStageUnlocked")}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stages.map((stage, index) => {
            console.log("user", user)
            console.log("user?.isPurchaseDone", user?.isPurchaseDone)
            console.log("index > 1 && !user?.isPurchaseDone" , index > 1 && !user?.isPurchaseDone) 
            const isLocked = index > 1 && !user?.isPurchaseDone ;
            console.log("isLocked" ,  isLocked) 
            const isActive = user?.startupStage === stage;
            return (
              <button
                key={stage}
                onClick={(e) => handleStageClick(stage, e)}
                onMouseEnter={() => setHoveredStage(stage)}
                onMouseLeave={() => setHoveredStage(null)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                  isActive
                    ? "border-gray-900 bg-gray-900 text-white shadow-md dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200 dark:hover:border-gray-600"
                }`}
                data-tooltip-id="my-tooltip"
                data-tooltip-content={
                  isLocked ? t("dashboard.purchasePlanToPlay") : ""
                }
              >
                <span className="text-sm font-semibold">{stage}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  {isLocked && <Lock size={12} />}
                  {hoveredStage === stage && <InfoIcon size={12} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>


      <div
        className={`mb-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-5 shadow-sm transition-all duration-300 ${
          elonStep === 2 ? "ring-2 ring-blue-500 animate-pulse" : ""
        }`}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              {t("dashboard.coreMetrics")}
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("dashboard.trackNumbers")}
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("dashboard.tapMetric")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {user &&
            user.metrics &&
            orderedMetrics.map((metric, index) => (
              <button
                key={index}
                onClick={(e) => handleMetricClick(getShortName(metric), e)}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gray-400 hover:bg-white dark:border-gray-800 dark:bg-gray-800/60 dark:hover:border-gray-600"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {getShortName(metric)}
                  </span>
                </div>
                <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
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

                    // Calculate percentage change from previous turn
                    let percentageChange: number | null = null;
                    if (previousMetrics && previousMetrics[metric] !== undefined && user?.metrics) {
                      const prevValue = previousMetrics[metric];
                      const currentValue = user.metrics[metric];
                      const change = currentValue - prevValue;
                      
                      // Show percentage if there's any change (even small ones)
                      if (Math.abs(change) > 0.0001) {
                        if (Math.abs(prevValue) > 0.0001) {
                          // Calculate percentage change
                          percentageChange = (change / Math.abs(prevValue)) * 100;
                        } else if (Math.abs(currentValue) > 0.0001) {
                          // Previous was near zero, show as 100% change
                          percentageChange = currentValue > 0 ? 100 : -100;
                        } else {
                          // Both are near zero, no change
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
                          <span className={`mt-1 text-xs font-semibold ${
                            percentageChange > 0 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {percentageChange > 0 ? "+" : ""}{percentageChange.toFixed(2)}%
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
      <div className="mt-6 mb-6 flex flex-col sm:flex-row gap-3 justify-end w-full">
        <button
          onClick={() => {
            playSound("click");
            setChatModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 text-sm font-medium bg-gray-900 dark:bg-gray-700 text-white dark:text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-gray-800 dark:hover:bg-gray-600 transition duration-200 w-full sm:w-auto sm:min-w-[160px]"
        >
          <InfoIcon className="w-4 h-4" />
          {t("dashboard.askAIAdvisor")}
        </button>
        <button
          onClick={handleShowTutorial}
          className="flex items-center justify-center gap-2 text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750 px-5 py-2.5 rounded-lg transition duration-150 w-full sm:w-auto"
          title={t("dashboard.startElonTutorial")}
        >
          <ArrowRight className="w-4 h-4" />
          {t("dashboard.showTutorial")}
        </button>
      </div>

      <SpotlightModal
        isOpen={modalInfo.isOpen}
        onClose={handleModalClose}
        title={modalInfo.title}
        content={modalInfo.content}
        anchorEl={modalInfo.anchorEl}
        selectedMetric={selectedMetric}
      />
      <div className={`mt-4 w-full relative items-center 
     ${elonStep === 4 ? "ring-1 ring-blue-600 p-4 rounded-2xl animate-pulse" : ''}
      lg:static md:mt-4 2xl:mt-7.5`}>
        <TaskGrid />
      </div>
      {/* Floating Make Turn Button */}
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
        className={` rounded-xl bg-gray-900/95 dark:bg-gray-700/95 backdrop-blur-md border border-gray-200/20 dark:border-gray-600/20 flex items-center justify-center transition-all duration-300 shadow-2xl
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
        {(() => {
          const bugCount = user?.tasks?.filter((task: any) => task.isBug === true).length || 0;
          return bugCount > 0 ? (
            <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg ring-2 ring-white dark:ring-gray-900 z-20">
              {bugCount > 9 ? '9+' : bugCount}
            </span>
          ) : null;
        })()}
        
        {isScrolling ? (
          <span className="font-bold text-white text-lg relative z-10 group-hover:scale-110 transition-transform duration-300">{t("dashboard.makeTurn")}</span>
        ) : (
          <>
            <span className="font-bold text-white text-lg mb-2 relative z-10 group-hover:scale-105 transition-transform duration-300">{t("dashboard.makeTurn")}</span>
            <div className="flex justify-between items-center w-full px-2 pt-2 border-t border-white/10 relative z-10 group-hover:border-white/20 transition-colors duration-300">
              <span className="font-medium text-white text-sm">{t("dashboard.income")}</span>
              <span className={`text-lg font-bold transition-all duration-300 group-hover:scale-110 ${Number(turnAmount) >= 0 ? 'text-green-300 group-hover:text-green-200' : 'text-red-300 group-hover:text-red-200'}`}>${turnAmount}</span>
            </div>
          </>
        )}
      </button>






      {confirmationAction && (
        <div className="fixed inset-0 z-[999999] flex items-center m-5 justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-boxdark p-6 rounded-xl w-full max-w-sm shadow-lg text-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Confirm Action</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeNotificationModal}
          />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("modals.notifications.title")}</h2>
              <button
                onClick={closeNotificationModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2">
              {isTranslatingNotifications ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t("common.loading")}</p>
              ) : translatedNotifications.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t("modals.notifications.noNotificationsAvailable")}</p>
              ) : (
                translatedNotifications
                  .slice()
                  .reverse()
                  .map((msg, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg p-4 border ${msg.isPositive
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                        }`}
                    >
                      <p
                        className={`text-sm font-medium ${msg.isPositive
                            ? "text-green-700 dark:text-green-400"
                            : "text-red-700 dark:text-red-400"
                          }`}
                      >
                        {msg.message}
                      </p>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {showSkipBugModal && (
        <div className="fixed inset-0 z-[99999] flex items-center m-5 lg:m-0 justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-boxdark p-6 rounded-xl w-full max-w-sm shadow-lg text-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Manage Bug</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
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
        <div className="fixed m-5 lg:m-0 inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg h-[90vh] max-h-[650px] flex flex-col p-5 rounded-3xl shadow-2xl bg-white dark:bg-[#1b1f23]/70 dark:backdrop-blur-xl border border-gray-300 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("modals.aiAdvisor.title")}</h2>
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
        <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-boxdark rounded-xl w-full max-w-md p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Special Task Speed Boost</h2>
              <button
                onClick={() => setShowBoostModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 font-bold"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
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

      {/* </div> */}
    </>
  );
};

export default ECommerce;
