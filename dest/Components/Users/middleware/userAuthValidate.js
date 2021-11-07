"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCodeSchema = exports.resetPasswordSchema = exports.forgetPasswordSchema = exports.loginSchema = exports.registerSchema = exports.validate = void 0;
const celebrate_1 = require("celebrate");
// phoneNumber: Joi.any().when('email', { is: undefined, then: Joi.number().required(), otherwise: Joi.optional() }),
//     email: Joi.any().when('phoneNumber', { is: undefined, then: Joi.number().required(), otherwise: Joi.optional() }),
const validate = (schema) => (0, celebrate_1.celebrate)(schema, { abortEarly: false }, { mode: celebrate_1.Modes.FULL });
exports.validate = validate;
exports.registerSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        phoneNumber: celebrate_1.Joi.string().required(),
        fullName: celebrate_1.Joi.string().required(),
        password: celebrate_1.Joi.string().required(),
    })
};
exports.loginSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        phoneNumber: celebrate_1.Joi.string().required(),
        password: celebrate_1.Joi.string().required(),
    })
};
exports.forgetPasswordSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        phoneNumber: celebrate_1.Joi.string().required(),
    })
};
exports.resetPasswordSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        phoneNumber: celebrate_1.Joi.string().required(),
        code: celebrate_1.Joi.string().required(),
        newPassword: celebrate_1.Joi.string().required(),
    })
};
exports.verifyCodeSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        phoneNumber: celebrate_1.Joi.string().required(),
        code: celebrate_1.Joi.string().required(),
    })
};
