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

        // Step 1: Extract image URLs
        const imageUrls = req.files?.map(file => file.path) || [];

        const { staffID, workID } = value
        // Find user
        const attendee = await Attendee.findOne({ $or: [{ staffID }, { workID }] });
        if (!attendee) {
            return res.status(400).json({ message: 'Attendee not found' });
        }

        // Get today's start and end (for checking duplicates)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const existingAttendance = await Attendance.findOne({
            staffID: attendee.staffID,
            workID: attendee.workID,
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

        const StaffID = attendee.staffID
        const WorkID = attendee.workID
        // Create attendance
        const attendanceData = await Attendance.create({
            ...value,
            staffID: StaffID,
            workID: WorkID,
            date: now,
            checkIn: clockInTime,
            status,
            images: imageUrls
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

        // Step 1: Extract image URLs
        const imageUrls = req.files?.map(file => file.path) || [];

        const { staffID, workID } = value;

        // Check if the attendee exists
        const attendee = await Attendee.findOne({ $or: [{ staffID }, { workID }] });
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
            $or: [{ staffID }, { workID }],
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
        existingAttendance.images = imageUrls
        await existingAttendance.save();

        return res.status(200).json({
            message: 'Checked out successfully ✅',
            attendance: existingAttendance
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const allAtendance = async (req, res) => {
    try {
        const attendance = await Attendance.find().populate('attendee')
        if (attendance.length == 0) {
            return res.status(400).json({ message: 'No attendance' })
        }
        return res.status(200).json({ messgae: 'These are all the Attendance', attendance })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


export const getTodaysAttendance = async (req, res) => {
    try {
        const today = new Date();

        // Set time to start of the day (00:00:00)
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        // Set time to end of the day (23:59:59)
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const attendanceRecords = await Attendance.find({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        }).populate('attendee'); // optional: if you want employee details

        res.status(200).json({ success: true, data: attendanceRecords });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getSingleAttendeeAttendance = async (req, res) => {
    try {
        const { staffID, workID } = req.body
        // search for the id inputed from the body
        const findID = await Attendee.findOne({ $or: [{ staffID }, { workID }] })
        if (!findID) {
            return res.status(400).json({ message: 'Invalid or Non-Existing ID' })
        }
        // get all the users attendance
        const getAttendance = await Attendance.find({ $or: [{ staffID }, { workID }] }).populate('attendee')
        if (getAttendance.length == 0) {
            return res.status(400).json({ message: "no attendance for this ID" })
        }
        return res.status(200).json({ message: `All Attendance for ${staffID}:`, getAttendance })
    } catch (error) {
        return res.status(500).json({ message: error.message })

    }
}
