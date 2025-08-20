import React, { useState, useEffect, useRef } from 'react';
import { Shield, Plane, Users, Wrench, ClipboardCheck, MessageSquare, ArrowLeft, Search, Settings, Bell, HelpCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RoleSelectionScreen from './RoleSelectionScreen';
import ChatSidebar from './ChatSidebar';
import PilotDashboard from './PilotDashboard';
import CabinCrewDashboard from './CabinCrewDashboard';
import SafetyOfficerDashboard from './SafetyOfficerDashboard';
import ComplianceStaffDashboard from './ComplianceStaffDashboard';
import SearchResultsView from './SearchResultsView';
import DocumentDetailPage from './DocumentDetailPage';
import MaintenanceTechnicianDashboard from './MaintenanceTechnician';
import ThemeToggle from './ThemeToggle';
import QuickActions from './QuickActions';
import SystemStatus from './SystemStatus';
import RecentDocuments from './RecentDocuments';
import KeyboardShortcuts from './KeyboardShortcuts'; 

// Placeholder fallback components
const MaintenanceDashboard = (props) => <div className="text-center py-20 text-gray-400">Maintenance Dashboard </div>;
const CivilAviationSafetyNavigator = () => { 
  // Core navigation state 
  const [currentScreen, setCurrentScreen] = useState('role-selection'); 
  const [selectedRole, setSelectedRole] = useState(null); 
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [documentId, setDocumentId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [chatMessages, setChatMessages] = useState([ 
    { id: 1, type: 'assistant', content: 'Welcome! I can help you find aviation safety information. Try asking about specific regulations or safety procedures.', timestamp: Date.now(), citations: [] } 
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
      // Role definitions - single source of truth for role configurations
  const roles = {
    'pilot': { 
      id: 'pilot', 
      title: 'Pilot', 
      description: 'Access flight operations manuals, checklists, and safety procedures', 
      icon: <Plane className="w-8 h-8" />, 
      color: 'from-cyan-500 to-blue-600' 
    },
    'cabin-crew': { 
      id: 'cabin-crew', 
      title: 'Cabin Crew', 
      description: 'Access cabin safety procedures and emergency protocols', 
      icon: <Users className="w-8 h-8" />, 
      color: 'from-blue-500 to-purple-600' 
    },
    'maintenance': { 
      id: 'maintenance', 
      title: 'Maintenance', 
      description: 'Access maintenance manuals and technical documentation', 
      icon: <Wrench className="w-8 h-8" />, 
      color: 'from-purple-500 to-pink-600' 
    },
    'safety': { 
      id: 'safety', 
      title: 'Safety Officer', 
      description: 'Access safety reports and risk assessments', 
      icon: <Shield className="w-8 h-8" />, 
      color: 'from-green-500 to-cyan-600' 
    },
    'compliance': { 
      id: 'compliance', 
      title: 'Compliance', 
      description: 'Access regulatory requirements and audit documentation', 
      icon: <ClipboardCheck className="w-8 h-8" />, 
      color: 'from-amber-500 to-orange-600' 
    }
  };
  
  // Navigation API - single source of truth for navigation
  const navigationAPI = {
    navigateToScreen: (screen, options = {}) => {
      setIsTransitioning(true);

      if (options.role) setSelectedRole(options.role);
      if (options.searchQuery) setSearchQuery(options.searchQuery);
      if (options.query) setSearchQuery(options.query); // accept alias from callers
      if (options.documentId) setDocumentId(options.documentId);
      
      setTimeout(() => {
        setCurrentScreen(screen);
        setIsTransitioning(false);
      }, 300);
    },

    navigateToSearch: (query) => {
      setSearchQuery(query);
      navigationAPI.navigateToScreen('search-results');
    },

    navigateToDocument: (docId) => {
      setDocumentId(docId);
      navigationAPI.navigateToScreen('document-detail');
    },

    navigateBack: () => {
      if (currentScreen !== 'role-selection') {
        navigationAPI.navigateToScreen('role-selection');
        setSelectedRole(null);
      }
    },
    
    goBack: () => navigationAPI.navigateBack()
  };
  
  // Role selection handler 
  const handleRoleSelect = (roleId) => { 
    const dashboardMap = { 
      'pilot': 'pilot-dashboard', 
      'cabin-crew': 'cabin-crew-dashboard', 
      'maintenance': 'maintenance-dashboard', 
      'safety': 'safety-dashboard', 
      'compliance': 'compliance-dashboard' 
    };
    navigationAPI.navigateToScreen(dashboardMap[roleId], { role: roleId });
  };

  // Get current role info 
  const getCurrentRole = () => { 
    return selectedRole ? roles[selectedRole] : null; 
  };

  // Chat functionality 
  const mockResponses = [ 
    { content: "According to CAAP 253-02, pilots must say the following in pre-flight safety briefings: location of emergency exits, operation of seat belts, location and use of life jackets, oxygen mask procedures, and smoking restrictions.", citations: ['CAAP 253-02', 'Section 4.2', 'CAO 20.16.3'] }, 
    { content: "Exit row passengers must be briefed on their responsibilities and demonstrate physical capability to operate emergency exits according to passenger safety guidelines.", citations: ['CAAP 253-02', 'AC 121-24', 'Part 121.571'] } 
  ];

  // Handle new feature actions
  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'search':
        navigationAPI.navigateToScreen('search-results');
        break;
      case 'chat':
        setIsChatOpen(true);
        break;
      case 'recent':
        // Recent documents will be handled by the component itself
        break;
      case 'favorites':
        // Favorites will be handled by the component itself
        break;
      case 'checklist':
        // Navigate to pilot checklist
        if (selectedRole === 'pilot') {
          navigationAPI.navigateToScreen('pilot-dashboard');
        }
        break;
      case 'procedures':
        // Navigate to emergency procedures
        if (selectedRole === 'pilot') {
          navigationAPI.navigateToScreen('pilot-dashboard');
        }
        break;
      default:
        console.log('Quick action:', actionId);
    }
  };

  const handleShortcut = (shortcut) => {
    switch (shortcut) {
      case 'quick-search':
        navigationAPI.navigateToScreen('search-results');
        break;
      case 'open-chat':
        setIsChatOpen(true);
        break;
      case 'recent-docs':
        // Recent documents will be handled by the component itself
        break;
      case 'quick-actions':
        // Quick actions will be handled by the component itself
        break;
      case 'system-status':
        // System status will be handled by the component itself
        break;
      case 'toggle-theme':
        // Theme toggle will be handled by the component itself
        break;
      case 'navigate-back':
        navigationAPI.goBack();
        break;
      case 'home':
        navigationAPI.navigateToScreen('role-selection');
        break;
      case 'fullscreen':
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
        break;
      default:
        console.log('Shortcut:', shortcut);
    }
  };

  const handleDocumentOpen = (doc) => {
    // Navigate to document detail page
    navigationAPI.navigateToDocument(doc.id);
  };

  const handleChatSubmit = () => { 
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: chatInput,
      timestamp: Date.now()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responseIndex = Math.floor(Math.random() * mockResponses.length);
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: mockResponses[responseIndex].content,
        timestamp: Date.now(),
        citations: mockResponses[responseIndex].citations
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };



  // Render header component with enhanced UI
  const renderHeader = () => {
    const role = getCurrentRole();
    const unreadCount = notifications.filter(n => !n.read).length;
    
    return (
      <motion.header 
        className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 shadow-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              {currentScreen !== 'role-selection' && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={navigationAPI.goBack}
                  className="mr-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </motion.button>
              )}
              <div className="flex-shrink-0 flex items-center">
                <motion.div 
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                >
                  <Plane className="h-8 w-8 text-blue-400" />
                </motion.div>
                <motion.span 
                  className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {role?.title ? (
                    <>
                      <span className="text-white">{role.title} </span>
                      <span className="text-blue-400">Dashboard</span>
                    </>
                  ) : 'Aviation Safety Navigator'}
                </motion.span>
              </div>
            </div>
            
            <div className="flex-1 max-w-2xl px-4">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-700 rounded-xl bg-gray-800/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="Search regulations, procedures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigationAPI.navigateToScreen('search-results', { searchQuery });
                    }
                  }}
                  aria-label="Search aviation documents"
                />
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <motion.span 
                    className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200 ${
                  isChatOpen 
                    ? 'text-blue-400 bg-blue-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/80'
                }`}
                aria-label="Open chat"
                id="chat-toggle-button"
              >
                <MessageSquare className="h-5 w-5" />
              </motion.button>
              
              {/* New feature buttons */}
              <ThemeToggle onThemeChange={setCurrentTheme} />
              <QuickActions onAction={handleQuickAction} role={getCurrentRole()} />
              <SystemStatus />
              <RecentDocuments onDocumentOpen={handleDocumentOpen} role={getCurrentRole()} />
              <KeyboardShortcuts onShortcut={handleShortcut} />
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200"
                aria-label="Help and support"
              >
                <HelpCircle className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Notifications panel */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div 
              className="absolute right-4 mt-2 w-80 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 overflow-hidden"
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="p-3 border-b border-gray-700 bg-gray-800/80">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">Notifications</h3>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-white"
                    aria-label="Close notifications"
                  >
                    &times;
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-3 border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors ${
                        !notification.read ? 'bg-blue-500/10' : ''
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                          <Zap className={`h-4 w-4 ${
                            notification.type === 'alert' ? 'text-red-400' : 'text-blue-400'
                          }`} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-200">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-400 text-sm">
                    No new notifications
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 text-center border-t border-gray-700">
                  <button 
                    onClick={() => {
                      setNotifications(notifications.map(n => ({ ...n, read: true })));
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    );
  };

  // Enhanced particles background with interactive elements
  const renderParticles = () => {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '40px 40px'
            }}
          />
        </div>
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute ${
              particle.shape === 'circle' ? 'rounded-full' : 'rounded-sm'
            }`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              backgroundColor: particle.color,
              rotate: particle.rotation,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.size * 0.5}px ${particle.color}40`
            }}
            animate={{
              y: [0, -10, 0],
              x: [0, Math.sin(Date.now() * 0.001 + particle.id * 10) * 10, 0],
              rotate: particle.rotation + 360
            }}
            transition={{
              y: {
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatType: 'reverse'
              },
              x: {
                duration: 8 + Math.random() * 15,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatType: 'reverse'
              },
              rotate: {
                duration: 100 + Math.random() * 200,
                repeat: Infinity,
                ease: 'linear'
              }
            }}
          />
        ))}
        
        {/* Glow effects */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-gray-900/80" />
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\' /%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")'
        }} />
        
        {/* Pulsing glow */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
      </div>
    );
  };

  // Enhanced particles state with more variety
  const [particles, setParticles] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.4 + 0.1,
      color: ['cyan', 'blue', 'indigo', 'sky'][Math.floor(Math.random() * 4)],
      shape: Math.random() > 0.7 ? 'circle' : 'square',
      rotation: Math.random() * 360
    }))
  );
  
  // Add notification state
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'Welcome to Aviation Safety Navigator', read: false, timestamp: Date.now() - 3600000 }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Add new feature states
  const [currentTheme, setCurrentTheme] = useState('dark');

  // Initialize particles effect - single source of truth for particles animation
  useEffect(() => { 
    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          y: particle.y > 105 ? -5 : particle.y + particle.speed,
          x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.05
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Render current screen based on navigation state
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'role-selection':
        return (
          <RoleSelectionScreen 
            roles={roles}
            onSelectRole={handleRoleSelect}
            onChatOpen={() => setIsChatOpen(true)}
          />
        );
      case 'pilot-dashboard':
        return (
          <PilotDashboard
            role={getCurrentRole()}
            onNavigate={navigationAPI}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isTransitioning={isTransitioning}
          />
        );
      case 'cabin-crew-dashboard':
        return (
          <CabinCrewDashboard
            role={getCurrentRole()}
            onNavigate={navigationAPI}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isTransitioning={isTransitioning}
          />
        );
      case 'maintenance-dashboard':
        // Only change this place
        return (
          <MaintenanceTechnicianDashboard
            role={getCurrentRole()}
            onNavigate={navigationAPI}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isTransitioning={isTransitioning}
          />
        );
      case 'safety-dashboard':
        return (
          <SafetyOfficerDashboard
            role={getCurrentRole()}
            onNavigate={navigationAPI}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isTransitioning={isTransitioning}
          />
        );
      case 'compliance-dashboard':
        return (
          <ComplianceStaffDashboard
            role={getCurrentRole()}
            onNavigate={navigationAPI}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isTransitioning={isTransitioning}
          />
        );
      case 'search-results':
        return (
          <SearchResultsView
            role={getCurrentRole()}
            onNavigate={navigationAPI}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isTransitioning={isTransitioning}
          />
        );
      case 'document-detail':
        return (
          <DocumentDetailPage
            role={getCurrentRole()}
            onNavigate={navigationAPI}
            documentId={documentId}
            isTransitioning={isTransitioning}
          />
        );
      default:
        return <div className="text-center py-20 text-gray-400">Screen not found</div>;
    }
  };

  // Main component render
  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/casn.png')" }}
        aria-hidden="true"
      />

      {/* Subtle dark overlay for text contrast (tweak opacity as you like) */}
      <div className="absolute inset-0 -z-10 bg-black/55 backdrop-blur-[1px]" aria-hidden="true" />

      {/* Existing UI */}
      <div
        className="relative min-h-screen text-white overflow-x-hidden"
        role="application"
        aria-label="Civil Aviation Safety Navigator Application"
      >
        {renderParticles()}
        {renderHeader()}
        <main
          className="relative z-10 pt-8 pb-4 max-w-7xl mx-auto min-h-[80vh] px-4 sm:px-6 lg:px-8"
          role="main"
          aria-live="polite"
          aria-atomic="true"
        >
          {isTransitioning ? (
            <div className="sr-only" role="status" aria-live="polite">
              Loading content, please wait...
            </div>
          ) : null}
          {renderCurrentScreen()}
        </main>

        <ChatSidebar
          open={isChatOpen}
          onClose={() => {
            setIsChatOpen(false);
            const chatToggle = document.getElementById('chat-toggle-button');
            if (chatToggle) setTimeout(() => chatToggle.focus(), 0);
          }}
          messages={chatMessages}
          input={chatInput}
          setInput={setChatInput}
          onSubmit={handleChatSubmit}
          isTyping={isTyping}
        />
      </div>
    </div>
  );
}

export default CivilAviationSafetyNavigator;
