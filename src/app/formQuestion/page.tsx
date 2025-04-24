"use client"
import { useState } from 'react';
import Image from 'next/image';
import { motion } from "framer-motion";
import DefaultLayout from '@/components/Layouts/DefaultLayout';

const questions = [
  { key: "startupName", label: "What’s your startup’s name?" },
  { key: "industry", label: "Which industry does your startup belong to?" },
  { key: "product", label: "What product or service are you offering?" },
  { key: "audience", label: "Who is your primary customer or audience?" },
  { key: "usp", label: "What’s your main value proposition or USP?" },
  { key: "differentiator", label: "What sets your offering apart from competitors?" },
  { key: "goToMarket", label: "What’s your initial go-to-market strategy?" },
  { key: "competitors", label: "Who are your closest competitors or benchmarks?" },
  { key: "acquisitionChannel", label: "What’s your primary acquisition channel?" },
  { key: "goal", label: "What is your business goal for the next 3 months?" },
  { key: "scalingPlan", label: "How do you plan to scale operations or reach?" },
  { key: "techStack", label: "What is your current tech stack or platform?" },
  { key: "keyRoles", label: "Which team roles are most critical for growth right now?" },
  { key: "partnerships", label: "Are you in any accelerators, communities, or partnerships?" },
  { key: "vision", label: "What’s your long-term vision or exit strategy?" },
];

interface FormData {
  [key: string]: string;
}

export default function UserOnboardingForm() {
  const [formData, setFormData] = useState<FormData>({});

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", formData);
    // Replace with API call
  };

  return (
    <DefaultLayout>
    <motion.div
      className="relative grid grid-cols-1 gap-6 max-w-3xl mx-auto p-6 dark:bg-[#0f172a] bg-[#f9fafb] text-[#111827] dark:text-white min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >


      <h1 className="text-3xl font-extrabold text-center mb-2">🧠 Startup Profile Questions</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        Help us customize your simulation experience by telling us about your startup.
      </p>
      {questions.map((q) => (
        <div key={q.key} className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <label className="font-semibold text-base mb-2 block dark:text-white">{q.label}</label>
          <textarea
            className="w-full rounded-xl p-3 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white resize-none"
            rows={3}
            value={formData[q.key] || ''}
            onChange={(e) => handleChange(q.key, e.target.value)}
            placeholder="Your answer..."
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-base font-semibold shadow-md dark:bg-white dark:text-black dark:hover:bg-gray-300"
      >
        🚀 Submit Profile
      </button>
    </motion.div>
    </DefaultLayout>
  );
}
