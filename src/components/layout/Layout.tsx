import React from 'react';
import { Header } from './Header';
import { BaseComponentProps } from '../../types';

interface LayoutProps extends BaseComponentProps {
  showHeader?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  className = '',
  showHeader = true,
}) => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {showHeader && <Header />}
      <main className={className}>{children}</main>
    </div>
  );
};
