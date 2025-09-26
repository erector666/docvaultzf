import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    bio: user?.bio || '',
    location: '',
    website: user?.website || '',
    company: user?.company || '',
    jobTitle: '',
    joinDate: user?.createdAt || new Date(),
    lastLogin: user?.lastLoginAt || new Date(),
    profileImage: user?.photoURL || '',
    isEmailVerified: true, // Mock value since we don't have this in our User type
    twoFactorEnabled: false,
    notifications: {
      email: user?.preferences?.notifications || true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await updateUserProfile({
        displayName: profileData.displayName,
        photoURL: profileData.profileImage,
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
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
      // Mock password change - in real app, this would call Firebase auth
      console.log('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // Mock account deletion - in real app, this would call Firebase auth
      console.log('Account deleted successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden'>
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

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mb-8'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className='p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200'
              >
                <ArrowLeft className='w-5 h-5 text-gray-600 dark:text-gray-400' />
              </motion.button>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  Profile Management
                </h1>
                <p className='text-lg text-gray-600 dark:text-gray-300'>
                  Manage your account information and preferences
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className='flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg'
                >
                  <Edit className='w-4 h-4' />
                  <span>Edit Profile</span>
                </motion.button>
              ) : (
                <div className='flex items-center space-x-2'>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(false)}
                    className='px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all duration-200'
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className='flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className='w-4 h-4 border-2 border-white border-t-transparent rounded-full'
                      />
                    ) : (
                      <Save className='w-4 h-4' />
                    )}
                    <span>Save Changes</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/20 rounded-xl flex items-center space-x-3'
            >
              <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400' />
              <span className='text-green-800 dark:text-green-200 font-medium'>
                Profile updated successfully!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Profile Card */}
          <div className='lg:col-span-1'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg'
            >
              <div className='text-center'>
                <div className='relative inline-block mb-4'>
                  <div className='w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center overflow-hidden'>
                    {profileData.profileImage ? (
                      <img
                        src={profileData.profileImage}
                        alt='Profile'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <User className='w-12 h-12 text-primary-600 dark:text-primary-400' />
                    )}
                  </div>
                  {isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className='absolute -bottom-1 -right-1 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all duration-200'
                    >
                      <Camera className='w-4 h-4' />
                    </motion.button>
                  )}
                </div>

                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
                  {profileData.displayName || 'User'}
                </h2>
                <p className='text-gray-600 dark:text-gray-400 mb-4'>
                  {profileData.email}
                </p>

                <div className='space-y-2 text-sm text-gray-500 dark:text-gray-400'>
                  <div className='flex items-center justify-center space-x-2'>
                    <Calendar className='w-4 h-4' />
                    <span>
                      Joined {(() => {
                        try {
                          const date = profileData.joinDate instanceof Date 
                            ? profileData.joinDate 
                            : new Date(profileData.joinDate);
                          return formatDate(date.toISOString());
                        } catch (error) {
                          return formatDate(new Date().toISOString());
                        }
                      })()}
                    </span>
                  </div>
                  <div className='flex items-center justify-center space-x-2'>
                    <Shield className='w-4 h-4' />
                    <span
                      className={
                        profileData.isEmailVerified
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }
                    >
                      {profileData.isEmailVerified
                        ? 'Email Verified'
                        : 'Email Not Verified'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Profile Details */}
          <div className='lg:col-span-2'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className='space-y-6'
            >
              {/* Basic Information */}
              <div className='p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                  Basic Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Display Name
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={profileData.displayName}
                        onChange={e =>
                          setProfileData(prev => ({
                            ...prev,
                            displayName: e.target.value,
                          }))
                        }
                        className='w-full px-3 py-2 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-white/20 dark:border-gray-600/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                      />
                    ) : (
                      <p className='text-gray-900 dark:text-white'>
                        {profileData.displayName || 'Not set'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Email Address
                    </label>
                    <div className='flex items-center space-x-2'>
                      <Mail className='w-4 h-4 text-gray-400' />
                      <p className='text-gray-900 dark:text-white'>
                        {profileData.email}
                      </p>
                      {profileData.isEmailVerified && (
                        <CheckCircle className='w-4 h-4 text-green-500' />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type='tel'
                        value={profileData.phone}
                        onChange={e =>
                          setProfileData(prev => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className='w-full px-3 py-2 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-white/20 dark:border-gray-600/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                      />
                    ) : (
                      <p className='text-gray-900 dark:text-white'>
                        {profileData.phone || 'Not set'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={profileData.location}
                        onChange={e =>
                          setProfileData(prev => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        className='w-full px-3 py-2 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-white/20 dark:border-gray-600/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                      />
                    ) : (
                      <p className='text-gray-900 dark:text-white'>
                        {profileData.location || 'Not set'}
                      </p>
                    )}
                  </div>
                </div>

                <div className='mt-4'>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={e =>
                        setProfileData(prev => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      rows={3}
                      className='w-full px-3 py-2 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-white/20 dark:border-gray-600/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                      placeholder='Tell us about yourself...'
                    />
                  ) : (
                    <p className='text-gray-900 dark:text-white'>
                      {profileData.bio || 'No bio provided'}
                    </p>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className='p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                  Professional Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Company
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={profileData.company}
                        onChange={e =>
                          setProfileData(prev => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        className='w-full px-3 py-2 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-white/20 dark:border-gray-600/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                      />
                    ) : (
                      <p className='text-gray-900 dark:text-white'>
                        {profileData.company || 'Not set'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Job Title
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={profileData.jobTitle}
                        onChange={e =>
                          setProfileData(prev => ({
                            ...prev,
                            jobTitle: e.target.value,
                          }))
                        }
                        className='w-full px-3 py-2 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-white/20 dark:border-gray-600/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                      />
                    ) : (
                      <p className='text-gray-900 dark:text-white'>
                        {profileData.jobTitle || 'Not set'}
                      </p>
                    )}
                  </div>

                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type='url'
                        value={profileData.website}
                        onChange={e =>
                          setProfileData(prev => ({
                            ...prev,
                            website: e.target.value,
                          }))
                        }
                        className='w-full px-3 py-2 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-white/20 dark:border-gray-600/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                        placeholder='https://example.com'
                      />
                    ) : (
                      <p className='text-gray-900 dark:text-white'>
                        {profileData.website || 'Not set'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Security & Privacy */}
              <div className='p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                  Security & Privacy
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-medium text-gray-900 dark:text-white'>
                        Change Password
                      </h4>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Update your account password
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className='px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all duration-200'
                    >
                      Change Password
                    </motion.button>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-medium text-gray-900 dark:text-white'>
                        Two-Factor Authentication
                      </h4>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {profileData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        profileData.twoFactorEnabled
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                    >
                      {profileData.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className='p-6 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm rounded-2xl border border-red-200 dark:border-red-800/20 shadow-lg'>
                <h3 className='text-lg font-semibold text-red-900 dark:text-red-200 mb-4'>
                  Danger Zone
                </h3>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-medium text-red-900 dark:text-red-200'>
                      Delete Account
                    </h4>
                    <p className='text-sm text-red-700 dark:text-red-300'>
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteConfirm(true)}
                    className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200'
                  >
                    Delete Account
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'
            onClick={() => setShowPasswordForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full shadow-2xl'
              onClick={e => e.stopPropagation()}
            >
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  Change Password
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPasswordForm(false)}
                  className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                >
                  <X className='w-5 h-5' />
                </motion.button>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Current Password
                  </label>
                  <div className='relative'>
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={e =>
                        setPasswordData(prev => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className='w-full px-3 py-2 pr-10 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-white/20 dark:border-gray-600/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowPasswords(prev => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    >
                      {showPasswords.current ? (
                        <EyeOff className='w-4 h-4' />
                      ) : (
                        <Eye className='w-4 h-4' />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    New Password
                  </label>
                  <div className='relative'>
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={e =>
                        setPasswordData(prev => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className='w-full px-3 py-2 pr-10 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-white/20 dark:border-gray-600/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowPasswords(prev => ({ ...prev, new: !prev.new }))
                      }
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    >
                      {showPasswords.new ? (
                        <EyeOff className='w-4 h-4' />
                      ) : (
                        <Eye className='w-4 h-4' />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Confirm New Password
                  </label>
                  <div className='relative'>
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={e =>
                        setPasswordData(prev => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className='w-full px-3 py-2 pr-10 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-white/20 dark:border-gray-600/20 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowPasswords(prev => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className='w-4 h-4' />
                      ) : (
                        <Eye className='w-4 h-4' />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className='flex space-x-3 mt-6'>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPasswordForm(false)}
                  className='flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200'
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className='flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full shadow-2xl'
              onClick={e => e.stopPropagation()}
            >
              <div className='flex items-center space-x-3 mb-4'>
                <div className='p-2 bg-red-100 dark:bg-red-900/30 rounded-lg'>
                  <AlertCircle className='w-6 h-6 text-red-600 dark:text-red-400' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  Delete Account
                </h3>
              </div>

              <p className='text-gray-600 dark:text-gray-300 mb-6'>
                Are you sure you want to delete your account? This action cannot
                be undone and will permanently remove all your data, documents,
                and settings.
              </p>

              <div className='flex space-x-3'>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className='flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200'
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className='flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className='w-4 h-4 border-2 border-white border-t-transparent rounded-full'
                      />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className='w-4 h-4' />
                      <span>Delete Account</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
