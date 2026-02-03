import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { C76Form } from '../components/C76Form';
import { Skeleton } from '../components/ui/Skeleton';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import api from '../lib/api';

interface C76FormData {
  id?: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  // Add specific fields based on TASK-076 requirements
}

const C76FormPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<C76FormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Replace with actual endpoint from TASK-076 context
      const response = await api.get<C76FormData>('/api/v1/forms/c76-data');
      setData(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load form data');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch initial data for the form.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (formData: C76FormData) => {
    try {
      setIsSubmitting(true);
      await api.post('/api/v1/forms/c76-save', formData);
      toast({
        title: 'Success',
        description: 'Form C.7.6 has been saved successfully.',
      });
      navigate(-1);
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: err.message || 'An error occurred while saving.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
        <div className="flex justify-end gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <button 
          onClick={() => fetchData()} 
          className="mt-4 text-sm underline text-primary"
        >
          Retry loading
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <C76Form
        initialData={data || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default C76FormPage;