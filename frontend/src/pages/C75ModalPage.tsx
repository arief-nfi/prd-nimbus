import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { C75Modal } from '../components/C75Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../hooks/use-toast';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface ModalData {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  lastUpdated: string;
  content: string;
}

const C75ModalPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<ModalData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Simulated API call
      const response = await fetch('/api/v1/modal-content/c75');
      if (!response.ok) {
        throw new Error('Failed to fetch modal data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClose = () => {
    setIsOpen(false);
    navigate(-1); // Navigate back when modal closes
  };

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/v1/modal-content/c75', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submission failed');

      toast({
        title: 'Success',
        description: 'Changes saved successfully',
      });
      handleClose();
    } catch (err) {
      toast({
        title: 'Submission Error',
        description: err instanceof Error ? err.message : 'Failed to save changes',
        variant: 'destructive',
      });
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-semibold text-red-600">Error Loading Page</h2>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => fetchData()} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="page-container p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">C.7.5 Modal Management</h1>
          <p className="text-gray-500 mb-8">Manage and configure the C.7.5 modal parameters and content.</p>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-12 w-1/4" />
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-6">
              <p className="mb-4">Current Status: <span className="font-medium capitalize text-blue-600">{data?.status}</span></p>
              <button 
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition-colors"
              >
                Open Configuration Modal
              </button>
            </div>
          )}

          <Suspense fallback={<Skeleton className="fixed inset-0 z-50" />}>
            <C75Modal 
              isOpen={isOpen} 
              onClose={handleClose} 
              onSubmit={handleSubmit}
              initialData={data}
              isLoading={isLoading}
            />
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default C75ModalPage;