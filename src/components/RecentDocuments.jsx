import React, { useState, useEffect } from 'react';
import { Clock, FileText, BookOpen, Star, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecentDocuments = ({ onDocumentOpen, role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentDocs, setRecentDocs] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
      // Load recent documents and favorites from localStorage
  const savedRecent = localStorage.getItem('recentDocuments');
  const savedFavorites = localStorage.getItem('favoriteDocuments');
    
    if (savedRecent) {
      setRecentDocs(JSON.parse(savedRecent));
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Sample documents for demonstration
  const sampleDocuments = [
    {
      id: 'doc-001',
      title: 'CAAP 253-02 Passenger Safety Briefing',
      type: 'regulation',
      category: 'Safety Procedures',
      lastAccessed: Date.now() - 3600000, // 1 hour ago
      accessCount: 5,
      role: 'pilot'
    },
    {
      id: 'doc-002',
      title: 'CAO 20.16.3 Emergency Procedures',
      type: 'manual',
      category: 'Emergency Procedures',
      lastAccessed: Date.now() - 7200000, // 2 hours ago
      accessCount: 3,
      role: 'cabin-crew'
    },
    {
      id: 'doc-003',
      title: 'Part 121.571 Exit Seat Requirements',
      type: 'regulation',
      category: 'Compliance Requirements',
      lastAccessed: Date.now() - 10800000, // 3 hours ago
      accessCount: 2,
      role: 'compliance'
    }
  ];

  useEffect(() => {
      // If no saved documents, use sample documents
  if (recentDocs.length === 0) {
    setRecentDocs(sampleDocuments);
    localStorage.setItem('recentDocuments', JSON.stringify(sampleDocuments));
  }
  }, [recentDocs.length]);

  const addToRecent = (doc) => {
    const updatedRecent = [
      { ...doc, lastAccessed: Date.now() },
      ...recentDocs.filter(d => d.id !== doc.id)
    ].slice(0, 10); // Keep only the last 10
    
    setRecentDocs(updatedRecent);
    localStorage.setItem('recentDocuments', JSON.stringify(updatedRecent));
  };

  const toggleFavorite = (doc) => {
    const isFavorite = favorites.some(f => f.id === doc.id);
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites.filter(f => f.id !== doc.id);
    } else {
      updatedFavorites = [...favorites, { ...doc, favoritedAt: Date.now() }];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteDocuments', JSON.stringify(updatedFavorites));
  };

  const removeFromRecent = (docId) => {
    const updatedRecent = recentDocs.filter(d => d.id !== docId);
    setRecentDocs(updatedRecent);
    localStorage.setItem('recentDocuments', JSON.stringify(updatedRecent));
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 2592000000) return `${Math.floor(diff / 86400000)} days ago`;
    return `${Math.floor(diff / 2592000000)} months ago`;
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'regulation':
        return <FileText className="h-4 w-4" />;
      case 'manual':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleDocumentOpen = (doc) => {
    addToRecent(doc);
    onDocumentOpen?.(doc);
    setIsOpen(false);
  };

  const allDocuments = [...recentDocs, ...favorites.filter(f => !recentDocs.some(r => r.id === f.id))];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200"
        aria-label="Recent documents"
      >
        <Clock className="h-5 w-5" />
        {recentDocs.length > 0 && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-96 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50 max-h-[80vh]"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b border-gray-700 bg-gray-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white text-lg">Recent Documents</h3>
                  <p className="text-sm text-gray-400">Quick access to recently viewed documents</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{recentDocs.length} documents</span>
                </div>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
              {allDocuments.length > 0 ? (
                <div className="p-4 space-y-3">
                  {allDocuments.map((doc) => {
                    const isFavorite = favorites.some(f => f.id === doc.id);
                    const isRecent = recentDocs.some(r => r.id === doc.id);
                    
                    return (
                      <motion.div
                        key={doc.id}
                        className="group p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              {getDocumentIcon(doc.type)}
                              <span className="text-xs text-gray-400 bg-gray-600/50 px-2 py-1 rounded">
                                {doc.category}
                              </span>
                            </div>
                            
                            <h4 className="text-sm font-medium text-white mb-1 truncate">
                              {doc.title}
                            </h4>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-400">
                              <span>{formatTimeAgo(doc.lastAccessed)}</span>
                              <span>Accessed {doc.accessCount} times</span>
                              {doc.role && (
                                <span className="capitalize">{doc.role}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleFavorite(doc)}
                              className={`p-1.5 rounded hover:bg-gray-600/50 transition-colors ${
                                isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                              }`}
                              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <Star className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
                            </motion.button>
                            
                            {isRecent && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeFromRecent(doc.id)}
                                className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-gray-600/50 transition-colors opacity-0 group-hover:opacity-100"
                                aria-label="Remove from recent records"
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            )}
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDocumentOpen(doc)}
                              className="p-1.5 rounded text-gray-400 hover:text-blue-400 hover:bg-gray-600/50 transition-colors"
                              aria-label="Open document"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">No recently accessed documents</p>
                  <p className="text-gray-500 text-xs mt-1">Start browsing documents and they will appear here</p>
                </div>
              )}
            </div>
            
            {allDocuments.length > 0 && (
              <div className="p-3 border-t border-gray-700 bg-gray-800/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Favorite Documents</span>
                  <span className="text-white font-medium">{favorites.length} items</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecentDocuments;
