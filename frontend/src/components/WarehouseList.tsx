import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import {
  ChevronRight,
  ExpandMore,
  Add as AddIcon,
  Visibility as EyeIcon,
  Warehouse as WarehouseIcon,
} from '@mui/icons-material';

interface Warehouse {
  id: string;
  nodeId: string;
  name: string;
  nodeType: string;
  address: string;
  status: string;
  children?: Warehouse[];
}

interface WarehouseRowProps {
  warehouse: Warehouse;
  level: number;
  onView: (id: string) => void;
}

const WarehouseRow: React.FC<WarehouseRowProps> = ({ warehouse, level, onView }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = warehouse.children && warehouse.children.length > 0;

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'error';
      case 'MAINTENANCE': return 'warning';
      default: return 'default';
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Box display="flex" alignItems="center" pl={level * 3}>
            {hasChildren ? (
              <IconButton size="small" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ExpandMore /> : <ChevronRight />}
              </IconButton>
            ) : (
              <Box width={40} />
            )}
            <WarehouseIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">{warehouse.name}</Typography>
          </Box>
        </TableCell>
        <TableCell>{warehouse.nodeId}</TableCell>
        <TableCell>
          <Chip label={warehouse.nodeType} size="small" variant="outlined" />
        </TableCell>
        <TableCell>{warehouse.address}</TableCell>
        <TableCell>
          <Chip label={warehouse.status} size="small" color={getStatusColor(warehouse.status)} />
        </TableCell>
        <TableCell align="right">
          <IconButton size="small" onClick={() => onView(warehouse.id)}>
            <EyeIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      {isExpanded && hasChildren && warehouse.children?.map((child) => (
        <WarehouseRow key={child.id} warehouse={child} level={level + 1} onView={onView} />
      ))}
    </>
  );
};

export const WarehouseListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/warehouse?tree=true');
      if (!response.ok) throw new Error('Failed to fetch warehouse data');
      const data = await response.json();
      setWarehouses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: string) => {
    navigate(`/warehouses/${id}`);
  };

  const handleCreate = () => {
    navigate('/warehouses/create');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          <Typography variant="h6">Error Loading Warehouses</Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Warehouses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Create Warehouse
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Node ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary" py={4}>
                    No warehouses found. Click "Create Warehouse" to add one.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              warehouses.map((warehouse) => (
                <WarehouseRow
                  key={warehouse.id}
                  warehouse={warehouse}
                  level={0}
                  onView={handleView}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
