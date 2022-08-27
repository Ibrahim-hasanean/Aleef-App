"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = void 0;
const celebrate_1 = require("celebrate");
exports.paymentSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        totalPrice: celebrate_1.Joi.number().required(),
        itemsCount: celebrate_1.Joi.number().required(),
        shippingFees: celebrate_1.Joi.number().required(),
        shippingAddressId: celebrate_1.Joi.string().required(),
        status: celebrate_1.Joi.string().valid("pending", "arrived", "in the way", "canceled"),
        paymentType: celebrate_1.Joi.string().valid("card", "cash").default("cash"),
        currency: celebrate_1.Joi.string().default("usd"),
        // stripeToken: Joi.string(),
        cardNumber: celebrate_1.Joi.string(),
        expMonth: celebrate_1.Joi.number(),
        expYear: celebrate_1.Joi.number(),
        cvc: celebrate_1.Joi.string(),
        cardHolderName: celebrate_1.Joi.string(),
        orderItems: celebrate_1.Joi.array().required().items(celebrate_1.Joi.object().keys({
            count: celebrate_1.Joi.number().required(),
            item: celebrate_1.Joi.string().required()
        })),
    })
};
