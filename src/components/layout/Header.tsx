import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import {
  Sun,
  Moon,
  Globe,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { SupportedLanguage } from '../../types';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const languages: Array<{
    code: SupportedLanguage;
    name: string;
    flag: string;
  }> = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'mk', name: 'Македонски', flag: '🇲🇰' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const currentLanguage =
    languages.find(lang => lang.code === language) || languages[0];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleTheme = () => {
    // Cycle through: light -> dark -> system -> light
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const handleLanguageChange = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showLanguageDropdown && !target.closest('.language-dropdown')) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageDropdown]);

  return (
    <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link to='/dashboard' className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>DV</span>
              </div>
              <span className='text-xl font-bold text-gray-900 dark:text-white'>
                DocVault
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            <Link
              to='/dashboard'
              className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors'
            >
              {t('dashboard.title')}
            </Link>
            <Link
              to='/documents'
              className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors'
            >
              {t('documents.title')}
            </Link>
          </nav>

          {/* User Actions */}
          <div className='flex items-center space-x-4'>
            {/* Theme Toggle */}
            <Button
              variant='ghost'
              size='sm'
              onClick={toggleTheme}
              className='p-2'
            >
              {theme === 'light' ? (
                <Sun className='h-5 w-5' />
              ) : theme === 'dark' ? (
                <Moon className='h-5 w-5' />
              ) : (
                <div className='h-5 w-5 relative'>
                  <Sun className='h-3 w-3 absolute top-0 left-0' />
                  <Moon className='h-3 w-3 absolute bottom-0 right-0' />
                </div>
              )}
            </Button>

            {/* Language Dropdown */}
            <div className='relative language-dropdown'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className='flex items-center space-x-1 px-2 py-1'
              >
                <Globe className='h-4 w-4' />
                <span className='text-sm'>{currentLanguage.flag}</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`}
                />
              </Button>

              {/* Language Dropdown Menu */}
              {showLanguageDropdown && (
                <div className='absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50 overflow-hidden'>
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center space-x-2 px-3 py-2 text-left text-sm transition-colors duration-200 ${
                        lang.code === language
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className='text-sm'>{lang.flag}</span>
                      <span className='font-medium'>{lang.name}</span>
                      {lang.code === language && (
                        <div className='ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full'></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu */}
            {user && (
              <div className='flex items-center space-x-2'>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center'>
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || user.email}
                        className='w-8 h-8 rounded-full'
                      />
                    ) : (
                      <User className='h-5 w-5 text-primary-600 dark:text-primary-400' />
                    )}
                  </div>
                  <span className='hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    {user.displayName || user.email}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/profile')}
                  className='p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 relative z-10'
                  title='Profile'
                  style={{ position: 'relative', zIndex: 10 }}
                >
                  <User className='h-5 w-5' />
                </button>

                <button
                  onClick={handleLogout}
                  className='p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 relative z-10'
                  title='Logout'
                  style={{ position: 'relative', zIndex: 10 }}
                >
                  <LogOut className='h-5 w-5' />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
