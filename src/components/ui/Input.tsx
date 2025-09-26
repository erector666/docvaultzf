import React from 'react';
import { BaseComponentProps } from '../../types';

interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  className = '',
  type = 'text',
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  autoComplete,
  autoFocus = false,
  onChange,
  onBlur,
  onFocus,
  error,
  label,
  helperText,
  ...props
}) => {
  const baseClasses =
    'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200';

  const stateClasses = error
    ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
    : 'border-gray-300 dark:border-gray-600';

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900'
    : '';

  const classes = `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`;

  return (
    <div className='space-y-1'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}

      <input
        type={type}
        className={classes}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        {...props}
      />

      {error && (
        <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
      )}

      {helperText && !error && (
        <p className='text-sm text-gray-500 dark:text-gray-400'>{helperText}</p>
      )}
    </div>
  );
};
