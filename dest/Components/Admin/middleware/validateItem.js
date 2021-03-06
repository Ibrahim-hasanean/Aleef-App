"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemSchema = void 0;
const celebrate_1 = require("celebrate");
exports.itemSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
        description: celebrate_1.Joi.string().default("").allow(''),
        price: celebrate_1.Joi.number().required(),
        category: celebrate_1.Joi.string().required().valid("toys", "food", "accessories"),
        serialNumber: celebrate_1.Joi.number().required(),
        avaliableQuantity: celebrate_1.Joi.number().required(),
        allowed: celebrate_1.Joi.boolean().default(true),
        shippingPrice: celebrate_1.Joi.number().required(),
        additionDate: celebrate_1.Joi.date()
    })
};
