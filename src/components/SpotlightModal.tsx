import React, { useEffect, useState } from 'react';

interface SpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  anchorEl: HTMLElement | null;
  selectedMetric: string | null;
}

const SpotlightModal: React.FC<SpotlightModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  content,
  selectedMetric 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;
  
  const isMetricModal = selectedMetric !== null;

  return (
    <div className="fixed inset-0 z-[99998] flex items-center justify-center px-4 sm:px-0">
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      <div
        className={`relative w-full ${isMetricModal ? "max-w-sm" : "max-w-3xl"} rounded-2xl sm:rounded-3xl bg-[#1B1B1D96] shadow-lg backdrop-blur-sm bg-opacity-70 overflow-hidden shadow-lg transition-all duration-300 max-h-[90vh] flex flex-col ${
          isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base sm:text-lg font-semibold truncate">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex-shrink-0"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-5 text-sm sm:text-base text-gray-600 dark:text-gray-300 overflow-y-auto">{content}</div>
      </div>
    </div>
  );
};

export default SpotlightModal;