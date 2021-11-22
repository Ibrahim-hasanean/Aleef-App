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
const userSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, default: "" },
    password: { type: String, required: true },
    code: { type: String },
    language: { type: String },
    isVerify: { type: Boolean, default: false },
    socialMediaLoggedIn: { type: Boolean },
    isSuspend: { type: Boolean, default: false },
    imageUrl: { type: String },
    muteAllNotification: { type: Boolean, default: false },
    muteChat: { type: Boolean, default: false },
    vaccinationReminder: { type: Boolean, default: true },
    medacinReminder: { type: Boolean, default: true },
    appointmentReminder: { type: Boolean, default: true },
    payments: { type: mongoose_1.default.Types.ObjectId, ref: "payments" },
    pets: [{ type: mongoose_1.default.Types.ObjectId, ref: "pets" }],
    cardsInfo: [{ type: mongoose_1.default.Types.ObjectId, ref: "cardInfo" }],
    orders: { type: mongoose_1.default.Types.ObjectId, ref: "orders" },
    wishList: [{ type: mongoose_1.default.Types.ObjectId, ref: "items" }],
    addresses: [{ type: mongoose_1.default.Types.ObjectId, ref: "addresses" }],
    itemList: [{ type: mongoose_1.default.Types.ObjectId, ref: "orderItems" }],
}, { timestamps: true });
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = this;
        if (user.isModified("password")) {
            let hashPassword = yield bcrypt_1.default.hash(user.password, 12);
            user.password = hashPassword;
        }
        next();
    });
});
userSchema.methods.comaprePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = this;
        let isEqual = yield bcrypt_1.default.compare(password, user.password);
        return isEqual;
    });
};
const User = mongoose_1.default.model("users", userSchema);
exports.default = User;
