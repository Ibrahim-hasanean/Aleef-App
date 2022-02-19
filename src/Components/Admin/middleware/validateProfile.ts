import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";


export const profileSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        licenseNumber: Joi.string(),
        cardNumber: Joi.string(),
        staffMemberId: Joi.string(),
        // muteChat: Joi.boolean().required(),
        // allowReceivingMessagesOutOfWorksHours: Joi.boolean().required(),
        // newOrdersNotifications: Joi.boolean().required(),
        // canceledOrdersNotifications: Joi.boolean().required(),
        // newReviewsNotifications: Joi.boolean().required(),
        // itemsAlmostOutOfStockNotification: Joi.boolean().required(),
    })
}