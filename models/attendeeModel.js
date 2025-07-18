import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose'

export const attendeeModel = new Schema({
    staffID: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
    },
    position: {
        type: String,
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
        enum:['admin','member','vistor'],
        required: true
    }
}, { timestamps: true })
attendeeModel.plugin(normalize)

export const Attendee = model('Attendee', attendeeModel)