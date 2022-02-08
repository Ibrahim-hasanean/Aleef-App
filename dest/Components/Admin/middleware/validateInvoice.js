"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorInvoiceSchema = exports.InvoiceSchema = void 0;
const celebrate_1 = require("celebrate");
exports.InvoiceSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        paymentAmount: celebrate_1.Joi.number().required(),
        discount: celebrate_1.Joi.number().default(0),
        appointmentId: celebrate_1.Joi.string().required()
    })
};
exports.doctorInvoiceSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        totalAmount: celebrate_1.Joi.number().required(),
        appointmentId: celebrate_1.Joi.string().required()
    })
};
