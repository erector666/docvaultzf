import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  Clock,
  Eye,
  Star,
  Activity,
  RefreshCw,
  MoreVertical,
  Download as DownloadIcon,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface AnalyticsData {
  totalDocuments: number;
  totalSize: number;
  documentsByType: Array<{
    type: string;
    count: number;
    size: number;
    percentage: number;
  }>;
  documentsByCategory: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  uploadTrend: Array<{ date: string; count: number; size: number }>;
  processingStats: {
    completed: number;
    processing: number;
    failed: number;
    averageProcessingTime: number;
  };
  qualityMetrics: {
    averageConfidence: number;
    averageQualityScore: number;
    highQualityDocuments: number;
  };
  usageStats: {
    totalViews: number;
    totalDownloads: number;
    mostViewedDocuments: Array<{
      name: string;
      views: number;
      category: string;
    }>;
    recentActivity: Array<{
      action: string;
      document: string;
      timestamp: Date;
      user: string;
    }>;
  };
  storageBreakdown: {
    used: number;
    available: number;
    byCategory: Array<{ category: string; size: number; percentage: number }>;
  };
}

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    '7d' | '30d' | '90d' | '1y'
  >('30d');

  // Mock analytics data - moved inside useEffect to avoid dependency issues
  const getMockAnalyticsData = (): AnalyticsData => ({
    totalDocuments: 1247,
    totalSize: 2.4 * 1024 * 1024 * 1024, // 2.4 GB
    documentsByType: [
      {
        type: 'PDF',
        count: 456,
        size: 1.2 * 1024 * 1024 * 1024,
        percentage: 36.6,
      },
      {
        type: 'DOCX',
        count: 234,
        size: 0.4 * 1024 * 1024 * 1024,
        percentage: 18.8,
      },
      {
        type: 'XLSX',
        count: 189,
        size: 0.3 * 1024 * 1024 * 1024,
        percentage: 15.2,
      },
      {
        type: 'Images',
        count: 198,
        size: 0.3 * 1024 * 1024 * 1024,
        percentage: 15.9,
      },
      {
        type: 'Other',
        count: 170,
        size: 0.2 * 1024 * 1024 * 1024,
        percentage: 13.6,
      },
    ],
    documentsByCategory: [
      { category: 'Business', count: 456, percentage: 36.6 },
      { category: 'Technical', count: 234, percentage: 18.8 },
      { category: 'Finance', count: 189, percentage: 15.2 },
      { category: 'Personal', count: 198, percentage: 15.9 },
      { category: 'Legal', count: 170, percentage: 13.6 },
    ],
    uploadTrend: [
      { date: '2024-01-01', count: 12, size: 24 * 1024 * 1024 },
      { date: '2024-01-02', count: 18, size: 36 * 1024 * 1024 },
      { date: '2024-01-03', count: 8, size: 16 * 1024 * 1024 },
      { date: '2024-01-04', count: 25, size: 50 * 1024 * 1024 },
      { date: '2024-01-05', count: 15, size: 30 * 1024 * 1024 },
      { date: '2024-01-06', count: 22, size: 44 * 1024 * 1024 },
      { date: '2024-01-07', count: 19, size: 38 * 1024 * 1024 },
    ],
    processingStats: {
      completed: 1180,
      processing: 45,
      failed: 22,
      averageProcessingTime: 2.3,
    },
    qualityMetrics: {
      averageConfidence: 0.89,
      averageQualityScore: 0.87,
      highQualityDocuments: 1024,
    },
    usageStats: {
      totalViews: 15420,
      totalDownloads: 3240,
      mostViewedDocuments: [
        { name: 'Project Proposal 2024.pdf', views: 156, category: 'Business' },
        {
          name: 'Financial Report Q4 2023.xlsx',
          views: 142,
          category: 'Finance',
        },
        {
          name: 'Meeting Notes - Team Sync.docx',
          views: 128,
          category: 'Business',
        },
        {
          name: 'Technical Specifications.pdf',
          views: 115,
          category: 'Technical',
        },
        { name: 'User Manual v2.1.pdf', views: 98, category: 'Technical' },
      ],
      recentActivity: [
        {
          action: 'uploaded',
          document: 'New Contract Template.docx',
          timestamp: new Date('2024-01-22T10:30:00'),
          user: 'John Doe',
        },
        {
          action: 'viewed',
          document: 'Project Proposal 2024.pdf',
          timestamp: new Date('2024-01-22T09:45:00'),
          user: 'Jane Smith',
        },
        {
          action: 'downloaded',
          document: 'Financial Report Q4 2023.xlsx',
          timestamp: new Date('2024-01-22T09:15:00'),
          user: 'Mike Johnson',
        },
        {
          action: 'shared',
          document: 'Meeting Notes - Team Sync.docx',
          timestamp: new Date('2024-01-22T08:30:00'),
          user: 'Sarah Wilson',
        },
        {
          action: 'processed',
          document: 'Technical Specifications.pdf',
          timestamp: new Date('2024-01-22T08:00:00'),
          user: 'System',
        },
      ],
    },
    storageBreakdown: {
      used: 2.4 * 1024 * 1024 * 1024,
      available: 7.6 * 1024 * 1024 * 1024,
      byCategory: [
        {
          category: 'Business',
          size: 0.9 * 1024 * 1024 * 1024,
          percentage: 37.5,
        },
        {
          category: 'Technical',
          size: 0.6 * 1024 * 1024 * 1024,
          percentage: 25.0,
        },
        {
          category: 'Finance',
          size: 0.5 * 1024 * 1024 * 1024,
          percentage: 20.8,
        },
        {
          category: 'Personal',
          size: 0.3 * 1024 * 1024 * 1024,
          percentage: 12.5,
        },
        { category: 'Legal', size: 0.1 * 1024 * 1024 * 1024, percentage: 4.2 },
      ],
    },
  });

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalyticsData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAnalyticsData(getMockAnalyticsData());
      } catch (error) {
        console.error('Error loading analytics data:', error);
        // Set empty data on error
        setAnalyticsData({
          totalDocuments: 0,
          totalSize: 0,
          documentsByType: [],
          documentsByCategory: [],
          uploadTrend: [],
          processingStats: {
            completed: 0,
            processing: 0,
            failed: 0,
            averageProcessingTime: 0,
          },
          qualityMetrics: {
            averageConfidence: 0,
            averageQualityScore: 0,
            highQualityDocuments: 0,
          },
          usageStats: {
            totalViews: 0,
            totalDownloads: 0,
            mostViewedDocuments: [],
            recentActivity: [],
          },
          storageBreakdown: {
            used: 0,
            available: 0,
            byCategory: [],
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyticsData();
  }, [selectedTimeRange]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return FileText;
      case 'docx':
        return FileText;
      case 'xlsx':
        return FileText;
      case 'images':
        return FileImage;
      case 'videos':
        return FileVideo;
      case 'audio':
        return FileAudio;
      default:
        return Archive;
    }
  };

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    color = 'primary',
  }: {
    title: string;
    value: string | number;
    change?: { value: number; isPositive: boolean };
    icon: any;
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg'
    >
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
            {title}
          </p>
          <p className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>
            {value}
          </p>
          {change && (
            <div
              className={`flex items-center mt-2 text-sm ${
                change.isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {change.isPositive ? (
                <TrendingUp className='w-4 h-4 mr-1' />
              ) : (
                <TrendingDown className='w-4 h-4 mr-1' />
              )}
              {Math.abs(change.value)}%
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-xl ${
            color === 'primary'
              ? 'bg-primary-100 dark:bg-primary-900/30'
              : color === 'green'
                ? 'bg-green-100 dark:bg-green-900/30'
                : color === 'blue'
                  ? 'bg-blue-100 dark:bg-blue-900/30'
                  : 'bg-purple-100 dark:bg-purple-900/30'
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              color === 'primary'
                ? 'text-primary-600 dark:text-primary-400'
                : color === 'green'
                  ? 'text-green-600 dark:text-green-400'
                  : color === 'blue'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-purple-600 dark:text-purple-400'
            }`}
          />
        </div>
      </div>
    </motion.div>
  );

  const ChartCard = ({
    title,
    children,
    actions,
  }: {
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg'
    >
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
          {title}
        </h3>
        {actions && (
          <div className='flex items-center space-x-2'>{actions}</div>
        )}
      </div>
      {children}
    </motion.div>
  );

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
                Loading Analytics
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Analyzing your document insights...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

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
                  Document Analytics
                </h1>
                <p className='text-lg text-gray-600 dark:text-gray-300'>
                  Insights and performance metrics for your document vault
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              {/* Time Range Selector */}
              <select
                value={selectedTimeRange}
                onChange={e => setSelectedTimeRange(e.target.value as any)}
                className='px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
              >
                <option value='7d'>Last 7 days</option>
                <option value='30d'>Last 30 days</option>
                <option value='90d'>Last 90 days</option>
                <option value='1y'>Last year</option>
              </select>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200'
              >
                <RefreshCw className='w-5 h-5 text-gray-600 dark:text-gray-400' />
              </motion.button>

              {/* Export Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg'
              >
                <DownloadIcon className='w-4 h-4' />
                <span>Export</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <StatCard
            title='Total Documents'
            value={formatNumber(analyticsData.totalDocuments)}
            change={{ value: 12.5, isPositive: true }}
            icon={FileText}
            color='primary'
          />
          <StatCard
            title='Total Storage'
            value={formatFileSize(analyticsData.totalSize)}
            change={{ value: 8.3, isPositive: true }}
            icon={Archive}
            color='blue'
          />
          <StatCard
            title='Total Views'
            value={formatNumber(analyticsData.usageStats.totalViews)}
            change={{ value: 15.2, isPositive: true }}
            icon={Eye}
            color='green'
          />
          <StatCard
            title='Avg Quality Score'
            value={`${Math.round(analyticsData.qualityMetrics.averageQualityScore * 100)}%`}
            change={{ value: 2.1, isPositive: true }}
            icon={Star}
            color='purple'
          />
        </div>

        {/* Charts Row 1 */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {/* Documents by Type */}
          <ChartCard
            title='Documents by Type'
            actions={
              <div className='flex items-center space-x-2'>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                >
                  <MoreVertical className='w-4 h-4' />
                </motion.button>
              </div>
            }
          >
            <div className='space-y-4'>
              {analyticsData.documentsByType.map((item, index) => {
                const Icon = getFileTypeIcon(item.type);
                return (
                  <div key={item.type} className='flex items-center space-x-4'>
                    <div className='p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg'>
                      <Icon className='w-4 h-4 text-primary-600 dark:text-primary-400' />
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between mb-1'>
                        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                          {item.type}
                        </span>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className='bg-primary-600 h-2 rounded-full'
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>

          {/* Storage Breakdown */}
          <ChartCard
            title='Storage Breakdown'
            actions={
              <div className='flex items-center space-x-2'>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                >
                  <MoreVertical className='w-4 h-4' />
                </motion.button>
              </div>
            }
          >
            <div className='space-y-4'>
              {analyticsData.storageBreakdown.byCategory.map((item, index) => (
                <div
                  key={item.category}
                  className='flex items-center space-x-4'
                >
                  <div className='w-4 h-4 rounded-full bg-primary-600'></div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        {item.category}
                      </span>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        {formatFileSize(item.size)} ({item.percentage}%)
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className='bg-primary-600 h-2 rounded-full'
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Charts Row 2 */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {/* Upload Trend */}
          <ChartCard
            title='Upload Trend'
            actions={
              <div className='flex items-center space-x-2'>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                >
                  <MoreVertical className='w-4 h-4' />
                </motion.button>
              </div>
            }
          >
            <div className='h-64 flex items-end justify-between space-x-2'>
              {analyticsData.uploadTrend.map((day, index) => {
                const maxCount = Math.max(
                  ...analyticsData.uploadTrend.map(d => d.count)
                );
                const height = (day.count / maxCount) * 100;
                return (
                  <motion.div
                    key={day.date}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className='flex-1 bg-primary-600 rounded-t-lg relative group'
                  >
                    <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded'>
                      {day.count} docs
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className='flex justify-between mt-4 text-xs text-gray-500 dark:text-gray-400'>
              {analyticsData.uploadTrend.map(day => (
                <span key={day.date}>
                  {new Date(day.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              ))}
            </div>
          </ChartCard>

          {/* Processing Stats */}
          <ChartCard
            title='Processing Statistics'
            actions={
              <div className='flex items-center space-x-2'>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                >
                  <MoreVertical className='w-4 h-4' />
                </motion.button>
              </div>
            }
          >
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='p-2 bg-green-100 dark:bg-green-900/30 rounded-lg'>
                    <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Completed
                    </p>
                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                      {formatNumber(analyticsData.processingStats.completed)}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {Math.round(
                      (analyticsData.processingStats.completed /
                        analyticsData.totalDocuments) *
                        100
                    )}
                    %
                  </p>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg'>
                    <Clock className='w-5 h-5 text-yellow-600 dark:text-yellow-400' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Processing
                    </p>
                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                      {formatNumber(analyticsData.processingStats.processing)}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {Math.round(
                      (analyticsData.processingStats.processing /
                        analyticsData.totalDocuments) *
                        100
                    )}
                    %
                  </p>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='p-2 bg-red-100 dark:bg-red-900/30 rounded-lg'>
                    <XCircle className='w-5 h-5 text-red-600 dark:text-red-400' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Failed
                    </p>
                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                      {formatNumber(analyticsData.processingStats.failed)}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {Math.round(
                      (analyticsData.processingStats.failed /
                        analyticsData.totalDocuments) *
                        100
                    )}
                    %
                  </p>
                </div>
              </div>

              <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Average Processing Time
                  </span>
                  <span className='text-lg font-bold text-gray-900 dark:text-white'>
                    {analyticsData.processingStats.averageProcessingTime}s
                  </span>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Bottom Row */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Most Viewed Documents */}
          <ChartCard
            title='Most Viewed Documents'
            actions={
              <div className='flex items-center space-x-2'>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                >
                  <MoreVertical className='w-4 h-4' />
                </motion.button>
              </div>
            }
          >
            <div className='space-y-4'>
              {analyticsData.usageStats.mostViewedDocuments.map(
                (doc, index) => (
                  <div key={doc.name} className='flex items-center space-x-4'>
                    <div className='flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center'>
                      <span className='text-sm font-bold text-primary-600 dark:text-primary-400'>
                        {index + 1}
                      </span>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                        {doc.name}
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        {doc.category} • {doc.views} views
                      </p>
                    </div>
                    <div className='flex-shrink-0'>
                      <span className='text-sm font-bold text-gray-900 dark:text-white'>
                        {doc.views}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </ChartCard>

          {/* Recent Activity */}
          <ChartCard
            title='Recent Activity'
            actions={
              <div className='flex items-center space-x-2'>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                >
                  <MoreVertical className='w-4 h-4' />
                </motion.button>
              </div>
            }
          >
            <div className='space-y-4'>
              {analyticsData.usageStats.recentActivity.map(
                (activity, index) => (
                  <div key={index} className='flex items-center space-x-4'>
                    <div className='flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center'>
                      <Activity className='w-4 h-4 text-primary-600 dark:text-primary-400' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 dark:text-white'>
                        {activity.user} {activity.action} {activity.document}
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
