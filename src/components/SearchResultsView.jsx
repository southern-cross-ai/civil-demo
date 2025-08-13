import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  FileText,
  Download,
  ChevronRight,
  ArrowLeft,
  Clock,
  Tag,
  Star
} from 'lucide-react';

const SearchResultsView = ({ role, onNavigate, searchQuery, setSearchQuery, isTransitioning }) => {
  const [activeFilters, setActiveFilters] = useState(['All Categories']);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('list');

  // Mock search results
  const searchResults = [
    {
      id: 'caap-253-02-search',
      title: 'CAAP 253-02',
      subtitle: 'Passenger Safety Information',
      summary: 'Provides guidelines on the safety information that must be given to passengers by operators, covering briefing card content and exit row instructions.',
      category: 'Flight Operations',
      updated: 'July 2025',
      priority: 'High',
      relevance: 95,
      tags: ['passenger safety', 'briefing', 'exit row', 'flight operations'],
      documentType: 'CAAP',
      pageCount: 24,
      lastAccessed: '2 hours ago'
    },
    {
      id: 'ac-91-10-search',
      title: 'AC 91-10',
      subtitle: 'Operations in Vicinity of Aerodromes',
      summary: 'Details operational procedures and communication requirements when operating aircraft near controlled and uncontrolled aerodromes.',
      category: 'Flight Operations',
      updated: 'June 2025',
      priority: 'Medium',
      relevance: 87,
      tags: ['aerodrome operations', 'radio procedures', 'traffic patterns', 'flight operations'],
      documentType: 'Advisory Circular',
      pageCount: 18,
      lastAccessed: '1 day ago'
    },
    {
      id: 'caap-235-1-search',
      title: 'CAAP 235-1',
      subtitle: 'Carriage of Dangerous Goods',
      summary: 'Guidelines for the safe transport of dangerous goods by air, including packaging, documentation, and crew training requirements.',
      category: 'Flight Operations',
      updated: 'May 2025',
      priority: 'High',
      relevance: 82,
      tags: ['dangerous goods', 'cargo safety', 'crew training', 'flight operations'],
      documentType: 'CAAP',
      pageCount: 32,
      lastAccessed: '3 days ago'
    },
    {
      id: 'cao-20-16-3-search',
      title: 'CAO 20.16.3',
      subtitle: 'Cabin Safety Equipment',
      summary: 'Requirements for cabin safety equipment positioning, maintenance, and crew familiarity with emergency equipment.',
      category: 'Cabin Safety',
      updated: 'June 2025',
      priority: 'High',
      relevance: 78,
      tags: ['cabin safety', 'emergency equipment', 'crew training', 'cabin operations'],
      documentType: 'CAO',
      pageCount: 28,
      lastAccessed: '1 week ago'
    },
    {
      id: 'ac-119-16-search',
      title: 'AC 119-16',
      subtitle: 'Safety Management Systems',
      summary: 'Framework for implementing and maintaining effective safety management systems in aviation operations.',
      category: 'Safety Management',
      updated: 'April 2025',
      priority: 'Medium',
      relevance: 75,
      tags: ['safety management', 'SMS', 'risk assessment', 'safety operations'],
      documentType: 'Advisory Circular',
      pageCount: 45,
      lastAccessed: '2 weeks ago'
    }
  ];

  const categories = [
    'All Categories',
    'Flight Operations',
    'Cabin Safety',
    'Safety Management',
    'Maintenance',
    'Training',
    'Emergency Procedures'
  ];

  const documentTypes = [
    'All Types',
    'CAAP',
    'CAO',
    'Advisory Circular',
    'Regulation',
    'Policy Document'
  ];

  const toggleFilter = (filter) => {
    if (filter === 'All Categories') {
      setActiveFilters(['All Categories']);
    } else {
      setActiveFilters(prev => {
        const withoutAll = prev.filter(f => f !== 'All Categories');
        if (prev.includes(filter)) {
          return withoutAll.length > 0 ? withoutAll : ['All Categories'];
        } else {
          return [...withoutAll, filter];
        }
      });
    }
  };

  const filteredResults = searchResults.filter(result => {
    if (activeFilters.includes('All Categories')) return true;
    return activeFilters.includes(result.category);
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return b.relevance - a.relevance;
      case 'date':
        return new Date(b.updated) - new Date(a.updated);
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return 0;
    }
  });

  const handleDocumentClick = (documentId) => {
    onNavigate.navigateToDocument(documentId);
  };

  const handleDownload = (type) => {
    alert(`Downloaded: ${type}`);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-900/30 text-red-300 border-red-500/30';
      case 'Medium': return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30';
      case 'Low': return 'bg-green-900/30 text-green-300 border-green-500/30';
      default: return 'bg-gray-900/30 text-gray-300 border-gray-500/30';
    }
  };

  const getRelevanceColor = (relevance) => {
    if (relevance >= 90) return 'text-green-400';
    if (relevance >= 80) return 'text-yellow-400';
    if (relevance >= 70) return 'text-orange-400';
    return 'text-gray-400';
  };

  return (
    <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <main className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => onNavigate.goBack()}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white">Search Results</h2>
              <p className="text-gray-400">Found {filteredResults.length} results for "{searchQuery}"</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for documents, regulations, or procedures…"
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg pl-12 pr-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Categories Filter */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-blue-400" />
                  <span>Categories</span>
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const isActive = activeFilters.includes(category);
                    return (
                      <button
                        key={category}
                        onClick={() => toggleFilter(category)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Options */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date Updated</option>
                  <option value="priority">Priority</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">View Mode</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 rounded text-sm transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 rounded text-sm transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                    }`}
                  >
                    Grid
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Results ({filteredResults.length})</h3>
                <div className="text-sm text-gray-400">
                  Showing {filteredResults.length} of {searchResults.length} results
                </div>
              </div>

              {viewMode === 'list' ? (
                <div className="space-y-4">
                  {sortedResults.map((result) => (
                    <div
                      key={result.id}
                      className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4 hover:border-blue-500/50 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-400" />
                          <div>
                            <h4 className="font-semibold text-white">{result.title}</h4>
                            <p className="text-sm text-gray-400">{result.subtitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(result.priority)}`}>
                            {result.priority}
                          </span>
                          <span className={`text-xs ${getRelevanceColor(result.relevance)}`}>
                            {result.relevance}% match
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-3">{result.summary}</p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Tag className="w-3 h-3" />
                            <span>{result.documentType}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{result.updated}</span>
                          </span>
                          <span>{result.pageCount} pages</span>
                        </div>
                        <span className="text-xs text-gray-400">{result.lastAccessed}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {result.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-600/30 text-gray-300 px-2 py-1 rounded border border-gray-500/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleDownload(result.title)}
                            className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200 flex items-center space-x-1"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                          <button
                            onClick={() => handleDocumentClick(result.id)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm transition-colors duration-200 flex items-center space-x-1"
                          >
                            <span>Open Document</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedResults.map((result) => (
                    <div
                      key={result.id}
                      className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4 hover:border-blue-500/50 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <div>
                          <h4 className="font-semibold text-white text-sm">{result.title}</h4>
                          <p className="text-xs text-gray-400">{result.subtitle}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-xs mb-3 line-clamp-3">{result.summary}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(result.priority)}`}>
                          {result.priority}
                        </span>
                        <span className={`text-xs ${getRelevanceColor(result.relevance)}`}>
                          {result.relevance}% match
                        </span>
                      </div>

                      <button
                        onClick={() => handleDocumentClick(result.id)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm transition-colors duration-200 flex items-center justify-center space-x-1"
                      >
                        <span>Open Document</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {filteredResults.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">No results found</h3>
                  <p className="text-gray-500">Try adjusting your search terms or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchResultsView;
