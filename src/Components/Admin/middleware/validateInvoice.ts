import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const InvoiceSchema = {
    [Segments.BODY]: Joi.object().keys({
        paymentAmount: Joi.number().required(),
        appointmentId: Joi.string().required(),
        userId: Joi.string().required(),
        reason: Joi.string(),
    })
}

