import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { validateEnvironment, getSanitizedConfig } from '../utils/envValidation';

// Validate environment variables before initializing Firebase
const envValidation = validateEnvironment();
if (!envValidation.isValid) {
  throw new Error(`Firebase configuration error: ${envValidation.errors.join(', ')}`);
}

// Get sanitized environment configuration
const config = getSanitizedConfig();

// Additional aggressive sanitization for Firebase config
const sanitizeFirebaseValue = (value: string | undefined): string | undefined => {
  if (!value) return value;
  // Remove all control characters, whitespace, and normalize the string
  return value.trim().replace(/[\r\n\t\f\v\0]/g, '').replace(/\s+/g, '');
};

// Manual cleaning for project ID specifically
const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID?.trim().replace(/[\r\n]/g, '') || '';

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
