import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";


export const paymentSchema = {
    [Segments.BODY]: Joi.object().keys({
        totalPrice: Joi.number().required(),
        itemsCount: Joi.number().required(),
        shippingFees: Joi.number().required(),
        shippingAddressId: Joi.string().required(),
        cardNumber: Joi.string().required(),
        orderItems: Joi.array().required().items(Joi.object().keys({
            count: Joi.number().required(),
            item: Joi.string().required()
        })),
    })
}