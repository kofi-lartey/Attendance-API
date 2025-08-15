import { Attendee } from "../models/attendeeModel.js"
import { attendanceloginSchema, attendanceSchema } from "../schemas/attendeeSchema.js"
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
        return res.status(200).json({ message: 'Staff Created', attendance })
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
            return res.status(400).json({ message: 'Staff does not exist' })
        }
        console.log('All Atendance', attendee)
        return res.status(200).json({ message: 'Staff Details', attendee })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getAttendeequary = async (req, res) => {
    try {
        const { query } = req; // e.g., /api/attendee?staffID=EMP123 OR ?fullName=John Doe

        // Check if neither staffID nor fullName nor workID is provided
        if (!query.staffID && !query.fullName && !query.workID) {
            return res.status(400).json({ message: 'Please provide staffID or fullName or workID' });
        }

        // Build search criteria dynamically
        const searchCriteria = {};
        if (query.staffID) searchCriteria.staffID = query.staffID;
        if (query.fullName) searchCriteria.fullName = query.fullName;
        if (query.fullName) searchCriteria.workID = query.workID;

        // Find matching attendees
        const attendees = await Attendee.find(searchCriteria);

        if (attendees.length === 0) {
            return res.status(404).json({ message: 'No Staff found with given details' });
        }

        return res.status(200).json({ message: 'Staff(s) found', attendees });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// login
export const loginAtendee = async (req, res) => {
    try {
        const { error, value } = attendanceloginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Extract the universal ID from the validated input.
        const { ID } = value;

        // Check if the attendee exists using the universal ID.
        // The $or operator allows a match if the ID corresponds to either staffID or workID.
        const attendee = await Attendee.findOne({ $or: [{ staffID: ID }, { workID: ID }] });
        if (!attendee) {
            return res.status(400).json({ message: 'Staff not found' });
        }

        if (!attendee) {
            return res.status(400).json({ message: 'Staff not available. Please create Attendee.' });
        }

        // if (findAttendee.role !== 'admin' || role !== 'admin') {
        //     return res.status(403).json({ message: '❌ You are not an Admin' });
        // }

        console.log('Found User:', attendee);
        return res.status(200).json({ message: 'Login Successfully 🎉', attendee: attendee });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// login as Member
export const memberLoginAtendee = async (req, res) => {
    try {
        const { error, value } = attendanceloginSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }
        const { role, staffID, workID } = value;

        // Find attendee by either staffID or workID
        const findAttendee = await Attendee.findOne({
            $or: [{ staffID }, { workID }],
        });
        if (!findAttendee) {
            return res.status(400).json({ message: 'Attendee not available. Please create Attendee.' });
        }
        // lets check the roles to allow access to it dashboard
        const Attendeerole = findAttendee.role
        if (Attendeerole !== "member" || role !== "member") {
            return res.status(400).json({ message: '❌You are not a Member' })
        }
        console.log('Found User', findAttendee)
        return res.status(200).json({ message: 'Member Login Successfully🎉', findAttendee })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// login as Visitor
export const visitorLoginAtendee = async (req, res) => {
    try {
        const { error, value } = attendanceloginSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }
        const { role, staffID } = value
        // find attendee in the db
        const findAttendee = await Attendee.findOne({ staffID })
        if (!findAttendee) {
            return res.status(400).json({ message: 'Attendee not Available, Please create Attendee' })
        }

        // lets check the roles to allow access to it dashboard
        const Attendeerole = findAttendee.role
        if (Attendeerole !== "visitor" || role !== "visitor") {
            return res.status(400).json({ message: '❌ You are not a Visitor' })
        }
        console.log('Found User', findAttendee)
        return res.status(200).json({ message: 'Visitor Login Successfully🎉', findAttendee })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}