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
import { toast } from 'react-toastify';

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
  businessModel: '',
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
    } else if (user.isAiCustomizationDone && !user.difficultyMode) {
      router.push("/modeSelect");
    }
  }, [user, router, userLoaded]);

  const handleSubmit = async () => {
    if (!user || !user.gameId) return;

    // --- EXISTING VALIDATIONS ---
    const descriptionWords = formData.businessDescription.trim().split(/\s+/).filter(Boolean);
    if (descriptionWords.length > 200) {
      toast.info("🚨 Business Description is too long!");
      return;
    }
    if (!formData.businessName || !formData.industry || !formData.businessLocation) {
      toast.info("Please fill in Name, Industry, and Location.");
      return;
    }

    // --- NEW: AI LOCATION VERIFICATION LAYER ---
    setloader(true);
    setLoaderMessage("📍 Verifying locations...");

    try {
      const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verifyLocation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: formData.businessLocation }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.isValid) {
        toast.info(`🚩 Location Error: ${verifyData.error || "Please enter valid countries or cities."}`);
        setloader(false);
        return;
      }

      // If valid, update the formData with the AI-formatted location string
      const finalLocation = verifyData.formattedLocation;

      // --- PROCEED TO CUSTOMIZATION ---
      const messages = [
        "🔍 Analyzing your financials...",
        "🌍 Factoring in regional constraints...",
        "🚀 Preparing your simulation..."
      ];

      let index = 0;
      setLoaderMessage(messages[index]);
      const intervalId = setInterval(() => {
        index = (index + 1) % messages.length;
        setLoaderMessage(messages[index]);
      }, 2200);

      const token = localStorage.getItem("userToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/taskCustomization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
        body: JSON.stringify({
          ...formData,
          businessLocation: finalLocation, // Use verified location
          gameId: user.gameId,
        }),
      });

      const data = await res.json();
      clearInterval(intervalId);

      if (res.ok) {
        setUser(data);
        setUserState(data);
        router.push("/modeSelect");
      }
    } catch (err) {
      console.error("Workflow error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
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
  
  const selectStyles = {
    control: (base: object) => ({
      ...base,
      borderRadius: '0.75rem',
      minHeight: '48px',
      backgroundColor: '#1a1a1b',
      borderColor: '#1f2937',
    }),
    singleValue: (base: object) => ({ ...base, color: '#f3f4f6' }),
    input: (base: object) => ({ ...base, color: '#f3f4f6' }),
    placeholder: (base: object) => ({ ...base, color: '#6b7280' }),
    menu: (base: object) => ({ ...base, backgroundColor: '#151516', border: '1px solid #1f2937', borderRadius: '0.75rem' }),
    option: (base: object, state: { isFocused?: boolean }) => ({
      ...base,
      backgroundColor: state.isFocused ? '#1f2937' : 'transparent',
      color: '#f3f4f6',
    }),
  };


  return (
    <DefaultLayout>
      {/* <div className={` ${user?.isAiCustomizationDone ?
        'left-[86%] top-[31%]' : 'left-[70%] top-[31%]'} top-[31%] hidden xl:block fixed z-0 pointer-events-none opacity-50`}>
        <Image
          src={formImage}
          width={user?.isAiCustomizationDone ? 200 : 400}
          height={user?.isAiCustomizationDone ? 200 : 400}
          alt='image'
        />
      </div> */}

      <div className="relative z-10 max-w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full max-w-full ${user?.isAiCustomizationDone ? 'mx-auto' : 'mx-0'} p-6 sm:p-8 rounded-3xl border border-gray-800 bg-[#151516] shadow-[0_24px_80px_rgba(0,0,0,0.6)] space-y-6 mt-10`}
        >
          <div className="text-center pb-2">
            <h1 className="text-3xl font-bold text-gray-100">Startup Simulation Setup</h1>
            <p className="text-gray-400 mt-1">
              Enter your specific data so we can tailor the mentors, goals, and difficulty.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-100 border-b border-gray-800 pb-2 flex items-center gap-2">
              <span className="text-primary">1.</span> Core Concept
            </h3>
            {[
              { label: "Startup Name", icon: <Building2 className="w-4 h-4 text-primary" />, key: "businessName", placeholder: "e.g. QuantumDynamics" },
              { label: "Business Location", icon: <MapPin className="w-4 h-4 text-primary" />, key: "businessLocation", type: "country" },
              { label: "Industry", icon: <LayoutGrid className="w-4 h-4 text-primary" />, key: "industry", type: "select", options: industries },
              { label: "Business Description (Crucial for AI)", icon: <Target className="w-4 h-4 text-primary" />, key: "businessDescription", placeholder: "e.g. Developing stable qubits for banking security..." },
              { label: "Business Model", icon: <Target className="w-4 h-4 text-primary" />, key: "businessModel", type: "select", options: ["B2C", "D2C", "B2B", "Marketplace", "SaaS", "DeepTech"] },
              { label: "Product / Service", icon: <LayoutGrid className="w-4 h-4 text-primary" />, key: "productType", placeholder: "e.g. Quantum Encryption API" },
              { label: "Target Audience", icon: <Users className="w-4 h-4 text-primary" />, key: "targetAudience", placeholder: "e.g. Global Banks" },
              { label: "Main Goal", icon: <Flag className="w-4 h-4 text-primary" />, key: "goal", placeholder: "e.g. Secure 5 Pilot Banks" },
            ].map(({ label, icon, key, type, placeholder, options }) => (
              <div key={key} className="space-y-2">
                <label className="font-medium flex items-center gap-2 text-sm text-gray-200">
                  {icon} {label}
                </label>
                {type === 'country' ? (
                  <Select
                    options={countryOptions}
                    value={countryOptions.find(opt => opt.label === formData.businessLocation)}
                    onChange={(val) => handleChange('businessLocation', val ? val.label : '')}
                    placeholder="Select a Country..."
                    styles={selectStyles}
                  />
                ) : type === 'select' ? (
                  <select
                    value={formData[key as keyof typeof formData] || ''}
                    onChange={(e) => handleChange(key as keyof typeof formData, e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#1a1a1b] border border-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                    className="w-full p-3 rounded-xl bg-[#1a1a1b] border border-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={formData[key as keyof typeof formData] || ''}
                    onChange={(e) => handleChange(key as keyof typeof formData, e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#1a1a1b] border border-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl border border-gray-800 bg-[#1a1a1b] space-y-4">
            <h3 className="font-bold text-lg text-gray-100 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" /> 2. Financial Snapshot
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-medium flex items-center gap-2 text-sm text-gray-200">
                  <TrendingUp className="w-4 h-4 text-primary" /> Monthly Revenue ($)
                </label>
                <input
                  type="number"
                  value={formData.startingRevenue || '0'}
                  onChange={(e) => handleChange("startingRevenue", e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#151516] border border-gray-800 text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="font-medium flex items-center gap-2 text-sm text-gray-200">
                  <Users className="w-4 h-4 text-primary" /> User Base
                </label>
                <input
                  type="number"
                  value={formData.startingUsers || '0'}
                  onChange={(e) => handleChange("startingUsers", e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#151516] border border-gray-800 text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3.5 mt-4 bg-primary hover:bg-primary/90 text-white font-semibold text-base rounded-xl shadow-lg transition-all active:scale-[0.99]"
          >
            Launch Simulation
          </button>
        </motion.div>

        <div className="mt-14 mb-6 pl-4 sm:pl-10">
          <h2 className="text-2xl font-bold text-gray-100">Confused? Just want to get started?</h2>
          <p className="text-gray-400 mt-1">Pick one of these ready-to-go startup ideas.</p>
        </div>

        {!user?.isAiCustomizationDone && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-20">
            {startupTemplates.map((template, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setFormData({ ...initialAnswers, ...template });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer p-6 rounded-3xl border border-gray-800 bg-[#151516] shadow-[0_24px_80px_rgba(0,0,0,0.6)] hover:ring-2 hover:ring-primary/50 hover:border-primary/50 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-100">{template.businessName}</h3>
                    <p className="text-xs font-semibold text-primary uppercase tracking-widest mt-0.5">{template.industry}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-primary/50 bg-primary/10 text-primary">
                    {template.businessModel}
                  </span>
                </div>
                <p className="text-sm text-gray-400 italic mb-4 leading-relaxed line-clamp-2">
                  &quot;{template.businessDescription}&quot;
                </p>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Target className="w-3.5 h-3.5" />
                    <span className="text-gray-300">{template.goal}</span>
                  </div>
                </div>
                <div className="mt-5 pt-5 border-t border-gray-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-xs font-semibold text-gray-300">
                      ${parseInt(template.startingFunding).toLocaleString()} Funding
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-primary">Select template →</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}