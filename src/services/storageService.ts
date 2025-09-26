import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  updateMetadata,
  UploadResult,
  StorageReference,
} from 'firebase/storage';
import { storage } from './firebase';
import { Document } from '../types';

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  downloadURL?: string;
}

export interface StorageFile {
  name: string;
  fullPath: string;
  downloadURL: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
}

class StorageService {
  private isStorageAvailable(): boolean {
    return storage !== null;
  }

  private getStorageError(): Error {
    return new Error(
      'Firebase Storage is not available. Please enable it in the Firebase Console.'
    );
  }

  /**
   * Upload a file to user's storage folder
   */
  async uploadFile(
    file: File,
    userId: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    if (!this.isStorageAvailable()) {
      throw this.getStorageError();
    }

    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `users/${userId}/documents/${fileName}`);

    try {
      const result = await uploadBytes(storageRef, file);

      if (onProgress) {
        onProgress(100);
      }

      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * Get download URL for a file
   */
  async getDownloadURL(filePath: string): Promise<string> {
    if (!this.isStorageAvailable()) {
      throw this.getStorageError();
    }

    const storageRef = ref(storage, filePath);
    return await getDownloadURL(storageRef);
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(filePath: string): Promise<void> {
    if (!this.isStorageAvailable()) {
      throw this.getStorageError();
    }

    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
  }

  /**
   * List all files in user's documents folder
   */
  async listUserFiles(userId: string): Promise<StorageFile[]> {
    if (!this.isStorageAvailable()) {
      throw this.getStorageError();
    }

    const userRef = ref(storage, `users/${userId}/documents`);
    const result = await listAll(userRef);

    const files: StorageFile[] = [];

    for (const itemRef of result.items) {
      try {
        const [downloadURL, metadata] = await Promise.all([
          getDownloadURL(itemRef),
          getMetadata(itemRef),
        ]);

        files.push({
          name: metadata.name,
          fullPath: itemRef.fullPath,
          downloadURL,
          size: metadata.size,
          contentType: metadata.contentType || 'application/octet-stream',
          timeCreated: metadata.timeCreated,
          updated: metadata.updated,
        });
      } catch (error) {
        console.error(`Error getting metadata for ${itemRef.name}:`, error);
      }
    }

    return files;
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(filePath: string) {
    if (!this.isStorageAvailable()) {
      throw this.getStorageError();
    }

    const storageRef = ref(storage, filePath);
    return await getMetadata(storageRef);
  }

  /**
   * Update file metadata
   */
  async updateFileMetadata(filePath: string, metadata: any) {
    if (!this.isStorageAvailable()) {
      throw this.getStorageError();
    }

    const storageRef = ref(storage, filePath);
    return await updateMetadata(storageRef, metadata);
  }

  /**
   * Upload multiple files with progress tracking
   */
  async uploadMultipleFiles(
    files: File[],
    userId: string,
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (onProgress) {
        onProgress(i, 0);
      }

      try {
        const result = await this.uploadFile(file, userId, progress => {
          if (onProgress) {
            onProgress(i, progress);
          }
        });

        results.push(result);

        if (onProgress) {
          onProgress(i, 100);
        }
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Create a document record from uploaded file
   */
  async createDocumentFromFile(
    file: File,
    uploadResult: UploadResult,
    userId: string,
    additionalData?: Partial<Document>
  ): Promise<Document> {
    const downloadURL = await this.getDownloadURL(uploadResult.ref.fullPath);

    const document: Document = {
      name: file.name,
      url: downloadURL,
      type: file.type,
      size: file.size,
      uploadedAt: new Date(),
      category: additionalData?.category || 'other',
      tags: additionalData?.tags || [],
      language: additionalData?.language || 'en',
      processingStatus: 'pending',
      privacyLevel: additionalData?.privacyLevel || 'private',
      ...additionalData,
    };

    return document;
  }

  /**
   * Check if storage is available
   */
  isAvailable(): boolean {
    return this.isStorageAvailable();
  }

  /**
   * Get storage usage for a user
   */
  async getUserStorageUsage(userId: string): Promise<number> {
    if (!this.isStorageAvailable()) {
      return 0;
    }

    try {
      const files = await this.listUserFiles(userId);
      return files.reduce((total, file) => total + file.size, 0);
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return 0;
    }
  }
}

export const storageService = new StorageService();
export default storageService;
