"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addClientSchema = void 0;
const celebrate_1 = require("celebrate");
exports.addClientSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        phoneNumber: celebrate_1.Joi.string().required(),
        fullName: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string(),
        password: celebrate_1.Joi.string().required(),
    })
};
