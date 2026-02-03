import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        item: true,
        warehouse: true,
        bin: true,
      },
      orderBy: {
        lastReceivedAt: 'desc',
      },
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory records' });
  }
});

export default router;