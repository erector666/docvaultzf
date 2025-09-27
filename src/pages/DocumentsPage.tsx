import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showError } from '../utils/notification';
import { documentService, Document } from '../services/documentService';
import {
  ArrowLeft,
  Search,
  Grid,
  List,
  Upload,
  MoreVertical,
  Download,
  Eye,
  Star,
  Calendar,
  FileText,
  FileImage,
  FileVideo,
  Archive,
  Plus,
  X,
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);


  useEffect(() => {
    const loadDocuments = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        const docs = await documentService.getDocuments(
          user.uid,
          selectedCategory
        );
        setDocuments(docs);
      } catch (err) {
        console.error('Error loading documents:', err);
        setError('Failed to load documents');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [user, selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return FileText;
      case 'docx':
      case 'doc':
        return FileText;
      case 'xlsx':
      case 'xls':
        return FileText;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return FileImage;
      case 'mp4':
      case 'avi':
      case 'mov':
        return FileVideo;
      default:
        return Archive;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (searchQuery) {
      return (
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return b.uploadDate.getTime() - a.uploadDate.getTime();
      case 'size':
        return b.size - a.size;
      default:
        return 0;
    }
  });

  const categories = [
    'all',
    ...Array.from(new Set(documents.map(doc => doc.category))),
  ];

  // const handleDeleteDocument = async (documentId: string) => {
  //   if (!user) return;
  //
  //   try {
  //     await documentService.deleteDocument(documentId, user.uid);
  //     setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  //   } catch (err) {
  //     console.error('Error deleting document:', err);
  //     setError('Failed to delete document');
  //   }
  // };

  const handleViewDocument = (doc: Document) => {
    if (doc.downloadURL) {
      try {
        setSelectedDocument(doc);
        setShowDocumentViewer(true);
      } catch (error) {
        console.error('Failed to open document viewer:', error);
        showError('Document Error', 'Failed to open document. Please try again.');
      }
    } else {
      showError('Document Error', 'Document URL not available');
    }
  };

  const closeDocumentViewer = () => {
    setShowDocumentViewer(false);
    setSelectedDocument(null);
  };

  const handleDownloadDocument = (doc: Document) => {
    if (doc.downloadURL) {
      try {
        // Create a temporary link to download the document
        const link = document.createElement('a');
        link.href = doc.downloadURL;
        link.download = doc.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Failed to download document:', error);
        showError('Download Error', 'Failed to download document. Please try again.');
      }
    } else {
      showError('Document Error', 'Document URL not available');
    }
  };

  const handleToggleStar = async (documentId: string, isStarred: boolean) => {
    try {
      await documentService.updateDocument(documentId, {
        isStarred: !isStarred,
      });
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === documentId ? { ...doc, isStarred: !isStarred } : doc
        )
      );
    } catch (err) {
      console.error('Error updating document:', err);
      setError('Failed to update document');
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10'>
          <div className='flex items-center justify-center min-h-[60vh]'>
            <div className='text-center'>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className='w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4'
              />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Loading Documents
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Fetching your document collection...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  Documents
                </h1>
                <p className='text-lg text-gray-600 dark:text-gray-300'>
                  Manage your document collection
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/upload')}
                className='flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg'
              >
                <Plus className='w-4 h-4' />
                <span>Upload</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className='mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/20 rounded-xl flex items-center space-x-3'
          >
            <div className='w-5 h-5 text-red-600 dark:text-red-400'>⚠️</div>
            <span className='text-red-800 dark:text-red-200 font-medium'>
              {error}
            </span>
            <button
              onClick={() => setError(null)}
              className='ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200'
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='mb-8'
        >
          <div className='flex flex-col lg:flex-row gap-4 items-center justify-between'>
            <div className='flex-1 max-w-md'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search documents...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                />
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className='px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className='px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
              >
                <option value='date'>Sort by Date</option>
                <option value='name'>Sort by Name</option>
                <option value='size'>Sort by Size</option>
              </select>

              <div className='flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 p-1'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Grid className='w-4 h-4' />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <List className='w-4 h-4' />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Documents Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {sortedDocuments.length === 0 ? (
            <div className='text-center py-12'>
              <div className='w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FileText className='w-12 h-12 text-gray-400' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                No documents found
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first document to get started'}
              </p>
              {!searchQuery && selectedCategory === 'all' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/upload')}
                  className='flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg mx-auto'
                >
                  <Upload className='w-5 h-5' />
                  <span>Upload Document</span>
                </motion.button>
              )}
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              {sortedDocuments.map((doc, index) => {
                const Icon = getFileIcon(doc.type);
                return (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => handleViewDocument(doc)}
                    className={`p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group ${
                      viewMode === 'list' ? 'flex items-center space-x-4' : ''
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className='flex items-center justify-between mb-4'>
                          <div className='p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl'>
                            <Icon className='w-6 h-6 text-primary-600 dark:text-primary-400' />
                          </div>
                          <div className='flex items-center space-x-2'>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStar(doc.id, doc.isStarred);
                              }}
                              className={`p-1 rounded-lg transition-colors duration-200 ${
                                doc.isStarred
                                  ? 'text-yellow-500'
                                  : 'text-gray-400 hover:text-yellow-500'
                              }`}
                            >
                              <Star className='w-4 h-4' />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadDocument(doc);
                              }}
                              className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors duration-200'
                            >
                              <Download className='w-4 h-4' />
                            </motion.button>
                          </div>
                        </div>

                        <div className='mb-4'>
                          <h3 className='font-semibold text-gray-900 dark:text-white mb-1 truncate'>
                            {doc.name}
                          </h3>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {doc.category} • {formatFileSize(doc.size)}
                          </p>
                        </div>

                        <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
                          <div className='flex items-center space-x-1'>
                            <Calendar className='w-3 h-3' />
                            <span>{doc.uploadDate.toLocaleDateString()}</span>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className='p-1 text-gray-400 hover:text-blue-600 rounded-lg transition-colors duration-200'
                            >
                              <Eye className='w-3 h-3' />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className='p-1 text-gray-400 hover:text-green-600 rounded-lg transition-colors duration-200'
                            >
                              <Download className='w-3 h-3' />
                            </motion.button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className='p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl'>
                          <Icon className='w-6 h-6 text-primary-600 dark:text-primary-400' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='font-semibold text-gray-900 dark:text-white mb-1 truncate'>
                            {doc.name}
                          </h3>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {doc.category} • {formatFileSize(doc.size)} •{' '}
                            {doc.uploadDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStar(doc.id, doc.isStarred);
                            }}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              doc.isStarred
                                ? 'text-yellow-500'
                                : 'text-gray-400 hover:text-yellow-500'
                            }`}
                          >
                            <Star className='w-4 h-4' />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDocument(doc);
                            }}
                            className='p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors duration-200'
                          >
                            <Eye className='w-4 h-4' />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadDocument(doc);
                            }}
                            className='p-2 text-gray-400 hover:text-green-600 rounded-lg transition-colors duration-200'
                          >
                            <Download className='w-4 h-4' />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors duration-200'
                          >
                            <MoreVertical className='w-4 h-4' />
                          </motion.button>
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Document Viewer Modal */}
      {showDocumentViewer && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  {(() => {
                    const Icon = getFileIcon(selectedDocument.type);
                    return <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedDocument.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedDocument.category} • {formatFileSize(selectedDocument.size)} • {selectedDocument.uploadDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownloadDocument(selectedDocument)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors duration-200"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeDocumentViewer}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors duration-200"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-auto">
              {selectedDocument.downloadURL ? (
                <div className="w-full h-full">
                  {/* PDF Viewer */}
                  {selectedDocument.type === 'pdf' ? (
                    <iframe
                      src={selectedDocument.downloadURL}
                      className="w-full h-[60vh] rounded-lg border border-gray-200 dark:border-gray-700"
                      title={selectedDocument.name}
                    />
                  ) : 
                  /* Image Viewer */
                  selectedDocument.type === 'image' ? (
                    <div className="flex justify-center">
                      <img
                        src={selectedDocument.downloadURL}
                        alt={selectedDocument.name}
                        className="max-w-full max-h-[60vh] rounded-lg shadow-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex flex-col items-center justify-center h-[60vh] text-center p-8">
                                <FileText class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Preview not available</h4>
                                <p class="text-gray-600 dark:text-gray-400 mb-4">This file type cannot be previewed in the browser.</p>
                                <button onclick="window.open('${selectedDocument.downloadURL}', '_blank')" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                  Open in New Tab
                                </button>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  ) : 
                  /* Text Viewer */
                  ['txt', 'md', 'csv', 'json', 'xml'].includes(selectedDocument.type) ? (
                    <iframe
                      src={selectedDocument.downloadURL}
                      className="w-full h-[60vh] rounded-lg border border-gray-200 dark:border-gray-700"
                      title={selectedDocument.name}
                    />
                  ) : 
                  /* Unsupported file types */
                  (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
                      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                        {(() => {
                          const Icon = getFileIcon(selectedDocument.type);
                          return <Icon className="w-12 h-12 text-gray-400" />;
                        })()}
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Preview not available
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                        This file type cannot be previewed in the browser. You can download it to view with an appropriate application.
                      </p>
                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.open(selectedDocument.downloadURL, '_blank')}
                          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Open in New Tab</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDownloadDocument(selectedDocument)}
                          className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
                  <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                    <FileText className="w-12 h-12 text-red-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Document not available
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    The document URL is not available. Please try uploading the document again.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
