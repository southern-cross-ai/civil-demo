import React, { useState, useEffect } from 'react';
import { MessageSquare, ChevronRight, Zap, Shield, Users, FileText, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Loading State Component
 * Shows an animated loading state when a role is being selected
 */
const LoadingState = ({ role }) => {
  const roleInfo = roleIcons[role?.id] || roleIcons.default;
  
  return (
    <motion.div 
      className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900/95 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="relative"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          repeatType: 'reverse' 
        }}
      >
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
        <div 
          className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg"
          aria-hidden="true"
        >
          {React.cloneElement(roleInfo.icon, { className: 'h-8 w-8 text-white' })}
        </div>
      </motion.div>
      
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          Loading {role?.title || roleInfo.label} Interface
        </h2>
        <p className="text-gray-300 max-w-md">
          Preparing your personalized aviation safety dashboard with relevant tools and information...
        </p>
      </motion.div>
      
      <motion.div 
        className="mt-8 w-48 h-1.5 bg-gray-700 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

// Animation variants for role cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      type: 'spring',
      stiffness: 200,
      damping: 20
    }
  }),
  hover: {
    y: -5,
    transition: { type: 'spring', stiffness: 300, damping: 10 }
  },
  tap: { scale: 0.98 }
};

// Role icons mapping with aria-labels for accessibility
const roleIcons = {
  pilot: { 
    icon: <Zap className="h-5 w-5" aria-hidden="true" />,
    label: 'Pilot'
  },
  atc: { 
    icon: <MessageSquare className="h-5 w-5" aria-hidden="true" />,
    label: 'Air Traffic Controller'
  },
  technician: { 
    icon: <Shield className="h-5 w-5" aria-hidden="true" />,
    label: 'Aircraft Technician'
  },
  crew: { 
    icon: <Users className="h-5 w-5" aria-hidden="true" />,
    label: 'Cabin Crew'
  },
  default: { 
    icon: <FileText className="h-5 w-5" aria-hidden="true" />,
    label: 'Role'
  }
};

/**
 * Role Selection Screen Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.roles - Object containing role definitions
 * @param {Function} props.onSelectRole - Callback when a role is selected
 * @param {Function} props.onChatOpen - Callback to open the chat sidebar
 */
const RoleSelectionScreen = ({ 
  roles = {}, 
  onSelectRole = () => {}, 
  onChatOpen = () => {} 
}) => {
  // State management
  const [selectedRole, setSelectedRole] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [hoveredRole, setHoveredRole] = useState(null);
  const [selectedRoleForTransition, setSelectedRoleForTransition] = useState(null);
  
  // Get roles as array and filter based on search term
  const roleEntries = Object.entries(roles);
  
  const filteredRoles = React.useMemo(() => {
    if (!searchTerm.trim()) return roleEntries;
    
    const searchLower = searchTerm.toLowerCase();
    return roleEntries.filter(([_, role]) => {
      return (
        role.title.toLowerCase().includes(searchLower) ||
        role.description.toLowerCase().includes(searchLower) ||
        (role.tags || []).some(tag => tag.toLowerCase().includes(searchLower))
      );
    });
  }, [searchTerm, roleEntries]);

  // Auto-dismiss welcome message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Handle role selection with smooth transition
   * @param {string} roleId - The ID of the selected role
   * @param {Object} role - The complete role object
   */
  const handleRoleSelect = React.useCallback((roleId, role) => {
    setSelectedRole(role);
    setSelectedRoleForTransition(roleId);
    setIsTransitioning(true);
    
    // Disable body scroll during transition
    document.body.style.overflow = 'hidden';
    
    // Allow animation to complete before triggering parent callback
    const transitionTimeout = setTimeout(() => {
      onSelectRole(roleId);
      // Re-enable scrolling after parent has handled the transition
      document.body.style.overflow = '';
    }, 800);
    
    return () => clearTimeout(transitionTimeout);
  }, [onSelectRole]);

  if (isTransitioning) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-900 to-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="relative"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            repeatType: 'reverse' 
          }}
        >
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
          <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            {roleIcons[selectedRole?.id] || roleIcons.default}
          </div>
        </motion.div>
        <motion.p 
          className="mt-6 text-lg font-medium text-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Loading {selectedRole?.title} view...
        </motion.p>
        <motion.p 
          className="mt-2 text-sm text-gray-400 max-w-xs text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.4 }}
        >
          Preparing your personalized aviation safety interface
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div 
      className={`min-h-screen bg-gray-950 transition-all duration-500 ${
        isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <span className="ml-2 text-xl font-semibold text-white">
                  Aviation Safety Navigator
                </span>
              </div>
            </div>
            
            <button
              onClick={onChatOpen}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
              aria-label="Open chat"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Welcome to the <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Civil Aviation Safety Navigator
            </span>
          </h1>
          
          <p className="text-lg text-gray-300 mb-6">
            Please select your role below to access tailored content and guidance specific to your aviation industry role.
          </p>
          
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"></div>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredRoles.map(([roleKey, role]) => {
            const isSelected = selectedRoleForTransition === roleKey;
            const isHovered = hoveredRole === roleKey;

            return (
              <div
                key={roleKey}
                onClick={() => handleRoleSelect(roleKey, role)}
                onMouseEnter={() => setHoveredRole(roleKey)}
                onMouseLeave={() => setHoveredRole(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRoleSelect(roleKey, role);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Select ${role.title} role`}
                className={`
                  group relative bg-gray-800/80 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 cursor-pointer
                  ${isSelected 
                    ? 'border-cyan-500 shadow-2xl shadow-cyan-500/20 scale-[1.02]' 
                    : 'border-gray-700/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10'
                  }
                  transform hover:-translate-y-1
                `}
              >
                {/* Selection overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl animate-pulse"></div>
                )}

                <div className="relative z-10 h-full flex flex-col">
                  {/* Role Icon */}
                  <div
                    className={`
                      w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 mx-auto
                      ${
                        isSelected
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/30'
                          : `bg-gradient-to-br ${role.color} shadow-lg ${isHovered ? 'scale-110' : ''}`
                      }
                    `}
                  >
                    {React.cloneElement(role.icon, { 
                      className: `w-10 h-10 text-white transition-transform duration-300 ${
                        isHovered ? 'scale-110' : ''
                      }` 
                    })}
                  </div>

                  {/* Role Information */}
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-center text-white mb-3">
                      {role.title}
                    </h3>
                    <p className="text-gray-300 text-center mb-6 min-h-[60px]">
                      {role.description}
                    </p>
                  </div>

                  {/* Select Button */}
                  <div className="mt-auto">
                    <div
                      className={`
                        flex items-center justify-center space-x-2 py-3 px-6 rounded-xl transition-all duration-300 w-full
                        ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                            : 'bg-gray-700/50 text-gray-300 group-hover:bg-gray-700/70 group-hover:text-white border border-gray-600/50 group-hover:border-cyan-500/30'
                        }
                      `}
                    >
                      {isSelected ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-medium">
                            Loading...
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-medium">
                            Select Role
                          </span>
                          <svg 
                            className={`w-4 h-4 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Status */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-wrap justify-center gap-4 text-sm text-gray-400 bg-gray-800/50 px-6 py-3 rounded-xl border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800/50 rounded-lg">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live System</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800/50 rounded-lg">
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              <span>CASA Documents</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800/50 rounded-lg">
              <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse delay-700"></div>
              <span>AI-Powered</span>
            </div>
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            Need help selecting a role? <button 
              onClick={onChatOpen}
              className="text-cyan-400 hover:text-cyan-300 transition-colors focus:outline-none focus:underline"
              aria-label="Get help with role selection"
            >
              Chat with our assistant
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default RoleSelectionScreen;
