import Joi from "joi";

export const deliverySchema = Joi.object({
    name: Joi.string(),
    staffName: Joi.string(),
    packageStatus: Joi.string().valid('OPEN','ENCLOSED'),
    packageRecipient: Joi.string(),
    contact: Joi.string(),
    date: Joi.date(),
})