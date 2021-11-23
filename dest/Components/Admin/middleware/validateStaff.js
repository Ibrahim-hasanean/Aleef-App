"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workHouresSchema = exports.addStaffSchema = exports.validate = void 0;
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
        // password: Joi.string().required(),
    })
};
exports.workHouresSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        saturday: celebrate_1.Joi.object().required().keys({
            isActive: celebrate_1.Joi.boolean().required(),
            from: celebrate_1.Joi.date().required(),
            to: celebrate_1.Joi.date().required(),
        }),
        sunday: celebrate_1.Joi.object().required().keys({
            isActive: celebrate_1.Joi.boolean().required(),
            from: celebrate_1.Joi.date().required(),
            to: celebrate_1.Joi.date().required(),
        }),
        monday: celebrate_1.Joi.object().required().keys({
            isActive: celebrate_1.Joi.boolean().required(),
            from: celebrate_1.Joi.date().required(),
            to: celebrate_1.Joi.date().required(),
        }),
        tuesday: celebrate_1.Joi.object().required().keys({
            isActive: celebrate_1.Joi.boolean().required(),
            from: celebrate_1.Joi.date().required(),
            to: celebrate_1.Joi.date().required(),
        }),
        wednesday: celebrate_1.Joi.object().required().keys({
            isActive: celebrate_1.Joi.boolean().required(),
            from: celebrate_1.Joi.date().required(),
            to: celebrate_1.Joi.date().required(),
        }),
        thursday: celebrate_1.Joi.object().required().keys({
            isActive: celebrate_1.Joi.boolean().required(),
            from: celebrate_1.Joi.date().required(),
            to: celebrate_1.Joi.date().required(),
        }),
        friday: celebrate_1.Joi.object().required().keys({
            isActive: celebrate_1.Joi.boolean().required(),
            from: celebrate_1.Joi.date().required(),
            to: celebrate_1.Joi.date().required(),
        }),
    })
};
