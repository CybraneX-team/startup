// pages/about.tsx
import React from 'react';
import Header from '@/components/Header2/index';
import Footer from "@/components/Footer";
import "@/styles/index.css";
import { Providers } from '../home/providers';

const About: React.FC = () => {
  return (
    <Providers>
    <div className=' bg-white text-black dark:bg-black dark:text-white'>
      <Header/>
        <main className="relative top-17 min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">About Unicorn Simulator</h1>

            <p className="mb-4">
            Unicorn Simulator is a gamified startup simulation platform designed to help aspiring founders,
            students, and startup incubators understand the core mechanics of building and scaling a company.
            </p>

            <p className="mb-4">
            With real-time simulations, interactive tasks, and AI-powered mentorship, users experience critical
            aspects of entrepreneurship including fundraising, team management, and customer acquisition—without
            risking real capital.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Who It’s For</h2>
            <ul className="list-disc list-inside mb-4">
            <li>🧑‍🎓 Students learning business fundamentals</li>
            <li>🚀 Founders testing startup ideas</li>
            <li>🏢 Incubators & accelerators training cohorts</li>
            <li>💰 VCs & Angels scouting metric-driven minds</li>
            </ul>

            <p className="mb-4">
            Every task impacts business metrics like CPA, CM, UA, and CLTV. With stage progression from FFF to IPO,
            Unicorn Simulator provides both an engaging and insightful experience into startup dynamics.
            </p>
        </div>
        </main>
         <div className="absolute right-0 top-0 z-0 opacity-30 lg:opacity-100 pointer-events-none">
          <svg
            width="450"
            height="556"
            viewBox="0 0 450 556"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="277" cy="63" r="225" fill="url(#paint0_linear)" />
            <circle cx="18" cy="182" r="18" fill="url(#paint1_radial)" />
            <circle cx="77" cy="288" r="34" fill="url(#paint2_radial)" />
            <circle cx="325.486" cy="302.87" r="180" transform="rotate(-37.6852 325.486 302.87)" fill="url(#paint3_linear)" />
            <circle opacity="0.8" cx="184.521" cy="315.521" r="132.862" transform="rotate(114.874 184.521 315.521)" stroke="url(#paint4_linear)" />
            <circle opacity="0.8" cx="356" cy="290" r="179.5" transform="rotate(-30 356 290)" stroke="url(#paint5_linear)" />
            <circle opacity="0.8" cx="191.659" cy="302.659" r="133.362" transform="rotate(133.319 191.659 302.659)" fill="url(#paint6_linear)" />
            <defs>
              <linearGradient id="paint0_linear" x1="-54.5003" y1="-178" x2="222" y2="288" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 182) rotate(90) scale(18)">
                <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
              </radialGradient>
              <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(77 288) rotate(90) scale(34)">
                <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
              </radialGradient>
              <linearGradient id="paint3_linear" x1="226.775" y1="-66.1548" x2="292.157" y2="351.421" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="paint4_linear" x1="184.521" y1="182.159" x2="184.521" y2="448.882" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="paint5_linear" x1="356" y1="110" x2="356" y2="470" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="paint6_linear" x1="118.524" y1="29.2497" x2="166.965" y2="338.63" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      <Footer/>
    </div>
    </Providers>
  );
};

export default About;
