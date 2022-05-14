import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";
import mongoose from "mongoose"

export const orderSchema = {
    [Segments.BODY]: Joi.object().keys({
        totalPrice: Joi.number().required(),
        itemsCount: Joi.number().required(),
        shippingFees: Joi.number().required(),
        shippingAddressId: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`shippingAddressId ${value} not valid id`);
            return value;
        }, "id validation"),
        cardNumber: Joi.string().required(),
        userId: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`userId ${value} not valid id`);
            return value;
        }, "id validation"),
        status: Joi.string(),
        orderItems: Joi.array().required().items(Joi.object().keys({
            count: Joi.number().required(),
            item: Joi.string().required().custom((value, helpers) => {
                if (!mongoose.isValidObjectId(value)) throw new Error(`item ${value} not valid id`);
                return value;
            }, "id validation"),
        })),
    })
}

export const orderStatusSchema = {
    [Segments.BODY]: Joi.object().keys({
        status: Joi.string()
    })
}