import express from 'express';
import purchaseOrderRoutes from './routes/purchase-orders';

const app = express();

app.use(express.json());

// Register routes
app.use('/api/purchase-orders', purchaseOrderRoutes);

export default app;