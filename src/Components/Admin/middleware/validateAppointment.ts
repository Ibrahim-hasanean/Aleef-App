import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";
import mongoose from "mongoose"

export const AppointmentSchema = {
    [Segments.BODY]: Joi.object().keys({
        petId: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`petId ${value} not valid`);
            return value;
        }, "id validation"),
        userId: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`userId ${value} not valid`);
            return value;
        }, "id validation"),
        report: Joi.string(),
        service: Joi.string().required().valid("visit the vet", "hosting", "grooming"),
        appointmentDate: Joi.date().required(),
        reason: Joi.string().required(),
        doctorId: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`doctorId ${value} not valid`);
            return value;
        }, "id validation"),
    })
}

export const appointmentsQuerySchema = {
    [Segments.QUERY]: Joi.object().keys({
        petId: Joi.string().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`petId ${value} not valid id`);
            return value;
        }, "id validation"),
        userId: Joi.string().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`userId ${value} not valid id`);
            return value;
        }, "id validation"),
        doctorId: Joi.string().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`doctorId ${value} not valid id`);
            return value;
        }, "id validation"),
        appointmentId: Joi.string().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`appointmentId ${value} not valid id`);
            return value;
        }, "id validation"),
    }).unknown(true)
}

export const ValidateIdParam = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`params id ${value} not valid id`);
            return value;
        }, "id validation"),
        vaccinationId: Joi.string().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`params vaccinationId ${value} not valid id`);
            return value;
        }, "id validation"),
        medacinId: Joi.string().custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) throw new Error(`params medacinId ${value} not valid id`);
            return value;
        }, "id validation")
    }).unknown(true)
}