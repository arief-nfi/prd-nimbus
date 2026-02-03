import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  CircularProgress, 
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import { Add as AddIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import ListViewFilteringTable from '../components/ListViewFilteringTable';
import { ItemService } from '../services/item.service';
import { IItem, IFilterParams } from '../types/item';

const ListViewFilteringPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<IItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filters, setFilters] = useState<IFilterParams>({
    page: 1,
    limit: 10,
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ItemService.getAll(filters);
      setItems(response.data);
      setTotalCount(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    navigate('/b108-list-view-filtering/create');
  };

  const handleView = (id: string) => {
    navigate(`/b108-list-view-filtering/${id}`);
  };

  const handleFilterChange = (newFilters: Partial<IFilterParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/">Dashboard</Link>
          <Typography color="text.primary">Items List</Typography>
        </Breadcrumbs>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              List View & Filtering
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and monitor your system items with advanced filtering capabilities.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            size="large"
            sx={{ borderRadius: 2 }}
          >
            Add New Item
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ position: 'relative', minHeight: '400px' }}>
        {loading && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, bottom: 0, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <ListViewFilteringTable 
          data={items}
          total={totalCount}
          filters={filters}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onView={handleView}
        />
      </Box>
    </Container>
  );
};

export default ListViewFilteringPage;