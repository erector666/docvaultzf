import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { validateEnvironment, getSanitizedConfig } from '../utils/envValidation';

// ULTRA-AGGRESSIVE SANITIZATION - Remove ALL control characters and whitespace
const ultraSanitize = (value: string | undefined): string => {
  if (!value) return '';
  // Remove ALL control characters, whitespace, and normalize
  return value.replace(/[\r\n\t\f\v\0\s]/g, '').trim();
};

// Get raw environment variables and sanitize them aggressively
const getCleanEnvVar = (key: string): string => {
  const rawValue = process.env[key] || '';
  return ultraSanitize(rawValue);
};

// Get ultra-clean environment configuration
const config = {
  REACT_APP_FIREBASE_API_KEY: getCleanEnvVar('REACT_APP_FIREBASE_API_KEY'),
  REACT_APP_FIREBASE_AUTH_DOMAIN: getCleanEnvVar('REACT_APP_FIREBASE_AUTH_DOMAIN'),
  REACT_APP_FIREBASE_PROJECT_ID: getCleanEnvVar('REACT_APP_FIREBASE_PROJECT_ID'),
  REACT_APP_FIREBASE_STORAGE_BUCKET: getCleanEnvVar('REACT_APP_FIREBASE_STORAGE_BUCKET'),
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: getCleanEnvVar('REACT_APP_FIREBASE_MESSAGING_SENDER_ID'),
  REACT_APP_FIREBASE_APP_ID: getCleanEnvVar('REACT_APP_FIREBASE_APP_ID'),
};

// Additional aggressive sanitization for Firebase config
const sanitizeFirebaseValue = (value: string): string => {
  // Remove all control characters, whitespace, and normalize the string
  return value.replace(/[\r\n\t\f\v\0\s]/g, '').trim();
};

// Manual cleaning for project ID specifically - ULTRA AGGRESSIVE
const projectId = sanitizeFirebaseValue(config.REACT_APP_FIREBASE_PROJECT_ID);

// Firebase configuration using validated environment variables
const firebaseConfig = {
  apiKey: sanitizeFirebaseValue(config.REACT_APP_FIREBASE_API_KEY),
  authDomain: sanitizeFirebaseValue(config.REACT_APP_FIREBASE_AUTH_DOMAIN),
  projectId: projectId, // Use manually cleaned project ID
  storageBucket: sanitizeFirebaseValue(config.REACT_APP_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: sanitizeFirebaseValue(config.REACT_APP_FIREBASE_MESSAGING_SENDER_ID),
  appId: sanitizeFirebaseValue(config.REACT_APP_FIREBASE_APP_ID),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

// Initialize Firestore with optimized settings to prevent connection issues
let db: Firestore;
try {
  db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    ignoreUndefinedProperties: true,
  });
} catch (error) {
  // If initializeFirestore fails, fall back to getFirestore
  console.warn('Failed to initialize Firestore with custom settings, using default:', error);
  db = getFirestore(app);
}

export { db };

// Initialize Storage with error handling
let storage: any = null;
try {
  storage = getStorage(app);
} catch (error) {
  console.warn('Firebase Storage not available:', error);
}

export { storage };

// Initialize Functions
export const functions = getFunctions(app);

export default app;
