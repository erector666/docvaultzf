// Document Model
export interface Document {
  id?: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  category?: string;
  tags?: string[];
  language?: string;
  confidence?: number;
  summary?: string;
  entities?: Array<{
    name: string;
    type: string;
    confidence: number;
  }>;
  extractedText?: string;
  processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  aiModel?: string;
  processingTime?: number;
  qualityScore?: number;
  viewCount?: number;
  lastAccessed?: Date;
  isEncrypted?: boolean;
  privacyLevel?: 'public' | 'private' | 'restricted';
  collaborators?: string[];
  version?: number;
  parentDocumentId?: string;
}

// User Model
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  company?: string;
  website?: string;
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    autoCategorization: boolean;
    emailUpdates: boolean;
    securityAlerts: boolean;
  };
  createdAt: Date;
  lastLoginAt: Date;
  storageUsed: number;
  documentCount: number;
}

// Classification Result Model
export interface ClassificationResult {
  category: string;
  confidence: number;
  tags: string[];
  summary: string;
  language: string;
  documentType: string;
  wordCount: number;
  extractedDates?: string[];
  suggestedName?: string;
  classificationDetails: {
    categories: Array<{
      name: string;
      confidence: number;
    }>;
    entities: Array<{
      name: string;
      type: string;
      salience: number;
      metadata?: Record<string, any>;
    }>;
    sentiment: {
      score: number;
      magnitude: number;
      sentences: Array<{
        text: string;
        score: number;
        magnitude: number;
      }>;
    };
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Upload Progress
export interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

// Search Filters
export interface SearchFilters {
  category?: string;
  language?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  fileType?: string;
  minConfidence?: number;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Language Types
export type SupportedLanguage = 'en' | 'mk' | 'fr';

// Component Props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  displayName?: string;
}

export interface DocumentUploadForm {
  files: File[];
  category?: string;
  tags?: string[];
  privacyLevel?: 'public' | 'private' | 'restricted';
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  badge?: string | number;
  children?: NavItem[];
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  documentContext?: string[];
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  progress?: number;
}
