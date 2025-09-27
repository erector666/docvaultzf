import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Shield,
  Database,
  Save,
  Check,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Theme, SupportedLanguage } from '../types';

export const SettingsPage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { setLanguage, language } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('preferences');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [preferences, setPreferences] = useState({
    language: language,
    theme: theme,
    notifications: user?.preferences?.notifications ?? true,
    autoCategorization: user?.preferences?.autoCategorization ?? true,
    emailUpdates: true,
    securityAlerts: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs = [
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Privacy', icon: Database },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'mk', name: 'Македонски', flag: '🇲🇰' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor },
  ];

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      // Update language and theme immediately
      setLanguage(preferences.language);
      setTheme(preferences.theme);
      
      // Save to user profile
      await updateUserProfile({ preferences });
      showSuccessMessage();
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual password change with Firebase Auth
      console.log('Password change requested');
      alert('Password change functionality not yet implemented');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleExportData = () => {
    // TODO: Implement actual data export functionality
    console.log('Exporting user data...');
    alert('Data export functionality not yet implemented. This would download all your documents, settings, and profile data.');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement actual account deletion with confirmation
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.'
    );
    
    if (confirmed) {
      const doubleConfirmed = window.confirm(
        'This is your final warning. All your documents, settings, and account data will be permanently deleted. Type "DELETE" to confirm.'
      );
      
      if (doubleConfirmed) {
        console.log('Deleting account...');
        alert('Account deletion functionality not yet implemented. This would permanently delete your account and all associated data.');
      }
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-2 h-2 bg-primary-400/20 rounded-full'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className='relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mb-8'
        >
          <div className='flex items-center space-x-4 mb-6'>
            <div className='p-3 bg-primary-600 rounded-xl shadow-lg'>
              <SettingsIcon className='w-8 h-8 text-white' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                Settings
              </h1>
              <p className='text-gray-600 dark:text-gray-300'>
                Manage your account preferences and security
              </p>
            </div>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3'
              >
                <Check className='w-5 h-5 text-green-600 dark:text-green-400' />
                <span className='text-green-700 dark:text-green-300'>
                  Settings saved successfully!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='lg:col-span-1'
          >
            <div className='bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 p-4 shadow-lg'>
              <nav className='space-y-2'>
                {tabs.map(tab => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <tab.icon className='w-5 h-5' />
                    <span className='font-medium'>{tab.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='lg:col-span-3'
          >
            <div className='bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 p-6 shadow-lg'>
              <AnimatePresence mode='wait'>
                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <motion.div
                    key='preferences'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className='flex items-center space-x-3 mb-6'>
                      <SettingsIcon className='w-6 h-6 text-primary-600 dark:text-primary-400' />
                      <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                        Preferences
                      </h2>
                    </div>

                    <div className='space-y-8'>
                      {/* Language */}
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                          Language
                        </label>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                          {languages.map(lang => (
                            <motion.button
                              key={lang.code}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                setPreferences({
                                  ...preferences,
                                  language: lang.code as SupportedLanguage,
                                })
                              }
                              className={`p-4 rounded-lg border transition-all duration-200 ${
                                preferences.language === lang.code
                                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                              }`}
                            >
                              <div className='text-2xl mb-2'>{lang.flag}</div>
                              <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                {lang.name}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Theme */}
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                          Theme
                        </label>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                          {themes.map(themeOption => (
                            <motion.button
                              key={themeOption.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                setPreferences({
                                  ...preferences,
                                  theme: themeOption.id as Theme,
                                })
                              }
                              className={`p-4 rounded-lg border transition-all duration-200 flex items-center space-x-3 ${
                                preferences.theme === themeOption.id
                                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                              }`}
                            >
                              <themeOption.icon className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                                {themeOption.name}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Notifications */}
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                          Notifications
                        </label>
                        <div className='space-y-4'>
                          <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                            <div>
                              <h4 className='font-medium text-gray-900 dark:text-white'>
                                Push Notifications
                              </h4>
                              <p className='text-sm text-gray-600 dark:text-gray-400'>
                                Receive notifications about document processing
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                setPreferences({
                                  ...preferences,
                                  notifications: !preferences.notifications,
                                })
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                preferences.notifications
                                  ? 'bg-primary-600'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                  preferences.notifications
                                    ? 'translate-x-6'
                                    : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                            <div>
                              <h4 className='font-medium text-gray-900 dark:text-white'>
                                Email Updates
                              </h4>
                              <p className='text-sm text-gray-600 dark:text-gray-400'>
                                Get email notifications for important updates
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                setPreferences({
                                  ...preferences,
                                  emailUpdates: !preferences.emailUpdates,
                                })
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                preferences.emailUpdates
                                  ? 'bg-primary-600'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                  preferences.emailUpdates
                                    ? 'translate-x-6'
                                    : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                            <div>
                              <h4 className='font-medium text-gray-900 dark:text-white'>
                                Security Alerts
                              </h4>
                              <p className='text-sm text-gray-600 dark:text-gray-400'>
                                Notifications about account security
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                setPreferences({
                                  ...preferences,
                                  securityAlerts: !preferences.securityAlerts,
                                })
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                preferences.securityAlerts
                                  ? 'bg-primary-600'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                  preferences.securityAlerts
                                    ? 'translate-x-6'
                                    : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSavePreferences}
                        disabled={isLoading}
                        className='px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'
                      >
                        <Save className='w-5 h-5' />
                        <span>{isLoading ? 'Saving...' : 'Save Preferences'}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <motion.div
                    key='security'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className='flex items-center space-x-3 mb-6'>
                      <Shield className='w-6 h-6 text-primary-600 dark:text-primary-400' />
                      <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                        Security
                      </h2>
                    </div>

                    <div className='space-y-8'>
                      {/* Change Password */}
                      <div>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                          Change Password
                        </h3>
                        <form className='space-y-4'>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                              Current Password
                            </label>
                            <div className='relative'>
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={e =>
                                  setPasswordData({
                                    ...passwordData,
                                    currentPassword: e.target.value,
                                  })
                                }
                                className='w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                                placeholder='Enter current password'
                                autoComplete='current-password'
                              />
                              <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                              >
                                {showPassword ? (
                                  <EyeOff className='w-5 h-5' />
                                ) : (
                                  <Eye className='w-5 h-5' />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                              New Password
                            </label>
                            <input
                              type='password'
                              value={passwordData.newPassword}
                              onChange={e =>
                                setPasswordData({
                                  ...passwordData,
                                  newPassword: e.target.value,
                                })
                              }
                              className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                              placeholder='Enter new password'
                              autoComplete='new-password'
                            />
                          </div>

                          <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                              Confirm New Password
                            </label>
                            <div className='relative'>
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwordData.confirmPassword}
                                onChange={e =>
                                  setPasswordData({
                                    ...passwordData,
                                    confirmPassword: e.target.value,
                                  })
                                }
                                className='w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                                placeholder='Confirm new password'
                                autoComplete='new-password'
                              />
                              <button
                                type='button'
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className='w-5 h-5' />
                                ) : (
                                  <Eye className='w-5 h-5' />
                                )}
                              </button>
                            </div>
                          </div>

                          <motion.button
                            type='button'
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleChangePassword}
                            disabled={isLoading}
                            className='px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'
                          >
                            <Save className='w-5 h-5' />
                            <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
                          </motion.button>
                        </form>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                          Two-Factor Authentication
                        </h3>
                        <p className='text-gray-600 dark:text-gray-400 mb-4'>
                          Add an extra layer of security to your account
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => alert('2FA setup functionality not yet implemented')}
                          className='px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2'
                        >
                          <Shield className='w-5 h-5' />
                          <span>Enable 2FA</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Data & Privacy Tab */}
                {activeTab === 'data' && (
                  <motion.div
                    key='data'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className='flex items-center space-x-3 mb-6'>
                      <Database className='w-6 h-6 text-primary-600 dark:text-primary-400' />
                      <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                        Data & Privacy
                      </h2>
                    </div>

                    <div className='space-y-8'>
                      {/* Export Data */}
                      <div>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                          Export Your Data
                        </h3>
                        <p className='text-gray-600 dark:text-gray-400 mb-4'>
                          Download a copy of all your data including documents, settings, and preferences.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleExportData}
                          className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2'
                        >
                          <Database className='w-5 h-5' />
                          <span>Export Data</span>
                        </motion.button>
                      </div>

                      {/* Delete Account */}
                      <div>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                          Delete Account
                        </h3>
                        <p className='text-gray-600 dark:text-gray-400 mb-4'>
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleDeleteAccount}
                          className='px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2'
                        >
                          <Database className='w-5 h-5' />
                          <span>Delete Account</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};