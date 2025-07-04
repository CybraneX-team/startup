"use client"
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, LayoutGrid, Users, Target, Flag } from 'lucide-react';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import formImage from '../../../public/illustrations/business_plan.svg'

const industries = [
  "E-commerce",
  "SaaS",
  "Media",
  "Healthcare",
  "Education",
  "Fintech",
  "Finance",
  "AI",
  "ClimateTech",
  "AgriTech",
  "Clean Energy",
  "Mobility",
  "Logistics",
  "Web3",
  "Gaming",
  "PropTech",
  "LegalTech",
  "Travel",
  "Food & Beverage",
  "Retail",
  "Other"
];



const initialAnswers = {
  businessName: '',
  industry: '',
  productType: '',
  targetAudience: '',
  goal: '',
  businessModel : '',
  businessDescription: '', 
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
  } else if (user.isAiCustomizationDone) {
    router.push("/");
  }
}, [user, router, userLoaded]);



  
  const handleSubmit = async () => {
    if (!user || !user.gameId) return;
  
    setloader(true);
  
    const messages = [
      "🔍 Analyzing your startup context...",
      "🧠 Letting the AI brainstorm personalized tasks...",
      "💡 Rewriting simulation experience...",
      "✨ Injecting startup-specific creativity...",
      "🚀 One sec while we tailor your journey..."
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
        router.push("/")
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
      businessDescription: "BoltCart connects busy city dwellers with nearby stores to get essentials delivered in under an hour. It boosts local businesses by bringing them online with instant fulfillment."
    },
    {
      businessName: "MediConnect",
      industry: "Healthcare",
      productType: "Telemedicine app for seniors",
      targetAudience: "Elderly population",
      goal: "Sign up 500 senior patients",
      businessModel: "B2C",
      businessDescription: "MediConnect enables elderly patients to consult doctors from home using an easy-to-use telemedicine app. It simplifies healthcare access and ensures continuity of care."
    },
    {
      businessName: "EduSpark",
      industry: "Education",
      productType: "AI Tutoring Platform",
      targetAudience: "High school students",
      goal: "Launch pilot program in 10 schools",
      businessModel: "B2B",
      businessDescription: "EduSpark uses AI to deliver personalized tutoring experiences for students. Schools can integrate it to support academic success with real-time insights and adaptive learning paths."
    },
    {
      businessName: "FinanceEase",
      industry: "Finance",
      productType: "Personal Finance Manager App",
      targetAudience: "Young professionals",
      goal: "Acquire 2000 active users",
      businessModel: "B2C",
      businessDescription: "FinanceEase helps young professionals track spending, set goals, and build smarter financial habits. It offers a clean dashboard with actionable insights and budgeting tools."
    },
  ];
  
  
  
  return (
    <DefaultLayout> 
      {/* Quick Startup Idea Cards */}
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
        <h1 className="text-3xl font-bold text-center">Startup Quick Profile</h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Help us tailor the simulation by telling us about your startup.
        </p>

        {/* Fields */}
        {[
        { 
          label: "What is your startup's name?", 
          icon: <Building2 />, 
          key: "businessName", 
          placeholder: "e.g. PetPilot" 
        },
        { 
          label: "Give a 2-3 line business description", 
          icon: <Target />, 
          key: "businessDescription", 
          placeholder: "e.g. PetPilot helps busy urban pet parents access expert care products and track pet health on the go." 
        },
        { 
          label: "What industry are you in?", 
          icon: <LayoutGrid />, 
          key: "industry", 
          type: "select" 
        },
        { 
          label: "What kind of products/services do you offer?", 
          icon: <LayoutGrid />, 
          key: "productType", 
          placeholder: "e.g. Pet wellness kits" 
        },
        { 
          label: "Who is your primary customer (target audience)?", 
          icon: <Users />, 
          key: "targetAudience", 
          placeholder: "e.g. Pet parents in cities" 
        },
        { 
          label: "What is your business goal this quarter?", 
          icon: <Flag />, 
          key: "goal", 
          placeholder: "e.g. Reach 1000 subscribers" 
        }
      ]
.map(({ label, icon, key, type, placeholder }) => (
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
                <option value="">Select an industry...</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            ) 
            : key === "businessDescription" ? (
              <textarea
              rows={3}
              placeholder={placeholder}
              value={formData[key as keyof typeof formData] || ""}
              onChange={(e) => handleChange(key as keyof typeof formData, e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white focus:outline-none resize-none"
            />
            )
            : (
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
        <div className="space-y-2">
              <label className="font-normal flex items-center gap-2 text-base">
                <Target /> What is your business model?
              </label>
              <select
                value={formData.businessModel}
                onChange={(e) => handleChange("businessModel", e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white focus:outline-none"
              >
                <option value="">Select a business model...</option>
                <option value="B2C">B2C (Business to Consumer)</option>
                <option value="D2C">D2C (Direct to Consumer)</option>
                <option value="B2B">B2B (Business to Business)</option>
              </select>
            </div>
        <button
          onClick={handleSubmit}
          className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base rounded-xl shadow-md dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          🚀 Submit Answers
        </button>
      </motion.div>
      {/* Quick Startup Idea Heading */}
<div className=" mt-10 mb-6">
  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Confused? Just want to get started?</h2>
  <p className="text-gray-500 dark:text-gray-400 mt-1">Pick one of these ready-to-go startup ideas!</p>
</div>

{/* Startup Idea Cards */}
{!user?.isAiCustomizationDone ? 
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl  mb-8">
    {startupTemplates.map((template, idx) => (
      <motion.div
        key={idx}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {setFormData(template); window.scrollTo({ top: 0, behavior: 'smooth' });}}
        className="cursor-pointer p-6 rounded-2xl shadow-md bg-gray-100 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-700 transition-all border dark:border-gray-700"
      >
        <h3 className="text-xl font-bold mb-2">{template.businessName}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{template.industry}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">&quot;{template.goal}&ldquo;</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{template.productType}</p>
      </motion.div>
    ))}
  </div>
  : <></> }
    </DefaultLayout>
  );
}

