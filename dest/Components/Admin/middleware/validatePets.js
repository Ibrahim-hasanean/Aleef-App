"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.petSchema = exports.validate = void 0;
const celebrate_1 = require("celebrate");
const mongoose_1 = __importDefault(require("mongoose"));
const validate = (schema) => (0, celebrate_1.celebrate)(schema, { abortEarly: false }, { mode: celebrate_1.Modes.FULL });
exports.validate = validate;
exports.petSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        userId: celebrate_1.Joi.string().required().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`userId ${value} not valid`);
            return value;
        }, "id validation"),
        name: celebrate_1.Joi.string().required(),
        serialNumber: celebrate_1.Joi.string().required(),
        age: celebrate_1.Joi.string().required(),
        typeId: celebrate_1.Joi.string().required().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`typeId ${value} not valid`);
            return value;
        }, "id validation"),
        breedId: celebrate_1.Joi.string().required().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`breedId ${value} not valid`);
            return value;
        }, "id validation"),
        gender: celebrate_1.Joi.string().required().valid("male", "female"),
        nutried: celebrate_1.Joi.boolean(),
        duerming: celebrate_1.Joi.boolean(),
    })
};
