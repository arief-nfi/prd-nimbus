import { Router, Request, Response } from 'express';
import { SearchQuerySchema } from '../validations/search.schema';
import { MasterDataService } from '../services/master-data.service';

const router = Router();
const service = new MasterDataService();

router.get('/search', async (req: Request, res: Response) => {
  try {
    const validatedInput = SearchQuerySchema.parse({
      query: req.query.q,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    });

    const results = await service.searchNodes(validatedInput);
    return res.json(results);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Maximum sequence reached for Node. Contact administrator.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;