import { Attendance } from "../models/attendanceModel1.js";
import { Attendee } from "../models/attendeeModel.js";
import { checkInattendance, checkOutattendance } from "../schemas/attendanceSchema.js";

// checkIn
export const attendance = async (req, res) => {
    try {

        // Validate input
        const { error, value } = checkInattendance.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { staffID } = value
        // Find user
        const attendee = await Attendee.findOne({ staffID: staffID });
        if (!attendee) {
            return res.status(400).json({ message: 'Attendee not found' });
        }

        // Get today's start and end (for checking duplicates)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const existingAttendance = await Attendance.findOne({
            staffID: staffID,
            date: {
                $gte: today,
                $lt: tomorrow
            }
        });

        if (existingAttendance) {
            return res.status(400).json({
                message: 'Attendance already submitted for today'
            });
        }

        // Get current time
        const now = new Date();
        const clockInTime = now.toTimeString().split(' ')[0]; // "HH:MM:SS"

        // Compare using only time (with fixed base date)
        const threshold = new Date(`1970-01-01T09:00:00`);
        const actualClockIn = new Date(`1970-01-01T${clockInTime}`);

        let status = 'early';
        if (actualClockIn > threshold) {
            status = 'late';
        } else if (actualClockIn.getTime() === threshold.getTime()) {
            status = 'ontime';
        }

        // Create attendance
        const attendanceData = await Attendance.create({
            ...value,
            date: now,
            checkIn: clockInTime,
            status
        });

        return res.status(200).json({
            message: 'Attendance Created Successfully 🎉',
            attendanceData
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// checkOut
export const attendanceOut = async (req, res) => {
    try {
        // Validate input
        const { error, value } = checkOutattendance.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { staffID } = value;

        // Check if the attendee exists
        const attendee = await Attendee.findOne({ staffID });
        if (!attendee) {
            return res.status(400).json({ message: 'Attendee not found' });
        }

        // Get today's start and end
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Find today's attendance record
        const existingAttendance = await Attendance.findOne({
            staffID,
            date: {
                $gte: today,
                $lt: tomorrow
            }
        });

        // If no clock-in record found, user must check in first
        if (!existingAttendance) {
            return res.status(400).json({
                message: 'You have not checked in today.'
            });
        }

        // If already checked out
        if (existingAttendance.checkOut) {
            return res.status(400).json({
                message: 'You have already checked out today.'
            });
        }

        // Get current clock-out time
        const now = new Date();
        const clockOutTime = now.toTimeString().split(' ')[0]; // "HH:MM:SS"

        // Update attendance with check-out time
        existingAttendance.checkOut = clockOutTime;
        await existingAttendance.save();

        return res.status(200).json({
            message: 'Checked out successfully ✅',
            attendance: existingAttendance
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
