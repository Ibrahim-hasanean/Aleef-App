import { Router } from "express";
import { getTypes, addPetsType, deleteType } from "./controller/Pets/PetsTypes";
import { addBreed, deletebreed, getbreeds } from "./controller/Pets/Breeds";
import { addGender, deleteGender, getGender } from "./controller/Pets/Gender";
import { addItemCategory, getItemsCategory, deleteCategory } from "./controller/Items/ItemsCategory";
import { addItem, deleteItem, getItemById, getItems, updateItem } from "./controller/Items/items";

const router = Router();


// items and items variables
router.get("/items", getItems);
router.get("/items/:id", getItemById);
router.post("/items", addItem);
router.delete("/items/:id", deleteItem);
router.patch("/items/:id", updateItem);

router.get("/itemsCategory", getItemsCategory);
router.post("/itemsCategory", addItemCategory);
router.delete("/itemsCategory/:id", deleteCategory);

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