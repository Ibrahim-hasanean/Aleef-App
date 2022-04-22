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
        // totalAmount: Joi.number().required(),
        // discount: Joi.number().required(),
        // paymentAmmount: Joi.number().required(),
        // exchange: Joi.number().required(),
        appointmentId: celebrate_1.Joi.string().required(),
        // currency: Joi.string().default("usd"),
        paymentIntentId: celebrate_1.Joi.string().required(),
    })
};
