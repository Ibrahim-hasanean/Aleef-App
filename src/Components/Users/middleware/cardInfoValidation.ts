import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const validate = (schema: SchemaOptions) => celebrate(schema, { abortEarly: false }, { mode: Modes.FULL });


export const cardInfoSchema = {
    [Segments.BODY]: Joi.object().keys({
        cardNumber: Joi.string().required(),
        cardHolderName: Joi.string().required(),
    })
}
