import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const AppointmentSchema = {
    [Segments.BODY]: Joi.object().keys({
        petId: Joi.string().required(),
        serviceId: Joi.string().required(),
        appointmentDate: Joi.date().required(),
        reason: Joi.string().required(),
        doctorId: Joi.string().required(),
    })
}