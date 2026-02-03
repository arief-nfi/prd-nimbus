import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ViewModeBehaviorUI from '../components/ViewModeBehaviorUI';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorFallback } from '../components/common/ErrorFallback';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

interface ViewModeData {
  id: string;
  settings: {
    defaultView: 'grid' | 'list' | 'kanban';
    isLocked: boolean;
    showMetadata: boolean;
    density: 'compact' | 'comfortable';
  };
  permissions: string[];
  lastUpdated: string;
}

const ViewModeBehaviorPage: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [data, setData] = useState<ViewModeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ViewModeData>('/view-settings/behavior-config');
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error('Failed to fetch view mode settings'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, authLoading, navigate, fetchData]);

  const handleUpdateSettings = async (newSettings: Partial<ViewModeData['settings']>) => {
    if (!data) return;
    
    try {
      const updatedData = {
        ...data,
        settings: { ...data.settings, ...newSettings }
      };
      // Optimistic update
      setData(updatedData);
      
      await api.patch('/view-settings/behavior-config', newSettings);
    } catch (err) {
      // Rollback on error
      fetchData();
      console.error('Failed to update view mode settings', err);
    }
  };

  const handleResetDefaults = async () => {
    try {
      setIsLoading(true);
      await api.post('/view-settings/behavior-config/reset');
      await fetchData();
    } catch (err) {
      console.error('Failed to reset defaults', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || (isLoading && !data)) {
    return <LoadingSkeleton variant="page-description" />;
  }

  if (error) {
    return <ErrorFallback error={error} resetErrorBoundary={fetchData} />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={fetchData}>
      <div className="view-mode-behavior-container p-6 max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">View Mode Behavior</h1>
          <p className="mt-2 text-sm text-gray-600">
            Configure how different view modes behave across the application, including default states and layout preferences.
          </p>
        </header>

        <Suspense fallback={<LoadingSkeleton variant="component" />}>
          {data && (
            <ViewModeBehaviorUI
              settings={data.settings}
              permissions={data.permissions}
              lastUpdated={data.lastUpdated}
              onUpdateSettings={handleUpdateSettings}
              onReset={handleResetDefaults}
            />
          )}
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default ViewModeBehaviorPage;