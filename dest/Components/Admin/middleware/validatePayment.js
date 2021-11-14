"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = void 0;
const celebrate_1 = require("celebrate");
exports.paymentSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        totalAmount: celebrate_1.Joi.number().required(),
        discount: celebrate_1.Joi.number().required(),
        paymentAmmount: celebrate_1.Joi.number().required(),
        exchange: celebrate_1.Joi.number().required(),
        paymentType: celebrate_1.Joi.string().required().valid("cash", "visa"),
        userId: celebrate_1.Joi.string().required(),
        appointmentId: celebrate_1.Joi.string().required(),
    })
};
