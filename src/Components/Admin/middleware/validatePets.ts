import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";
import mongoose from "mongoose"

export const validate = (schema: SchemaOptions) => celebrate(schema, { abortEarly: false }, { mode: Modes.FULL });

export const petSchema = {
    [Segments.BODY]: Joi.object().keys({
        userId: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`userId ${value} not valid`);
            return value;
        }, "id validation"),
        name: Joi.string().required(),
        serialNumber: Joi.string().required(),
        age: Joi.string().required(),
        typeId: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`typeId ${value} not valid`);
            return value;
        }, "id validation"),
        breedId: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`breedId ${value} not valid`);
            return value;
        }, "id validation"),
        gender: Joi.string().required().valid("male", "female"),
        nutried: Joi.boolean(),
        duerming: Joi.boolean(),
    })
}
