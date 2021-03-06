import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const itemSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().default("").allow(''),
        price: Joi.number().required(),
        category: Joi.string().required().valid("toys", "food", "accessories"),
        serialNumber: Joi.number().required(),
        avaliableQuantity: Joi.number().required(),
        allowed: Joi.boolean().default(true),
        shippingPrice: Joi.number().required(),
        additionDate: Joi.date()
    })
}