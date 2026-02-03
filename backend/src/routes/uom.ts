import { Router } from 'express';
import { prisma } from '../index.js';
import { z } from 'zod';

const router = Router();

// Validation schema
const uomSchema = z.object({
  uomId: z.string(),
  code: z.string(),
  name: z.string(),
  status: z.string().optional(),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
  deletedAt: z.string().datetime().optional(),
  deletedBy: z.string().uuid().optional(),
});

// GET all uom
router.get('/', async (req, res) => {
  try {
    const items = await prisma.uom.findMany();
    res.json(items);
  } catch (error) {
    console.error('Error fetching uom:', error);
    res.status(500).json({ error: 'Failed to fetch uom' });
  }
});

// GET single uom by id
router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.uom.findUnique({
      where: { id: req.params.id },
    });
    if (!item) {
      return res.status(404).json({ error: 'Uom not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching uom:', error);
    res.status(500).json({ error: 'Failed to fetch uom' });
  }
});

// POST create uom
router.post('/', async (req, res) => {
  try {
    const data = uomSchema.parse(req.body);
    const item = await prisma.uom.create({ data });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating uom:', error);
    res.status(500).json({ error: 'Failed to create uom' });
  }
});

// PUT update uom
router.put('/:id', async (req, res) => {
  try {
    const data = uomSchema.partial().parse(req.body);
    const item = await prisma.uom.update({
      where: { id: req.params.id },
      data,
    });
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating uom:', error);
    res.status(500).json({ error: 'Failed to update uom' });
  }
});

// DELETE uom
router.delete('/:id', async (req, res) => {
  try {
    await prisma.uom.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting uom:', error);
    res.status(500).json({ error: 'Failed to delete uom' });
  }
});

export default router;
