import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  FileText,
  ChevronRight
} from 'lucide-react';

/**
 * Cabin Crew Dashboard Component
 *
 * Props:
 * - role: object - Current role information
 * - onNavigate: object - Navigation functions from main container
 * - searchQuery: string - Current search query
 * - setSearchQuery: function - Update search query
 * - isTransitioning: boolean - Whether screen is transitioning
 */
const CabinCrewDashboard = ({ role, onNavigate, searchQuery, setSearchQuery, isTransitioning }) => {
  const [activeFilters, setActiveFilters] = useState(['Passenger Safety', 'Emergency Procedures']);
  const [expandedSection, setExpandedSection] = useState(null);

  const filters = [
    { id: 'passenger-safety', label: 'Passenger Safety', active: true },
    { id: 'emergency-procedures', label: 'Emergency Procedures', active: true },
    { id: 'onboard-safety', label: 'Onboard Safety', active: false },
    { id: 'general-ops', label: 'General Flight Operations', active: false }
  ];

  const advisorySummaries = [
    {
      id: 'caap-253-02-crew',
      title: 'CAAP 253-02',
      subtitle: 'Passenger Safety Briefings',
      summary: 'Outlines requirements for cabin crew to deliver safety demonstrations and ensure passenger compliance with safety instructions.',
      category: 'Passenger Safety',
      updated: 'July 2025',
      priority: 'High',
      tag: 'Updated July 2025',
      fullContent: 'Detailed guidelines for cabin crew on conducting pre-flight safety demonstrations, managing passenger briefings, and ensuring compliance with safety card instructions. Includes specific procedures for exit row briefings and special assistance passengers.',
      expandedSections: [
        { title: 'Pre-flight Demonstrations', content: 'Standard safety demonstration procedures including seatbelt operation, oxygen mask deployment, and life vest instructions.' },
        { title: 'Exit Row Procedures', content: 'Special briefing requirements for passengers seated in exit rows, including ability assessments and responsibility explanations.' },
        { title: 'Special Assistance', content: 'Protocols for assisting passengers with disabilities, unaccompanied minors, and passengers requiring extra assistance.' }
      ]
    },
    {
      id: 'cao-20-16-3',
      title: 'CAO 20.16.3',
      subtitle: 'Cabin Safety Equipment',
      summary: 'Requirements for cabin safety equipment positioning, maintenance, and crew familiarity with emergency equipment.',
      category: 'Emergency Procedures',
      updated: 'June 2025',
      priority: 'High',
      tag: 'High Priority',
      fullContent: 'Comprehensive requirements for cabin safety equipment including emergency slides, life rafts, fire extinguishers, and first aid equipment. Covers crew training requirements and equipment checks.',
      expandedSections: [
        { title: 'Emergency Equipment Checks', content: 'Daily and pre-flight inspection procedures for all cabin safety equipment including emergency exits and slides.' },
        { title: 'Fire Safety Procedures', content: 'Use of fire extinguishers, smoke detection procedures, and cabin fire emergency protocols.' },
        { title: 'Medical Equipment', content: 'First aid kit contents, AED operation, and medical emergency response procedures.' }
      ]
    },
    {
      id: 'caap-259-1',
      title: 'CAAP 259-1',
      subtitle: 'Carry-on Luggage Safety',
      summary: 'Guidelines for managing carry-on luggage stowage, weight limits, and ensuring cabin safety during turbulence.',
      category: 'Passenger Safety',
      updated: 'May 2025',
      priority: 'Medium',
      tag: 'Updated May 2025',
      fullContent: 'Detailed procedures for cabin crew regarding carry-on luggage management, overhead bin safety, and securing cabin items during different phases of flight.',
      expandedSections: [
        { title: 'Luggage Stowage', content: 'Proper procedures for assisting passengers with overhead bin usage and under-seat storage requirements.' },
        { title: 'Weight and Size Limits', content: 'Enforcement of carry-on restrictions and procedures for oversized or overweight items.' },
        { title: 'Turbulence Procedures', content: 'Securing loose items and ensuring passenger compliance during turbulence events.' }
      ]
    },
    {
      id: 'ac-121-32',
      title: 'AC 121-32',
      subtitle: 'Crew Resource Management',
      summary: 'Framework for effective communication and coordination between cabin crew and flight deck during normal and emergency operations.',
      category: 'Emergency Procedures',
      updated: 'April 2025',
      priority: 'Medium',
      tag: 'Updated April 2025',
      fullContent: 'Guidelines for cabin crew on effective communication protocols, situational awareness, and coordination with flight crew during various operational scenarios.',
      expandedSections: [
        { title: 'Communication Protocols', content: 'Standard phraseology and communication procedures between cabin crew and flight deck.' },
        { title: 'Emergency Coordination', content: 'Roles and responsibilities during emergency situations requiring cabin and flight crew coordination.' },
        { title: 'Passenger Management', content: 'Techniques for managing difficult passengers and maintaining cabin order during irregular operations.' }
      ]
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

  const toggleExpansion = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        onNavigate.navigateToSearch(searchQuery);
      }
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Cabin Crew Dashboard
              </h2>
              <p className="text-blue-300">Cabin and Passenger Safety</p>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              <strong>Cabin Crew View</strong> – Cabin and Passenger Safety guidance.
              Find guidelines for cabin duties, emergency procedures, and passenger management.
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
              onKeyPress={handleSearch}
              placeholder="Search cabin procedures, safety guidelines, or emergency protocols…"
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg pl-12 pr-20 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-sm transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Pre-filtered for cabin crew (adjust as needed):</span>
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
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
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
              <h3 className="text-xl font-semibold text-white mb-6">Cabin Safety Guidance</h3>

              <div className="space-y-4">
                {filteredSummaries.map((advisory) => (
                  <div
                    key={advisory.id}
                    className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4 hover:border-blue-500/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-400" />
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
                          {advisory.tag}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">
                      {advisory.summary}
                    </p>

                    {/* Expandable Sections */}
                    {expandedSection === advisory.id && (
                      <div className="mt-4 border-t border-gray-600/30 pt-4">
                        <p className="text-gray-300 text-sm mb-4 font-medium">{advisory.fullContent}</p>

                        <div className="space-y-3">
                          {advisory.expandedSections.map((section, index) => (
                            <div key={index} className="bg-gray-800/30 rounded-lg p-3 border border-gray-600/20">
                              <h5 className="font-medium text-blue-300 mb-2">{section.title}</h5>
                              <p className="text-gray-400 text-sm">{section.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleExpansion(advisory.id)}
                        className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-3 py-1 rounded text-sm transition-colors duration-200 border border-blue-500/30"
                      >
                        {expandedSection === advisory.id ? 'Hide Details' : 'Expand Details'}
                      </button>

                      <button
                        onClick={() => handleDocumentClick(advisory.id)}
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200 flex items-center space-x-1"
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
                <Download className="w-5 h-5 text-blue-400" />
                <span>Crew Resources</span>
              </h3>

              <button
                onClick={() => handleDownload('Cabin Safety Checklist')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 mb-3"
              >
                <Download className="w-4 h-4" />
                <span>Cabin Safety Checklist (PDF)</span>
              </button>

              <p className="text-xs text-gray-400 text-center">
                Pre-takeoff cabin secure checks and procedures
              </p>
            </div>

            {/* Cabin Focus Areas */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Focus Areas</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-blue-900/20 rounded border border-blue-500/20">
                  <span className="text-blue-300 text-sm">Normal Operations</span>
                  <span className="text-blue-400 text-xs">2 items</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-900/20 rounded border border-red-500/20">
                  <span className="text-red-300 text-sm">Emergency Procedures</span>
                  <span className="text-red-400 text-xs">2 items</span>
                </div>
              </div>
            </div>

            {/* Key Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Overview</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Active Guidelines</span>
                  <span className="text-blue-300 font-semibold">{filteredSummaries.length}</span>
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
              <h3 className="text-lg font-semibold text-white mb-4">Recent Changes</h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Safety briefing updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                  <span className="text-sm text-gray-300">Emergency equipment revised</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
                  <span className="text-sm text-gray-300">Luggage guidelines updated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CabinCrewDashboard;