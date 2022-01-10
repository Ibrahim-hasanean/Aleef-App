"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceSchema = void 0;
const celebrate_1 = require("celebrate");
exports.InvoiceSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        paymentAmount: celebrate_1.Joi.number().required(),
        appointmentId: celebrate_1.Joi.string().required(),
        userId: celebrate_1.Joi.string().required(),
        reason: celebrate_1.Joi.string(),
    })
};
