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
exports.defaultAdmin = exports.deleteStaffMember = exports.getStaffMemeberById = exports.getStaffMemebers = exports.updateStaff = exports.addStaff = void 0;
const Staff_1 = __importDefault(require("../../../../models/Staff"));
const addStaff = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, cardNumber, phoneNumber, email, role, staffMemberId, password } = req.body;
    const isPhoneNumberExist = yield Staff_1.default.findOne({ phoneNumber });
    if (isPhoneNumberExist)
        return res.status(409).json({ status: 409, msg: "phone number is used before" });
    const isCardNumberExist = yield Staff_1.default.findOne({ cardNumber });
    if (isCardNumberExist)
        return res.status(409).json({ status: 409, msg: "card number is used before" });
    const newStaff = yield Staff_1.default.create({ name, password, cardNumber, phoneNumber, email, role, staffMemberId });
    return res.status(201).json({
        status: 201, msg: "staff member added successfully", data: {
            staffMember: newStaff
        }
    });
});
exports.addStaff = addStaff;
const updateStaff = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const memberId = req.params.id;
    const { name, cardNumber, phoneNumber, email, role, staffMemberId, password } = req.body;
    let staffMember = yield Staff_1.default.findById(memberId);
    const isPhoneNumberExist = yield Staff_1.default.findOne({ phoneNumber });
    if (isPhoneNumberExist && String(staffMember._id) !== String(isPhoneNumberExist._id))
        return res.status(409).json({ status: 409, msg: "phone number is used before" });
    const isCardNumberExist = yield Staff_1.default.findOne({ cardNumber });
    if (isCardNumberExist && String(staffMember._id) !== String(isCardNumberExist._id))
        return res.status(409).json({ status: 409, msg: "card number is used before" });
    const newStaff = yield Staff_1.default.findById(memberId);
    newStaff.name = name;
    newStaff.password = password;
    newStaff.cardNumber = cardNumber;
    newStaff.phoneNumber = phoneNumber;
    newStaff.email = email;
    newStaff.staffMemberId = staffMemberId;
    newStaff.role = role;
    yield newStaff.save();
    console.log("update staff member");
    return res.status(200).json({
        status: 200, msg: "staff member updated successfully", data: {
            staffMember: newStaff
        }
    });
});
exports.updateStaff = updateStaff;
const getStaffMemebers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const staffMembers = yield Staff_1.default.find({});
    return res.status(200).json({ status: 200, data: { staffMembers } });
});
exports.getStaffMemebers = getStaffMemebers;
const getStaffMemeberById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const staffId = req.params.id;
    const staffMember = yield Staff_1.default.findById(staffId);
    return res.status(200).json({ status: 200, data: { staffMember } });
});
exports.getStaffMemeberById = getStaffMemeberById;
const deleteStaffMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const staffId = req.params.id;
    const staffMember = yield Staff_1.default.findByIdAndDelete(staffId);
    return res.status(200).json({ status: 200, msg: "staff member deleted sucessfully" });
});
exports.deleteStaffMember = deleteStaffMember;
const defaultAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newStaff = yield Staff_1.default.create({ name: "ibrahim", password: "123456789", cardNumber: 123456789, phoneNumber: "0597801611", email: "ibrahim@gmail.com", role: "admin", staffMemberId: "748596" });
    return res.status(201).json({
        status: 201, msg: "staff member added successfully", data: {
            staffMember: newStaff
        }
    });
});
exports.defaultAdmin = defaultAdmin;
