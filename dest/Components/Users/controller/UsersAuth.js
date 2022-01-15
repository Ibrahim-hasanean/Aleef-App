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
exports.verifyCode = exports.resetPassword = exports.forgetPassword = exports.logout = exports.login = exports.facebookAuth = exports.googleAuth = exports.register = void 0;
const User_1 = __importDefault(require("../../../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const GenerateCode_1 = __importDefault(require("../../utils/GenerateCode"));
const FacebookAccessTokenAuth_1 = __importDefault(require("../../utils/FacebookAccessTokenAuth"));
const GoogleAccessTokenAuth_1 = __importDefault(require("../../utils/GoogleAccessTokenAuth"));
require("dotenv").config();
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, phoneNumber, password } = req.body;
    const isExist = yield User_1.default.findOne({ phoneNumber });
    if (isExist)
        return res.status(409).json({ status: 409, msg: "phone number is used" });
    const code = (0, GenerateCode_1.default)();
    let newUser = yield User_1.default.create({ fullName, phoneNumber, password, code });
    let tokenSecret = process.env.USER_TOKEN_SECRET;
    let token = jsonwebtoken_1.default.sign({ userId: newUser._id, phoneNumber: newUser.phoneNumber, email: newUser.email }, tokenSecret, { expiresIn: "7 days" });
    //send sms to user
    return res.status(201).json({ status: 201, msg: "user register successfully", token });
});
exports.register = register;
const googleAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken } = req.body;
    try {
        const googaData = yield (0, GoogleAccessTokenAuth_1.default)(accessToken);
        const isExist = yield User_1.default.findOne({ email: googaData.email });
        if (isExist) {
            let tokenSecret = process.env.USER_TOKEN_SECRET;
            let token = jsonwebtoken_1.default.sign({ userId: isExist._id, email: isExist.email }, tokenSecret, { expiresIn: "7 days" });
            return res.status(200).json({ status: 200, msg: "login success", data: { token, user: isExist } });
        }
        let newUser = yield User_1.default.create({ fullName: googaData.name, email: googaData.email, imageUrl: googaData.picture });
        let tokenSecret = process.env.USER_TOKEN_SECRET;
        let token = jsonwebtoken_1.default.sign({ userId: newUser._id, phoneNumber: newUser.phoneNumber, email: newUser.email }, tokenSecret, { expiresIn: "7 days" });
        return res.status(201).json({ status: 201, msg: "user registered successfully", data: { token, user: newUser } });
    }
    catch (error) {
        console.log(error.message);
        return res.status(400).json({ status: 400, msg: error });
    }
});
exports.googleAuth = googleAuth;
const facebookAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { accessToken } = req.body;
    try {
        const facebookData = yield (0, FacebookAccessTokenAuth_1.default)(accessToken);
        const isExist = yield User_1.default.findOne({ email: facebookData.email });
        if (isExist) {
            let tokenSecret = process.env.USER_TOKEN_SECRET;
            let token = jsonwebtoken_1.default.sign({ userId: isExist._id, email: isExist.email }, tokenSecret, { expiresIn: "7 days" });
            return res.status(200).json({ status: 200, msg: "login success", data: { token, user: isExist } });
        }
        let newUser = yield User_1.default.create({ fullName: facebookData.name, email: facebookData.email, imageUrl: (_b = (_a = facebookData.picture) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.url });
        let tokenSecret = process.env.USER_TOKEN_SECRET;
        let token = jsonwebtoken_1.default.sign({ userId: newUser._id, phoneNumber: newUser.phoneNumber, email: newUser.email }, tokenSecret, { expiresIn: "7 days" });
        return res.status(201).json({ status: 201, msg: "user registered successfully", data: { token, user: newUser } });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ status: 400, msg: error });
    }
});
exports.facebookAuth = facebookAuth;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password, registrationToken } = req.body;
    const user = yield User_1.default.findOne({ phoneNumber });
    if (!user)
        return res.status(400).json({ status: 400, msg: "user not signed up" });
    if (!user.isVerify)
        return res.status(403).json({ status: 403, msg: "user account not verified" });
    let comparePassword = yield user.comaprePassword(password);
    if (!comparePassword)
        return res.status(400).json({ status: 400, msg: "wrong password" });
    let tokenSecret = process.env.USER_TOKEN_SECRET;
    let token = jsonwebtoken_1.default.sign({ userId: user._id, phoneNumber: user.phoneNumber, email: user.email }, tokenSecret, { expiresIn: "7 days" });
    user.registrationTokens = [...user.registrationTokens, registrationToken];
    yield user.save();
    return res.status(200).json({
        status: 200, data: {
            user, token
        }
    });
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { registrationToken } = req.body;
    let user = req.user;
    user.registrationTokens = user.registrationTokens.filter(x => x != registrationToken);
    yield user.save();
    return res.status(200).json({
        status: 200, msg: "user log out"
    });
});
exports.logout = logout;
const forgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.body;
    const user = yield User_1.default.findOne({ phoneNumber });
    if (!user)
        return res.status(400).json({ status: 400, msg: "user not signed up" });
    const code = (0, GenerateCode_1.default)();
    //send code
    user.code = code;
    yield user.save();
    return res.status(200).json({ status: 200, msg: "code is send to your phone number" });
});
exports.forgetPassword = forgetPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, code, newPassword } = req.body;
    const user = yield User_1.default.findOne({ phoneNumber });
    if (!user)
        return res.status(400).json({ status: 400, msg: "user not signed up" });
    if (!user.code) {
        return res.status(400).json({ status: 400, msg: "try to resend the code" });
    }
    if (code == user.code) {
        user.password = newPassword;
        user.code = "";
        yield user.save();
        return res.status(200).json({ status: 200, msg: "reset password success" });
    }
    return res.status(400).json({ status: 400, msg: "code you entered is wrong" });
});
exports.resetPassword = resetPassword;
const verifyCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, code } = req.body;
    const user = yield User_1.default.findOne({ phoneNumber });
    if (!user)
        return res.status(400).json({ status: 400, msg: "user not signed up" });
    if (!user.code) {
        return res.status(400).json({ status: 400, msg: "try to resend the code" });
    }
    if (code == user.code) {
        user.isVerify = true;
        user.code = "";
        yield user.save();
        return res.status(200).json({ status: 200, msg: "code verified" });
    }
    return res.status(400).json({ status: 400, msg: "code you entered is wrong" });
});
exports.verifyCode = verifyCode;
