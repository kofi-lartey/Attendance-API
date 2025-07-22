import Joi from "joi";

export const attendanceSchema = Joi.object({
    workID: Joi.string(),
    staffID: Joi.string(),
    fullName: Joi.string().required(),
    position: Joi.string().required(),
    email: Joi.string().required(),
    contact: Joi.string().required(),
    role: Joi.string()
        .valid('admin', 'member', 'visitor')
        .required()
})

export const attendanceloginSchema = Joi.object({
    workID: Joi.string(),
    staffID: Joi.string().required(),
    fullName: Joi.string().required(),
    role: Joi.string()
        .valid('admin', 'member', 'visitor')
        .required()
})
