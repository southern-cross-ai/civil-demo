import React, { useState } from 'react';
import {
  Plane,
  Search,
  Filter,
  Download,
  FileText,
  ChevronRight
} from 'lucide-react';

/**
 * Pilot Dashboard Component
 *
 * Props:
 * - role: object - Current role information
 * - onNavigate: object - Navigation functions from main container
 * - searchQuery: string - Current search query
 * - setSearchQuery: function - Update search query
 * - isTransitioning: boolean - Whether screen is transitioning
 */
const PilotDashboard = ({ role, onNavigate, searchQuery, setSearchQuery, isTransitioning }) => {
  const [activeFilters, setActiveFilters] = useState(['Flight Operations']);
  const [expandedSummary, setExpandedSummary] = useState(null);

  const filters = [
    { id: 'flight-ops', label: 'Flight Operations', active: true },
    { id: 'cabin-safety', label: 'Cabin Safety', active: false },
    { id: 'weather-preflight', label: 'Weather & Pre-flight', active: false }
  ];

  const advisorySummaries = [
    {
      id: 'caap-253-02',
      title: 'CAAP 253-02',
      subtitle: 'Passenger Safety Information',
      summary: 'Provides guidelines on the safety information that must be given to passengers by operators, covering briefing card content and exit row instructions.',
      category: 'Flight Operations',
      updated: 'July 2025',
      priority: 'High',
      fullSummary: 'This CAAP outlines the requirements for passenger safety information including pre-flight safety demonstrations, briefing cards, and special procedures for exit row passengers. Operators must ensure all passengers receive adequate safety information before takeoff.'
    },
    {
      id: 'ac-91-10',
      title: 'AC 91-10',
      subtitle: 'Operations in Vicinity of Aerodromes',
      summary: 'Details operational procedures and communication requirements when operating aircraft near controlled and uncontrolled aerodromes.',
      category: 'Flight Operations',
      updated: 'June 2025',
      priority: 'Medium',
      fullSummary: 'Advisory circular covering standard operating procedures for aircraft operations near aerodromes, including radio procedures, traffic patterns, and separation requirements.'
    },
    {
      id: 'caap-235-1',
      title: 'CAAP 235-1',
      subtitle: 'Carriage of Dangerous Goods',
      summary: 'Guidelines for the safe transport of dangerous goods by air, including packaging, documentation, and crew training requirements.',
      category: 'Flight Operations',
      updated: 'May 2025',
      priority: 'High',
      fullSummary: 'Comprehensive guidance on dangerous goods transport including classification, packaging standards, loading procedures, and emergency response protocols for flight crews.'
    },
    {
      id: 'ac-119-16',
      title: 'AC 119-16',
      subtitle: 'Safety Management Systems',
      summary: 'Framework for implementing and maintaining effective safety management systems in aviation operations.',
      category: 'Flight Operations',
      updated: 'April 2025',
      priority: 'Medium',
      fullSummary: 'Detailed requirements for SMS implementation including hazard identification, risk assessment, safety performance monitoring, and management of change processes.'
    }
  ];

  const toggleFilter = (filterId) => {
    const filter = filters.find(f => f.id === filterId);
    if (filter) {
      const isActive = activeFilters.includes(filter.label);
      if (isActive) {
        setActiveFilters(prev => prev.filter(f => f !== filter.label));
      } else {
        setActiveFilters(prev => [...prev, filter.label]);
      }
    }
  };

  const filteredSummaries = advisorySummaries.filter(summary =>
    activeFilters.length === 0 || activeFilters.includes(summary.category)
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate.navigateToSearch(searchQuery);
    }
  };

  const handleDocumentClick = (documentId) => {
    onNavigate.navigateToDocument(documentId);
  };

  const handleDownload = (type) => {
    // Simulate download
    alert(`Downloaded: ${type}`);
  };

  return (
    <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <main className="container mx-auto px-6 py-8 relative z-10">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Pilot Dashboard
              </h2>
              <p className="text-cyan-300">Flight Operations and Safety</p>
            </div>
          </div>

          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 mb-6">
            <p className="text-cyan-300 text-sm">
              <strong>Pilot View</strong> – Flight Operations and Safety guidance.
              Search regulations for pre-flight procedures, passenger briefings, and operational requirements.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              placeholder="Search circulars, rules, or flight guidance…"
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg pl-12 pr-20 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-1.5 rounded text-sm transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter by category:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => {
              const isActive = activeFilters.includes(filter.label);
              return (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/30'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Advisory Summaries */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Advisory Summaries</h3>

              <div className="space-y-4">
                {filteredSummaries.map((advisory) => (
                  <div
                    key={advisory.id}
                    className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4 hover:border-cyan-500/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        <div>
                          <h4 className="font-semibold text-white">{advisory.title}</h4>
                          <p className="text-sm text-gray-400">{advisory.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          advisory.priority === 'High' 
                            ? 'bg-red-900/30 text-red-300 border border-red-500/30'
                            : 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {advisory.priority}
                        </span>
                        <span className="text-xs text-gray-500">{advisory.updated}</span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">
                      {expandedSummary === advisory.id ? advisory.fullSummary : advisory.summary}
                    </p>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setExpandedSummary(
                          expandedSummary === advisory.id ? null : advisory.id
                        )}
                        className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 px-3 py-1 rounded text-sm transition-colors duration-200 border border-cyan-500/30"
                      >
                        {expandedSummary === advisory.id ? 'Show Less' : 'Read More'}
                      </button>

                      <button
                        onClick={() => handleDocumentClick(advisory.id)}
                        className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors duration-200 flex items-center space-x-1"
                      >
                        <span>Open Document</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Quick Links */}
          <div className="space-y-6">
            {/* Download Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Download className="w-5 h-5 text-cyan-400" />
                <span>Quick Downloads</span>
              </h3>

              <button
                onClick={() => handleDownload('Pre-Flight Safety Checklist')}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Pre-Flight Safety Checklist (PDF)</span>
              </button>

              <p className="text-xs text-gray-400 mt-2 text-center">
                Comprehensive pre-flight safety procedures
              </p>
            </div>

            {/* Key Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Key Information</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Active Advisories</span>
                  <span className="text-cyan-300 font-semibold">{filteredSummaries.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">High Priority</span>
                  <span className="text-red-300 font-semibold">
                    {filteredSummaries.filter(a => a.priority === 'High').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Last Updated</span>
                  <span className="text-green-300 font-semibold">July 2025</span>
                </div>
              </div>
            </div>

            {/* Recent Updates */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Updates</h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">CAAP 253-02 updated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                  <span className="text-sm text-gray-300">AC 91-10 revised</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
                  <span className="text-sm text-gray-300">New SMS guidelines</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PilotDashboard;