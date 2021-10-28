import { Router } from "express";
import { getTypes, addPetsType, deleteType } from "./controller/Pets/PetsTypes";
import { addBreed, deletebreed, getbreeds } from "./controller/Pets/Breeds";
import { addGender, deleteGender, getGender } from "./controller/Pets/Gender";
import { addItemCategory, getItemsCategory, deleteCategory } from "./controller/Items/ItemsCategory";
import { addItem, deleteItem, getItemById, getItems, updateItem } from "./controller/Items/items";
import { addService, deleteService, getServiceById, getServices } from "./controller/services/services";
import { addStaff, deleteStaffMember, getStaffMemeberById, getStaffMemebers, updateStaff } from "./controller/staff/staff";
import { addStaffRole, deleteStaffRole, getStaffRole } from "./controller/staff/staffRoles";

const router = Router();


//Staff Roles routes
router.post("/staffRoles", addStaffRole);
router.get("/staffRoles", getStaffRole);
router.delete("/staffRoles/:id", deleteStaffRole);

// Staff routes
router.post("/staff", addStaff);
router.patch("/staff/:id", updateStaff);
router.get("/staff", getStaffMemebers);
router.get("/staff/:id", getStaffMemeberById);
router.delete("/staff/:id", deleteStaffMember);



// items and items variables
router.get("/items", getItems);
router.get("/items/:id", getItemById);
router.post("/items", addItem);
router.delete("/items/:id", deleteItem);
router.patch("/items/:id", updateItem);

router.get("/itemsCategory", getItemsCategory);
router.post("/itemsCategory", addItemCategory);
router.delete("/itemsCategory/:id", deleteCategory);

// services
router.post("/services", addService);
router.get("/services", getServices);
router.delete("/services/:id", deleteService);

// pets and pets variables
router.get("/genders", getGender);
router.post("/genders", addGender);
router.delete("/genders/:id", deleteGender);

router.get("/petstypes", getTypes);
router.post("/petstypes", addPetsType);
router.delete("/petstypes/:id", deleteType);


router.get("/breeds", getbreeds);
router.post("/breeds", addBreed);
router.delete("/breeds/:id", deletebreed);

export default router;