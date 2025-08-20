import React, { useState } from 'react';
import { Plus, Search, FileText, MessageSquare, Settings, BookOpen, Clock, Star, Zap, Shield, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuickActions = ({ onAction, role }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Provide different quick actions based on role
  const getQuickActions = () => {
    const baseActions = [
      { id: 'search', name: 'Quick Search', icon: Search, color: 'from-blue-500 to-cyan-500', description: 'Search regulations and procedures' },
      { id: 'chat', name: 'AI Assistant', icon: MessageSquare, color: 'from-green-500 to-emerald-500', description: 'Get help and advice' },
      { id: 'recent', name: 'Recent Access', icon: Clock, color: 'from-purple-500 to-pink-500', description: 'View recent documents' },
      { id: 'favorites', name: 'Favorites', icon: Star, color: 'from-yellow-500 to-orange-500', description: 'Favorited documents' }
    ];

    const roleSpecificActions = {
      pilot: [
        { id: 'checklist', name: 'Checklist', icon: FileText, color: 'from-red-500 to-pink-500', description: 'Pre-flight checklist' },
        { id: 'procedures', name: 'Emergency Procedures', icon: Zap, color: 'from-orange-500 to-red-500', description: 'Emergency situation handling' }
      ],
      'cabin-crew': [
        { id: 'safety', name: 'Safety Procedures', icon: Shield, color: 'from-indigo-500 to-purple-500', description: 'Cabin safety procedures' },
        { id: 'emergency', name: 'Emergency Procedures', icon: Zap, color: 'from-red-500 to-orange-500', description: 'Emergency evacuation procedures' }
      ],
      maintenance: [
        { id: 'manual', name: 'Maintenance Manual', icon: BookOpen, color: 'from-blue-500 to-indigo-500', description: 'Technical maintenance manual' },
        { id: 'schedule', name: 'Maintenance Schedule', icon: Clock, color: 'from-green-500 to-teal-500', description: 'Regular maintenance schedule' }
      ],
      safety: [
        { id: 'reports', name: 'Safety Reports', icon: FileText, color: 'from-red-500 to-pink-500', description: 'Safety incident reports' },
        { id: 'assessment', name: 'Risk Assessment', icon: Shield, color: 'from-orange-500 to-yellow-500', description: 'Risk assessment tools' }
      ],
      compliance: [
        { id: 'regulations', name: 'Regulatory Requirements', icon: BookOpen, color: 'from-blue-500 to-cyan-500', description: 'Compliance regulatory requirements' },
        { id: 'audit', name: 'Audit Tools', icon: ClipboardCheck, color: 'from-green-500 to-emerald-500', description: 'Compliance audit tools' }
      ]
    };

    return [...baseActions, ...(roleSpecificActions[role?.id] || [])];
  };

  const handleAction = (actionId) => {
    onAction?.(actionId);
    setIsOpen(false);
  };

  const actions = getQuickActions();

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200"
        aria-label="Quick actions"
      >
        <Plus className="h-5 w-5" />
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
              <h3 className="font-medium text-white text-lg">Quick Actions</h3>
              <p className="text-sm text-gray-400 mt-1">Quick access to common functions</p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => {
                  const Icon = action.icon;
                  
                  return (
                    <motion.button
                      key={action.id}
                      onClick={() => handleAction(action.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group p-4 rounded-xl bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200 text-left"
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-medium text-white text-sm mb-1">{action.name}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{action.description}</p>
                    </motion.button>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Current Role</span>
                  <span className="text-white font-medium">{role?.title || 'Not Selected'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickActions;
