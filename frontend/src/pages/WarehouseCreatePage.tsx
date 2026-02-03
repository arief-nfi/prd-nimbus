import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import WarehouseCreateForm from '../components/WarehouseCreateForm';
import { WarehouseService } from '../services/warehouse.service';
import { WarehouseCreateInput } from '../types/warehouse';
import { Layout } from '../components/layout/Layout';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Skeleton } from '../components/ui/Skeleton';

const WarehouseCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [parentWarehouses, setParentWarehouses] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoadingInitialData(true);
        const warehouses = await WarehouseService.getAll({ status: 'ACTIVE' });
        setParentWarehouses(warehouses.map(w => ({ id: w.id, name: w.name })));
      } catch (error) {
        console.error('Failed to fetch parent warehouses:', error);
        toast.error('Failed to load required data. Please refresh.');
      } finally {
        setIsLoadingInitialData(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSave = async (data: WarehouseCreateInput) => {
    try {
      setIsSubmitting(true);
      await WarehouseService.create(data);
      toast.success('Warehouse created successfully');
      navigate('/warehouses');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to create warehouse';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (isLoadingInitialData) {
    return (
      <Layout>
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Inventory', href: '/inventory' },
              { label: 'Warehouses', href: '/warehouses' },
              { label: 'Create Warehouse', active: true },
            ]}
          />
          <div className="mt-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create New Warehouse</h1>
            <p className="text-sm text-gray-500">
              Configure a new storage location in the system.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <WarehouseCreateForm
            onSubmit={handleSave}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            parentOptions={parentWarehouses}
          />
        </div>
      </div>
    </Layout>
  );
};

export default WarehouseCreatePage;