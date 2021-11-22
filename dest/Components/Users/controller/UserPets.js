"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBreeds = exports.getPetsTypes = exports.deletePet = exports.getPetById = exports.updatePet = exports.addPets = exports.getPets = void 0;
const Pets_1 = __importDefault(require("../../../models/Pets"));
const PetsTypes_1 = __importDefault(require("../../../models/PetsTypes"));
const Breed_1 = __importDefault(require("../../../models/Breed"));
const getPets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let pets = yield Pets_1.default.find({ user: user._id }).populate("type").populate("gender").populate("breed");
    return res.status(200).json({ status: 200, data: { pets } });
});
exports.getPets = getPets;
const addPets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, serialNumber, age, typeId, breedId, gender } = req.body;
    let user = req.user;
    let pet = yield Pets_1.default.create({ user: user._id, name, serialNumber, age, type: typeId, breed: breedId, gender });
    user.pets = [...user.pets, pet._id];
    yield user.save();
    return res.status(201).json({ status: 201, data: { pet } });
});
exports.addPets = addPets;
const updatePet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, serialNumber, age, typeId, breedId, gender } = req.body;
    const petId = req.params.id;
    let user = req.user;
    // let pet = await Pets.findOneAndUpdate({ user: user._id, _id: petId }, { name, serialNumber, age, type: typeId, breed: breedId, gender });
    let pet = yield Pets_1.default.findOne({ user: user._id, _id: petId });
    if (!pet)
        return res.status(400).json({ status: 400, msg: `pet with id ${petId} not found` });
    pet.name = name;
    pet.serialNumber = serialNumber;
    pet.type = typeId;
    pet.breed = breedId;
    pet.gender = gender;
    pet.age = age;
    yield pet.save();
    return res.status(201).json({ status: 201, data: { pet } });
});
exports.updatePet = updatePet;
const getPetById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const petId = req.params.id;
    let user = req.user;
    let pet = yield Pets_1.default.findOne({ user: user._id, _id: petId }).populate("type").populate("gender").populate("breed");
    return res.status(200).json({ status: 200, data: { pet } });
});
exports.getPetById = getPetById;
const deletePet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const petId = req.params.id;
    let user = req.user;
    let pet = yield Pets_1.default.findOneAndDelete({ user: user._id, _id: petId });
    return res.status(200).json({ status: 200, data: { pet } });
});
exports.deletePet = deletePet;
const getPetsTypes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let petsTypes = yield PetsTypes_1.default.find({}).populate("breeds");
    return res.status(200).json({ status: 200, data: { petsTypes } });
});
exports.getPetsTypes = getPetsTypes;
const getBreeds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let breeds = yield Breed_1.default.find({}).populate("type");
    return res.status(200).json({ status: 200, data: { breeds } });
});
exports.getBreeds = getBreeds;
