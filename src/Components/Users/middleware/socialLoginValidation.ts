import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const validate = (schema: SchemaOptions) => celebrate(schema, { abortEarly: false }, { mode: Modes.FULL });


export const socialLoginSchema = {
    [Segments.BODY]: Joi.object().keys({
        accessToken: Joi.string().required(),
        registrationToken: Joi.string().required(),
    })
}
