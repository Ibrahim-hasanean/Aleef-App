"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentIntentSchema = void 0;
const celebrate_1 = require("celebrate");
exports.paymentIntentSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        totalPrice: celebrate_1.Joi.number().required(),
        currency: celebrate_1.Joi.string().required(),
    })
};
