import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Filter,
  Download,
  FileText,
  Settings,
  ChevronRight
} from 'lucide-react';

/**
 * Maintenance Technician Dashboard Component
 *
 * Props:
 * - role: object - Current role information
 * - onNavigate: object - Navigation functions from main container
 * - searchQuery: string - Current search query
 * - setSearchQuery: function - Update search query
 * - isTransitioning: boolean - Whether screen is transitioning
 */
const MaintenanceTechnicianDashboard = ({
  role,
  onNavigate = { navigateToSearch: () => {}, navigateToDocument: () => {} },
  searchQuery = '',
  setSearchQuery = () => {},
  isTransitioning = false
}) => {
  const [activeFilters, setActiveFilters] = useState(['Airframe', 'Avionics']);
  const [expandedDoc, setExpandedDoc] = useState(null);

  // Make sure filter label and document category match exactly!
  const filters = [
    { id: 'airframe', label: 'Airframe' },
    { id: 'avionics', label: 'Avionics' },
    { id: 'engines', label: 'Engines' },
    { id: 'scheduled-inspections', label: 'Scheduled Inspections' }
  ];

  const technicalDocuments = [
    {
      id: 'ac-145-01',
      title: 'AC 145-01',
      subtitle: 'Maintenance Organization Requirements',
      summary: 'Outlines the requirements for establishing and maintaining an approved maintenance organization under Part 145 regulations.',
      category: 'Airframe',
      updated: 'July 2025',
      priority: 'High',
      fullContent: 'Comprehensive guidance for maintenance organizations seeking Part 145 approval, covering quality systems, personnel requirements, facility standards, and ongoing compliance obligations.'
    },
    {
      id: 'caap-30-05',
      title: 'CAAP 30-05',
      subtitle: 'Aircraft Component Maintenance',
      summary: 'Guidelines for maintenance, inspection, and overhaul of aircraft components including documentation and traceability requirements.',
      category: 'Avionics',
      updated: 'June 2025',
      priority: 'High',
      fullContent: 'Detailed procedures for aircraft component maintenance covering identification, inspection schedules, maintenance practices, and documentation requirements for regulatory compliance.'
    },
    {
      id: 'ac-43-216',
      title: 'AC 43-216',
      subtitle: 'Airworthiness Directive Compliance',
      summary: 'Procedures for identifying, implementing, and documenting compliance with mandatory airworthiness directives.',
      category: 'Engines',
      updated: 'May 2025',
      priority: 'Critical',
      fullContent: 'Essential guidance for maintenance technicians on airworthiness directive compliance including identification, implementation planning, and proper documentation practices.'
    },
    {
      id: 'caap-42-02',
      title: 'CAAP 42-02',
      subtitle: 'Maintenance Planning Systems',
      summary: 'Framework for developing and implementing comprehensive maintenance planning systems for aircraft operations.',
      category: 'Scheduled Inspections',
      updated: 'April 2025',
      priority: 'Medium',
      fullContent: 'Comprehensive framework for maintenance planning covering interval determination, resource management, and continuous improvement of maintenance systems.'
    }
  ];

  const toggleFilter = (filterLabel) => {
    const isActive = activeFilters.includes(filterLabel);
    if (isActive) {
      setActiveFilters(prev => prev.filter(f => f !== filterLabel));
    } else {
      setActiveFilters(prev => [...prev, filterLabel]);
    }
  };

  const filteredDocuments = technicalDocuments.filter(doc =>
    activeFilters.length === 0 || activeFilters.includes(doc.category)
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
    alert(`Downloaded: ${type}`);
  };

  return (
    <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <main className="container mx-auto px-6 py-8 relative z-10">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Maintenance Technician Dashboard
              </h2>
              <p className="text-purple-300">Airworthiness and Engineering</p>
            </div>
          </div>
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
            <p className="text-purple-300 text-sm">
              <strong>Maintenance View</strong> – Airworthiness and Engineering guidance.
              Access technical manuals, maintenance procedures, and compliance requirements for aircraft systems.
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
              placeholder="Search manuals or airworthiness guidance…"
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg pl-12 pr-20 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded text-sm transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter by technical area:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => {
              const isActive = activeFilters.includes(filter.label);
              return (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.label)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
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
          {/* Main Content - Technical Documents */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>Technical Documentation</span>
              </h3>

              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4 hover:border-purple-500/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Settings className="w-5 h-5 text-purple-400" />
                        <div>
                          <h4 className="font-semibold text-white">{doc.title}</h4>
                          <p className="text-sm text-gray-400">{doc.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          doc.priority === 'Critical'
                            ? 'bg-red-900/30 text-red-300 border border-red-500/30'
                            : doc.priority === 'High'
                            ? 'bg-orange-900/30 text-orange-300 border border-orange-500/30'
                            : 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {doc.priority}
                        </span>
                        <span className="text-xs text-gray-500">{doc.updated}</span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">
                      {expandedDoc === doc.id ? doc.fullContent : doc.summary}
                    </p>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
                        className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-3 py-1 rounded text-sm transition-colors duration-200 border border-purple-500/30"
                      >
                        {expandedDoc === doc.id ? 'Show Less' : 'Read More'}
                      </button>

                      <button
                        onClick={() => handleDocumentClick(doc.id)}
                        className="text-purple-400 hover:text-purple-300 text-sm transition-colors duration-200 flex items-center space-x-1"
                      >
                        <span>Open Document</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredDocuments.length === 0 && (
                  <div className="text-gray-400 text-center py-8">No documents found.</div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Tools and Resources */}
          <div className="space-y-6">
            {/* Download Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Download className="w-5 h-5 text-purple-400" />
                <span>Maintenance Tools</span>
              </h3>

              <button
                onClick={() => handleDownload('Maintenance Checklist')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Maintenance Checklist (PDF)</span>
              </button>

              <p className="text-xs text-gray-400 mt-2 text-center">
                Routine inspection tasks and procedures
              </p>
            </div>

            {/* Technical Categories */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Technical Areas</h3>

              <div className="space-y-3">
                {filters.map((filter) => {
                  const count = technicalDocuments.filter(doc => doc.category === filter.label).length;
                  const isActive = activeFilters.includes(filter.label);
                  return (
                    <div key={filter.id} className={`flex items-center justify-between p-2 rounded border transition-colors duration-200 ${
                      isActive
                        ? 'bg-purple-900/20 border-purple-500/20'
                        : 'bg-gray-700/20 border-gray-600/20'
                    }`}>
                      <span className={`text-sm ${isActive ? 'text-purple-300' : 'text-gray-300'}`}>
                        {filter.label}
                      </span>
                      <span className={`text-xs ${isActive ? 'text-purple-400' : 'text-gray-400'}`}>
                        {count} docs
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Overview</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Active Documents</span>
                  <span className="text-purple-300 font-semibold">{filteredDocuments.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Critical Priority</span>
                  <span className="text-red-300 font-semibold">
                    {filteredDocuments.filter(d => d.priority === 'Critical').length}
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
                  <span className="text-sm text-gray-300">Part 145 requirements updated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-300"></div>
                  <span className="text-sm text-gray-300">New AD compliance procedures</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
                  <span className="text-sm text-gray-300">Component maintenance revised</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MaintenanceTechnicianDashboard;