"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusSchema = exports.orderSchema = void 0;
const celebrate_1 = require("celebrate");
const mongoose_1 = __importDefault(require("mongoose"));
exports.orderSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        totalPrice: celebrate_1.Joi.number().required(),
        itemsCount: celebrate_1.Joi.number().required(),
        shippingFees: celebrate_1.Joi.number().required(),
        shippingAddressId: celebrate_1.Joi.string().required().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`shippingAddressId ${value} not valid id`);
            return value;
        }, "id validation"),
        cardNumber: celebrate_1.Joi.string().required(),
        userId: celebrate_1.Joi.string().required().custom((value, helpers) => {
            if (!mongoose_1.default.isValidObjectId(value))
                throw new Error(`userId ${value} not valid id`);
            return value;
        }, "id validation"),
        status: celebrate_1.Joi.string(),
        orderItems: celebrate_1.Joi.array().required().items(celebrate_1.Joi.object().keys({
            count: celebrate_1.Joi.number().required(),
            item: celebrate_1.Joi.string().required().custom((value, helpers) => {
                if (!mongoose_1.default.isValidObjectId(value))
                    throw new Error(`item ${value} not valid id`);
                return value;
            }, "id validation"),
        })),
    })
};
exports.orderStatusSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        status: celebrate_1.Joi.string()
    })
};
