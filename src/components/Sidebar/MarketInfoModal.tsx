"use client"
import React from "react";

interface MarketInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MarketInfoModal = ({ isOpen, onClose }: MarketInfoModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Full-screen overlay to dim entire application including header */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
        {/* Close button in the top right */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#C5C7D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Header section */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-medium text-gray-700">Total market value</h2>
            <p className="text-xl font-medium text-green-500">$10 000 000 000</p>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Here you can see the overall climate of the market, as well as your share.
          </p>
        </div>
        
        {/* Main content - Column headers */}
        <div className="mb-2 grid grid-cols-3 gap-6">
          <h3 className="text-base font-medium text-gray-600">Social Status</h3>
          <h3 className="text-base font-medium text-gray-600">Clients</h3>
          <h3 className="text-base font-medium text-gray-600">Capital</h3>
        </div>
        
        {/* Row 1 - Working class */}
        <div className="mb-2 grid grid-cols-3 gap-6 rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-700">Working class</p>
          <p className="text-sm text-blue-500">20 000 000</p>
          <p className="text-sm text-green-500">$200 000 000</p>
        </div>
        
        {/* Row 2 - Middle Class */}
        <div className="mb-2 grid grid-cols-3 gap-6 rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-700">Middle Class</p>
          <p className="text-sm text-blue-500">70 000 000</p>
          <p className="text-sm text-green-500">$6 500 000 000</p>
        </div>
        
        {/* Row 3 - Wealthy */}
        <div className="mb-2 grid grid-cols-3 gap-6 rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-700">Wealthy</p>
          <p className="text-sm text-blue-500">10 000 000</p>
          <p className="text-sm text-green-500">$3 300 000 000</p>
        </div>
        
        {/* Row 4 - Available */}
        <div className="mb-6 grid grid-cols-3 gap-6 rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-700">Available</p>
          <p className="text-sm text-blue-500">100 000 000</p>
          <p className="text-sm text-green-500">$9 999 999 950,5</p>
        </div>
        
        {/* Separator line */}
        <div className="mb-4 h-px w-full bg-gray-200"></div>
        
        {/* Bottom section - Headers */}
        <div className="mb-2 grid grid-cols-2 gap-6">
          <h3 className="text-base font-medium text-gray-600">Yours</h3>
          <h3 className="text-base font-medium text-gray-600">Competitors</h3>
        </div>
        
        {/* Bottom section - Market Share */}
        <div className="grid grid-cols-2 gap-6 rounded-lg bg-gray-50 p-3">
          <div>
            <p className="text-sm text-gray-700">Market Share</p>
            <p className="text-sm text-blue-500">0%</p>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-red-500">0%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketInfoModal;