"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStaffSchema = exports.validate = void 0;
const celebrate_1 = require("celebrate");
const validate = (schema) => (0, celebrate_1.celebrate)(schema, { abortEarly: false }, { mode: celebrate_1.Modes.FULL });
exports.validate = validate;
exports.addStaffSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
        cardNumber: celebrate_1.Joi.string().required(),
        phoneNumber: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().required(),
        role: celebrate_1.Joi.string().required().valid("admin", "doctor", "storeManager", "receiption"),
        staffMemberId: celebrate_1.Joi.string().required(),
        password: celebrate_1.Joi.string().required(),
    })
};
