

import { Router } from "express";
import { allAttendee, attendee, getAttendee, getAttendeequary } from "../controllers/attendeeController.js";
// import { attendance, getEmployeeWithAttendance, userAttendance } from "../controllers/attendanceController.js";


export const attendeeRoute = Router();

attendeeRoute.post('/attendee',attendee)
attendeeRoute.get('/attendee',allAttendee)
attendeeRoute.get('/attendee/:id',getAttendee)
attendeeRoute.get('/query-attendee',getAttendeequary) // e.g., /api/V1/attendee?staffID=EMP123 OR ?fullName=John Doe
// attendanceRoute.get('/attendance/:id',)