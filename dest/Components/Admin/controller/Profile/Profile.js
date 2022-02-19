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
exports.getProfile = exports.updateProfile = void 0;
const Staff_1 = __importDefault(require("../../../../models/Staff"));
const uploadFileToFirebase_1 = __importDefault(require("../../../utils/uploadFileToFirebase"));
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, email, phoneNumber, licenseNumber, cardNumber, staffMemberId
    // muteChat,
    // allowReceivingMessagesOutOfWorksHours,
    // newOrdersNotifications,
    // canceledOrdersNotifications,
    // newReviewsNotifications,
    // itemsAlmostOutOfStockNotification
     } = req.body;
    let staffMember = req.staff;
    let image = req.file;
    let imageUrl;
    if (image)
        imageUrl = yield (0, uploadFileToFirebase_1.default)(image);
    let isPhoneNumberExist = yield Staff_1.default.findOne({ phoneNumber });
    if (isPhoneNumberExist && String(isPhoneNumberExist === null || isPhoneNumberExist === void 0 ? void 0 : isPhoneNumberExist._id) !== String(staffMember._id)) {
        return res.status(409).json({ status: 409, msg: "phone number is used by other staff member" });
    }
    let iEmailExist = yield Staff_1.default.findOne({ email });
    if (iEmailExist && String(iEmailExist === null || iEmailExist === void 0 ? void 0 : iEmailExist._id) !== String(staffMember._id)) {
        return res.status(409).json({ status: 409, msg: "email is used by other staff member" });
    }
    staffMember.phoneNumber = phoneNumber;
    staffMember.email = email;
    staffMember.name = name;
    staffMember.licenseNumber = licenseNumber;
    staffMember.cardNumber = cardNumber;
    staffMember.staffMemberId = staffMemberId;
    staffMember.imageUrl = imageUrl ? imageUrl : staffMember.imageUrl;
    // staffMember.muteChat = muteChat;
    // staffMember.allowReceivingMessagesOutOfWorksHours = allowReceivingMessagesOutOfWorksHours;
    // staffMember.newOrdersNotifications = newOrdersNotifications;
    // staffMember.canceledOrdersNotifications = canceledOrdersNotifications;
    // staffMember.newReviewsNotifications = newReviewsNotifications;
    // staffMember.itemsAlmostOutOfStockNotification = itemsAlmostOutOfStockNotification;
    yield staffMember.save();
    return res.status(200).json({ status: 200, msg: "profile updated successfully" });
});
exports.updateProfile = updateProfile;
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let staffMember = req.staff;
    return res.status(200).json({
        status: 200, data: {
            staffMember
        }
    });
});
exports.getProfile = getProfile;
