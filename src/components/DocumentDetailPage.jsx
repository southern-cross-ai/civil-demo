import React, { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  Bookmark,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Calendar,
  User,
  Tag,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const DocumentDetailPage = ({ role, onNavigate, documentId, isTransitioning }) => {
  const [expandedSections, setExpandedSections] = useState(['overview']);
  const [activeTab, setActiveTab] = useState('content');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock document data
  const documentData = {
    id: documentId || 'caap-253-02',
    title: 'CAAP 253-02',
    subtitle: 'Passenger Safety Information',
    documentType: 'CAAP',
    category: 'Flight Operations',
    status: 'Active',
    priority: 'High',
    updated: 'July 2025',
    effectiveDate: 'August 1, 2025',
    author: 'Civil Aviation Safety Authority',
    pageCount: 24,
    fileSize: '2.4 MB',
    version: '2.1',
    lastAccessed: '2 hours ago',
    downloadCount: 156,
    summary: 'This CAAP outlines the requirements for passenger safety information including pre-flight safety demonstrations, briefing cards, and special procedures for exit row passengers. Operators must ensure all passengers receive adequate safety information before takeoff.',
    
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        content: 'This document provides comprehensive guidance on passenger safety information requirements for commercial air transport operations. It covers all aspects of passenger safety briefings, from pre-flight demonstrations to emergency procedures.',
        subsections: [
          {
            title: 'Purpose',
            content: 'To establish minimum standards for passenger safety information and ensure consistent application across all commercial operations.'
          },
          {
            title: 'Scope',
            content: 'Applies to all commercial air transport operations carrying passengers, including scheduled and charter services.'
          }
        ]
      },
      {
        id: 'requirements',
        title: 'Safety Information Requirements',
        content: 'Operators must provide comprehensive safety information to all passengers before takeoff, including emergency procedures, seatbelt operation, and exit locations.',
        subsections: [
          {
            title: 'Pre-flight Safety Demonstration',
            content: 'Live demonstration or video presentation covering all safety equipment and emergency procedures.'
          },
          {
            title: 'Safety Briefing Cards',
            content: 'Individual safety cards must be available at each passenger seat with clear illustrations and instructions.'
          },
          {
            title: 'Exit Row Briefings',
            content: 'Special briefing for passengers seated in exit rows, including ability assessment and responsibility explanation.'
          }
        ]
      },
      {
        id: 'procedures',
        title: 'Operational Procedures',
        content: 'Detailed procedures for conducting safety briefings, managing passenger compliance, and ensuring safety information accessibility.',
        subsections: [
          {
            title: 'Crew Training',
            content: 'All cabin crew must receive comprehensive training on safety briefing procedures and passenger management.'
          },
          {
            title: 'Compliance Monitoring',
            content: 'Regular audits and assessments to ensure safety information standards are maintained.'
          }
        ]
      },
      {
        id: 'compliance',
        title: 'Compliance Requirements',
        content: 'Specific compliance requirements and audit criteria for operators to demonstrate adherence to safety information standards.',
        subsections: [
          {
            title: 'Documentation',
            content: 'Operators must maintain records of safety briefing procedures and crew training completion.'
          },
          {
            title: 'Audit Criteria',
            content: 'Regular audits will assess compliance with safety information requirements and identify areas for improvement.'
          }
        ]
      }
    ],

    relatedDocuments: [
      {
        id: 'cao-20-16-3',
        title: 'CAO 20.16.3',
        subtitle: 'Cabin Safety Equipment',
        category: 'Cabin Safety',
        relevance: 'High'
      },
      {
        id: 'ac-121-32',
        title: 'AC 121-32',
        subtitle: 'Crew Resource Management',
        category: 'Flight Operations',
        relevance: 'Medium'
      },
      {
        id: 'caap-259-1',
        title: 'CAAP 259-1',
        subtitle: 'Carry-on Luggage Safety',
        category: 'Passenger Safety',
        relevance: 'Medium'
      }
    ],

    tags: ['passenger safety', 'briefing', 'exit row', 'flight operations', 'cabin crew', 'emergency procedures'],
    
    attachments: [
      {
        name: 'Safety Briefing Checklist',
        type: 'PDF',
        size: '156 KB',
        description: 'Standard checklist for pre-flight safety briefings'
      },
      {
        name: 'Exit Row Briefing Script',
        type: 'DOCX',
        size: '89 KB',
        description: 'Standard script for exit row passenger briefings'
      },
      {
        name: 'Safety Card Templates',
        type: 'ZIP',
        size: '2.1 MB',
        description: 'Printable safety card templates in multiple languages'
      }
    ]
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleDownload = (type) => {
    alert(`Downloaded: ${type}`);
  };

  const handleShare = () => {
    alert('Share functionality would be implemented here');
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-900/30 text-red-300 border-red-500/30';
      case 'Medium': return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30';
      case 'Low': return 'bg-green-900/30 text-green-300 border-green-500/30';
      default: return 'bg-gray-900/30 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-900/30 text-green-300 border-green-500/30';
      case 'Draft': return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30';
      case 'Archived': return 'bg-gray-900/30 text-gray-300 border-gray-500/30';
      default: return 'bg-blue-900/30 text-blue-300 border-blue-500/30';
    }
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
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-8 h-8 text-blue-400" />
                <div>
                  <h2 className="text-3xl font-bold text-white">{documentData.title}</h2>
                  <p className="text-xl text-gray-400">{documentData.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <Tag className="w-4 h-4" />
                  <span>{documentData.documentType}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {documentData.updated}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{documentData.author}</span>
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isBookmarked 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-white'
                }`}
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-gray-700/50 text-gray-400 rounded-lg hover:bg-gray-600/50 hover:text-white transition-colors duration-200"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Status</span>
              </div>
              <span className={`text-sm px-2 py-1 rounded border ${getStatusColor(documentData.status)}`}>
                {documentData.status}
              </span>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-400">Priority</span>
              </div>
              <span className={`text-sm px-2 py-1 rounded border ${getPriorityColor(documentData.priority)}`}>
                {documentData.priority}
              </span>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Last Accessed</span>
              </div>
              <span className="text-sm text-white">{documentData.lastAccessed}</span>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Download className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Downloads</span>
              </div>
              <span className="text-sm text-white">{documentData.downloadCount}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleDownload('Full Document')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Full Document</span>
            </button>
            <button
              onClick={() => handleDownload('Summary')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Download Summary</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg mb-6">
              <div className="flex border-b border-gray-600/50">
                {['content', 'attachments', 'related'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'content' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Document Summary</h3>
                      <p className="text-gray-300 leading-relaxed">{documentData.summary}</p>
                    </div>

                    <div className="space-y-4">
                      {documentData.sections.map((section) => (
                        <div key={section.id} className="border border-gray-600/30 rounded-lg">
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/30 transition-colors duration-200"
                          >
                            <h4 className="text-lg font-semibold text-white">{section.title}</h4>
                            {expandedSections.includes(section.id) ? (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          
                          {expandedSections.includes(section.id) && (
                            <div className="px-4 pb-4 border-t border-gray-600/30">
                              <p className="text-gray-300 mb-4 leading-relaxed">{section.content}</p>
                              
                              {section.subsections && (
                                <div className="space-y-3">
                                  {section.subsections.map((subsection, index) => (
                                    <div key={index} className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/20">
                                      <h5 className="font-medium text-blue-300 mb-2">{subsection.title}</h5>
                                      <p className="text-gray-400 text-sm leading-relaxed">{subsection.content}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'attachments' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Document Attachments</h3>
                    <div className="space-y-3">
                      {documentData.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                          <div>
                            <h4 className="font-medium text-white">{attachment.name}</h4>
                            <p className="text-sm text-gray-400">{attachment.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{attachment.type}</span>
                              <span>{attachment.size}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownload(attachment.name)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm transition-colors duration-200 flex items-center space-x-2"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'related' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Related Documents</h3>
                    <div className="space-y-3">
                      {documentData.relatedDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-blue-500/50 transition-all duration-200">
                          <div>
                            <h4 className="font-medium text-white">{doc.title}</h4>
                            <p className="text-sm text-gray-400">{doc.subtitle}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{doc.category}</span>
                              <span className={`px-2 py-1 rounded ${
                                doc.relevance === 'High' ? 'bg-red-900/30 text-red-300' : 'bg-yellow-900/30 text-yellow-300'
                              }`}>
                                {doc.relevance} Relevance
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => onNavigate.navigateToDocument(doc.id)}
                            className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200 flex items-center space-x-1"
                          >
                            <span>View Document</span>
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Details */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Document Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Document Type</span>
                  <span className="text-white">{documentData.documentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white">{documentData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Version</span>
                  <span className="text-white">{documentData.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pages</span>
                  <span className="text-white">{documentData.pageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">File Size</span>
                  <span className="text-white">{documentData.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Effective Date</span>
                  <span className="text-white">{documentData.effectiveDate}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {documentData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-600/30 text-gray-300 px-2 py-1 rounded border border-gray-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-3 py-2 rounded text-sm transition-colors duration-200 border border-blue-500/30">
                  Print Document
                </button>
                <button className="w-full bg-green-600/20 hover:bg-green-600/30 text-green-300 px-3 py-2 rounded text-sm transition-colors duration-200 border border-green-500/30">
                  Add to Favorites
                </button>
                <button className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-3 py-2 rounded text-sm transition-colors duration-200 border border-purple-500/30">
                  Request Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentDetailPage;
