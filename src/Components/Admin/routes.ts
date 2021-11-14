import { Router } from "express";
import { getTypes, addPetsType, deleteType } from "./controller/Pets/PetsTypes";
import { addBreed, deletebreed, getbreeds } from "./controller/Pets/Breeds";
import { addItemCategory, getItemsCategory, deleteCategory } from "./controller/Items/ItemsCategory";
import { addItem, deleteItem, getItemById, getItems, updateItem } from "./controller/Items/items";
import { addService, deleteService, getServiceById, getServices } from "./controller/services/services";
import { addStaff, defaultAdmin, deleteStaffMember, getStaffMemeberById, getStaffMemebers, updateStaff } from "./controller/staff/staff";
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
import { login } from "./controller/auth/auth";
import { loginSchema, validate } from "./middleware/validateAuth";
import { addStaffSchema } from "./middleware/validateStaff";
import verifyAdmin from "./middleware/verifyAdmin";
import verifyRecieption from "./middleware/verifyRecieption";
import verifyStoreManagement from "./middleware/verifyStoreManagement";
import { itemSchema } from "./middleware/validateItem";
import { nameSchema, nameTypeSchema } from "./middleware/validateName";
import { AppointmentSchema } from "./middleware/validateAppointment";
import { paymentSchema } from "./middleware/validatePayment";
import { orderSchema, orderStatusSchema } from "./middleware/validateOrdres";

const router = Router();

// auth routers
router.post("/login", validate(loginSchema), login);

// payments 
router.get("/payments", getPayments);
router.get("/payments/:id", getPaymentById);

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
router.get("/appointments", verifyRecieption, getAppointments);
router.post("/appointments", verifyRecieption, validate(AppointmentSchema), addAppointment);
router.patch("/appointments", verifyRecieption, validate(AppointmentSchema), updateAppointment);
router.get("/appointments/avaliable", verifyRecieption, getAvaliableTime);
router.get("/appointments/doctors", verifyRecieption, getAvaliableDoctrs);
router.get("/appointments/:id", verifyRecieption, getAppointmentsById);
router.delete("/appointments/:id", verifyRecieption, deleteAppointments);

// Staff routes
router.post("/defaultAdmin", defaultAdmin);
router.post("/staff", verifyAdmin, validate(addStaffSchema), addStaff);
router.patch("/staff/:id", verifyAdmin, validate(addStaffSchema), updateStaff);
router.get("/staff", verifyAdmin, getStaffMemebers);
router.get("/staff/:id", verifyAdmin, getStaffMemeberById);
router.delete("/staff/:id", verifyAdmin, deleteStaffMember);

// items and items variables
router.get("/items", verifyStoreManagement, getItems);
router.get("/items/:id", verifyStoreManagement, getItemById);
router.post("/items", verifyStoreManagement, validate(itemSchema), addItem);
router.delete("/items/:id", verifyStoreManagement, deleteItem);
router.patch("/items/:id", verifyStoreManagement, validate(itemSchema), updateItem);

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