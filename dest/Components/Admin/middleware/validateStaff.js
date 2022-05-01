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
        licenseNumber: celebrate_1.Joi.string().required(),
        // password: Joi.string().required(),
    })
};
exports.workHouresSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        saturday: celebrate_1.Joi.object().required().keys({
            isActive: celebrate_1.Joi.boolean().required(),
            beginDate: celebrate_1.Joi.date().required(),
            endDate: celebrate_1.Joi.date().required(),
        }).unknown(true),
        sunday: celebrate_1.Joi.object().required().keys({
            isActive: celebrate_1.Joi.boolean().required(),
            beginDate: celebrate_1.Joi.date().required(),
            endDate: celebrate_1.Joi.date().required(),
        }).unknown(true),
        monday: celebrate_1.Joi.object().required().keys({
            isActive: celebrate_1.Joi.boolean().required(),
            beginDate: celebrate_1.Joi.date().required(),
            endDate: celebrate_1.Joi.date().required(),
        }).unknown(true),
        tuesday: celebrate_1.Joi.object().required().keys({
            isActive: celebrate_1.Joi.boolean().required(),
            beginDate: celebrate_1.Joi.date().required(),
            endDate: celebrate_1.Joi.date().required(),
        }).unknown(true),
        wednesday: celebrate_1.Joi.object().required().keys({
            isActive: celebrate_1.Joi.boolean().required(),
            beginDate: celebrate_1.Joi.date().required(),
            endDate: celebrate_1.Joi.date().required(),
        }).unknown(true),
        thursday: celebrate_1.Joi.object().required().keys({
            isActive: celebrate_1.Joi.boolean().required(),
            beginDate: celebrate_1.Joi.date().required(),
            endDate: celebrate_1.Joi.date().required(),
        }).unknown(true),
        friday: celebrate_1.Joi.object().required().keys({
            isActive: celebrate_1.Joi.boolean().required(),
            beginDate: celebrate_1.Joi.date().required(),
            endDate: celebrate_1.Joi.date().required(),
        }).unknown(true),
    })
};
// export const workHouresSchema = {
//     [Segments.BODY]: Joi.object().keys({
//         saturday: Joi.object().required().keys({
//             isActive: Joi.boolean().required(),
//             from: Joi.date().required(),
//             to: Joi.date().required(),
//         }),
//         sunday: Joi.object().required().keys({
//             isActive: Joi.boolean().required(),
//             from: Joi.date().required(),
//             to: Joi.date().required(),
//         }),
//         monday: Joi.object().required().keys({
//             isActive: Joi.boolean().required(),
//             from: Joi.date().required(),
//             to: Joi.date().required(),
//         }),
//         tuesday: Joi.object().required().keys({
//             isActive: Joi.boolean().required(),
//             from: Joi.date().required(),
//             to: Joi.date().required(),
//         }),
//         wednesday: Joi.object().required().keys({
//             isActive: Joi.boolean().required(),
//             from: Joi.date().required(),
//             to: Joi.date().required(),
//         }),
//         thursday: Joi.object().required().keys({
//             isActive: Joi.boolean().required(),
//             from: Joi.date().required(),
//             to: Joi.date().required(),
//         }),
//         friday: Joi.object().required().keys({
//             isActive: Joi.boolean().required(),
//             from: Joi.date().required(),
//             to: Joi.date().required(),
//         }),
//     })
// }
