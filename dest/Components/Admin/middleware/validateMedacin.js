"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMedacinSchema = exports.MedacinSchema = void 0;
const celebrate_1 = require("celebrate");
exports.MedacinSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
        appointmentId: celebrate_1.Joi.string().required(),
        duration: celebrate_1.Joi.number().required(),
        repetition: celebrate_1.Joi.number().default(1),
        notes: celebrate_1.Joi.string(),
    })
};
exports.updateMedacinSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
        duration: celebrate_1.Joi.number().required(),
        repetition: celebrate_1.Joi.number().default(1),
        notes: celebrate_1.Joi.string(),
    })
};
