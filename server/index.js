import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';
import weatherRoutes from './routes/api/weather.js';
import recordRoutes from './routes/api/records.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"));

app.use('/api/weather', weatherRoutes);
app.use('/api/records', recordRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
