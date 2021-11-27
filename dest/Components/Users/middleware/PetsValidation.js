"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.petSchema = exports.validate = void 0;
const celebrate_1 = require("celebrate");
const validate = (schema) => (0, celebrate_1.celebrate)(schema, { abortEarly: false }, { mode: celebrate_1.Modes.FULL });
exports.validate = validate;
exports.petSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
        serialNumber: celebrate_1.Joi.string().required(),
        age: celebrate_1.Joi.string().required(),
        typeId: celebrate_1.Joi.string().required(),
        breedId: celebrate_1.Joi.string().required(),
        nutried: celebrate_1.Joi.boolean(),
        duerming: celebrate_1.Joi.boolean(),
        gender: celebrate_1.Joi.string().required().valid("male", "female"),
    })
};
