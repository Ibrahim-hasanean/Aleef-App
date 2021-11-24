"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserItemListSchema = exports.userItemListSchema = void 0;
const celebrate_1 = require("celebrate");
exports.userItemListSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        count: celebrate_1.Joi.number().required(),
        itemId: celebrate_1.Joi.string().required()
    })
};
exports.updateUserItemListSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        count: celebrate_1.Joi.number().required(),
    })
};
