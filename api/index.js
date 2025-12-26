import express, { json } from 'express';
import cors from 'cors';
import adminRouter from './router/adminRoute.js';
import userRouter from './router/userRoute.js';
import { ConnectDB } from './utils/dbConnector.js';

const app = express();
app.use(cors());
app.use(json());

ConnectDB();

app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

export default app;
