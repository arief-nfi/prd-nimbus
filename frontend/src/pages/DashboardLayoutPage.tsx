import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Skeleton } from '../components/common/Skeleton';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface DashboardMetrics {
  totalUsers: number;
  activeSessions: number;
  systemHealth: number;
  revenue: number;
}

const DashboardLayoutPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Mock API call - replace with actual service call
      const response = await fetch('/api/v1/dashboard/summary');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
      fetchDashboardData();
    }
  }, [isAuthenticated, authLoading, navigate, fetchDashboardData]);

  if (authLoading || (isLoading && !metrics)) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error Loading Dashboard</p>
          <p>{error}</p>
          <button 
            onClick={() => fetchDashboardData()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<Skeleton className="h-screen w-full" />}>
        <DashboardLayout 
          user={user} 
          data={metrics} 
          onRefresh={fetchDashboardData} 
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default DashboardLayoutPage;