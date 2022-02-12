"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMedacinSchema = exports.MedacinSchema = void 0;
const celebrate_1 = require("celebrate");
const mongoose_1 = __importDefault(require("mongoose"));
exports.MedacinSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
        appointmentId: celebrate_1.Joi.string().required().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`appointmentId ${value} not valid id`);
            return value;
        }, "id validation"),
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
