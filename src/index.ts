import express, { Request, Response } from 'express';
import { connectToDatabase } from './config/configDB';
import seedRouter from './routes/seed.route';
import healthRouter from './routes/health.route';
import postsRouter from './routes/posts.route';



const app = express();
const PORT = 5000;

// app.use(cors());
app.use(express.json());

app.use('/api', seedRouter);
app.use('/api', healthRouter);
app.use('/api', postsRouter);



connectToDatabase();


app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto!! ${PORT}`);
});
