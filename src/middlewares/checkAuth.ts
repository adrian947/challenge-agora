import { NextFunction, Request, Response } from 'express';
import { decodedToken } from '../helpers/decodeJWT';
import { authService } from '../services/authService';

// Extend type Request for include prop user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decode = decodedToken(token);

            const service = await authService();
            const userRecord = await service.getUserById(decode.userId);

            if (!userRecord) {
                return res
                    .status(400)
                    .json({ msg: "invalid token" });
            }
            const { password: _, ...user } = userRecord;
            req.user = user;

            return next();
        } catch (error) {
            return res.status(401).json({ msg: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ msg: 'Invalid token not sent' });
    }
};
