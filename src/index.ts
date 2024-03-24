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

//! whiteList will contain the front-end address. You can also have a different CORS policy for each route.
const whitelist = ['http://example1.com', 'http://example2.com']
const corsOptionsDelegate = function (req: any, callback: any) {
    let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}
cors(corsOptionsDelegate)

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
