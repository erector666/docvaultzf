// App Configuration
export const APP_CONFIG = {
  name: 'DocVault',
  version: '1.0.0',
  description: 'AI-powered document management platform',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFileTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
  supportedLanguages: ['en', 'mk', 'fr'] as const,
  defaultLanguage: 'en' as const,
  defaultTheme: 'system' as const,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  processDocumentIntegratedAI: 'processDocumentIntegratedAI',
  processDocumentEnhanced: 'processDocumentEnhanced',
  classifyDocument: 'classifyDocument',
  extractTextFromDocument: 'extractTextFromDocument',
  detectLanguage: 'detectLanguage',
  chatbotHttp: 'chatbotHttp',
  generateDocumentSummary: 'generateDocumentSummary',
  reprocessDocument: 'reprocessDocument',
} as const;

// Document Categories
export const DOCUMENT_CATEGORIES = [
  'business',
  'legal',
  'academic',
  'personal',
  'financial',
  'medical',
  'technical',
  'creative',
  'other',
] as const;

// File Type Icons
export const FILE_TYPE_ICONS = {
  'application/pdf': 'FileText',
  'application/msword': 'FileText',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'FileText',
  'text/plain': 'FileText',
  'image/jpeg': 'Image',
  'image/png': 'Image',
  'image/gif': 'Image',
  'image/webp': 'Image',
  default: 'File',
} as const;

// Processing Status
export const PROCESSING_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// Privacy Levels
export const PRIVACY_LEVELS = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  RESTRICTED: 'restricted',
} as const;

// Theme Colors
export const THEME_COLORS = {
  light: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
  },
  dark: {
    primary: '#60a5fa',
    secondary: '#94a3b8',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
  },
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  theme: 'appvault_theme',
  language: 'appvault_language',
  userPreferences: 'appvault_user_preferences',
  recentDocuments: 'appvault_recent_documents',
  searchHistory: 'appvault_search_history',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  upload: 'Failed to upload file. Please try again.',
  processing: 'Document processing failed. Please try again.',
  generic: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  upload: 'File uploaded successfully!',
  processing: 'Document processed successfully!',
  save: 'Changes saved successfully!',
  delete: 'Item deleted successfully!',
  login: 'Welcome back!',
  register: 'Account created successfully!',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  fileName: {
    maxLength: 255,
    allowedChars: /^[a-zA-Z0-9._-]+$/,
  },
} as const;

// Pagination
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

// Search Configuration
export const SEARCH_CONFIG = {
  debounceDelay: 300,
  minQueryLength: 2,
  maxResults: 100,
  highlightClass: 'search-highlight',
} as const;
