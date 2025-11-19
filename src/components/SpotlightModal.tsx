import React from 'react';

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
  if (!isOpen) return null;
  
  const isMetricModal = selectedMetric !== null;

  return (
    <div className="fixed inset-0 z-[99998] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div
        className={`relative w-full ${isMetricModal ? "max-w-sm" : "max-w-3xl"} rounded-xl bg-white overflow-hidden shadow-lg dark:bg-boxdark`}
      >
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
        <div className="p-5 text-gray-600 dark:text-gray-300">{content}</div>
      </div>
    </div>
  );
};

export default SpotlightModal;