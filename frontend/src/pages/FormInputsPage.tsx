import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInputsContainer } from '../components/FormInputsContainer';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../hooks/use-toast';
import { api } from '../lib/api';

interface FormInputsData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  role: string;
  newsletter: boolean;
}

const FormInputsPage: React.FC = () => {
  const [data, setData] = useState<FormInputsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<FormInputsData>('/api/form-inputs/current');
      setData(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load form data');
      toast({
        title: 'Error',
        description: 'Could not fetch the required information.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (formData: FormInputsData) => {
    try {
      setIsSaving(true);
      await api.post('/api/form-inputs/save', formData);
      toast({
        title: 'Success',
        description: 'Form inputs saved successfully.',
      });
      setData(formData);
    } catch (err: any) {
      toast({
        title: 'Save Failed',
        description: err.message || 'An error occurred while saving.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-12 w-1/4" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">Error Loading Page</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <button 
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">C.7.2 Form Inputs</h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile information and system preferences.
        </p>
      </div>

      <FormInputsContainer 
        initialData={data || undefined}
        isSubmitting={isSaving}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default FormInputsPage;