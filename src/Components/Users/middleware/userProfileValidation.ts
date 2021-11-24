import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const validate = (schema: SchemaOptions) => celebrate(schema, { abortEarly: false }, { mode: Modes.FULL });


export const updateProfileSchema = {
    [Segments.BODY]: Joi.object().keys({
        fullName: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        email: Joi.string()
    })
}


export const changePasswordSchema = {
    [Segments.BODY]: Joi.object().keys({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
    })
}


export const addAddressSchema = {
    [Segments.BODY]: Joi.object().keys({
        city: Joi.string().required(),
        street: Joi.string().required(),
        detailes: Joi.string(),
    })
}

export const notificationSettingsSchema = {
    [Segments.BODY]: Joi.object().keys({
        muteAllNotification: Joi.boolean(),
        muteChat: Joi.boolean(),
        vaccinationReminder: Joi.boolean(),
        appointmentReminder: Joi.boolean(),
        medacinReminder: Joi.boolean(),
    })
}




