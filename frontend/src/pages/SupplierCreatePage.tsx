import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupplierCreateForm } from '../components/SupplierCreateForm';
import { useToast } from '../hooks/use-toast';
import { supplierService } from '../services/supplier.service';
import { SupplierCreateInput } from '../types/supplier';
import { MainLayout } from '../layouts/MainLayout';
import { ErrorBoundary } from '../components/ErrorBoundary';

const SupplierCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = useCallback(async (data: SupplierCreateInput) => {
    setIsSubmitting(true);
    try {
      await supplierService.create(data);
      toast({
        title: 'Success',
        description: 'Supplier created successfully.',
        variant: 'default',
      });
      navigate('/suppliers');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create supplier.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, toast]);

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <MainLayout title="A.7.3 Supplier Create Screen">
      <div className="container mx-auto py-6">
        <ErrorBoundary>
          <div className="bg-white shadow-md rounded-lg p-6">
            <header className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Create New Supplier</h1>
              <p className="text-sm text-gray-500">Fill in the details below to register a new supplier in the system.</p>
            </header>
            
            <SupplierCreateForm 
              onSave={handleSave} 
              onCancel={handleCancel} 
              isLoading={isSubmitting} 
            />
          </div>
        </ErrorBoundary>
      </div>
    </MainLayout>
  );
};

export default SupplierCreatePage;