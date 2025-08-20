import React, { useMemo, useState, useCallback } from 'react';
import {
  Plane,
  Search,
  Filter,
  Download,
  FileText,
  ChevronRight,
  SlidersHorizontal,
  Star,
  StarOff
} from 'lucide-react';

const PilotDashboard = ({ role, onNavigate, searchQuery, setSearchQuery, isTransitioning }) => {
  // state
  const [activeFilters, setActiveFilters] = useState(['flight-ops']);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [sortBy, setSortBy] = useState('priority');

  // filters
  const filters = [
    { id: 'flight-ops', label: 'Flight Operations' },
    { id: 'cabin-safety', label: 'Cabin Safety' },
    { id: 'weather-preflight', label: 'Weather & Pre-flight' }
  ];
  const filterLabelById = Object.fromEntries(filters.map(f => [f.id, f.label]));

  // advisories
  const advisorySummaries = useMemo(() => ([
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
  ]), []);

  // handlers
  const toggleFilter = (id) => {
    setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };
  const selectAllFilters = () => setActiveFilters(filters.map(f => f.id));
  const clearAllFilters = () => setActiveFilters([]);
  const toggleExpansion = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const expandAll = () => setExpandedIds(new Set(advisorySummaries.map(a => a.id)));
  const collapseAll = () => setExpandedIds(new Set());
  const toggleFavorite = (id) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) onNavigate.navigateToSearch(searchQuery);
  };
  const handleKeyDownSearch = (e) => {
    if (e.key === 'Enter') handleSearch();
  };
  const handleDocumentClick = (id) => onNavigate.navigateToDocument(id);
  const handleDownload = (type) => alert(`Downloaded: ${type}`);
  const handleExportCSV = (rows) => {
    const header = ['id','title','subtitle','category','updated','priority'];
    const csv = [
      header.join(','),
      ...rows.map(r =>
        [r.id, r.title, r.subtitle, r.category, r.updated, r.priority]
        .map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')
      )
    ].join('\n');
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='pilot-guidance.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  // filtering + sorting
  const activeLabelSet = new Set(activeFilters.map(id => filterLabelById[id]));
  const filteredSummaries = advisorySummaries
    .filter(s => activeFilters.length===0 || activeLabelSet.has(s.category))
    .sort((a,b) => {
      const priorityRank = p => p==='High'?2: p==='Medium'?1:0;
      const parseUpdated = u => new Date(`${u} 01`).getTime()||0;
      if(sortBy==='priority'){
        const diff = priorityRank(b.priority)-priorityRank(a.priority);
        if(diff!==0) return diff; return parseUpdated(b.updated)-parseUpdated(a.updated);
      }
      if(sortBy==='updated') return parseUpdated(b.updated)-parseUpdated(a.updated);
      return a.title.localeCompare(b.title);
    });

  const favoriteList = advisorySummaries.filter(a => favoriteIds.has(a.id));

  return (
    <div className={`transition-all duration-500 ${isTransitioning?'opacity-0 scale-95':'opacity-100 scale-100'}`}>
      <main className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
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

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDownSearch}
              placeholder="Search circulars, rules, or flight guidance…"
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg pl-12 pr-24 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-1.5 rounded text-sm transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </div>

        {/* Filters + Sort */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Filter by category:</span>
            </div>
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)}
                className="bg-gray-800/60 border border-gray-600/50 text-gray-200 text-sm rounded px-2 py-1">
                <option value="priority">Priority</option>
                <option value="updated">Updated</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-3">
            {filters.map(f=>{
              const isActive=activeFilters.includes(f.id);
              return (
                <button key={f.id} onClick={()=>toggleFilter(f.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive?'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30':
                    'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/30'}`}>
                  {f.label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={selectAllFilters} className="text-xs bg-gray-700/50 px-3 py-1 rounded">Select All</button>
            <button onClick={clearAllFilters} className="text-xs bg-gray-700/50 px-3 py-1 rounded">Clear All</button>
            <button onClick={expandAll} className="text-xs bg-gray-700/50 px-3 py-1 rounded">Expand All</button>
            <button onClick={collapseAll} className="text-xs bg-gray-700/50 px-3 py-1 rounded">Collapse All</button>
            <button onClick={()=>handleExportCSV(filteredSummaries)} className="text-xs bg-cyan-600 text-white px-3 py-1 rounded">Export CSV</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Advisory Summaries</h3>
              {filteredSummaries.map(a=>{
                const expanded=expandedIds.has(a.id);
                const fav=favoriteIds.has(a.id);
                return (
                  <div key={a.id} className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4 mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-cyan-400"/>
                        <div>
                          <h4 className="font-semibold text-white">{a.title}</h4>
                          <p className="text-sm text-gray-400">{a.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={()=>toggleFavorite(a.id)}>
                          {fav?<Star className="w-4 h-4 text-yellow-300"/>:<StarOff className="w-4 h-4 text-gray-300"/>}
                        </button>
                        <span className={`text-xs px-2 py-1 rounded ${
                          a.priority==='High'?'bg-red-900/30 text-red-300 border border-red-500/30':
                          'bg-yellow-900/30 text-yellow-300 border border-yellow-500/30'}`}>
                          {a.priority}
                        </span>
                        <span className="text-xs text-gray-500">{a.updated}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{expanded?a.fullSummary:a.summary}</p>
                    <div className="flex items-center space-x-3">
                      <button onClick={()=>toggleExpansion(a.id)}
                        className="bg-cyan-600/20 text-cyan-300 px-3 py-1 rounded text-sm border border-cyan-500/30">
                        {expanded?'Show Less':'Read More'}
                      </button>
                      <button onClick={()=>handleDocumentClick(a.id)}
                        className="text-cyan-400 text-sm flex items-center space-x-1">
                        <span>Open Document</span><ChevronRight className="w-3 h-3"/>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Downloads */}
            <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Download className="w-5 h-5 text-cyan-400"/><span>Quick Downloads</span>
              </h3>
              <button onClick={()=>handleDownload('Pre-Flight Safety Checklist')}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 rounded-lg">
                <Download className="w-4 h-4"/><span>Pre-Flight Safety Checklist (PDF)</span>
              </button>
            </div>
            {/* Key Info */}
            <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Key Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between"><span>Active Advisories</span><span>{filteredSummaries.length}</span></div>
                <div className="flex justify-between"><span>High Priority</span><span>{filteredSummaries.filter(a=>a.priority==='High').length}</span></div>
                <div className="flex justify-between"><span>Last Updated</span><span>{filteredSummaries[0]?.updated||'—'}</span></div>
              </div>
            </div>
            {/* Favorites */}
            <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Favorites</h3>
              {favoriteList.length===0?<p className="text-sm text-gray-400">No favorites yet.</p>:
              <ul>{favoriteList.map(f=><li key={f.id}><button onClick={()=>handleDocumentClick(f.id)} className="text-cyan-300 underline">{f.title}</button></li>)}</ul>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PilotDashboard;
