import { Router } from "express";
import { registerSchema, loginSchema, forgetPasswordSchema, verifyCodeSchema, validate, resetPasswordSchema } from "./middleware/userAuthValidate";
import { addAddressSchema, changePasswordSchema, notificationSettingsSchema, updateProfileSchema } from "./middleware/userProfileValidation";
import { register, login, forgetPassword, verifyCode, resetPassword } from "./controller/UsersAuth";
import { addAddress, getAddresses, deleteAddress, updateProfile, changePassword, notificationSettings } from "./controller/UserProfile";
import verifyUser from "./middleware/verifyUser";
import { petSchema } from "./middleware/PetsValidation";
import { addPets, deletePet, getPetById, getPets, updatePet } from "./controller/UserPets";
import { getItems, getItemById, addToWishList, getWishList, removeFromWishList, reviewItem } from "./controller/UserItems";
import { paymentSchema } from "./middleware/userPaymentsValidation";
import { payItem, getPayments, getPaymentById, cancelOrder } from "./controller/UserOrders";
import {
    addAppointment,
    getAppointments,
    deleteAppointments,
    getAppointmentsById,
    updateAppointment,
    getAvaliableTime,
    getAppointmentPaymentById,
    getAppointmentPayments,
    payAppointment
} from "./controller/UserAppointments";
import { AppointmentSchema, appointmentPaymentSchema } from "./middleware/appointmentsValidation";
const router = Router();

//Auth
router.post("/auth/register", validate(registerSchema), register);
router.post("/auth/login", validate(loginSchema), login);
router.post("/auth/forgetpassword", validate(forgetPasswordSchema), forgetPassword);
router.post("/auth/resetPassword", validate(resetPasswordSchema), resetPassword);
router.post("/auth/verify", validate(verifyCodeSchema), verifyCode);

// user profile
router.patch("/profile", verifyUser, validate(updateProfileSchema), updateProfile);
router.post("/profile/changePassword", verifyUser, validate(changePasswordSchema), changePassword);
router.post("/notifications", verifyUser, validate(notificationSettingsSchema), notificationSettings);


// Appontment Payments
router.post("/appointments/payments", verifyUser, validate(appointmentPaymentSchema), payAppointment);
router.get("/appointments/payments", verifyUser, getAppointmentPayments);
router.get("/appointments/payments/:id", verifyUser, getAppointmentPaymentById);

// Appointment routes
router.post("/appointments", verifyUser, validate(AppointmentSchema), addAppointment);
router.get("/appointments", verifyUser, getAppointments);
router.get("/appointments/avaliable", verifyUser, getAvaliableTime);
router.patch("/appointments/:id", verifyUser, validate(AppointmentSchema), updateAppointment);
router.get("/appointments/:id", verifyUser, getAppointmentsById);
router.delete("/appointments/:id", verifyUser, deleteAppointments);


//items payment
router.post("/orders", verifyUser, validate(paymentSchema), payItem);
router.get("/orders", verifyUser, getPayments);
router.get("/orders/:id", verifyUser, getPaymentById);
router.delete("/orders/:id", verifyUser, cancelOrder);

//items
router.get("/items", verifyUser, getItems);
router.get("/items/:id", verifyUser, getItemById);
router.post("/items/:id/like", verifyUser, addToWishList);
router.delete("/items/:id/like", verifyUser, removeFromWishList);
router.post("/items/:id/review", verifyUser, reviewItem);
router.get("/items/:id/like", verifyUser, getWishList);



//user Address
router.post("/addresses", verifyUser, validate(addAddressSchema), addAddress);
router.get("/addresses", verifyUser, getAddresses);
router.delete("/addresses/:id", verifyUser, deleteAddress);

//pets routes
router.post("/pets", verifyUser, validate(petSchema), addPets);
router.get("/pets", verifyUser, getPets);
router.get("/pets/:id", verifyUser, getPetById);
router.delete("/pets/:id", verifyUser, deletePet);
router.patch("/pets/:id", verifyUser, validate(petSchema), updatePet);

export default router;


