"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameTypeSchema = exports.nameSchema = void 0;
const celebrate_1 = require("celebrate");
exports.nameSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
    })
};
exports.nameTypeSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
        typeId: celebrate_1.Joi.string().required(),
    })
};
