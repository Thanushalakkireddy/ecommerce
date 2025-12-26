import express, { json } from 'express';
import cors from 'cors';
import adminRouter from './router/adminRoute.js';
import userRouter from './router/userRoute.js';
import { ConnectDB } from './utils/dbConnector.js';

const app = express();

// Configure CORS to allow requests from any origin during development
// In production, you should specify your frontend domain
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(json());

ConnectDB();

app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// For Vercel deployment - need to export the app
export default app;

// For local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8050;
  app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });
}