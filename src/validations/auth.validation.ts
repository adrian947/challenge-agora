import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const validateLoginData = (req: Request, res: Response, next: NextFunction) => {
  try {    
    loginSchema.parse(req.body);
    next();
  } catch (error: any) {    
    res.status(400).json({ error: error.errors });
  }
};
