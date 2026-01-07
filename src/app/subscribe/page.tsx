"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Zap, Rocket, Crown, Loader2, ShieldCheck, AlertCircle, Mail, MessageCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const plans = [
  {
    id: "1_month",
    name: "Starter Plan",
    icon: <Zap className="text-blue-500 dark:text-blue-400" size={24} />,
    price: "5,000",
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
    price: "15,000",
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
    price: "10,000",
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
  // State to track which plan is currently loading
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

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
    // Prevent multiple clicks if already loading
    if (loadingPlanId) return;

    setLoadingPlanId(planId); // Start loading
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
      
      if (!data.subscriptionId) {
        toast.error(data.message || "Network error");
        setLoadingPlanId(null); // Stop loading on specific error
        return;
      }

      const options = {
        key: data.keyId,
        name: "Unicorn Simulator",
        subscription_id: data.subscriptionId,
        // Handler for successful payment
        handler: async (res: any) => {
          // Note: The payment wizard is closed now, but we are verifying.
          // You could optionally set a global "verifying" loader here if you want.
          try {
            const verify = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/razorpay/verify-subscription`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  token: token || "",
                },
                body: JSON.stringify({
                  razorpay_subscription_id: res.razorpay_subscription_id,
                  razorpay_payment_id: res.razorpay_payment_id,
                  razorpay_signature: res.razorpay_signature,
                  selectedPlanId: planId,
                  gameId: user?.gameId,
                }),
              }
            );
            const verifyData = await verify.json();
            if (verify.ok) {
              
              toast.success("Subscription Active! 🚀");
              setUser(verifyData.objToReturn);
              setTimeout(() => router.push("/"), 1500);
            } else {
               toast.error("Verification failed");
            }
          } catch (verifyErr) {
             toast.error("Verification error");
          }
        },
        theme: { color: "#6366f1" },
        // IMPORTANT: Reset loading state if user closes the modal without paying
        modal: {
            ondismiss: function() {
                setLoadingPlanId(null);
            }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      
      // Open the modal
      rzp.open();
      
      // Stop the button loader once the modal is successfully triggered
      setLoadingPlanId(null);

    } catch (error: any) {
      console.error(error);
      toast.error(typeof error === 'string' ? error : "Network error");
      setLoadingPlanId(null); // Stop loading on crash
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] text-gray-900 dark:text-white transition-colors duration-300">
      <Header sidebarOpen={false} setSidebarOpen={() => {}} />

      <main className="mx-auto max-w-7xl px-4 pt-32 pb-20 md:pt-28">
        <div className="mb-12 md:mb-16 text-center">
          <h1 className="text-4xl font-extrabold sm:text-6xl">
            Choose your{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              path to glory.
            </span>
          </h1>
          <p className="mt-4 text-gray-500 dark:text-slate-400 max-w-2xl mx-auto">
            Upgrade your experience and dominate the ecosystem with premium tools.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const isActive = user?.isPurchaseDone && user?.activePlanId === plan.id;
            const isLocked = user?.isPurchaseDone && !isActive;
            const isLoading = loadingPlanId === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl border p-8 transition-all hover:translate-y-[-4px] 
                  ${
                    plan.popular
                      ? "border-indigo-500 bg-white dark:bg-slate-800/50 shadow-xl ring-1 ring-indigo-500/20"
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
                    <li
                      key={i}
                      className="flex gap-3 text-sm text-gray-600 dark:text-slate-300"
                    >
                      <CheckCircle2
                        className="text-indigo-500 flex-shrink-0"
                        size={18}
                      />{" "}
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <button
                    disabled={user?.isPurchaseDone || (loadingPlanId !== null)}
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full rounded-xl py-4 font-bold transition-all flex justify-center items-center gap-2
                      ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 cursor-default"
                          : isLocked
                          ? "bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-500 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                      }
                      ${isLoading ? "opacity-80 cursor-wait" : ""}
                      `}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Processing...
                      </>
                    ) : isActive ? (
                      "Current Plan"
                    ) : isLocked ? (
                      "Plan Locked"
                    ) : (
                      "Get Started"
                    )}
                  </button>
                  
                  {/* Non-refundable notice under button */}
                  {!user?.isPurchaseDone && (
                    <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                      Non-Refundable
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info Section */}
        <div className="mt-20 border-t border-gray-200 dark:border-slate-800 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            
            {/* Left: Support Info */}
            <div className="space-y-4 text-center md:text-left">
              <h4 className="text-lg font-bold flex items-center justify-center md:justify-start gap-2">
                <MessageCircle size={20} className="text-indigo-500" />
                Need help with your purchase?
              </h4>
              <p className="text-gray-500 dark:text-slate-400 text-sm max-w-md">
                If you encountered an issue during payment or haven&apos;t received your coins, contact our support team. We&apos;re here to help!
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <a 
                  href="mailto:support@unicornsimgame.com" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-indigo-500 transition-colors text-sm font-medium shadow-sm"
                >
                  <Mail size={16} className="text-indigo-500" />
                  simulatorunicorn@gmail.com
                </a>
              </div>
            </div>

            {/* Right: Policy & Trust */}
            <div className="space-y-6 bg-gray-100/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-gray-200 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold">Refund Policy</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                    All transactions are final. Once Venture Coins are credited to your account, they cannot be refunded or exchanged for cash.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold">Secure Transactions</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                    Payments are processed via Razorpay with industry-standard encryption. Your financial data is never stored on our servers.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPlansPage;