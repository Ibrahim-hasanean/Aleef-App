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
exports.getLocation = exports.addLocation = void 0;
const Location_1 = __importDefault(require("../../../../models/Location"));
const addLocation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { lat, long } = req.body;
    const isLocationExist = yield Location_1.default.find({});
    if (isLocationExist.length > 0) {
        let location = isLocationExist[0];
        location.lat = lat;
        location.long = long;
        yield location.save();
        return res.status(200).json({ status: 200, msg: "new location are added" });
    }
    let location = yield Location_1.default.create({ lat, long });
    return res.status(200).json({ status: 200, msg: "new location are added" });
});
exports.addLocation = addLocation;
const getLocation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let location = yield Location_1.default.find({});
    return res.status(200).json({ status: 200, data: { healthCare: location[0] || "" } });
});
exports.getLocation = getLocation;
