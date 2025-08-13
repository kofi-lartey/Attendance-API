import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose'

export const attendanceModel = new Schema({
    ID: {
        type: String,
        required: true,
    },
    staffID: {
        type: String,
    },
    workID: {
        type: String,
    },
    date: {
        type: Date,
    },
    checkIn: {
        type: String,
    },
    checkOut: {
        type: String,
    },
    status: {
        type: String,
        enum: ['early', 'late', 'ontime'],
    },
    images: {
        type: [String],
    },
    position: {
        type: String,
    },
    attendee:{
        type: Schema.Types.ObjectId,
        ref: 'Attendee',
    },
}, { timestamps: true })
attendanceModel.plugin(normalize)

export const Attendance = model('Attendance', attendanceModel)