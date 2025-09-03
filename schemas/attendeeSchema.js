import Joi from "joi";

export const attendanceSchema = Joi.object({
    workID: Joi.string(),
    staffID: Joi.string(),
    fullName: Joi.string().required(),
    position: Joi.string().required(),
    email: Joi.string()
        .valid('CEO', 'CONSULTANT', 'DEVELOPER', 'MARKETING/SALES OFFICER', 'MARKETING/SALES LEAD', 'OPERATIONS LEAD', 'TECHNICAL LEAD', 'INTERN', 'SERVICE PERSONNEL')
        .required(),
    contact: Joi.string().required(),
    role: Joi.string()
        .valid('admin', 'member', 'visitor')
        .required()
})

export const attendanceloginSchema = Joi.object({
    ID: Joi.string(),
    workID: Joi.string(),
    staffID: Joi.string(),
    fullName: Joi.string().required(),
})
