import { Request, Response } from "express";
import { buildLogger } from "../../plugins/logger.plugin";
import { authService } from "../../services/authService";
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken'

const logger = buildLogger('authController.ts')

export const authController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        const service = await authService();
        const userRecord = await service.getUserByUsername(email);
        
        if (!userRecord) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        const passwordMatch = await bcrypt.compare(password, userRecord.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        
        const token = jwt.sign({ userId: userRecord._id }, process.env.JWT_SECRET as Secret, { expiresIn: '1h' });
        const { password: _, ...user } = userRecord;
      
        res.status(200).json({ user, token });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
