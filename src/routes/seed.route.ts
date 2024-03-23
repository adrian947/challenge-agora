import { seedController } from "../controllers/seeder/seedController";
import express from 'express';
const seedRouter = express.Router();

seedRouter.get('/seed', seedController);

export default seedRouter;