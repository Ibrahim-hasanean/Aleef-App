import { Router } from "express";
import { registerSchema, loginSchema, forgetPasswordSchema, verifyCodeSchema, validate, resetPasswordSchema } from "./middleware/userAuthValidate";
import { addAddressSchema, changePasswordSchema, notificationSettingsSchema, updateProfileSchema } from "./middleware/userProfileValidation";
import { register, login, forgetPassword, verifyCode, resetPassword } from "./controller/UsersAuth";
import { addAddress, getAddresses, deleteAddress, updateProfile, changePassword, notificationSettings } from "./controller/UserProfile";
import verifyUser from "./middleware/verifyUser";
import { petSchema } from "./middleware/PetsValidation";
import { addPets, deletePet, getPetById, getPets, updatePet } from "./controller/UserPets";
import { getItems, getItemById, addToWishList, getWishList, removeFromWishList } from "./controller/UserItems";
import { paymentSchema } from "./middleware/userPaymentsValidation";
import { payItem, getPayments, getPaymentById } from "./controller/UserPayments";
import { addAppointment, getAppointments, deleteAppointments, getAppointmentsById, updateAppointment, getAvaliableTime } from "./controller/UserAppointments";
import { AppointmentSchema } from "./middleware/appointmentsValidation";
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

// Appointment routes
router.post("/appointments", verifyUser, validate(AppointmentSchema), addAppointment);
router.get("/appointments", verifyUser, getAppointments);
router.get("/appointments/avaliable", verifyUser, getAvaliableTime);
router.patch("/appointments/:id", verifyUser, validate(AppointmentSchema), updateAppointment);
router.get("/appointments/:id", verifyUser, getAppointmentsById);
router.delete("/appointments/:id", verifyUser, deleteAppointments);


//items
router.get("/items", verifyUser, getItems);
router.get("/items/:id", verifyUser, getItemById);
router.post("/items/:id/like", verifyUser, addToWishList);
router.delete("/items/:id/like", verifyUser, removeFromWishList);
router.get("/items/:id/like", verifyUser, getWishList);


//items payment
router.post("/items/pay", verifyUser, validate(paymentSchema), payItem);
router.get("/items/pay", verifyUser, getPayments);
router.get("/items/pay/:id", verifyUser, getPaymentById);


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


