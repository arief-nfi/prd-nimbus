import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  CircularProgress, 
  Alert, 
  Snackbar,
  Breadcrumbs,
  Link
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PurchaseOrderListTable from '../components/PurchaseOrderListTable';
import { PurchaseOrder } from '../types/purchase-order';

const PurchaseOrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchPurchaseOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/purchase-orders');
      if (!response.ok) {
        throw new Error('Failed to fetch purchase orders');
      }
      const data = await response.json();
      setPurchaseOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  const handleAddNew = () => {
    navigate('/b70-purchase-order-list-screen/new');
  };

  const handleView = (id: string) => {
    navigate(`/b70-purchase-order-list-screen/${id}`);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading && purchaseOrders.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', margin: '0 auto' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link underline="hover" color="inherit" href="/">
              Dashboard
            </Link>
            <Typography color="text.primary">Purchase Orders</Typography>
          </Breadcrumbs>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Purchase Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and track your procurement processes
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{ borderRadius: 2, px: 3 }}
        >
          New Purchase Order
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
        <PurchaseOrderListTable 
          data={purchaseOrders} 
          onView={handleView} 
          onRefresh={fetchPurchaseOrders}
          isLoading={loading}
        />
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PurchaseOrderListPage;