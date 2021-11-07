"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemSchema = void 0;
const celebrate_1 = require("celebrate");
exports.itemSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
        description: celebrate_1.Joi.string().required(),
        price: celebrate_1.Joi.number().required(),
        categoryId: celebrate_1.Joi.string().required(),
        serialNumber: celebrate_1.Joi.string().required(),
        avaliableQuantity: celebrate_1.Joi.number().required(),
        allowed: celebrate_1.Joi.boolean().required(),
        shippingPrice: celebrate_1.Joi.number().required(),
        additionDate: celebrate_1.Joi.date().required()
    })
};
