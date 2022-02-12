import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";
import mongoose from "mongoose";

export const paymentSchema = {
    [Segments.BODY]: Joi.object().keys({
        totalAmount: Joi.number().required(),
        discount: Joi.number().required(),
        paymentAmmount: Joi.number().required(),
        exchange: Joi.number().required(),
        paymentType: Joi.string().required().valid("cash", "visa"),
        userId: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`userId ${value} not valid`);
            return value;
        }, "id validation"),
        appointmentId: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`appointmentId ${value} not valid`);
            return value;
        }, "id validation")
    })
}
