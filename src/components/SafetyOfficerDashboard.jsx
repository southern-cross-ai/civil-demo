import React, { useState } from 'react';
import {
  Shield,
  Search,
  Filter,
  Download,
  FileText,
  ChevronRight,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

/**
 * Safety Officer Dashboard Component
 *
 * Props:
 * - role: object - Current role information
 * - onNavigate: object - Navigation functions from main container
 * - searchQuery: string - Current search query
 * - setSearchQuery: function - Update search query
 * - isTransitioning: boolean - Whether screen is transitioning
 */
const SafetyOfficerDashboard = ({ role, onNavigate, searchQuery, setSearchQuery, isTransitioning }) => {
  const [activeFilters, setActiveFilters] = useState(['Safety Reports', 'Risk Assessment']);
  const [expandedSummary, setExpandedSummary] = useState(null);

  const filters = [
    { id: 'safety-reports', label: 'Safety Reports', active: true },
    { id: 'risk-assessment', label: 'Risk Assessment', active: true },
    { id: 'incident-investigation', label: 'Incident Investigation', active: false },
    { id: 'safety-audits', label: 'Safety Audits', active: false }
  ];

  const safetySummaries = [
    {
      id: 'safety-report-2025-001',
      title: 'Safety Report 2025-001',
      subtitle: 'Runway Incursion Analysis',
      summary: 'Comprehensive analysis of runway incursion incidents at major airports.',
      category: 'Safety Reports',
      updated: 'July 2025',
      priority: 'High',
      status: 'Active Investigation',
      fullSummary: 'This safety report analyzes 15 runway incursion incidents from Q1-Q2 2025.',
      riskLevel: 'High',
      affectedOperations: 'All Commercial Operations'
    },
    {
      id: 'risk-assessment-weather-2025',
      title: 'Weather Risk Assessment 2025',
      subtitle: 'Extreme Weather Operations',
      summary: 'Updated risk assessment for operations during extreme weather conditions.',
      category: 'Risk Assessment',
      updated: 'June 2025',
      priority: 'Medium',
      status: 'Under Review',
      fullSummary: 'Comprehensive risk assessment covering extreme weather operations.',
      riskLevel: 'Medium',
      affectedOperations: 'Regional and Long-haul Operations'
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

  const filteredSummaries = safetySummaries.filter(summary =>
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
    alert(`Downloaded: ${type}`);
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'High': return 'bg-red-900/30 text-red-300 border-red-500/30';
      case 'Medium': return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30';
      case 'Low': return 'bg-green-900/30 text-green-300 border-green-500/30';
      default: return 'bg-gray-900/30 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active Investigation': return 'bg-blue-900/30 text-blue-300 border-blue-500/30';
      case 'Under Review': return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30';
      case 'Investigation Complete': return 'bg-green-900/30 text-green-300 border-green-500/30';
      default: return 'bg-gray-900/30 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <main className="container mx-auto px-6 py-8 relative z-10">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Safety Officer Dashboard
              </h2>
              <p className="text-green-300">Safety Management and Risk Assessment</p>
            </div>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
            <p className="text-green-300 text-sm">
              <strong>Safety Officer View</strong> – Safety reports, risk assessments, and incident investigations.
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
              placeholder="Search safety reports, risk assessments, or incident investigations…"
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg pl-12 pr-20 py-3 text-white focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded text-sm transition-colors duration-200"
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
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
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
          {/* Main Content - Safety Summaries */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Safety Reports & Assessments</h3>

              <div className="space-y-4">
                {filteredSummaries.map((safety) => (
                  <div
                    key={safety.id}
                    className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4 hover:border-green-500/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-green-400" />
                        <div>
                          <h4 className="font-semibold text-white">{safety.title}</h4>
                          <p className="text-sm text-gray-400">{safety.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`text-xs px-2 py-1 rounded border ${getRiskLevelColor(safety.riskLevel)}`}>
                          {safety.riskLevel} Risk
                        </span>
                        <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(safety.status)}`}>
                          {safety.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">
                      {expandedSummary === safety.id ? safety.fullSummary : safety.summary}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500">{safety.updated}</span>
                      <span className="text-xs text-gray-400">{safety.affectedOperations}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setExpandedSummary(
                          expandedSummary === safety.id ? null : safety.id
                        )}
                        className="bg-green-600/20 hover:bg-green-600/30 text-green-300 px-3 py-1 rounded text-sm transition-colors duration-200 border border-green-500/30"
                      >
                        {expandedSummary === safety.id ? 'Show Less' : 'Read More'}
                      </button>

                      <button
                        onClick={() => handleDocumentClick(safety.id)}
                        className="text-green-400 hover:text-green-300 text-sm transition-colors duration-200 flex items-center space-x-1"
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
                <Download className="w-5 h-5 text-green-400" />
                <span>Safety Resources</span>
              </h3>

              <button
                onClick={() => handleDownload('Safety Report Template')}
                className="w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-green-500/30 flex items-center justify-center space-x-2 mb-3"
              >
                <Download className="w-4 h-4" />
                <span>Safety Report Template (PDF)</span>
              </button>

              <p className="text-xs text-gray-400 mt-2 text-center">
                Standardized templates and procedures
              </p>
            </div>

            {/* Safety Metrics */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span>Safety Metrics</span>
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Active Investigations</span>
                  <span className="text-green-300 font-semibold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">High Risk Items</span>
                  <span className="text-red-300 font-semibold">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Safety Score</span>
                  <span className="text-green-300 font-semibold">94%</span>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span>Recent Alerts</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Runway incursion alert</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
                  <span className="text-sm text-gray-300">Weather risk assessment due</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SafetyOfficerDashboard;
