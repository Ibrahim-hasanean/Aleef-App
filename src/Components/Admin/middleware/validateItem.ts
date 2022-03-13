import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const itemSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().required().valid("toys", "food", "accessories"),
        serialNumber: Joi.string().required(),
        avaliableQuantity: Joi.number().required(),
        allowed: Joi.boolean().required(),
        shippingPrice: Joi.number().required(),
        additionDate: Joi.date()
    })
}