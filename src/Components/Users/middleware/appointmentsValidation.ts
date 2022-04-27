import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const AppointmentSchema = {
    [Segments.BODY]: Joi.object().keys({
        petId: Joi.string().required(),
        service: Joi.string().required().valid("visit the vet", "hosting", "grooming"),
        appointmentDate: Joi.date().required(),
        reason: Joi.string().required(),
        // doctorId: Joi.string().required(),
    })
}


export const appointmentPaymentSchema = {
    [Segments.BODY]: Joi.object().keys({
        totalAmount: Joi.number().required(),
        discount: Joi.number().required(),
        paymentAmmount: Joi.number().required(),
        exchange: Joi.number().required(),
        appointmentId: Joi.string().required(),
        currency: Joi.string().default("usd"),
        stripeToken: Joi.string().required(),
    })
}