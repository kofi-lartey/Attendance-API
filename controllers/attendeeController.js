import { Attendee } from "../models/attendeeModel.js"
import { attendanceSchema } from "../schemas/attendeeSchema.js"
import { staffIDGenerator } from "../utils/additionals.js"
import { sendIDEmail } from "../utils/mailer.js"

export const attendee = async (req, res) => {
    try {
        const { error, value } = attendanceSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }
        const { fullName, email, role } = value
        // check if user already exist
        const findUser = await Attendee.findOne({ fullName })
        if (findUser) {
            return res.status(400).json({ message: "Name ALready Exist" })
        }
        // check if user already exist
        const findemail = await Attendee.findOne({ email })
        if (findemail) {
            return res.status(400).json({ message: "Email ALready Exist" })
        }
        // Generate staff IDs
        const staffID = staffIDGenerator(6)
        // crate Attendance
        const attendance = await Attendee.create({
            ...value,
            staffID: staffID
        });
        console.log("Sending email to:", email);
        console.log("Full Name:", fullName);
        console.log("Staff ID:", staffID);
        console.log("Role:", role);
        
        const sendIDmail = await sendIDEmail(email, fullName, staffID, role);
        console.log('Sent Mail', sendIDmail)
        return res.status(200).json({ message: 'Attendance Created', attendance })
    } catch (error) {
        console.log('Error', error)
        return res.status(500).json({ message: error.message })
    }
}


export const allAttendee = async (req, res) => {
    try {
        const attendance = await Attendee.find();
        if (attendance.length == 0) {
            return res.status(400).json({ message: 'Empty' })
        }
        console.log('All Atendance', attendance)
        return res.status(200).json({ message: 'These are all the Members', attendance })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getAttendee = async (req, res) => {
    try {
        const attendeeID = req.params.id;
        const attendee = await Attendee.findById(attendeeID);
        if (!attendee) {
            return res.status(400).json({ message: 'Atendee does not exist' })
        }
        console.log('All Atendance', attendee)
        return res.status(200).json({ message: 'This is your Attendee', attendee })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getAttendeequary = async (req, res) => {
    try {
        const { query } = req; // e.g., /api/attendee?staffID=EMP123 OR ?fullName=John Doe

        // Check if neither staffID nor fullName is provided
        if (!query.staffID && !query.fullName) {
            return res.status(400).json({ message: 'Please provide staffID or fullName' });
        }

        // Build search criteria dynamically
        const searchCriteria = {};
        if (query.staffID) searchCriteria.staffID = query.staffID;
        if (query.fullName) searchCriteria.fullName = query.fullName;

        // Find matching attendees
        const attendees = await Attendee.find(searchCriteria);

        if (attendees.length === 0) {
            return res.status(404).json({ message: 'No attendee found with given details' });
        }

        return res.status(200).json({ message: 'Attendee(s) found', attendees });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

