import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const orderSchema = {
    [Segments.BODY]: Joi.object().keys({
        totalPrice: Joi.number().required(),
        itemsCount: Joi.number().required(),
        shippingFees: Joi.number().required(),
        shippingAddressId: Joi.string().required(),
        cardNumber: Joi.string().required(),
        userId: Joi.string().required(),
        status: Joi.string().valid("pending", "arrived", "in the way", "canceled"),
        orderItems: Joi.array().required().items(Joi.object().keys({
            count: Joi.number().required(),
            item: Joi.string().required()
        })),
    })
}

export const orderStatusSchema = {
    [Segments.BODY]: Joi.object().keys({
        status: Joi.string().valid("shipped", "to be shipped", "canceled"),
    })
}