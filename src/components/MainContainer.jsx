import React, { useState, useEffect } from 'react';
import { Shield, Plane, Users, Wrench, ClipboardCheck, MessageSquare, ArrowLeft, Search, Settings } from 'lucide-react';
import RoleSelectionScreen from './RoleSelectionScreen';
import ChatSidebar from './ChatSidebar';
import PilotDashboard from './PilotDashboard';
import CabinCrewDashboard from './CabinCrewDashboard';
import SafetyOfficerDashboard from './SafetyOfficerDashboard';
import ComplianceStaffDashboard from './ComplianceStaffDashboard';
import SearchResultsView from './SearchResultsView';
import DocumentDetailPage from './DocumentDetailPage';
import MaintenanceTechnicianDashboard from './MaintenanceTechnician'; 

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



  // Render header component
  const renderHeader = () => {
    const role = getCurrentRole();
    
    return (
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              {currentScreen !== 'role-selection' && (
                <button 
                  onClick={navigationAPI.goBack}
                  className="mr-4 p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="flex-shrink-0 flex items-center">
                <Plane className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-semibold text-white">
                  {role?.title ? `${role.title} Dashboard` : 'Aviation Safety Navigator'}
                </span>
              </div>
            </div>
            
            <div className="flex-1 max-w-2xl px-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              </div>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                aria-label="Open chat"
                id="chat-toggle-button"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
              <button 
                className="ml-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  };

  // Render particles background
  const renderParticles = () => {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-500/20"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 20 + 10}s linear infinite`,
              animationDelay: Math.random() * 5 + 's',
              opacity: Math.random() * 0.5 + 0.1
            }}
          />
        ))}
        <style jsx>{`
          @keyframes float {
            0% { transform: translateY(0) translateX(0); }
            100% { transform: translateY(-100vh) translateX(20px); }
          }
        `}</style>
      </div>
    );
  };

  // State for particles animation
  const [particles, setParticles] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.2 + 0.1,
      opacity: Math.random() * 0.3 + 0.1,
      color: Math.random() > 0.5 ? 'cyan' : 'blue'
    }))
  );

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
            onRoleSelect={handleRoleSelect}
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
        // 只改这一处
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
    <div 
      className="relative min-h-screen bg-gray-950 text-white overflow-x-hidden"
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
          // Return focus to the chat toggle button when closing
          const chatToggle = document.getElementById('chat-toggle-button');
          if (chatToggle) {
            setTimeout(() => chatToggle.focus(), 0);
          }
        }}
        messages={chatMessages}
        input={chatInput}
        setInput={setChatInput}
        onSubmit={handleChatSubmit}
        isTyping={isTyping}
      />
    </div>
  );
}

export default CivilAviationSafetyNavigator;
