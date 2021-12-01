"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusSchema = exports.orderSchema = void 0;
const celebrate_1 = require("celebrate");
exports.orderSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        totalPrice: celebrate_1.Joi.number().required(),
        itemsCount: celebrate_1.Joi.number().required(),
        shippingFees: celebrate_1.Joi.number().required(),
        shippingAddressId: celebrate_1.Joi.string().required(),
        cardNumber: celebrate_1.Joi.string().required(),
        userId: celebrate_1.Joi.string().required(),
        status: celebrate_1.Joi.string().valid("pending", "arrived", "in the way", "canceled"),
        orderItems: celebrate_1.Joi.array().required().items(celebrate_1.Joi.object().keys({
            count: celebrate_1.Joi.number().required(),
            item: celebrate_1.Joi.string().required()
        })),
    })
};
exports.orderStatusSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        status: celebrate_1.Joi.string().valid("shipped", "to be shipped", "canceled"),
    })
};
