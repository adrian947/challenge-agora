import { Response, Request } from "express";
import express from 'express';
const healthRouter = express.Router();

healthRouter.get('/health', (req: Request, res: Response) => {    
    res.status(200).json({ status: 'UP' });
});

export default healthRouter;