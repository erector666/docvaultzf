export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateDisplayName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('Display name is required');
  } else if (name.length < 2) {
    errors.push('Display name must be at least 2 characters long');
  } else if (name.length > 50) {
    errors.push('Display name must be less than 50 characters');
  } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
    errors.push('Display name can only contain letters, numbers, spaces, hyphens, and underscores');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateFile = (file: File): ValidationResult => {
  const errors: string[] = [];
  
  if (!file) {
    errors.push('File is required');
    return { isValid: false, errors };
  }
  
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
  ];
  
  if (file.size > maxSize) {
    errors.push('File size must be less than 50MB');
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not supported. Please upload PDF, DOC, DOCX, XLS, XLSX, TXT, or image files');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSearchQuery = (query: string): ValidationResult => {
  const errors: string[] = [];
  
  if (query && query.length > 100) {
    errors.push('Search query must be less than 100 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateCategory = (category: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!category) {
    errors.push('Category is required');
  } else if (category.length > 50) {
    errors.push('Category must be less than 50 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateTags = (tags: string[]): ValidationResult => {
  const errors: string[] = [];
  
  if (tags.length > 10) {
    errors.push('Maximum 10 tags allowed');
  }
  
  for (const tag of tags) {
    if (tag.length > 30) {
      errors.push('Each tag must be less than 30 characters');
      break;
    }
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(tag)) {
      errors.push('Tags can only contain letters, numbers, spaces, hyphens, and underscores');
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const validateForm = (formData: Record<string, any>, rules: Record<string, (value: any) => ValidationResult>): ValidationResult => {
  const errors: string[] = [];
  
  for (const [field, validator] of Object.entries(rules)) {
    const result = validator(formData[field]);
    if (!result.isValid) {
      errors.push(...result.errors);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
