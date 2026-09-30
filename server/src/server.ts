import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import leadRoutes from './routes/lead.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Lead Management API is operational',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/leads', leadRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});
