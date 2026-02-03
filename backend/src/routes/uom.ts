import { Router, Request, Response } from 'express';
import { UomService } from '../services/uom.service';

const router = Router();
const uomService = new UomService();

router.get('/active', async (req: Request, res: Response) => {
  try {
    const data = await uomService.getActiveUoms();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.patch('/:id/deactivate', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await uomService.validateDeactivation(id);
    // Proceed with update logic if validation passes
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({ 
      error: 'Validation Error', 
      message: error.message 
    });
  }
});

export default router;