import { useState, useCallback } from 'react';
import { storageService, UploadProgress } from '../services/storageService';
import { useAuth } from '../context/AuthContext';

export const useStorage = () => {
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File, onProgress?: (progress: number) => void) => {
      if (!user) {
        throw new Error('User must be authenticated to upload files');
      }

      if (!storageService.isAvailable()) {
        throw new Error(
          'Storage service is not available. Please enable Firebase Storage.'
        );
      }

      setIsUploading(true);

      try {
        const result = await storageService.uploadFile(
          file,
          user.uid,
          onProgress
        );
        const downloadURL = await storageService.getDownloadURL(
          result.ref.fullPath
        );

        return {
          ...result,
          downloadURL,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        };
      } finally {
        setIsUploading(false);
      }
    },
    [user]
  );

  const uploadMultipleFiles = useCallback(
    async (
      files: File[],
      onProgress?: (fileIndex: number, progress: number) => void
    ) => {
      if (!user) {
        throw new Error('User must be authenticated to upload files');
      }

      if (!storageService.isAvailable()) {
        throw new Error(
          'Storage service is not available. Please enable Firebase Storage.'
        );
      }

      setIsUploading(true);

      try {
        const results = await storageService.uploadMultipleFiles(
          files,
          user.uid,
          onProgress
        );

        const filesWithURLs = await Promise.all(
          results.map(async (result, index) => {
            const downloadURL = await storageService.getDownloadURL(
              result.ref.fullPath
            );
            return {
              ...result,
              downloadURL,
              fileName: files[index].name,
              fileSize: files[index].size,
              fileType: files[index].type,
            };
          })
        );

        return filesWithURLs;
      } finally {
        setIsUploading(false);
      }
    },
    [user]
  );

  const deleteFile = useCallback(
    async (filePath: string) => {
      if (!user) {
        throw new Error('User must be authenticated to delete files');
      }

      await storageService.deleteFile(filePath);
    },
    [user]
  );

  const getUserFiles = useCallback(async () => {
    if (!user) {
      throw new Error('User must be authenticated to list files');
    }

    return await storageService.listUserFiles(user.uid);
  }, [user]);

  const getStorageUsage = useCallback(async () => {
    if (!user) {
      return 0;
    }

    return await storageService.getUserStorageUsage(user.uid);
  }, [user]);

  return {
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    getUserFiles,
    getStorageUsage,
    isUploading,
    uploadProgress,
    isStorageAvailable: storageService.isAvailable(),
  };
};
