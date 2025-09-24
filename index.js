import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import { MONGOURI, PORT } from './config/env.js';
import { attendeeRoute } from './routers/attendeeRouter.js';
import { attendanceRoute } from './routers/attendanceRouter.js';
import { visitorsRouter } from './routers/visitorsRouter.js';
import { deliveryRouter } from './routers/deliveryRouter.js';

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

app.use('/api/V1',attendanceRoute)
app.use('/api/V1',attendeeRoute)
app.use('/api/V1',visitorsRouter)
app.use('/api/V1',deliveryRouter)

// help the app start early
app.get('/api/V1/ping', (req, res) => {
  res.json({ status: "ok" });
});

await mongoose.connect(MONGOURI)

app.listen(PORT, ()=>{
    console.log(`Server running on Port http://localhost:${PORT}`)
})