import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { User, LoginForm, RegisterForm } from '../types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser({
              ...userData,
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || userData.displayName,
              photoURL: firebaseUser.photoURL || userData.photoURL,
            });
          } else {
            // Create new user document
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              bio: '',
              company: '',
              website: '',
              preferences: {
                language: 'en',
                theme: 'system',
                notifications: true,
                autoCategorization: true,
                emailUpdates: true,
                securityAlerts: true,
              },
              createdAt: new Date(),
              lastLoginAt: new Date(),
              storageUsed: 0,
              documentCount: 0,
            };

            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);

          // Handle specific Firestore errors
          if (error instanceof Error) {
            if (error.message.includes('permission-denied')) {
              console.error(
                'Firestore permission denied - user may not have access'
              );
            } else if (error.message.includes('unavailable')) {
              console.error(
                'Firestore service unavailable - network or service issue'
              );
            } else if (error.message.includes('unauthenticated')) {
              console.error('User not authenticated for Firestore access');
            }
          }

          // Set user to null but don't break the auth flow
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (credentials: LoginForm) => {
    try {
      // Login attempt in progress
      const result = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      // Login successful
    } catch (error: any) {
      console.error('Login error:', error);
      // Provide more specific error messages
      let errorMessage = 'Login failed';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      } else if (error.message) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  };

  const register = async (userData: RegisterForm) => {
    try {
      // Registration attempt in progress
      const { user: newUser } = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      // Registration successful

      if (userData.displayName) {
        await updateProfile(newUser, {
          displayName: userData.displayName,
        });
        // Profile updated with display name
      }

      // User document will be created in the auth state change listener
    } catch (error: any) {
      console.error('Registration error:', error);
      // Provide more specific error messages
      let errorMessage = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.message) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Google sign-in attempt in progress
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');

      const result = await signInWithPopup(auth, provider);
      // Google sign-in successful
      // User document will be created in the auth state change listener
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      // Provide more specific error messages
      let errorMessage = 'Google sign-in failed';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage =
          'Popup was blocked by browser. Please allow popups and try again';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in was cancelled';
      } else if (error.message) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed');
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...updates,
        lastLoginAt: new Date(),
      });

      setUser(prev => (prev ? { ...prev, ...updates } : null));
    } catch (error: any) {
      console.error('Error updating user profile:', error);

      // Handle specific Firestore errors
      if (error.code === 'permission-denied') {
        throw new Error('You do not have permission to update this profile');
      } else if (error.code === 'unavailable') {
        throw new Error(
          'Service temporarily unavailable. Please try again later.'
        );
      } else if (error.code === 'unauthenticated') {
        throw new Error('Please log in again to update your profile');
      }

      throw new Error(error.message || 'Profile update failed');
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
