import { Search, Filter } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRegion: string;
  onRegionChange: (value: string) => void;
  regions: string[];
}

export default function SearchAndFilter({
  searchTerm,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  regions,
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8 items-center">
      {/* Region Filter */}
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <select
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value)}
          className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Regions</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* Unique Search Bar */}
      <div className="relative flex-1">
        <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
          <Search className="text-gray-400 h-5 w-5 ml-3" />
          <input
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => onSearchChange('')}
            className="px-4 py-2 bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}