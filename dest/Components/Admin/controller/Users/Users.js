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
exports.updateUser = exports.addNewUser = exports.suspendUser = exports.getUserById = exports.getUsers = void 0;
const User_1 = __importDefault(require("../../../../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const uploadFileToFirebase_1 = __importDefault(require("../../../utils/uploadFileToFirebase"));
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { page, limit, text, phoneNumber } = req.query;
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let query = {};
    if (text)
        query.fullName = { $regex: text, $options: "i" };
    if (phoneNumber)
        query.phoneNumber = phoneNumber;
    const users = yield User_1.default.find(query)
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(limitNumber)
        .select(['fullName', 'phoneNumber', 'email', 'isSuspend'])
        .populate({ path: "pets", select: ['name', 'age', 'serialNumber', 'imageUrl', 'imageUrl'] });
    return res.status(200).json({ status: 200, data: { users } });
});
exports.getUsers = getUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(200).json({ status: 200, data: { user: null } });
    }
    let user = yield User_1.default.findById(id)
        .select(['fullName', 'phoneNumber', 'email', 'isSuspend'])
        .populate({ path: "pets", select: ['name', 'age', 'serialNumber', 'imageUrl', 'imageUrl'] });
    return res.status(200).json({ status: 200, data: { user } });
});
exports.getUserById = getUserById;
const suspendUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(400).json({ status: 400, msg: "use not found" });
    }
    let user = yield User_1.default.findById(id);
    if (!user)
        return res.status(400).json({ status: 400, msg: "use not found" });
    user.isSuspend = !user.isSuspend;
    yield user.save();
    return res.status(200).json({ status: 200, msg: "toggle suspended successfully" });
});
exports.suspendUser = suspendUser;
const addNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { fullName, email, phoneNumber, password } = req.body;
    let image = req.file;
    let imageUrl = image ? yield (0, uploadFileToFirebase_1.default)(image) : "";
    const isPhoneNumberExist = yield User_1.default.findOne({ phoneNumber });
    if (isPhoneNumberExist)
        return res.status(409).json({ status: 409, msg: "phone number is used by other user" });
    if (email) {
        const isEmailExist = yield User_1.default.findOne({ email });
        if (isEmailExist)
            return res.status(409).json({ status: 409, msg: "email is used by other user" });
    }
    let newUser = yield User_1.default.create({ fullName, phoneNumber, password, email, imageUrl });
    return res.status(201).json({ status: 201, msg: "user created successfully", data: { user: newUser } });
});
exports.addNewUser = addNewUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, phoneNumber, email } = req.body;
    let image = req.file;
    let imageUrl;
    if (image)
        imageUrl = yield (0, uploadFileToFirebase_1.default)(image);
    let userId = req.params.id;
    if (!mongoose_1.default.isValidObjectId(userId)) {
        return res.status(400).json({ status: 400, msg: "user not found" });
    }
    const user = yield User_1.default.findById(userId);
    if (!user)
        return res.status(400).json({ status: 400, msg: "user not found" });
    const isPhoneNumberExist = yield User_1.default.findOne({ phoneNumber });
    if (isPhoneNumberExist && (isPhoneNumberExist === null || isPhoneNumberExist === void 0 ? void 0 : isPhoneNumberExist._id.toString()) !== user._id.toString()) {
        return res.status(409).json({ status: 409, msg: "phone number is used by other user" });
    }
    const isEmailExist = yield User_1.default.findOne({ email });
    if (isEmailExist && (isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist._id.toString()) !== user._id.toString()) {
        return res.status(409).json({ status: 409, msg: "email is used by other user" });
    }
    user.fullName = fullName;
    user.email = email;
    user.imageUrl = imageUrl ? imageUrl : user.imageUrl;
    user.phoneNumber = phoneNumber;
    yield user.save();
    res.status(200).json({
        status: 200, data: {
            user
        }
    });
});
exports.updateUser = updateUser;
