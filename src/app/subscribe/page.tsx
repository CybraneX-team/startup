// "use client";

// import React, { useEffect } from "react";
// import { CheckCircle2 } from "lucide-react";
// import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import { toast } from "react-toastify";
// import { useUser } from "@/context/UserContext";
// import { useRouter } from 'next/navigation';


// const plans = [
//     {
//       id: "1_month",
//       name: "Starter Plan",
//       price: "₹5,000",
//       duration: "Billed Monthly",
//       features: [
//         "Access to all simulator features",
//         "1 Month runway",
//         "Monthly renewal flexibility",
//       ],
//     },
//     {
//       id: "6_months",
//       name: "Growth Plan",
//       price: "₹10,000",
//       duration: "Billed Every 6 Months",
//       features: [
//         "Access to all simulator features",
//         "6 Months runway",
//         "Better value vs monthly",
//       ],
//     },
//     {
//       id: "12_months",
//       name: "Founder Pro",
//       price: "₹15,000",
//       duration: "Billed Annually",
//       features: [
//         "Access to all simulator features",
//         "12 Months runway",
//         "Best value for serious founders",
//       ],
//       popular: true,
//     },
//   ];
  

// const SubscriptionPlansPage = () => {
//     const router = useRouter();
//     const { user } = useUser();
//     useEffect(() => {
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.async = true;
//         document.body.appendChild(script);
//         return () => {
//           document.body.removeChild(script);
//         };
//      }, []);


//     const openRazorpayCheckout = (subscriptionId: string) => {
//         const options = {
//           key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
//           name: "Startup Simulator",
//           description: "Subscription for game access",
//           subscription_id: subscriptionId,
//           handler: async (response: any) => {
//             const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/razorpay/verify-subscription`, {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({ razorpay_subscription_id: subscriptionId }),
//             });
      
//             if (verifyRes.ok) {
//               toast.success("Subscription activated 🚀");
//               router.push("/");
//             } else {
//               toast.error("Verification failed");
//             }
//           },
//           theme: {
//             color: "#4fc387",
//           },
//         };
      
//         const rzp = new (window as any).Razorpay(options);
//         rzp.open();
//       };
      
 

//     const handleSubscribe = async (planId: string) => {
//         const token = localStorage.getItem("userToken");
      
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/razorpay/create-subscription`, {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//             token: token || "",
//           },
//           body: JSON.stringify({ selectedPlan: planId }),
//         });
      
//         const data = await response.json();
      
//         if (data.subscriptionId) {
//           openRazorpayCheckout(data.subscriptionId);
//         } else {
//           toast.error("Subscription failed. Please try again.");
//         }
//       };
        
//   return (
//     <DefaultLayout>
//     <div className="min-h-screen bg-white dark:bg-[#0F172A] py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto text-center">
//         <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
//           Choose Your Plan
//         </h1>
//         <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
//           Power your startup journey with a plan that fits your vision.
//         </p>
//       </div>

//       <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
//         {plans.map((plan) => (
//           <div
//             key={plan.id}
//             className={`relative flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-md bg-white dark:bg-[#1E293B] transition-transform hover:scale-[1.02] hover:shadow-xl`}
//           >
//             {plan.popular && (
//               <span className="absolute -top-3 right-4 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
//                 Most Popular
//               </span>
//             )}
//             <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
//               {plan.name}
//             </h3>
//             <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
//               {plan.price}
//             </p>
//             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//               {plan.duration}
//             </p>

//             <ul className="mt-6 space-y-2 text-left">
//               {plan.features.map((feature, i) => (
//                 <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
//                   <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
//                   {feature}
//                 </li>
//               ))}
//             </ul>

//             <button
//               onClick={()=>{handleSubscribe(plan.id)}}
//               className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
//             >
//               Get Started
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//     </DefaultLayout>
//   );
// };

// export default SubscriptionPlansPage;

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page