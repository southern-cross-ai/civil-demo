import React, { useState } from 'react';
import {
  ClipboardCheck,
  Search,
  Filter,
  Download,
  FileText,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';

const ComplianceStaffDashboard = ({ role, onNavigate, searchQuery, setSearchQuery, isTransitioning }) => {
  const [activeFilters, setActiveFilters] = useState(['Regulatory Requirements', 'Audit Documentation']);
  const [expandedSummary, setExpandedSummary] = useState(null);

  const filters = [
    { id: 'regulatory-requirements', label: 'Regulatory Requirements', active: true },
    { id: 'audit-documentation', label: 'Audit Documentation', active: true },
    { id: 'compliance-updates', label: 'Compliance Updates', active: false },
    { id: 'policy-guidelines', label: 'Policy Guidelines', active: false }
  ];

  const complianceSummaries = [
    {
      id: 'cao-20-16-3-compliance',
      title: 'CAO 20.16.3 Compliance',
      subtitle: 'Aircraft Equipment Requirements',
      summary: 'Comprehensive compliance checklist for aircraft equipment positioning and maintenance requirements.',
      category: 'Regulatory Requirements',
      updated: 'July 2025',
      priority: 'High',
      status: 'Compliance Required',
      fullSummary: 'Detailed compliance requirements for aircraft equipment including emergency slides, life rafts, fire extinguishers, and first aid equipment. Covers positioning standards, maintenance schedules, and crew training requirements.',
      complianceLevel: 'High',
      nextAudit: 'August 2025',
      affectedAircraft: 'All Commercial Aircraft'
    },
    {
      id: 'caap-235-1-compliance',
      title: 'CAAP 235-1 Compliance',
      subtitle: 'Dangerous Goods Transport',
      summary: 'Compliance requirements for dangerous goods transport including packaging, documentation, and crew training.',
      category: 'Regulatory Requirements',
      updated: 'June 2025',
      priority: 'High',
      status: 'Under Review',
      fullSummary: 'Comprehensive compliance guidelines for dangerous goods transport including classification, packaging standards, loading procedures, and emergency response protocols.',
      complianceLevel: 'High',
      nextAudit: 'September 2025',
      affectedAircraft: 'Cargo and Passenger Aircraft'
    },
    {
      id: 'audit-report-2025-q2',
      title: 'Q2 2025 Compliance Audit',
      subtitle: 'Operator Compliance Review',
      summary: 'Quarterly compliance audit results for commercial operators, identifying compliance gaps and areas for improvement.',
      category: 'Audit Documentation',
      updated: 'May 2025',
      priority: 'Medium',
      status: 'Audit Complete',
      fullSummary: 'Comprehensive compliance audit of 45 commercial operators covering regulatory adherence, documentation standards, and operational compliance.',
      complianceLevel: 'Medium',
      nextAudit: 'Q3 2025',
      affectedAircraft: 'Commercial Air Transport'
    },
    {
      id: 'policy-update-2025-001',
      title: 'Policy Update 2025-001',
      subtitle: 'Crew Training Standards',
      summary: 'Updated crew training standards and compliance requirements for safety procedures and emergency protocols.',
      category: 'Policy Guidelines',
      updated: 'April 2025',
      priority: 'Medium',
      status: 'Implementation Required',
      fullSummary: 'New crew training standards including enhanced safety procedures, emergency protocol updates, and compliance verification requirements.',
      complianceLevel: 'Medium',
      nextAudit: 'October 2025',
      affectedAircraft: 'All Aircraft Types'
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

  const filteredSummaries = complianceSummaries.filter(summary =>
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

  const getComplianceLevelColor = (level) => {
    switch (level) {
      case 'High': return 'bg-red-900/30 text-red-300 border-red-500/30';
      case 'Medium': return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30';
      case 'Low': return 'bg-green-900/30 text-green-300 border-green-500/30';
      default: return 'bg-gray-900/30 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Compliance Required': return 'bg-red-900/30 text-red-300 border-red-500/30';
      case 'Under Review': return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30';
      case 'Audit Complete': return 'bg-green-900/30 text-green-300 border-green-500/30';
      case 'Implementation Required': return 'bg-blue-900/30 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-900/30 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <main className="container mx-auto px-6 py-8 relative z-10">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50">
              <ClipboardCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Compliance Staff Dashboard
              </h2>
              <p className="text-amber-300">Regulatory Compliance and Audit Management</p>
            </div>
          </div>

          <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 mb-6">
            <p className="text-amber-300 text-sm">
              <strong>Compliance Staff View</strong> – Regulatory requirements, audit documentation, and compliance updates.
              Monitor compliance levels and manage audit schedules across all operations.
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
              placeholder="Search regulatory requirements, audit documents, or compliance updates…"
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg pl-12 pr-20 py-3 text-white focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 rounded text-sm transition-colors duration-200"
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
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/30'
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
          {/* Main Content - Compliance Summaries */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Compliance Requirements & Audits</h3>

              <div className="space-y-4">
                {filteredSummaries.map((compliance) => (
                  <div
                    key={compliance.id}
                    className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4 hover:border-amber-500/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <div>
                          <h4 className="font-semibold text-white">{compliance.title}</h4>
                          <p className="text-sm text-gray-400">{compliance.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`text-xs px-2 py-1 rounded border ${getComplianceLevelColor(compliance.complianceLevel)}`}>
                          {compliance.complianceLevel} Priority
                        </span>
                        <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(compliance.status)}`}>
                          {compliance.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">
                      {expandedSummary === compliance.id ? compliance.fullSummary : compliance.summary}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500">{compliance.updated}</span>
                      <span className="text-xs text-gray-400">{compliance.affectedAircraft}</span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-amber-400">Next Audit: {compliance.nextAudit}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setExpandedSummary(
                          expandedSummary === compliance.id ? null : compliance.id
                        )}
                        className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 px-3 py-1 rounded text-sm transition-colors duration-200 border border-amber-500/30"
                      >
                        {expandedSummary === compliance.id ? 'Show Less' : 'Read More'}
                      </button>

                      <button
                        onClick={() => handleDocumentClick(compliance.id)}
                        className="text-amber-400 hover:text-amber-300 text-sm transition-colors duration-200 flex items-center space-x-1"
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
                <Download className="w-5 h-5 text-amber-400" />
                <span>Compliance Resources</span>
              </h3>

              <button
                onClick={() => handleDownload('Compliance Checklist')}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-amber-500/30 flex items-center justify-center space-x-2 mb-3"
              >
                <Download className="w-4 h-4" />
                <span>Compliance Checklist (PDF)</span>
              </button>

              <button
                onClick={() => handleDownload('Audit Template')}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-orange-500/30 flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Audit Template (PDF)</span>
              </button>

              <p className="text-xs text-gray-400 mt-2 text-center">
                Standardized compliance tools and templates
              </p>
            </div>

            {/* Compliance Metrics */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <span>Compliance Metrics</span>
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">High Priority Items</span>
                  <span className="text-red-300 font-semibold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Pending Audits</span>
                  <span className="text-amber-300 font-semibold">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Compliance Score</span>
                  <span className="text-green-300 font-semibold">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Next Audit Due</span>
                  <span className="text-blue-300 font-semibold">2 weeks</span>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>Upcoming Deadlines</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">CAO 20.16.3 audit due</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
                  <span className="text-sm text-gray-300">Training compliance review</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-700"></div>
                  <span className="text-sm text-gray-300">Policy implementation due</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button className="w-full bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 px-3 py-2 rounded text-sm transition-colors duration-200 border border-amber-500/30">
                  Schedule Compliance Audit
                </button>
                <button className="w-full bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 px-3 py-2 rounded text-sm transition-colors duration-200 border border-orange-500/30">
                  Review Compliance Status
                </button>
                <button className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-3 py-2 rounded text-sm transition-colors duration-200 border border-blue-500/30">
                  Update Compliance Records
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplianceStaffDashboard;
