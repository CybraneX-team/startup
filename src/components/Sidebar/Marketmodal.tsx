import React from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

// Define props interface with proper types
interface AvailableMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AvailableMarketModal: React.FC<AvailableMarketModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Create the modal content
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-boxdark">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        {/* Modal header */}
        <div className="mb-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Total market value
            <span className="mx-5 text-xl font-bold text-emerald-500">
              $10 000 000 000
            </span>
          </h2>

          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Here you can see the overall climate of the market, as well as your
            share.
          </p>
        </div>

        {/* Market segments table */}
        <div className="mx-3 mb-4">
          <div className="grid grid-cols-3 gap-4  p-3 text-gray-500 dark:text-gray-300">
            <div>Social Status</div>
            <div>Clients</div>
            <div>Capital</div>
          </div>

          {/* Working class row */}
          <div className="roundded-xl mt-4 grid grid-cols-3 gap-4 rounded-xl  bg-[#f2fafd] p-3  dark:bg-[#2c3a55]">
            <div className="font-medium text-gray-800 dark:text-white">
              Working Class
            </div>
            <div className="text-blue-500">20 000 000</div>
            <div className="text-emerald-500">$200 000 000</div>
          </div>

          {/* Middle Class row */}
          <div className="mt-4 grid grid-cols-3 gap-4 rounded-xl bg-[#f2fafd] p-3 dark:bg-[#2c3a55]">
            <div className="font-medium text-gray-800 dark:text-white">
              Middle Class
            </div>
            <div className="text-blue-500">70 000 000</div>
            <div className="text-emerald-500">$6 500 000 000</div>
          </div>

          {/* Wealthy row */}
          <div className="mt-4 grid grid-cols-3 gap-4 rounded-xl bg-[#f2fafd] p-3 dark:bg-[#2c3a55]">
            <div className="font-medium text-gray-800 dark:text-white">
              Wealthy
            </div>
            <div className="text-blue-500">10 000 000</div>
            <div className="text-emerald-500">$3 300 000 000</div>
          </div>

          {/* Available row */}
          <div className="mt-4 grid grid-cols-3 gap-4 border-b border-[#e2e2e2] p-3 pb-4 ">
            <div className="font-medium text-gray-800 dark:text-white">
              Available
            </div>
            <div className="text-blue-500">80 000 000</div>
            <div className="text-emerald-500">$9 799 999 879,7</div>
          </div>
        </div>

        {/* Market share section */}
        <div className="-mt-5">
          <div className="mx-3 mb-0">
            <div className="grid grid-cols-3 gap-4  p-3 text-gray-500 dark:text-gray-300">
              <div></div>
              <div>Yours</div>
              <div>Competitors</div>
            </div>
            <div className="mt-0 grid grid-cols-3 gap-4 rounded-xl bg-[#f2fafd] p-3 dark:bg-[#2c3a55]">
              <div className="font-medium text-gray-800 dark:text-white">
                Market Share
              </div>
              <div className="text-blue-500">0%</div>
              <div className="text-red-500">0%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
};

export default AvailableMarketModal;
