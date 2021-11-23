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
exports.defaultAdmin = exports.setWorkHoures = exports.getWorkHoures = exports.deleteStaffMember = exports.getStaffMemeberById = exports.getStaffMemebers = exports.updateStaff = exports.addStaff = void 0;
const Staff_1 = __importDefault(require("../../../../models/Staff"));
const mongoose_1 = __importDefault(require("mongoose"));
const addStaff = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, cardNumber, phoneNumber, email, role, staffMemberId } = req.body;
    const isPhoneNumberExist = yield Staff_1.default.findOne({ phoneNumber });
    if (isPhoneNumberExist)
        return res.status(409).json({ status: 409, msg: "phone number is used before" });
    const isCardNumberExist = yield Staff_1.default.findOne({ cardNumber });
    if (isCardNumberExist)
        return res.status(409).json({ status: 409, msg: "card number is used before" });
    const newStaff = yield Staff_1.default.create({ name, cardNumber, phoneNumber, email, role, staffMemberId });
    return res.status(201).json({
        status: 201, msg: "staff member added successfully", data: {
            staffMember: newStaff
        }
    });
});
exports.addStaff = addStaff;
const updateStaff = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const memberId = req.params.id;
    const { name, cardNumber, phoneNumber, email, role, staffMemberId } = req.body;
    let staffMember = yield Staff_1.default.findById(memberId);
    const isPhoneNumberExist = yield Staff_1.default.findOne({ phoneNumber });
    if (isPhoneNumberExist && String(staffMember._id) !== String(isPhoneNumberExist._id))
        return res.status(409).json({ status: 409, msg: "phone number is used before" });
    const isCardNumberExist = yield Staff_1.default.findOne({ cardNumber });
    if (isCardNumberExist && String(staffMember._id) !== String(isCardNumberExist._id))
        return res.status(409).json({ status: 409, msg: "card number is used before" });
    const newStaff = yield Staff_1.default.findById(memberId);
    newStaff.name = name;
    newStaff.cardNumber = cardNumber;
    newStaff.phoneNumber = phoneNumber;
    newStaff.email = email;
    newStaff.staffMemberId = staffMemberId;
    newStaff.role = role;
    yield newStaff.save();
    return res.status(200).json({
        status: 200, msg: "staff member updated successfully", data: {
            staffMember: newStaff
        }
    });
});
exports.updateStaff = updateStaff;
const getStaffMemebers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { text, cardNumber, phoneNumber } = req.query;
    let query = {};
    if (text) {
        query = Object.assign(Object.assign({}, query), { $or: [{ name: { $regex: text, $options: "i" } }, { email: { $regex: text, $options: "i" } }] });
    }
    ;
    if (cardNumber)
        query.cardNumber = cardNumber;
    if (phoneNumber)
        query.phoneNumber = phoneNumber;
    const staffMembers = yield Staff_1.default.find(query);
    return res.status(200).json({ status: 200, data: { staffMembers } });
});
exports.getStaffMemebers = getStaffMemebers;
const getStaffMemeberById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const staffId = req.params.id;
    if (!mongoose_1.default.isValidObjectId(staffId))
        return res.status(200).json({ status: 200, data: { staffMember: null } });
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
const getWorkHoures = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    if (!mongoose_1.default.isValidObjectId(id))
        return res.status(200).json({ status: 200, data: { staffMember: null } });
    let staff = yield Staff_1.default.findById(id);
    return res.status(200).json({ status: 200, data: { workHoures: staff ? staff.workHoures : null } });
});
exports.getWorkHoures = getWorkHoures;
const setWorkHoures = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let { saturday, sunday, monday, tuesday, wednesday, thursday, friday } = req.body;
    if (!mongoose_1.default.isValidObjectId(id))
        return res.status(200).json({ status: 200, data: { staffMember: null } });
    let staff = yield Staff_1.default.findById(id);
    if (!staff)
        return res.status(400).json({ status: 400, msg: "staff memeber not found" });
    let workHoures = staff === null || staff === void 0 ? void 0 : staff.workHoures;
    workHoures.saturday = { isActive: saturday.isActive, from: saturday.from, to: saturday.to };
    workHoures.sunday = { isActive: sunday.isActive, from: sunday.from, to: sunday.to };
    workHoures.monday = { isActive: monday.isActive, from: monday.from, to: monday.to };
    workHoures.tuesday = { isActive: tuesday.isActive, from: tuesday.from, to: tuesday.to };
    workHoures.wednesday = { isActive: wednesday.isActive, from: wednesday.from, to: wednesday.to };
    workHoures.thursday = { isActive: thursday.isActive, from: thursday.from, to: thursday.to };
    workHoures.friday = { isActive: friday.isActive, from: friday.from, to: friday.to };
    staff.workHoures = workHoures;
    yield (staff === null || staff === void 0 ? void 0 : staff.save());
    return res.status(200).json({ status: 200, data: { workHoures: staff.workHoures } });
});
exports.setWorkHoures = setWorkHoures;
const defaultAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newStaff = yield Staff_1.default.create({ name: "ibrahim", password: "123456789", cardNumber: 123456789, phoneNumber: "0597801611", email: "ibrahim@gmail.com", role: "admin", staffMemberId: "748596" });
    return res.status(201).json({
        status: 201, msg: "staff member added successfully", data: {
            staffMember: newStaff
        }
    });
});
exports.defaultAdmin = defaultAdmin;
