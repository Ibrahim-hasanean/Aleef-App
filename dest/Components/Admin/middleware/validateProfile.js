"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSchema = void 0;
const celebrate_1 = require("celebrate");
exports.profileSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().required(),
        phoneNumber: celebrate_1.Joi.string().required(),
        // muteChat: Joi.boolean().required(),
        // allowReceivingMessagesOutOfWorksHours: Joi.boolean().required(),
        // newOrdersNotifications: Joi.boolean().required(),
        // canceledOrdersNotifications: Joi.boolean().required(),
        // newReviewsNotifications: Joi.boolean().required(),
        // itemsAlmostOutOfStockNotification: Joi.boolean().required(),
    })
};
