import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const postSchema = z.object({
  quote: z.string({
    required_error: "Quote is required",
    invalid_type_error: "Quote must be a string",
  }),

});

export const validateCreateUpdatePostData = (req: Request, res: Response, next: NextFunction) => {
  try {    
    postSchema.parse(req.body);
    next();
  } catch (error: any) {    
    res.status(400).json({ error: error.errors });
  }
};
