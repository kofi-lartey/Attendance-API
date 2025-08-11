import { Attendance } from "../models/attendanceModel1.js";
import { Attendee } from "../models/attendeeModel.js";
import { checkInattendance, checkOutattendance } from "../schemas/attendanceSchema.js";

// checkIn
export const attendance = async (req, res) => {
    try {

        // Validate the request body.
        const { error, value } = checkInattendance.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Extract image URLs from uploaded files.
        const imageUrls = req.files?.map(file => file.path) || [];

        // Extract the universal ID from the validated input.
        const { ID } = value;

        // Find the user using the universal ID.
        const attendee = await Attendee.findOne({ $or: [{ staffID: ID }, { workID: ID }] });

        // If no attendee is found with the provided ID, return an error.
        if (!attendee) {
            return res.status(400).json({ message: 'Attendee not found' });
        }

        // Get today's start and end times to check for a duplicate attendance record.
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Check if an attendance record already exists for the found attendee today.
        const existingAttendance = await Attendance.findOne({
            staffID: attendee.staffID,
            workID: attendee.workID,
            date: {
                $gte: today,
                $lt: tomorrow
            }
        });

        // If a record already exists, prevent a duplicate check-in.
        if (existingAttendance) {
            return res.status(400).json({
                message: 'Attendance already submitted for today'
            });
        }

        // Get the current time for the check-in.
        const now = new Date();
        const clockInTime = now.toTimeString().split(' ')[0];

        // Define a threshold time (e.g., 9:00 AM) and compare the check-in time.
        const threshold = new Date(`1970-01-01T09:00:00`);
        const actualClockIn = new Date(`1970-01-01T${clockInTime}`);

        let status = 'early';
        if (actualClockIn > threshold) {
            status = 'late';
        } else if (actualClockIn.getTime() === threshold.getTime()) {
            status = 'ontime';
        }

        // Create the new attendance record in the database by explicitly
        // passing the required fields, including the ID from the request.
        const attendanceData = await Attendance.create({
            ID: ID, // <-- This line is added to fix the database validation error
            staffID: attendee.staffID,
            workID: attendee.workID,
            date: now,
            checkIn: clockInTime,
            status,
            images: imageUrls
        });

        // Respond with a success message and the new attendance data.
        return res.status(200).json({
            message: 'Attendance Created Successfully 🎉',
            attendanceData
        });

    } catch (error) {
        // Handle any server-side errors.
        return res.status(500).json({ message: error.message });
    }
};



// checkOut
export const attendanceOut = async (req, res) => {
    try {
        // Validate input using the checkOutattendance schema, which should expect an 'ID'.
        const { error, value } = checkOutattendance.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Extract the universal ID from the validated input.
        const { ID } = value;

        // Check if the attendee exists using the universal ID.
        // The $or operator allows a match if the ID corresponds to either staffID or workID.
        const attendee = await Attendee.findOne({ $or: [{ staffID: ID }, { workID: ID }] });
        if (!attendee) {
            return res.status(400).json({ message: 'Attendee not found' });
        }

        // Get today's start and end times to find today's attendance record.
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Find today's attendance record for the specific attendee who was just found.
        // We use the attendee's staffID and workID to ensure we update the correct record.
        const existingAttendance = await Attendance.findOne({
            staffID: attendee.staffID,
            workID: attendee.workID,
            date: {
                $gte: today,
                $lt: tomorrow
            }
        });

        // If no clock-in record found, the user must check in first.
        if (!existingAttendance) {
            return res.status(400).json({
                message: 'You have not checked in today.'
            });
        }

        // If a check-out time already exists, prevent a second check-out.
        if (existingAttendance.checkOut) {
            return res.status(400).json({
                message: 'You have already checked out today.'
            });
        }

        // Get the current clock-out time.
        const now = new Date();
        const clockOutTime = now.toTimeString().split(' ')[0]; // "HH:MM:SS"

        // Update the existing attendance record with the new check-out time.
        existingAttendance.checkOut = clockOutTime;
        await existingAttendance.save();

        return res.status(200).json({
            message: 'Checked out successfully ✅',
            attendance: existingAttendance
        });

    } catch (error) {
        // Handle any server-side errors.
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
