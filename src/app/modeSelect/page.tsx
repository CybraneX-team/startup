"use client";

import React, { useEffect } from "react";
import {
  Rocket,
  Skull,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";

const DifficultySelectionPage = () => {
  const router = useRouter();
  const {
    user,
    setnotificationMessages,
    notificationMessages,
    setUser,
    setUserState,
  } = useUser();

  useEffect(() => {
    if (user?.difficultyMode) {
      router.push("/");
    }
    return;
  }, [user,router]);

  const handleSelectDifficulty = async (mode: string) => {
    const token = localStorage.getItem("userToken");
    const makeReq = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/select/mode`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
        body: JSON.stringify({
          gameId: user?.gameId,
          selectedMode: mode,
        }),
      },
    );
    const res = await makeReq.json();

    if (makeReq.ok) {
      setUser(res);
      setUserState(res);
      setnotificationMessages([...notificationMessages, ...res.message]);
      toast.success(res.message?.[0]?.message || "Bug bought out 🧹");
    } else {
      toast.error(res.message || "Could not buyout bug");
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-[#0F172A] dark:text-white">
      <Header sidebarOpen={false} setSidebarOpen={() => {}} />

      <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Select Your{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Challenge
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-slate-400">
            Choose how you want to experience your startup journey. You can
            change this later in settings.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {/* Basic Mode Card */}
          <div className="group relative rounded-3xl border border-gray-200 bg-white p-8 shadow-xl transition-all duration-300 hover:border-emerald-500 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-emerald-500">
            <div className="absolute right-0 top-0 p-6 opacity-10 transition-opacity group-hover:opacity-20">
              <Rocket size={120} className="text-emerald-500" />
            </div>

            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-2xl bg-emerald-100 p-4 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Rocket size={32} />
              </div>
              <h2 className="text-3xl font-bold">Basic</h2>
            </div>

            <p className="mb-8 min-h-[60px] text-gray-600 dark:text-slate-400">
              Ideal for learning the ropes. You can clearly see how each
              decision impacts your startup's metrics before you act.
            </p>

            <ul className="mb-8 space-y-4">
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-slate-300">
                <Eye className="text-emerald-500" size={18} />{" "}
                <span className="font-bold">Visible Metric Impacts</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-slate-300">
                <CheckCircle2 className="text-emerald-500" size={18} /> Clear
                Decision Outcomes
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-slate-300">
                <CheckCircle2 className="text-emerald-500" size={18} /> Safer
                Strategic Planning
              </li>
            </ul>

            <button
              onClick={() => handleSelectDifficulty("basic")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-4 font-bold text-gray-900 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white dark:bg-slate-800 dark:text-white"
            >
              Start Journey <ArrowRight size={18} />
            </button>
          </div>

          {/* Intermediate Mode Card */}
          <div className="group relative rounded-3xl border border-gray-200 bg-white p-8 shadow-xl transition-all duration-300 hover:border-purple-500 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-purple-500">
            <div className="absolute right-0 top-0 p-6 opacity-10 transition-opacity group-hover:opacity-20">
              <Skull size={120} className="text-purple-500" />
            </div>

            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-2xl bg-purple-100 p-4 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <Skull size={32} />
              </div>
              <h2 className="text-3xl font-bold">Intermediate</h2>
            </div>

            <p className="mb-8 min-h-[60px] text-gray-600 dark:text-slate-400">
              For experienced founders. Metric impacts are hidden, meaning you
              must rely on intuition and risk assessment.
            </p>

            <ul className="mb-8 space-y-4">
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-slate-300">
                <EyeOff className="text-purple-500" size={18} />{" "}
                <span className="font-bold">Hidden Metric Impacts</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-slate-300">
                <CheckCircle2 className="text-purple-500" size={18} />{" "}
                Unpredictable Outcomes
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-slate-300">
                <CheckCircle2 className="text-purple-500" size={18} />{" "}
                High-Stakes Decision Making
              </li>
            </ul>

            <button
              onClick={() => handleSelectDifficulty("intermediate")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-4 font-bold text-gray-900 transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white dark:bg-slate-800 dark:text-white"
            >
              Accept Challenge <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DifficultySelectionPage;
