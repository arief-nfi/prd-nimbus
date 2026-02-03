import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CircularProgress, 
  Alert, 
  Breadcrumbs, 
  Link,
  Divider
} from '@mui/material';
import InventoryDetailHeader from '../components/inventory/InventoryDetailHeader';
import WarehouseList from '../components/warehouse/WarehouseList';
import LocationTreeView from '../components/inventory/LocationTreeView';
import InventoryStockTable from '../components/inventory/InventoryStockTable';
import { Inventory, Warehouse, LocationNode } from '../types/inventory';
import { inventoryService } from '../services/inventory.service';

const InventoryViewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
  const [locationTree, setLocationTree] = useState<LocationNode[]>([]);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      
      const [inventoryData, warehouseData] = await Promise.all([
        inventoryService.getInventoryById(id),
        inventoryService.getWarehouses()
      ]);

      setInventory(inventoryData);
      setWarehouses(warehouseData);
      
      if (inventoryData.warehouseId) {
        setSelectedWarehouseId(inventoryData.warehouseId);
        const treeData = await inventoryService.getLocationTree(inventoryData.warehouseId);
        setLocationTree(treeData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleWarehouseSelect = async (warehouseId: string) => {
    setSelectedWarehouseId(warehouseId);
    try {
      const treeData = await inventoryService.getLocationTree(warehouseId);
      setLocationTree(treeData);
    } catch (err) {
      console.error('Failed to load location tree', err);
    }
  };

  const handleLocationSelect = (nodeId: string) => {
    console.log('Selected Location Node:', nodeId);
    // Logic to filter stock table by specific bin/location
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !inventory) {
    return (
      <Box m={3}>
        <Alert severity="error">{error || 'Inventory record not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate('/inventory')} sx={{ cursor: 'pointer' }}>
          Inventory
        </Link>
        <Typography color="text.primary">{inventory.itemId}</Typography>
      </Breadcrumbs>

      <InventoryDetailHeader 
        inventory={inventory} 
        onRefresh={fetchData}
      />

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Warehouses</Typography>
              <Divider sx={{ mb: 2 }} />
              <WarehouseList 
                warehouses={warehouses} 
                selectedId={selectedWarehouseId} 
                onSelect={handleWarehouseSelect} 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Storage Hierarchy</Typography>
              <Divider sx={{ mb: 2 }} />
              <LocationTreeView 
                data={locationTree} 
                onNodeSelect={handleLocationSelect} 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Stock Details</Typography>
              <Divider sx={{ mb: 2 }} />
              <InventoryStockTable 
                inventoryId={inventory.id} 
                warehouseId={selectedWarehouseId} 
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryViewDetailPage;