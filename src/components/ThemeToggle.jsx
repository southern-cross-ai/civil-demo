import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

const ThemeToggle = ({ onThemeChange }) => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else if (theme === 'auto') {
      root.classList.remove('dark', 'light');
      // Automatically set based on system preference
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        root.classList.add('light');
      } else {
        root.classList.add('dark');
      }
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem('theme', theme);
    onThemeChange?.(theme);
    setIsOpen(false);
  };

  const themes = [
    { id: 'light', name: 'Light', icon: Sun, description: 'Bright theme' },
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Dark theme' },
    { id: 'auto', name: 'Auto', icon: Monitor, description: 'Follow system' }
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200"
        aria-label="Toggle theme"
      >
        {currentTheme === 'light' ? (
          <Sun className="h-5 w-5" />
        ) : currentTheme === 'auto' ? (
          <Monitor className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3 border-b border-gray-700 bg-gray-800/80">
              <h3 className="font-medium text-white text-sm">Select Theme</h3>
            </div>
            <div className="py-2">
              {themes.map((theme) => {
                const Icon = theme.icon;
                const isActive = currentTheme === theme.id;
                
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-700/50 transition-colors ${
                      isActive ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300'
                    }`}
                  >
                    <Icon className={`h-4 w-4 mr-3 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium text-sm">{theme.name}</div>
                      <div className="text-xs text-gray-400">{theme.description}</div>
                    </div>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
