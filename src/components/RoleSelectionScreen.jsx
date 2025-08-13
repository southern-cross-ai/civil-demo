import React, { useState } from "react";
import { MessageSquare } from "lucide-react";

/**
 * Role Selection Screen Component
 *
 * Props:
 * - onRoleSelect: function(roleId) - Called when user selects a role
 * - roles: object - Role definitions from main container
 * - isTransitioning: boolean - Whether screen is transitioning
 * - onChatOpen: function - Callback to open the chat sidebar
 */
const RoleSelectionScreen = ({ onRoleSelect, roles, isTransitioning, onChatOpen }) => {
  const [selectedRoleForTransition, setSelectedRoleForTransition] = useState(null);
  const [hoveredRole, setHoveredRole] = useState(null);

  const handleRoleSelect = (roleId) => {
    setSelectedRoleForTransition(roleId);
    // Show loading state for 1 second, then navigate
    setTimeout(() => {
      onRoleSelect(roleId);
      setSelectedRoleForTransition(null);
    }, 1000);
  };

  // Convert roles object to array for rendering
  const roleList = Object.entries(roles).map(([key, role]) => ({
    ...role,
    key,
  }));

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
          {roleList.map((role) => {
            const isSelected = selectedRoleForTransition === role.key;
            const isHovered = hoveredRole === role.key;

            return (
              <div
                key={role.key}
                onClick={() => handleRoleSelect(role.key)}
                onMouseEnter={() => setHoveredRole(role.key)}
                onMouseLeave={() => setHoveredRole(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRoleSelect(role.key);
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
