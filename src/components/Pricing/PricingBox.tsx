"use client"

import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";

const PricingBox = (props: {
  price: string;
  duration: string;
  packageName: string;
  subtitle: string;
  children: React.ReactNode;
  razorpayFunction : any
  planId : string
  handleSubscribe: any
}) => {
  const { price, duration, packageName, subtitle, children, razorpayFunction , planId, handleSubscribe } = props;
  const {user} = useUser()
  // console.log("user", user)
  return (
    <div className="w-full">
      <div
        className="wow fadeInUp shadow-three dark:bg-gray-dark dark:shadow-two dark:hover:shadow-gray-dark hover:shadow-one relative z-10 rounded-sm bg-white px-8 py-10 dark:bg-gray-900"
        data-wow-delay=".1s"
      >
        <div className="flex items-center justify-between">
          <h3 className="price mb-2 text-3xl font-bold text-black dark:text-white">
            <span className="amount">{price}</span>
            {/* <span className="time text-body-color">/{duration}</span> */}
          </h3>
          <h4 className="text-dark mb-2 text-xl font-bold dark:text-white">
            {packageName}
          </h4>
        </div>
        <p className="text-body-color mb-7 text-base">{subtitle}</p>
        <div className="border-body-color mb-8 border-b border-opacity-10 pb-8 dark:border-white dark:border-opacity-10">
          <button 
          onClick={()=>{
            if(!user){
              toast.info("Please log in first to purchase a plan.")
              return 
            }
            handleSubscribe(planId)
          }}
          className="hover:shadow-signUp flex w-full items-center justify-center rounded-sm bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80">
           Get Started 
          </button>
        </div>
        <div>{children}</div>
        <div className="absolute bottom-0 right-0 z-[-1]">
          <svg
            width="179"
            height="158"
            viewBox="0 0 179 158"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.5"
              d="M75.0002 63.256C115.229 82.3657 136.011 137.496 141.374 162.673C150.063 203.47 207.217 197.755 202.419 167.738C195.393 123.781 137.273 90.3579 75.0002 63.256Z"
              fill="url(#paint0_linear_70:153)"
            />
            <path
              opacity="0.3"
              d="M178.255 0.150879C129.388 56.5969 134.648 155.224 143.387 197.482C157.547 265.958 65.9705 295.709 53.1024 246.401C34.2588 174.197 100.939 83.7223 178.255 0.150879Z"
              fill="url(#paint1_linear_70:153)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_70:153"
                x1="69.6694"
                y1="29.9033"
                x2="196.108"
                y2="83.2919"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_70:153"
                x1="165.348"
                y1="-75.4466"
                x2="-3.75136"
                y2="103.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PricingBox;
