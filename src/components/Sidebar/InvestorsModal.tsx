import React from 'react';
import { X } from 'lucide-react';

interface InvestorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvestorsModal: React.FC<InvestorsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl p-6">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Modal Header */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Available Investors 1</h2>
        <p className="text-sm text-gray-600 mb-6">
          Each round new investors will be available to you. In addition to funds, they will provide invaluable knowledge, in exchange for shares in your company.
        </p>

        {/* Investor Category */}
        <h3 className="text-base font-semibold text-gray-900 mb-2">Friends, Fools & Family</h3>
        <p className="text-sm text-blue-500 italic mb-3">
          Don't be afraid to be a small fish in a big pond.
        </p>

        {/* Investor Description */}
        <p className="text-sm text-gray-600 mb-6">
          Friends, Fools, and Family (FFF) investors, often a startup's first financial supporters, are a unique group characterized by trust, daring, and personal ties. They are willing to invest in early-stage projects when others might not. For instance, consider Jeff Bezos' parents. In 1995, they invested $245,573 in Amazon, a nascent online bookstore. Despite the inherent risk and the fact that traditional investors might have been skeptical, their FFF investment was rooted in trust and personal belief in their son. Their bold move helped launch what has now become one of the world's most valuable companies.
        </p>

        {/* Investment Details */}
        <div className="space-y-4 border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Investment</span>
            <span className="text-sm font-medium text-green-600">$ 100,000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Buyout price</span>
            <span className="text-sm font-medium text-green-600">$ 200,000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Investor's share</span>
            <span className="text-sm font-medium text-blue-500">10%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Advantages
            </span>
            <span className="text-sm text-blue-500">Increases bugs by 0%</span>
          </div>
        </div>

        {/* Signed Tag */}
        <div className="mt-4 text-right">
          <span className="text-green-600 font-semibold border border-green-600 rounded px-2 py-1">
            SIGNED
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvestorsModal;
