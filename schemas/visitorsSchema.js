import Joi from "joi";

export const visitorSchemaIn = Joi.object({
    name: Joi.string(),
    purposeOfVisit: Joi.string().valid('PERSONAL','OFFICIAL','UNOFFICIAL','INTERVIEW','MEETING'),
    staffToVisit: Joi.string(),
    contact: Joi.string(),
    date: Joi.date(),
    images: Joi.string(),
    checkIn: Joi.string(),
})

export const visitorSchemaOut = Joi.object({
    name: Joi.string(),
    contact: Joi.string(),
    checkOut: Joi.string()
})