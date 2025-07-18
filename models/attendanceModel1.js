import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose'

export const attendanceModel = new Schema({
    staffID: {
        type: String,
        required: true
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
    }
}, { timestamps: true })
attendanceModel.plugin(normalize)

export const Attendance = model('Attendance', attendanceModel)