"use client";

import { useState, useEffect } from 'react';

const themes = [
  {
    name: 'Blue',
    primary: 'blue',
    colors: {
      primary: 'from-blue-600 to-blue-700',
      secondary: 'from-blue-500 to-blue-600',
      accent: 'blue-100',
      hover: 'blue-200'
    }
  },
  {
    name: 'Purple',
    primary: 'purple',
    colors: {
      primary: 'from-purple-600 to-purple-700',
      secondary: 'from-purple-500 to-purple-600',
      accent: 'purple-100',
      hover: 'purple-200'
    }
  },
  {
    name: 'Green',
    primary: 'green',
    colors: {
      primary: 'from-green-600 to-green-700',
      secondary: 'from-green-500 to-green-600',
      accent: 'green-100',
      hover: 'green-200'
    }
  },
  {
    name: 'Red',
    primary: 'red',
    colors: {
      primary: 'from-red-600 to-red-700',
      secondary: 'from-red-500 to-red-600',
      accent: 'red-100',
      hover: 'red-200'
    }
  },
  {
    name: 'Orange',
    primary: 'orange',
    colors: {
      primary: 'from-orange-600 to-orange-700',
      secondary: 'from-orange-500 to-orange-600',
      accent: 'orange-100',
      hover: 'orange-200'
    }
  },
  {
    name: 'Pink',
    primary: 'pink',
    colors: {
      primary: 'from-pink-600 to-pink-700',
      secondary: 'from-pink-500 to-pink-600',
      accent: 'pink-100',
      hover: 'pink-200'
    }
  }
];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState('blue');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('colorTheme') || 'blue';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    const theme = themes.find(t => t.primary === themeName);
    if (theme) {
      document.documentElement.style.setProperty('--theme-primary', theme.colors.primary);
      document.documentElement.style.setProperty('--theme-secondary', theme.colors.secondary);
      document.documentElement.style.setProperty('--theme-accent', theme.colors.accent);
      document.documentElement.style.setProperty('--theme-hover', theme.colors.hover);
      localStorage.setItem('colorTheme', themeName);
    }
  };

  const selectTheme = (themeName) => {
    setCurrentTheme(themeName);
    applyTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-lg backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 shadow-sm"
        title="Change theme color"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 rounded-lg shadow-xl border border-white/20 dark:border-gray-700/50 z-50">
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Choose Theme</h3>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.primary}
                  onClick={() => selectTheme(theme.primary)}
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${theme.colors.primary} flex items-center justify-center transition-all duration-200 ${
                    currentTheme === theme.primary
                      ? 'ring-2 ring-white shadow-lg scale-110'
                      : 'hover:scale-105'
                  }`}
                  title={theme.name}
                >
                  {currentTheme === theme.primary && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
