"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const staffSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    cardNumber: { type: String, required: true },
    staffMemberId: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    muteChat: { type: Boolean },
    allowReceivingMessagesOutOfWorksHours: { type: Boolean },
    newOrdersNotifications: { type: Boolean },
    canceledOrdersNotifications: { type: Boolean },
    newReviewsNotifications: { type: Boolean },
    itemsAlmostOutOfStockNotification: { type: Boolean },
}, { timestamps: true });
staffSchema.pre("validate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let staff = this;
        if (staff.isModified("password")) {
            let hashPassword = yield bcrypt_1.default.hash(staff.password, 12);
            staff.password = hashPassword;
        }
        next();
    });
});
staffSchema.methods.comaprePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        let staff = this;
        let isEqual = yield bcrypt_1.default.compare(password, staff.password);
        return isEqual;
    });
};
const Staff = mongoose_1.default.model("staff", staffSchema);
exports.default = Staff;
