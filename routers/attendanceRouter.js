
import { Router } from "express";
import { allAtendance, attendance, attendanceOut, checkID, getAttendanceByPeriod, getAttendanceByTimeframe, getSingleAttendeeAttendance, getThisMonthlyAttendance, getThisWeeklyAttendance, getThisYearsAttendance, getTodaysAttendance } from "../controllers/attendanceController.js";
import { multipleImages } from "../utils/uplodFiles.js";

// import { attendance, getEmployeeWithAttendance, userAttendance } from "../controllers/attendanceController.js";


export const attendanceRoute = Router();

attendanceRoute.post('/attendance',multipleImages,attendance)
attendanceRoute.post('/attendance-out',multipleImages,attendanceOut)
attendanceRoute.get('/attendance',allAtendance)
attendanceRoute.get('/attendance-year',getThisYearsAttendance)
attendanceRoute.get('/attendance-month',getThisMonthlyAttendance)
attendanceRoute.get('/attendance-week',getThisWeeklyAttendance)
attendanceRoute.get('/attendance-today',getTodaysAttendance)
attendanceRoute.get('/attendance-timeFrame',getAttendanceByTimeframe)
attendanceRoute.get('/attendance-period',getAttendanceByPeriod)
attendanceRoute.get('/attendance-byID',getSingleAttendeeAttendance)
attendanceRoute.get('/attendance-checkID',checkID)
// attendanceRoute.get('/attendance/:id',)