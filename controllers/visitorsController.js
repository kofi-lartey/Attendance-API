import { Visitor } from "../models/visitorsModal.js";
import { visitorSchemaIn, visitorSchemaOut } from "../schemas/visitorsSchema.js";

export const visitorCheckIn = async (req, res) => {
    try {
        const { error, value } = visitorSchemaIn.validate(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Extract image URLs from uploaded files.
        const imageUrls = req.files?.map(file => file.path) || [];

        // Get the current time for the check-in.
        const now = new Date();
        const clockInTime = now.toTimeString().split(' ')[0];

        // create Vistor
        const visitor = await Visitor.create({
            ...value,
            images: imageUrls,
            date: now,
            checkIn: clockInTime
        })
        console.log('Visitor :', visitor)
        return res.status(200).json({ message: 'Visitor Created Successfully', visitor })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const visitorCheckOut = async (req, res) => {
    try {
        const { error, value } = visitorSchemaOut.validate(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { name, contact } = value;

        // search for a visitor by name and contact
        const findVisitor = await Visitor.findOne({ name, contact })
        if (!findVisitor) {
            return res.status(400).json({ message: 'Visitor not Available, Please create Visitor' })
        }
        // Get today's start and end times to find today's visitors record.
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Find today's attendance record for the specific attendee who was just found.
        // We use the visitor's contact and name to ensure we update the correct record.
        const existingVisitor = await Visitor.findOne({
            name: findVisitor.name.trim(),
            contact: findVisitor.contact.trim(),
            date: {
                $gte: today,
                $lt: tomorrow
            }
        });

        // Check if the record exists before accessing its properties
        if (!existingVisitor) {
            return res.status(400).json({ message: 'Visitor has not checked in today.' });
        }

        // check for checkin before allow checkout
        if (!existingVisitor.checkIn) {
            return res.status(400).json({ message: 'Please CheckIn first' })
        }

        // Get the current time for the check-out.
        const now = new Date();
        const clockOutTime = now.toTimeString().split(' ')[0];

        // Update the existing visitor record with the new check-out time.
        existingVisitor.checkOut = clockOutTime
        await existingVisitor.save();

        console.log('Visitor :', existingVisitor)
        return res.status(200).json({ message: 'Visitor Checkout Successfully', existingVisitor })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getVistors = async (req, res) => {
    try {
        // const {name,contact} = req.body
        // // search for a visitor by name and contact
        const findVisitor = await Visitor.find();
        if (findVisitor.length == 0) {
            return res.status(400).json({ message: 'No visitors at the moment' })
        }
        return res.status(200).json({ message: 'Visitors', findVisitor })

    } catch (error) {
        return res.status(500).json({ message: error.mesage })
    }
}