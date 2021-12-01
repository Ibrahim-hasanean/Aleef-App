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
exports.updateMedacin = exports.addMedacin = exports.deleteMedacin = exports.getMedacinById = exports.getPetMedacins = void 0;
const Pets_1 = __importDefault(require("../../../../models/Pets"));
const mongoose_1 = __importDefault(require("mongoose"));
const Medacine_1 = __importDefault(require("../../../../models/Medacine"));
const Appointments_1 = __importDefault(require("../../../../models/Appointments"));
const getPetMedacins = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let petId = req.params.id;
    if (!mongoose_1.default.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let pet = yield Pets_1.default.findById(petId).populate("medacins");
    return res.status(200).json({ status: 200, data: { medacins: pet === null || pet === void 0 ? void 0 : pet.medacins } });
});
exports.getPetMedacins = getPetMedacins;
const getMedacinById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let petId = req.params.id;
    let medacinId = req.params.medacinId;
    if (!mongoose_1.default.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let medacin = yield Medacine_1.default.findOne({ pet: petId, _id: medacinId });
    return res.status(200).json({ status: 200, data: { medacin: medacin } });
});
exports.getMedacinById = getMedacinById;
const deleteMedacin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let petId = req.params.id;
    let medacinId = req.params.medacinId;
    if (!mongoose_1.default.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let medacin = yield Medacine_1.default.findOne({ pet: petId, _id: medacinId });
    if (!medacin)
        return res.status(200).json({ status: 200, msg: "medacin deleted successfully" });
    yield medacin.delete();
    return res.status(200).json({ status: 200, msg: "medacin deleted successfully" });
});
exports.deleteMedacin = deleteMedacin;
const addMedacin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, duration, appointmentId, repetition, notes } = req.body;
    let petId = req.params.id;
    if (!mongoose_1.default.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    if (!mongoose_1.default.isValidObjectId(appointmentId)) {
        return res.status(400).json({ status: 400, msg: `appointment with id ${appointmentId}  not found` });
    }
    let pet = yield Pets_1.default.findById(petId).populate("vaccinations");
    if (!pet)
        return res.status(400).json({ status: 400, msg: "pet not found" });
    let appointment = yield Appointments_1.default.findById(appointmentId);
    if (!appointment)
        return res.status(400).json({ status: 400, msg: `appointment with id ${appointmentId}  not found` });
    let newMedacin = yield Medacine_1.default.create({ name, duration, pet: petId, repetition, notes, appointment: appointmentId });
    pet.medacins = [...pet.medacins, newMedacin._id];
    appointment.medacin = newMedacin._id;
    yield pet.save();
    yield appointment.save();
    return res.status(201).json({
        status: 201,
        msg: "medacin added to pet  successfully",
        data: { medacin: newMedacin }
    });
});
exports.addMedacin = addMedacin;
const updateMedacin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, duration, repetition, notes } = req.body;
    let petId = req.params.id;
    let medacinId = req.params.medacinId;
    if (!mongoose_1.default.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let pet = yield Pets_1.default.findById(petId).populate("vaccinations");
    if (!pet)
        return res.status(400).json({ status: 400, msg: "pet not found" });
    let newMedacin = yield Medacine_1.default.findByIdAndUpdate(medacinId, { name, duration, repetition, notes });
    return res.status(200).json({
        status: 200,
        msg: "medacin updated to pet  successfully",
        data: { medacin: newMedacin }
    });
});
exports.updateMedacin = updateMedacin;
