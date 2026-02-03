import { Router, Request, Response, NextFunction } from 'express';
import { ItemService } from '../services/item.service';

const router = Router();
const itemService = new ItemService();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Assuming user ID is available via auth middleware
    const userId = (req as any).user?.id || 'system-user';
    const result = await itemService.createItem(req.body, userId);
    res.status(201).json(result);
  } catch (error) {
    console.error(`[VR-011] SKU Validation Failure:`, error);
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'system-user';
    const result = await itemService.updateItem(req.params.id, req.body, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;