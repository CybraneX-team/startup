"use client";

import React, { useEffect } from "react";
import { CheckCircle2, Zap, Rocket, Crown } from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const plans = [
  {
    id: "1_month",
    name: "Starter Plan",
    icon: <Zap className="text-blue-500 dark:text-blue-400" size={24} />,
    price: "1",
    duration: "Monthly",
    description: "Perfect for exploring the simulator mechanics.",
    features: [
      "Access to all simulator features",
      "10,000 Venture Coins / month",
      "Monthly renewal flexibility",
    ],
  },
  {
    id: "12_months",
    name: "Founder Pro",
    icon: <Crown className="text-amber-500 dark:text-amber-400" size={24} />,
    price: "3",
    duration: "Annually",
    description: "The ultimate edge for serious startup founders.",
    features: [
      "Access to all simulator features",
      "50,000 Venture Coins / year",
      "Priority Support access",
      "Exclusive Founder Badge",
    ],
    popular: true,
  },
  {
    id: "6_months",
    name: "Growth Plan",
    icon: <Rocket className="text-emerald-500 dark:text-emerald-400" size={24} />,
    price: "2",
    duration: "Semi-Annually",
    description: "Scale your experience with better coin value.",
    features: [
      "Access to all simulator features",
      "30,000 Venture Coins / 6 months",
      "Better value vs monthly",
    ],
  },
];

const SubscriptionPlansPage = () => {
  const router = useRouter();
  const { user, setUser } = useUser();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async (planId: string) => {
    const token = localStorage.getItem("userToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/razorpay/create-subscription`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", token: token || "" },
          body: JSON.stringify({ selectedPlan: planId }),
        }
      );

      const data = await response.json();
      if (!data.subscriptionId) throw new Error(data.message || "Init failed");

      const options = {
        key: data.keyId,
        name: "Unicorn Simulator",
        subscription_id: data.subscriptionId,
        handler: async (res: any) => {
          const verify = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/razorpay/verify-subscription`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_subscription_id: res.razorpay_subscription_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
                selectedPlanId: planId,
              }),
            }
          );
          const verifyData = await verify.json();
          if (verify.ok) {
            toast.success("Subscription Active! 🚀");
            setUser(verifyData.user);
            setTimeout(() => router.push("/"), 1500);
          }
        },
        theme: { color: "#6366f1" },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.message || "Network error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] text-gray-900 dark:text-white transition-colors duration-300">
      <Header sidebarOpen={false} setSidebarOpen={() => {}} />
      
      {/* FIX: Changed py-20 to 'pt-32 pb-20 md:pt-28' 
         This pushes the content down so it clears the fixed header on mobile 
      */}
      <main className="mx-auto max-w-7xl px-4 pt-32 pb-20 md:pt-28">
        <div className="mb-12 md:mb-16 text-center">
          <h1 className="text-4xl font-extrabold sm:text-6xl">
            Choose your{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              path to glory.
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const isActive = user?.isPurchaseDone && user?.activePlanId === plan.id;
            const isLocked = user?.isPurchaseDone && !isActive;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl border p-8 transition-all hover:translate-y-[-4px] 
                  ${
                    plan.popular
                      ? "border-indigo-500 bg-white dark:bg-slate-800/50 shadow-xl"
                      : "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg"
                  }`}
              >
                <div className="mb-6 flex justify-between">
                  <div className="rounded-xl bg-gray-100 dark:bg-slate-800 p-3">
                    {plan.icon}
                  </div>
                  {isActive && (
                    <span className="text-emerald-500 dark:text-emerald-400 text-sm font-bold flex items-center gap-1">
                      <CheckCircle2 size={16} /> Active
                    </span>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                  <span className="text-gray-500 dark:text-slate-400">
                    /{plan.duration}
                  </span>
                </div>

                <ul className="mt-8 flex-1 space-y-4">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-slate-300">
                      <CheckCircle2 className="text-indigo-500 flex-shrink-0" size={18} /> {f}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={user?.isPurchaseDone}
                  onClick={() => handleSubscribe(plan.id)}
                  className={`mt-10 w-full rounded-xl py-4 font-bold transition-all 
                    ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 cursor-default"
                        : isLocked
                        ? "bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-500 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white"
                    }`}
                >
                  {isActive
                    ? "Current Plan"
                    : isLocked
                    ? "Plan Locked"
                    : "Get Started"}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPlansPage;