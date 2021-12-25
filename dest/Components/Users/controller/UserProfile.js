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
exports.getProfile = exports.deleteAddress = exports.getAddresses = exports.addAddress = exports.notificationSettings = exports.changePassword = exports.updateProfile = void 0;
const User_1 = __importDefault(require("../../../models/User"));
const GenerateCode_1 = __importDefault(require("../../utils/GenerateCode"));
const Address_1 = __importDefault(require("../../../models/Address"));
const uploadFileToFirebase_1 = __importDefault(require("../../utils/uploadFileToFirebase"));
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, phoneNumber, email } = req.body;
    let image = req.file;
    let imageUrl;
    if (image)
        imageUrl = yield (0, uploadFileToFirebase_1.default)(image);
    const user = req.user;
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
    if (phoneNumber !== user.phoneNumber) {
        const code = (0, GenerateCode_1.default)();
        user.code = code;
        user.isVerify = false;
    }
    user.phoneNumber = phoneNumber;
    user.imageUrl = imageUrl ? imageUrl : user.imageUrl;
    yield user.save();
    res.status(200).json({
        status: 200, data: {
            user
        }
    });
});
exports.updateProfile = updateProfile;
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    const comparePassword = yield user.comaprePassword(currentPassword);
    if (!comparePassword) {
        return res.status(400).json({ status: 400, msg: "current password is wrong" });
    }
    user.password = newPassword;
    yield user.save();
    return res.status(200).json({ status: 200, msg: "password updated successfully" });
});
exports.changePassword = changePassword;
const notificationSettings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { muteAllNotification, muteChat, vaccinationReminder, appointmentReminder, medacinReminder } = req.body;
    const user = req.user;
    if (typeof muteAllNotification == 'boolean')
        user.muteAllNotification = muteAllNotification;
    if (typeof muteChat == 'boolean')
        user.muteChat = muteChat;
    if (typeof vaccinationReminder == 'boolean')
        user.vaccinationReminder = vaccinationReminder;
    if (typeof appointmentReminder == 'boolean')
        user.appointmentReminder = appointmentReminder;
    if (typeof medacinReminder == 'boolean')
        user.medacinReminder = medacinReminder;
    yield user.save();
    return res.status(200).json({ status: 200, msg: "notification settings updated  successfully" });
});
exports.notificationSettings = notificationSettings;
const addAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { city, street, detailes } = req.body;
    const user = req.user;
    const address = yield Address_1.default.create({
        city, street, detailes
    });
    user.addresses.push(address._id);
    yield user.save();
    return res.status(201).json({ status: 201, msg: "address added successfully" });
});
exports.addAddress = addAddress;
const getAddresses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield req.user.populate("addresses");
    return res.status(200).json({
        status: 200, data: {
            addresses: user.addresses
        }
    });
});
exports.getAddresses = getAddresses;
const deleteAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield req.user.populate("addresses");
    let addressId = req.params.id;
    yield Address_1.default.findByIdAndDelete(addressId);
    let addresses = user.addresses;
    user.addresses = addresses.filter((x) => String(x) !== addressId);
    // user.addresses = [...addresses];
    yield user.save();
    return res.status(200).json({
        status: 200, data: {
            addresses: user.addresses
        }
    });
});
exports.deleteAddress = deleteAddress;
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    return res.status(200).json({ status: 200, data: { user } });
});
exports.getProfile = getProfile;
// export const setLanguage = async (req: Request, res: Response, next: NextFunction) => {
//     let user = req.user;
//     req.headers.
//     let {} = req.body;
// }
