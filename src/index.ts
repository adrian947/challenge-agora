import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import { buildLogger } from './plugins/logger.plugin';
import { database } from './config/configDB';

import seedRouter from './routes/seed.route';
import healthRouter from './routes/health.route';
import postsRouter from './routes/posts.route';
import authRouter from './routes/auht.route';

const app = express();

const PORT = process.env.PORT || 5000;

const whitelist = [process.env.URL_BACKEND]
const corsOptions = {
  origin: function (origin: any, callback: any) {        
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api', seedRouter);
app.use('/api', healthRouter);
app.use('/api', postsRouter);
app.use('/api', authRouter);

database.connectToDatabase();

const logger = buildLogger('index.ts')

app.listen(PORT, () => {
    logger.info(`Express server started on port ${PORT}!`);
});
