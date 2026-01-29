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
import { motion } from "framer-motion";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
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
  }, [user, router]);

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
      toast.success(res.message?.[0]?.message || "Mode selected successfully");
    } else {
      toast.error(res.message || "Could not select mode");
    }
    router.push("/");
  };

  return (
    <DefaultLayout>
      <div className="relative z-10 w-full mt-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
            Select Your{" "}
            <span className="text-primary">Challenge</span>
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-gray-400">
            Choose how you want to experience your startup journey. You can change this
            later in settings.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Basic Mode Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="group relative rounded-3xl border border-gray-800 bg-[#151516] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-primary/50 hover:ring-2 hover:ring-primary/20"
          >
            <div className="absolute right-4 top-4 opacity-20 transition-opacity group-hover:opacity-40">
              <Rocket size={80} className="text-primary" />
            </div>

            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3">
                <Rocket size={28} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-100">Basic</h2>
            </div>

            <p className="mb-8 min-h-[60px] text-gray-400">
              Ideal for learning the ropes. You can clearly see how each
              decision impacts your startup&apos;s metrics before you act.
            </p>

            <ul className="mb-8 space-y-4">
              <li className="flex items-center gap-3 text-sm font-medium text-gray-300">
                <Eye className="h-5 w-5 shrink-0 text-primary" />
                <span className="font-semibold text-gray-200">Visible Metric Impacts</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-300">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                Clear Decision Outcomes
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-300">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                Safer Strategic Planning
              </li>
            </ul>

            <button
              onClick={() => handleSelectDifficulty("basic")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-white shadow-lg transition-all hover:bg-primary/90 active:scale-[0.99]"
            >
              Start Journey <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Intermediate Mode Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="group relative rounded-3xl border border-gray-800 bg-[#151516] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-amber-500/50 hover:ring-2 hover:ring-amber-500/20"
          >
            <div className="absolute right-4 top-4 opacity-20 transition-opacity group-hover:opacity-40">
              <Skull size={80} className="text-amber-400" />
            </div>

            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3">
                <Skull size={28} className="text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-100">Intermediate</h2>
            </div>

            <p className="mb-8 min-h-[60px] text-gray-400">
              For experienced founders. Metric impacts are hidden, meaning you
              must rely on intuition and risk assessment.
            </p>

            <ul className="mb-8 space-y-4">
              <li className="flex items-center gap-3 text-sm font-medium text-gray-300">
                <EyeOff className="h-5 w-5 shrink-0 text-amber-400" />
                <span className="font-semibold text-gray-200">Hidden Metric Impacts</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-300">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-400" />
                Unpredictable Outcomes
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-300">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-400" />
                High-Stakes Decision Making
              </li>
            </ul>

            <button
              onClick={() => handleSelectDifficulty("intermediate")}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/10 py-4 font-semibold text-amber-400 transition-all hover:bg-amber-500/20 hover:border-amber-500 active:scale-[0.99]"
            >
              Accept Challenge <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DifficultySelectionPage;
