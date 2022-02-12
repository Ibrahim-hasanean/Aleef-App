"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorInvoiceSchema = exports.InvoiceSchema = void 0;
const celebrate_1 = require("celebrate");
const mongoose_1 = __importDefault(require("mongoose"));
exports.InvoiceSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        paymentAmount: celebrate_1.Joi.number().required(),
        discount: celebrate_1.Joi.number().default(0),
        appointmentId: celebrate_1.Joi.string().required().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`appointmentId ${value} not valid`);
            return value;
        }, "id validation")
    })
};
exports.doctorInvoiceSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        totalAmount: celebrate_1.Joi.number().required(),
        appointmentId: celebrate_1.Joi.string().required().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`appointmentId ${value} not valid`);
            return value;
        }, "id validation")
    })
};
