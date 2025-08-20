import React, { useState, useEffect } from 'react';
import { Keyboard, X, Command, Search, MessageSquare, Clock, Plus as PlusIcon, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const KeyboardShortcuts = ({ onShortcut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { key: 'Esc', description: 'Go back', action: 'navigate-back' },
        { key: 'Ctrl + K', description: 'Quick search', action: 'quick-search' },
        { key: 'Ctrl + L', description: 'Role selection', action: 'role-selection' },
        { key: 'Ctrl + H', description: 'Go home', action: 'home' }
      ]
    },
    {
      category: 'Functions',
      items: [
        { key: 'Ctrl + M', description: 'Open chat', action: 'open-chat' },
        { key: 'Ctrl + R', description: 'Recent documents', action: 'recent-docs' },
        { key: 'Ctrl + Q', description: 'Quick actions', action: 'quick-actions' },
        { key: 'Ctrl + S', description: 'System status', action: 'system-status' }
      ]
    },
    {
      category: 'Documents',
      items: [
        { key: 'Ctrl + F', description: 'Document search', action: 'document-search' },
        { key: 'Ctrl + D', description: 'Favorite document', action: 'favorite-doc' },
        { key: 'Ctrl + P', description: 'Print document', action: 'print-doc' },
        { key: 'Ctrl + E', description: 'Export document', action: 'export-doc' }
      ]
    },
    {
      category: 'System',
      items: [
        { key: 'Ctrl + T', description: 'Toggle theme', action: 'toggle-theme' },
        { key: 'Ctrl + ?', description: 'Show help', action: 'show-help' },
        { key: 'F11', description: 'Fullscreen mode', action: 'fullscreen' },
        { key: 'Ctrl + R', description: 'Refresh page', action: 'refresh' }
      ]
    }
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent shortcuts from triggering in input fields
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      // Handle shortcuts
      if (ctrl && key === 'k') {
        event.preventDefault();
        onShortcut?.('quick-search');
      } else if (ctrl && key === 'm') {
        event.preventDefault();
        onShortcut?.('open-chat');
      } else if (ctrl && key === 'r') {
        event.preventDefault();
        onShortcut?.('recent-docs');
      } else if (ctrl && key === 'q') {
        event.preventDefault();
        onShortcut?.('quick-actions');
      } else if (ctrl && key === 's') {
        event.preventDefault();
        onShortcut?.('system-status');
      } else if (ctrl && key === 't') {
        event.preventDefault();
        onShortcut?.('toggle-theme');
      } else if (ctrl && key === '?') {
        event.preventDefault();
        setShowHelp(true);
      } else if (key === 'escape') {
        if (isOpen) {
          setIsOpen(false);
        } else if (showHelp) {
          setShowHelp(false);
        } else {
          onShortcut?.('navigate-back');
        }
      } else if (key === 'f11') {
        event.preventDefault();
        onShortcut?.('fullscreen');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showHelp, onShortcut]);

  const handleShortcutClick = (action) => {
    onShortcut?.(action);
    setIsOpen(false);
  };

  const renderKey = (key) => {
    if (key.includes('+')) {
      const parts = key.split(' + ');
      return (
        <div className="flex items-center space-x-1">
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-gray-400">+</span>}
              <kbd className="px-2 py-1 text-xs font-mono bg-gray-700 text-gray-200 rounded border border-gray-600">
                {part === 'Ctrl' ? (navigator.platform.includes('Mac') ? '⌘' : 'Ctrl') : part}
              </kbd>
            </React.Fragment>
          ))}
        </div>
      );
    }
    
    return (
      <kbd className="px-2 py-1 text-xs font-mono bg-gray-700 text-gray-200 rounded border border-gray-600">
        {key}
      </kbd>
    );
  };

  if (showHelp) {
    return (
      <motion.div
        className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="p-6 border-b border-gray-700 bg-gray-800/80">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
                <p className="text-gray-400 mt-1">Keyboard shortcuts to improve operational efficiency</p>
              </div>
                                <button
                    onClick={() => setShowHelp(false)}
                    className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                    aria-label="Close help"
                  >
                    <X className="h-5 w-5" />
                  </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {shortcuts.map((category) => (
                <div key={category.category}>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <div
                        key={item.action}
                        className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                        onClick={() => handleShortcutClick(item.action)}
                      >
                        <span className="text-gray-300">{item.description}</span>
                        {renderKey(item.key)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Keyboard className="h-3 w-3 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-400 mb-2">Usage Tips</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Shortcuts won't trigger in input fields</li>
                    <li>• Use Esc key to quickly go back or close popups</li>
                    <li>• Use ⌘ key on Mac, Ctrl key on Windows/Linux</li>
                    <li>• Click shortcuts to immediately execute corresponding actions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200"
        aria-label="Keyboard shortcuts"
      >
        <Keyboard className="h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b border-gray-700 bg-gray-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white text-lg">Keyboard Shortcuts</h3>
                  <p className="text-sm text-gray-400">Shortcuts for common operations</p>
                </div>
                <button
                  onClick={() => setShowHelp(true)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              {shortcuts.slice(0, 2).map((category) => (
                <div key={category.category}>
                  <h4 className="text-sm font-medium text-white mb-2">{category.category}</h4>
                  <div className="space-y-2">
                    {category.items.slice(0, 3).map((item) => (
                      <div
                        key={item.action}
                        className="flex items-center justify-between p-2 bg-gray-700/30 rounded hover:bg-gray-700/50 transition-colors cursor-pointer"
                        onClick={() => handleShortcutClick(item.action)}
                      >
                        <span className="text-sm text-gray-300">{item.description}</span>
                        {renderKey(item.key)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="pt-3 border-t border-gray-700">
                <button
                  onClick={() => setShowHelp(true)}
                  className="w-full text-center text-sm text-blue-400 hover:text-blue-300 py-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                >
                  View All Shortcuts →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KeyboardShortcuts;
