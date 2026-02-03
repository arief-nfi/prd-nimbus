import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ViewModeDisplay } from '../components/ViewModeDisplay';
import { Layout } from '../components/layout/Layout';
import { useToast } from '../hooks/useToast';
import { api } from '../services/api';
import { AlertCircle, Loader2 } from 'lucide-react';
import { ViewModeData } from '../types/viewMode';

const B1010ViewModePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [data, setData] = useState<ViewModeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Simulating API call for B.10.10 View Mode content
      const response = await api.get<ViewModeData>(`/api/v1/view-mode/${id || 'default'}`);
      setData(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load page data';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = () => {
    navigate(`/b1010-edit-mode/${id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading view mode details...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
          <div className="bg-destructive/10 p-6 rounded-lg flex flex-col items-center max-w-md text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Unable to Load Data</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">No data found for this view.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 animate-in fade-in duration-500">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">B.10.10 View Mode</h1>
            <p className="text-muted-foreground mt-1">
              Reviewing system configuration and status details
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-input bg-background hover:bg-accent rounded-md transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Edit Mode
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ViewModeDisplay 
            data={data} 
            onRefresh={fetchData}
          />
        </div>
      </div>
    </Layout>
  );
};

export default B1010ViewModePage;