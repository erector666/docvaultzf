import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Database,
  Download,
  Trash2,
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

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    bio: '',
    company: '',
    website: '',
  });

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

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || '',
        email: user.email || '',
        bio: user.bio || '',
        company: user.company || '',
        website: user.website || '',
      });
    }
  }, [user]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
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

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await updateUserProfile(profileData);
      showSuccessMessage();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      await updateUserProfile({ preferences });
      setLanguage(preferences.language);
      setTheme(preferences.theme);
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

    setIsLoading(true);
    try {
      // Password change logic would go here
      console.log('Password change requested');
      showSuccessMessage();
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleExportData = () => {
    // Export user data logic
    console.log('Exporting user data...');
  };

  const handleDeleteAccount = () => {
    // Delete account logic
    console.log('Deleting account...');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
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
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <motion.div
                    key='profile'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className='flex items-center space-x-3 mb-6'>
                      <User className='w-6 h-6 text-primary-600 dark:text-primary-400' />
                      <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                        Profile Information
                      </h2>
                    </div>

                    <div className='space-y-6'>
                      {/* Profile Picture */}
                      <div className='flex items-center space-x-6'>
                        <div className='w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center'>
                          {user?.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt='Profile'
                              className='w-20 h-20 rounded-full object-cover'
                            />
                          ) : (
                            <User className='w-10 h-10 text-primary-600 dark:text-primary-400' />
                          )}
                        </div>
                        <div>
                          <button className='px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200'>
                            Change Photo
                          </button>
                          <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                            JPG, PNG or GIF. Max size 2MB.
                          </p>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Display Name
                          </label>
                          <input
                            type='text'
                            value={profileData.displayName}
                            onChange={e =>
                              setProfileData({
                                ...profileData,
                                displayName: e.target.value,
                              })
                            }
                            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Email
                          </label>
                          <input
                            type='email'
                            value={profileData.email}
                            disabled
                            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          />
                          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                            Email cannot be changed
                          </p>
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Company
                          </label>
                          <input
                            type='text'
                            value={profileData.company}
                            onChange={e =>
                              setProfileData({
                                ...profileData,
                                company: e.target.value,
                              })
                            }
                            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Website
                          </label>
                          <input
                            type='url'
                            value={profileData.website}
                            onChange={e =>
                              setProfileData({
                                ...profileData,
                                website: e.target.value,
                              })
                            }
                            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                          />
                        </div>
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Bio
                        </label>
                        <textarea
                          value={profileData.bio}
                          onChange={e =>
                            setProfileData({
                              ...profileData,
                              bio: e.target.value,
                            })
                          }
                          rows={4}
                          className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                          placeholder='Tell us about yourself...'
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className='px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'
                      >
                        <Save className='w-5 h-5' />
                        <span>{isLoading ? 'Saving...' : 'Save Profile'}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

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
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4'>
                          Notifications
                        </label>
                        <div className='space-y-4'>
                          {[
                            {
                              key: 'notifications',
                              label: 'Push Notifications',
                              description:
                                'Receive notifications about document processing',
                            },
                            {
                              key: 'emailUpdates',
                              label: 'Email Updates',
                              description:
                                'Get email notifications for important updates',
                            },
                            {
                              key: 'securityAlerts',
                              label: 'Security Alerts',
                              description:
                                'Notifications about account security',
                            },
                          ].map(item => (
                            <div
                              key={item.key}
                              className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'
                            >
                              <div>
                                <div className='font-medium text-gray-900 dark:text-white'>
                                  {item.label}
                                </div>
                                <div className='text-sm text-gray-600 dark:text-gray-400'>
                                  {item.description}
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  setPreferences({
                                    ...preferences,
                                    [item.key]:
                                      !preferences[
                                        item.key as keyof typeof preferences
                                      ],
                                  })
                                }
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                  preferences[
                                    item.key as keyof typeof preferences
                                  ]
                                    ? 'bg-primary-600'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                    preferences[
                                      item.key as keyof typeof preferences
                                    ]
                                      ? 'translate-x-6'
                                      : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
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
                        <span>
                          {isLoading ? 'Saving...' : 'Save Preferences'}
                        </span>
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

                    <div className='space-y-6'>
                      {/* Change Password */}
                      <div className='p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                          Change Password
                        </h3>
                        <div className='space-y-4'>
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
                              />
                              <button
                                type='button'
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
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
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleChangePassword}
                            disabled={isLoading}
                            className='px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'
                          >
                            <Shield className='w-5 h-5' />
                            <span>
                              {isLoading ? 'Updating...' : 'Update Password'}
                            </span>
                          </motion.button>
                        </div>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className='p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                          Two-Factor Authentication
                        </h3>
                        <p className='text-gray-600 dark:text-gray-400 mb-4'>
                          Add an extra layer of security to your account
                        </p>
                        <button className='px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200'>
                          Enable 2FA
                        </button>
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

                    <div className='space-y-6'>
                      {/* Export Data */}
                      <div className='p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                          Export Your Data
                        </h3>
                        <p className='text-gray-600 dark:text-gray-400 mb-4'>
                          Download a copy of all your data including documents,
                          settings, and preferences.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleExportData}
                          className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2'
                        >
                          <Download className='w-5 h-5' />
                          <span>Export Data</span>
                        </motion.button>
                      </div>

                      {/* Delete Account */}
                      <div className='p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                        <h3 className='text-lg font-medium text-red-900 dark:text-red-300 mb-2'>
                          Delete Account
                        </h3>
                        <p className='text-red-700 dark:text-red-400 mb-4'>
                          Permanently delete your account and all associated
                          data. This action cannot be undone.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleDeleteAccount}
                          className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2'
                        >
                          <Trash2 className='w-5 h-5' />
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
