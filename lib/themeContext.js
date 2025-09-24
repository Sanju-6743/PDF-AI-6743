"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const themes = {
  blue: {
    primary: 'from-blue-600 to-blue-700',
    secondary: 'from-blue-500 to-blue-600',
    accent: 'blue-100',
    hover: 'blue-200',
    icon: 'blue-600',
    iconHover: 'blue-400'
  },
  purple: {
    primary: 'from-purple-600 to-purple-700',
    secondary: 'from-purple-500 to-purple-600',
    accent: 'purple-100',
    hover: 'purple-200',
    icon: 'purple-600',
    iconHover: 'purple-400'
  },
  green: {
    primary: 'from-green-600 to-green-700',
    secondary: 'from-green-500 to-green-600',
    accent: 'green-100',
    hover: 'green-200',
    icon: 'green-600',
    iconHover: 'green-400'
  },
  red: {
    primary: 'from-red-600 to-red-700',
    secondary: 'from-red-500 to-red-600',
    accent: 'red-100',
    hover: 'red-200',
    icon: 'red-600',
    iconHover: 'red-400'
  },
  orange: {
    primary: 'from-orange-600 to-orange-700',
    secondary: 'from-orange-500 to-orange-600',
    accent: 'orange-100',
    hover: 'orange-200',
    icon: 'orange-600',
    iconHover: 'orange-400'
  },
  pink: {
    primary: 'from-pink-600 to-pink-700',
    secondary: 'from-pink-500 to-pink-600',
    accent: 'pink-100',
    hover: 'pink-200',
    icon: 'pink-600',
    iconHover: 'pink-400'
  }
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('blue');

  useEffect(() => {
    // Get saved theme or default to blue
    const savedTheme = localStorage.getItem('colorTheme') || 'blue';
    setCurrentTheme(savedTheme);

    // Apply theme class to document
    document.documentElement.classList.add(`theme-${savedTheme}`);
  }, []);

  const changeTheme = (themeName) => {
    // Remove previous theme classes
    Object.keys(themes).forEach(theme => {
      document.documentElement.classList.remove(`theme-${theme}`);
    });

    // Add new theme class
    document.documentElement.classList.add(`theme-${themeName}`);

    // Set CSS custom properties for dynamic styling
    const colorMap = {
      blue: '#dbeafe',
      purple: '#ede9fe',
      green: '#dcfce7',
      red: '#fee2e2',
      orange: '#fed7aa',
      pink: '#fce7f3'
    };

    const iconColorMap = {
      blue: '#2563eb',
      purple: '#9333ea',
      green: '#16a34a',
      red: '#dc2626',
      orange: '#ea580c',
      pink: '#db2777'
    };

    document.documentElement.style.setProperty('--theme-accent', colorMap[themeName] || colorMap.blue);
    document.documentElement.style.setProperty('--theme-icon', iconColorMap[themeName] || iconColorMap.blue);

    // Update state and localStorage
    setCurrentTheme(themeName);
    localStorage.setItem('colorTheme', themeName);
  };

  const getThemeClasses = () => {
    return themes[currentTheme] || themes.blue;
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, getThemeClasses, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
