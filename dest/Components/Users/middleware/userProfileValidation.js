"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationSettingsSchema = exports.addAddressSchema = exports.changePasswordSchema = exports.updateProfileSchema = exports.validate = void 0;
const celebrate_1 = require("celebrate");
const validate = (schema) => (0, celebrate_1.celebrate)(schema, { abortEarly: false }, { mode: celebrate_1.Modes.FULL });
exports.validate = validate;
exports.updateProfileSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        fullName: celebrate_1.Joi.string().required(),
        phoneNumber: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string()
    })
};
exports.changePasswordSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        currentPassword: celebrate_1.Joi.string().required(),
        newPassword: celebrate_1.Joi.string().required(),
    })
};
exports.addAddressSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        city: celebrate_1.Joi.string().required(),
        street: celebrate_1.Joi.string().required(),
        detailes: celebrate_1.Joi.string(),
    })
};
exports.notificationSettingsSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        muteAllNotification: celebrate_1.Joi.boolean().required(),
        muteChat: celebrate_1.Joi.boolean().required(),
        vaccinationReminder: celebrate_1.Joi.boolean().required(),
        appointmentReminder: celebrate_1.Joi.boolean().required(),
        medacinReminder: celebrate_1.Joi.boolean().required(),
    })
};
