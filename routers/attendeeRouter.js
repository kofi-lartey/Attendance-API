

import { Router } from "express";
import { adminLoginAtendee, allAttendee, attendee, getAttendee, getAttendeequary, memberLoginAtendee, visitorLoginAtendee } from "../controllers/attendeeController.js";
// import { attendance, getEmployeeWithAttendance, userAttendance } from "../controllers/attendanceController.js";


export const attendeeRoute = Router();

attendeeRoute.post('/attendee',attendee)
attendeeRoute.post('/Admin-attendee',adminLoginAtendee)
attendeeRoute.post('/Member-attendee',memberLoginAtendee)
attendeeRoute.post('/Visitor-attendee',visitorLoginAtendee)
attendeeRoute.get('/attendee',allAttendee)
attendeeRoute.get('/attendee/:id',getAttendee)
attendeeRoute.get('/query-attendee',getAttendeequary) // e.g., /api/V1/attendee?staffID=EMP123 OR ?fullName=John Doe
// attendanceRoute.get('/attendance/:id',)