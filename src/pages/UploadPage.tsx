import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Cloud,
  ArrowLeft,
  Plus,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  Trash2,
  Eye,
} from 'lucide-react';
// Removed unused context imports
// Removed unused Document import

interface UploadedFile extends File {
  id: string;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  documentId?: string;
}

export const UploadPage: React.FC = () => {
  // Removed unused context hooks
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const acceptedFileTypes = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
    'application/pdf': ['.pdf'],
    'text/*': ['.txt', '.md', '.csv', '.json', '.xml'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
      '.docx',
    ],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
      '.xlsx',
    ],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      ['.pptx'],
    'application/zip': ['.zip'],
    'application/x-rar-compressed': ['.rar'],
    'application/x-7z-compressed': ['.7z'],
  };

  const getFileIcon = (file: File) => {
    const type = file.type || '';
    if (type.startsWith('image/')) return FileImage;
    if (type === 'application/pdf') return FileText; // Using FileText for PDF since FilePdf doesn't exist
    if (type.startsWith('video/')) return FileVideo;
    if (type.startsWith('audio/')) return FileAudio;
    if (type.includes('zip') || type.includes('rar') || type.includes('7z'))
      return Archive;
    if (type.startsWith('text/')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateFileId = () => Math.random().toString(36).substr(2, 9);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      ...file,
      id: generateFileId(),
      progress: 0,
      status: 'pending' as const,
      size: file.size, // Explicitly set size to ensure it's preserved
      type: file.type, // Explicitly set type to ensure it's preserved
      preview: (file.type || '').startsWith('image/')
        ? URL.createObjectURL(file)
        : undefined,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [handleFiles]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFiles(files);
    },
    [handleFiles]
  );

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  const uploadFile = useCallback(async (file: UploadedFile) => {
    try {
      // Update status to uploading
      setUploadedFiles(prev =>
        prev.map(f => (f.id === file.id ? { ...f, status: 'uploading' as const } : f))
      );

      // Import Firebase services
      const { storage } = await import('../services/firebase');
      const { documentService } = await import('../services/documentService');
      
      if (!storage) {
        throw new Error('Firebase Storage not available');
      }

      // Get current user
      const { auth } = await import('../services/firebase');
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Upload to Firebase Storage and save to Firestore
      const result = await documentService.uploadDocument(
        file,
        currentUser.uid,
        'Uncategorized', // Default category
        [], // No tags initially
        (progress) => {
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === file.id
                ? {
                    ...f,
                    progress: progress.progress,
                    status: progress.status as 'uploading' | 'completed' | 'error',
                    error: progress.error,
                  }
                : f
            )
          );
        }
      );

      // Update file with document ID
      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === file.id
            ? { ...f, documentId: result.id, status: 'completed' as const, progress: 100 }
            : f
        )
      );

      console.log('File uploaded successfully:', result);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === file.id
            ? {
                ...f,
                status: 'error' as const,
                error: error instanceof Error ? error.message : 'Upload failed',
              }
            : f
        )
      );
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload files to Firebase Storage and Firestore
      const pendingFiles = uploadedFiles.filter(f => f.status === 'pending');

      for (let i = 0; i < pendingFiles.length; i++) {
        await uploadFile(pendingFiles[i]);
        setUploadProgress(((i + 1) / pendingFiles.length) * 100);
      }

      // Show success message
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        // Navigate back to dashboard after successful upload
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [uploadedFiles, navigate, uploadFile]);

  const clearAllFiles = useCallback(() => {
    uploadedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setUploadedFiles([]);
  }, [uploadedFiles]);

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

      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10'>
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
                  Upload Documents
                </h1>
                <p className='text-lg text-gray-600 dark:text-gray-300'>
                  Add new documents to your AI-powered vault
                </p>
              </div>
            </div>
            {uploadedFiles.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllFiles}
                className='flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-xl border border-red-200 dark:border-red-800/20 transition-all duration-200 text-red-700 dark:text-red-300'
              >
                <Trash2 className='w-4 h-4' />
                <span className='font-medium'>Clear All</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Upload Area */}
          <div className='lg:col-span-2'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='mb-8'
            >
              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative p-12 border-2 border-dashed rounded-2xl transition-all duration-300 ${
                  isDragOver
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-800/60'
                } backdrop-blur-sm`}
              >
                <div className='text-center'>
                  <motion.div
                    animate={{
                      scale: isDragOver ? 1.1 : 1,
                      rotate: isDragOver ? 5 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className='inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6'
                  >
                    <Cloud className='w-10 h-10 text-primary-600 dark:text-primary-400' />
                  </motion.div>

                  <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                    {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300 mb-6'>
                    or click to browse your computer
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className='inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg'
                  >
                    <Plus className='w-5 h-5' />
                    <span>Choose Files</span>
                  </motion.button>

                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    accept={Object.keys(acceptedFileTypes).join(',')}
                    onChange={handleFileSelect}
                    className='hidden'
                  />
                </div>
              </div>

              {/* Supported File Types */}
              <div className='mt-6 p-4 bg-white/40 dark:bg-gray-800/40 rounded-xl border border-white/20 dark:border-gray-700/20'>
                <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>
                  Supported file types:
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {Object.entries(acceptedFileTypes).map(
                    ([type, extensions]) => (
                      <span
                        key={type}
                        className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium'
                      >
                        {extensions.join(', ')}
                      </span>
                    )
                  )}
                </div>
              </div>
            </motion.div>

            {/* File List */}
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className='space-y-4'
              >
                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                  Files to Upload ({uploadedFiles.length})
                </h3>

                <div className='space-y-3'>
                  {uploadedFiles.map(file => {
                    const FileIcon = getFileIcon(file);
                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className='flex items-center p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg'
                      >
                        {/* File Preview/Icon */}
                        <div className='flex-shrink-0 mr-4'>
                          {file.preview ? (
                            <img
                              src={file.preview}
                              alt={file.name}
                              className='w-12 h-12 object-cover rounded-lg'
                            />
                          ) : (
                            <div className='w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center'>
                              <FileIcon className='w-6 h-6 text-gray-600 dark:text-gray-400' />
                            </div>
                          )}
                        </div>

                        {/* File Info */}
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                            {file.name}
                          </p>
                          <p className='text-xs text-gray-500 dark:text-gray-400'>
                            {formatFileSize(file.size)}
                          </p>

                          {/* Progress Bar */}
                          {file.status === 'uploading' && (
                            <div className='mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                              <motion.div
                                className='bg-primary-600 h-2 rounded-full'
                                initial={{ width: 0 }}
                                animate={{ width: `${file.progress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          )}

                          {/* Status */}
                          <div className='flex items-center mt-1'>
                            {file.status === 'completed' && (
                              <div className='flex items-center text-green-600 dark:text-green-400'>
                                <CheckCircle className='w-4 h-4 mr-1' />
                                <span className='text-xs font-medium'>
                                  Uploaded
                                </span>
                              </div>
                            )}
                            {file.status === 'error' && (
                              <div className='flex items-center text-red-600 dark:text-red-400'>
                                <AlertCircle className='w-4 h-4 mr-1' />
                                <span className='text-xs font-medium'>
                                  Error
                                </span>
                              </div>
                            )}
                            {file.status === 'pending' && (
                              <div className='flex items-center text-gray-500 dark:text-gray-400'>
                                <FileText className='w-4 h-4 mr-1' />
                                <span className='text-xs font-medium'>
                                  Ready
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className='flex items-center space-x-2'>
                          {file.status === 'completed' && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className='p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200'
                            >
                              <Eye className='w-4 h-4' />
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFile(file.id)}
                            className='p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200'
                          >
                            <X className='w-4 h-4' />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Upload Summary & Actions */}
          <div className='lg:col-span-1'>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className='sticky top-8'
            >
              <div className='p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-xl'>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                  Upload Summary
                </h3>

                <div className='space-y-4 mb-6'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      Files:
                    </span>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      {uploadedFiles.length}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      Total Size:
                    </span>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      {formatFileSize(
                        uploadedFiles.reduce((acc, file) => acc + file.size, 0)
                      )}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      Ready:
                    </span>
                    <span className='font-semibold text-green-600 dark:text-green-400'>
                      {uploadedFiles.filter(f => f.status === 'pending').length}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      Completed:
                    </span>
                    <span className='font-semibold text-blue-600 dark:text-blue-400'>
                      {
                        uploadedFiles.filter(f => f.status === 'completed')
                          .length
                      }
                    </span>
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className='mb-6'>
                    <div className='flex justify-between mb-2'>
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Uploading...
                      </span>
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        {Math.round(uploadProgress)}%
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                      <motion.div
                        className='bg-primary-600 h-2 rounded-full'
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <motion.button
                  whileHover={{ scale: uploadedFiles.length > 0 ? 1.02 : 1 }}
                  whileTap={{ scale: uploadedFiles.length > 0 ? 0.98 : 1 }}
                  onClick={handleUpload}
                  disabled={uploadedFiles.length === 0 || isUploading}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    uploadedFiles.length > 0 && !isUploading
                      ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isUploading ? (
                    <div className='flex items-center justify-center space-x-2'>
                      <svg
                        className='animate-spin h-5 w-5'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className='flex items-center justify-center space-x-2'>
                      <Upload className='w-5 h-5' />
                      <span>Upload {uploadedFiles.length} Files</span>
                    </div>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
