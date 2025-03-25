

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface FilterParams {
  position: string;
  size: string;
  maxPrice: number | null;
}

interface FilterBarProps {
  onFilter: (params: FilterParams) => void;
}

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [position, setPosition] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const handleFilter = () => {
    onFilter({ position, size, maxPrice: maxPrice ? parseInt(maxPrice) : null });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by Position (e.g., Header)"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full pl-10 p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by Size (e.g., 728x90)"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full pl-10 p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full pl-10 p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={handleFilter}
        className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Filter
      </button>
    </div>
  );
}