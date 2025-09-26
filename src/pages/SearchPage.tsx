import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowLeft,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  Calendar,
  Download,
  Eye,
  MoreVertical,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Brain,
  Star,
  Share2,
  Trash2,
  Grid,
  List,
  SortAsc,
  SortDesc,
} from 'lucide-react';
// Removed unused context imports
import { Document, SearchFilters } from '../types';

interface SearchResult extends Document {
  relevanceScore: number;
  matchedTerms: string[];
  snippet: string;
}

export const SearchPage: React.FC = () => {
  // Removed unused context hooks
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'name' | 'size'>(
    'relevance'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    language: '',
    dateRange: undefined,
    tags: [],
    fileType: '',
    minConfidence: 0,
  });

  // Mock search results for demonstration
  const mockDocuments: SearchResult[] = [
    {
      id: '1',
      name: 'Project Proposal 2024.pdf',
      url: '/documents/project-proposal-2024.pdf',
      type: 'application/pdf',
      size: 2048576,
      uploadedAt: new Date('2024-01-15'),
      category: 'Business',
      tags: ['proposal', '2024', 'project', 'business'],
      language: 'en',
      confidence: 0.95,
      summary:
        'Comprehensive project proposal for Q1 2024 initiatives including budget allocation and timeline.',
      extractedText:
        'This document outlines our strategic initiatives for the first quarter of 2024...',
      processingStatus: 'completed',
      aiModel: 'GPT-4',
      processingTime: 2.3,
      qualityScore: 0.92,
      viewCount: 15,
      lastAccessed: new Date('2024-01-20'),
      isEncrypted: false,
      privacyLevel: 'private',
      collaborators: ['user1@example.com'],
      version: 1,
      relevanceScore: 0.95,
      matchedTerms: ['project', 'proposal', '2024'],
      snippet:
        'This document outlines our strategic initiatives for the first quarter of 2024, including detailed budget allocation and project timeline...',
    },
    {
      id: '2',
      name: 'Meeting Notes - Team Sync.docx',
      url: '/documents/meeting-notes-team-sync.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 512000,
      uploadedAt: new Date('2024-01-18'),
      category: 'Meeting Notes',
      tags: ['meeting', 'team', 'sync', 'notes'],
      language: 'en',
      confidence: 0.88,
      summary:
        'Weekly team synchronization meeting notes covering project updates and action items.',
      extractedText:
        'Team sync meeting held on January 18th, 2024. Key discussion points...',
      processingStatus: 'completed',
      aiModel: 'GPT-4',
      processingTime: 1.8,
      qualityScore: 0.85,
      viewCount: 8,
      lastAccessed: new Date('2024-01-19'),
      isEncrypted: false,
      privacyLevel: 'private',
      collaborators: ['user2@example.com', 'user3@example.com'],
      version: 1,
      relevanceScore: 0.78,
      matchedTerms: ['meeting', 'team', 'sync'],
      snippet:
        'Weekly team synchronization meeting notes covering project updates, action items, and key decisions made during the session...',
    },
    {
      id: '3',
      name: 'Financial Report Q4 2023.xlsx',
      url: '/documents/financial-report-q4-2023.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 1536000,
      uploadedAt: new Date('2024-01-10'),
      category: 'Finance',
      tags: ['financial', 'report', 'Q4', '2023', 'excel'],
      language: 'en',
      confidence: 0.92,
      summary:
        'Comprehensive financial report for Q4 2023 including revenue, expenses, and profit analysis.',
      extractedText:
        'Q4 2023 Financial Report. Total revenue: $2.5M, Expenses: $1.8M...',
      processingStatus: 'completed',
      aiModel: 'GPT-4',
      processingTime: 3.2,
      qualityScore: 0.94,
      viewCount: 23,
      lastAccessed: new Date('2024-01-22'),
      isEncrypted: true,
      privacyLevel: 'restricted',
      collaborators: ['finance@example.com'],
      version: 2,
      relevanceScore: 0.65,
      matchedTerms: ['financial', 'report'],
      snippet:
        'Comprehensive financial report for Q4 2023 including detailed revenue analysis, expense breakdown, and profit margin calculations...',
    },
  ];

  const categories = [
    'All',
    'Business',
    'Meeting Notes',
    'Finance',
    'Technical',
    'Personal',
    'Legal',
  ];
  const fileTypes = [
    'All',
    'PDF',
    'DOCX',
    'XLSX',
    'PPTX',
    'TXT',
    'Images',
    'Videos',
    'Audio',
  ];
  const languages = [
    'All',
    'English',
    'Macedonian',
    'French',
    'Spanish',
    'German',
  ];

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return FileImage;
    if (type === 'application/pdf') return FileText;
    if (type.startsWith('video/')) return FileVideo;
    if (type.startsWith('audio/')) return FileAudio;
    if (type.includes('spreadsheet') || type.includes('excel')) return FileText;
    if (type.includes('word') || type.includes('document')) return FileText;
    if (type.includes('zip') || type.includes('rar') || type.includes('7z'))
      return Archive;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate AI-powered search
    setTimeout(() => {
      const filteredResults = mockDocuments.filter(doc => {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          doc.name.toLowerCase().includes(query) ||
          doc.summary?.toLowerCase().includes(query) ||
          doc.tags?.some(tag => tag.toLowerCase().includes(query)) ||
          doc.extractedText?.toLowerCase().includes(query);

        const matchesFilters =
          (!filters.category ||
            filters.category === 'All' ||
            doc.category === filters.category) &&
          (!filters.fileType ||
            filters.fileType === 'All' ||
            doc.type.includes(filters.fileType.toLowerCase())) &&
          (!filters.language ||
            filters.language === 'All' ||
            doc.language === filters.language.toLowerCase()) &&
          (!filters.minConfidence ||
            (doc.confidence || 0) >= filters.minConfidence);

        return matchesQuery && matchesFilters;
      });

      // Sort results
      const sortedResults = filteredResults.sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'relevance':
            comparison = b.relevanceScore - a.relevanceScore;
            break;
          case 'date':
            comparison = b.uploadedAt.getTime() - a.uploadedAt.getTime();
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'size':
            comparison = b.size - a.size;
            break;
        }
        return sortOrder === 'asc' ? -comparison : comparison;
      });

      setSearchResults(sortedResults);
      setIsSearching(false);
    }, 1000);
  }, [searchQuery, filters, sortBy, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [handleSearch]);

  const handleResultSelect = (resultId: string) => {
    setSelectedResults(prev =>
      prev.includes(resultId)
        ? prev.filter(id => id !== resultId)
        : [...prev, resultId]
    );
  };

  const handleSelectAll = () => {
    if (selectedResults.length === searchResults.length) {
      setSelectedResults([]);
    } else {
      setSelectedResults(
        searchResults
          .map(result => result.id)
          .filter((id): id is string => id !== undefined)
      );
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(
      `Bulk action: ${action} on ${selectedResults.length} documents`
    );
    setSelectedResults([]);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-2 h-2 bg-primary-400/20 rounded-full'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mb-8'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className='p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200'
              >
                <ArrowLeft className='w-5 h-5 text-gray-600 dark:text-gray-400' />
              </motion.button>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  AI-Powered Search
                </h1>
                <p className='text-lg text-gray-600 dark:text-gray-300'>
                  Find documents with intelligent search and filters
                </p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className='flex items-center space-x-2'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Grid className='w-5 h-5' />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400'
                }`}
              >
                <List className='w-5 h-5' />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='mb-8'
        >
          <div className='relative'>
            <div className='flex items-center space-x-4'>
              <div className='flex-1 relative'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder='Search documents with AI-powered intelligence...'
                  className='w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200'
                />
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchQuery('')}
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                  >
                    <X className='w-4 h-4' />
                  </motion.button>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  showFilters
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border border-white/20 dark:border-gray-700/20'
                }`}
              >
                <Filter className='w-5 h-5' />
                <span>Filters</span>
                {showFilters ? (
                  <ChevronUp className='w-4 h-4' />
                ) : (
                  <ChevronDown className='w-4 h-4' />
                )}
              </motion.button>
            </div>

            {/* Advanced Search Toggle */}
            <div className='mt-4 flex items-center justify-between'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className='flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200'
              >
                <Brain className='w-4 h-4' />
                <span className='text-sm font-medium'>
                  {showAdvancedSearch ? 'Hide' : 'Show'} Advanced Search
                </span>
              </motion.button>

              {/* Sort Options */}
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className='px-3 py-1 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-white/20 dark:border-gray-700/20 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                >
                  <option value='relevance'>Relevance</option>
                  <option value='date'>Date</option>
                  <option value='name'>Name</option>
                  <option value='size'>Size</option>
                </select>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }
                  className='p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200'
                >
                  {sortOrder === 'asc' ? (
                    <SortAsc className='w-4 h-4' />
                  ) : (
                    <SortDesc className='w-4 h-4' />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className='mb-8 overflow-hidden'
            >
              <div className='p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                  {/* Category Filter */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={e =>
                        setFilters(prev => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className='w-full px-3 py-2 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-white/20 dark:border-gray-600/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* File Type Filter */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      File Type
                    </label>
                    <select
                      value={filters.fileType}
                      onChange={e =>
                        setFilters(prev => ({
                          ...prev,
                          fileType: e.target.value,
                        }))
                      }
                      className='w-full px-3 py-2 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-white/20 dark:border-gray-600/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                    >
                      {fileTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Language Filter */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Language
                    </label>
                    <select
                      value={filters.language}
                      onChange={e =>
                        setFilters(prev => ({
                          ...prev,
                          language: e.target.value,
                        }))
                      }
                      className='w-full px-3 py-2 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-white/20 dark:border-gray-600/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                    >
                      {languages.map(lang => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Confidence Filter */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Min Confidence: {filters.minConfidence}
                    </label>
                    <input
                      type='range'
                      min='0'
                      max='1'
                      step='0.1'
                      value={filters.minConfidence}
                      onChange={e =>
                        setFilters(prev => ({
                          ...prev,
                          minConfidence: parseFloat(e.target.value),
                        }))
                      }
                      className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer'
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <div className='mt-4 flex justify-end'>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setFilters({
                        category: '',
                        language: '',
                        dateRange: undefined,
                        tags: [],
                        fileType: '',
                        minConfidence: 0,
                      })
                    }
                    className='px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200'
                  >
                    Clear All Filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Results Header */}
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center space-x-4'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                {isSearching
                  ? 'Searching...'
                  : `${searchResults.length} results found`}
              </h2>
              {searchResults.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSelectAll}
                  className='text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200'
                >
                  {selectedResults.length === searchResults.length
                    ? 'Deselect All'
                    : 'Select All'}
                </motion.button>
              )}
            </div>

            {/* Bulk Actions */}
            {selectedResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className='flex items-center space-x-2'
              >
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  {selectedResults.length} selected
                </span>
                <div className='flex items-center space-x-1'>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleBulkAction('download')}
                    className='p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200'
                  >
                    <Download className='w-4 h-4' />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleBulkAction('share')}
                    className='p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200'
                  >
                    <Share2 className='w-4 h-4' />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleBulkAction('delete')}
                    className='p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200'
                  >
                    <Trash2 className='w-4 h-4' />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Loading State */}
          {isSearching && (
            <div className='flex items-center justify-center py-12'>
              <div className='flex items-center space-x-3'>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className='w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full'
                />
                <span className='text-gray-600 dark:text-gray-400'>
                  Searching with AI...
                </span>
              </div>
            </div>
          )}

          {/* Results Grid/List */}
          {!isSearching && searchResults.length > 0 && (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {searchResults.map((result, index) => {
                const FileIcon = getFileIcon(result.type);
                const isSelected = result.id
                  ? selectedResults.includes(result.id)
                  : false;

                return (
                  <motion.div
                    key={result.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : ''
                    }`}
                    onClick={() => result.id && handleResultSelect(result.id)}
                  >
                    {viewMode === 'grid' ? (
                      // Grid View
                      <div className='space-y-4'>
                        <div className='flex items-start justify-between'>
                          <div className='flex items-center space-x-3'>
                            <div className='p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl'>
                              <FileIcon className='w-6 h-6 text-primary-600 dark:text-primary-400' />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <h3 className='font-semibold text-gray-900 dark:text-white truncate'>
                                {result.name}
                              </h3>
                              <p className='text-sm text-gray-600 dark:text-gray-400'>
                                {result.category} •{' '}
                                {formatFileSize(result.size)}
                              </p>
                            </div>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <div className='flex items-center space-x-1'>
                              <Star className='w-4 h-4 text-yellow-500' />
                              <span className='text-sm text-gray-600 dark:text-gray-400'>
                                {Math.round(result.relevanceScore * 100)}%
                              </span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                            >
                              <MoreVertical className='w-4 h-4' />
                            </motion.button>
                          </div>
                        </div>

                        <p className='text-sm text-gray-700 dark:text-gray-300 line-clamp-3'>
                          {result.snippet}
                        </p>

                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400'>
                            <div className='flex items-center space-x-1'>
                              <Calendar className='w-3 h-3' />
                              <span>{formatDate(result.uploadedAt)}</span>
                            </div>
                            <div className='flex items-center space-x-1'>
                              <Eye className='w-3 h-3' />
                              <span>{result.viewCount}</span>
                            </div>
                          </div>
                          <div className='flex items-center space-x-1'>
                            {result.tags?.slice(0, 2).map(tag => (
                              <span
                                key={tag}
                                className='px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs'
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List View
                      <div className='flex items-center space-x-4'>
                        <div className='p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl'>
                          <FileIcon className='w-6 h-6 text-primary-600 dark:text-primary-400' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center justify-between'>
                            <h3 className='font-semibold text-gray-900 dark:text-white truncate'>
                              {result.name}
                            </h3>
                            <div className='flex items-center space-x-4'>
                              <div className='flex items-center space-x-1'>
                                <Star className='w-4 h-4 text-yellow-500' />
                                <span className='text-sm text-gray-600 dark:text-gray-400'>
                                  {Math.round(result.relevanceScore * 100)}%
                                </span>
                              </div>
                              <span className='text-sm text-gray-600 dark:text-gray-400'>
                                {formatFileSize(result.size)}
                              </span>
                              <span className='text-sm text-gray-600 dark:text-gray-400'>
                                {formatDate(result.uploadedAt)}
                              </span>
                            </div>
                          </div>
                          <p className='text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2'>
                            {result.snippet}
                          </p>
                          <div className='flex items-center space-x-4 mt-2'>
                            <span className='text-xs text-gray-500 dark:text-gray-400'>
                              {result.category}
                            </span>
                            <div className='flex items-center space-x-1'>
                              <Eye className='w-3 h-3' />
                              <span className='text-xs text-gray-500 dark:text-gray-400'>
                                {result.viewCount} views
                              </span>
                            </div>
                            <div className='flex items-center space-x-1'>
                              {result.tags?.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className='px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs'
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                        >
                          <MoreVertical className='w-4 h-4' />
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {!isSearching && searchQuery && searchResults.length === 0 && (
            <div className='text-center py-12'>
              <div className='p-4 bg-gray-100 dark:bg-gray-700/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center'>
                <Search className='w-8 h-8 text-gray-400' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                No documents found
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>
                Try adjusting your search terms or filters
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    category: '',
                    language: '',
                    dateRange: undefined,
                    tags: [],
                    fileType: '',
                    minConfidence: 0,
                  });
                }}
                className='px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200'
              >
                Clear Search
              </motion.button>
            </div>
          )}

          {/* Empty State */}
          {!isSearching && !searchQuery && (
            <div className='text-center py-12'>
              <div className='p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center'>
                <Sparkles className='w-8 h-8 text-primary-600 dark:text-primary-400' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Start searching your documents
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Use AI-powered search to find documents by content, tags, or
                metadata
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
