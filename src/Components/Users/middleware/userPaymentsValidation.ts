import { Joi, Segments, } from "celebrate";


export const paymentSchema = {
    [Segments.BODY]: Joi.object().keys({
        totalPrice: Joi.number().required(),
        itemsCount: Joi.number().required(),
        shippingFees: Joi.number().required(),
        shippingAddressId: Joi.string().required(),
        status: Joi.string().valid("pending", "arrived", "in the way", "canceled"),
        paymentType: Joi.string().valid("card", "cash").default("cash"),
        currency: Joi.string().default("usd"),
        // stripeToken: Joi.string(),
        cardNumber: Joi.string(),
        expMonth: Joi.number(),
        expYear: Joi.number(),
        cvc: Joi.string(),
        orderItems: Joi.array().required().items(Joi.object().keys({
            count: Joi.number().required(),
            item: Joi.string().required()
        })),
    })
}