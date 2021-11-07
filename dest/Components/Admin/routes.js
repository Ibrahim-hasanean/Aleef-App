"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PetsTypes_1 = require("./controller/Pets/PetsTypes");
const Breeds_1 = require("./controller/Pets/Breeds");
const ItemsCategory_1 = require("./controller/Items/ItemsCategory");
const items_1 = require("./controller/Items/items");
const services_1 = require("./controller/services/services");
const staff_1 = require("./controller/staff/staff");
const appointments_1 = require("./controller/appointments/appointments");
const auth_1 = require("./controller/auth/auth");
const validateAuth_1 = require("./middleware/validateAuth");
const validateStaff_1 = require("./middleware/validateStaff");
const verifyAdmin_1 = __importDefault(require("./middleware/verifyAdmin"));
const verifyRecieption_1 = __importDefault(require("./middleware/verifyRecieption"));
const verifyStoreManagement_1 = __importDefault(require("./middleware/verifyStoreManagement"));
const validateItem_1 = require("./middleware/validateItem");
const validateName_1 = require("./middleware/validateName");
const validateAppointment_1 = require("./middleware/validateAppointment");
const router = (0, express_1.Router)();
// auth routers
router.post("/login", (0, validateAuth_1.validate)(validateAuth_1.loginSchema), auth_1.login);
// appointments routes 
router.get("/appointments", verifyRecieption_1.default, appointments_1.getAppointments);
router.post("/appointments", verifyRecieption_1.default, (0, validateAuth_1.validate)(validateAppointment_1.AppointmentSchema), appointments_1.addAppointment);
router.patch("/appointments", verifyRecieption_1.default, (0, validateAuth_1.validate)(validateAppointment_1.AppointmentSchema), appointments_1.updateAppointment);
router.get("/appointments/avaliable", verifyRecieption_1.default, appointments_1.getAvaliableTime);
router.get("/appointments/doctors", verifyRecieption_1.default, appointments_1.getAvaliableDoctrs);
router.get("/appointments/:id", verifyRecieption_1.default, appointments_1.getAppointmentsById);
router.delete("/appointments/:id", verifyRecieption_1.default, appointments_1.deleteAppointments);
// Staff routes
router.post("/defaultAdmin", staff_1.defaultAdmin);
router.post("/staff", verifyAdmin_1.default, (0, validateAuth_1.validate)(validateStaff_1.addStaffSchema), staff_1.addStaff);
router.patch("/staff/:id", verifyAdmin_1.default, (0, validateAuth_1.validate)(validateStaff_1.addStaffSchema), staff_1.updateStaff);
router.get("/staff", verifyAdmin_1.default, staff_1.getStaffMemebers);
router.get("/staff/:id", verifyAdmin_1.default, staff_1.getStaffMemeberById);
router.delete("/staff/:id", verifyAdmin_1.default, staff_1.deleteStaffMember);
// items and items variables
router.get("/items", verifyStoreManagement_1.default, items_1.getItems);
router.get("/items/:id", verifyStoreManagement_1.default, items_1.getItemById);
router.post("/items", verifyStoreManagement_1.default, (0, validateAuth_1.validate)(validateItem_1.itemSchema), items_1.addItem);
router.delete("/items/:id", verifyStoreManagement_1.default, items_1.deleteItem);
router.patch("/items/:id", verifyStoreManagement_1.default, (0, validateAuth_1.validate)(validateItem_1.itemSchema), items_1.updateItem);
router.get("/itemsCategory", verifyStoreManagement_1.default, ItemsCategory_1.getItemsCategory);
router.post("/itemsCategory", verifyStoreManagement_1.default, (0, validateAuth_1.validate)(validateName_1.nameSchema), ItemsCategory_1.addItemCategory);
router.delete("/itemsCategory/:id", verifyStoreManagement_1.default, ItemsCategory_1.deleteCategory);
// services
router.post("/services", verifyAdmin_1.default, (0, validateAuth_1.validate)(validateName_1.nameSchema), services_1.addService);
router.get("/services", verifyAdmin_1.default, services_1.getServices);
router.delete("/services/:id", verifyAdmin_1.default, services_1.deleteService);
router.get("/petstypes", verifyAdmin_1.default, PetsTypes_1.getTypes);
router.post("/petstypes", verifyAdmin_1.default, (0, validateAuth_1.validate)(validateName_1.nameSchema), PetsTypes_1.addPetsType);
router.delete("/petstypes/:id", verifyAdmin_1.default, PetsTypes_1.deleteType);
router.get("/breeds", verifyAdmin_1.default, Breeds_1.getbreeds);
router.post("/breeds", verifyAdmin_1.default, (0, validateAuth_1.validate)(validateName_1.nameTypeSchema), Breeds_1.addBreed);
router.delete("/breeds/:id", verifyAdmin_1.default, Breeds_1.deletebreed);
exports.default = router;
