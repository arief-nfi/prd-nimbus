import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Container, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import { Inventory, Warehouse, ShoppingCart, People } from '@mui/icons-material';

// Simple Home/Dashboard component
const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        PRD Nimbus - Inventory Management System
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Warehouse sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">Warehouses</Typography>
              </Box>
              <Button variant="contained" fullWidth href="/warehouses">
                Manage Warehouses
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">Suppliers</Typography>
              </Box>
              <Button variant="contained" fullWidth href="/suppliers">
                Manage Suppliers
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Inventory sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">Items</Typography>
              </Box>
              <Button variant="contained" fullWidth href="/items">
                Manage Items
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ShoppingCart sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">Purchase Orders</Typography>
              </Box>
              <Button variant="contained" fullWidth href="/purchase-orders">
                View Orders
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Quick Links
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
          <Button variant="outlined" href="/inventory">Inventory</Button>
          <Button variant="outlined" href="/uoms">Units of Measure</Button>
        </Box>
      </Paper>
    </Container>
  );
};

// Lazy load pages
const POItemListPage = lazy(() => import('./pages/POItemListPage'));
const PurchaseOrderListPage = lazy(() => import('./pages/PurchaseOrderListPage'));
const SupplierListScreen = lazy(() => import('./pages/SupplierListScreen'));
const ItemListScreen = lazy(() => import('./pages/ItemListScreen'));
const WarehouseListPage = lazy(() => import('./pages/WarehouseListPage'));
const InventoryListScreen = lazy(() => import('./pages/InventoryListScreen'));
const UomListScreen = lazy(() => import('./pages/UomListScreen'));

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      }>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<HomePage />} />
          
          {/* Purchase Orders */}
          <Route path="/purchase-orders" element={<PurchaseOrderListPage />} />
          <Route path="/b72-po-item-list" element={<POItemListPage />} />
          
          {/* Master Data */}
          <Route path="/suppliers" element={<SupplierListScreen />} />
          <Route path="/items" element={<ItemListScreen />} />
          <Route path="/warehouses" element={<WarehouseListPage />} />
          <Route path="/uoms" element={<UomListScreen />} />
          
          {/* Inventory */}
          <Route path="/inventory" element={<InventoryListScreen />} />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;