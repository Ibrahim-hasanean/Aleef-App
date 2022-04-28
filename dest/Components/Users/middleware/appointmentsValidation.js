"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentPaymentSchema = exports.AppointmentSchema = void 0;
const celebrate_1 = require("celebrate");
exports.AppointmentSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        petId: celebrate_1.Joi.string().required(),
        service: celebrate_1.Joi.string().required().valid("visit the vet", "hosting", "grooming"),
        appointmentDate: celebrate_1.Joi.date().required(),
        reason: celebrate_1.Joi.string().required(),
        // doctorId: Joi.string().required(),
    })
};
exports.appointmentPaymentSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        totalAmount: celebrate_1.Joi.number().required(),
        discount: celebrate_1.Joi.number().required(),
        paymentAmmount: celebrate_1.Joi.number().required(),
        exchange: celebrate_1.Joi.number().required(),
        appointmentId: celebrate_1.Joi.string().required(),
        currency: celebrate_1.Joi.string().default("usd"),
        stripeToken: celebrate_1.Joi.string().required(),
    })
};
