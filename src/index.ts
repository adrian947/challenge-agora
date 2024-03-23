import express, { Request, Response } from 'express';
import { connectToDatabase } from './config/configDB';
import seedRouter from './routes/seed.route';
import healthRouter from './routes/health.route';
import postsRouter from './routes/posts.route';
import authRouter from './routes/auht.route';
import { buildLogger } from './plugins/logger.plugin';
import 'dotenv/config'

const app = express();
const PORT = 5000;

// app.use(cors());
app.use(express.json());

app.use('/api', seedRouter);
app.use('/api', healthRouter);
app.use('/api', postsRouter);
app.use('/api', authRouter);



connectToDatabase();

const logger = buildLogger('index.ts')

app.listen(PORT, () => {
    logger.info(`Express server started on port ${PORT}!`);
});
