import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Alert, 
  Snackbar, 
  Paper 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ItemListComponent from '../components/ItemList';
import { Item } from '../types/item';

const ItemListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/items');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAddNew = () => {
    navigate('/a76-item-list-screen/create');
  };

  const handleView = (id: string) => {
    navigate(`/a76-item-list-screen/view/${id}`);
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Item List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          Add New Item
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2}>
        <ItemListComponent 
          items={items} 
          onView={handleView} 
          onRefresh={fetchItems}
        />
      </Paper>

      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {notification ? (
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};

export default ItemListScreen;