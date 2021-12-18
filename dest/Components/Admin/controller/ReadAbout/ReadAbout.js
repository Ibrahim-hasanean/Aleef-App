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
exports.getReadAboute = exports.addReadAbout = void 0;
const ReadAboute_1 = __importDefault(require("../../../../models/ReadAboute"));
const addReadAbout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { description } = req.body;
    const isReadAboutxist = yield ReadAboute_1.default.find({});
    if (isReadAboutxist.length > 0) {
        let readAbout = isReadAboutxist[0];
        readAbout.description = description;
        yield readAbout.save();
        return res.status(200).json({ status: 200, msg: "new read about are added" });
    }
    let newReadAbout = yield ReadAboute_1.default.create({ description });
    return res.status(200).json({ status: 200, msg: "new read about are added" });
});
exports.addReadAbout = addReadAbout;
const getReadAboute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let readAbout = yield ReadAboute_1.default.find({});
    return res.status(201).json({ status: 201, data: { healthCare: readAbout[0] || "" } });
});
exports.getReadAboute = getReadAboute;
