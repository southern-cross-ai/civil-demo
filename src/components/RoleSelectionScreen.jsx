import React, { useState } from "react";
import {
  Plane,
  Users,
  Wrench,
  Shield,
  ClipboardCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

/**
 * Role Selection Screen Component
 *
 * Props:
 * - onRoleSelect: function(roleId) - Called when user selects a role
 * - roles: object - Role definitions from main container
 * - isTransitioning: boolean - Whether screen is transitioning
 */
const RoleSelectionScreen = ({ onRoleSelect, roles, isTransitioning, onChatOpen }) => {
  const [selectedRoleForTransition, setSelectedRoleForTransition] =
    useState(null);

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
      className={`transition-all duration-500 ${
        isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <main className="container mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/50 relative">
            <Shield className="w-10 h-10 text-white" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Select Your Role
          </h2>
          <p className="text-gray-400 text-lg mb-2 max-w-2xl mx-auto">
            Welcome to the Civil Aviation Safety Navigator. Please select your
            role to continue with personalized content and guidance.
          </p>
          <p className="text-gray-500 text-sm">
            Content will be customized based on your selected aviation industry
            role
          </p>

          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {roleList.map((role) => {
            const isSelected = selectedRoleForTransition === role.key;

            return (
              <div
                key={role.key}
                onClick={() => handleRoleSelect(role.key)}
                className={`
                  group relative bg-gray-800/50 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 cursor-pointer
                  ${
                    isSelected
                      ? "border-cyan-500 shadow-2xl shadow-cyan-500/30 scale-105"
                      : "border-gray-600/50 hover:border-cyan-500/70 hover:shadow-lg hover:shadow-cyan-500/20"
                  }
                  transform hover:scale-105 hover:-translate-y-1
                `}
              >
                {/* Selection overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl animate-pulse"></div>
                )}

                <div className="relative z-10">
                  {/* Role Icon */}
                  <div
                    className={`
                    w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 mx-auto
                    ${
                      isSelected
                        ? "bg-gradient-to-br from-cyan-400 to-blue-600 shadow-2xl shadow-cyan-500/50"
                        : `bg-gradient-to-br ${role.color} shadow-lg group-hover:shadow-xl`
                    }
                  `}
                  >
                    {React.cloneElement(role.icon, { className: "w-8 h-8 text-white" })}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>

                  {/* Role Information */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                      {role.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 group-hover:text-gray-300 transition-colors duration-300">
                      {role.description}
                    </p>

                    {/* Select Button */}
                    <div
                      className={`
                      flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-all duration-300
                      ${
                        isSelected
                          ? "bg-cyan-600 text-white"
                          : "bg-gray-700/50 text-gray-300 group-hover:bg-gray-600/50 group-hover:text-white"
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
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 text-sm text-gray-500 bg-gray-800/30 px-6 py-3 rounded-full border border-gray-700/50">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live System</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              <span>CASA Documents</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </main>
      {/* Floating Chat Sidebar Icon */}
      <button
        type="button"
        aria-label="Open chat sidebar"
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/30 rounded-full w-16 h-16 flex items-center justify-center hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-cyan-400/50"
        onClick={() => (typeof onChatOpen === 'function' ? onChatOpen() : null)}
        tabIndex={0}
      >
        <span className="sr-only">Open chat sidebar</span>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square w-8 h-8">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"></path>
        </svg>
      </button>
    </div>
  );
};

export default RoleSelectionScreen;
