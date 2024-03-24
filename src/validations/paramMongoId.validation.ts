import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const isValidObjectId = (value: string) => {
    try {
        new ObjectId(value);
        return true;
    } catch (error) {
        return false;
    }
};

const mongoIdSchema = z.string().refine(isValidObjectId, {
    message: 'Invalid MongoDB ObjectId format',
});

const querySchema = z.object({
    id: mongoIdSchema,
});

export const validateMongoId = (req: Request, res: Response, next: NextFunction) => {
    try {
        querySchema.parse(req.params);
        next();
    } catch (error: any) {
        res.status(400).json({ error: error.errors });
    }
};
