import { Router } from 'express';
import { prisma } from '../index.js';
import { z } from 'zod';

const router = Router();

// Validation schema
const inventorySchema = z.object({
  itemId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  binId: z.string().uuid().optional(),
  qtyOnHand: z.number(),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

// GET all inventory
router.get('/', async (req, res) => {
  try {
    const items = await prisma.inventory.findMany();
    res.json(items);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// GET single inventory by id
router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.inventory.findUnique({
      where: { id: req.params.id },
    });
    if (!item) {
      return res.status(404).json({ error: 'Inventory not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// POST create inventory
router.post('/', async (req, res) => {
  try {
    const data = inventorySchema.parse(req.body);
    const item = await prisma.inventory.create({ data });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating inventory:', error);
    res.status(500).json({ error: 'Failed to create inventory' });
  }
});

// PUT update inventory
router.put('/:id', async (req, res) => {
  try {
    const data = inventorySchema.partial().parse(req.body);
    const item = await prisma.inventory.update({
      where: { id: req.params.id },
      data,
    });
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating inventory:', error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

// DELETE inventory
router.delete('/:id', async (req, res) => {
  try {
    await prisma.inventory.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting inventory:', error);
    res.status(500).json({ error: 'Failed to delete inventory' });
  }
});

export default router;
