import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Search,
  Zap,
  Globe,
  Shield,
  ArrowRight,
  Eye,
  Cpu,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { LoginForm } from '../types';
import { validateEmail, validatePassword, sanitizeInput } from '../utils/validation';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  // const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [error, setError] = useState('');
  const [currentFeature, setCurrentFeature] = useState(0);

  const { login, loginWithGoogle } = useAuth();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

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

  const features = [
    {
      icon: Brain,
      title: 'Smart Organization',
      description: 'AI-assisted document categorization and tagging',
    },
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Find documents quickly with powerful search tools',
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Support for English, Macedonian, and French documents',
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Quick document upload and processing capabilities',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // setValidationErrors({});

    // Validate form data
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);

    const errors: Record<string, string[]> = {};
    if (!emailValidation.isValid) {
      errors.email = emailValidation.errors;
    }
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors;
    }

    if (Object.keys(errors).length > 0) {
      setError('Please fix the validation errors');
      setLoading(false);
      return;
    }

    try {
      const sanitizedData = {
        email: sanitizeInput(formData.email),
        password: formData.password, // Don't sanitize password
      };
      
      await login(sanitizedData);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed');
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
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

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
      {/* Left Side - Hero Section */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary-600/20 to-purple-600/20 dark:from-primary-400/10 dark:to-purple-400/10' />

        {/* Animated Background Elements */}
        <div className='absolute inset-0'>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className='absolute w-2 h-2 bg-primary-400/30 rounded-full'
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
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
              Document Management
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600'>
                {' '}
                System
              </span>
            </h2>

            <p className='text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed'>
              Streamline your document management with powerful tools.
              Organize, search, and process your documents more efficiently with
              smart categorization and analysis.
            </p>

            {/* Feature Showcase */}
            <div className='space-y-4'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className='flex items-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20'
                >
                  <div className='p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg'>
                    {React.createElement(features[currentFeature].icon, {
                      className:
                        'w-6 h-6 text-primary-600 dark:text-primary-400',
                    })}
                  </div>
                  <div className='ml-4'>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      {features[currentFeature].title}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-300'>
                      {features[currentFeature].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Key Benefits */}
            <div className='grid grid-cols-1 gap-4 mt-8'>
              <div className='flex items-center space-x-3 p-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg'>
                <div className='p-1 bg-green-100 dark:bg-green-900/30 rounded'>
                  <Shield className='w-4 h-4 text-green-600 dark:text-green-400' />
                </div>
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  Secure document storage
                </span>
              </div>
              <div className='flex items-center space-x-3 p-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg'>
                <div className='p-1 bg-blue-100 dark:bg-blue-900/30 rounded'>
                  <Cpu className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                </div>
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  AI-powered organization
                </span>
              </div>
              <div className='flex items-center space-x-3 p-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg'>
                <div className='p-1 bg-purple-100 dark:bg-purple-900/30 rounded'>
                  <Search className='w-4 h-4 text-purple-600 dark:text-purple-400' />
                </div>
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  Smart search capabilities
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
              Welcome Back
            </h2>
            <p className='text-gray-600 dark:text-gray-300'>
              Sign in to access your AI-powered document vault
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
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  {t('auth.email')}
                </label>
                <div className='relative'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200'
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
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    required
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200'
                    placeholder='Enter your password'
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <Link
                to='/forgot-password'
                className='text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors'
              >
                {t('auth.forgotPassword')}
              </Link>
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
                  <span>{t('auth.login')}</span>
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
                Don't have an account?{' '}
              </span>
              <Link
                to='/register'
                className='text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors'
              >
                {t('auth.register')}
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
