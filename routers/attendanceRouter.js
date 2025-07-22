
import { Router } from "express";
import { allAtendance, attendance, attendanceOut, getSingleAttendeeAttendance, getTodaysAttendance } from "../controllers/attendanceController.js";
import { multipleImages } from "../utils/uplodFiles.js";

// import { attendance, getEmployeeWithAttendance, userAttendance } from "../controllers/attendanceController.js";


export const attendanceRoute = Router();

attendanceRoute.post('/attendance',multipleImages,attendance)
attendanceRoute.post('/attendance-out',multipleImages,attendanceOut)
attendanceRoute.get('/attendance',allAtendance)
attendanceRoute.get('/attendance-today',getTodaysAttendance)
attendanceRoute.get('/attendance-byID',getSingleAttendeeAttendance)
// attendanceRoute.get('/attendance/:id',)