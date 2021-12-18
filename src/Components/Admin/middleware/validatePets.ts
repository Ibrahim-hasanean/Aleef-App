import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const validate = (schema: SchemaOptions) => celebrate(schema, { abortEarly: false }, { mode: Modes.FULL });

export const petSchema = {
    [Segments.BODY]: Joi.object().keys({
        userId: Joi.string().required(),
        name: Joi.string().required(),
        serialNumber: Joi.string().required(),
        age: Joi.string().required(),
        typeId: Joi.string().required(),
        breedId: Joi.string().required(),
        gender: Joi.string().required().valid("male", "female"),
        nutried: Joi.boolean(),
        duerming: Joi.boolean(),
    })
}
