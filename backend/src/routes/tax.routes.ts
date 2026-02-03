import { Router } from 'express';
import { validateRequest } from '../middleware/validate-request';
2import { TaxValidationSchema } from '../../../shared/validation/tax-schema';

const router = Router();

router.post('/calculate', validateRequest(TaxValidationSchema), (req, res) => {
  try {
    // Business logic here
    res.status(200).json({ success: true, data: req.body });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Processing error' });
  }
});

export default router;