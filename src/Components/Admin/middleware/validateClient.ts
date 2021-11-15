import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";


export const addClientSchema = {
    [Segments.BODY]: Joi.object().keys({
        phoneNumber: Joi.string().required(),
        fullName: Joi.string().required(),
        email: Joi.string(),
        password: Joi.string().required(),
    })
}