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
exports.updateVaccination = exports.addVaccination = exports.deleteVaccinationById = exports.getVaccinationById = exports.getPetVaccinations = void 0;
const Pets_1 = __importDefault(require("../../../../models/Pets"));
const mongoose_1 = __importDefault(require("mongoose"));
const Vaccination_1 = __importDefault(require("../../../../models/Vaccination"));
const getPetVaccinations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let petId = req.params.id;
    if (!mongoose_1.default.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let pet = yield Pets_1.default.findById(petId).populate("vaccinations");
    return res.status(200).json({ status: 200, data: { vaccinations: pet === null || pet === void 0 ? void 0 : pet.vaccinations } });
});
exports.getPetVaccinations = getPetVaccinations;
const getVaccinationById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let petId = req.params.id;
    let vaccinationId = req.params.vaccinationId;
    if (!mongoose_1.default.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let vaccination = yield Vaccination_1.default.findOne({ pet: petId, _id: vaccinationId });
    return res.status(200).json({ status: 200, data: { vaccinations: vaccination } });
});
exports.getVaccinationById = getVaccinationById;
const deleteVaccinationById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let petId = req.params.id;
    let vaccinationId = req.params.vaccinationId;
    if (!mongoose_1.default.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let vaccination = yield Vaccination_1.default.findOne({ pet: petId, _id: vaccinationId });
    if (!vaccination)
        return res.status(200).json({ status: 200, msg: "vaccination deleted successfully" });
    yield vaccination.delete();
    return res.status(200).json({ status: 200, msg: "vaccination deleted successfully" });
});
exports.deleteVaccinationById = deleteVaccinationById;
const addVaccination = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, date, repetition, durations, notes } = req.body;
    let petId = req.params.id;
    if (!mongoose_1.default.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let pet = yield Pets_1.default.findById(petId).populate("vaccinations");
    if (!pet)
        return res.status(400).json({ status: 400, msg: "pet not found" });
    let newVaccinations = yield Vaccination_1.default.create({ name, date, pet: petId, repetition, durations, notes });
    pet.vaccinations = [...pet.vaccinations, newVaccinations._id];
    yield pet.save();
    return res.status(201).json({
        status: 201,
        msg: "vaccination added to pet  successfully",
        data: { vaccination: newVaccinations }
    });
});
exports.addVaccination = addVaccination;
const updateVaccination = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, date, repetition, durations, notes } = req.body;
    let petId = req.params.id;
    let vaccinationId = req.params.vaccinationId;
    if (!mongoose_1.default.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let pet = yield Pets_1.default.findById(petId).populate("vaccinations");
    if (!pet)
        return res.status(400).json({ status: 400, msg: "pet not found" });
    let newVaccinations = yield Vaccination_1.default
        .findByIdAndUpdate(vaccinationId, { name, date, pet: petId, repetition, durations, notes }, { new: true });
    return res.status(200).json({
        status: 200,
        msg: "vaccination updated to pet  successfully",
        data: { vaccination: newVaccinations }
    });
});
exports.updateVaccination = updateVaccination;
