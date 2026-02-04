import { Request, Response, NextFunction } from 'express';

/**
 * Authentication middleware
 * In a production app, this would verify JWT tokens or session cookies
 * For now, it's a placeholder that allows all requests through
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement actual authentication logic
  // Example: verify JWT token from Authorization header
  // const token = req.headers.authorization?.split(' ')[1];
  // if (!token) {
  //   return res.status(401).json({ error: 'No token provided' });
  // }
  // 
  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = decoded;
  //   next();
  // } catch (error) {
  //   return res.status(401).json({ error: 'Invalid token' });
  // }

  // For development: Allow all requests through
  // Add mock user to request if needed for testing
  (req as any).user = {
    id: '00000000-0000-0000-0000-000000000000',
    email: 'dev@example.com',
    role: 'admin'
  };
  
  next();
};

/**
 * Optional authentication middleware
 * Attempts to authenticate but doesn't block if authentication fails
 */
export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  // Similar to authenticate but doesn't return 401
  (req as any).user = null;
  next();
};

/**
 * Role-based authorization middleware
 * Use after authenticate middleware
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  };
};
