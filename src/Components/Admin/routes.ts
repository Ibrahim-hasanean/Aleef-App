import { Router } from "express";
import { getTypes, addPetsType, deleteType } from "./controller/Pets/PetsTypes";
import { addBreed, deletebreed, getbreeds } from "./controller/Pets/Breeds";
import { addItemCategory, getItemsCategory, deleteCategory } from "./controller/Items/ItemsCategory";
import { addItem, deleteItem, getItemById, getItems, updateItem, itemsHome, toggleHide } from "./controller/Items/items";
import { addService, deleteService, getServiceById, getServices } from "./controller/services/services";
import { addStaff, defaultAdmin, deleteStaffMember, getStaffMemeberById, getStaffMemebers, updateStaff, getWorkHoures, setWorkHoures } from "./controller/staff/staff";
import {
    addAppointment,
    deleteAppointments,
    getAppointments,
    getAppointmentsById,
    getAvaliableTime,
    updateAppointment,
    getAvaliableDoctrs,
    userAppointments, addReportToAppointment, deleteReportToAppointment
} from "./controller/appointments/appointments";
import {
    addAppointmentsPayment,
    deleteAppointmentsPayment,
    getAppointmentsPaymentById,
    getAppointmentsPayments,
    updateAppointmentsPayment
} from "./controller/AppointmentsPayment/AppointmentsPayment";
import { getPaymentById, getPayments } from "./controller/Payments/Payments";
import { addOrder, getOrderById, getOrders, setStatus } from "./controller/Orders/Orders";
import { getUsers, getUserById, addNewUser, updateUser, suspendUser, deleteUser, addNewUserWithPets, updateUserWithPets } from "./controller/Users/Users";
import { getPets, addNewPet, getPetById, deletePet, updatePet } from "./controller/Pets/Pet";
import { getProfile, updateProfile, getProfileNotifications, setProfileNotifications } from "./controller/Profile/Profile";
import { login, verifyCode } from "./controller/auth/auth";
import { loginSchema, validate, verifyCodeSchema } from "./middleware/validateAuth";
import { addStaffSchema, workHouresSchema } from "./middleware/validateStaff";
import verifyAdmin from "./middleware/verifyAdmin";
import verifyRecieption from "./middleware/verifyRecieption";
import verifyStoreManagement from "./middleware/verifyStoreManagement";
import verifyStaffMember from "./middleware/verifyStaffMember";
import { itemSchema } from "./middleware/validateItem";
import { nameSchema, nameTypeSchema } from "./middleware/validateName";
import { AppointmentSchema, appointmentsQuerySchema, ValidateIdParam } from "./middleware/validateAppointment";
import { paymentSchema } from "./middleware/validatePayment";
import { orderSchema, orderStatusSchema } from "./middleware/validateOrdres";
import { addClientSchema } from "./middleware/validateClient";
import { petSchema } from "./middleware/validatePets";
import { profileSchema } from "./middleware/validateProfile";
import { getPetVaccinations, getVaccinationById, addVaccination, deleteVaccinationById, updateVaccination } from "./controller/vaccinations/vaccination";
import verifyDoctor from "./middleware/verifyDoctor";
import { vaccinationSchema } from "./middleware/validateVaccination";
import { MedacinSchema, updateMedacinSchema } from "./middleware/validateMedacin";
import { addMedacin, updateMedacin, deleteMedacin, getMedacinById, getPetMedacins } from "./controller/medacins/medacins";
import { addHealthCareTip, getHealthCare } from "./controller/HealthCare/HealthCare";
import { addReadAbout, getReadAboute } from "./controller/ReadAbout/ReadAbout";
import { addLocation, getLocation } from "./controller/Location/Location";
import { addInvoice, getInvoicements, doctorAddInvoice } from "./controller/Invoice/Invoice";
import { InvoiceSchema, doctorInvoiceSchema } from "./middleware/validateInvoice"
import upload from "../middlewares/uploadImage";
import { adminHome } from "./controller/home/home";
import { getMessages, getConversations, getConversation } from "./controller/StaffChat/StaffChat";
import { getNotifications } from "./controller/notifications/notifications";

const router = Router();

// auth routers
router.post("/auth/login", validate(loginSchema), login);
router.post("/auth/verify", validate(verifyCodeSchema), verifyCode);


//chat routes 
router.get("/conversations", verifyStaffMember, getConversations);
router.get("/conversations/:id", verifyStaffMember, getConversation);
router.get("/conversations/:id/messages", verifyStaffMember, getMessages);

//Notifications
router.get("/notifications", verifyStaffMember, getNotifications);

//home page
router.get("/admin-home", verifyAdmin, adminHome);

// invoices routes
router.post("/invoice", verifyStaffMember, validate(InvoiceSchema), addInvoice);
router.post("/invoice/doctor", verifyStaffMember, validate(doctorInvoiceSchema), doctorAddInvoice);
router.get("/invoice", verifyStaffMember, validate(appointmentsQuerySchema), getInvoicements);

// profile
router.patch("/profile", verifyStaffMember, upload.single('image'), validate(profileSchema), updateProfile);
router.get("/profile", verifyStaffMember, getProfile);
router.patch("/profile/notifications", verifyStaffMember, setProfileNotifications);
router.get("/profile/notifications", verifyStaffMember, getProfileNotifications);

// hospital locations
router.post("/location", verifyStaffMember, addLocation);
router.get("/location", verifyStaffMember, getLocation);

//health care
router.get("/healthcare", verifyStaffMember, getHealthCare);
router.post("/healthcare", verifyStaffMember, addHealthCareTip);

// Read aboute routes
router.get("/readabout", verifyStaffMember, getReadAboute);
router.post("/readabout", verifyStaffMember, addReadAbout);


//pets 
router.post("/pets", verifyStaffMember, upload.single('image'), validate(petSchema), addNewPet);
router.patch("/pets/:id", verifyStaffMember, upload.single('image'), validate(petSchema), updatePet);
router.get("/pets", verifyStaffMember, validate(appointmentsQuerySchema), getPets);
router.get("/pets/:id", verifyStaffMember, validate(ValidateIdParam), getPetById);
router.delete("/pets/:id", verifyStaffMember, validate(ValidateIdParam), deletePet);


// pets vaccinations
router.post("/pets/:id/vaccinations", verifyDoctor, validate(ValidateIdParam), validate(vaccinationSchema), addVaccination);
router.patch("/pets/:id/vaccinations/:vaccinationId", verifyDoctor, validate(ValidateIdParam), validate(vaccinationSchema), updateVaccination);
router.get("/pets/:id/vaccinations", verifyDoctor, validate(ValidateIdParam), getPetVaccinations);
router.get("/pets/:id/vaccinations/:vaccinationId", verifyDoctor, validate(ValidateIdParam), getVaccinationById);
router.delete("/pets/:id/vaccinations/:vaccinationId", verifyDoctor, validate(ValidateIdParam), deleteVaccinationById);


// pets medacin
router.post("/pets/:id/medacins", verifyDoctor, validate(ValidateIdParam), validate(MedacinSchema), addMedacin);
router.patch("/pets/:id/medacins/:medacinId", verifyDoctor, validate(ValidateIdParam), validate(updateMedacinSchema), updateMedacin);
router.get("/pets/:id/medacins", verifyDoctor, validate(ValidateIdParam), getPetMedacins);
router.get("/pets/:id/medacins/:medacinId", verifyDoctor, validate(ValidateIdParam), getMedacinById);
router.delete("/pets/:id/medacins/:medacinId", verifyDoctor, validate(ValidateIdParam), deleteMedacin);

// clients 
router.post("/clients", verifyStaffMember, upload.single('image'), validate(addClientSchema), addNewUser);
// router.post("/clients", verifyStaffMember, upload.fields([{ name: 'petsImages' }, { name: "image", maxCount: 1 }]), addNewUserWithPets);
router.patch("/clients/:id", verifyStaffMember, upload.single('image'), validate(ValidateIdParam), validate(addClientSchema), updateUser);
// router.patch("/clients/:id", verifyStaffMember, upload.fields([{ name: 'petsImages' }, { name: "image", maxCount: 1 }]), validate(ValidateIdParam), updateUserWithPets);
router.get("/clients", verifyStaffMember, getUsers);
router.post("/clients/:id/suspend", verifyStaffMember, validate(ValidateIdParam), suspendUser);
router.get("/clients/:id", verifyStaffMember, validate(ValidateIdParam), getUserById);
router.delete("/clients/:id", verifyStaffMember, validate(ValidateIdParam), deleteUser);

// payments 
router.get("/payments", verifyRecieption, getPayments);
router.get("/payments/:id", verifyRecieption, validate(ValidateIdParam), getPaymentById);

//orders 
router.post("/orders", verifyStoreManagement, validate(orderSchema), addOrder);
router.get("/orders", verifyStoreManagement, getOrders);
router.post("/orders/:id/status", verifyStoreManagement, validate(ValidateIdParam), validate(orderStatusSchema), setStatus);
router.get("/orders/:id", verifyStoreManagement, validate(ValidateIdParam), getOrderById);


// Appointments Payments
router.post("/appointments/payments", verifyRecieption, validate(paymentSchema), addAppointmentsPayment);
router.patch("/appointments/payments/:id", verifyRecieption, validate(paymentSchema), updateAppointmentsPayment);
router.get("/appointments/payments", verifyRecieption, validate(appointmentsQuerySchema), getAppointmentsPayments);
router.get("/appointments/payments/:id", verifyRecieption, validate(ValidateIdParam), getAppointmentsPaymentById);
router.delete("/appointments/payments/:id", verifyRecieption, validate(ValidateIdParam), deleteAppointmentsPayment);

// appointments routes 
router.get("/appointments", verifyStaffMember, validate(appointmentsQuerySchema), getAppointments);
router.post("/appointments", verifyStaffMember, validate(AppointmentSchema), addAppointment);
router.patch("/appointments/:id", verifyStaffMember, validate(ValidateIdParam), validate(AppointmentSchema), updateAppointment);
router.get("/appointments/avaliable", verifyStaffMember, getAvaliableTime);
router.get("/appointments/doctors", verifyStaffMember, getAvaliableDoctrs);
router.get("/appointments/users/:id", verifyStaffMember, validate(ValidateIdParam), userAppointments);
router.post("/appointments/:id/report", verifyStaffMember, validate(ValidateIdParam), addReportToAppointment);
router.patch("/appointments/:id/report", verifyStaffMember, validate(ValidateIdParam), addReportToAppointment);
router.delete("/appointments/:id/report", verifyStaffMember, validate(ValidateIdParam), deleteReportToAppointment);
router.get("/appointments/:id", verifyStaffMember, validate(ValidateIdParam), getAppointmentsById);
router.delete("/appointments/:id", verifyStaffMember, validate(ValidateIdParam), deleteAppointments);

// Staff routes
router.post("/defaultAdmin", defaultAdmin);
router.post("/staff", verifyRecieption, upload.single('image'), validate(addStaffSchema), addStaff);
router.patch("/staff/:id", verifyRecieption, upload.single('image'), validate(ValidateIdParam), validate(addStaffSchema), updateStaff);
router.get("/staff", verifyRecieption, getStaffMemebers);
router.get("/staff/:id", verifyRecieption, validate(ValidateIdParam), getStaffMemeberById);
router.get("/staff/:id/workHoures", verifyRecieption, validate(ValidateIdParam), getWorkHoures);
router.post("/staff/:id/workHoures", verifyRecieption, validate(ValidateIdParam), validate(workHouresSchema), setWorkHoures);
router.delete("/staff/:id", verifyRecieption, validate(ValidateIdParam), deleteStaffMember);

// items and items variables
router.get("/items", verifyStoreManagement, getItems);
router.get("/items/home", verifyStoreManagement, itemsHome);
router.get("/items/:id", verifyStoreManagement, validate(ValidateIdParam), getItemById);
router.post("/items/:id/toggle", verifyStoreManagement, validate(ValidateIdParam), toggleHide);
router.post("/items",
    verifyStoreManagement,
    upload.fields([{ name: "mainImage", maxCount: 1 }, { name: "images" }]),
    validate(itemSchema),
    addItem
);
router.delete("/items/:id", verifyStoreManagement, validate(ValidateIdParam), deleteItem);
router.patch("/items/:id",
    verifyStoreManagement,
    upload.fields([{ name: "mainImage", maxCount: 1 }, { name: "images" }]),
    validate(ValidateIdParam),
    validate(itemSchema),
    updateItem
);

router.get("/itemsCategory", verifyStoreManagement, getItemsCategory);
router.post("/itemsCategory", verifyStoreManagement, validate(nameSchema), addItemCategory);
router.delete("/itemsCategory/:id", verifyStoreManagement, validate(ValidateIdParam), deleteCategory);

// services
router.post("/services", verifyAdmin, validate(nameSchema), addService);
router.get("/services", verifyAdmin, getServices);
router.delete("/services/:id", verifyAdmin, deleteService);

router.get("/petstypes", verifyAdmin, getTypes);
router.post("/petstypes", verifyAdmin, validate(nameSchema), addPetsType);
router.delete("/petstypes/:id", verifyAdmin, validate(ValidateIdParam), deleteType);

router.get("/breeds", verifyAdmin, getbreeds);
router.post("/breeds", verifyAdmin, validate(nameTypeSchema), addBreed);
router.delete("/breeds/:id", verifyAdmin, validate(ValidateIdParam), deletebreed);

export default router;