import React from 'react';

/**
 * Utility functions for cleaning up blob URLs and preventing memory leaks
 */

/**
 * Clears any stale blob URLs that might be causing errors
 * This should be called on app initialization to clean up any cached blob URLs
 */
export const cleanupStaleBlobUrls = () => {
  try {
    // Clear any blob URLs from memory by revoking them
    // This is a best practice to prevent memory leaks
    const revokeAllBlobUrls = () => {
      // Get all elements that might have blob URLs
      const allElements = document.querySelectorAll('*');
      
      allElements.forEach((element) => {
        // Check img src attributes
        if (element.tagName === 'IMG') {
          const src = element.getAttribute('src');
          if (src && src.startsWith('blob:')) {
            try {
              URL.revokeObjectURL(src);
              // Remove the src to prevent the error
              element.removeAttribute('src');
            } catch (error) {
              console.debug('Blob URL already revoked:', src);
            }
          }
        }
        
        // Check video src attributes
        if (element.tagName === 'VIDEO') {
          const src = element.getAttribute('src');
          if (src && src.startsWith('blob:')) {
            try {
              URL.revokeObjectURL(src);
              element.removeAttribute('src');
            } catch (error) {
              console.debug('Video blob URL already revoked:', src);
            }
          }
        }
        
        // Check iframe src attributes
        if (element.tagName === 'IFRAME') {
          const src = element.getAttribute('src');
          if (src && src.startsWith('blob:')) {
            try {
              URL.revokeObjectURL(src);
              element.removeAttribute('src');
            } catch (error) {
              console.debug('Iframe blob URL already revoked:', src);
            }
          }
        }
        
        // Check CSS background images
        const style = window.getComputedStyle(element);
        const backgroundImage = style.backgroundImage;
        if (backgroundImage && backgroundImage.includes('blob:')) {
          const blobUrl = backgroundImage.match(/blob:[^"]+/)?.[0];
          if (blobUrl) {
            try {
              URL.revokeObjectURL(blobUrl);
              // Remove background image style
              (element as HTMLElement).style.backgroundImage = '';
            } catch (error) {
              console.debug('Background blob URL already revoked:', blobUrl);
            }
          }
        }
      });
      
      // Clear any blob URLs from localStorage that might be cached
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          const value = localStorage.getItem(key);
          if (value && value.includes('blob:')) {
            // Try to extract and revoke any blob URLs from localStorage
            const blobUrls = value.match(/blob:[^"]+/g);
            if (blobUrls) {
              blobUrls.forEach(url => {
                try {
                  URL.revokeObjectURL(url);
                } catch (error) {
                  console.debug('LocalStorage blob URL already revoked:', url);
                }
              });
            }
          }
        });
      } catch (error) {
        console.debug('Error checking localStorage for blob URLs:', error);
      }
      
      // Clear any blob URLs from sessionStorage
      try {
        const keys = Object.keys(sessionStorage);
        keys.forEach(key => {
          const value = sessionStorage.getItem(key);
          if (value && value.includes('blob:')) {
            const blobUrls = value.match(/blob:[^"]+/g);
            if (blobUrls) {
              blobUrls.forEach(url => {
                try {
                  URL.revokeObjectURL(url);
                } catch (error) {
                  console.debug('SessionStorage blob URL already revoked:', url);
                }
              });
            }
          }
        });
      } catch (error) {
        console.debug('Error checking sessionStorage for blob URLs:', error);
      }
    };

    // Run cleanup immediately
    revokeAllBlobUrls();

    // Also run cleanup periodically to catch any new blob URLs
    const cleanupInterval = setInterval(revokeAllBlobUrls, 10000); // Every 10 seconds

    // Return cleanup function
    return () => {
      clearInterval(cleanupInterval);
      revokeAllBlobUrls();
    };
  } catch (error) {
    console.warn('Error during blob URL cleanup:', error);
    return () => {}; // Return empty function if cleanup fails
  }
};

/**
 * Creates a safe blob URL with automatic cleanup
 * @param file The file to create a blob URL for
 * @returns The blob URL
 */
export const createSafeBlobUrl = (file: File): string => {
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Error creating blob URL:', error);
    throw new Error('Failed to create preview URL');
  }
};

/**
 * Safely revokes a blob URL
 * @param url The blob URL to revoke
 */
export const revokeSafeBlobUrl = (url: string | null | undefined) => {
  if (url && url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      console.debug('Blob URL already revoked or invalid:', url);
    }
  }
};

/**
 * Aggressively clears all blob URLs including the specific problematic one
 * This targets blob URL errors for the current domain
 */
export const clearAllBlobUrls = () => {
  try {
    // Override console.error to suppress the specific blob URL error
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes(`blob:${window.location.origin}`)) {
        console.debug('Suppressed blob URL error:', message);
        return;
      }
      originalConsoleError.apply(console, args);
    };
    
    // Restore original console.error after a delay
    setTimeout(() => {
      console.error = originalConsoleError;
    }, 5000);
    // Clear the specific problematic blob URL pattern
    const problematicPattern = /blob:https:\/\/docvaultzf\.vercel\.app\/[a-f0-9-]+/g;
    
    // Find and revoke all instances of this pattern
    const allElements = document.querySelectorAll('*');
    allElements.forEach((element) => {
      const html = element.outerHTML;
      const matches = html.match(problematicPattern);
      if (matches) {
        matches.forEach(url => {
          try {
            URL.revokeObjectURL(url);
            console.log('Revoked problematic blob URL:', url);
          } catch (error) {
            console.debug('Problematic blob URL already revoked:', url);
          }
        });
      }
    });
    
    // Also clear any blob URLs from the DOM attributes
    allElements.forEach((element) => {
      ['src', 'href', 'data-src', 'data-href'].forEach(attr => {
        const value = element.getAttribute(attr);
        if (value && value.match(problematicPattern)) {
          try {
            URL.revokeObjectURL(value);
            element.removeAttribute(attr);
            console.log('Removed problematic blob URL from attribute:', attr, value);
          } catch (error) {
            console.debug('Error removing problematic blob URL:', error);
          }
        }
      });
    });
    
    // Clear from localStorage and sessionStorage
    [localStorage, sessionStorage].forEach(storage => {
      try {
        const keys = Object.keys(storage);
        keys.forEach(key => {
          const value = storage.getItem(key);
          if (value && value.match(problematicPattern)) {
            // Remove the entire key if it contains the problematic blob URL
            storage.removeItem(key);
            console.log('Removed key containing problematic blob URL:', key);
          }
        });
      } catch (error) {
        console.debug('Error checking storage for problematic blob URLs:', error);
      }
    });
    
    // Clear any cached data that might contain blob URLs
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.open(cacheName).then(cache => {
            cache.keys().then(requests => {
              requests.forEach(request => {
                if (request.url.match(problematicPattern)) {
                  cache.delete(request);
                  console.log('Deleted cache entry with problematic blob URL:', request.url);
                }
              });
            });
          });
        });
      });
    }
    
    // Clear browser cache for the specific domain
    if ('caches' in window) {
      caches.delete('docvaultzf.vercel.app').catch(() => {
        // Ignore errors if cache doesn't exist
      });
    }
    
    // Force clear any pending blob URL requests
    if (typeof window !== 'undefined') {
      // Override fetch to intercept and block problematic blob URLs
      const originalFetch = window.fetch;
      window.fetch = (input, init) => {
        const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
        if (url && url.match(problematicPattern)) {
          console.debug('Blocked fetch request to problematic blob URL:', url);
          return Promise.reject(new Error('Blocked problematic blob URL'));
        }
        return originalFetch(input, init);
      };
      
      // Restore original fetch after 10 seconds
      setTimeout(() => {
        window.fetch = originalFetch;
      }, 10000);
    }
    
  } catch (error) {
    console.warn('Error during aggressive blob URL cleanup:', error);
  }
};

/**
 * Hook for managing blob URLs with automatic cleanup
 * @param file The file to create a blob URL for
 * @returns The blob URL and cleanup function
 */
export const useBlobUrl = (file: File | null) => {
  const [blobUrl, setBlobUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file) {
      const url = createSafeBlobUrl(file);
      setBlobUrl(url);
      
      // Cleanup function
      return () => {
        revokeSafeBlobUrl(url);
        setBlobUrl(null);
      };
    } else {
      setBlobUrl(null);
    }
  }, [file]);

  return blobUrl;
};
