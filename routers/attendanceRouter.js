
import { Router } from "express";
import { allAtendance, attendance, attendanceOut, getSingleAttendeeAttendance, getTodaysAttendance } from "../controllers/attendanceController.js";

// import { attendance, getEmployeeWithAttendance, userAttendance } from "../controllers/attendanceController.js";


export const attendanceRoute = Router();

attendanceRoute.post('/attendance',attendance)
attendanceRoute.post('/attendance-out',attendanceOut)
attendanceRoute.get('/attendance',allAtendance)
attendanceRoute.get('/attendance-today',getTodaysAttendance)
attendanceRoute.get('/attendance-byID',getSingleAttendeeAttendance)
// attendanceRoute.get('/attendance/:id',)