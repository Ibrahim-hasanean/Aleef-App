"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardInfoSchema = exports.validate = void 0;
const celebrate_1 = require("celebrate");
const validate = (schema) => (0, celebrate_1.celebrate)(schema, { abortEarly: false }, { mode: celebrate_1.Modes.FULL });
exports.validate = validate;
exports.cardInfoSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        cardNumber: celebrate_1.Joi.string().required(),
        cardHolderName: celebrate_1.Joi.string().required(),
    })
};
