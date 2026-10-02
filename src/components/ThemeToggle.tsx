'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/core/theme/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'badge' | 'switch';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'badge',
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
          isDark 
            ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800 hover:text-amber-300' 
            : 'bg-white border-gray-200 text-slate-700 hover:bg-gray-100 hover:text-black'
        } ${className}`}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
        )}
      </button>
    );
  }

  if (variant === 'switch') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-800'
            : 'bg-gray-50 border-gray-200 text-slate-800 hover:bg-gray-100'
        } ${className}`}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <span className="flex items-center gap-2 text-xs font-semibold">
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </span>
        <div
          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
            isDark ? 'bg-amber-500 justify-end' : 'bg-gray-300 justify-start'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200" />
        </div>
      </button>
    );
  }

  // Default 'badge' pill style
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer font-semibold shadow-2xs border ${
        isDark
          ? 'bg-slate-900 border-slate-700/80 text-amber-400 hover:bg-slate-800 hover:border-slate-600'
          : 'bg-white border-gray-200 text-slate-700 hover:bg-gray-100 hover:text-black'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-slate-700" />
          <span className="hidden md:inline">Dark</span>
        </>
      )}
    </button>
  );
};
