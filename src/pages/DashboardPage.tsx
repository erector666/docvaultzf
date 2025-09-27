import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  FileText,
  CheckCircle,
  Clock,
  HardDrive,
  Upload,
  Search,
  Settings,
  BarChart3,
  Activity,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Sparkles,
  User,
  Plus,
  FolderOpen,
  Star,
  Calendar,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { showError } from '../utils/notification';
import { documentService } from '../services/documentService';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
  const [storageUsage, setStorageUsage] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);

  const features = [
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Smart document processing and categorization',
    },
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Find documents with intelligent search',
    },
    {
      icon: Shield,
      title: 'Secure Storage',
      description: 'Enterprise-grade security for your documents',
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Quick document upload and analysis',
    },
  ];

  // Load documents data
  useEffect(() => {
    const loadDocuments = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        const docs = await documentService.getDocuments(user.uid);
        setDocuments(docs);
        setDocumentCount(docs.length);

        // Calculate storage usage
        const totalSize = docs.reduce((sum, doc) => sum + (doc.size || 0), 0);
        setStorageUsage(totalSize);

        // Get recent documents (last 5)
        const recent = docs
          .sort(
            (a, b) =>
              new Date(b.uploadDate).getTime() -
              new Date(a.uploadDate).getTime()
          )
          .slice(0, 5);
        setRecentDocuments(recent);
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [user?.uid]);

  const stats = [
    {
      icon: FileText,
      title: 'Total Documents',
      value: documentCount,
      color: 'primary',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
      iconColor: 'text-primary-600 dark:text-primary-400',
    },
    {
      icon: CheckCircle,
      title: 'Processed',
      value: Math.floor(documentCount * 0.95), // 95% of total processed
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: Clock,
      title: 'Processing',
      value: Math.floor(documentCount * 0.05), // 5% currently processing
      color: 'yellow',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      icon: HardDrive,
      title: 'Storage Used',
      value: `${(storageUsage / (1024 * 1024)).toFixed(1)} MB`,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
  ];

  const quickActions = [
    {
      icon: Upload,
      title: 'Upload Document',
      description: 'Add new documents to your vault',
      color: 'primary',
      onClick: () => navigate('/upload'),
      badge: documentCount === 0 ? 'Start here' : undefined,
    },
    {
      icon: Search,
      title: 'Search Documents',
      description: 'Find documents with AI-powered search',
      color: 'purple',
      onClick: () => navigate('/search'),
      disabled: documentCount === 0,
    },
    {
      icon: BarChart3,
      title: 'View Analytics',
      description: 'See insights about your documents',
      color: 'green',
      onClick: () => navigate('/analytics'),
      disabled: documentCount === 0,
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'Manage your account preferences',
      color: 'gray',
      onClick: () => navigate('/settings'),
    },
    {
      icon: User,
      title: 'Profile',
      description: 'View and edit your profile',
      color: 'indigo',
      onClick: () => navigate('/profile'),
    },
  ];

  const handleViewDocument = (document: any) => {
    if (document.downloadURL) {
      try {
        // Open document in new tab
        window.open(document.downloadURL, '_blank');
      } catch (error) {
        console.error('Failed to open document:', error);
        showError('Document Error', 'Failed to open document. Please try again.');
      }
    } else {
      showError('Document Error', 'Document URL not available');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-2 h-2 bg-primary-400/20 rounded-full pointer-events-none'
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

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mb-12'
        >
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
                Welcome back, {user?.displayName || 'User'}!
              </h1>
              <p className='text-lg text-gray-600 dark:text-gray-300'>
                Manage your AI-powered document vault
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='mb-8'
        >
          <div className='bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 p-6'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className='flex items-center justify-between'
              >
                <div className='flex items-center space-x-4'>
                  <div className='p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl'>
                    {React.createElement(features[currentFeature].icon, {
                      className:
                        'w-8 h-8 text-primary-600 dark:text-primary-400',
                    })}
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                      {features[currentFeature].title}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300'>
                      {features[currentFeature].description}
                    </p>
                  </div>
                </div>
                <div className='hidden md:flex items-center space-x-2'>
                  {features.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        index === currentFeature
                          ? 'bg-primary-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -2 }}
              className='bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                      {stat.title}
                    </p>
                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <TrendingUp className='w-5 h-5 text-green-500' />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Storage Warning */}
        {storageUsage > 100 * 1024 * 1024 && ( // 100MB warning
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className='mb-8'
          >
            <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4'>
              <div className='flex items-center'>
                <AlertCircle className='w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3' />
                <div>
                  <p className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                    Storage Usage Alert
                  </p>
                  <p className='text-sm text-yellow-700 dark:text-yellow-300'>
                    You're using {(storageUsage / (1024 * 1024)).toFixed(1)} MB
                    of storage. Consider upgrading your plan for more space.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='lg:col-span-2'
          >
            <div className='bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 p-6 shadow-lg'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Recent Activity
                </h3>
                <Activity className='w-6 h-6 text-primary-600 dark:text-primary-400' />
              </div>
              <div className='space-y-4'>
                {loading ? (
                  <div className='text-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4'></div>
                    <p className='text-gray-600 dark:text-gray-400'>
                      Loading activity...
                    </p>
                  </div>
                ) : recentDocuments.length > 0 ? (
                  <>
                    {recentDocuments.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        onClick={() => handleViewDocument(doc)}
                        className='flex items-center p-4 bg-white/40 dark:bg-gray-800/40 rounded-lg border border-white/20 dark:border-gray-700/20 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors duration-200 cursor-pointer'
                      >
                        <div className='p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg'>
                          <FileText className='w-5 h-5 text-primary-600 dark:text-primary-400' />
                        </div>
                        <div className='ml-4 flex-1'>
                          <p className='text-sm font-medium text-gray-900 dark:text-white'>
                            {doc.name}
                          </p>
                          <p className='text-xs text-gray-600 dark:text-gray-400'>
                            {doc.category} •{' '}
                            {((doc.size || 0) / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                        <div className='ml-auto text-right'>
                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </span>
                          {doc.isStarred && (
                            <Star className='w-4 h-4 text-yellow-500 ml-2' />
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {documentCount > 5 && (
                      <div className='text-center pt-4'>
                        <button
                          onClick={() => navigate('/documents')}
                          className='text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200'
                        >
                          View all {documentCount} documents →
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className='text-center py-8'>
                    <div className='p-4 bg-gray-100 dark:bg-gray-700/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center'>
                      <FileText className='w-8 h-8 text-gray-400' />
                    </div>
                    <p className='text-gray-600 dark:text-gray-400 mb-4'>
                      No documents yet. Upload your first document to get
                      started!
                    </p>
                    <button
                      onClick={() => navigate('/upload')}
                      className='inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200'
                    >
                      <Plus className='w-4 h-4 mr-2' />
                      Upload Document
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className='bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 p-6 shadow-lg'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Quick Actions
                </h3>
                <Zap className='w-6 h-6 text-primary-600 dark:text-primary-400' />
              </div>
              <div className='space-y-3'>
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ scale: action.disabled ? 1 : 1.02 }}
                    whileTap={{ scale: action.disabled ? 1 : 0.98 }}
                    onClick={action.disabled ? undefined : action.onClick}
                    disabled={action.disabled}
                    className={`w-full p-4 rounded-lg border transition-all duration-200 text-left group relative ${
                      action.disabled
                        ? 'bg-gray-100 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700/20 opacity-50 cursor-not-allowed'
                        : 'bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border-white/20 dark:border-gray-700/20'
                    }`}
                  >
                    <div className='flex items-center space-x-3'>
                      <div
                        className={`p-2 rounded-lg group-hover:scale-110 transition-transform duration-200 ${
                          action.disabled
                            ? 'bg-gray-200 dark:bg-gray-700/30'
                            : `bg-${action.color}-100 dark:bg-${action.color}-900/30`
                        }`}
                      >
                        <action.icon
                          className={`w-5 h-5 ${
                            action.disabled
                              ? 'text-gray-400 dark:text-gray-500'
                              : `text-${action.color}-600 dark:text-${action.color}-400`
                          }`}
                        />
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center space-x-2'>
                          <p
                            className={`font-medium ${
                              action.disabled
                                ? 'text-gray-500 dark:text-gray-400'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {action.title}
                          </p>
                          {action.badge && (
                            <span className='px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full'>
                              {action.badge}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm ${
                            action.disabled
                              ? 'text-gray-400 dark:text-gray-500'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className='mt-12 pt-8 border-t border-white/20 dark:border-gray-700/20'
        >
          <div className='flex items-center justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400'>
            <div className='flex items-center space-x-2'>
              <Shield className='w-5 h-5 text-green-500' />
              <span>Secure & Encrypted</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Brain className='w-5 h-5 text-primary-500' />
              <span>Smart</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Users className='w-5 h-5 text-blue-500' />
              <span>Trusted by Thousands</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
