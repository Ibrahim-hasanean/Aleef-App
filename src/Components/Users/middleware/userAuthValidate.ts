import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

// phoneNumber: Joi.any().when('email', { is: undefined, then: Joi.number().required(), otherwise: Joi.optional() }),
//     email: Joi.any().when('phoneNumber', { is: undefined, then: Joi.number().required(), otherwise: Joi.optional() }),

export const validate = (schema: SchemaOptions) => celebrate(schema, { abortEarly: false }, { mode: Modes.FULL });


export const registerSchema = {
    [Segments.BODY]: Joi.object().keys({
        phoneNumber: Joi.string().required(),
        fullName: Joi.string().required(),
        password: Joi.string().required(),
        registrationToken: Joi.string(),
    })
}

export const loginSchema = {
    [Segments.BODY]: Joi.object().keys({
        phoneNumber: Joi.string().required(),
        password: Joi.string().required(),
        registrationToken: Joi.string(),
    })
}

export const forgetPasswordSchema = {
    [Segments.BODY]: Joi.object().keys({
        phoneNumber: Joi.string().required(),
    })
}

export const resetPasswordSchema = {
    [Segments.BODY]: Joi.object().keys({
        phoneNumber: Joi.string().required(),
        code: Joi.string().required(),
        newPassword: Joi.string().required(),
    })
}

export const verifyCodeSchema = {
    [Segments.BODY]: Joi.object().keys({
        phoneNumber: Joi.string().required(),
        code: Joi.string().required(),

    })
}


