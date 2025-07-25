import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import { MONGOURI, PORT } from './config/env.js';
import { attendeeRoute } from './routers/attendeeRouter.js';
import { attendanceRoute } from './routers/attendanceRouter.js';

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

app.use('/api/V1',attendanceRoute)
app.use('/api/V1',attendeeRoute)

await mongoose.connect(MONGOURI)

app.listen(PORT, ()=>{
    console.log(`Server running on Port:${PORT}`)
})