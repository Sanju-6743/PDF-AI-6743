"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ tools, onSearchResults }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Memoize allTools to prevent recreation on every render
  const allTools = useMemo(() => [
    ...tools.basicTools,
    ...tools.advancedTools,
    ...tools.conversionTools,
    ...tools.annotationTools,
    ...tools.formTools,
    ...tools.batchTools,
    ...tools.aiTools
  ], [tools]);

  // Memoize the search results calculation
  const searchResults = useMemo(() => {
    if (searchTerm.trim() === '') {
      return allTools;
    }

    return allTools.filter(tool =>
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allTools]);

  // Use useEffect to call onSearchResults only when searchResults changes
  useEffect(() => {
    onSearchResults(searchResults);
  }, [searchResults, onSearchResults]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="relative max-w-md mx-auto mb-8">
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : 'scale-100'}`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search PDF tools..."
          className="w-full pl-12 pr-12 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-800/90"
        />

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search suggestions/results count */}
      {searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-xl shadow-lg z-10">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {searchResults.length} tools found
          </p>
        </div>
      )}
    </div>
  );
}
