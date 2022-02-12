import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";
import mongoose from "mongoose";
export const InvoiceSchema = {
    [Segments.BODY]: Joi.object().keys({
        paymentAmount: Joi.number().required(),
        discount: Joi.number().default(0),
        appointmentId: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`appointmentId ${value} not valid`);
            return value;
        }, "id validation")
    })
}

export const doctorInvoiceSchema = {
    [Segments.BODY]: Joi.object().keys({
        totalAmount: Joi.number().required(),
        appointmentId: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`appointmentId ${value} not valid`);
            return value;
        }, "id validation")
    })
}

