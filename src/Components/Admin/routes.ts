import { Router } from "express";
import { getTypes, addPetsType, deleteType } from "./controller/Pets/PetsTypes";
import { addBreed, deletebreed, getbreeds } from "./controller/Pets/Breeds";
import { addItemCategory, getItemsCategory, deleteCategory } from "./controller/Items/ItemsCategory";
import { addItem, deleteItem, getItemById, getItems, updateItem, itemsHome } from "./controller/Items/items";
import { addService, deleteService, getServiceById, getServices } from "./controller/services/services";
import { addStaff, defaultAdmin, deleteStaffMember, getStaffMemeberById, getStaffMemebers, updateStaff, getWorkHoures, setWorkHoures } from "./controller/staff/staff";
import { addAppointment, deleteAppointments, getAppointments, getAppointmentsById, getAvaliableTime, updateAppointment, getAvaliableDoctrs } from "./controller/appointments/appointments";
import {
    addAppointmentsPayment,
    deleteAppointmentsPayment,
    getAppointmentsPaymentById,
    getAppointmentsPayments,
    updateAppointmentsPayment
} from "./controller/AppointmentsPayment/AppointmentsPayment";
import { getPaymentById, getPayments } from "./controller/Payments/Payments";
import { addOrder, getOrderById, getOrders, setStatus } from "./controller/Orders/Orders";
import { getUsers, getUserById, addNewUser, updateUser, suspendUser } from "./controller/Users/Users";
import { getPets, addNewPet, getPetById, deletePet, updatePet } from "./controller/Pets/Pet";
import { getProfile, updateProfile } from "./controller/Profile/Profile";
import { login, verifyCode } from "./controller/auth/auth";
import { loginSchema, validate, verifyCodeSchema } from "./middleware/validateAuth";
import { addStaffSchema, workHouresSchema } from "./middleware/validateStaff";
import verifyAdmin from "./middleware/verifyAdmin";
import verifyRecieption from "./middleware/verifyRecieption";
import verifyStoreManagement from "./middleware/verifyStoreManagement";
import verifyStaffMember from "./middleware/verifyStaffMember";
import { itemSchema } from "./middleware/validateItem";
import { nameSchema, nameTypeSchema } from "./middleware/validateName";
import { AppointmentSchema } from "./middleware/validateAppointment";
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
import { addInvoice, getInvoicements } from "./controller/Invoice/Invoice";
import { InvoiceSchema } from "./middleware/validateInvoice"
import upload from "../middlewares/uploadImage";

const router = Router();

// auth routers
router.post("/auth/login", validate(loginSchema), login);
router.post("/auth/verify", validate(verifyCodeSchema), verifyCode);

// invoices routes
router.patch("/invoice", verifyStaffMember, validate(InvoiceSchema), addInvoice);
router.get("/invoice", verifyStaffMember, getInvoicements);

// profile
router.patch("/profile", verifyStaffMember, upload.single('image'), validate(profileSchema), updateProfile);
router.get("/profile", verifyStaffMember, getProfile);

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
router.get("/pets", verifyStaffMember, getPets);
router.get("/pets/:id", verifyStaffMember, getPetById);
router.delete("/pets/:id", verifyStaffMember, deletePet);


// pets vaccinations
router.post("/pets/:id/vaccinations", verifyDoctor, validate(vaccinationSchema), addVaccination);
router.patch("/pets/:id/vaccinations/:vaccinationId", verifyDoctor, validate(vaccinationSchema), updateVaccination);
router.get("/pets/:id/vaccinations", verifyDoctor, getPetVaccinations);
router.get("/pets/:id/vaccinations/:vaccinationId", verifyDoctor, getVaccinationById);
router.delete("/pets/:id/vaccinations/:vaccinationId", verifyDoctor, deleteVaccinationById);


// pets medacin
router.post("/pets/:id/medacins", verifyDoctor, validate(MedacinSchema), addMedacin);
router.patch("/pets/:id/medacins/:medacinId", verifyDoctor, validate(updateMedacinSchema), updateMedacin);
router.get("/pets/:id/medacins", verifyDoctor, getPetMedacins);
router.get("/pets/:id/medacins/:medacinId", verifyDoctor, getMedacinById);
router.delete("/pets/:id/medacins/:medacinId", verifyDoctor, deleteMedacin);

// clients 
router.post("/clients", verifyStaffMember, upload.single('image'), validate(addClientSchema), addNewUser);
router.patch("/clients/:id", verifyStaffMember, upload.single('image'), validate(addClientSchema), updateUser);
router.get("/clients", verifyStaffMember, getUsers);
router.post("/clients/:id/suspend", verifyStaffMember, suspendUser);
router.get("/clients/:id", verifyStaffMember, getUserById);

// payments 
router.get("/payments", verifyRecieption, getPayments);
router.get("/payments/:id", verifyRecieption, getPaymentById);

//orders 
router.post("/orders", verifyStoreManagement, validate(orderSchema), addOrder);
router.get("/orders", verifyStoreManagement, getOrders);
router.post("/orders/:id/status", verifyStoreManagement, validate(orderStatusSchema), setStatus);
router.get("/orders/:id", verifyStoreManagement, getOrderById);


// Appointments Payments
router.post("/appointments/payments", verifyRecieption, validate(paymentSchema), addAppointmentsPayment);
router.patch("/appointments/payments/:id", verifyRecieption, validate(paymentSchema), updateAppointmentsPayment);
router.get("/appointments/payments", verifyRecieption, getAppointmentsPayments);
router.get("/appointments/payments/:id", verifyRecieption, getAppointmentsPaymentById);
router.delete("/appointments/payments/:id", verifyRecieption, deleteAppointmentsPayment);

// appointments routes 
router.get("/appointments", verifyStaffMember, getAppointments);
router.post("/appointments", verifyStaffMember, validate(AppointmentSchema), addAppointment);
router.patch("/appointments/:id", verifyStaffMember, validate(AppointmentSchema), updateAppointment);
router.get("/appointments/avaliable", verifyStaffMember, getAvaliableTime);
router.get("/appointments/doctors", verifyStaffMember, getAvaliableDoctrs);
router.get("/appointments/:id", verifyStaffMember, getAppointmentsById);
router.delete("/appointments/:id", verifyStaffMember, deleteAppointments);

// Staff routes
router.post("/defaultAdmin", defaultAdmin);
router.post("/staff", verifyAdmin, upload.single('image'), validate(addStaffSchema), addStaff);
router.patch("/staff/:id", verifyAdmin, upload.single('image'), validate(addStaffSchema), updateStaff);
router.get("/staff", verifyAdmin, getStaffMemebers);
router.get("/staff/:id", verifyAdmin, getStaffMemeberById);
router.get("/staff/:id/workHoures", verifyAdmin, getWorkHoures);
router.post("/staff/:id/workHoures", verifyAdmin, validate(workHouresSchema), setWorkHoures);
router.delete("/staff/:id", verifyAdmin, deleteStaffMember);

// items and items variables
router.get("/items", verifyStoreManagement, getItems);
router.get("/items/home", verifyStoreManagement, itemsHome);
router.get("/items/:id", verifyStoreManagement, getItemById);
router.post("/items",
    verifyStoreManagement,
    upload.fields([{ name: "mainImage", maxCount: 1 }, { name: "images" }]),
    validate(itemSchema),
    addItem
);
router.delete("/items/:id", verifyStoreManagement, deleteItem);
router.patch("/items/:id",
    verifyStoreManagement,
    upload.fields([{ name: "mainImage", maxCount: 1 }, { name: "images" }]),
    validate(itemSchema),
    updateItem
);

router.get("/itemsCategory", verifyStoreManagement, getItemsCategory);
router.post("/itemsCategory", verifyStoreManagement, validate(nameSchema), addItemCategory);
router.delete("/itemsCategory/:id", verifyStoreManagement, deleteCategory);

// services
router.post("/services", verifyAdmin, validate(nameSchema), addService);
router.get("/services", verifyAdmin, getServices);
router.delete("/services/:id", verifyAdmin, deleteService);

router.get("/petstypes", verifyAdmin, getTypes);
router.post("/petstypes", verifyAdmin, validate(nameSchema), addPetsType);
router.delete("/petstypes/:id", verifyAdmin, deleteType);

router.get("/breeds", verifyAdmin, getbreeds);
router.post("/breeds", verifyAdmin, validate(nameTypeSchema), addBreed);
router.delete("/breeds/:id", verifyAdmin, deletebreed);

export default router;