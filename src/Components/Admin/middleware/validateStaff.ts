import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";

export const validate = (schema: SchemaOptions) => celebrate(schema, { abortEarly: false }, { mode: Modes.FULL });

let defaultWorkHoures = {
    "saturday": { "isActive": false, "beginDate": "2021-10-25T08:00:00.882Z", "endDate": "2021-10-25T17:00:00.882Z" },
    "sunday": { "isActive": true, "beginDate": "2021-10-25T08:00:00.882Z", "endDate": "2021-10-25T17:00:00.882Z" },
    "monday": { "isActive": true, "beginDate": "2021-10-25T08:00:00.882Z", "endDate": "2021-10-25T17:00:00.882Z" },
    "tuesday": { "isActive": true, "beginDate": "2021-10-25T08:00:00.882Z", "endDate": "2021-10-25T17:00:00.882Z" },
    "wednesday": { "isActive": true, "beginDate": "2021-10-25T08:00:00.882Z", "endDate": "2021-10-23T17:00:00.882Z" },
    "thursday": { "isActive": true, "beginDate": "2021-10-25T08:00:00.882Z", "endDate": "2021-10-25T17:00:00.882Z" },
    "friday": { "isActive": true, "beginDate": "2021-10-25T08:00:00.882Z", "endDate": "2021-10-25T17:00:00.882Z" }
}

export const addStaffSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        cardNumber: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        email: Joi.string().required(),
        role: Joi.string().required().valid("admin", "doctor", "storeManager", "receiption"),
        staffMemberId: Joi.string().required(),
        licenseNumber: Joi.string().required(),
        workHoures: Joi.string().default(JSON.stringify(defaultWorkHoures)),
    })
}

export const workHouresSchema = {
    [Segments.BODY]: Joi.object().keys({
        saturday: Joi.object().required().keys({
            isActive: Joi.boolean().required(),
            beginDate: Joi.date().required(),
            endDate: Joi.date().required(),
        }).unknown(true),
        sunday: Joi.object().required().keys({
            isActive: Joi.boolean().required(),
            beginDate: Joi.date().required(),
            endDate: Joi.date().required(),
        }).unknown(true),
        monday: Joi.object().required().keys({
            isActive: Joi.boolean().required(),
            beginDate: Joi.date().required(),
            endDate: Joi.date().required(),
        }).unknown(true),
        tuesday: Joi.object().required().keys({
            isActive: Joi.boolean().required(),
            beginDate: Joi.date().required(),
            endDate: Joi.date().required(),
        }).unknown(true),
        wednesday: Joi.object().required().keys({
            isActive: Joi.boolean().required(),
            beginDate: Joi.date().required(),
            endDate: Joi.date().required(),
        }).unknown(true),
        thursday: Joi.object().required().keys({
            isActive: Joi.boolean().required(),
            beginDate: Joi.date().required(),
            endDate: Joi.date().required(),
        }).unknown(true),
        friday: Joi.object().required().keys({
            isActive: Joi.boolean().required(),
            beginDate: Joi.date().required(),
            endDate: Joi.date().required(),
        }).unknown(true),

    })
}

// export const workHouresSchema = {
//     [Segments.BODY]: Joi.object().keys({
//         saturday: Joi.object().required().keys({
//             isActive: Joi.boolean().required(),
//             from: Joi.date().required(),
//             to: Joi.date().required(),
//         }),
//         sunday: Joi.object().required().keys({
//             isActive: Joi.boolean().required(),
//             from: Joi.date().required(),
//             to: Joi.date().required(),
//         }),
//         monday: Joi.object().required().keys({
//             isActive: Joi.boolean().required(),
//             from: Joi.date().required(),
//             to: Joi.date().required(),
//         }),
//         tuesday: Joi.object().required().keys({
//             isActive: Joi.boolean().required(),
//             from: Joi.date().required(),
//             to: Joi.date().required(),
//         }),
//         wednesday: Joi.object().required().keys({
//             isActive: Joi.boolean().required(),
//             from: Joi.date().required(),
//             to: Joi.date().required(),
//         }),
//         thursday: Joi.object().required().keys({
//             isActive: Joi.boolean().required(),
//             from: Joi.date().required(),
//             to: Joi.date().required(),
//         }),
//         friday: Joi.object().required().keys({
//             isActive: Joi.boolean().required(),
//             from: Joi.date().required(),
//             to: Joi.date().required(),
//         }),

//     })
// }