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
const AppointmentsPayment_1 = require("./controller/AppointmentsPayment/AppointmentsPayment");
const Payments_1 = require("./controller/Payments/Payments");
const Orders_1 = require("./controller/Orders/Orders");
const Users_1 = require("./controller/Users/Users");
const Pet_1 = require("./controller/Pets/Pet");
const Profile_1 = require("./controller/Profile/Profile");
const auth_1 = require("./controller/auth/auth");
const validateAuth_1 = require("./middleware/validateAuth");
const validateStaff_1 = require("./middleware/validateStaff");
const verifyAdmin_1 = __importDefault(require("./middleware/verifyAdmin"));
const verifyRecieption_1 = __importDefault(require("./middleware/verifyRecieption"));
const verifyStoreManagement_1 = __importDefault(require("./middleware/verifyStoreManagement"));
const verifyStaffMember_1 = __importDefault(require("./middleware/verifyStaffMember"));
const validateItem_1 = require("./middleware/validateItem");
const validateName_1 = require("./middleware/validateName");
const validateAppointment_1 = require("./middleware/validateAppointment");
const validatePayment_1 = require("./middleware/validatePayment");
const validateOrdres_1 = require("./middleware/validateOrdres");
const validateClient_1 = require("./middleware/validateClient");
const validatePets_1 = require("./middleware/validatePets");
const validateProfile_1 = require("./middleware/validateProfile");
const vaccination_1 = require("./controller/vaccinations/vaccination");
const verifyDoctor_1 = __importDefault(require("./middleware/verifyDoctor"));
const validateVaccination_1 = require("./middleware/validateVaccination");
const validateMedacin_1 = require("./middleware/validateMedacin");
const medacins_1 = require("./controller/medacins/medacins");
const HealthCare_1 = require("./controller/HealthCare/HealthCare");
const ReadAbout_1 = require("./controller/ReadAbout/ReadAbout");
const Location_1 = require("./controller/Location/Location");
const Invoice_1 = require("./controller/Invoice/Invoice");
const validateInvoice_1 = require("./middleware/validateInvoice");
const uploadImage_1 = __importDefault(require("../middlewares/uploadImage"));
const home_1 = require("./controller/home/home");
const StaffChat_1 = require("./controller/StaffChat/StaffChat");
const notifications_1 = require("./controller/notifications/notifications");
const router = (0, express_1.Router)();
// auth routers
router.post("/auth/logout", verifyStaffMember_1.default, auth_1.logout);
router.post("/auth/login", (0, validateAuth_1.validate)(validateAuth_1.loginSchema), auth_1.login);
router.post("/auth/verify", (0, validateAuth_1.validate)(validateAuth_1.verifyCodeSchema), auth_1.verifyCode);
//chat routes 
router.get("/conversations", verifyStaffMember_1.default, StaffChat_1.getConversations);
router.get("/conversations/:id", verifyStaffMember_1.default, StaffChat_1.getConversation);
router.get("/conversations/:id/messages", verifyStaffMember_1.default, StaffChat_1.getMessages);
//Notifications
router.get("/notifications", verifyStaffMember_1.default, notifications_1.getNotifications);
//home page
router.get("/admin-home", verifyAdmin_1.default, home_1.adminHome);
// invoices routes
router.post("/invoice", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateInvoice_1.InvoiceSchema), Invoice_1.addInvoice);
router.post("/invoice/doctor", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateInvoice_1.doctorInvoiceSchema), Invoice_1.doctorAddInvoice);
router.patch("/invoice/:id", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateInvoice_1.doctorInvoiceSchema), Invoice_1.doctorAddInvoice);
router.get("/invoice", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.appointmentsQuerySchema), Invoice_1.getInvoicements);
// profile
router.patch("/profile", verifyStaffMember_1.default, uploadImage_1.default.single('image'), (0, validateAuth_1.validate)(validateProfile_1.profileSchema), Profile_1.updateProfile);
router.get("/profile", verifyStaffMember_1.default, Profile_1.getProfile);
router.patch("/profile/notifications", verifyStaffMember_1.default, Profile_1.setProfileNotifications);
router.get("/profile/notifications", verifyStaffMember_1.default, Profile_1.getProfileNotifications);
// hospital locations
router.post("/location", verifyStaffMember_1.default, Location_1.addLocation);
router.get("/location", verifyStaffMember_1.default, Location_1.getLocation);
//health care
router.get("/healthcare", verifyStaffMember_1.default, HealthCare_1.getHealthCare);
router.post("/healthcare", verifyStaffMember_1.default, HealthCare_1.addHealthCareTip);
// Read aboute routes
router.get("/readabout", verifyStaffMember_1.default, ReadAbout_1.getReadAboute);
router.post("/readabout", verifyStaffMember_1.default, ReadAbout_1.addReadAbout);
//pets 
router.post("/pets", verifyStaffMember_1.default, uploadImage_1.default.single('image'), (0, validateAuth_1.validate)(validatePets_1.petSchema), Pet_1.addNewPet);
router.patch("/pets/:id", verifyStaffMember_1.default, uploadImage_1.default.single('image'), (0, validateAuth_1.validate)(validatePets_1.petSchema), Pet_1.updatePet);
router.get("/pets", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.appointmentsQuerySchema), Pet_1.getPets);
router.get("/pets/:id", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), Pet_1.getPetById);
router.delete("/pets/:id", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), Pet_1.deletePet);
// pets vaccinations
router.post("/pets/:id/vaccinations", verifyDoctor_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), (0, validateAuth_1.validate)(validateVaccination_1.vaccinationSchema), vaccination_1.addVaccination);
router.patch("/pets/:id/vaccinations/:vaccinationId", verifyDoctor_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), (0, validateAuth_1.validate)(validateVaccination_1.vaccinationSchema), vaccination_1.updateVaccination);
router.get("/pets/:id/vaccinations", verifyDoctor_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), vaccination_1.getPetVaccinations);
router.get("/pets/:id/vaccinations/:vaccinationId", verifyDoctor_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), vaccination_1.getVaccinationById);
router.delete("/pets/:id/vaccinations/:vaccinationId", verifyDoctor_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), vaccination_1.deleteVaccinationById);
// pets medacin
router.post("/pets/:id/medacins", verifyDoctor_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), (0, validateAuth_1.validate)(validateMedacin_1.MedacinSchema), medacins_1.addMedacin);
router.patch("/pets/:id/medacins/:medacinId", verifyDoctor_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), (0, validateAuth_1.validate)(validateMedacin_1.updateMedacinSchema), medacins_1.updateMedacin);
router.get("/pets/:id/medacins", verifyDoctor_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), medacins_1.getPetMedacins);
router.get("/pets/:id/medacins/:medacinId", verifyDoctor_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), medacins_1.getMedacinById);
router.delete("/pets/:id/medacins/:medacinId", verifyDoctor_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), medacins_1.deleteMedacin);
// clients 
router.post("/clients", verifyStaffMember_1.default, uploadImage_1.default.single('image'), (0, validateAuth_1.validate)(validateClient_1.addClientSchema), Users_1.addNewUser);
// router.post("/clients", verifyStaffMember, upload.fields([{ name: 'petsImages' }, { name: "image", maxCount: 1 }]), addNewUserWithPets);
router.patch("/clients/:id", verifyStaffMember_1.default, uploadImage_1.default.single('image'), (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), (0, validateAuth_1.validate)(validateClient_1.addClientSchema), Users_1.updateUser);
// router.patch("/clients/:id", verifyStaffMember, upload.fields([{ name: 'petsImages' }, { name: "image", maxCount: 1 }]), validate(ValidateIdParam), updateUserWithPets);
router.get("/clients", verifyStaffMember_1.default, Users_1.getUsers);
router.post("/clients/:id/suspend", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), Users_1.suspendUser);
router.get("/clients/:id", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), Users_1.getUserById);
router.delete("/clients/:id", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), Users_1.deleteUser);
// payments 
router.get("/payments", verifyRecieption_1.default, Payments_1.getPayments);
router.get("/payments/:id", verifyRecieption_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), Payments_1.getPaymentById);
//orders 
router.post("/orders", verifyStoreManagement_1.default, (0, validateAuth_1.validate)(validateOrdres_1.orderSchema), Orders_1.addOrder);
router.get("/orders", verifyStoreManagement_1.default, Orders_1.getOrders);
router.post("/orders/:id/status", verifyStoreManagement_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), (0, validateAuth_1.validate)(validateOrdres_1.orderStatusSchema), Orders_1.setStatus);
router.get("/orders/:id", verifyStoreManagement_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), Orders_1.getOrderById);
// Appointments Payments
router.post("/appointments/payments", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validatePayment_1.paymentSchema), AppointmentsPayment_1.addAppointmentsPayment);
router.patch("/appointments/payments/:id", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validatePayment_1.paymentSchema), AppointmentsPayment_1.updateAppointmentsPayment);
router.get("/appointments/payments", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.appointmentsQuerySchema), AppointmentsPayment_1.getAppointmentsPayments);
router.get("/appointments/payments/:id", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), AppointmentsPayment_1.getAppointmentsPaymentById);
router.delete("/appointments/payments/:id", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), AppointmentsPayment_1.deleteAppointmentsPayment);
// appointments routes 
router.get("/appointments", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.appointmentsQuerySchema), appointments_1.getAppointments);
router.post("/appointments", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.AppointmentSchema), appointments_1.addAppointment);
router.patch("/appointments/:id/status", verifyStaffMember_1.default, appointments_1.setAppointmentStatus);
router.patch("/appointments/:id", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), (0, validateAuth_1.validate)(validateAppointment_1.AppointmentSchema), appointments_1.updateAppointment);
router.get("/appointments/avaliable", verifyStaffMember_1.default, appointments_1.getAvaliableTime);
router.get("/appointments/doctors", verifyStaffMember_1.default, appointments_1.getAvaliableDoctrs);
router.get("/appointments/users/:id", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), appointments_1.userAppointments);
router.post("/appointments/:id/report", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), appointments_1.addReportToAppointment);
router.patch("/appointments/:id/report", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), appointments_1.addReportToAppointment);
router.delete("/appointments/:id/report", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), appointments_1.deleteReportToAppointment);
router.get("/appointments/:id", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), appointments_1.getAppointmentsById);
router.delete("/appointments/:id", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), appointments_1.deleteAppointments);
// Staff routes
router.post("/defaultAdmin", staff_1.defaultAdmin);
router.post("/staff", verifyRecieption_1.default, uploadImage_1.default.single('image'), (0, validateAuth_1.validate)(validateStaff_1.addStaffSchema), staff_1.addStaff);
router.patch("/staff/:id", verifyRecieption_1.default, uploadImage_1.default.single('image'), (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), (0, validateAuth_1.validate)(validateStaff_1.addStaffSchema), staff_1.updateStaff);
router.get("/staff", verifyRecieption_1.default, staff_1.getStaffMemebers);
router.get("/staff/:id", verifyRecieption_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), staff_1.getStaffMemeberById);
router.get("/staff/:id/workHoures", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), staff_1.getWorkHoures);
router.post("/staff/:id/workHoures", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), (0, validateAuth_1.validate)(validateStaff_1.workHouresSchema), staff_1.setWorkHoures);
router.delete("/staff/:id", verifyRecieption_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), staff_1.deleteStaffMember);
// items and items variables
router.get("/items", verifyStoreManagement_1.default, items_1.getItems);
router.get("/items/home", verifyStoreManagement_1.default, items_1.itemsHome);
router.get("/items/:id", verifyStoreManagement_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), items_1.getItemById);
router.post("/items/:id/toggle", verifyStoreManagement_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), items_1.toggleHide);
router.post("/items", verifyStoreManagement_1.default, uploadImage_1.default.fields([{ name: "mainImage", maxCount: 1 }, { name: "images" }]), (0, validateAuth_1.validate)(validateItem_1.itemSchema), items_1.addItem);
router.delete("/items/:id", verifyStoreManagement_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), items_1.deleteItem);
router.patch("/items/:id", verifyStoreManagement_1.default, uploadImage_1.default.fields([{ name: "mainImage", maxCount: 1 }, { name: "images" }]), (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), (0, validateAuth_1.validate)(validateItem_1.itemSchema), items_1.updateItem);
router.get("/itemsCategory", verifyStoreManagement_1.default, ItemsCategory_1.getItemsCategory);
router.post("/itemsCategory", verifyStoreManagement_1.default, (0, validateAuth_1.validate)(validateName_1.nameSchema), ItemsCategory_1.addItemCategory);
router.delete("/itemsCategory/:id", verifyStoreManagement_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), ItemsCategory_1.deleteCategory);
// services
router.post("/services", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateName_1.nameSchema), services_1.addService);
router.get("/services", verifyStaffMember_1.default, services_1.getServices);
router.delete("/services/:id", verifyStaffMember_1.default, services_1.deleteService);
router.get("/petstypes", verifyStaffMember_1.default, PetsTypes_1.getTypes);
router.post("/petstypes", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateName_1.nameSchema), PetsTypes_1.addPetsType);
router.delete("/petstypes/:id", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), PetsTypes_1.deleteType);
router.get("/breeds", verifyStaffMember_1.default, Breeds_1.getbreeds);
router.post("/breeds", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateName_1.nameTypeSchema), Breeds_1.addBreed);
router.delete("/breeds/:id", verifyStaffMember_1.default, (0, validateAuth_1.validate)(validateAppointment_1.ValidateIdParam), Breeds_1.deletebreed);
exports.default = router;
