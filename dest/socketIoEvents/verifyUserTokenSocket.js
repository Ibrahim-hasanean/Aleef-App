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
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const verifyUser = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userTokenSecret = process.env.USER_TOKEN_SECRET;
        const decode = jsonwebtoken_1.default.verify(token, userTokenSecret);
        const user = yield User_1.default.findById(decode.userId);
        if (!user) {
            throw new Error("user not found");
        }
        return user;
    }
    catch (error) {
        console.log(error.message);
        throw new Error("not authorize");
    }
});
exports.default = verifyUser;
