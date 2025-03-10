"use client"
import React from "react";
import Image from "next/image";

interface MentorCardProps {
  title: string;
  description: string;
  conditions: string;
  benefits: string[];
  limitations: string[];
  isSelected?: boolean;
}

const MentorCard: React.FC<MentorCardProps> = ({ 
  title, 
  description, 
  conditions, 
  benefits, 
  limitations,
  isSelected = false
}) => {
  return (
    <div className={`min-w-[350px] flex-none rounded-xl border p-5 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-16 w-16 rounded-full bg-gray-200">
          {/* Placeholder for mentor avatar */}
          {/* You can replace this with an actual Image component when you have the images */}
          <div className="h-full w-full rounded-full"></div>
        </div>
        <h3 className="text-xl font-medium text-gray-800">{title}</h3>
      </div>
      
      <p className="mb-6 text-sm text-gray-600">{description}</p>
      
      <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-3">
        <span className="text-sm font-medium text-gray-700">Conditions (required stake)</span>
        <span className="text-sm font-medium text-blue-500">{conditions}</span>
      </div>
      
      <div className="mb-3">
        <h4 className="mb-2 text-sm font-medium text-gray-700">Benefits</h4>
        <ul>
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-blue-500">
              <span className="mt-1 h-2 w-2 flex-none rounded-full bg-blue-500"></span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-700">Limitations</h4>
        <ul>
          {limitations.map((limitation, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-blue-500">
              <span className="mt-1 h-2 w-2 flex-none rounded-full bg-blue-500"></span>
              {limitation}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface MentorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MentorsModal: React.FC<MentorsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const mentors = [
    {
      title: "Coach",
      description: "A competent coach will lift the company to new heights, illuminate new paths of growth and development and, when necessary, help bring it out of crisis.",
      conditions: "5%",
      benefits: ["Replaces the CEO in tasks"],
      limitations: ["Doesn't sell his share back"]
    },
    {
      title: "Tracker",
      description: "The tracker's main responsibility is tracking the business: resolving problems that hinder efficient operation or scaling, and ensuring that the project reaches the stage of consistently high profits.",
      conditions: "5%",
      benefits: ["Reduces bugs by 5%"],
      limitations: ["Doesn't sell his share back"]
    },
    {
      title: "Startupper",
      description: "He's already done it all and made all the right mistakes. Always willing to help, he's intimately familiar with the challenges you face.",
      conditions: "5%",
      benefits: ["One free brainstorming session per round"],
      limitations: ["Doesn't sell his share back"]
    },
    {
      title: "Developer Friend",
      description: "Some of the best known startups were created by friends. Airbnb, Snowpad, Apple, and Microsoft are just a few worth mentioning. Can you do what these friends did?",
      conditions: "0%",
      benefits: ["In lean times, fills in the role of developer"],
      limitations: ["Increases the bugs by 5% and can leave at any time"]
    }
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Full-screen overlay to dim entire application */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl rounded-xl bg-white p-6 shadow-lg">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#C5C7D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Modal header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-medium text-gray-800">Available Mentors</h2>
            <span className="text-2xl font-medium text-green-500">4</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            A startup mentor is someone who offers guidance and support, helping startup workers to develop their skills, grow their networks, and achieve their professional goals.
          </p>
        </div>
        
        {/* Scrollable cards container */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4">
            {mentors.map((mentor, index) => (
              <MentorCard
                key={index}
                title={mentor.title}
                description={mentor.description}
                conditions={mentor.conditions}
                benefits={mentor.benefits}
                limitations={mentor.limitations}
                // isSelected={index === 3} // For demo purposes, making the Developer Friend selected
              />
            ))}
          </div>
        </div>
        
        {/* Progress indicator */}
        {/* <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
          <div className="h-full w-3/4 rounded-full bg-blue-500"></div>
        </div> */}
      </div>
    </div>
  );
};

export default MentorsModal;