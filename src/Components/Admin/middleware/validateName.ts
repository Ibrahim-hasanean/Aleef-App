import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";
import mongoose from "mongoose";

export const nameSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
    })
}

export const nameTypeSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        typeId: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`typeId ${value} not valid`);
            return value;
        }, "id validation"),
    })
}