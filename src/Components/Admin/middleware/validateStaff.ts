import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const validate = (schema: SchemaOptions) => celebrate(schema, { abortEarly: false }, { mode: Modes.FULL });

export const addStaffSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        cardNumber: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        email: Joi.string().required(),
        role: Joi.string().required().valid("admin", "doctor", "storeManager", "receiption"),
        staffMemberId: Joi.string().required(),
        // password: Joi.string().required(),
    })
}

export const workHouresSchema = {
    [Segments.BODY]: Joi.object().keys({
        saturday: Joi.object().required().keys({
            isActive: Joi.boolean().required(),
            from: Joi.date().required(),
            to: Joi.date().required(),
        }),
        sunday: Joi.object().required().keys({
            isActive: Joi.boolean().required(),
            from: Joi.date().required(),
            to: Joi.date().required(),
        }),
        monday: Joi.object().required().keys({
            isActive: Joi.boolean().required(),
            from: Joi.date().required(),
            to: Joi.date().required(),
        }),
        tuesday: Joi.object().required().keys({
            isActive: Joi.boolean().required(),
            from: Joi.date().required(),
            to: Joi.date().required(),
        }),
        wednesday: Joi.object().required().keys({
            isActive: Joi.boolean().required(),
            from: Joi.date().required(),
            to: Joi.date().required(),
        }),
        thursday: Joi.object().required().keys({
            isActive: Joi.boolean().required(),
            from: Joi.date().required(),
            to: Joi.date().required(),
        }),
        friday: Joi.object().required().keys({
            isActive: Joi.boolean().required(),
            from: Joi.date().required(),
            to: Joi.date().required(),
        }),

    })
}