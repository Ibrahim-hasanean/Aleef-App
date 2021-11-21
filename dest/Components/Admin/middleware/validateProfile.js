"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSchema = void 0;
const celebrate_1 = require("celebrate");
exports.profileSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().required(),
        phoneNumber: celebrate_1.Joi.string().required(),
        muteChat: celebrate_1.Joi.boolean().required(),
        allowReceivingMessagesOutOfWorksHours: celebrate_1.Joi.boolean().required(),
        newOrdersNotifications: celebrate_1.Joi.boolean().required(),
        canceledOrdersNotifications: celebrate_1.Joi.boolean().required(),
        newReviewsNotifications: celebrate_1.Joi.boolean().required(),
        itemsAlmostOutOfStockNotification: celebrate_1.Joi.boolean().required(),
    })
};
