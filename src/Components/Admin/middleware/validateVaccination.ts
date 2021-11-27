import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const vaccinationSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        dates: Joi.array().items(Joi.date()),
        repetition: Joi.number().default(1),
        notes: Joi.string(),
    })
}
