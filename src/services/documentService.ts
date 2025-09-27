import { storage, db } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore';
import { ErrorHandler } from '../utils/errorHandler';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  category: string;
  tags: string[];
  isStarred: boolean;
  thumbnail?: string;
  downloadURL?: string;
  userId: string;
}

export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

class DocumentService {
  private readonly COLLECTION_NAME = 'documents';
  private readonly STORAGE_PATH = 'documents';

  async uploadDocument(
    file: File,
    userId: string,
    category: string = 'Uncategorized',
    tags: string[] = [],
    onProgress?: (progress: UploadProgress) => void
  ): Promise<Document> {
    try {
      // Validate file
      this.validateFile(file);

      // Update progress
      onProgress?.({ progress: 0, status: 'uploading' });

      // Create storage reference
      const storageRef = ref(
        storage,
        `${this.STORAGE_PATH}/${userId}/${Date.now()}_${file.name}`
      );

      // Upload file
      const uploadTask = await uploadBytes(storageRef, file);
      onProgress?.({ progress: 50, status: 'uploading' });

      // Get download URL
      const downloadURL = await getDownloadURL(uploadTask.ref);
      onProgress?.({ progress: 75, status: 'processing' });

      // Create document record
      const documentData = {
        name: file.name,
        type: this.getFileType(file.name),
        size: file.size,
        uploadDate: new Date(),
        category,
        tags,
        isStarred: false,
        downloadURL,
        userId,
      };

      const docRef = await addDoc(
        collection(db, this.COLLECTION_NAME),
        documentData
      );
      onProgress?.({ progress: 100, status: 'completed' });

      return {
        id: docRef.id,
        ...documentData,
      };
    } catch (error) {
      console.error('Error uploading document:', error);

      // Use improved error handling
      const appError = ErrorHandler.handleError(error, 'document upload');

      onProgress?.({
        progress: 0,
        status: 'error',
        error: appError.userMessage,
      });
      throw new Error(appError.userMessage);
    }
  }

  async getDocuments(userId: string, category?: string): Promise<Document[]> {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        let q = query(
          collection(db, this.COLLECTION_NAME),
          where('userId', '==', userId),
          orderBy('uploadDate', 'desc')
        );

        if (category && category !== 'all') {
          q = query(q, where('category', '==', category));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          uploadDate: doc.data().uploadDate.toDate(),
        })) as Document[];
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed to fetch documents:`, error);
        
        // If this is a connection error and not the last attempt, try to reset the connection
        if (attempt < maxRetries && (error as any)?.code?.includes('unavailable') || (error as any)?.message?.includes('QUIC')) {
          try {
            await disableNetwork(db);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            await enableNetwork(db);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait another second
          } catch (resetError) {
            console.warn('Failed to reset Firestore connection:', resetError);
          }
        }
      }
    }

    // If all retries failed, throw the last error
    console.error('All retries failed to fetch documents:', lastError);
    const appError = ErrorHandler.handleError(lastError, 'fetch documents');
    throw new Error(appError.userMessage);
  }

  async deleteDocument(documentId: string, userId: string): Promise<void> {
    try {
      // Get document to find storage path
      const docRef = doc(db, this.COLLECTION_NAME, documentId);

      // Delete from Firestore
      await deleteDoc(docRef);

      // Note: In a real implementation, you'd also delete the file from Storage
      // This requires storing the storage path in the document
    } catch (error) {
      console.error('Error deleting document:', error);

      // Use improved error handling
      const appError = ErrorHandler.handleError(error, 'delete document');
      throw new Error(appError.userMessage);
    }
  }

  async updateDocument(
    documentId: string,
    updates: Partial<Pick<Document, 'name' | 'category' | 'tags' | 'isStarred'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, documentId);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating document:', error);

      // Use improved error handling
      const appError = ErrorHandler.handleError(error, 'update document');
      throw new Error(appError.userMessage);
    }
  }

  async searchDocuments(
    userId: string,
    searchQuery: string
  ): Promise<Document[]> {
    try {
      const documents = await this.getDocuments(userId);

      return documents.filter(
        doc =>
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.tags.some(tag =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          doc.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching documents:', error);

      // Use improved error handling
      const appError = ErrorHandler.handleError(error, 'search documents');
      throw new Error(appError.userMessage);
    }
  }

  private validateFile(file: File): void {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/markdown',
      'text/csv',
      'application/json',
      'application/xml',
      'text/xml',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
    ];

    if (file.size > maxSize) {
      throw new Error('File size exceeds 50MB limit');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `File type "${file.type}" not supported. Supported types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, MD, CSV, JSON, XML, images (JPEG, PNG, GIF, WebP, BMP), and archives (ZIP, RAR, 7Z)`
      );
    }
  }

  private getFileType(filename: string): string {
    if (!filename) return 'unknown';
    const extension = filename.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'doc':
      case 'docx':
        return 'docx';
      case 'xls':
      case 'xlsx':
        return 'xlsx';
      case 'txt':
      case 'md':
        return 'txt';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'image';
      default:
        return 'other';
    }
  }
}

export const documentService = new DocumentService();
