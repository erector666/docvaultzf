import { storage, db } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';

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
      const storageRef = ref(storage, `${this.STORAGE_PATH}/${userId}/${Date.now()}_${file.name}`);
      
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

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), documentData);
      onProgress?.({ progress: 100, status: 'completed' });

      return {
        id: docRef.id,
        ...documentData,
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      
      // Handle specific Firestore errors
      let errorMessage = 'Upload failed';
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          errorMessage = 'You do not have permission to upload documents';
        } else if (error.message.includes('unavailable')) {
          errorMessage = 'Service temporarily unavailable. Please try again later.';
        } else if (error.message.includes('unauthenticated')) {
          errorMessage = 'Please log in to upload documents';
        } else if (error.message.includes('quota-exceeded')) {
          errorMessage = 'Storage quota exceeded. Please contact support.';
        } else {
          errorMessage = error.message;
        }
      }
      
      onProgress?.({ 
        progress: 0, 
        status: 'error', 
        error: errorMessage
      });
      throw new Error(errorMessage);
    }
  }

  async getDocuments(userId: string, category?: string): Promise<Document[]> {
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
      console.error('Error fetching documents:', error);
      
      // Handle specific Firestore errors
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          throw new Error('You do not have permission to access documents');
        } else if (error.message.includes('unavailable')) {
          throw new Error('Service temporarily unavailable. Please try again later.');
        } else if (error.message.includes('unauthenticated')) {
          throw new Error('Please log in to view documents');
        }
      }
      
      throw error;
    }
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
      
      // Handle specific Firestore errors
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          throw new Error('You do not have permission to delete this document');
        } else if (error.message.includes('unavailable')) {
          throw new Error('Service temporarily unavailable. Please try again later.');
        } else if (error.message.includes('unauthenticated')) {
          throw new Error('Please log in to delete documents');
        }
      }
      
      throw error;
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
      
      // Handle specific Firestore errors
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          throw new Error('You do not have permission to update this document');
        } else if (error.message.includes('unavailable')) {
          throw new Error('Service temporarily unavailable. Please try again later.');
        } else if (error.message.includes('unauthenticated')) {
          throw new Error('Please log in to update documents');
        }
      }
      
      throw error;
    }
  }

  async searchDocuments(userId: string, searchQuery: string): Promise<Document[]> {
    try {
      const documents = await this.getDocuments(userId);
      
      return documents.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching documents:', error);
      
      // Handle specific Firestore errors
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          throw new Error('You do not have permission to search documents');
        } else if (error.message.includes('unavailable')) {
          throw new Error('Service temporarily unavailable. Please try again later.');
        } else if (error.message.includes('unauthenticated')) {
          throw new Error('Please log in to search documents');
        }
      }
      
      throw error;
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
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (file.size > maxSize) {
      throw new Error('File size exceeds 50MB limit');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported');
    }
  }

  private getFileType(filename: string): string {
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
