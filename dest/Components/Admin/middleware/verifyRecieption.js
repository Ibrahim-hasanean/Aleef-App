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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Staff_1 = __importDefault(require("../../../models/Staff"));
require("dotenv").config();
function default_1(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authorization = req.headers.authorization;
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1];
        try {
            const staffTokenSecret = process.env.STAF_TOKEN_SECRET;
            const decode = jsonwebtoken_1.default.verify(token, staffTokenSecret);
            const staffMember = yield Staff_1.default.findById(decode.staffId).populate("role");
            if (!staffMember) {
                return res.status(401).json({ status: 401, msg: "unauthorized" });
            }
            if (staffMember.role !== "receiption" && staffMember.role !== "admin") {
                return res.status(403).json({ status: 403, msg: "not have permission" });
            }
            req.staff = staffMember;
            next();
        }
        catch (error) {
            return res.status(401).json({ status: 401, msg: "unauthorized" });
        }
    });
}
exports.default = default_1;
