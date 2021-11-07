"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.validate = void 0;
const celebrate_1 = require("celebrate");
const validate = (schema) => (0, celebrate_1.celebrate)(schema, { abortEarly: false }, { mode: celebrate_1.Modes.FULL });
exports.validate = validate;
exports.loginSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        phoneNumber: celebrate_1.Joi.string().required(),
        password: celebrate_1.Joi.string().required(),
    })
};
