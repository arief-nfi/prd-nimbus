import { Router } from 'express';
import { prisma } from '../index.js';
import { z } from 'zod';

const router = Router();

// Validation schema
const warehouseSchema = z.object({
  nodeId: z.string(),
  name: z.string(),
  parentId: z.string().uuid().optional(),
  nodeType: z.string(),
  method: z.string(),
  address: z.string(),
  description: z.string().optional(),
  status: z.string(),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
  deletedAt: z.string().datetime().optional(),
  deletedBy: z.string().uuid().optional(),
});

// GET all warehouse
router.get('/', async (req, res) => {
  try {
    const items = await prisma.warehouse.findMany();
    res.json(items);
  } catch (error) {
    console.error('Error fetching warehouse:', error);
    res.status(500).json({ error: 'Failed to fetch warehouse' });
  }
});

// GET single warehouse by id
router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.warehouse.findUnique({
      where: { id: req.params.id },
    });
    if (!item) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching warehouse:', error);
    res.status(500).json({ error: 'Failed to fetch warehouse' });
  }
});

// POST create warehouse
router.post('/', async (req, res) => {
  try {
    const data = warehouseSchema.parse(req.body);
    const item = await prisma.warehouse.create({ data });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating warehouse:', error);
    res.status(500).json({ error: 'Failed to create warehouse' });
  }
});

// PUT update warehouse
router.put('/:id', async (req, res) => {
  try {
    const data = warehouseSchema.partial().parse(req.body);
    const item = await prisma.warehouse.update({
      where: { id: req.params.id },
      data,
    });
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating warehouse:', error);
    res.status(500).json({ error: 'Failed to update warehouse' });
  }
});

// DELETE warehouse
router.delete('/:id', async (req, res) => {
  try {
    await prisma.warehouse.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting warehouse:', error);
    res.status(500).json({ error: 'Failed to delete warehouse' });
  }
});

export default router;
