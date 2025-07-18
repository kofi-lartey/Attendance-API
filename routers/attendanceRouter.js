

import { Router } from "express";
import { attendance, attendanceOut } from "../controllers/attendanceController.js";

// import { attendance, getEmployeeWithAttendance, userAttendance } from "../controllers/attendanceController.js";


export const attendanceRoute = Router();

attendanceRoute.post('/attendance',attendance)
attendanceRoute.post('/attendance-out',attendanceOut)
// attendanceRoute.get('/attendance/:id',)