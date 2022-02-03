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
const Staff_1 = __importDefault(require("../models/Staff"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const verifyStaff = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffTokenSecret = process.env.STAF_TOKEN_SECRET;
        const decode = jsonwebtoken_1.default.verify(token, staffTokenSecret);
        const staffMember = yield Staff_1.default.findById(decode.staffId);
        if (!staffMember) {
            throw new Error("staff Member not found");
        }
        return staffMember;
    }
    catch (error) {
        console.log(error.message);
        throw new Error("not authorize");
    }
});
exports.default = verifyStaff;
