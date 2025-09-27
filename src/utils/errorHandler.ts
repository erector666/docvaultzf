/**
 * Global error handling utilities
 */

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class ErrorHandler {
  /**
   * Handle Firebase Auth errors
   */
  static handleAuthError(error: any): AppError {
    const authErrorMap: Record<string, AppError> = {
      'auth/user-not-found': {
        code: 'auth/user-not-found',
        message: 'No user found with this email address',
        userMessage: 'No account found with this email address. Please check your email or create a new account.',
        severity: 'medium'
      },
      'auth/wrong-password': {
        code: 'auth/wrong-password',
        message: 'Incorrect password',
        userMessage: 'The password you entered is incorrect. Please try again.',
        severity: 'medium'
      },
      'auth/email-already-in-use': {
        code: 'auth/email-already-in-use',
        message: 'Email address is already in use',
        userMessage: 'An account with this email address already exists. Please use a different email or try logging in.',
        severity: 'medium'
      },
      'auth/weak-password': {
        code: 'auth/weak-password',
        message: 'Password is too weak',
        userMessage: 'Please choose a stronger password with at least 6 characters.',
        severity: 'low'
      },
      'auth/requires-recent-login': {
        code: 'auth/requires-recent-login',
        message: 'Recent login required',
        userMessage: 'For security reasons, please log out and log back in before performing this action.',
        severity: 'medium'
      },
      'auth/too-many-requests': {
        code: 'auth/too-many-requests',
        message: 'Too many failed attempts',
        userMessage: 'Too many failed attempts. Please try again later.',
        severity: 'high'
      },
      'auth/network-request-failed': {
        code: 'auth/network-request-failed',
        message: 'Network error',
        userMessage: 'Network connection error. Please check your internet connection and try again.',
        severity: 'high'
      }
    };

    return authErrorMap[error.code] || {
      code: error.code || 'unknown',
      message: error.message || 'An unknown error occurred',
      userMessage: 'An unexpected error occurred. Please try again.',
      severity: 'medium'
    };
  }

  /**
   * Handle Firestore errors
   */
  static handleFirestoreError(error: any): AppError {
    const firestoreErrorMap: Record<string, AppError> = {
      'permission-denied': {
        code: 'permission-denied',
        message: 'Permission denied',
        userMessage: 'You do not have permission to perform this action.',
        severity: 'high'
      },
      'unavailable': {
        code: 'unavailable',
        message: 'Service unavailable',
        userMessage: 'Service temporarily unavailable. Please try again later.',
        severity: 'high'
      },
      'unauthenticated': {
        code: 'unauthenticated',
        message: 'User not authenticated',
        userMessage: 'Please log in to continue.',
        severity: 'medium'
      },
      'quota-exceeded': {
        code: 'quota-exceeded',
        message: 'Quota exceeded',
        userMessage: 'Storage quota exceeded. Please contact support or upgrade your plan.',
        severity: 'high'
      },
      'not-found': {
        code: 'not-found',
        message: 'Document not found',
        userMessage: 'The requested document could not be found.',
        severity: 'medium'
      }
    };

    return firestoreErrorMap[error.code] || {
      code: error.code || 'unknown',
      message: error.message || 'An unknown error occurred',
      userMessage: 'An unexpected error occurred. Please try again.',
      severity: 'medium'
    };
  }

  /**
   * Handle Firebase Storage errors
   */
  static handleStorageError(error: any): AppError {
    const storageErrorMap: Record<string, AppError> = {
      'storage/unauthorized': {
        code: 'storage/unauthorized',
        message: 'Unauthorized access',
        userMessage: 'You do not have permission to access this file.',
        severity: 'high'
      },
      'storage/object-not-found': {
        code: 'storage/object-not-found',
        message: 'File not found',
        userMessage: 'The requested file could not be found.',
        severity: 'medium'
      },
      'storage/quota-exceeded': {
        code: 'storage/quota-exceeded',
        message: 'Storage quota exceeded',
        userMessage: 'Storage quota exceeded. Please delete some files or upgrade your plan.',
        severity: 'high'
      },
      'storage/canceled': {
        code: 'storage/canceled',
        message: 'Upload canceled',
        userMessage: 'File upload was canceled.',
        severity: 'low'
      }
    };

    return storageErrorMap[error.code] || {
      code: error.code || 'unknown',
      message: error.message || 'An unknown error occurred',
      userMessage: 'An unexpected error occurred. Please try again.',
      severity: 'medium'
    };
  }

  /**
   * Handle network errors
   */
  static handleNetworkError(error: any): AppError {
    if (error.name === 'NetworkError' || error.message?.includes('network')) {
      return {
        code: 'network-error',
        message: 'Network connection failed',
        userMessage: 'Network connection error. Please check your internet connection and try again.',
        severity: 'high'
      };
    }

    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      return {
        code: 'timeout-error',
        message: 'Request timeout',
        userMessage: 'The request took too long to complete. Please try again.',
        severity: 'medium'
      };
    }

    return {
      code: 'unknown-error',
      message: error.message || 'An unknown error occurred',
      userMessage: 'An unexpected error occurred. Please try again.',
      severity: 'medium'
    };
  }

  /**
   * Generic error handler
   */
  static handleError(error: any, context?: string): AppError {
    console.error(`Error in ${context || 'unknown context'}:`, error);

    // Firebase Auth errors
    if (error.code?.startsWith('auth/')) {
      return this.handleAuthError(error);
    }

    // Firestore errors
    if (error.code?.startsWith('permission-denied') || 
        error.code?.startsWith('unavailable') ||
        error.code?.startsWith('unauthenticated') ||
        error.code?.startsWith('quota-exceeded') ||
        error.code?.startsWith('not-found')) {
      return this.handleFirestoreError(error);
    }

    // Storage errors
    if (error.code?.startsWith('storage/')) {
      return this.handleStorageError(error);
    }

    // Network errors
    if (error.name === 'NetworkError' || 
        error.name === 'TimeoutError' ||
        error.message?.includes('network') ||
        error.message?.includes('timeout')) {
      return this.handleNetworkError(error);
    }

    // Generic error
    return {
      code: 'unknown',
      message: error.message || 'An unknown error occurred',
      userMessage: 'An unexpected error occurred. Please try again.',
      severity: 'medium'
    };
  }

  /**
   * Show error notification to user
   */
  static showError(error: AppError): void {
    // For now, use alert. In a real app, you might use a toast notification system
    alert(`Error: ${error.userMessage}`);
  }

  /**
   * Log error for debugging
   */
  static logError(error: AppError, context?: string): void {
    console.error(`[${error.severity.toUpperCase()}] ${context || 'Error'}:`, {
      code: error.code,
      message: error.message,
      userMessage: error.userMessage,
      severity: error.severity,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Convenience function for handling errors with user feedback
 */
export const handleErrorWithFeedback = (error: any, context?: string): void => {
  const appError = ErrorHandler.handleError(error, context);
  ErrorHandler.logError(appError, context);
  ErrorHandler.showError(appError);
};
