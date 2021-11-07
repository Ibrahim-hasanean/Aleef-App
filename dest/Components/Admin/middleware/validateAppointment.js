"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentSchema = void 0;
const celebrate_1 = require("celebrate");
exports.AppointmentSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        petId: celebrate_1.Joi.string().required(),
        serviceId: celebrate_1.Joi.string().required(),
        appointmentDate: celebrate_1.Joi.date().required(),
        reason: celebrate_1.Joi.string().required(),
        doctorId: celebrate_1.Joi.string().required(),
    })
};
