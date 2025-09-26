import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase environment variables are now configured in .env file

// Debug environment variables
console.log('Environment variables check:');
console.log('API Key:', process.env.REACT_APP_FIREBASE_API_KEY ? 'Present' : 'Missing');
console.log('Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'Present' : 'Missing');
console.log('Auth Domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'Present' : 'Missing');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
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
