import { Delivery } from "../models/deliveryModel.js";
import { deliverySchema } from "../schemas/deliverySchema.js";


export const delivery = async (req, res) => {
    try {
        const { error, value } = deliverySchema.validate(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Get the current time for the check-in.
        const now = new Date();

        // create Vistor
        const delivery = await Delivery.create({
            ...value,
            date: now,
        })
        console.log('Delivery Guy :', delivery)
        return res.status(200).json({ message: 'Delivery Created Successfully', delivery })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const getDelivery = async (req,res)=>{
    try {
        // const {name,contact} = req.body
        // // search for a visitor by name and contact
        const ALLdelivery = await Delivery.find();
        if(ALLdelivery.length == 0){
            return res.status(400).json({message:'No Deliveries at the moment'})
        }
        return res.status(200).json({message:'Visitors', ALLdelivery})
        
    } catch (error) {
        return res.status(500).json({message:error.mesage})
    }
}