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
exports.deletePet = exports.getPetById = exports.getPets = exports.addNewPet = void 0;
const Pets_1 = __importDefault(require("../../../../models/Pets"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../../../../models/User"));
const addNewPet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, serialNumber, age, typeId, breedId, gender, userId } = req.body;
    let user = yield User_1.default.findById(userId);
    if (!user) {
        return res.status(400).json({ status: 400, msg: "user not found" });
    }
    let pet = yield Pets_1.default.create({ user: user._id, name, serialNumber, age, type: typeId, breed: breedId, gender });
    user.pets = [...user.pets, pet._id];
    yield user.save();
    return res.status(201).json({ status: 201, data: { pet } });
});
exports.addNewPet = addNewPet;
const getPets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { page, limit, text, userId } = req.query;
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let query = {};
    if (text)
        query.name = { $regex: text, $options: "i" };
    if (userId)
        query.user = userId;
    const pets = yield Pets_1.default.find(query).skip(skip).limit(limitNumber)
        .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] });
    return res.status(200).json({ status: 200, data: { pets } });
});
exports.getPets = getPets;
const getPetById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(200).json({ status: 200, data: { pet: null } });
    }
    const pet = yield Pets_1.default.findById(id)
        .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] });
    return res.status(200).json({ status: 200, data: { pet } });
});
exports.getPetById = getPetById;
const deletePet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    const pet = yield Pets_1.default.findByIdAndDelete(id);
    return res.status(200).json({ status: 200, msg: "pet deleted successfully" });
});
exports.deletePet = deletePet;
