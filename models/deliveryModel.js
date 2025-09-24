import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose'
export const deliveryModal = new Schema({
    name:{
        type: String
    },
    staffName:{
        type: String
    },
    packageStatus:{
        type: String,
        enum:['OPEN','ENCLOSED']
    },
    packageRecipient:{
        type: String,
    },
    contact:{
        type: String
    },
    date: {
        type: String,
    },
},{timestamps:true});
deliveryModal.plugin(normalize);

export const Delivery = model('Delivery',deliveryModal)