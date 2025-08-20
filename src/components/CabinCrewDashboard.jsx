import React, { useMemo, useState, useCallback } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  FileText,
  ChevronRight,
  SlidersHorizontal,
  Star,
  StarOff
} from 'lucide-react';

/**
 * Cabin Crew Dashboard — filters fixed + new features
 * - Filters tracked by IDs (reliable toggling)
 * - Select All / Clear All
 * - Sort by Priority / Updated / Title
 * - Expand All / Collapse All
 * - Favorites (⭐) with sidebar section
 * - Export CSV for current filtered list
 */
const CabinCrewDashboard = ({ role, onNavigate, searchQuery, setSearchQuery, isTransitioning }) => {
  // --- Filters: track by ID ---
  const [activeFilters, setActiveFilters] = useState(['passenger-safety', 'emergency-procedures']);
  const [expandedIds, setExpandedIds] = useState(new Set()); // multiple expand support
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [sortBy, setSortBy] = useState('priority'); // 'priority' | 'updated' | 'title'
  const [isSearching, setIsSearching] = useState(false);

  // Static filter definitions
  const filters = useMemo(() => ([
    { id: 'passenger-safety', label: 'Passenger Safety' },
    { id: 'emergency-procedures', label: 'Emergency Procedures' },
    { id: 'onboard-safety', label: 'Onboard Safety' },
    { id: 'general-ops', label: 'General Flight Operations' }
  ]), []);

  // Map filter IDs -> labels for category matching
  const filterLabelById = useMemo(
    () => Object.fromEntries(filters.map(f => [f.id, f.label])),
    [filters]
  );

  // Demo data
  const advisorySummaries = useMemo(() => ([
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
  ]), []);

  // --- Handlers ---
  const toggleFilter = useCallback((filterId) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  }, []);

  const selectAllFilters = useCallback(() => {
    setActiveFilters(filters.map(f => f.id));
  }, [filters]);

  const clearAllFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);

  const isExpanded = useCallback((id) => expandedIds.has(id), [expandedIds]);

  const toggleExpansion = useCallback((id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback((ids) => {
    setExpandedIds(new Set(ids));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const submitSearch = useCallback(() => {
    if (!searchQuery?.trim()) return;
    setIsSearching(true);
    const t = setTimeout(() => {
      onNavigate?.navigateToSearch?.(searchQuery.trim());
      setIsSearching(false);
    }, 200);
    return () => clearTimeout(t);
  }, [onNavigate, searchQuery]);

  const onKeyDownSearch = useCallback((e) => {
    if (e.key === 'Enter') submitSearch();
  }, [submitSearch]);

  const handleDocumentClick = useCallback((documentId) => {
    onNavigate?.navigateToDocument?.(documentId);
  }, [onNavigate]);

  const handleDownload = useCallback((type) => {
    alert(`Downloaded: ${type}`);
  }, []);

  const handleExportCSV = useCallback((rows) => {
    const header = ['id', 'title', 'subtitle', 'category', 'updated', 'priority'];
    const csv = [
      header.join(','),
      ...rows.map(r =>
        [r.id, r.title, r.subtitle, r.category, r.updated, r.priority]
          .map(v => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cabin-guidance.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // --- Derived data ---
  const activeLabelSet = useMemo(
    () => new Set(activeFilters.map(id => filterLabelById[id])),
    [activeFilters, filterLabelById]
  );

  const filteredSummaries = useMemo(() => {
    const base = activeFilters.length === 0
      ? advisorySummaries
      : advisorySummaries.filter(s => activeLabelSet.has(s.category));

    // sort
    const priorityRank = (p) => (p === 'High' ? 2 : p === 'Medium' ? 1 : 0);
    const parseUpdated = (u) => {
      // e.g., 'July 2025'
      const d = new Date(`${u} 01`);
      return isNaN(d.getTime()) ? 0 : d.getTime();
    };

    const sorted = [...base].sort((a, b) => {
      if (sortBy === 'priority') {
        const diff = priorityRank(b.priority) - priorityRank(a.priority);
        if (diff !== 0) return diff;
        return parseUpdated(b.updated) - parseUpdated(a.updated);
      }
      if (sortBy === 'updated') {
        const diff = parseUpdated(b.updated) - parseUpdated(a.updated);
        if (diff !== 0) return diff;
        return priorityRank(b.priority) - priorityRank(a.priority);
      }
      // title
      return a.title.localeCompare(b.title);
    });

    return sorted;
  }, [advisorySummaries, activeFilters, activeLabelSet, sortBy]);

  const favoriteList = useMemo(
    () => advisorySummaries.filter(a => favoriteIds.has(a.id)),
    [advisorySummaries, favoriteIds]
  );

  // --- Subcomponents ---
  const FilterPill = ({ id, label }) => {
    const isActive = activeFilters.includes(id);
    return (
      <button
        type="button"
        onClick={() => toggleFilter(id)}
        aria-pressed={isActive}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 focus:ring-offset-gray-900 ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/30'
        }`}
      >
        {label}
      </button>
    );
  };

  const StatRow = ({ label, value, accent = 'text-blue-300' }) => (
    <div className="flex justify-between items-center">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className={`${accent} font-semibold`}>{value}</span>
    </div>
  );

  const PriorityBadge = ({ priority, tag }) => {
    const cls =
      priority === 'High'
        ? 'bg-red-900/30 text-red-300 border border-red-500/30'
        : 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/30';
    return <span className={`text-xs px-2 py-1 rounded ${cls}`}>{tag}</span>;
  };

  const AdvisoryCard = ({ item }) => {
    const expanded = isExpanded(item.id);
    const fav = favoriteIds.has(item.id);

    return (
      <article
        className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4 hover:border-blue-500/50 transition-all duration-200"
        aria-labelledby={`${item.id}-title`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-400" aria-hidden="true" />
            <div>
              <h4 id={`${item.id}-title`} className="font-semibold text-white">{item.title}</h4>
              <p className="text-sm text-gray-400">{item.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => toggleFavorite(item.id)}
              className="p-1 rounded hover:bg-gray-600/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
              title={fav ? 'Unfavorite' : 'Favorite'}
            >
              {fav ? <Star className="w-4 h-4 text-yellow-300" /> : <StarOff className="w-4 h-4 text-gray-300" />}
            </button>
            <PriorityBadge priority={item.priority} tag={item.tag} />
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-3">{item.summary}</p>

        {expanded && (
          <div id={`${item.id}-details`} className="mt-4 border-t border-gray-600/30 pt-4">
            <p className="text-gray-300 text-sm mb-4 font-medium">{item.fullContent}</p>
            <div className="space-y-3">
              {item.expandedSections.map((section, idx) => (
                <section key={idx} className="bg-gray-800/30 rounded-lg p-3 border border-gray-600/20">
                  <h5 className="font-medium text-blue-300 mb-2">{section.title}</h5>
                  <p className="text-gray-400 text-sm">{section.content}</p>
                </section>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3 mt-3">
          <button
            type="button"
            onClick={() => toggleExpansion(item.id)}
            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-3 py-1 rounded text-sm transition-colors duration-200 border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-expanded={expanded}
            aria-controls={`${item.id}-details`}
          >
            {expanded ? 'Hide Details' : 'Expand Details'}
          </button>

          <button
            type="button"
            onClick={() => handleDocumentClick(item.id)}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200 flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
          >
            <span>Open Document</span>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </article>
    );
  };

  // --- Render ---
  return (
    <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <main className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
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

        {/* Search */}
        <div className="mb-6" aria-label="Search cabin guidance">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={onKeyDownSearch}
              placeholder="Search cabin procedures, safety guidelines, or emergency protocols…"
              aria-label="Search terms"
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg pl-12 pr-24 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
            <button
              type="button"
              onClick={submitSearch}
              disabled={isSearching}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white px-4 py-1.5 rounded text-sm transition-colors duration-200"
            >
              {isSearching ? 'Searching…' : 'Search'}
            </button>
          </div>
        </div>

        {/* Filters + Sort + Bulk actions */}
        <div className="mb-8" aria-label="Filter and sort guidance">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Pre-filtered for cabin crew (adjust as needed):</span>
            </div>

            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <label htmlFor="sortBy" className="text-sm text-gray-400">Sort:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800/60 border border-gray-600/50 text-gray-200 text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="priority">Priority (High → Low)</option>
                <option value="updated">Updated (Newest)</option>
                <option value="title">Title (A → Z)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-3">
            {filters.map((f) => (
              <FilterPill key={f.id} id={f.id} label={f.label} />
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={selectAllFilters}
              className="text-xs bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 border border-gray-600/40 rounded px-3 py-1"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 border border-gray-600/40 rounded px-3 py-1"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => expandAll(filteredSummaries.map(s => s.id))}
              className="text-xs bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 border border-gray-600/40 rounded px-3 py-1"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="text-xs bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 border border-gray-600/40 rounded px-3 py-1"
            >
              Collapse All
            </button>
            <button
              type="button"
              onClick={() => handleExportCSV(filteredSummaries)}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/60 rounded px-3 py-1"
            >
              Export CSV (filtered)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Cabin Safety Guidance</h3>

              {filteredSummaries.length === 0 ? (
                <div className="text-sm text-gray-400 bg-gray-800/40 border border-gray-700 rounded p-4">
                  No guidance matches the current filters. Try adjusting filters or clearing them.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSummaries.map((advisory) => (
                    <AdvisoryCard key={advisory.id} item={advisory} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Download className="w-5 h-5 text-blue-400" />
                <span>Crew Resources</span>
              </h3>

              <button
                type="button"
                onClick={() => handleDownload('Cabin Safety Checklist')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <Download className="w-4 h-4" />
                <span>Cabin Safety Checklist (PDF)</span>
              </button>

              <p className="text-xs text-gray-400 text-center">
                Pre-takeoff cabin secure checks and procedures
              </p>
            </div>

            {/* Focus Areas */}
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

            {/* Overview */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Overview</h3>
              <div className="space-y-4">
                <StatRow label="Active Guidelines" value={filteredSummaries.length} />
                <StatRow
                  label="High Priority"
                  value={filteredSummaries.filter(a => a.priority === 'High').length}
                  accent="text-red-300"
                />
                <StatRow label="Last Updated (max)" value={
                  filteredSummaries.length
                    ? filteredSummaries.map(s => s.updated).sort((a, b) =>
                        new Date(`${b} 01`) - new Date(`${a} 01`)
                      )[0]
                    : '—'
                } accent="text-green-300" />
              </div>
            </div>

            {/* Favorites */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Favorites</h3>
              {favoriteList.length === 0 ? (
                <p className="text-sm text-gray-400">No favorites yet. Click ⭐ on any guidance to pin it here.</p>
              ) : (
                <ul className="space-y-2">
                  {favoriteList.map(f => (
                    <li key={f.id} className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleDocumentClick(f.id)}
                        className="text-sm text-blue-300 hover:text-blue-200 underline decoration-blue-500/40"
                      >
                        {f.title}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(f.id)}
                        className="p-1 rounded hover:bg-gray-700/50"
                        aria-label="Remove favorite"
                      >
                        <Star className="w-4 h-4 text-yellow-300" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CabinCrewDashboard;
