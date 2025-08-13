import React, { useState, useEffect } from 'react';
import { Shield, Plane, Users, Wrench, ClipboardCheck, MessageSquare, ArrowLeft, Search, Settings } from 'lucide-react';

// Placeholder components for each screen - these will be replaced with actual screen components 
const RoleSelectionScreen = ({ onRoleSelect, roles }) => (
  <div>
    <h2>Role Selection Screen</h2>
    <p>Replace with RoleSelectionScreen component</p>
    <p>This should be a separate artifact/component</p>
  </div>
);
const PilotDashboard = ({ role, onNavigate, searchQuery, setSearchQuery }) => (
  <div>
    <h2>Pilot Dashboard</h2>
    <p>Replace with PilotDashboard component</p>
    <p>Current role: {role?.title}</p>
  </div>
);
const CabinCrewDashboard = ({ role, onNavigate, searchQuery, setSearchQuery }) => (
  <div>
    <h2>Cabin Crew Dashboard</h2>
    <p>Replace with CabinCrewDashboard component</p>
    <p>Current role: {role?.title}</p>
  </div>
);
const MaintenanceDashboard = ({ role, onNavigate, searchQuery, setSearchQuery }) => (
  <div>
    <h2>Maintenance Dashboard</h2>
    <p>Replace with MaintenanceDashboard component</p>
    <p>Current role: {role?.title}</p>
  </div>
);
const SafetyDashboard = ({ role, onNavigate, searchQuery, setSearchQuery }) => (
  <div>
    <h2>Safety Officer Dashboard</h2>
    <p>Replace with SafetyDashboard component</p>
    <p>Current role: {role?.title}</p>
  </div>
);
const ComplianceDashboard = ({ role, onNavigate, searchQuery, setSearchQuery }) => (
  <div>
    <h2>Compliance Dashboard</h2>
    <p>Replace with ComplianceDashboard component</p>
    <p>Current role: {role?.title}</p>
  </div>
);
const SearchResultsView = ({ role, onNavigate, searchQuery, setSearchQuery }) => (
  <div>
    <h2>Search Results</h2>
    <p>Replace with SearchResultsView component</p>
    <p>Query: "{searchQuery}"</p>
  </div>
);
const DocumentDetailPage = ({ role, onNavigate, documentId }) => (
  <div>
    <h2>Document Detail</h2>
    <p>Replace with DocumentDetailPage component</p>
    <p>Document: {documentId || 'CAAP 253-02'}</p>
  </div>
);
const CivilAviationSafetyNavigator = () => { 
  // Core navigation state 
  const [currentScreen, setCurrentScreen] = useState('role-selection'); 
  const [selectedRole, setSelectedRole] = useState(null); 
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Search state 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [documentId, setDocumentId] = useState(null);

  // Chat state 
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [chatMessages, setChatMessages] = useState([ 
    { id: 1, type: 'assistant', content: 'Welcome! I can help you find aviation safety information. Try asking about specific regulations or safety procedures.', timestamp: Date.now(), citations: [] } 
  ]);
  const [chatInput, setChatInput] = useState(''); 
  const [isTyping, setIsTyping] = useState(false);

  // Background particles 
  const [particles, setParticles] = useState([]);

  // Role definitions 
  const roles = { 
    'pilot': { id: 'pilot', title: 'Pilot', description: 'Flight Operations and Briefing Protocols', icon: Plane, color: 'from-cyan-500 to-blue-600' }, 
    'cabin-crew': { id: 'cabin-crew', title: 'Cabin Crew', description: 'Passenger Safety and Emergency Procedures', icon: Users, color: 'from-blue-500 to-purple-600' }, 
    'maintenance': { id: 'maintenance', title: 'Maintenance Technician', description: 'Aircraft Systems and Airworthiness', icon: Wrench, color: 'from-purple-500 to-pink-600' }, 
    'safety': { id: 'safety', title: 'Safety Officer', description: 'Risk Management and SMS Compliance', icon: Shield, color: 'from-green-500 to-cyan-600' }, 
    'compliance': { id: 'compliance', title: 'Compliance Staff', description: 'Regulatory Requirements and Documentation', icon: ClipboardCheck, color: 'from-amber-500 to-orange-600' } 
  };

  // Initialize particles 
  useEffect(() => { 
    const initialParticles = Array.from({ length: 15 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 2 + 1, speed: Math.random() * 0.2 + 0.1, opacity: Math.random() * 0.3 + 0.1, color: Math.random() > 0.5 ? 'cyan' : 'blue' }));
    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y > 105 ? -5 : particle.y + particle.speed,
        x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.05
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Navigation functions that will be passed to screen components 
  const navigationAPI = { 
    navigateToScreen: (screen, options = {}) => { 
      setIsTransitioning(true);

      if (options.role) setSelectedRole(options.role);
      if (options.searchQuery) setSearchQuery(options.searchQuery);
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
    }
  };

  // Role selection handler 
  const handleRoleSelect = (roleId) => { 
    const dashboardMap = { 'pilot': 'pilot-dashboard', 'cabin-crew': 'cabin-crew-dashboard', 'maintenance': 'maintenance-dashboard', 'safety': 'safety-dashboard', 'compliance': 'compliance-dashboard' };

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

    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: randomResponse.content,
        timestamp: Date.now(),
        citations: randomResponse.citations
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Render current screen with proper props 
  const renderCurrentScreen = () => { 
    const screenProps = { role: getCurrentRole(), onNavigate: navigationAPI, searchQuery, setSearchQuery, documentId, isTransitioning };

    switch (currentScreen) {
      case 'role-selection':
        return <RoleSelectionScreen onRoleSelect={handleRoleSelect} roles={roles} {...screenProps} />;
      case 'pilot-dashboard':
        return <PilotDashboard {...screenProps} />;
      case 'cabin-crew-dashboard':
        return <CabinCrewDashboard {...screenProps} />;
      case 'maintenance-dashboard':
        return <MaintenanceDashboard {...screenProps} />;
      case 'safety-dashboard':
        return <SafetyDashboard {...screenProps} />;
      case 'compliance-dashboard':
        return <ComplianceDashboard {...screenProps} />;
      case 'search-results':
        return <SearchResultsView {...screenProps} />;
      case 'document-detail':
        return <DocumentDetailPage {...screenProps} />;
      default:
        return <RoleSelectionScreen onRoleSelect={handleRoleSelect} roles={roles} {...screenProps} />;
    }
  };

  return (
    <>
    {/* Floating particles background */} 
    {particles.map(particle => ( 
      <div key={particle.id} className={`absolute rounded-full ${particle.color === 'cyan' ? 'bg-cyan-400' : 'bg-blue-400'}`} style={{ left: `${particle.x}%`, top: `${particle.y}%`, width: `${particle.size}px`, height: `${particle.size}px`, opacity: particle.opacity, filter: 'blur(0.5px)' }} /> 
    ))}
    {/* Background grid */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 25px 25px, cyan 1px, transparent 0)',
        backgroundSize: '50px 50px'
      }}></div>
    </div>

    {/* Header */}
    <header className="bg-gray-800/80 backdrop-blur-md border-b border-cyan-500/50 relative z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 relative">
              <Plane className="w-6 h-6 text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Civil Aviation Safety Navigator
              </h1>
              <p className="text-cyan-300 text-sm">CASA Document Assistant</p>
            </div>
          </div>
          
          {currentScreen !== 'role-selection' && (
            <button
              onClick={navigationAPI.navigateBack}
              className="flex items-center space-x-2 bg-gray-700/50 hover:bg-gray-600/50 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-gray-600/30 hover:border-cyan-500/50 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Change Role</span>
            </button>
          )}
        </div>
      </div>
    </header>

    {/* Main Content Area */}
    <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {renderCurrentScreen()}
    </div>

    {/* Chat Sidebar */}
    <div className={`fixed right-0 top-0 h-full transition-all duration-300 z-50 ${
      isChatOpen ? 'w-80' : 'w-0'
    }`}>
      {isChatOpen && (
        <div className="h-full bg-gray-900/95 backdrop-blur-md border-l border-cyan-500/50 flex flex-col">
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-semibold">Chat with Documents</h3>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-white transition-colors text-xl"
              >
                ×
              </button>
            </div>
            {selectedRole && (
              <div className="mt-2 text-xs text-cyan-400">
                Role: {getCurrentRole()?.title}
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`${
                  message.type === 'user' 
                    ? 'bg-cyan-900/30 border-l-4 border-cyan-400' 
                    : 'bg-gray-800/50'
                } p-3 rounded-lg`}>
                  <p className="text-sm text-gray-300">{message.content}</p>
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.citations.map((citation, idx) => (
                        <button
                          key={idx}
                          onClick={() => navigationAPI.navigateToDocument(citation)}
                          className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded cursor-pointer hover:bg-cyan-800/50 transition-colors"
                        >
                          {citation}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span className="text-xs text-gray-400">AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-700/50">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder="Ask about aviation safety..."
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
                disabled={isTyping}
              />
              <button 
                onClick={handleChatSubmit}
                disabled={!chatInput.trim() || isTyping}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
    {/* Chat Button */}
    {!isChatOpen && (
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/50 flex items-center justify-center hover:shadow-cyan-500/70 transition-all duration-300 z-40 group"
        title="Chat with Documents"
      >
        <MessageSquare className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
      </button>
    )}
  </>
  ); 
};

export default CivilAviationSafetyNavigator;