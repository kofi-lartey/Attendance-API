import { Attendance } from "../models/attendanceModel1.js";
import { Attendee } from "../models/attendeeModel.js";
import { checkInattendance, checkOutattendance } from "../schemas/attendanceSchema.js";
// import pkg from 'ipaddr.js';
// const ipaddr = pkg;



// At the top of your file, import the 'ipaddr.js' library.

export const attendance = async (req, res) => {
    try {

        // // Define an array of allowed IP ranges in CIDR notation.
        // // IMPORTANT: You must replace these example CIDR ranges with the actual ranges
        // // provided by your company's network administrator or ISP.
        // const allowedCIDRs = ['192.168.100.0/24', '203.0.113.0/29'];

        // // Get the IP address of the client making the request.
        // const clientIP = req.ip;

        // // This flag will be true if the IP is within any of the allowed ranges.
        // let isIPAllowed = false;

        // // First, check if the IP is a local loopback address.
        // // This is necessary for testing on a local machine using Postman.
        // if (clientIP === '::1' || clientIP === '127.0.0.1') {
        //     isIPAllowed = true;
        // } else {
        //     // Use a try...catch block to handle potential errors from invalid IP formats.
        //     let clientAddress;
        //     try {
        //         // This processes the IP address string and returns an object
        //         // that represents either an IPv4 or IPv6 address.
        //         clientAddress = ipaddr.parse(clientIP);
        //     } catch (error) {
        //         // If the IP address is invalid, return an error message immediately.
        //         console.error(`Error parsing IP address "${clientIP}":`, error.message);
        //         return res.status(400).json({
        //             message: 'Invalid client IP address format.'
        //         });
        //     }

        //     // Iterate through the array of allowed CIDR ranges.
        //     for (const cidr of allowedCIDRs) {
        //         // ipaddr.js has a specific method for checking if an IP is in a subnet.
        //         // We first parse the CIDR string to get the range.
        //         const range = ipaddr.parseCIDR(cidr);
        //         // Check if the client's IP is within the current range.
        //         if (clientAddress.match(range)) {
        //             isIPAllowed = true;
        //             break; // Exit the loop once a match is found.
        //         }
        //     }
        // }

        // If the IP is not in any of the allowed ranges, reject the request.
        // if (!isIPAllowed) {
        //     return res.status(403).json({
        //         message: 'Attendance can only be submitted from an allowed company network.'
        //     });
        // }

        // Validate the request body using your Joi schema.
        const { error, value } = checkInattendance.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Extract image URLs from uploaded files.
        const imageUrls = req.files?.map(file => file.path) || [];

        // Extract the universal ID from the validated input.
        const { ID } = value;

        // Find the user using the universal ID.
        const attendee = await Attendee.findOne({
            $or: [{ staffID: ID }, { workID: ID }]
        });

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
            ID: ID,
            staffID: attendee.staffID,
            workID: attendee.workID,
            date: now,
            checkIn: clockInTime,
            status,
            position: attendee.position,
            images: imageUrls,
            // IP: clientIP // <-- Added this line to save the IP
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

// export const getThisYearsAttendance = async (req, res) => {
//     try {
//         // Get the year from the request body
//         const { year } = req.body;

//         // Check if the year is a valid number
//         if (typeof year !== 'number' || isNaN(year)) {
//             return res.status(400).json({ success: false, message: 'Invalid year provided.' });
//         }

//         // Set the start date to January 1st of the specified year
//         const startOfYear = new Date(year, 0, 1);

//         // Set the end date to December 31st of the specified year
//         const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

//         const attendanceRecords = await Attendance.find({
//             createdAt: {
//                 $gte: startOfYear,
//                 $lte: endOfYear,
//             },
//         }).populate('attendee');

//         res.status(200).json({ success: true, data: attendanceRecords });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

export const getThisYearsAttendance = async (req, res) => {
    try {
        
        const today = new Date();
        const year = today.getFullYear();

        // Set time to start of the year (January 1st, 00:00:00)
        const startOfYear = new Date(year, 0, 1);
        // Set time to end of the year (December 31st, 23:59:59)
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

        const attendanceRecords = await Attendance.find({
            createdAt: {
                $gte: startOfYear,
                $lte: endOfYear,
            },
        }).populate('attendee');

        res.status(200).json({ success: true, data: attendanceRecords });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getThisMonthlyAttendance = async (req, res) => {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        // Start of the current month
        const startOfMonth = new Date(year, month, 1);

        // End of the current month
        // We get the first day of the next month and subtract 1 millisecond.
        const endOfMonth = new Date(year, month + 1, 1);
        endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

        const attendanceRecords = await Attendance.find({
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth,
            },
        }).populate('attendee');

        res.status(200).json({ success: true, data: attendanceRecords });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getThisWeeklyAttendance = async (req, res) => {
    try {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Calculate the start of the week (Sunday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);

        // Calculate the end of the week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const attendanceRecords = await Attendance.find({
            createdAt: {
                $gte: startOfWeek,
                $lte: endOfWeek,
            },
        }).populate('attendee');

        res.status(200).json({ success: true, data: attendanceRecords });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAttendanceByTimeframe = async (req, res) => {
    try {
        const { year, month, day, week } = req.body;
        let startDate, endDate;

        if (year && month && day) {
            // Case 1: Daily Attendance
            startDate = new Date(year, month - 1, day);
            endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
        } else if (year && month) {
            // Case 2: Monthly Attendance
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0, 23, 59, 59, 999);
        } else if (year && week) {
            // Case 3: Weekly Attendance
            // Logic to calculate the start and end dates of the specified week
            const startOfYear = new Date(year, 0, 1);
            const firstDayOfWeek = startOfYear.getDay();
            const daysSinceFirstMonday = (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1); // ISO 8601 week starts on Monday
            const startOfWeekDate = new Date(startOfYear.setDate(startOfYear.getDate() - daysSinceFirstMonday + (week - 1) * 7));
            
            startDate = startOfWeekDate;
            endDate = new Date(startOfWeekDate.setDate(startOfWeekDate.getDate() + 6));
            endDate.setHours(23, 59, 59, 999);
        } else if (year) {
            // Case 4: Yearly Attendance
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31, 23, 59, 59, 999);
        } else {
            // Default: Today's Attendance
            const today = new Date();
            startDate = new Date(today.setHours(0, 0, 0, 0));
            endDate = new Date(today.setHours(23, 59, 59, 999));
        }

        const attendanceRecords = await Attendance.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
        }).populate('attendee');

        res.status(200).json({ success: true, data: attendanceRecords });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAttendanceByPeriod = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        // Validation for date strings
        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'Both startDate and endDate are required.' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Check for valid date objects
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid date format provided.' });
        }

        // Set the end date to the last millisecond of the day
        end.setHours(23, 59, 59, 999);

        const attendanceRecords = await Attendance.find({
            createdAt: {
                $gte: start,
                $lte: end,
            },
        }).populate('attendee');

        if (attendanceRecords.length === 0) {
            return res.status(400).json({ message: 'No attendance records found for the specified period.' });
        }

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
