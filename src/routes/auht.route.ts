


import express from 'express';
import { authController } from '../controllers/auth/authController';
const authRouter = express.Router();

authRouter.post('/login', authController);


export default authRouter;