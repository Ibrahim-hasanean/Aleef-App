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
const UserPayments_1 = require("./controller/UserPayments");
const UserAppointments_1 = require("./controller/UserAppointments");
const appointmentsValidation_1 = require("./middleware/appointmentsValidation");
const router = (0, express_1.Router)();
//Auth
router.post("/auth/register", (0, userAuthValidate_1.validate)(userAuthValidate_1.registerSchema), UsersAuth_1.register);
router.post("/auth/login", (0, userAuthValidate_1.validate)(userAuthValidate_1.loginSchema), UsersAuth_1.login);
router.post("/auth/forgetpassword", (0, userAuthValidate_1.validate)(userAuthValidate_1.forgetPasswordSchema), UsersAuth_1.forgetPassword);
router.post("/auth/resetPassword", (0, userAuthValidate_1.validate)(userAuthValidate_1.resetPasswordSchema), UsersAuth_1.resetPassword);
router.post("/auth/verify", (0, userAuthValidate_1.validate)(userAuthValidate_1.verifyCodeSchema), UsersAuth_1.verifyCode);
// user profile
router.patch("/profile", verifyUser_1.default, (0, userAuthValidate_1.validate)(userProfileValidation_1.updateProfileSchema), UserProfile_1.updateProfile);
router.post("/profile/changePassword", verifyUser_1.default, (0, userAuthValidate_1.validate)(userProfileValidation_1.changePasswordSchema), UserProfile_1.changePassword);
router.post("/notifications", verifyUser_1.default, (0, userAuthValidate_1.validate)(userProfileValidation_1.notificationSettingsSchema), UserProfile_1.notificationSettings);
// Appointment routes
router.post("/appointments", verifyUser_1.default, (0, userAuthValidate_1.validate)(appointmentsValidation_1.AppointmentSchema), UserAppointments_1.addAppointment);
router.get("/appointments", verifyUser_1.default, UserAppointments_1.getAppointments);
router.get("/appointments/avaliable", verifyUser_1.default, UserAppointments_1.getAvaliableTime);
router.patch("/appointments/:id", verifyUser_1.default, (0, userAuthValidate_1.validate)(appointmentsValidation_1.AppointmentSchema), UserAppointments_1.updateAppointment);
router.get("/appointments/:id", verifyUser_1.default, UserAppointments_1.getAppointmentsById);
router.delete("/appointments/:id", verifyUser_1.default, UserAppointments_1.deleteAppointments);
//items
router.get("/items", verifyUser_1.default, UserItems_1.getItems);
router.get("/items/:id", verifyUser_1.default, UserItems_1.getItemById);
router.post("/items/:id/like", verifyUser_1.default, UserItems_1.addToWishList);
router.delete("/items/:id/like", verifyUser_1.default, UserItems_1.removeFromWishList);
router.get("/items/:id/like", verifyUser_1.default, UserItems_1.getWishList);
//items payment
router.post("/items/pay", verifyUser_1.default, (0, userAuthValidate_1.validate)(userPaymentsValidation_1.paymentSchema), UserPayments_1.payItem);
router.get("/items/pay", verifyUser_1.default, UserPayments_1.getPayments);
router.get("/items/pay/:id", verifyUser_1.default, UserPayments_1.getPaymentById);
//user Address
router.post("/addresses", verifyUser_1.default, (0, userAuthValidate_1.validate)(userProfileValidation_1.addAddressSchema), UserProfile_1.addAddress);
router.get("/addresses", verifyUser_1.default, UserProfile_1.getAddresses);
router.delete("/addresses/:id", verifyUser_1.default, UserProfile_1.deleteAddress);
//pets routes
router.post("/pets", verifyUser_1.default, (0, userAuthValidate_1.validate)(PetsValidation_1.petSchema), UserPets_1.addPets);
router.get("/pets", verifyUser_1.default, UserPets_1.getPets);
router.get("/pets/:id", verifyUser_1.default, UserPets_1.getPetById);
router.delete("/pets/:id", verifyUser_1.default, UserPets_1.deletePet);
router.patch("/pets/:id", verifyUser_1.default, (0, userAuthValidate_1.validate)(PetsValidation_1.petSchema), UserPets_1.updatePet);
exports.default = router;
