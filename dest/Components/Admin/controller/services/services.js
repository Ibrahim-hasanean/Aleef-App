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
exports.deleteService = exports.getServiceById = exports.getServices = exports.addService = void 0;
const Services_1 = __importDefault(require("../../../../models/Services"));
const addService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    let isExist = yield Services_1.default.findOne({ name });
    if (isExist)
        return res.status(409).json({ status: 409, msg: "service name exist" });
    let newService = yield Services_1.default.create({ name });
    return res.status(201).json({ status: 201, data: { service: newService } });
});
exports.addService = addService;
const getServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let services = yield Services_1.default.find({});
    return res.status(200).json({ status: 200, data: { services } });
});
exports.getServices = getServices;
const getServiceById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let serviceId = req.params.id;
    let service = yield Services_1.default.findById(serviceId);
    return res.status(200).json({ status: 200, data: { service } });
});
exports.getServiceById = getServiceById;
const deleteService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let serviceId = req.params.id;
    let service = yield Services_1.default.findByIdAndDelete(serviceId);
    return res.status(200).json({ status: 200, msg: "service deleted successfully" });
});
exports.deleteService = deleteService;
