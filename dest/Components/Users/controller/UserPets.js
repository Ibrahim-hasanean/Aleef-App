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
const Appointments_1 = __importDefault(require("../../../models/Appointments"));
const Vaccination_1 = __importDefault(require("../../../models/Vaccination"));
const Medacine_1 = __importDefault(require("../../../models/Medacine"));
const uploadFileToFirebase_1 = __importDefault(require("../../utils/uploadFileToFirebase"));
const getPets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { page, limit } = req.query;
    let numberPageSize = limit ? Number(limit) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let user = req.user;
    let date = new Date();
    // .skip(skip)
    // .limit(numberPageSize)
    let pets = yield Pets_1.default.find({ user: user._id })
        .populate("type")
        .populate("gender")
        .populate("breed")
        .populate({
        path: "appointments",
        select: "appointmentDate",
        options: {
            sort: { appointmentDate: "desc" }, match: { appointmentDate: { $lte: date } },
        },
        limit: 1
    });
    let petsObjects = pets.map((x) => {
        var _a;
        let appoinments = x.appointments;
        return (Object.assign({ lastCheckUp: (appoinments[0] && ((_a = appoinments[0]) === null || _a === void 0 ? void 0 : _a.appointmentDate)) || null }, x === null || x === void 0 ? void 0 : x.toObject()));
    });
    return res.status(200).json({ status: 200, data: { pets: petsObjects } });
});
exports.getPets = getPets;
const addPets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, serialNumber, age, typeId, breedId, gender, duerming, nutried } = req.body;
    let image = req.file;
    let imageUrl = image ? yield (0, uploadFileToFirebase_1.default)(image) : "";
    let user = req.user;
    let isPetTypeExist = yield PetsTypes_1.default.findById(typeId);
    if (!isPetTypeExist)
        return res.status(400).json({ status: 400, msg: "pet type not found" });
    let isPetBreedExist = yield Breed_1.default.findById(breedId);
    if (!isPetBreedExist)
        return res.status(400).json({ status: 400, msg: "pet breed not found" });
    let pet = yield Pets_1.default.create({ user: user._id, imageUrl, name, serialNumber, age, type: typeId, breed: breedId, gender, duerming, nutried });
    user.pets = [...user.pets, pet._id];
    yield user.save();
    return res.status(201).json({ status: 201, data: { pet } });
});
exports.addPets = addPets;
const updatePet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, serialNumber, age, typeId, breedId, gender, duerming, nutried } = req.body;
    let image = req.file;
    let imageUrl;
    if (image)
        imageUrl = yield (0, uploadFileToFirebase_1.default)(image);
    const petId = req.params.id;
    let user = req.user;
    let pet = yield Pets_1.default.findOne({ user: user._id, _id: petId });
    if (!pet)
        return res.status(400).json({ status: 400, msg: `pet with id ${petId} not found` });
    let isPetTypeExist = yield PetsTypes_1.default.findById(typeId);
    if (!isPetTypeExist)
        return res.status(400).json({ status: 400, msg: "pet type not found" });
    let isPetBreedExist = yield Breed_1.default.findById(breedId);
    if (!isPetBreedExist)
        return res.status(400).json({ status: 400, msg: "pet breed not found" });
    pet.name = name;
    pet.serialNumber = serialNumber;
    pet.type = typeId;
    pet.breed = breedId;
    pet.gender = gender;
    pet.duerming = duerming;
    pet.nutried = nutried;
    pet.age = age;
    pet.imageUrl = imageUrl ? imageUrl : pet.imageUrl;
    yield pet.save();
    return res.status(200).json({ status: 200, data: { pet } });
});
exports.updatePet = updatePet;
const getPetById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const petId = req.params.id;
    let user = req.user;
    let pet = yield Pets_1.default.findOne({ user: user._id, _id: petId })
        .populate("type")
        .populate("vaccinations")
        .populate("gender")
        .populate("breed");
    // .populate("appointments")
    if (!pet)
        return res.status(200).json({ status: 200, pet: null });
    let date = new Date();
    let appointment = yield Appointments_1.default
        .find({ pet: petId, appointmentDate: { $lte: date } })
        .sort({ appointmentDate: "desc" })
        .limit(1);
    let grooming = yield Appointments_1.default
        .find({ pet: petId, appointmentDate: { $lte: date }, service: "grooming" })
        .sort({ appointmentDate: "desc" })
        .limit(1);
    let medacin = yield Medacine_1.default
        .find({ pet: petId })
        .sort({ createdAt: "desc" })
        .limit(1);
    // let vaccination: PetsVaccination[] = await Vaccination
    //     .find({ pet: petId, dates: { $elemMatch: { $gte: date } } });
    let vaccination = yield Vaccination_1.default
        .find({ pet: petId, date: { $gte: date } }).sort({ date: "asc" }).limit(1);
    // let nextVaccination = getNextVaccination(vaccination);
    return res.status(200).json({
        status: 200,
        data: {
            pet: Object.assign(Object.assign({}, pet === null || pet === void 0 ? void 0 : pet.toJSON()), { lastCheckUp: (appointment[0] && appointment[0].appointmentDate) || "", lastGrooming: (grooming[0] && grooming[0].appointmentDate) || "", lastPrescription: (medacin[0] && medacin[0].createdAt) || "", 
                // nextVaccination: nextVaccination == "Invalid Date" ? "" : nextVaccination
                nextVaccination: (_b = (_a = vaccination[0]) === null || _a === void 0 ? void 0 : _a.date) !== null && _b !== void 0 ? _b : "" })
        }
    });
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
