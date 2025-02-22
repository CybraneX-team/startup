import React, { useRef, useEffect, useState } from 'react';

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
  anchorEl,
  selectedMetric 
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && anchorEl && modalRef.current) {
      const buttonRect = anchorEl.getBoundingClientRect();
      const modalRect = modalRef.current.getBoundingClientRect();
      
      let top = buttonRect.bottom + 8;
      let left = buttonRect.left + (buttonRect.width / 2) - (modalRect.width / 2);
      
      // Viewport boundary checks
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (left < 16) left = 16;
      if (left + modalRect.width > viewportWidth - 16) {
        left = viewportWidth - modalRect.width - 16;
      }
      
      if (top + modalRect.height > viewportHeight - 16) {
        top = buttonRect.top - modalRect.height - 8;
      }
      
      setPosition({ top, left });
    }
  }, [isOpen, anchorEl]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[99998]">
        <div 
          className="absolute inset-0 bg-black bg-opacity-50" 
          onClick={onClose}
        >
          {/* Create a "hole" for the clicked button */}
          {anchorEl && (
            <div
              className="absolute"
              style={{
                top: anchorEl.getBoundingClientRect().top,
                left: anchorEl.getBoundingClientRect().left,
                width: anchorEl.getBoundingClientRect().width,
                height: anchorEl.getBoundingClientRect().height,
                background: 'transparent',
                pointerEvents: 'none'
              }}
            />
          )}
        </div>
      </div>

      <div
        ref={modalRef}
        className="fixed z-[99999] w-72 rounded-lg bg-white p-4 shadow-lg dark:bg-boxdark"
        style={{ 
          top: `${position.top}px`, 
          left: `${position.left}px`
        }}
      >
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
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
        <div className="text-gray-600 dark:text-gray-300">{content}</div>
      </div>
    </>
  );
};

export default SpotlightModal;