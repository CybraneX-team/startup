"use client";
import { useEffect, useState } from "react";
import SectionTitle from "../common/Common/SectionTitle";
import OfferList from "./OfferList";
import PricingBox from "./PricingBox";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';


const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(true);
  const router = useRouter();
  
   useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

      const openRazorpayCheckout = (subscriptionId: string, customerId: string) => {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            name: "Unicorn Simulator",
            description: "Subscription for game access",
            subscription_id: subscriptionId,
            customerId : customerId, 
            handler: async (response: any) => {
              const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/razorpay/verify-subscription`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ razorpay_subscription_id: subscriptionId }),
              });
        
              if (verifyRes.ok) {
                toast.success("Subscription activated 🚀");
                router.push("/");
              } else {
                toast.error("Verification failed");
              }
            },
            theme: {
              color: "#4fc387",
            },
          };
        
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };

  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Simple and Affordable Pricing"
          paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
          center
          width="665px"
        />

      

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          <PricingBox
            packageName="Starter Plan"
            price={isMonthly ? "₹5,000" : "120"}
            duration={isMonthly ? "mo" : "yr"}
            subtitle="Billed Monthly"
            razorpayFunction={openRazorpayCheckout}
            planId="1_month"
          >
            <OfferList text="Access to all simulator features" status="active" />
            <OfferList text="1 Month runway" status="active" />
            <OfferList text="Monthly renewal flexibility" status="active" />
          </PricingBox>

          <PricingBox
            packageName="Growth Plan"
            price={isMonthly ? "₹10,000" : "789"}
            duration={isMonthly ? "mo" : "yr"}
            subtitle="Billed Every 6 Months"
            razorpayFunction={openRazorpayCheckout}
            planId="6_months"
          >
            <OfferList text="Access to all simulator features" status="active" />
            <OfferList text="6 Months runway" status="active" />
            <OfferList text="Better value vs monthly" status="active" />
          </PricingBox>
          <PricingBox
            packageName="Founder Pro"
            price={isMonthly ? "₹15,000" : "999"}
            duration={isMonthly ? "mo" : "yr"}
            subtitle="Billed Annually"
            razorpayFunction={openRazorpayCheckout}
            planId="12_months"
          >
            <OfferList text="Access to all simulator features" status="active" />
            <OfferList text="12 Months runway" status="active" />
            <OfferList text="Best value for serious founders" status="active" />
          </PricingBox>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg
          width="239"
          height="601"
          viewBox="0 0 239 601"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_93:235"
              x1="-90.1184"
              y1="420.414"
              x2="-90.1184"
              y2="1131.65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Pricing;
