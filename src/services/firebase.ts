import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase environment variables are now configured in .env file

// Debug environment variables
console.log('Environment variables check:');
console.log('Raw API Key from env:', process.env.REACT_APP_FIREBASE_API_KEY);
console.log('API Key length:', process.env.REACT_APP_FIREBASE_API_KEY?.length);
console.log('API Key first 10 chars:', process.env.REACT_APP_FIREBASE_API_KEY?.substring(0, 10));
console.log('Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'Present' : 'Missing');
console.log('Auth Domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'Present' : 'Missing');

// Debug project ID for encoding issues
console.log('Project ID raw:', JSON.stringify(process.env.REACT_APP_FIREBASE_PROJECT_ID));
console.log('Project ID length:', process.env.REACT_APP_FIREBASE_PROJECT_ID?.length);
console.log('Project ID char codes:', process.env.REACT_APP_FIREBASE_PROJECT_ID?.split('').map(c => c.charCodeAt(0)));

// Clean environment variables to remove any hidden characters
const cleanProjectId = process.env.REACT_APP_FIREBASE_PROJECT_ID?.trim().replace(/[\r\n]/g, '');
const cleanApiKey = process.env.REACT_APP_FIREBASE_API_KEY?.trim().replace(/[\r\n]/g, '');
const cleanAuthDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN?.trim().replace(/[\r\n]/g, '');
const cleanStorageBucket = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET?.trim().replace(/[\r\n]/g, '');
const cleanMessagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID?.trim().replace(/[\r\n]/g, '');
const cleanAppId = process.env.REACT_APP_FIREBASE_APP_ID?.trim().replace(/[\r\n]/g, '');

// Firebase configuration
const firebaseConfig = {
  apiKey: cleanApiKey,
  authDomain: cleanAuthDomain,
  projectId: cleanProjectId,
  storageBucket: cleanStorageBucket,
  messagingSenderId: cleanMessagingSenderId,
  appId: cleanAppId,
};

// Verify Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Firebase configuration is missing. Please check your .env file.');
  console.error('Current config:', firebaseConfig);
  throw new Error('Firebase configuration is incomplete');
}

console.log(
  '✅ Firebase configured successfully for project:',
  firebaseConfig.projectId
);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Debug Firestore database configuration
console.log('Firestore database config:');
console.log('Database instance:', db);
console.log('App name:', app.name);
console.log('Project ID from app:', app.options.projectId);

// Configure Firestore to prevent connection issues
// Force online mode to prevent "client is offline" errors
enableNetwork(db).catch((error) => {
  console.warn('Could not enable Firestore network:', error);
});

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
