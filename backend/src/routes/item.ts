import { Router } from 'express';
import { prisma } from '../index.js';
import { z } from 'zod';

const router = Router();

// Validation schema
const itemSchema = z.object({
  sku: z.string(),
  brand: z.string().optional(),
  name: z.string(),
  uomId: z.string().uuid(),
  status: z.string(),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
  deletedAt: z.string().datetime().optional(),
  deletedBy: z.string().uuid().optional(),
});

// GET all item
router.get('/', async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// GET single item by id
router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.item.findUnique({
      where: { id: req.params.id },
    });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// POST create item
router.post('/', async (req, res) => {
  try {
    const data = itemSchema.parse(req.body);
    const item = await prisma.item.create({ data });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT update item
router.put('/:id', async (req, res) => {
  try {
    const data = itemSchema.partial().parse(req.body);
    const item = await prisma.item.update({
      where: { id: req.params.id },
      data,
    });
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE item
router.delete('/:id', async (req, res) => {
  try {
    await prisma.item.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;
