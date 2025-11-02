import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRouter from './router/adminRoute.js';
import userRouter from './router/userRoute.js';
import { ConnectDB } from './utils/dbConnector.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

ConnectDB();

app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

app.listen(process.env.PORT, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});
