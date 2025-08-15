import Joi from "joi"

export const checkInattendance = Joi.object({
    checkIn: Joi.string(),
    ID: Joi.string().required(),
    // IP: Joi.string(),
    staffID: Joi.string(),
    workID: Joi.string(),
    date: Joi.date(),
    images: Joi.string(),
    status: Joi.string()
        .valid('early', 'late', 'ontime'),
})

export const checkOutattendance = Joi.object({
    checkOut: Joi.string(),
    ID: Joi.string().required(),
    staffID: Joi.string(),
    workID: Joi.string(),
    date: Joi.date(),
    images: Joi.string()
})