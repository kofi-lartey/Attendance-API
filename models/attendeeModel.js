import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose'

export const attendeeModel = new Schema({
    workID: {
        type: String,
        // required: true
    },
    staffID: {
        type: String,
        // required: true
    },
    fullName: {
        type: String,
    },
    position: {
        type: String,
        enum: ['CEO', 'CONSULTANT', 'DEVELOPER', 'MARKETING/SALES OFFICER', 'MARKETING/SALES LEAD', 'OPERATIONS LEAD', 'TECHNICAL LEAD', 'INTERN', 'SERVICE PERSONNEL'],
        required: true
    },
    email: {
        type: String,
    },
    contact: {
        type: String,
    },
    date: {
        type: Date,
    },
    role:{
        type: String,
        enum:['admin','member','visitor'],
        required: true
    }
}, { timestamps: true })
attendeeModel.plugin(normalize)

export const Attendee = model('Attendee', attendeeModel)