import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";
import mongoose from "mongoose"

export const MedacinSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        appointmentId: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`appointmentId ${value} not valid id`);
            return value;
        }, "id validation"),
        duration: Joi.number().required(),
        repetition: Joi.number().default(1),
        notes: Joi.string(),
    })
}

export const updateMedacinSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        duration: Joi.number().required(),
        repetition: Joi.number().default(1),
        notes: Joi.string(),
    })
}
