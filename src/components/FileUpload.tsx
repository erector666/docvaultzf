import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';

interface FileUploadProps {
  onUploadComplete?: (files: any[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  maxFiles = 5,
  acceptedTypes = ['application/pdf', 'image/*', 'text/*'],
  maxSize = 10 * 1024 * 1024, // 10MB
}) => {
  const { uploadMultipleFiles, isUploading, isStorageAvailable } = useStorage();
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(Array.from(e.target.files));
      }
    },
    []
  );

  const validateFiles = (files: File[]): string | null => {
    if (files.length > maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    for (const file of files) {
      if (file.size > maxSize) {
        return `File ${file.name} is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`;
      }

      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isValidType) {
        return `File type ${file.type} is not supported`;
      }
    }

    return null;
  };

  const handleFiles = async (files: File[]) => {
    setError('');

    const validationError = validateFiles(files);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!isStorageAvailable) {
      setError(
        'Storage service is not available. Please enable Firebase Storage.'
      );
      return;
    }

    try {
      const results = await uploadMultipleFiles(
        files,
        (fileIndex, progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [files[fileIndex].name]: progress,
          }));
        }
      );

      setUploadedFiles(prev => [...prev, ...results]);
      onUploadComplete?.(results);

      // Clear progress after upload
      setTimeout(() => {
        setUploadProgress({});
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    }
  };

  if (!isStorageAvailable) {
    return (
      <div className='p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center'>
        <AlertCircle className='w-12 h-12 text-yellow-500 mx-auto mb-4' />
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
          Storage Not Available
        </h3>
        <p className='text-gray-600 dark:text-gray-400'>
          Firebase Storage needs to be enabled in the console.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type='file'
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
          disabled={isUploading}
        />

        <div className='text-center'>
          <Upload className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
            Upload Documents
          </h3>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            Drag and drop files here, or click to select
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-500'>
            Max {maxFiles} files, {Math.round(maxSize / 1024 / 1024)}MB each
          </p>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center'
        >
          <AlertCircle className='w-5 h-5 text-red-500 mr-3' />
          <span className='text-red-700 dark:text-red-400'>{error}</span>
        </motion.div>
      )}

      {Object.keys(uploadProgress).length > 0 && (
        <div className='space-y-2'>
          <h4 className='font-medium text-gray-900 dark:text-white'>
            Uploading...
          </h4>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className='space-y-1'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600 dark:text-gray-400'>
                  {fileName}
                </span>
                <span className='text-gray-600 dark:text-gray-400'>
                  {progress}%
                </span>
              </div>
              <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                <motion.div
                  className='bg-primary-600 h-2 rounded-full'
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className='space-y-2'>
          <h4 className='font-medium text-gray-900 dark:text-white'>
            Uploaded Files
          </h4>
          <div className='space-y-2'>
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className='flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'
              >
                <div className='flex items-center'>
                  <File className='w-5 h-5 text-green-600 mr-3' />
                  <div>
                    <p className='font-medium text-green-900 dark:text-green-100'>
                      {file.fileName}
                    </p>
                    <p className='text-sm text-green-700 dark:text-green-300'>
                      {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <CheckCircle className='w-5 h-5 text-green-600' />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
