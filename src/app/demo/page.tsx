'use client';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

const videos = [
  {
    src: 'https://mdbcdn.b-cdn.net/img/video/Tropical.mp4',
    caption: 'Pitch your startup idea in a sandboxed world full of investors, bugs, and decisions.',
  },
  {
    src: 'https://mdbcdn.b-cdn.net/img/video/forest.mp4',
    caption: 'Hire teams, tackle bugs, unlock investments, and evolve your business model.',
  },
  {
    src: 'https://mdbcdn.b-cdn.net/img/video/Agua-natural.mp4',
    caption: 'Simulate real-world startup growth metrics and watch your startup scale.',
  },
];

const LandingPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-white transition-colors duration-300">

      {/* Hero Section */}
      <section className="bg-gray-100 dark:bg-slate-800 text-center py-20 px-4 md:px-6 rounded-b-3xl">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
          🚀 Startup Simulator
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8 text-slate-600 dark:text-slate-300">
          Build, scale, and simulate the journey of a tech startup — directly from your browser with real-world logic.
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-xl transition">
            Play Now
          </button>
          <button className="bg-white dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold px-6 py-2 rounded-xl border border-slate-300 dark:border-slate-600 transition">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 dark:bg-slate-900 py-20 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center text-slate-800 dark:text-white">
            💡 What Makes This Game Special?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              title="AI Task Customization"
              description="Enter your startup's details and let our AI rename and customize your game tasks to match your context — unique each time."
              gradient="from-indigo-200 to-blue-100"
            />
            <FeatureCard
              title="Multiple Simulations"
              description="Switch between multiple startup simulations to explore different industries, goals, and team strategies."
              gradient="from-blue-100 to-slate-100"
            />
            <FeatureCard
              title="Stage-by-Stage Scaling"
              description="From FFF to IPO, progress through actual startup funding stages and unlock challenges at every level."
              gradient="from-sky-200 to-indigo-100"
            />
            <FeatureCard
              title="Metrics-Based Decisions"
              description="Real startup KPIs like CAC, ARPU, CLTV, and Contribution Margin — your actions affect these in real-time."
              gradient="from-slate-200 to-sky-100"
            />
            <FeatureCard
              title="Team & Mentorship System"
              description="Hire team members across domains, and bring in mentors like 'The Tracker' or 'The Coach' to boost growth."
              gradient="from-blue-100 to-indigo-100"
            />
            <FeatureCard
              title="Bugs, Burn & Bankruptcy"
              description="Simulate realistic setbacks like bugs and runway issues — then recover like a real founder would."
              gradient="from-indigo-100 to-slate-100"
            />
          </div>
        </div>
      </section>

      {/* Video Carousel */}
      <section className="py-10 px-4 md:px-6">
        <div className="relative max-w-5xl mx-auto">
          <div
            className={classNames(
              'transition-opacity duration-500 rounded-xl overflow-hidden shadow-2xl',
              { 'opacity-0': !fade, 'opacity-100': fade }
            )}
          >
            <video
              key={videos[currentIndex].src}
              className="w-full h-auto rounded-xl"
              src={videos[currentIndex].src}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="p-4 bg-black bg-opacity-50 text-white text-center text-sm sm:text-base">
              {videos[currentIndex].caption}
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {videos.map((_, idx) => (
              <span
                key={idx}
                className={classNames(
                  'w-3 h-3 rounded-full transition-all',
                  currentIndex === idx
                    ? 'bg-indigo-500 dark:bg-indigo-300'
                    : 'bg-slate-400 dark:bg-slate-600'
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-slate-500 text-sm dark:text-slate-400">
        © {new Date().getFullYear()} Startup Simulator. All rights reserved.
      </footer>
    </main>
  );
};

// Feature Card Component with Subtle Blue-Grey Gradients
const FeatureCard = ({
  title,
  description,
  gradient,
}: {
  title: string;
  description: string;
  gradient: string;
}) => (
  <div
    className={`p-6 rounded-xl bg-gradient-to-br ${gradient} text-slate-800 dark:text-white shadow-md hover:shadow-xl transition`}
  >
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm opacity-90">{description}</p>
  </div>
);

export default LandingPage;
