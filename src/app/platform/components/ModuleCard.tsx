"use client";

import React from 'react';
import './platform.css';
import Link from 'next/link';

interface ModuleCardProps {
  moduleNumber: number;
  title: string;
  completedItems: number;
  totalItems: number;
  isCompleted?: boolean;
  isActive?: boolean;
  id: number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  moduleNumber,
  title,
  completedItems,
  totalItems,
  isCompleted = false,
  isActive = false,
  id,
}) => {
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  
  // Determine button text based on module status
  const buttonText = isCompleted ? 'OPEN' : isActive ? 'START' : 'START';

  return (
    <div 
      className="module-card bg-white rounded-lg overflow-hidden shadow-md"
      id={`module-${moduleNumber}`}
    >
      {/* Card Image */}
      <div className="card-image bg-fuchsia-600 h-32 flex items-center justify-center">
        {/* Module image placeholder */}
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        <p className="text-gray-500 text-sm mb-1">MODULE {moduleNumber}</p>
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
          <div 
            className="h-2 bg-black rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          items, {completedItems} completed ({Math.round(completionPercentage)}%)
        </p>
        
        {/* Button with stripe design that matches the image and Link to module page */}
        <Link href={`/platform/module/${id}`}>
          <button className="stripe-button w-full">
            <span>{buttonText}</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ModuleCard; 