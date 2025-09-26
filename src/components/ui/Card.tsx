import React from 'react';
import { BaseComponentProps } from '../../types';

interface CardProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  hover = false,
  ...props
}) => {
  const baseClasses =
    'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700';

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const hoverClasses = hover
    ? 'hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200'
    : '';

  const classes = `${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${hoverClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

interface CardHeaderProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  ...props
}) => {
  return (
    <div
      className={`flex items-center justify-between ${className}`}
      {...props}
    >
      <div className='flex-1'>
        {title && (
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            {title}
          </h3>
        )}
        {subtitle && (
          <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {action && <div className='ml-4'>{action}</div>}
    </div>
  );
};

interface CardContentProps extends BaseComponentProps {}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CardFooterProps extends BaseComponentProps {}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
