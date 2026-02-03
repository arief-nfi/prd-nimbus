import { Router, Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { authenticate } from '../middleware/auth';

const router = Router();
const dashboardService = new DashboardService();

router.get('/summary', authenticate, async (req: Request, res: Response) => {
  try {
    const summary = await dashboardService.getProjectSummary(req.user.id);
    return res.status(200).json(summary);
  } catch (error) {
    return res.status(500).json({ 
      message: 'Error retrieving dashboard summary', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;