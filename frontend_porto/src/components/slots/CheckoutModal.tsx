
import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface Ad {
  id: number;
  position: string;
  size: string;
  price: number;
  available: boolean;
  image: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAds: Ad[];
  totalCost: number;
}

export default function CheckoutModal({ isOpen, onClose, selectedAds, totalCost }: CheckoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <ShoppingCartIcon className="w-6 h-6 mr-2 text-blue-600" />
            Checkout
          </h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white" />
          </button>
        </div>
        <div className="mt-4">
          {selectedAds.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No ad slots selected yet.</p>
          ) : (
            <>
              <ul className="space-y-3">
                {selectedAds.map((ad) => (
                  <li key={ad.id} className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>{ad.position} ({ad.size})</span>
                    <span>${ad.price}</span>
                  </li>
                ))}
              </ul>
              <hr className="my-4 border-gray-300 dark:border-gray-600" />
            </>
          )}
        </div>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          Total: <span className="text-blue-600">${totalCost}</span>
        </p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center"
          >
            <XMarkIcon className="w-5 h-5 mr-1" />
            Cancel
          </button>
          <button
            onClick={() => alert('Invoice generated: [Placeholder for backend integration]')}
            disabled={selectedAds.length === 0}
            className={`py-2 px-4 rounded-md text-white flex items-center ${
              selectedAds.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <DocumentTextIcon className="w-5 h-5 mr-1" />
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
}