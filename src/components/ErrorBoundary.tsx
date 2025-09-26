import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}

const ErrorFallback: React.FC<{ error?: Error; errorInfo?: ErrorInfo }> = ({ error, errorInfo }) => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-950 dark:to-orange-950 flex items-center justify-center p-4'>
      <div className='max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-red-200 dark:border-red-800/20 shadow-xl p-8 text-center'>
        <div className='w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6'>
          <AlertTriangle className='w-8 h-8 text-red-600 dark:text-red-400' />
        </div>

        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
          Oops! Something went wrong
        </h1>

        <p className='text-gray-600 dark:text-gray-300 mb-6'>
          We encountered an unexpected error. Don't worry, your data is safe.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details className='mb-6 text-left'>
            <summary className='cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Error Details (Development)
            </summary>
            <div className='bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-xs font-mono text-gray-800 dark:text-gray-200 overflow-auto max-h-40'>
              <div className='mb-2'>
                <strong>Error:</strong> {error.message}
              </div>
              {error.stack && (
                <div className='mb-2'>
                  <strong>Stack:</strong>
                  <pre className='whitespace-pre-wrap'>{error.stack}</pre>
                </div>
              )}
              {errorInfo && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre className='whitespace-pre-wrap'>{errorInfo.componentStack}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        <div className='flex flex-col sm:flex-row gap-3'>
          <button
            onClick={handleRefresh}
            className='flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg'
          >
            <RefreshCw className='w-4 h-4' />
            <span>Try Again</span>
          </button>

          <button
            onClick={handleGoHome}
            className='flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all duration-200'
          >
            <Home className='w-4 h-4' />
            <span>Go Home</span>
          </button>
        </div>

        <p className='text-xs text-gray-500 dark:text-gray-400 mt-6'>
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

export const ErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  return (
    <ErrorBoundaryClass fallback={fallback}>
      {children}
    </ErrorBoundaryClass>
  );
};

export default ErrorBoundary;
