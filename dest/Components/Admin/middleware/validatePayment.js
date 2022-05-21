"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = void 0;
const celebrate_1 = require("celebrate");
const mongoose_1 = __importDefault(require("mongoose"));
exports.paymentSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        totalAmount: celebrate_1.Joi.number().required(),
        discount: celebrate_1.Joi.number().required(),
        paymentAmmount: celebrate_1.Joi.number().required(),
        exchange: celebrate_1.Joi.number().required(),
        // paymentType: Joi.string().required().valid("cash", "visa"),
        // userId: Joi.string().required().custom((value, helpers) => {
        //     if (!mongoose.isValidObjectId(value)) throw new Error(`userId ${value} not valid`);
        //     return value;
        // }, "id validation"),
        appointmentId: celebrate_1.Joi.string().required().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`appointmentId ${value} not valid`);
            return value;
        }, "id validation")
    })
};
