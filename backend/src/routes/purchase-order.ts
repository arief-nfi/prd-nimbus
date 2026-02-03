import { Router } from 'express';
import { prisma } from '../index.js';
import { z } from 'zod';

const router = Router();

// Validation schema
const purchaseOrderSchema = z.object({
  poId: z.string(),
  poDate: z.string().datetime(),
  supplierId: z.string().uuid(),
  distributionMethod: z.string(),
  warehouseId: z.string().uuid(),
  grandTotal: z.number(),
  paidAmount: z.number().optional(),
  status: z.string().optional(),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

// GET all purchase-order
router.get('/', async (req, res) => {
  try {
    const items = await prisma.purchaseOrder.findMany();
    res.json(items);
  } catch (error) {
    console.error('Error fetching purchase-order:', error);
    res.status(500).json({ error: 'Failed to fetch purchase-order' });
  }
});

// GET single purchase-order by id
router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.purchaseOrder.findUnique({
      where: { id: req.params.id },
    });
    if (!item) {
      return res.status(404).json({ error: 'PurchaseOrder not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching purchase-order:', error);
    res.status(500).json({ error: 'Failed to fetch purchase-order' });
  }
});

// POST create purchase-order
router.post('/', async (req, res) => {
  try {
    const data = purchaseOrderSchema.parse(req.body);
    const item = await prisma.purchaseOrder.create({ data });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating purchase-order:', error);
    res.status(500).json({ error: 'Failed to create purchase-order' });
  }
});

// PUT update purchase-order
router.put('/:id', async (req, res) => {
  try {
    const data = purchaseOrderSchema.partial().parse(req.body);
    const item = await prisma.purchaseOrder.update({
      where: { id: req.params.id },
      data,
    });
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating purchase-order:', error);
    res.status(500).json({ error: 'Failed to update purchase-order' });
  }
});

// DELETE purchase-order
router.delete('/:id', async (req, res) => {
  try {
    await prisma.purchaseOrder.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting purchase-order:', error);
    res.status(500).json({ error: 'Failed to delete purchase-order' });
  }
});

export default router;
