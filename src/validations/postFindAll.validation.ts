import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';


const querySchema = z.object({
  page: z.string().regex(/^\d+$/),
  order: z.enum(["asc", "desc"]).optional(), 
});

export const validateQueryParams = (req: Request, res: Response, next: NextFunction) => {
    try {
        querySchema.parse(req.query);       
        
        next();
    } catch (error: any) {
        res.status(400).json({ error: error.errors });
    }
};