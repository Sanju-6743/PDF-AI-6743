"use client";

import { motion } from 'framer-motion';

const colorSchemes = [
  { bg: 'from-blue-500 to-cyan-500', iconBg: 'bg-blue-100 dark:bg-blue-900/50', iconColor: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  { bg: 'from-purple-500 to-pink-500', iconBg: 'bg-purple-100 dark:bg-purple-900/50', iconColor: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  { bg: 'from-green-500 to-emerald-500', iconBg: 'bg-green-100 dark:bg-green-900/50', iconColor: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  { bg: 'from-orange-500 to-red-500', iconBg: 'bg-orange-100 dark:bg-orange-900/50', iconColor: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
  { bg: 'from-indigo-500 to-purple-500', iconBg: 'bg-indigo-100 dark:bg-indigo-900/50', iconColor: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
  { bg: 'from-teal-500 to-blue-500', iconBg: 'bg-teal-100 dark:bg-teal-900/50', iconColor: 'text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800' },
  { bg: 'from-pink-500 to-rose-500', iconBg: 'bg-pink-100 dark:bg-pink-900/50', iconColor: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' },
  { bg: 'from-yellow-500 to-orange-500', iconBg: 'bg-yellow-100 dark:bg-yellow-900/50', iconColor: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' },
];

export default function ToolCard({ icon: Icon, title, description, onClick, comingSoon = false, index = 0 }) {
  const colorScheme = colorSchemes[index % colorSchemes.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 cursor-pointer border-2 ${colorScheme.border} overflow-hidden ${
        comingSoon ? 'opacity-70' : ''
      }`}
      onClick={onClick}
    >
      {/* Animated gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

      {/* Floating particles effect */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
      <div className="absolute bottom-2 left-2 w-1 h-1 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" style={{animationDelay: '0.5s'}}></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className={`p-4 ${colorScheme.iconBg} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
            whileHover={{ rotate: 5, scale: 1.1 }}
          >
            <Icon className={`h-7 w-7 ${colorScheme.iconColor}`} />
          </motion.div>
          {comingSoon && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full font-medium shadow-lg"
            >
              Coming Soon
            </motion.span>
          )}
        </div>

        <motion.h3
          className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300"
        >
          {title}
        </motion.h3>

        <motion.p
          className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
          whileHover={{ color: '#6B7280' }}
        >
          {description}
        </motion.p>

        {/* Hover indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-2xl"
          initial={{ width: 0 }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        ></motion.div>
      </div>
    </motion.div>
  );
}
