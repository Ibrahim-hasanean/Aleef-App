"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userAuthValidate_1 = require("./middleware/userAuthValidate");
const userProfileValidation_1 = require("./middleware/userProfileValidation");
const UsersAuth_1 = require("./controller/UsersAuth");
const UserProfile_1 = require("./controller/UserProfile");
const verifyUser_1 = __importDefault(require("./middleware/verifyUser"));
const PetsValidation_1 = require("./middleware/PetsValidation");
const UserPets_1 = require("./controller/UserPets");
const UserItems_1 = require("./controller/UserItems");
const userPaymentsValidation_1 = require("./middleware/userPaymentsValidation");
const UserOrders_1 = require("./controller/UserOrders");
const UserAppointments_1 = require("./controller/UserAppointments");
const UserCardsInfo_1 = require("./controller/UserCardsInfo");
const cardInfoValidation_1 = require("./middleware/cardInfoValidation");
const appointmentsValidation_1 = require("./middleware/appointmentsValidation");
const UserOrderItems_1 = require("./controller/UserOrderItems");
const UserItemListValidation_1 = require("./middleware/UserItemListValidation");
const HealthCare_1 = require("./controller/HealthCare");
const Location_1 = require("./controller/Location");
const ReadAbout_1 = require("./controller/ReadAbout");
const UserPaymentMethods_1 = require("./controller/UserPaymentMethods");
const uploadImage_1 = __importDefault(require("../middlewares/uploadImage"));
const Notifications_1 = require("./controller/Notifications");
const socialLoginValidation_1 = require("./middleware/socialLoginValidation");
const paymentIntentSchema_1 = require("./middleware/paymentIntentSchema");
const UserChat_1 = require("./controller/UserChat");
const router = (0, express_1.Router)();
// router.post("/upload", upload.single("image"), async (req: Request, res: Response) => {
//     let file = req.file;
//     // console.log(file);
//     let fileURL = await uploadFileToFirebase(file);
//     res.send(fileURL);
// });
//Auth
router.post("/auth/register", (0, userAuthValidate_1.validate)(userAuthValidate_1.registerSchema), UsersAuth_1.register);
router.post("/auth/login", (0, userAuthValidate_1.validate)(userAuthValidate_1.loginSchema), UsersAuth_1.login);
router.post("/auth/forgetpassword", (0, userAuthValidate_1.validate)(userAuthValidate_1.forgetPasswordSchema), UsersAuth_1.forgetPassword);
router.post("/auth/resetPassword", (0, userAuthValidate_1.validate)(userAuthValidate_1.resetPasswordSchema), UsersAuth_1.resetPassword);
router.post("/auth/verify", (0, userAuthValidate_1.validate)(userAuthValidate_1.verifyCodeSchema), UsersAuth_1.verifyCode);
router.post("/auth/google", (0, userAuthValidate_1.validate)(socialLoginValidation_1.socialLoginSchema), UsersAuth_1.googleAuth);
router.post("/auth/facebook", (0, userAuthValidate_1.validate)(socialLoginValidation_1.socialLoginSchema), UsersAuth_1.facebookAuth);
router.post("/auth/logout", verifyUser_1.default, UsersAuth_1.logout);
//chat routes 
router.get("/conversations", verifyUser_1.default, UserChat_1.getConversations);
router.get("/conversations/:id", verifyUser_1.default, UserChat_1.getConversation);
router.get("/conversations/:id/messages", verifyUser_1.default, UserChat_1.getMessages);
//get hospital location
router.get("/location", verifyUser_1.default, Location_1.getLocation);
//create payment intent
router.post("/payment-intent", verifyUser_1.default, (0, userAuthValidate_1.validate)(paymentIntentSchema_1.paymentIntentSchema), UserPaymentMethods_1.createPaymentIntent);
//get notifications
router.get("/notifications", verifyUser_1.default, Notifications_1.getNotifications);
//read about
router.get("/readabout", verifyUser_1.default, ReadAbout_1.getReadAboute);
//health care
router.get("/healthcare", verifyUser_1.default, HealthCare_1.getHealthCare);
// user item list
router.post("/itemList", verifyUser_1.default, (0, userAuthValidate_1.validate)(UserItemListValidation_1.userItemListSchema), UserOrderItems_1.addOrderItems);
router.patch("/itemList/:id", verifyUser_1.default, (0, userAuthValidate_1.validate)(UserItemListValidation_1.updateUserItemListSchema), UserOrderItems_1.updateOrderList);
router.get("/itemList", verifyUser_1.default, UserOrderItems_1.getOrderItems);
router.delete("/itemList", verifyUser_1.default, UserOrderItems_1.clearOrderItems);
router.delete("/itemList/:id", verifyUser_1.default, UserOrderItems_1.removeItemFromOrderList);
//cards
router.post("/cards", verifyUser_1.default, (0, userAuthValidate_1.validate)(cardInfoValidation_1.cardInfoSchema), UserCardsInfo_1.addCardInfo);
router.get("/cards", verifyUser_1.default, UserCardsInfo_1.getCardInfo);
router.get("/cards/:id", verifyUser_1.default, UserCardsInfo_1.getCardInfoById);
router.delete("/cards/:id", verifyUser_1.default, UserCardsInfo_1.deleteCardInfo);
// user profile
router.get("/profile", verifyUser_1.default, UserProfile_1.getProfile);
router.patch("/profile", verifyUser_1.default, uploadImage_1.default.single("image"), (0, userAuthValidate_1.validate)(userProfileValidation_1.updateProfileSchema), UserProfile_1.updateProfile);
router.post("/profile/changePassword", verifyUser_1.default, (0, userAuthValidate_1.validate)(userProfileValidation_1.changePasswordSchema), UserProfile_1.changePassword);
router.post("/notifications", verifyUser_1.default, (0, userAuthValidate_1.validate)(userProfileValidation_1.notificationSettingsSchema), UserProfile_1.notificationSettings);
// Appontment Payments
router.post("/appointments/payments", verifyUser_1.default, (0, userAuthValidate_1.validate)(appointmentsValidation_1.appointmentPaymentSchema), UserAppointments_1.payAppointment);
router.get("/appointments/payments", verifyUser_1.default, UserAppointments_1.getAppointmentPayments);
router.get("/appointments/payments/:id", verifyUser_1.default, UserAppointments_1.getAppointmentPaymentById);
// Appointment routes
router.post("/appointments", verifyUser_1.default, (0, userAuthValidate_1.validate)(appointmentsValidation_1.AppointmentSchema), UserAppointments_1.addAppointment);
router.get("/appointments/reminders", verifyUser_1.default, UserAppointments_1.getReminder);
router.get("/appointments", verifyUser_1.default, UserAppointments_1.getAppointments);
router.get("/appointments/avaliable", verifyUser_1.default, UserAppointments_1.getAvaliableTime);
router.patch("/appointments/:id", verifyUser_1.default, (0, userAuthValidate_1.validate)(appointmentsValidation_1.AppointmentSchema), UserAppointments_1.updateAppointment);
router.get("/appointments/:id", verifyUser_1.default, UserAppointments_1.getAppointmentsById);
router.delete("/appointments/:id", verifyUser_1.default, UserAppointments_1.deleteAppointments);
//items payment
router.post("/orders", verifyUser_1.default, (0, userAuthValidate_1.validate)(userPaymentsValidation_1.paymentSchema), UserOrders_1.payItem);
router.get("/orders", verifyUser_1.default, UserOrders_1.getPayments);
router.get("/orders/:id", verifyUser_1.default, UserOrders_1.getPaymentById);
router.delete("/orders/:id", verifyUser_1.default, UserOrders_1.cancelOrder);
//items
router.get("/items", verifyUser_1.default, UserItems_1.getItems);
router.post("/items/:id/like", verifyUser_1.default, UserItems_1.addToWishList);
router.delete("/items/:id/like", verifyUser_1.default, UserItems_1.removeFromWishList);
router.post("/items/:id/review", verifyUser_1.default, UserItems_1.reviewItem);
router.delete("/items/like", verifyUser_1.default, UserItems_1.removeAllFromWishList);
router.get("/items/wishlist", verifyUser_1.default, UserItems_1.getWishList);
router.get("/items/:id", verifyUser_1.default, UserItems_1.getItemById);
//user Address
router.post("/addresses", verifyUser_1.default, (0, userAuthValidate_1.validate)(userProfileValidation_1.addAddressSchema), UserProfile_1.addAddress);
router.get("/addresses", verifyUser_1.default, UserProfile_1.getAddresses);
router.delete("/addresses/:id", verifyUser_1.default, UserProfile_1.deleteAddress);
//pets routes
router.post("/pets", verifyUser_1.default, uploadImage_1.default.single("image"), (0, userAuthValidate_1.validate)(PetsValidation_1.petSchema), UserPets_1.addPets);
router.get("/pets/breeds", verifyUser_1.default, UserPets_1.getBreeds);
router.get("/pets/types", verifyUser_1.default, UserPets_1.getPetsTypes);
router.get("/pets", verifyUser_1.default, UserPets_1.getPets);
router.get("/pets/:id", verifyUser_1.default, UserPets_1.getPetById);
router.delete("/pets/:id", verifyUser_1.default, UserPets_1.deletePet);
router.patch("/pets/:id", verifyUser_1.default, uploadImage_1.default.single("image"), (0, userAuthValidate_1.validate)(PetsValidation_1.petSchema), UserPets_1.updatePet);
exports.default = router;
