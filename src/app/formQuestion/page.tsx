"use client"
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building2, LayoutGrid, Users, Target, Flag, Wallet, TrendingUp, MapPin } from 'lucide-react';
import Select from 'react-select'; // Import for better dropdowns
import countryList from 'react-select-country-list'; // Import for real country data
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
  businessLocation: '',
  targetAudience: '',
  goal: '',
  businessModel : '',
  businessDescription: '', 
  startingFunding: '100000',
  startingRevenue: '0',
  startingUsers: '0',
  northStarMetric: 'userAcquisition' 
};

export default function StartupBasicsForm() {
  const [formData, setFormData] = useState(initialAnswers);
  const { user, setUser, setloader, setUserState, setLoaderMessage, userLoaded } = useUser();
  const router = useRouter(); 

  // Initialize the country list for the dropdown
  const countryOptions = useMemo(() => countryList().getData(), []);
  
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

    // --- VALIDATION LOGIC ---
    // 1. Business Description Word Count (Max 200 words)
    const descriptionWords = formData.businessDescription.trim().split(/\s+/).filter(Boolean);
    if (descriptionWords.length > 200) {
        alert("🚨 Business Description is too long! Please keep it under 200 words so the AI stays focused.");
        return;
    }

    // 2. Location Selection Check
    if (!formData.businessLocation) {
        alert("📍 Please select a valid Country from the list.");
        return;
    }

    // 3. Prevent empty required fields
    if (!formData.businessName || !formData.industry) {
        alert("Please fill in the core details (Name and Industry) before launching!");
        return;
    }

    setloader(true);
    const messages = [
      "🔍 Analyzing your financials...",
      "🌍 Factoring in regional constraints...",
      "🧠 Calibrating mentors for your industry...",
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
      businessLocation: "United States",
      targetAudience: "Busy city shoppers",
      goal: "Partner with 100 stores in 3 months",
      businessModel: "D2C",
      businessDescription: "BoltCart connects busy city dwellers with nearby stores to get essentials delivered in under an hour.",
      startingFunding: '100000',
      startingRevenue: '0',
      startingUsers: '0',
      northStarMetric: 'userAcquisition'
    },
    {
      businessName: "MediConnect",
      industry: "Healthcare",
      productType: "Telemedicine app for seniors",
      businessLocation: "United Kingdom",
      targetAudience: "Elderly population",
      goal: "Sign up 500 senior patients",
      businessModel: "B2C",
      businessDescription: "MediConnect enables elderly patients to consult doctors from home using an easy-to-use telemedicine app.",
      startingFunding: '150000',
      startingRevenue: '0',
      startingUsers: '50',
      northStarMetric: 'userAcquisition'
    },
    {
      businessName: "EduSpark",
      industry: "Education",
      productType: "AI Tutoring Platform",
      businessLocation: "India",
      targetAudience: "High school students",
      goal: "Launch pilot program in 10 schools",
      businessModel: "B2B",
      businessDescription: "EduSpark uses AI to deliver personalized tutoring experiences for students. Schools can integrate it to support academic success.",
      startingFunding: '250000',
      startingRevenue: '1000',
      startingUsers: '5',
      northStarMetric: 'revenue'
    },
    {
      businessName: "FinanceEase",
      industry: "Finance",
      productType: "Personal Finance Manager App",
      businessLocation: "Canada",
      targetAudience: "Young professionals",
      goal: "Acquire 2000 active users",
      businessModel: "B2C",
      businessDescription: "FinanceEase helps young professionals track spending, set goals, and build smarter financial habits.",
      startingFunding: '100000',
      startingRevenue: '0',
      startingUsers: '0',
      northStarMetric: 'userAcquisition'
    },
     {
      businessName: "NexusQuantum",
      industry: "Other",
      productType: "Error-Corrected Quantum Processor Unit",
      businessLocation: "Germany",
      targetAudience: "Research labs & Cybersec firms",
      goal: "Achieve stable 10-qubit entanglement in prototype",
      businessModel: "DeepTech",
      businessDescription: "NexusQuantum is building high-fidelity superconducting quantum processors designed to solve complex cryptographic problems.",
      startingFunding: '500000',
      startingRevenue: '0',
      startingUsers: '0',
      northStarMetric: 'userAcquisition'
    },
    {
        businessName: "VoltCycle",
        industry: "Mobility",
        productType: "Solid-state battery electric motorbike",
        businessLocation: "United States",
        targetAudience: "Urban eco-commuters",
        goal: "Secure 500 paid pre-orders via crowdfunding",
        businessModel: "D2C",
        businessDescription: "VoltCycle is a hardware startup developing high-performance electric motorbikes with next-gen solid-state battery technology for 3x longer range.",
        startingFunding: '350000',
        startingRevenue: '0',
        startingUsers: '0',
        northStarMetric: 'userAcquisition'
    }
  ];
  
  return (
    <DefaultLayout> 
      <div className={` ${user?.isAiCustomizationDone ? 
        'left-[86%] top-[31%]' : 'left-[70%] top-[31%]' } top-[31%] hidden xl:block fixed z-0 pointer-events-none opacity-50`}>
        <Image
          src={formImage}
          width={ user?.isAiCustomizationDone ? 200 :  400}
          height={ user?.isAiCustomizationDone ? 200 : 400}
          alt='image'
        />
      </div>

      <div className="relative z-10 max-w-5xl">
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`max-w-3xl ${user?.isAiCustomizationDone ? 'mx-auto' : 'mx-0'} p-8 
            rounded-3xl shadow-xl bg-white dark:bg-[#0f172a] text-[#111827] dark:text-white space-y-6 mt-10`}
        >
            <h1 className="text-3xl font-bold text-center">Startup Simulation Setup</h1>
            <p className="text-center text-gray-600 dark:text-gray-400">
            Enter your specific data so we can tailor the mentors, goals, and difficulty.
            </p>

            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2 dark:border-gray-700">1. Core Concept</h3>
                {[
                    { label: "Startup Name", icon: <Building2 />, key: "businessName", placeholder: "e.g. QuantumDynamics" },
                    { label: "Business Location", icon: <MapPin />, key: "businessLocation", type: "country" },
                    { label: "Industry", icon: <LayoutGrid />, key: "industry", type: "select", options: industries },
                    { label: "Business Description (Crucial for AI)", icon: <Target />, key: "businessDescription", placeholder: "e.g. Developing stable qubits for banking security..." },
                    { label: "Business Model", icon: <Target />, key: "businessModel", type: "select", options: ["B2C", "D2C", "B2B", "Marketplace", "SaaS", "DeepTech"] },
                    { label: "Product / Service", icon: <LayoutGrid />, key: "productType", placeholder: "e.g. Quantum Encryption API" },
                    { label: "Target Audience", icon: <Users />, key: "targetAudience", placeholder: "e.g. Global Banks" },
                    { label: "Main Goal", icon: <Flag />, key: "goal", placeholder: "e.g. Secure 5 Pilot Banks" },
                    
                ].map(({ label, icon, key, type, placeholder, options }) => (
                    <div key={key} className="space-y-2">
                    <label className="font-normal flex items-center gap-2 text-base">
                        {icon} {label}
                    </label>
                    {type === 'country' ? (
                        <Select
                            options={countryOptions}
                            value={countryOptions.find(opt => opt.label === formData.businessLocation)}
                            onChange={(val) => handleChange('businessLocation', val ? val.label : '')}
                            placeholder="Select a Country..."
                            className="text-black"
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderRadius: '0.75rem',
                                padding: '0.2rem',
                                backgroundColor: 'rgb(249 250 251)', // Matches bg-gray-50
                              }),
                            }}
                        />
                    ) : type === 'select' ? (
                        <select
                        value={formData[key as keyof typeof formData] || ''}
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
                        value={formData[key as keyof typeof formData] || ''}
                        onChange={(e) => handleChange(key as keyof typeof formData, e.target.value)}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white focus:outline-none"
                        />
                    )}
                    </div>
                ))}
            </div>

            <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 space-y-4">
                <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                    <Wallet className="w-5 h-5"/> 2. Financial Snapshot
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="font-normal flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4" /> Monthly Revenue ($)
                        </label>
                        <input
                        type="number"
                        value={formData.startingRevenue || '0'}
                        onChange={(e) => handleChange("startingRevenue", e.target.value)}
                        className="w-full p-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-normal flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4" /> User Base
                        </label>
                        <input
                        type="number"
                        value={formData.startingUsers || '0'}
                        onChange={(e) => handleChange("startingUsers", e.target.value)}
                        className="w-full p-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base rounded-xl shadow-md transition-all active:scale-95"
            >
                🚀 Launch Simulation
            </button>
        </motion.div>
        
        <div className="mt-16 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Confused? Just want to get started?</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Pick one of these ready-to-go startup ideas!</p>
        </div>

        {!user?.isAiCustomizationDone && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mb-20">
            {startupTemplates.map((template, idx) => (
                <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                    setFormData({...initialAnswers, ...template}); 
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer p-8 rounded-[2rem] shadow-lg bg-white dark:bg-[#151d2f] hover:border-indigo-500 transition-all border-2 border-transparent dark:border-gray-800"
                >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-black mb-1 text-gray-900 dark:text-white">{template.businessName}</h3>
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{template.industry}</p>
                    </div>
                    <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-[10px] font-black px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                        {template.businessModel}
                    </span>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4 leading-relaxed line-clamp-2">
                    &quot;{template.businessDescription}&quot;
                </p>

                <div className="flex items-center gap-4 text-[11px] font-bold">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <Target className="w-3.5 h-3.5" />
                        <span>{template.goal}</span>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-xs font-black text-gray-700 dark:text-gray-300">
                            ${parseInt(template.startingFunding).toLocaleString()} Funding
                        </span>
                    </div>
                    <button className="text-[10px] font-black uppercase text-indigo-500 hover:text-indigo-400 transition-colors">
                        Select Template →
                    </button>
                </div>
                </motion.div>
            ))}
            </div>
        )}
      </div>
    </DefaultLayout>
  );
}