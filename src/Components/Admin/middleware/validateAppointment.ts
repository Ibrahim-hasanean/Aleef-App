import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const AppointmentSchema = {
    [Segments.BODY]: Joi.object().keys({
        petId: Joi.string().required(),
        userId: Joi.string().required(),
        report: Joi.string(),
        service: Joi.string().required().valid("visit the vet", "hosting", "grooming"),
        appointmentDate: Joi.date().required(),
        reason: Joi.string().required(),
        doctorId: Joi.string().required(),
    })
}