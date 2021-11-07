import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const paymentSchema = {
    [Segments.BODY]: Joi.object().keys({
        totalAmount: Joi.number().required(),
        discount: Joi.number().required(),
        paymentAmmount: Joi.number().required(),
        exchange: Joi.number().required(),
        paymentType: Joi.string().required().valid("cash", "visa"),
        userId: Joi.string().required(),
    })
}
