import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link, 
  Alert, 
  Snackbar, 
  CircularProgress 
} from '@mui/material';
import UomListTable from '../components/UomListTable';
import { Uom } from '../types/uom';

const UomListPage: React.FC = () => {
  const navigate = useNavigate();
  const [uoms, setUoms] = useState<Uom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchUoms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/uoms');
      if (!response.ok) {
        throw new Error('Failed to fetch Units of Measure');
      }
      const data = await response.json();
      setUoms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUoms();
  }, [fetchUoms]);

  const handleAddNew = () => {
    navigate('/a78-uom-list-screen/create');
  };

  const handleView = (id: string) => {
    navigate(`/a78-uom-list-screen/view/${id}`);
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  if (loading && uoms.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.primary">UOM List</Typography>
        </Breadcrumbs>
        <Typography variant="h4" component="h1" sx={{ mt: 2, fontWeight: 'bold' }}>
          A.7.8 UOM List Screen
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <UomListTable 
        data={uoms} 
        onAddNew={handleAddNew} 
        onView={handleView} 
        isLoading={loading}
      />

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

export default UomListPage;