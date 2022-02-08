import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const InvoiceSchema = {
    [Segments.BODY]: Joi.object().keys({
        paymentAmount: Joi.number().required(),
        discount: Joi.number().default(0),
        appointmentId: Joi.string().required()
    })
}

export const doctorInvoiceSchema = {
    [Segments.BODY]: Joi.object().keys({
        totalAmount: Joi.number().required(),
        appointmentId: Joi.string().required()
    })
}

