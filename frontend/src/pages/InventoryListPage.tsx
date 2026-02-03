import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryListScreen from '../components/InventoryListScreen';
import { Inventory } from '../types/inventory';
import { Alert, CircularProgress, Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const InventoryListPage: React.FC = () => {
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) {
        throw new Error('Failed to fetch inventory data');
      }
      const data = await response.json();
      setInventoryData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleAddNew = () => {
    navigate('/a79-inventory-list-screen/new');
  };

  const handleView = (id: string) => {
    navigate(`/a79-inventory-list-screen/${id}`);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={fetchInventory}>
            RETRY
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Inventory Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          Add New Inventory Item
        </Button>
      </Box>

      <InventoryListScreen
        data={inventoryData}
        onView={handleView}
        onRefresh={fetchInventory}
      />
    </Box>
  );
};

export default InventoryListPage;