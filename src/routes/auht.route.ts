


import express from 'express';
import { authController } from '../controllers/auth/authController';
import { validateLoginData } from '../validations/auth.validation';
const authRouter = express.Router();

authRouter.post('/login', validateLoginData, authController);


export default authRouter;