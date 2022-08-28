import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const validate = (schema: SchemaOptions) => celebrate(schema, { abortEarly: false }, { mode: Modes.FULL });

export const loginSchema = {
    [Segments.BODY]: Joi.object().keys({
        phoneNumber: Joi.string().required(),
    })
}
export const verifyCodeSchema = {
    [Segments.BODY]: Joi.object().keys({
        phoneNumber: Joi.string().required(),
        code: Joi.string().required(),
        registrationToken: Joi.string()
    })
}