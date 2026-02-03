import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

const FormInputsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
  role: z.string(),
  newsletter: z.boolean().default(false),
});

router.get('/current', async (req: Request, res: Response) => {
  try {
    // In a real app, fetch from database using Prisma
    // const data = await prisma.userProfile.findUnique({ where: { userId: req.user.id } });
    const mockData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      bio: 'Software Engineer based in San Francisco.',
      role: 'developer',
      newsletter: true,
    };
    res.json(mockData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/save', async (req: Request, res: Response) => {
  try {
    const validatedData = FormInputsSchema.parse(req.body);
    // In a real app, update database using Prisma
    // await prisma.userProfile.update({ ... });
    res.status(200).json({ message: 'Success', data: validatedData });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to save data' });
  }
});

export default router;