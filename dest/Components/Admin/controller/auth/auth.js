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
exports.logout = exports.verifyCode = exports.login = void 0;
const Staff_1 = __importDefault(require("../../../../models/Staff"));
const HealthCare_1 = __importDefault(require("../../../../models/HealthCare"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const GenerateCode_1 = __importDefault(require("../../../utils/GenerateCode"));
dotenv_1.default.config();
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.body;
    const staffMember = yield Staff_1.default.findOne({ phoneNumber });
    if (!staffMember)
        return res.status(400).json({ status: 400, msg: "user not found" });
    let code = (0, GenerateCode_1.default)();
    staffMember.code = code;
    yield staffMember.save();
    //send code
    return res.status(200).json({ status: 200, msg: "code sent to user phone number" });
});
exports.login = login;
const verifyCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, code, registrationToken } = req.body;
        const staffMember = yield Staff_1.default.findOne({ phoneNumber });
        if (!staffMember)
            return res.status(400).json({ status: 400, msg: `staff member with phonenumber ${phoneNumber} not exist` });
        let isCodeEqual = staffMember.code === code;
        let healthCares = yield HealthCare_1.default.find({});
        if (isCodeEqual) {
            const staffMembersToken = process.env.STAF_TOKEN_SECRET;
            let token = jsonwebtoken_1.default.sign({ staffId: staffMember._id, phoneNumber: staffMember.phoneNumber }, staffMembersToken, { expiresIn: "7 days" });
            staffMember.code = '';
            if (registrationToken)
                staffMember.registrationTokens.push(registrationToken);
            yield staffMember.save();
            return res.status(200).json({ status: 200, data: { staffMember: staffMember, healthCare: healthCares[0], token } });
        }
        return res.status(400).json({ status: 400, msg: "code is wrong" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, msg: error.message });
    }
});
exports.verifyCode = verifyCode;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { registrationToken } = req.body;
    let staffMember = req.staff;
    staffMember.registrationTokens = staffMember.registrationTokens.filter(x => x !== registrationToken);
    yield staffMember.save();
    return res.status(200).json({ status: 200, msg: "logout successfully" });
});
exports.logout = logout;
