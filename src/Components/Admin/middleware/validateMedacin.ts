import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const MedacinSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        appointmentId: Joi.string().required(),
        duration: Joi.number().required(),
        repetition: Joi.number().default(1),
        notes: Joi.string(),
    })
}

export const updateMedacinSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        duration: Joi.number().required(),
        repetition: Joi.number().default(1),
        notes: Joi.string(),
    })
}
