"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateIdParam = exports.appointmentsQuerySchema = exports.AppointmentSchema = void 0;
const celebrate_1 = require("celebrate");
const mongoose_1 = __importDefault(require("mongoose"));
exports.AppointmentSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        petId: celebrate_1.Joi.string().required().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`petId ${value} not valid`);
            return value;
        }, "id validation"),
        userId: celebrate_1.Joi.string().required().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`userId ${value} not valid`);
            return value;
        }, "id validation"),
        report: celebrate_1.Joi.string(),
        service: celebrate_1.Joi.string().required().valid("visit the vet", "hosting", "grooming"),
        appointmentDate: celebrate_1.Joi.date().required(),
        reason: celebrate_1.Joi.string().required(),
        doctorId: celebrate_1.Joi.string().required().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`doctorId ${value} not valid`);
            return value;
        }, "id validation"),
    })
};
exports.appointmentsQuerySchema = {
    [celebrate_1.Segments.QUERY]: celebrate_1.Joi.object().keys({
        petId: celebrate_1.Joi.string().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`petId ${value} not valid id`);
            return value;
        }, "id validation"),
        userId: celebrate_1.Joi.string().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`userId ${value} not valid id`);
            return value;
        }, "id validation"),
        doctorId: celebrate_1.Joi.string().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`doctorId ${value} not valid id`);
            return value;
        }, "id validation"),
        appointmentId: celebrate_1.Joi.string().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`appointmentId ${value} not valid id`);
            return value;
        }, "id validation"),
    }).unknown(true)
};
exports.ValidateIdParam = {
    [celebrate_1.Segments.PARAMS]: celebrate_1.Joi.object().keys({
        id: celebrate_1.Joi.string().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`params id ${value} not valid id`);
            return value;
        }, "id validation"),
        vaccinationId: celebrate_1.Joi.string().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`params vaccinationId ${value} not valid id`);
            return value;
        }, "id validation"),
        medacinId: celebrate_1.Joi.string().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`params medacinId ${value} not valid id`);
            return value;
        }, "id validation")
    }).unknown(true)
};
