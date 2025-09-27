import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AppProviders } from './context';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { UploadPage } from './pages/UploadPage';
import { SearchPage } from './pages/SearchPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { cleanupStaleBlobUrls, clearAllBlobUrls, suppressBlobUrlErrors } from './utils/blobCleanup';

function App() {
  // Clean up any stale blob URLs on app initialization
  React.useEffect(() => {
    // First, suppress blob URL errors globally
    const errorSuppressionCleanup = suppressBlobUrlErrors();
    
    // Then aggressively clear the specific problematic blob URL
    clearAllBlobUrls();
    
    // Finally set up ongoing cleanup
    const cleanup = cleanupStaleBlobUrls();
    
    return () => {
      cleanup();
      errorSuppressionCleanup();
    };
  }, []);
  return (
    <ErrorBoundary>
      <AppProviders>
        <Router>
          <div className='App'>
            <Routes>
              {/* Public Routes */}
              <Route
                path='/login'
                element={
                  <ProtectedRoute requireAuth={false}>
                    <LoginPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/register'
                element={
                  <ProtectedRoute requireAuth={false}>
                    <RegisterPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path='/dashboard'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path='/settings'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SettingsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path='/upload'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <UploadPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path='/search'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SearchPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path='/analytics'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ErrorBoundary>
                        <AnalyticsPage />
                      </ErrorBoundary>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path='/documents'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DocumentsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path='/profile'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ErrorBoundary>
                        <ProfilePage />
                      </ErrorBoundary>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route path='/' element={<Navigate to='/dashboard' replace />} />
              <Route path='*' element={<Navigate to='/dashboard' replace />} />
            </Routes>
          </div>
        </Router>
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
