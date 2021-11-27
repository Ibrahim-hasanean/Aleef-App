"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vaccinationSchema = void 0;
const celebrate_1 = require("celebrate");
exports.vaccinationSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
        dates: celebrate_1.Joi.array().items(celebrate_1.Joi.date()),
        repetition: celebrate_1.Joi.number().default(1),
        notes: celebrate_1.Joi.string(),
    })
};
