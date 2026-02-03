import { Router } from 'express';
import warehouseRoutes from './warehouse.js';
import supplierRoutes from './supplier.js';
import itemRoutes from './item.js';
import uomRoutes from './uom.js';
import purchaseOrderRoutes from './purchase-order.js';
import purchaseOrderLineItemRoutes from './purchase-order-line-item.js';
import inventoryRoutes from './inventory.js';

const router = Router();

router.use('/warehouse', warehouseRoutes);
router.use('/supplier', supplierRoutes);
router.use('/item', itemRoutes);
router.use('/uom', uomRoutes);
router.use('/purchase-order', purchaseOrderRoutes);
router.use('/purchase-order-line-item', purchaseOrderLineItemRoutes);
router.use('/inventory', inventoryRoutes);

export default router;
