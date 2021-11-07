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
exports.getbreeds = exports.deletebreed = exports.addBreed = void 0;
const Breed_1 = __importDefault(require("../../../../models/Breed"));
const PetsTypes_1 = __importDefault(require("../../../../models/PetsTypes"));
const addBreed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, typeId } = req.body;
    const breed = yield Breed_1.default.create({ name, type: typeId });
    const type = yield PetsTypes_1.default.findById(typeId);
    if (!type)
        return res.status(400).json({ status: 400, msg: "breed type not found" });
    type.breeds = [...type === null || type === void 0 ? void 0 : type.breeds, breed._id];
    yield (type === null || type === void 0 ? void 0 : type.save());
    return res.status(201).json({ status: 201, data: { breed } });
});
exports.addBreed = addBreed;
const deletebreed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const breedId = req.params.id;
    const breed = yield Breed_1.default.findByIdAndDelete(breedId);
    return res.status(200).json({ status: 200, msg: "pets breed deleted successfully" });
});
exports.deletebreed = deletebreed;
const getbreeds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const breeds = yield Breed_1.default.find({}).populate("type");
    return res.status(200).json({ status: 200, data: { breeds } });
});
exports.getbreeds = getbreeds;
