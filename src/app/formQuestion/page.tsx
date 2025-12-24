"use client"
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, LayoutGrid, Users, Target, Flag, DollarSign, BarChart3, Wallet, TrendingUp } from 'lucide-react';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import formImage from '../../../public/illustrations/business_plan.svg'

const industries = [
  "E-commerce", "SaaS", "Media", "Healthcare", "Education", "Fintech", "Finance",
  "AI", "ClimateTech", "AgriTech", "Clean Energy", "Mobility", "Logistics",
  "Web3", "Gaming", "PropTech", "LegalTech", "Travel", "Food & Beverage", "Retail", "Other"
];

const initialAnswers = {
  businessName: '',
  industry: '',
  productType: '',
  targetAudience: '',
  goal: '',
  businessModel : '',
  businessDescription: '', 
  // 👇 UPDATED: Specific Numeric Inputs
  startingFunding: '100000', // Default $100k
  startingRevenue: '0',      // Default $0 MRR
  startingUsers: '0',        // Default 0 users
  northStarMetric: 'userAcquisition' 
};

export default function StartupBasicsForm() {
  const [formData, setFormData] = useState(initialAnswers);
  const { user, setUser, setloader, setUserState, setLoaderMessage, userLoaded } = useUser();
  const router = useRouter(); 
  
  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  useEffect(() => {
    if (!userLoaded) return;
    if (!user) {
      router.push("/auth/signin");
    } else if (user.isAiCustomizationDone && ! user.difficultyMode) {
      router.push("/modeSelect");
    }
  }, [user, router, userLoaded]);
  
  const handleSubmit = async () => {
    if (!user || !user.gameId) return;
  
    setloader(true);
  
    const messages = [
      "🔍 Analyzing your financials...",
      "💰 Injecting starting capital...",
      "🧠 Calibrating mentors for your industry...",
      "✨ Generating custom tasks...",
      "🚀 Preparing your simulation..."
    ];
  
    let index = 0;
    setLoaderMessage(messages[index]);
    const intervalId = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoaderMessage(messages[index]);
    }, 2200);
  
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/taskCustomization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
        body: JSON.stringify({
          ...formData,
          gameId: user.gameId,
        }),
      });
  
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setUserState(data);
        router.push("/modeSelect")
      } else {
        console.error("API Error:", data);
      }
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      clearInterval(intervalId);
      setLoaderMessage("");
      setloader(false);
    }
  };


  const startupTemplates = [
    {
      businessName: "BoltCart",
      industry: "E-commerce",
      productType: "1-hour delivery platform for local stores",
      targetAudience: "Busy city shoppers",
      goal: "Partner with 100 stores in 3 months",
      businessModel: "D2C",
      businessDescription: "BoltCart connects busy city dwellers with nearby stores to get essentials delivered in under an hour.",
      // Financials for this template
      startingFunding: '100000',
      startingRevenue: '0',
      startingUsers: '0',
      northStarMetric: 'userAcquisition'
    },
    {
      businessName: "MediConnect",
      industry: "Healthcare",
      productType: "Telemedicine app for seniors",
      targetAudience: "Elderly population",
      goal: "Sign up 500 senior patients",
      businessModel: "B2C",
      businessDescription: "MediConnect enables elderly patients to consult doctors from home using an easy-to-use telemedicine app.",
      // Financials for this template
      startingFunding: '150000',
      startingRevenue: '0',
      startingUsers: '50',
      northStarMetric: 'userAcquisition'
    },
    {
      businessName: "EduSpark",
      industry: "Education",
      productType: "AI Tutoring Platform",
      targetAudience: "High school students",
      goal: "Launch pilot program in 10 schools",
      businessModel: "B2B",
      businessDescription: "EduSpark uses AI to deliver personalized tutoring experiences for students. Schools can integrate it to support academic success.",
      // Financials for this template
      startingFunding: '250000',
      startingRevenue: '1000',
      startingUsers: '5',
      northStarMetric: 'revenue' // B2B focuses on Revenue
    },
    {
      businessName: "FinanceEase",
      industry: "Finance",
      productType: "Personal Finance Manager App",
      targetAudience: "Young professionals",
      goal: "Acquire 2000 active users",
      businessModel: "B2C",
      businessDescription: "FinanceEase helps young professionals track spending, set goals, and build smarter financial habits.",
      // Financials for this template
      startingFunding: '100000',
      startingRevenue: '0',
      startingUsers: '0',
      northStarMetric: 'userAcquisition'
    },
  ];
  
  return (
    <DefaultLayout> 
      <div className={` ${user?.isAiCustomizationDone ? 
        'left-[86%] top-[31%]' : 'left-[66%] top-[31%]' } top-[31%] hidden  xl:block fixed`}>
        <Image
          src={formImage}
          width={ user?.isAiCustomizationDone ? 200 :  400}
          height={ user?.isAiCustomizationDone ? 200 : 400}
          alt='image'
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative z-10 max-w-3xl 
        ${user?.isAiCustomizationDone ? 'mx-auto' : 'mx-0'} p-8 
        rounded-3xl shadow-xl bg-white dark:bg-[#0f172a] text-[#111827] dark:text-white space-y-6 mt-10`}
      >
        <h1 className="text-3xl font-bold text-center">Startup Simulation Setup</h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Enter your specific data so we can tailor the mentors, goals, and difficulty.
        </p>

        {/* --- Core Business Info --- */}
        <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2 dark:border-gray-700">1. Core Concept</h3>
            {[
                { 
                label: "Startup Name", 
                icon: <Building2 />, 
                key: "businessName", 
                placeholder: "e.g. QuantumDynamics" 
                },
                { 
                label: "Industry", 
                icon: <LayoutGrid />, 
                key: "industry", 
                type: "select",
                options: industries
                },
                { 
                label: "Business Description (Crucial for AI)", 
                icon: <Target />, 
                key: "businessDescription", 
                placeholder: "e.g. Developing stable qubits for banking security..." 
                },
                { 
                label: "Business Model", 
                icon: <Target />, 
                key: "businessModel", 
                type: "select",
                options: ["B2C (Business to Consumer)", "D2C (Direct to Consumer)", "B2B (Business to Business)", "Marketplace", "SaaS", "DeepTech"]
                },
                { 
                label: "Product / Service", 
                icon: <LayoutGrid />, 
                key: "productType", 
                placeholder: "e.g. Quantum Encryption API" 
                },
                { 
                label: "Target Audience", 
                icon: <Users />, 
                key: "targetAudience", 
                placeholder: "e.g. Global Banks" 
                },
                { 
                label: "Main Goal", 
                icon: <Flag />, 
                key: "goal", 
                placeholder: "e.g. Secure 5 Pilot Banks" 
                }
            ].map(({ label, icon, key, type, placeholder, options }) => (
                <div key={key} className="space-y-2">
                <label className="font-normal flex items-center gap-2 text-base">
                    {icon} {label}
                </label>
                {type === 'select' ? (
                    <select
                    value={formData[key as keyof typeof formData]}
                    onChange={(e) => handleChange(key as keyof typeof formData, e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white focus:outline-none"
                    >
                    <option value="">Select...</option>
                    {options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                    </select>
                ) : key === "businessDescription" ? (
                    <textarea
                    rows={2}
                    placeholder={placeholder}
                    value={formData[key as keyof typeof formData] || ""}
                    onChange={(e) => handleChange(key as keyof typeof formData, e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white focus:outline-none resize-none"
                    />
                ) : (
                    <input
                    type="text"
                    placeholder={placeholder}
                    value={formData[key as keyof typeof formData]}
                    onChange={(e) => handleChange(key as keyof typeof formData, e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white focus:outline-none"
                    />
                )}
                </div>
            ))}
        </div>

        {/* --- Financial Snapshot (The Granular Data) --- */}
        <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 space-y-4">
            <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                <Wallet className="w-5 h-5"/> 2. Financial Snapshot
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="font-normal flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4" /> Current Monthly Revenue ($)
                    </label>
                    <input
                    type="number"
                    value={formData.startingRevenue}
                    onChange={(e) => handleChange("startingRevenue", e.target.value)}
                    className="w-full p-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none"
                    placeholder="0"
                    />
                </div>
                <div className="space-y-2">
                    <label className="font-normal flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" /> Current User Base
                    </label>
                    <input
                    type="number"
                    value={formData.startingUsers}
                    onChange={(e) => handleChange("startingUsers", e.target.value)}
                    className="w-full p-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none"
                    placeholder="0"
                    />
                </div>
            </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base rounded-xl shadow-md dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          🚀 Launch Simulation
        </button>
      </motion.div>
      
      {/* 👇 RESTORED: Quick Startup Idea Heading */}
      <div className="mt-10 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Confused? Just want to get started?</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Pick one of these ready-to-go startup ideas! (Pre-fills financial data too)</p>
      </div>

      {/* 👇 RESTORED: Startup Idea Cards */}
      {!user?.isAiCustomizationDone && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mb-8">
          {startupTemplates.map((template, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setFormData(template); 
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer p-6 rounded-2xl shadow-md bg-gray-100 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-700 transition-all border dark:border-gray-700"
            >
              <h3 className="text-xl font-bold mb-2">{template.businessName}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{template.industry}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">&quot;{template.goal}&quot;</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{template.productType}</p>
              
              {/* Optional: Show financial hint on the card */}
               <div className="flex gap-2 mt-3">
                  <span className="text-[10px] bg-indigo-200 dark:bg-indigo-900 px-2 py-1 rounded-full text-indigo-800 dark:text-indigo-200">
                    {template.businessModel}
                  </span>
                  <span className="text-[10px] bg-green-200 dark:bg-green-900 px-2 py-1 rounded-full text-green-800 dark:text-green-200">
                    ${parseInt(template.startingFunding).toLocaleString()} Funding
                  </span>
               </div>
            </motion.div>
          ))}
        </div>
      )}
    </DefaultLayout>
  );
}