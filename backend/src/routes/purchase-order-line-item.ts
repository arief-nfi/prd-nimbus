import { Router } from 'express';
import { prisma } from '../index.js';
import { z } from 'zod';

const router = Router();

// Validation schema
const purchaseOrderLineItemSchema = z.object({
  poId: z.string().uuid(),
  itemId: z.string().uuid(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalAmount: z.number(),
});

// GET all purchase-order-line-item
router.get('/', async (req, res) => {
  try {
    const items = await prisma.purchaseOrderLineItem.findMany();
    res.json(items);
  } catch (error) {
    console.error('Error fetching purchase-order-line-item:', error);
    res.status(500).json({ error: 'Failed to fetch purchase-order-line-item' });
  }
});

// GET single purchase-order-line-item by id
router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.purchaseOrderLineItem.findUnique({
      where: { id: req.params.id },
    });
    if (!item) {
      return res.status(404).json({ error: 'PurchaseOrderLineItem not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching purchase-order-line-item:', error);
    res.status(500).json({ error: 'Failed to fetch purchase-order-line-item' });
  }
});

// POST create purchase-order-line-item
router.post('/', async (req, res) => {
  try {
    const data = purchaseOrderLineItemSchema.parse(req.body);
    const item = await prisma.purchaseOrderLineItem.create({ data });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating purchase-order-line-item:', error);
    res.status(500).json({ error: 'Failed to create purchase-order-line-item' });
  }
});

// PUT update purchase-order-line-item
router.put('/:id', async (req, res) => {
  try {
    const data = purchaseOrderLineItemSchema.partial().parse(req.body);
    const item = await prisma.purchaseOrderLineItem.update({
      where: { id: req.params.id },
      data,
    });
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating purchase-order-line-item:', error);
    res.status(500).json({ error: 'Failed to update purchase-order-line-item' });
  }
});

// DELETE purchase-order-line-item
router.delete('/:id', async (req, res) => {
  try {
    await prisma.purchaseOrderLineItem.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting purchase-order-line-item:', error);
    res.status(500).json({ error: 'Failed to delete purchase-order-line-item' });
  }
});

export default router;
