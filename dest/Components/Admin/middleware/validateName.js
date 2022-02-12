"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameTypeSchema = exports.nameSchema = void 0;
const celebrate_1 = require("celebrate");
const mongoose_1 = __importDefault(require("mongoose"));
exports.nameSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
    })
};
exports.nameTypeSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
        typeId: celebrate_1.Joi.string().required().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`typeId ${value} not valid`);
            return value;
        }, "id validation"),
    })
};
