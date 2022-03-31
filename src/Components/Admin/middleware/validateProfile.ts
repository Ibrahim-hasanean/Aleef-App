import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";


export const profileSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        licenseNumber: Joi.number().allow(""),
        cardNumber: Joi.number().allow(""),
        staffMemberId: Joi.number().allow(""),
        // muteChat: Joi.boolean().required(),
        // allowReceivingMessagesOutOfWorksHours: Joi.boolean().required(),
        // newOrdersNotifications: Joi.boolean().required(),
        // canceledOrdersNotifications: Joi.boolean().required(),
        // newReviewsNotifications: Joi.boolean().required(),
        // itemsAlmostOutOfStockNotification: Joi.boolean().required(),
    })
}

export const profileNotificationsSchema = {
    [Segments.BODY]: Joi.object().keys({
        muteChat: Joi.boolean().required(),
        allowReceivingMessagesOutOfWorksHours: Joi.boolean().required(),
        newOrdersNotifications: Joi.boolean().required(),
        canceledOrdersNotifications: Joi.boolean().required(),
        newReviewsNotifications: Joi.boolean().required(),
        itemsAlmostOutOfStockNotification: Joi.boolean().required(),
        allowReceivingNotificationsOutOfWorksHours: Joi.boolean().required(),
        muteChatNotifications: Joi.boolean().required(),
        newAppointmentsNotifications: Joi.boolean().required(),
        canceledAppointmentsNotifications: Joi.boolean().required(),
    })
}