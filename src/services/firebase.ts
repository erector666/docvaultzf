import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase environment variables are now configured in .env file

// Clean environment variables to remove any hidden characters
const cleanProjectId =
  process.env.REACT_APP_FIREBASE_PROJECT_ID?.trim().replace(/[\r\n]/g, '');
const cleanApiKey = process.env.REACT_APP_FIREBASE_API_KEY?.trim().replace(
  /[\r\n]/g,
  ''
);
const cleanAuthDomain =
  process.env.REACT_APP_FIREBASE_AUTH_DOMAIN?.trim().replace(/[\r\n]/g, '');
const cleanStorageBucket =
  process.env.REACT_APP_FIREBASE_STORAGE_BUCKET?.trim().replace(/[\r\n]/g, '');
const cleanMessagingSenderId =
  process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID?.trim().replace(
    /[\r\n]/g,
    ''
  );
const cleanAppId = process.env.REACT_APP_FIREBASE_APP_ID?.trim().replace(
  /[\r\n]/g,
  ''
);

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
  throw new Error('Firebase configuration is incomplete. Please check your .env file.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);


// Configure Firestore to prevent connection issues
// Force online mode to prevent "client is offline" errors
enableNetwork(db).catch(error => {
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
