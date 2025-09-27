/**
 * Environment variable validation and configuration
 */

interface EnvironmentConfig {
  REACT_APP_FIREBASE_API_KEY: string;
  REACT_APP_FIREBASE_AUTH_DOMAIN: string;
  REACT_APP_FIREBASE_PROJECT_ID: string;
  REACT_APP_FIREBASE_STORAGE_BUCKET: string;
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: string;
  REACT_APP_FIREBASE_APP_ID: string;
  REACT_APP_FIREBASE_MEASUREMENT_ID?: string;
  REACT_APP_DEEPSEEK_API_KEY?: string;
  REACT_APP_HUGGINGFACE_API_KEY?: string;
  REACT_APP_APP_NAME?: string;
  REACT_APP_VERSION?: string;
  REACT_APP_ENVIRONMENT?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

class EnvironmentValidator {
  private requiredVars: (keyof EnvironmentConfig)[] = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];

  private optionalVars: (keyof EnvironmentConfig)[] = [
    'REACT_APP_FIREBASE_MEASUREMENT_ID',
    'REACT_APP_DEEPSEEK_API_KEY',
    'REACT_APP_HUGGINGFACE_API_KEY',
    'REACT_APP_APP_NAME',
    'REACT_APP_VERSION',
    'REACT_APP_ENVIRONMENT'
  ];

  /**
   * Validate all environment variables
   */
  validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required variables
    this.requiredVars.forEach(varName => {
      const value = process.env[varName];
      if (!value || value.trim() === '') {
        errors.push(`Required environment variable ${varName} is missing or empty`);
      } else if (value.includes('your_') || value.includes('placeholder')) {
        // Only warn about placeholder values in production
        if (this.isProduction()) {
          errors.push(`Environment variable ${varName} contains placeholder value: ${value}`);
        } else {
          warnings.push(`Environment variable ${varName} contains placeholder value: ${value}`);
        }
      }
    });

    // Check optional variables
    this.optionalVars.forEach(varName => {
      const value = process.env[varName];
      if (value && (value.includes('your_') || value.includes('placeholder'))) {
        warnings.push(`Environment variable ${varName} contains placeholder value: ${value}`);
      }
    });

    // Validate Firebase configuration format
    this.validateFirebaseConfig(errors, warnings);

    // Validate API keys format
    this.validateApiKeys(errors, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate Firebase configuration format
   */
  private validateFirebaseConfig(errors: string[], warnings: string[]): void {
    const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
    const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
    const authDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;

    // Validate API key format (should be alphanumeric with length > 20)
    if (apiKey && apiKey.length < 20) {
      errors.push('Firebase API key appears to be too short');
    }

    // Validate project ID format (skip validation for placeholder values)
    if (projectId && !projectId.includes('your_') && !/^[a-z0-9-]+$/.test(projectId)) {
      errors.push(`Firebase project ID "${projectId}" contains invalid characters. Must use only lowercase letters, numbers, and hyphens. Found: ${projectId}`);
    }

    // Validate auth domain format
    if (authDomain && !authDomain.includes('.firebaseapp.com') && !authDomain.includes('.web.app')) {
      warnings.push('Firebase auth domain should typically end with .firebaseapp.com or .web.app');
    }
  }

  /**
   * Validate API keys format
   */
  private validateApiKeys(errors: string[], warnings: string[]): void {
    const deepseekKey = process.env.REACT_APP_DEEPSEEK_API_KEY;
    const huggingfaceKey = process.env.REACT_APP_HUGGINGFACE_API_KEY;

    // Validate DeepSeek API key format (if provided)
    if (deepseekKey && deepseekKey.length < 20) {
      warnings.push('DeepSeek API key appears to be too short');
    }

    // Validate HuggingFace API key format (if provided)
    if (huggingfaceKey && huggingfaceKey.length < 20) {
      warnings.push('HuggingFace API key appears to be too short');
    }
  }

        /**
         * Get sanitized environment configuration
         */
        getSanitizedConfig(): Partial<EnvironmentConfig> {
          const config: Partial<EnvironmentConfig> = {};

          [...this.requiredVars, ...this.optionalVars].forEach(varName => {
            const value = process.env[varName];
            if (value) {
              // Aggressive sanitization: trim, remove all whitespace characters, carriage returns, newlines, and control characters
              config[varName] = value.trim().replace(/[\r\n\t\f\v\0]/g, '').replace(/\s+/g, '');
            }
          });

          return config;
        }

  /**
   * Check if running in development mode
   */
  isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development' || 
           process.env.REACT_APP_ENVIRONMENT === 'development';
  }

  /**
   * Check if running in production mode
   */
  isProduction(): boolean {
    return process.env.NODE_ENV === 'production' || 
           process.env.REACT_APP_ENVIRONMENT === 'production';
  }
}

// Export singleton instance
export const envValidator = new EnvironmentValidator();

// Convenience functions
export const validateEnvironment = (): ValidationResult => {
  return envValidator.validate();
};

export const getSanitizedConfig = (): Partial<EnvironmentConfig> => {
  return envValidator.getSanitizedConfig();
};

export const isDevelopment = (): boolean => {
  return envValidator.isDevelopment();
};

export const isProduction = (): boolean => {
  return envValidator.isProduction();
};

// Initialize validation on module load
const validation = validateEnvironment();
if (!validation.isValid) {
  console.error('Environment validation failed:', validation.errors);
  if (validation.warnings.length > 0) {
    console.warn('Environment validation warnings:', validation.warnings);
  }
}
