import { Router } from 'express';
import { prisma } from '../index.js';
import { z } from 'zod';

const router = Router();

// Validation schema
const poAttachmentSchema = z.object({
  poId: z.string().uuid(),
  filePath: z.string(),
  fileType: z.string().optional(),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

// GET all po-attachment
router.get('/', async (req, res) => {
  try {
    const items = await prisma.poAttachment.findMany();
    res.json(items);
  } catch (error) {
    console.error('Error fetching po-attachment:', error);
    res.status(500).json({ error: 'Failed to fetch po-attachment' });
  }
});

// GET single po-attachment by id
router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.poAttachment.findUnique({
      where: { id: req.params.id },
    });
    if (!item) {
      return res.status(404).json({ error: 'PoAttachment not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching po-attachment:', error);
    res.status(500).json({ error: 'Failed to fetch po-attachment' });
  }
});

// POST create po-attachment
router.post('/', async (req, res) => {
  try {
    const data = poAttachmentSchema.parse(req.body);
    const item = await prisma.poAttachment.create({ data });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating po-attachment:', error);
    res.status(500).json({ error: 'Failed to create po-attachment' });
  }
});

// PUT update po-attachment
router.put('/:id', async (req, res) => {
  try {
    const data = poAttachmentSchema.partial().parse(req.body);
    const item = await prisma.poAttachment.update({
      where: { id: req.params.id },
      data,
    });
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating po-attachment:', error);
    res.status(500).json({ error: 'Failed to update po-attachment' });
  }
});

// DELETE po-attachment
router.delete('/:id', async (req, res) => {
  try {
    await prisma.poAttachment.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting po-attachment:', error);
    res.status(500).json({ error: 'Failed to delete po-attachment' });
  }
});

export default router;
