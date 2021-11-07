import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const nameSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
    })
}

export const nameTypeSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        typeId: Joi.string().required(),
    })
}