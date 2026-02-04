import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/warehouse
 * Fetches all warehouses, optionally as a tree structure
 */
router.get('/', async (req, res) => {
  try {
    const { tree } = req.query;
    
    // Fetch all warehouses with their relationships
    const warehouses = await prisma.warehouse.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (tree === 'true') {
      // Build tree structure - find root nodes (no parent)
      const rootWarehouses = warehouses.filter(w => !w.parentId);
      
      // Helper function to build tree recursively
      const buildTree = (parentId: string | null): any[] => {
        return warehouses
          .filter(w => w.parentId === parentId)
          .map(warehouse => ({
            ...warehouse,
            children: buildTree(warehouse.id),
          }));
      };

      const treeData = rootWarehouses.map(warehouse => ({
        ...warehouse,
        children: buildTree(warehouse.id),
      }));

      return res.json(treeData);
    }

    return res.json(warehouses);
  } catch (error) {
    console.error('[WarehouseListError]:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch warehouses' 
    });
  }
});

/**
 * GET /api/warehouse/:id
 * Fetches a single warehouse by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const warehouse = await prisma.warehouse.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    return res.json(warehouse);
  } catch (error) {
    console.error('[WarehouseFetchError]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch warehouse',
    });
  }
});

/**
 * POST /api/warehouse
 * Creates a new warehouse node
 */
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    
    // Create warehouse
    const warehouse = await prisma.warehouse.create({
      data: {
        nodeId: data.nodeId,
        name: data.name,
        nodeType: data.nodeType,
        method: data.method || 'DIRECT',
        address: data.address,
        status: data.status || 'ACTIVE',
        parentId: data.parentId || null,
        createdBy: data.createdBy || 'system',
        updatedBy: data.updatedBy || 'system',
      },
    });

    return res.status(201).json({ success: true, data: warehouse });
  } catch (error) {
    console.error('[WarehouseCreateError]:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to create warehouse' 
    });
  }
});

export default router;