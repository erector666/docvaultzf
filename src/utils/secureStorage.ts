/**
 * Secure storage utilities with encryption and validation
 */

interface SecureStorageOptions {
  encrypt?: boolean;
  expiration?: number; // in milliseconds
  domain?: string;
}

class SecureStorageManager {
  private readonly ENCRYPTION_KEY = 'DocVault_Secure_Storage_v1';
  private readonly STORAGE_PREFIX = 'dv_secure_';

  /**
   * Simple encryption using base64 and character shifting
   * Note: This is basic obfuscation, not military-grade encryption
   * For production apps, consider using crypto-js or Web Crypto API
   */
  private encrypt(data: string): string {
    try {
      const encoded = btoa(unescape(encodeURIComponent(data)));
      let encrypted = '';
      for (let i = 0; i < encoded.length; i++) {
        encrypted += String.fromCharCode(encoded.charCodeAt(i) + 1);
      }
      return btoa(encrypted);
    } catch (error) {
      console.error('Encryption failed:', error);
      return data; // Return original data if encryption fails
    }
  }

  /**
   * Simple decryption
   */
  private decrypt(encryptedData: string): string {
    try {
      const decoded = atob(encryptedData);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(decoded.charCodeAt(i) - 1);
      }
      return decodeURIComponent(escape(atob(decrypted)));
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData; // Return original data if decryption fails
    }
  }

  /**
   * Validate data before storage
   */
  private validateData(data: any): boolean {
    if (data === null || data === undefined) {
      return false;
    }

    // Check for potentially dangerous content
    const dataStr = JSON.stringify(data);
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /expression\s*\(/i
    ];

    return !dangerousPatterns.some(pattern => pattern.test(dataStr));
  }

  /**
   * Store data securely
   */
  setItem(key: string, value: any, options: SecureStorageOptions = {}): boolean {
    try {
      if (!this.validateData(value)) {
        console.error('Invalid data provided for storage');
        return false;
      }

      const storageKey = `${this.STORAGE_PREFIX}${key}`;
      const dataToStore = {
        value: options.encrypt ? this.encrypt(JSON.stringify(value)) : value,
        timestamp: Date.now(),
        expiration: options.expiration,
        encrypted: options.encrypt || false
      };

      // Store in localStorage
      localStorage.setItem(storageKey, JSON.stringify(dataToStore));
      
      // Also store in sessionStorage as backup for critical data
      if (options.encrypt) {
        sessionStorage.setItem(storageKey, JSON.stringify(dataToStore));
      }

      return true;
    } catch (error) {
      console.error('Failed to store data securely:', error);
      return false;
    }
  }

  /**
   * Retrieve data securely
   */
  getItem(key: string): any {
    try {
      const storageKey = `${this.STORAGE_PREFIX}${key}`;
      
      // Try localStorage first
      let storedData = localStorage.getItem(storageKey);
      
      // Fallback to sessionStorage if not found
      if (!storedData) {
        storedData = sessionStorage.getItem(storageKey);
      }

      if (!storedData) {
        return null;
      }

      const parsedData = JSON.parse(storedData);
      
      // Check expiration
      if (parsedData.expiration && Date.now() > parsedData.timestamp + parsedData.expiration) {
        this.removeItem(key);
        return null;
      }

      // Decrypt if needed
      if (parsedData.encrypted) {
        const decryptedValue = this.decrypt(parsedData.value);
        return JSON.parse(decryptedValue);
      }

      return parsedData.value;
    } catch (error) {
      console.error('Failed to retrieve data securely:', error);
      return null;
    }
  }

  /**
   * Remove data securely
   */
  removeItem(key: string): void {
    try {
      const storageKey = `${this.STORAGE_PREFIX}${key}`;
      localStorage.removeItem(storageKey);
      sessionStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to remove data securely:', error);
    }
  }

  /**
   * Clear all secure storage
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });

      const sessionKeys = Object.keys(sessionStorage);
      sessionKeys.forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear secure storage:', error);
    }
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): { totalSize: number; itemCount: number } {
    let totalSize = 0;
    let itemCount = 0;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
            itemCount++;
          }
        }
      });
    } catch (error) {
      console.error('Failed to get storage stats:', error);
    }

    return { totalSize, itemCount };
  }
}

// Export singleton instance
export const secureStorage = new SecureStorageManager();

// Convenience functions for common use cases
export const setSecureItem = (key: string, value: any, options?: SecureStorageOptions) => {
  return secureStorage.setItem(key, value, options);
};

export const getSecureItem = (key: string) => {
  return secureStorage.getItem(key);
};

export const removeSecureItem = (key: string) => {
  return secureStorage.removeItem(key);
};

export const clearSecureStorage = () => {
  return secureStorage.clear();
};

// Specialized functions for different data types
export const setUserPreference = (key: string, value: any) => {
  return secureStorage.setItem(`pref_${key}`, value, { encrypt: false });
};

export const getUserPreference = (key: string) => {
  return secureStorage.getItem(`pref_${key}`);
};

export const setSecureToken = (key: string, token: string, expiration?: number) => {
  return secureStorage.setItem(`token_${key}`, token, { 
    encrypt: true, 
    expiration: expiration || (24 * 60 * 60 * 1000) // 24 hours default
  });
};

export const getSecureToken = (key: string) => {
  return secureStorage.getItem(`token_${key}`);
};

export const removeSecureToken = (key: string) => {
  return secureStorage.removeItem(`token_${key}`);
};
