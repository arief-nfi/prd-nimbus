import { Router } from 'express';
import { prisma } from '../index.js';
import { z } from 'zod';

const router = Router();

// Validation schema
const supplierSchema = z.object({
  suppId: z.string(),
  name: z.string(),
  picName: z.string(),
  address: z.string(),
  phone: z.string(),
  status: z.string().optional(),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
  deletedAt: z.string().datetime().optional(),
  deletedBy: z.string().uuid().optional(),
});

// GET all supplier
router.get('/', async (req, res) => {
  try {
    const items = await prisma.supplier.findMany();
    res.json(items);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

// GET single supplier by id
router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.supplier.findUnique({
      where: { id: req.params.id },
    });
    if (!item) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

// POST create supplier
router.post('/', async (req, res) => {
  try {
    const data = supplierSchema.parse(req.body);
    const item = await prisma.supplier.create({ data });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

// PUT update supplier
router.put('/:id', async (req, res) => {
  try {
    const data = supplierSchema.partial().parse(req.body);
    const item = await prisma.supplier.update({
      where: { id: req.params.id },
      data,
    });
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Failed to update supplier' });
  }
});

// DELETE supplier
router.delete('/:id', async (req, res) => {
  try {
    await prisma.supplier.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});

export default router;
