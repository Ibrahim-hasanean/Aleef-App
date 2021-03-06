import { Router, Request, Response } from "express";
import { registerSchema, loginSchema, forgetPasswordSchema, verifyCodeSchema, validate, resetPasswordSchema } from "./middleware/userAuthValidate";
import { addAddressSchema, changePasswordSchema, notificationSettingsSchema, updateProfileSchema } from "./middleware/userProfileValidation";
import { register, login, logout, forgetPassword, verifyCode, resetPassword, googleAuth, facebookAuth } from "./controller/UsersAuth";
import { addAddress, getAddresses, deleteAddress, updateProfile, changePassword, notificationSettings, getProfile } from "./controller/UserProfile";
import verifyUser from "./middleware/verifyUser";
import { petSchema } from "./middleware/PetsValidation";
import { addPets, deletePet, getPetById, getPets, updatePet, getBreeds, getPetsTypes } from "./controller/UserPets";
import { getItems, getItemById, addToWishList, getWishList, removeFromWishList, reviewItem, removeAllFromWishList } from "./controller/UserItems";
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
    payAppointment,
    getReminder
} from "./controller/UserAppointments";
import { addCardInfo, deleteCardInfo, getCardInfoById, getCardInfo } from "./controller/UserCardsInfo";
import { cardInfoSchema } from "./middleware/cardInfoValidation";
import { AppointmentSchema, appointmentPaymentSchema } from "./middleware/appointmentsValidation";
import { addOrderItems, clearOrderItems, getOrderItems, updateOrderList, removeItemFromOrderList } from "./controller/UserOrderItems";
import { userItemListSchema, updateUserItemListSchema } from "./middleware/UserItemListValidation";
import { getHealthCare } from "./controller/HealthCare";
import { getLocation } from "./controller/Location";
import { getReadAboute } from "./controller/ReadAbout";
import { createPaymentIntent } from "./controller/UserPaymentMethods";
import upload from "../middlewares/uploadImage";
import uploadFileToFirebase from "../utils/uploadFileToFirebase";
import { getNotifications } from "./controller/Notifications";
import { socialLoginSchema } from "./middleware/socialLoginValidation";
import { paymentIntentSchema } from "./middleware/paymentIntentSchema";
import { getMessages, getConversations, getConversation } from "./controller/UserChat"

const router = Router();


// router.post("/upload", upload.single("image"), async (req: Request, res: Response) => {
//     let file = req.file;
//     // console.log(file);
//     let fileURL = await uploadFileToFirebase(file);
//     res.send(fileURL);
// });



//Auth
router.post("/auth/register", validate(registerSchema), register);
router.post("/auth/login", validate(loginSchema), login);
router.post("/auth/forgetpassword", validate(forgetPasswordSchema), forgetPassword);
router.post("/auth/resetPassword", validate(resetPasswordSchema), resetPassword);
router.post("/auth/verify", validate(verifyCodeSchema), verifyCode);
router.post("/auth/google", validate(socialLoginSchema), googleAuth);
router.post("/auth/facebook", validate(socialLoginSchema), facebookAuth);
router.post("/auth/logout", verifyUser, logout);

//chat routes 
router.get("/conversations", verifyUser, getConversations);
router.get("/conversations/:id", verifyUser, getConversation);
router.get("/conversations/:id/messages", verifyUser, getMessages);

//get hospital location
router.get("/location", verifyUser, getLocation);

// //create payment intent
// router.post("/payment-intent", verifyUser, validate(paymentIntentSchema), createPaymentIntent);

//get notifications
router.get("/notifications", verifyUser, getNotifications);

//read about
router.get("/readabout", verifyUser, getReadAboute);

//health care
router.get("/healthcare", verifyUser, getHealthCare);

// user item list
router.post("/itemList", verifyUser, validate(userItemListSchema), addOrderItems);
router.patch("/itemList/:id", verifyUser, validate(updateUserItemListSchema), updateOrderList);
router.get("/itemList", verifyUser, getOrderItems);
router.delete("/itemList", verifyUser, clearOrderItems);
router.delete("/itemList/:id", verifyUser, removeItemFromOrderList);



//cards
router.post("/cards", verifyUser, validate(cardInfoSchema), addCardInfo);
router.get("/cards", verifyUser, getCardInfo);
router.get("/cards/:id", verifyUser, getCardInfoById);
router.delete("/cards/:id", verifyUser, deleteCardInfo);

// user profile
router.get("/profile", verifyUser, getProfile);
router.patch("/profile", verifyUser, upload.single("image"), validate(updateProfileSchema), updateProfile);
router.post("/profile/changePassword", verifyUser, validate(changePasswordSchema), changePassword);
router.post("/notifications", verifyUser, validate(notificationSettingsSchema), notificationSettings);


// Appontment Payments
router.post("/appointments/payments", verifyUser, validate(appointmentPaymentSchema), payAppointment);
router.get("/appointments/payments", verifyUser, getAppointmentPayments);
router.get("/appointments/payments/:id", verifyUser, getAppointmentPaymentById);

// Appointment routes
router.post("/appointments", verifyUser, validate(AppointmentSchema), addAppointment);
router.get("/appointments/reminders", verifyUser, getReminder);
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
router.post("/items/:id/like", verifyUser, addToWishList);
router.delete("/items/:id/like", verifyUser, removeFromWishList);
router.post("/items/:id/review", verifyUser, reviewItem);
router.delete("/items/like", verifyUser, removeAllFromWishList);
router.get("/items/wishlist", verifyUser, getWishList);
router.get("/items/:id", verifyUser, getItemById);



//user Address
router.post("/addresses", verifyUser, validate(addAddressSchema), addAddress);
router.get("/addresses", verifyUser, getAddresses);
router.delete("/addresses/:id", verifyUser, deleteAddress);

//pets routes
router.post("/pets", verifyUser, upload.single("image"), validate(petSchema), addPets);
router.get("/pets/breeds", verifyUser, getBreeds);
router.get("/pets/types", verifyUser, getPetsTypes);
router.get("/pets", verifyUser, getPets);
router.get("/pets/:id", verifyUser, getPetById);
router.delete("/pets/:id", verifyUser, deletePet);
router.patch("/pets/:id", verifyUser, upload.single("image"), validate(petSchema), updatePet);

export default router;


