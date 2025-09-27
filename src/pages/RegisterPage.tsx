import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  User,
  Mail,
  Lock,
  Shield,
  ArrowRight,
  CheckCircle,
  Eye,
  Cpu,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { RegisterForm } from '../types';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, loginWithGoogle } = useAuth();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'AI-powered document organization',
    'Secure cloud storage',
    'Multi-language support',
    'Advanced search capabilities',
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex relative'>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className='absolute top-4 right-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-sm'
      >
        {theme === 'light' ? (
          <Sun className='h-5 w-5 text-gray-700 dark:text-gray-300' />
        ) : theme === 'dark' ? (
          <Moon className='h-5 w-5 text-gray-700 dark:text-gray-300' />
        ) : (
          <div className='h-5 w-5 relative'>
            <Sun className='h-3 w-3 absolute top-0 left-0 text-gray-700 dark:text-gray-300' />
            <Moon className='h-3 w-3 absolute bottom-0 right-0 text-gray-700 dark:text-gray-300' />
          </div>
        )}
      </button>
      {/* Left Side - Benefits Section */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary-600/20 to-purple-600/20 dark:from-primary-400/10 dark:to-purple-400/10' />

        {/* Animated Background Elements */}
        <div className='absolute inset-0'>
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className='absolute w-3 h-3 bg-primary-400/20 rounded-full'
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

        <div className='relative z-10 flex flex-col justify-center px-12 py-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='max-w-lg'
          >
            <div className='flex items-center mb-8'>
              <div className='p-3 bg-primary-600 rounded-xl shadow-lg'>
                <Brain className='w-8 h-8 text-white' />
              </div>
              <h1 className='ml-4 text-3xl font-bold text-gray-900 dark:text-white'>
                DocVault
              </h1>
            </div>

            <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-6'>
              Join the Future of
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600'>
                {' '}
                Document Management
              </span>
            </h2>

            <p className='text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed'>
              Start your journey with intelligent document processing. Create
              your account and experience the power of AI-driven organization
              and analysis.
            </p>

            {/* Benefits List */}
            <div className='space-y-4 mb-8'>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className='flex items-center space-x-3'
                >
                  <div className='p-1 bg-green-100 dark:bg-green-900/30 rounded-full'>
                    <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400' />
                  </div>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Feature Highlights */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20'>
                <div className='flex items-center space-x-2 mb-2'>
                  <Sparkles className='w-5 h-5 text-yellow-500' />
                  <span className='font-semibold text-gray-900 dark:text-white'>
                    Smart AI
                  </span>
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  Intelligent document processing
                </p>
              </div>
              <div className='p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20'>
                <div className='flex items-center space-x-2 mb-2'>
                  <Shield className='w-5 h-5 text-green-500' />
                  <span className='font-semibold text-gray-900 dark:text-white'>
                    Secure
                  </span>
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  Enterprise-grade security
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center px-8 py-12'>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='w-full max-w-md'
        >
          {/* Mobile Logo */}
          <div className='lg:hidden flex items-center justify-center mb-8'>
            <div className='p-3 bg-primary-600 rounded-xl shadow-lg'>
              <Brain className='w-8 h-8 text-white' />
            </div>
            <h1 className='ml-4 text-2xl font-bold text-gray-900 dark:text-white'>
              AppVault
            </h1>
          </div>

          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
              Create Account
            </h2>
            <p className='text-gray-600 dark:text-gray-300'>
              Start your AI-powered document journey
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='space-y-6'
            onSubmit={handleSubmit}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-center'
              >
                <Shield className='w-5 h-5 mr-2' />
                {error}
              </motion.div>
            )}

            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='displayName'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  {t('auth.displayName')}
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <User className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    id='displayName'
                    name='displayName'
                    type='text'
                    autoComplete='name'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200'
                    placeholder='Enter your display name'
                    value={formData.displayName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  {t('auth.email')}
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Mail className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200'
                    placeholder='Enter your email'
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  {t('auth.password')}
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='new-password'
                    required
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200'
                    placeholder='Enter your password'
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  {t('auth.confirmPassword')}
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    autoComplete='new-password'
                    required
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200'
                    placeholder='Confirm your password'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg'
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className='w-5 h-5 border-2 border-white border-t-transparent rounded-full'
                  />
                  <span>{t('common.loading')}</span>
                </>
              ) : (
                <>
                  <span>{t('auth.register')}</span>
                  <ArrowRight className='w-5 h-5' />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300 dark:border-gray-600' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign-in Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='button'
              onClick={handleGoogleSignIn}
              disabled={loading}
              className='w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-sm'
            >
              <svg className='w-5 h-5' viewBox='0 0 24 24'>
                <path
                  fill='#4285F4'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                />
                <path
                  fill='#34A853'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                />
                <path
                  fill='#FBBC05'
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                />
                <path
                  fill='#EA4335'
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                />
              </svg>
              <span>Continue with Google</span>
            </motion.button>

            <div className='text-center'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                Already have an account?{' '}
              </span>
              <Link
                to='/login'
                className='text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors'
              >
                {t('auth.login')}
              </Link>
            </div>
          </motion.form>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'
          >
            <div className='flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400'>
              <div className='flex items-center space-x-1'>
                <Shield className='w-4 h-4' />
                <span>Secure</span>
              </div>
              <div className='flex items-center space-x-1'>
                <Cpu className='w-4 h-4' />
                <span>Smart</span>
              </div>
              <div className='flex items-center space-x-1'>
                <Eye className='w-4 h-4' />
                <span>Private</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
