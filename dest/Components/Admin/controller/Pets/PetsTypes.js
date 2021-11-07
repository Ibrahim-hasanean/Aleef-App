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
exports.getTypes = exports.deleteType = exports.addPetsType = void 0;
const PetsTypes_1 = __importDefault(require("../../../../models/PetsTypes"));
const addPetsType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const type = yield PetsTypes_1.default.create({ name });
    return res.status(201).json({ status: 201, data: { type } });
});
exports.addPetsType = addPetsType;
const deleteType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const typeId = req.params.id;
    const type = yield PetsTypes_1.default.findByIdAndDelete(typeId);
    return res.status(200).json({ status: 200, msg: "pets type deleted successfully" });
});
exports.deleteType = deleteType;
const getTypes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const types = yield PetsTypes_1.default.find({}).populate("breeds");
    return res.status(200).json({ status: 200, data: { types } });
});
exports.getTypes = getTypes;
