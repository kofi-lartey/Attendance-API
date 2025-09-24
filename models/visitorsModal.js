import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose'
export const visitorsModal = new Schema({
    name:{
        type: String
    },
    purposeOfVisit:{
        type: String,
        enum:['PERSONAL','OFFICIAL','UNOFFICIAL','INTERVIEW','MEETING']
    },
    staffToVisit:{
        type: String
    },
    contact:{
        type: String
    },
    checkIn: {
        type: String,
    },
    checkOut: {
        type: String,
    },
    images: {
        type: [String],
    },
    date: {
        type: Date,
    },
},{timestamps:true});
visitorsModal.plugin(normalize);

export const Visitor = model('Visitor',visitorsModal)