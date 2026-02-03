import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PurchaseOrderCreateForm from '../components/PurchaseOrderCreateForm';
import { createPurchaseOrder } from '../services/purchaseOrderService';
import { getSuppliers } from '../services/supplierService';
import { getInventoryItems } from '../services/inventoryService';
import { Supplier, InventoryItem, PurchaseOrderInput } from '../types/purchaseOrder';
import { toast } from 'react-toastify';
import { Skeleton, Alert, Box, Container, Typography } from '@mui/material';

const PurchaseOrderCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [suppliersData, itemsData] = await Promise.all([
        getSuppliers(),
        getInventoryItems()
      ]);
      setSuppliers(suppliersData);
      setItems(itemsData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load required data for Purchase Order creation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (data: PurchaseOrderInput) => {
    try {
      setIsSubmitting(true);
      await createPurchaseOrder(data);
      toast.success('Purchase Order created successfully');
      navigate('/purchase-orders');
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('Failed to create Purchase Order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width="40%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" action={<button onClick={fetchData}>Retry</button>}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create Purchase Order
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fill in the details below to generate a new purchase order for suppliers.
          </Typography>
        </Box>

        <PurchaseOrderCreateForm
          suppliers={suppliers}
          availableItems={items}
          onSave={handleSave}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </Container>
    </Box>
  );
};

export default PurchaseOrderCreatePage;