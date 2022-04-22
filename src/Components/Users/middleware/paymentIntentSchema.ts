import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const paymentIntentSchema = {
    [Segments.BODY]: Joi.object().keys({
        totalPrice: Joi.number().required(),
        currency: Joi.string().required(),
    })
}
