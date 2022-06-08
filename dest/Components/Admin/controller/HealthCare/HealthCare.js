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
exports.getHealthCare = exports.addHealthCareTip = void 0;
const HealthCare_1 = __importDefault(require("../../../../models/HealthCare"));
const addHealthCareTip = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { description } = req.body;
    const isHealthCareExist = yield HealthCare_1.default.find({});
    if (isHealthCareExist.length > 0) {
        let healthCareTips = isHealthCareExist[0];
        healthCareTips.description = description;
        yield healthCareTips.save();
        return res.status(200).json({ status: 200, msg: "new health care  tips are added", description });
    }
    let newHealthCare = yield HealthCare_1.default.create({ description });
    return res.status(200).json({ status: 200, msg: "new health care tips are added", data: { description } });
});
exports.addHealthCareTip = addHealthCareTip;
const getHealthCare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let healthCares = yield HealthCare_1.default.find({});
    return res.status(201).json({ status: 201, data: { healthCare: healthCares[0] || "" } });
});
exports.getHealthCare = getHealthCare;
