import React from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WarehouseSchema, WarehouseInput } from '../../../../backend/src/validation/warehouse.schema';
import { FormField } from '../../components/common/FormField';

export const CreateWarehouseForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WarehouseInput>({
    resolver: zodResolver(WarehouseSchema),
    defaultValues: {
      nodeType: 'Warehouse',
      status: 'Active'
    }
  });

  const onSubmit = async (data: WarehouseInput) => {
    try {
      console.log('Submitting Warehouse Data:', data);
      // API call logic here
    } catch (error) {
      console.error('Validation Failure Log:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">Create Node</h2>
      
      <FormField 
        label="Node Type" 
        required 
        error={errors.nodeType?.message}
        htmlFor="nodeType"
      >
        <select
          {...register('nodeType')}
          id="nodeType"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="Warehouse">Warehouse</option>
          <option value="DC">Distribution Center</option>
          <option value="Store">Store</option>
        </select>
      </FormField>

      <FormField 
        label="Node ID" 
        required 
        error={errors.nodeId?.message}
        htmlFor="nodeId"
      >
        <input
          {...register('nodeId')}
          id="nodeId"
          placeholder="e.g. WH0001"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </FormField>

      <FormField 
        label="Warehouse Name" 
        required 
        error={errors.name?.message}
        htmlFor="name"
      >
        <input
          {...register('name')}
          id="name"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Saving...' : 'Create Warehouse'}
      </button>
    </form>
  );
};